"""
Narration for every beat in src/reels.json → public/audio/<reel>-<n>.mp3 + src/timings.json
(word-level timings drive duration and the karaoke captions).

Engines (chosen automatically, or force with VOICE_ENGINE=elevenlabs|edge):
  - elevenlabs: ElevenLabs API, eleven_multilingual_v2 → natural pt-BR. Needs ELEVENLABS_API_KEY
                in video/.env.local (run: npm.cmd run voice:setup). Uses /with-timestamps for
                character alignment, converted to word timings here.
  - edge:       free Microsoft neural voice (pt-BR-ThalitaMultilingualNeural, the most natural
                pt-BR voice there). Fallback when there is no ElevenLabs key.

Options: python scripts/tts.py [ReelId ...]   (only those reels; others keep their timings)
Corporate TLS interception (Netskope): truststore makes Python trust the Windows CA store.
"""
import asyncio
import base64
import json
import os
import pathlib
import sys
import urllib.request

import truststore

truststore.inject_into_ssl()
import edge_tts  # noqa: E402  (must load after truststore patches ssl)

ROOT = pathlib.Path(__file__).resolve().parent.parent
REELS = json.loads((ROOT / "src" / "reels.json").read_text(encoding="utf-8"))["reels"]
AUDIO = ROOT / "public" / "audio"
AUDIO.mkdir(parents=True, exist_ok=True)
TIMINGS = ROOT / "src" / "timings.json"


def load_env():
    f = ROOT / ".env.local"
    if f.exists():
        for line in f.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip("'\""))


load_env()
KEY = os.environ.get("ELEVENLABS_API_KEY", "")
ENGINE = os.environ.get("VOICE_ENGINE") or ("elevenlabs" if KEY else "edge")

# ── edge-tts ────────────────────────────────────────────────────────────────
EDGE_VOICE = {"female": "pt-BR-ThalitaMultilingualNeural", "male": "pt-BR-ThalitaMultilingualNeural"}
# pt-BR voices read the brand as "Crôund"; spoken "Cráund" (like "crowned"), captions keep "Crownd".
SAY = {"Crownd": "Cráund"}
SHOW = {v: k for k, v in SAY.items()}


def swap(text: str, table: dict) -> str:
    for k, v in table.items():
        text = text.replace(k, v)
    return text


async def edge(text: str, reel: dict, out: pathlib.Path):
    com = edge_tts.Communicate(swap(text, SAY), EDGE_VOICE[reel.get("gender", "female")], rate=reel.get("rate", "+0%"), pitch=reel.get("pitch", "+0Hz"), boundary="WordBoundary")
    words, audio = [], bytearray()
    async for chunk in com.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            start = chunk["offset"] / 10_000  # 100 ns → ms
            words.append({"text": swap(chunk["text"], SHOW), "startMs": round(start), "endMs": round(start + chunk["duration"] / 10_000)})
    out.write_bytes(bytes(audio))
    return round(len(audio) * 8 / 48), words  # 48 kbps CBR


# ── ElevenLabs ─────────────────────────────────────────────────────────────
def eleven_voice(gender: str) -> str:
    env = os.environ.get(f"ELEVENLABS_VOICE_{gender.upper()}")
    if env:
        return env
    raise SystemExit(f"Defina ELEVENLABS_VOICE_{gender.upper()} em video/.env.local (npm.cmd run voice:setup).")


def eleven(text: str, reel: dict, out: pathlib.Path):
    voice = eleven_voice(reel.get("gender", "female"))
    body = {
        "text": text,
        "model_id": os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2"),
        # Lower stability = more expressive delivery; style adds energy (good for Reels).
        "voice_settings": {"stability": 0.38, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True},
    }
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), headers={"xi-api-key": KEY, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        data = json.loads(r.read())
    audio = base64.b64decode(data["audio_base64"])
    out.write_bytes(audio)
    al = data.get("normalized_alignment") or data["alignment"]
    words, cur, start, end = [], "", None, 0.0
    for ch, s, e in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if ch.isspace():
            if cur:
                words.append({"text": cur, "startMs": round(start * 1000), "endMs": round(end * 1000)})
            cur, start = "", None
            continue
        if start is None:
            start = s
        cur, end = cur + ch, e
    if cur:
        words.append({"text": cur, "startMs": round(start * 1000), "endMs": round(end * 1000)})
    return round(len(audio) * 8 / 128), words  # 128 kbps CBR


async def main():
    only = set(sys.argv[1:])
    timings = json.loads(TIMINGS.read_text(encoding="utf-8")) if TIMINGS.exists() else {}
    print(f"Motor de voz: {ENGINE}")
    for reel in REELS:
        if only and reel["id"] not in only:
            continue
        beats = []
        for i, beat in enumerate(reel["beats"]):
            out = AUDIO / f"{reel['id']}-{i + 1}.mp3"
            if ENGINE == "elevenlabs":
                dur, words = eleven(beat["text"], reel, out)
            else:
                dur, words = await edge(beat["text"], reel, out)
            beats.append({"file": f"audio/{out.name}", "durationMs": dur, "words": words, "engine": ENGINE})
            print(f"✓ {out.name}: {dur / 1000:.2f}s, {len(words)} palavras")
        timings[reel["id"]] = beats
    TIMINGS.write_text(json.dumps(timings, ensure_ascii=False, indent=1), encoding="utf-8")
    print("✓ src/timings.json")


asyncio.run(main())
