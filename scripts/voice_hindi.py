"""Generate Hindi audio using edge-tts (hi-IN-MadhurNeural or hi-IN-SwaraNeural).
Produces data/narration.wav (24 kHz mono) and data/lines.json.

Usage:
  bash scripts/py scripts/voice_hindi.py projects/dog-who-never-forgot
"""
import argparse, asyncio, json, os, re, subprocess, tempfile
from pathlib import Path
import numpy as np
from scipy.io import wavfile
import edge_tts

DEFAULT_VOICE = "hi-IN-MadhurNeural"
SR = 24000

def trim(x, thr=0.008):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a = max(0, idx[0] - int(0.01 * SR))
    b = min(len(x), idx[-1] + int(0.03 * SR))
    return x[a:b]

async def synth_line(text, voice, rate_str):
    comm = edge_tts.Communicate(text, voice, rate=rate_str)
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tf:
        tmp_name = tf.name
    try:
        await comm.save(tmp_name)
        # Decode to 24000 Hz 1-channel raw PCM float32 with ffmpeg
        proc = subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-i", tmp_name,
            "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"
        ], capture_output=True, check=True)
        samples = np.frombuffer(proc.stdout, dtype=np.float32)
        return trim(samples)
    finally:
        if os.path.exists(tmp_name):
            os.remove(tmp_name)

async def run(project_dir, voice_override=None, speed=1.0):
    P = Path(project_dir)
    S = json.loads((P / "script.json").read_text(encoding="utf-8"))
    voice = voice_override or S.get("voice_hindi", DEFAULT_VOICE)
    rate_pct = int((speed - 1.0) * 100)
    rate_str = f"{'+' if rate_pct >= 0 else ''}{rate_pct}%"

    print(f"Synthesizing Hindi audio with voice '{voice}' (rate {rate_str})...")

    lead_s = float(S.get("lead", 0.4))
    lead = np.zeros(int(lead_s * SR), dtype=np.float32)
    out_chunks = [lead]
    cur_t = lead_s
    lines_info = []

    for i, ln in enumerate(S["lines"]):
        text = ln.get("voice_text") or ln["text"]
        print(f"[{i:2d}] {text}")
        audio = await synth_line(text, voice, rate_str)
        dur = len(audio) / SR
        start_t = cur_t
        end_t = cur_t + dur
        lines_info.append({
            "i": i,
            "text": ln["text"],
            "start": round(start_t, 3),
            "end": round(end_t, 3)
        })

        gap_s = float(ln.get("gap", S.get("gap", 0.25)))
        gap = np.zeros(int(gap_s * SR), dtype=np.float32)

        out_chunks.append(audio)
        out_chunks.append(gap)
        cur_t += dur + gap_s

    outro_s = float(S.get("outro", 1.2))
    outro = np.zeros(int(outro_s * SR), dtype=np.float32)
    out_chunks.append(outro)

    y = np.concatenate(out_chunks)
    max_val = np.abs(y).max()
    if max_val > 0:
        y = y / max_val * 0.92

    (P / "data").mkdir(exist_ok=True)
    wav_path = P / "data" / "narration.wav"
    wavfile.write(wav_path, SR, (y * 32767).astype(np.int16))

    total_dur = len(y) / SR
    lines_json_path = P / "data" / "lines.json"
    lines_json_path.write_text(json.dumps({
        "duration": round(total_dur, 3),
        "voice": voice,
        "speed": speed,
        "lines": lines_info
    }, indent=2, ensure_ascii=False), encoding="utf-8")

    # Generate words.json and words.txt using inline distribution
    words = []
    norm = lambda w: re.sub(r'[^a-zA-Z0-9]+', '', w.lower())
    for i, ln in enumerate(S["lines"]):
        raw_words = [w for w in ln["text"].split() if norm(w) or w.strip()]
        lo = lines_info[i]["start"]
        hi = lines_info[i]["end"]
        if not raw_words:
            continue
        tot_chars = sum(max(1, len(w)) for w in raw_words)
        cur = lo
        for w in raw_words:
            d = (hi - lo) * (max(1, len(w)) / tot_chars)
            words.append({
                "w": w,
                "line": i,
                "s": round(cur, 3),
                "e": round(cur + d * 0.9, 3)
            })
            cur += d

    (P / "data" / "words.json").write_text(json.dumps(words, indent=2, ensure_ascii=False), encoding="utf-8")
    (P / "data" / "words.txt").write_text(
        "\n".join(f"{w['s']:7.2f} {w['e']:7.2f}  L{w['line']:<2d} {w['w']}" for w in words),
        encoding="utf-8"
    )

    print(f"\nGenerated {wav_path} ({total_dur:.2f} s)")
    print(f"Generated {lines_json_path} ({len(lines_info)} lines)")
    print(f"Generated data/words.json ({len(words)} words)")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("project")
    parser.add_argument("--voice")
    parser.add_argument("--speed", type=float, default=1.0)
    args = parser.parse_args()
    asyncio.run(run(args.project, args.voice, args.speed))

if __name__ == "__main__":
    main()
