#!/usr/bin/env python3
"""Genera la banda sonora (música + efectos) sincronizada con src/timeline.json.

Todo el audio es sintetizado aquí: no usa samples ni música con licencia.
Uso:  python3 scripts/make-audio.py   (requiere numpy, scipy y ffmpeg)
Salida: public/audio/soundtrack.mp3
"""
import json
import pathlib
import subprocess
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / "src" / "timeline.json").read_text())
FPS = TL["fps"]
SR = 48000
N = int(SR * TL["durationInFrames"] / FPS) + SR  # +1 s de cola, se recorta al final
BEAT = 60 / 120  # 120 BPM → 1 beat = 15 frames
rng = np.random.default_rng(7)


def T(sec):
    return np.arange(int(sec * SR)) / SR


def noise(sec):
    return rng.uniform(-1, 1, int(sec * SR))


def filt(x, kind, fc, order=2):
    return sosfilt(butter(order, fc, kind, fs=SR, output="sos"), x)


def place(buf, sig, sec, gain=1.0, pan=0.0):
    i = int(round(sec * SR))
    if i >= len(buf) or i + len(sig) <= 0:
        return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], 1)
    if i < 0:
        sig, i = sig[-i:], 0
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def reverb(x, secs=1.6, mix=0.25, seed=3):
    r = np.random.default_rng(seed)
    n = int(secs * SR)
    env = np.exp(-np.arange(n) / SR / (secs / 5))
    out = np.zeros((len(x) + n - 1, 2))
    mono = x if x.ndim == 1 else x.mean(1)
    for ch in range(2):
        ir = r.uniform(-1, 1, n) * env
        ir = filt(ir, "low", 6000)
        ir /= np.sqrt((ir**2).sum())
        out[:, ch] = fftconvolve(mono, ir)
    dry = np.zeros_like(out)
    dry[: len(mono)] = x if x.ndim == 2 else np.stack([x, x], 1)
    return dry * (1 - mix) + out * mix


def sweep_sine(f0, f1, sec, curve="exp"):
    t = T(sec)
    f = f0 * (f1 / f0) ** (t / sec) if curve == "exp" else f0 + (f1 - f0) * t / sec
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def saw(freq, sec, phase=0.0):
    t = T(sec)
    return 2 * ((freq * t + phase) % 1) - 1


# ───────────────────────── efectos ─────────────────────────


def sfx_type():
    t = T(0.05)
    click = filt(noise(0.05), "high", 1800) * np.exp(-t / 0.005)
    tone = np.sin(2 * np.pi * rng.uniform(2800, 4200) * t) * np.exp(-t / 0.003) * 0.4
    return (click + tone) * rng.uniform(0.5, 0.9)


def sfx_error():
    t = T(0.5)
    sq = np.sign(np.sin(2 * np.pi * 110 * t)) + np.sign(np.sin(2 * np.pi * 117 * t))
    gate = (np.sin(2 * np.pi * 18 * t) > -0.2).astype(float)
    return np.tanh(filt(sq * 0.5, "low", 2500) * gate * np.exp(-t / 0.35) * 2) * 0.7


def sfx_glitch(sec=0.3):
    out = []
    while sum(len(o) for o in out) < sec * SR:
        seg = rng.uniform(0.012, 0.035)
        t = T(seg)
        kind = rng.integers(3)
        if kind == 0:
            s = np.sign(np.sin(2 * np.pi * rng.uniform(150, 2500) * t))
        elif kind == 1:
            s = np.round(noise(seg) * 3) / 3
        else:
            s = np.zeros(len(t))
        out.append(s * rng.uniform(0.3, 0.8))
    x = np.concatenate(out)[: int(sec * SR)]
    return x * np.linspace(1, 0.3, len(x))


def sfx_impact(size=1.0):
    sec = 1.6 * size
    t = T(sec)
    f = 38 + 70 * np.exp(-t / 0.08)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.45 * size))
    hit = filt(noise(sec), "low", 2500) * np.exp(-t / 0.025)
    x = np.tanh((sub * 1.2 + hit * 0.6) * 2.2)
    return reverb(x, 1.8, 0.22)


def sfx_crash(sec=2.5):
    t = T(sec)
    return reverb(filt(noise(sec), "high", 4500) * np.exp(-t / 0.7) * 0.5, 2.2, 0.35)


def sfx_riser(sec):
    t = T(sec)
    p = t / sec
    n = noise(sec)
    cuts = [400, 900, 2000, 4500, 9000, 15000]
    bands = [filt(n, "low", c) for c in cuts]
    idx = p * (len(cuts) - 1)
    x = np.zeros_like(t)
    for k, b in enumerate(bands):
        x += b * np.clip(1 - np.abs(idx - k), 0, 1)
    tone = sweep_sine(120, 1400, sec) * 0.35 + sweep_sine(240, 2800, sec) * 0.15
    x = (x * 0.8 + tone) * p**2.2
    x[-int(0.004 * SR):] *= np.linspace(1, 0, int(0.004 * SR))
    return x * 0.9


