# Música original para el reel (sin copyright): 120 BPM, 30 s, estéreo 44.1 kHz.
import numpy as np, wave, sys

SR = 44100
BPM = 120
BEAT = 60 / BPM
DUR = 30.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def env(n, a=0.005, d=0.2, s=0.0, r=0.05, hold=None):
    t = np.arange(n) / SR
    e = np.ones(n)
    an = max(1, int(a * SR)); e[:an] = np.linspace(0, 1, an)
    if hold is None:
        dec = np.exp(-(t - a) / max(d, 1e-4)); dec[:an] = 1
        e = e * np.where(t < a, 1, s + (1 - s) * dec)
    rn = max(1, int(r * SR)); e[-rn:] *= np.linspace(1, 0, rn)
    return e

def add(buf_l, buf_r, sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    lg = np.cos((pan + 1) * np.pi / 4); rg = np.sin((pan + 1) * np.pi / 4)
    buf_l[i:i + len(sig)] += sig * lg * 1.414
    buf_r[i:i + len(sig)] += sig * rg * 1.414

def lowpass(x, cutoff):
    # filtro de un polo, simple y estable
    a = np.exp(-2 * np.pi * cutoff / SR); y = np.zeros_like(x); prev = 0.0
    for i in range(len(x)):
        prev = (1 - a) * x[i] + a * prev; y[i] = prev
    return y

def lp_fast(x, cutoff):
    # versión vectorizada aproximada (FFT) para señales largas
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))

def hp_fast(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (f / cutoff) ** 2 / np.sqrt(1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))

def note(n):  # midi -> Hz
    return 440 * 2 ** ((n - 69) / 12)

# ---------- instrumentos ----------
def kick(g=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 48 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7.5)
    click = rng.normal(0, 1, n) * np.exp(-t * 400) * 0.25
    return np.tanh((body + click) * 1.6) * g

def clap():
    n = int(0.35 * SR); t = np.arange(n) / SR
    noise = hp_fast(rng.normal(0, 1, n), 900)
    e = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        i = int(o * SR); e[i:] += np.exp(-(t[: n - i]) * (60 if k < 2 else 16))
    return noise * e * 0.5

def hat(open_=False):
    n = int((0.22 if open_ else 0.06) * SR); t = np.arange(n) / SR
    x = hp_fast(rng.normal(0, 1, n), 7000)
    return x * np.exp(-t * (14 if open_ else 70)) * 0.22

def sub(freq, length):
    n = int(length * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * 2 * freq * t)
    return np.tanh(x * 1.2) * env(n, a=0.008, d=length, s=0.7, r=0.04) * 0.55

def saw(freq, n, detune=0.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for d in (-detune, 0, detune):
        f = freq * (1 + d)
        out += 2 * ((t * f) % 1) - 1
    return out / 3

def chord(midis, length, bright=2200, g=0.12):
    n = int(length * SR)
    x = sum(saw(note(m), n, 0.006) for m in midis)
    x = lp_fast(x, bright)
    return x * env(n, a=0.02, d=0.35, s=0.25, r=0.08) * g

def pad(midis, length, g=0.09):
    n = int(length * SR)
    x = sum(saw(note(m), n, 0.01) for m in midis)
    x = lp_fast(x, 900)
    t = np.arange(n) / SR
    return x * np.minimum(1, t / 1.2) * np.minimum(1, (length - t) / 1.0).clip(0) * g

def riser(length, g=0.35):
    n = int(length * SR); t = np.arange(n) / SR
    x = rng.normal(0, 1, n)
    # barrido: se abre el filtro con el tiempo (por bloques)
    out = np.zeros(n); blk = 2048
    for i in range(0, n, blk):
        c = 300 + 9000 * (i / n) ** 2
        out[i:i + blk] = hp_fast(x[i:i + blk], max(200, c * 0.3))[: len(x[i:i + blk])]
    return out * (t / length) ** 2.2 * g

def impact():
    n = int(3.2 * SR); t = np.arange(n) / SR
    f = 34 + 70 * np.exp(-t * 6)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    crash = hp_fast(rng.normal(0, 1, n), 3500) * np.exp(-t * 1.9) * 0.35
    return np.tanh(boom * 1.8) * 0.9 + crash

def bell(midi, g=0.12):
    n = int(1.2 * SR); t = np.arange(n) / SR; f = note(midi)
    x = np.sin(2 * np.pi * f * t + 1.5 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 4))
    return x * np.exp(-t * 3.2) * g

