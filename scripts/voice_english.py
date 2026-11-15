"""Generate English narration using edge-tts (en-US-ChristopherNeural with broadcast vocal mastering).
Produces data/narration.wav (24 kHz mono), data/lines.json, and data/words.json with frame-accurate timing.
"""
import argparse, asyncio, json, os, re, subprocess, tempfile
from pathlib import Path
import numpy as np
from scipy.io import wavfile
import edge_tts

DEFAULT_VOICE = "en-US-ChristopherNeural"
SR = 24000

def trim(x, thr=0.008):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a = max(0, idx[0] - int(0.01 * SR))
    b = min(len(x), idx[-1] + int(0.03 * SR))
    return x[a:b]

async def synth_line_with_submaker(text, voice, rate_str="+0%", pitch_str="-2Hz"):
    comm = edge_tts.Communicate(text, voice, rate=rate_str, pitch=pitch_str)
    submaker = edge_tts.SubMaker()
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tf:
        tmp_name = tf.name
    try:
        with open(tmp_name, "wb") as f:
            async for chunk in comm.stream():
                if chunk["type"] == "audio":
                    f.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    submaker.feed(chunk)

        # Broadcast vocal mastering chain:
        # - Highpass 75Hz (removes low-end rumble)
        # - Warm chest boost at 125Hz (+4.5 dB)
        # - Clarity presence at 3400Hz (+3.5 dB)
        # - Studio dynamic compressor
        af_filter = (
            "highpass=f=75,"
            "bass=g=4.5:f=125:w=0.7,"
            "equalizer=f=3400:t=q:w=1.2:g=3.5,"
            "treble=g=-0.5:f=8000,"
            "acompressor=threshold=-16dB:ratio=3.5:attack=5:release=50:makeup=3.0"
        )
        proc = subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-i", tmp_name,
            "-af", af_filter,
            "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"
        ], capture_output=True, check=True)
        samples = np.frombuffer(proc.stdout, dtype=np.float32)
        trimmed = trim(samples)
        return trimmed, submaker
    finally:
        if os.path.exists(tmp_name):
            os.remove(tmp_name)

async def run(project_dir, voice_override=None, speed=1.0):
    P = Path(project_dir)
    S = json.loads((P / "script.json").read_text(encoding="utf-8"))
    voice = voice_override or S.get("voice", DEFAULT_VOICE)
    pitch = S.get("pitch", "-2Hz")
    rate_pct = int((speed - 1.0) * 100)
    rate_str = f"{'+' if rate_pct >= 0 else ''}{rate_pct}%"

    print(f"Synthesizing English audio with voice '{voice}' (rate {rate_str}, pitch {pitch})...")

    lead_s = float(S.get("lead", 0.35))
    lead = np.zeros(int(lead_s * SR), dtype=np.float32)
    out_chunks = [lead]
    cur_t = lead_s
    lines_info = []
    all_words = []

    for i, ln in enumerate(S["lines"]):
        text = ln.get("voice_text") or ln["text"]
        print(f"[{i:2d}] {text}")
        audio, submaker = await synth_line_with_submaker(text, voice, rate_str=rate_str, pitch_str=pitch)
        dur = len(audio) / SR
        start_t = cur_t
        end_t = cur_t + dur
        lines_info.append({
            "i": i,
            "text": ln["text"],
            "start": round(start_t, 3),
            "end": round(end_t, 3),
            "dur": round(dur, 3),
            "badge": ln.get("badge", ""),
            "asset": ln.get("asset", "")
        })

        # Parse word timings from submaker or fallback proportional spacing
        line_words = text.split()
        if submaker.cues:
            for cue in submaker.cues:
                all_words.append({
                    "w": cue.text,
                    "line": i,
                    "s": round(start_t + cue.start.total_seconds(), 3),
                    "e": round(start_t + cue.end.total_seconds(), 3)
                })
        else:
            w_dur = dur / max(1, len(line_words))
            for wi, w in enumerate(line_words):
                all_words.append({
                    "w": w,
                    "line": i,
                    "s": round(start_t + wi * w_dur, 3),
                    "e": round(start_t + (wi + 0.9) * w_dur, 3)
                })

        out_chunks.append(audio)
        gap_s = float(ln.get("gap", S.get("gap", 0.22)))
        if gap_s > 0:
            out_chunks.append(np.zeros(int(gap_s * SR), dtype=np.float32))
            cur_t = end_t + gap_s
        else:
            cur_t = end_t

    outro_s = float(S.get("outro", 1.2))
    if outro_s > 0:
        out_chunks.append(np.zeros(int(outro_s * SR), dtype=np.float32))
        cur_t += outro_s

    full_audio = np.concatenate(out_chunks)
    wav_path = P / "data" / "narration.wav"
    wav_path.parent.mkdir(parents=True, exist_ok=True)
    wav_norm = (full_audio / (np.max(np.abs(full_audio)) + 1e-6) * 30000).astype(np.int16)
    wavfile.write(str(wav_path), SR, wav_norm)

    (P / "data" / "lines.json").write_text(json.dumps({"lines": lines_info, "total_duration": round(cur_t, 3)}, indent=2, ensure_ascii=False), encoding="utf-8")
    (P / "data" / "words.json").write_text(json.dumps(all_words, indent=2, ensure_ascii=False), encoding="utf-8")
    (P / "data" / "words.txt").write_text("\n".join(f"{w['s']:7.2f} {w['e']:7.2f}  L{w['line']:<2d} {w['w']}" for w in all_words), encoding="utf-8")

    print(f"Generated {wav_path} ({len(full_audio)/SR:.2f}s, {len(all_words)} words)")
    return cur_t

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("project", help="Path to project directory")
    parser.add_argument("--voice", default=None)
    parser.add_argument("--speed", type=float, default=1.0)
    args = parser.parse_args()
    asyncio.run(run(args.project, args.voice, args.speed))
