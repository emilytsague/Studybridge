"""Local narration only. Read JSON on stdin and return WAV clips on stdout."""
import base64
import io
import json
import sys
import wave
from pathlib import Path

from piper import PiperVoice

root = Path(__file__).resolve().parent.parent
request = json.load(sys.stdin)
voice = PiperVoice.load(str(root / "voices" / "fr_FR-siwis-medium.onnx"))
clips = []
for text in request["texts"]:
    if not text.strip():
        clips.append(None)
        continue
    output = io.BytesIO()
    with wave.open(output, "wb") as wav:
        voice.synthesize_wav(text, wav)
    data = output.getvalue()
    with wave.open(io.BytesIO(data), "rb") as wav:
        duration = wav.getnframes() / wav.getframerate()
    clips.append({"wav": base64.b64encode(data).decode("ascii"), "duration": duration})
json.dump({"clips": clips, "voice": "SIWIS · Français"}, sys.stdout)