# ---------- arreglo ----------
BAR = 4 * BEAT
prog = [  # Am - F - C - G (raíz del bajo, acorde)
    (45, [57, 60, 64, 69]), (41, [53, 57, 60, 65]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67]),
]
IMPACT = 24.0  # segundo exacto del final (logos)

# intro: pad + campanas (0–4 s)
for b in range(2):
    root, ch = prog[b % 4]
    add(L, R, pad([m + 12 for m in ch], BAR + 0.5), b * BAR, 0, 1.0)
for i, m in enumerate([76, 72, 69, 67, 69, 72, 76, 79]):
    add(L, R, bell(m), i * BEAT, -0.4 if i % 2 else 0.4)
add(L, R, riser(3.5, 0.25), 0.5)

# cuerpo: beat completo (4–22 s)
start_full, end_full = 2 * BAR, 11 * BAR
t = start_full
while t < IMPACT - 0.01:
    bar_i = int(round((t - start_full) / BAR))
    in_build = t >= 10 * BAR  # 20–24 s: subida
    root, ch = prog[bar_i % 4]
    for beat in range(4):
        bt = t + beat * BEAT
        if bt >= IMPACT: break
        if not (in_build and bt >= IMPACT - BEAT):
            add(L, R, kick(), bt, 0, 0.95)
        if beat in (1, 3) and not in_build:
            add(L, R, clap(), bt, 0, 0.85)
        for s in range(4):  # semicorcheas de hi-hat con swing ligero
            st = bt + s * BEAT / 4 + (0.012 if s % 2 else 0)
            if st < IMPACT:
                add(L, R, hat(open_=(s == 2)), st, 0.25 if s % 2 else -0.25, 0.9 if s % 2 == 0 else 0.6)
        # bajo: off-beat
        if not in_build:
            add(L, R, sub(note(root - 12 + 12), BEAT * 0.45), bt + BEAT / 2, 0, 1.0)
            add(L, R, sub(note(root), BEAT * 0.3), bt, 0, 0.55)
    if not in_build:
        # stabs de acordes (síncopa)
        for off in (0, 0.75 * BEAT, 2.5 * BEAT):
            add(L, R, chord(ch, BEAT * 0.5), t + off, -0.3, 1.0)
            add(L, R, chord([m + 12 for m in ch], BEAT * 0.5, 3200, 0.05), t + off + 0.01, 0.3, 1.0)
        add(L, R, pad([m + 12 for m in ch], BAR), t, 0, 0.6)
    t += BAR

# subida (20–24 s): redoble + riser
for k in range(32):
    rt = 20.0 + k * (4.0 / 32)
    add(L, R, clap(), rt, 0, 0.25 + 0.6 * (k / 32))
add(L, R, riser(4.0, 0.5), 20.0)

# impacto + final (24–30 s)
add(L, R, impact(), IMPACT, 0, 1.0)
add(L, R, pad([69 - 12 + 12, 72, 76, 81], 6.0, 0.14), IMPACT, 0)
for i, m in enumerate([81, 76, 72, 69]):
    add(L, R, bell(m, 0.1), IMPACT + 0.5 + i * BEAT * 1.5, -0.3 if i % 2 else 0.3)
for k in range(4):
    add(L, R, kick(0.5), IMPACT + 2 * BEAT + k * BEAT * 2, 0, 1.0)

# ---------- mezcla: reverb, compresión suave, fades ----------
def reverb(x, decay=1.6, mix=0.18):
    n = int(decay * SR); t = np.arange(n) / SR
    ir = rng.normal(0, 1, n) * np.exp(-t * 4.5 / decay)
    ir = lp_fast(ir, 6000)
    y = np.fft.irfft(np.fft.rfft(x, len(x) + n) * np.fft.rfft(ir, len(x) + n))[: len(x)]
    y /= (np.max(np.abs(y)) + 1e-9)
    return x + y * mix * np.max(np.abs(x))

L = reverb(L); R = reverb(R * 1.0)
mx = max(np.max(np.abs(L)), np.max(np.abs(R)))
L /= mx; R /= mx
L = np.tanh(L * 1.35) / np.tanh(1.35); R = np.tanh(R * 1.35) / np.tanh(1.35)
fade_in = int(0.05 * SR); fade_out = int(2.2 * SR)
for ch in (L, R):
    ch[:fade_in] *= np.linspace(0, 1, fade_in)
    ch[-fade_out:] *= np.linspace(1, 0, fade_out) ** 1.5
L *= 0.89; R *= 0.89

out = sys.argv[1] if len(sys.argv) > 1 else "music.wav"
data = (np.stack([L, R], axis=1) * 32767).astype(np.int16)
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
print("ok", out, f"{DUR}s")