def sfx_whoosh(sec=0.5, reverse=False):
    t = T(sec)
    n = noise(sec)
    x = np.zeros_like(t)
    centers = [500, 900, 1600, 2800, 5000]
    for k, c in enumerate(centers):
        b = filt(n, "band", [c * 0.7, c * 1.4])
        mu = sec * (0.3 + 0.35 * k / (len(centers) - 1))
        x += b * np.exp(-((t - mu) ** 2) / (2 * (sec * 0.13) ** 2))
    x *= np.hanning(len(t)) * 2.2
    pan = np.linspace(-0.8, 0.8, len(t))
    st = np.stack([x * np.cos((pan + 1) * np.pi / 4), x * np.sin((pan + 1) * np.pi / 4)], 1) * 1.4
    return st[::-1] if reverse else st


def sfx_tick(pitch=2600):
    t = T(0.03)
    return np.sin(2 * np.pi * pitch * rng.uniform(0.95, 1.05) * t) * np.exp(-t / 0.004) * 0.6


def sfx_cash():
    t = T(1.4)
    ka = filt(noise(1.4), "band", [2000, 6000]) * np.exp(-t / 0.012)
    ching = np.zeros_like(t)
    t2 = np.clip(t - 0.05, 0, None)
    on = (t >= 0.05).astype(float)
    for fr, dec, g in [(2093, 0.9, 0.5), (2637, 0.8, 0.4), (3136, 0.7, 0.35), (4186, 0.5, 0.25), (5274, 0.35, 0.2)]:
        ching += (np.sin(2 * np.pi * fr * t2) + np.sin(2 * np.pi * (fr + 4) * t2)) * np.exp(-t2 / dec) * g * on
    return reverb(ka * 0.6 + ching * 0.5, 1.5, 0.3)


def sfx_blip(base=900):
    t = T(0.1)
    f = base * (1 + 0.5 * t / 0.1)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035) * 0.5


def sfx_stamp():
    t = T(0.35)
    thud = sweep_sine(150, 60, 0.35) * np.exp(-t / 0.07)
    snap = filt(noise(0.35), "band", [500, 2500]) * np.exp(-t / 0.02)
    return np.tanh((thud + snap * 0.8) * 1.8) * 0.8


def sfx_hit():
    t = T(0.3)
    body = sweep_sine(160, 50, 0.3) * np.exp(-t / 0.07)
    snap = filt(noise(0.3), "high", 2500) * np.exp(-t / 0.018)
    return np.tanh((body + snap * 0.6) * 2) * 0.8


def sfx_crt():
    t = T(0.25)
    zap = sweep_sine(2200, 60, 0.25) * np.exp(-t / 0.1)
    return (zap + filt(noise(0.25), "high", 3000) * np.exp(-t / 0.03) * 0.5) * 0.7


def sfx_bell(f0=880):
    t = T(0.9)
    return (np.sin(2 * np.pi * f0 * t) + 0.5 * np.sin(2 * np.pi * f0 * 1.5 * t)) * np.exp(-t / 0.3) * 0.35


# ───────────────────────── música ─────────────────────────

NOTE = {"A1": 55.0, "C2": 65.41, "F1": 43.65, "G1": 49.0}
CHORDS = {
    "Am": ("A1", [220.0, 261.63, 329.63]),
    "F": ("F1", [174.61, 220.0, 261.63]),
    "C": ("C2", [196.0, 261.63, 329.63]),
    "G": ("G1", [196.0, 246.94, 293.66]),
}


def chord_at(b):
    bar = b // 4
    if bar < 2:
        return "Am"
    if bar < 10:
        return ["Am", "F", "C", "G"][(bar - 2) % 4]
    if bar == 10:
        return "F" if b % 4 < 2 else "G"
    return "G" if b < 46 else "Am"


def kick():
    t = T(0.5)
    f = 45 + 115 * np.exp(-t / 0.03)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.2)
    c = filt(noise(0.5), "high", 3000) * np.exp(-t / 0.004) * 0.3
    return np.tanh((s + c) * 1.6)


def hat(open_=False):
    sec = 0.25
    t = T(sec)
    return filt(noise(sec), "high", 7500) * np.exp(-t / (0.08 if open_ else 0.022)) * (0.35 if open_ else 0.25)


def clap():
    t = T(0.4)
    n = filt(noise(0.4), "band", [900, 5000])
    env = sum(np.exp(-np.clip(t - d, 0, None) / 0.006) * (t >= d) for d in (0, 0.011, 0.022)) + np.exp(-t / 0.12) * 0.5
    return n * env * 0.5


