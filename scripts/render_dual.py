#!/usr/bin/env python3
"""
Dual-Format Video Renderer (9:16 Shorts & 16:9 Long-Form)
Renders identical duration, voice, and 3D animations into both vertical and horizontal formats.

Usage:
  # Render default Remotion 3D scenes in both formats:
  python scripts/render_dual.py

  # Render a specific project:
  python scripts/render_dual.py dog-who-never-forgot
  python scripts/render_dual.py projects/dog-who-never-forgot --scene walking-road

  # Render only one aspect ratio:
  python scripts/render_dual.py dog-who-never-forgot --format 9:16
  python scripts/render_dual.py dog-who-never-forgot --format 16:9

  # Specify scene type ('walking-road', 'explainer-3d', 'mystery-3d'):
  python scripts/render_dual.py --scene explainer-3d
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def get_project_dir(proj_arg: str) -> Path:
    p = Path(proj_arg)
    if p.is_dir():
        return p.resolve()
    candidate = ROOT / "projects" / proj_arg
    if candidate.is_dir():
        return candidate.resolve()
    candidate2 = ROOT / proj_arg
    if candidate2.is_dir():
        return candidate2.resolve()
    sys.exit(f"Error: Project directory '{proj_arg}' not found.")


def find_audio_file(proj_dir: Path) -> Path | None:
    data_dir = proj_dir / "data"
    for name in ["mix.wav", "narration.wav", "voice.wav", "voice.mp3", "mix.mp3"]:
        target = data_dir / name
        if target.is_file():
            return target
    return None


def run_remotion_render(
    comp_id: str,
    output_path: Path,
    props_file: Path | None = None,
    fps: int = 30,
    frames: str | None = None,
) -> bool:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "npx.cmd" if os.name == "nt" else "npx",
        "remotion",
        "render",
        "remotion/index.ts",
        comp_id,
        str(output_path),
        f"--fps={fps}",
    ]
    if frames:
        cmd.append(f"--frames={frames}")
    if props_file and props_file.is_file():
        cmd.append(f"--props={str(props_file)}")

    print(f"🎬 Rendering [{comp_id}] -> {output_path.name}...")
    res = subprocess.run(cmd, cwd=str(ROOT))
    return res.returncode == 0


def main():
    parser = argparse.ArgumentParser(
        description="Dual-Format Renderer: Render both 9:16 Shorts and 16:9 Long-Form videos."
    )
    parser.add_argument(
        "project",
        nargs="?",
        default=None,
        help="Project folder name in projects/ or path to project",
    )
    parser.add_argument(
        "--format",
        choices=["both", "9:16", "16:9", "vertical", "horizontal"],
        default="both",
        help="Which aspect ratio format to render (default: both)",
    )
    parser.add_argument(
        "--scene",
        choices=["walking-road", "explainer-3d", "mystery-3d"],
        default="walking-road",
        help="3D scene style to use (default: walking-road)",
    )
    parser.add_argument(
        "--fps",
        type=int,
        default=30,
        help="Frame rate (default: 30)",
    )
    parser.add_argument(
        "--frames",
        default=None,
        help="Frame range to render (e.g. 0-60), omit for full video",
    )
    parser.add_argument(
        "--outdir",
        default=None,
        help="Custom output directory for rendered MP4s",
    )
    args = parser.parse_args()

    # Determine render targets
    render_vertical = args.format in ["both", "9:16", "vertical"]
    render_horizontal = args.format in ["both", "16:9", "horizontal"]

    temp_props_file = None
    proj_name = "remotion_3d"

    if args.project:
        proj_dir = get_project_dir(args.project)
        proj_name = proj_dir.name
        words_file = proj_dir / "data" / "words.json"
        script_file = proj_dir / "script.json"
        audio_file = find_audio_file(proj_dir)

        words = []
        if words_file.is_file():
            try:
                with open(words_file, "r", encoding="utf-8") as f:
                    words = json.load(f)
            except Exception as e:
                print(f"Warning: Could not read {words_file}: {e}")

        title = proj_name.replace("-", " ").title()
        if script_file.is_file():
            try:
                with open(script_file, "r", encoding="utf-8") as f:
                    sdata = json.load(f)
                    title = sdata.get("title", title)
            except Exception:
                pass

        # Prepare audio file for Remotion if available (copy or staticFile)
        audio_src = None
        if audio_file:
            # We can point to the absolute path for Remotion
            audio_src = str(audio_file.resolve()).replace("\\", "/")

        props = {
            "title": title,
            "words": words,
            "sceneType": args.scene,
        }
        if audio_src:
            props["audioSrc"] = audio_src

        # Write props to temporary JSON file
        fd, temp_props_path = tempfile.mkstemp(suffix=".json", prefix="remotion_props_")
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(props, f, indent=2)
        temp_props_file = Path(temp_props_path)

        out_dir = Path(args.outdir) if args.outdir else proj_dir / "renders"
    else:
        out_dir = Path(args.outdir) if args.outdir else ROOT / "renders"

    out_dir.mkdir(parents=True, exist_ok=True)

    success_v = True
    success_h = True

    try:
        # 1. Render Vertical 9:16 (Shorts / Reels / TikTok)
        if render_vertical:
            v_output = out_dir / f"{proj_name}_9x16_short.mp4"
            success_v = run_remotion_render(
                comp_id="Short-9x16",
                output_path=v_output,
                props_file=temp_props_file,
                fps=args.fps,
                frames=args.frames,
            )
            if success_v:
                size_mb = v_output.stat().st_size / (1024 * 1024)
                print(f"✅ Vertical Short (9:16) ready: {v_output} ({size_mb:.2f} MB)")
            else:
                print(f"❌ Failed to render vertical short.")

        # 2. Render Horizontal 16:9 (Standard YouTube / Long-form)
        if render_horizontal:
            h_output = out_dir / f"{proj_name}_16x9_long.mp4"
            success_h = run_remotion_render(
                comp_id="Video-16x9",
                output_path=h_output,
                props_file=temp_props_file,
                fps=args.fps,
                frames=args.frames,
            )
            if success_h:
                size_mb = h_output.stat().st_size / (1024 * 1024)
                print(f"✅ Horizontal Video (16:9) ready: {h_output} ({size_mb:.2f} MB)")
            else:
                print(f"❌ Failed to render horizontal video.")

    finally:
        if temp_props_file and temp_props_file.is_file():
            try:
                temp_props_file.unlink()
            except Exception:
                pass

    if success_v and success_h:
        print("\n🎉 Dual-format rendering completed successfully!")
        print(f"📁 Check your renders directory: {out_dir}")
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