def pad_note(freqs, sec, cutoff):
    t = T(sec)
    x = np.zeros((len(t), 2))
    for fr in freqs:
        for k, det in enumerate((-0.005, 0.0, 0.005)):
            s = saw(fr * (1 + det), sec, phase=rng.random())
            x[:, k % 2] += s
            x[:, (k + 1) % 2] += s * 0.5
    x = np.stack([filt(x[:, 0], "low", cutoff), filt(x[:, 1], "low", cutoff)], 1)
    a = np.minimum(1, t / 0.25) * np.minimum(1, (sec - t) / 0.3)
    return x * a[:, None] * 0.06


def bass_note(fr, sec):
    t = T(sec)
    s = filt(saw(fr, sec) * 0.6, "low", 380) + np.sin(2 * np.pi * fr * t) * 0.8
    env = np.minimum(1, t / 0.004) * np.exp(-t / 0.18)
    return np.tanh(s * env * 1.5) * 0.55


def pluck(fr):
    t = T(0.3)
    s = np.sign(np.sin(2 * np.pi * fr * t)) * 0.5 + saw(fr * 1.005, 0.3) * 0.5
    return filt(s, "low", 3200) * np.exp(-t / 0.09) * 0.22


def build():
    music = np.zeros((N, 2))
    duck = np.ones(N)
    first, last, final = 8, 45, 46  # beats con batería (frames 120–689) y golpe final (frame 690)

    for b in range(first, last + 1):
        tb = b * BEAT
        place(music, kick(), tb, 0.95)
        i = int(tb * SR)
        tt = np.arange(N - i) / SR
        duck[i:] = np.minimum(duck[i:], 1 - 0.6 * np.exp(-tt / 0.14))
        place(music, hat(True), tb + BEAT / 2, 1, 0.2)
        if b >= 16:
            place(music, hat(), tb + BEAT / 4, 0.8, -0.3)
            place(music, hat(), tb + 3 * BEAT / 4, 0.8, 0.3)
        if b % 2 == 1:
            place(music, reverb(clap(), 1.0, 0.25), tb, 0.9)

    synth = np.zeros((N, 2))
    # pad: intro filtrado que se abre con el riser, luego progresión Am F C G
    for b in range(0, final):
        root, freqs = CHORDS[chord_at(b)]
        cutoff = 500 + (1800 * max(0, b - 4) / 4 if b < 8 else 1800) if b < 8 else 2600
        place(synth, pad_note(freqs, BEAT + 0.3, cutoff), b * BEAT - 0.15, 1)
        if first <= b <= last:
            for half in (0, 0.5):
                place(synth, bass_note(NOTE[root], 0.22), (b + half) * BEAT, 1)
        if 16 <= b <= last:
            seq = [freqs[0] * 2, freqs[1] * 2, freqs[2] * 2, freqs[1] * 2]
            for k in range(4):
                place(synth, pluck(seq[k]), (b + k / 4) * BEAT, 1, -0.5 if k % 2 else 0.5)

    # eco de corcheas con puntillo
    d = int(0.375 * SR)
    echo = np.zeros_like(synth)
    echo[d:] += synth[:-d] * 0.3
    echo[2 * d:] += synth[: -2 * d] * 0.12
    synth = synth + echo[:, ::-1]
    music += synth * duck[:, None]

    # golpe final (frame 690)
    tf = final * BEAT
    place(music, kick(), tf, 1.1)
    place(music, reverb(pad_note(CHORDS["Am"][1], 2.6, 2400) * 1.8, 2.4, 0.45), tf, 1)
    place(music, bass_note(55.0, 1.2) * 1.2, tf, 1)
    return music


def cues():
    fx = np.zeros((N, 2))
    s = lambda fr: fr / FPS  # noqa: E731
    H, D, P, K = TL["hook"], TL["drop"], TL["plans"], TL["cta"]

    for fr in np.linspace(H["typeStart"], H["typeEnd"], 22):
        place(fx, sfx_type(), s(fr), 0.8, rng.uniform(-0.3, 0.3))
    place(fx, sfx_error(), s(H["error"]), 0.9)
    place(fx, sfx_glitch(0.3), s(H["error"]), 0.6)
    place(fx, sfx_glitch(0.2), s(H["error"] + 7), 0.4)
    for fr in np.linspace(H["subStart"], H["subEnd"], 10):
        place(fx, sfx_type(), s(fr), 0.6, rng.uniform(-0.3, 0.3))
    place(fx, sfx_crt(), s(H["crtOff"]), 0.9)
    for k, fr in enumerate(H["slams"]):
        place(fx, sfx_impact(0.7 if k < 2 else 1.1), s(fr), 0.8 if k < 2 else 1)
        place(fx, sfx_hit(), s(fr), 0.6)
    place(fx, sfx_glitch(0.35), s(H["slams"][2]), 0.5)
    riser_len = (D["land"] - H["slams"][0]) / FPS
    place(fx, sfx_riser(riser_len), s(H["slams"][0]), 0.75)
    for fr in range(H["flickerStart"], H["morph"], 3):
        place(fx, sfx_glitch(0.04), s(fr), 0.35, rng.uniform(-0.6, 0.6))
    place(fx, sfx_whoosh(0.4, reverse=True), s(D["land"]) - 0.4, 0.9)

    place(fx, sfx_impact(1.5), s(D["land"]), 1.1)
    place(fx, sfx_crash(), s(D["land"]), 0.8)
    place(fx, sfx_glitch(0.4), s(D["land"]), 0.5)
    for fr in np.linspace(D["urlStart"], D["urlEnd"], 12):
        place(fx, sfx_type(), s(fr), 0.5)
    for k, fr in enumerate(D["tagline"]):
        place(fx, sfx_hit(), s(fr), 0.8)
        place(fx, sfx_impact(0.6 + 0.4 * k), s(fr), 0.6)
    place(fx, sfx_whoosh(0.45), s(D["wipe"]), 1.0)
    for i in range(D["rapidCount"]):
        fr = round(D["rapidStart"] + i * 7.5)
        place(fx, sfx_hit(), s(fr), 0.75, (-1) ** i * 0.3)
        place(fx, sfx_tick(3200), s(fr), 0.4)

    for p, nfeat in enumerate(P["featureCounts"]):
        st = P["start"] + p * P["length"]
        if p == 0:
            place(fx, sfx_whoosh(0.35), s(st) - 0.1, 0.8)
            place(fx, sfx_impact(0.6), s(st), 0.5)
        for fr in range(st + P["rollStart"], st + P["rollLand"], 2):
            place(fx, sfx_tick(2400 + (fr - st) * 25), s(fr), 0.45, rng.uniform(-0.2, 0.2))
        place(fx, sfx_cash(), s(st + P["rollLand"]), 0.7)
        place(fx, sfx_impact(0.6), s(st + P["rollLand"]), 0.55)
        place(fx, sfx_stamp(), s(st + P["badge"]), 0.75, 0.3)
        for i in range(nfeat):
            place(fx, sfx_blip(700 + i * 90), s(st + P["featStart"] + i * P["featStep"]), 0.45, -0.2 + i * 0.05)
        place(fx, sfx_blip(1400), s(st + P["button"]), 0.5)
        if p < len(P["featureCounts"]) - 1:
            place(fx, sfx_whoosh(0.5), s(st + P["flip"]), 0.9)

    place(fx, sfx_crt(), s(K["start"]), 0.8)
    place(fx, sfx_whoosh(0.3, reverse=True), s(K["start"]), 0.6)
    place(fx, sfx_impact(0.5), s(K["lineIn"]), 0.5)
    for fr in range(K["decodeStart"], K["decodeEnd"], 2):
        place(fx, sfx_tick(1800 + (fr - K["decodeStart"]) * 60), s(fr), 0.3)
    place(fx, sfx_blip(1200), s(K["decodeEnd"]), 0.6)
    for k, fr in enumerate(K["slams"]):
        place(fx, sfx_hit(), s(fr), 0.8)
        place(fx, sfx_impact(0.8 + 0.3 * k), s(fr), 0.7)
    place(fx, sfx_whoosh(0.4), s(K["outro"]) - 0.15, 0.8)
    for fr in np.linspace(K["typeStart"], K["typeEnd"], 16):
        place(fx, sfx_type(), s(fr), 0.5)
    place(fx, sfx_impact(1.6), s(K["final"]), 1.1)
    place(fx, sfx_crash(3.0), s(K["final"]), 0.7)
    place(fx, sfx_glitch(0.3), s(K["final"]), 0.5)
    place(fx, sfx_bell(880), s(K["final"]), 0.6)
    for fr in K["pulses"]:
        place(fx, sfx_bell(1320), s(fr), 0.3)
    return fx


def main():
    mix = build() * 0.7 + cues() * 0.85
    mix = mix[: int(SR * TL["durationInFrames"] / FPS)]
    fade = int(0.25 * SR)
    mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
    mix /= np.abs(mix).max() + 1e-9
    mix = np.tanh(mix * 1.6) / np.tanh(1.6) * 0.93  # limitador suave
    out = ROOT / "public" / "audio"
    out.mkdir(parents=True, exist_ok=True)
    tmp = out / "soundtrack.wav"
    with wave.open(str(tmp), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-b:a", "256k", str(out / "soundtrack.mp3")], check=True)
    tmp.unlink()
    print("✓ public/audio/soundtrack.mp3")


if __name__ == "__main__":
    main()
