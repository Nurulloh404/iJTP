// Sintez qilingan musiqa va SFX (tashqi litsenziyasiz). Ishga tushirish: node scripts/make-audio.mjs
// WAV yoziladi, so'ng ffmpeg bilan mp3 ga o'giriladi.
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const SR = 44100;
const root = path.resolve(import.meta.dirname, '..');
const tmp = path.join(root, '.audio-tmp');
mkdirSync(tmp, { recursive: true });
mkdirSync(path.join(root, 'public/audio/music'), { recursive: true });
mkdirSync(path.join(root, 'public/audio/sfx'), { recursive: true });

let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function wav(name, data) {
  const n = data.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(data[i] * 32767))), 44 + i * 2);
  const p = path.join(tmp, name + '.wav');
  writeFileSync(p, buf);
  return p;
}
function toMp3(wavPath, out, br = '96k') {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wavPath, '-codec:a', 'libmp3lame', '-b:a', br, '-ac', '1', out]);
}
function normalize(a, peak = 0.9) {
  let m = 0; for (const v of a) m = Math.max(m, Math.abs(v));
  const g = m > 0 ? peak / m : 1; for (let i = 0; i < a.length; i++) a[i] *= g; return a;
}
const lp = (a, fc) => { const k = 1 - Math.exp(-2 * Math.PI * fc / SR); let y = 0; for (let i = 0; i < a.length; i++) { y += k * (a[i] - y); a[i] = y; } return a; };
const hp = (a, fc) => { const k = 1 - Math.exp(-2 * Math.PI * fc / SR); let y = 0; for (let i = 0; i < a.length; i++) { y += k * (a[i] - y); a[i] = a[i] - y; } return a; };

// ---------- SFX ----------
function sfx(name, dur, fn, br = '64k') {
  const n = Math.floor(dur * SR); const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = fn(i / SR, i, n);
  normalize(a, 0.85);
  // click-free fade tail
  const f = Math.min(200, n >> 2); for (let i = 0; i < f; i++) a[n - 1 - i] *= i / f;
  toMp3(wav('sfx-' + name, a), path.join(root, `public/audio/sfx/${name}.mp3`), br);
}
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));

sfx('pop', 0.16, (t) => { const f = 720 - 420 * Math.min(1, t / 0.07); return Math.sin(2 * Math.PI * f * t) * env(t, 0.002, 0.03); });
sfx('tick', 0.06, (t) => (Math.sin(2 * Math.PI * 2400 * t) * 0.7 + (rnd() - 0.5) * 0.3) * env(t, 0.0005, 0.008));
sfx('type', 0.05, (t) => (rnd() - 0.5) * env(t, 0.0005, 0.006) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 1500 * t)));
sfx('ding', 1.1, (t) => (Math.sin(2 * Math.PI * 1318.5 * t) * 1 + Math.sin(2 * Math.PI * 1976 * t) * 0.45 + Math.sin(2 * Math.PI * 2637 * t) * 0.2) * env(t, 0.002, 0.28));
sfx('notify', 1.0, (t) => {
  const a = (Math.sin(2 * Math.PI * 880 * t) + 0.4 * Math.sin(2 * Math.PI * 1760 * t)) * env(t, 0.002, 0.18);
  const t2 = t - 0.16; const b = t2 > 0 ? (Math.sin(2 * Math.PI * 1174.7 * t2) + 0.4 * Math.sin(2 * Math.PI * 2349 * t2)) * env(t2, 0.002, 0.3) : 0;
  return a * 0.7 + b;
});
sfx('success', 0.9, (t) => {
  let s = 0; [523.25, 659.25, 783.99, 1046.5].forEach((f, k) => { const tt = t - k * 0.085; if (tt > 0) s += Math.sin(2 * Math.PI * f * tt) * env(tt, 0.003, 0.22) * (k === 3 ? 1.2 : 0.8); }); return s;
});
{ // whoosh
  const dur = 0.5, n = Math.floor(dur * SR); const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = rnd() - 0.5;
  let y = 0; for (let i = 0; i < n; i++) { const t = i / n; const fc = 300 + 5200 * Math.sin(Math.PI * t) ** 2; const k = 1 - Math.exp(-2 * Math.PI * fc / SR); y += k * (a[i] - y); a[i] = y * Math.sin(Math.PI * t) ** 1.5; }
  hp(a, 200); normalize(a, 0.8); toMp3(wav('sfx-whoosh', a), path.join(root, 'public/audio/sfx/whoosh.mp3'), '64k');
}
sfx('slam', 0.6, (t) => { const f = 110 * Math.exp(-t * 9) + 38; return (Math.sin(2 * Math.PI * f * t) * 1 + (rnd() - 0.5) * 0.35 * Math.exp(-t * 40)) * env(t, 0.001, 0.14); });
sfx('swipe', 0.28, (t, i, n) => { const x = t / 0.28; const f = 500 + 1400 * x; return (Math.sin(2 * Math.PI * f * t) * 0.25 + (rnd() - 0.5) * 0.5) * Math.sin(Math.PI * x); });
sfx('error', 0.35, (t) => (Math.sin(2 * Math.PI * 196 * t) + Math.sin(2 * Math.PI * 185 * t)) * 0.5 * env(t, 0.004, 0.09));

// ---------- Musiqa ----------
// Har bir trek: bpm, ildiz, akkordlar (ildizga nisbatan yarim tonlar), uslub
const tracks = [
  { id: 'm1', bpm: 96, root: 57, prog: [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]], arp: [0, 1, 2, 1, 2, 1, 0, 1], kick: [0, 2], hatEvery: 0.5 },     // Am-F-C-G
  { id: 'm2', bpm: 104, root: 60, prog: [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]], arp: [0, 2, 1, 2, 0, 2, 1, 2], kick: [0, 1, 2, 3], hatEvery: 0.5 }, // C-G-Am-F
  { id: 'm3', bpm: 90, root: 62, prog: [[0, 3, 7], [-4, 0, 4], [-7, -3, 0], [-5, -2, 2]], arp: [0, 1, 2, 2, 1, 0, 1, 2], kick: [0, 2], hatEvery: 1 },     // Dm-Bb-F-C
  { id: 'm4', bpm: 112, root: 64, prog: [[0, 3, 7], [-4, 0, 3], [-9, -5, -2], [-2, 2, 5]], arp: [0, 1, 2, 1, 0, 2, 1, 2], kick: [0, 1, 2, 3], hatEvery: 0.5 }, // Em-C-G-D
  { id: 'm5', bpm: 100, root: 65, prog: [[0, 4, 7], [-5, -1, 2], [2, 5, 9], [-2, 2, 5]], arp: [0, 2, 1, 0, 2, 1, 2, 1], kick: [0, 2], hatEvery: 0.5 },  // F-C-Dm-Bb
  { id: 'm6', bpm: 118, root: 55, prog: [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-7, -4, 0]], arp: [0, 1, 2, 1, 2, 1, 2, 0], kick: [0, 1, 2, 3], hatEvery: 0.5 }, // Gm-Eb-Bb-F
];

function music(t) {
  const beat = 60 / t.bpm; const bars = 16; const total = bars * 4 * beat; const n = Math.floor(total * SR);
  const L = new Float32Array(n);
  const addAt = (start, buf, g = 1) => { const s = Math.floor(start * SR); for (let i = 0; i < buf.length && s + i < n; i++) L[s + i] += buf[i] * g; };
  seed = 99 + t.bpm;
  // kick
  const kick = (() => { const m = Math.floor(0.3 * SR); const b = new Float32Array(m); let ph = 0; for (let i = 0; i < m; i++) { const tt = i / SR; const f = 48 + 90 * Math.exp(-tt * 28); ph += 2 * Math.PI * f / SR; b[i] = Math.sin(ph) * Math.exp(-tt * 11); } return b; })();
  const hat = (() => { const m = Math.floor(0.05 * SR); const b = new Float32Array(m); for (let i = 0; i < m; i++) b[i] = (rnd() - 0.5) * Math.exp(-(i / SR) * 90); return hp(b, 6000); })();
  const snare = (() => { const m = Math.floor(0.18 * SR); const b = new Float32Array(m); for (let i = 0; i < m; i++) { const tt = i / SR; b[i] = ((rnd() - 0.5) * 0.8 + Math.sin(2 * Math.PI * 190 * tt) * 0.4) * Math.exp(-tt * 22); } return hp(b, 500); })();
  for (let bar = 0; bar < bars; bar++) {
    const chord = t.prog[bar % 4];
    const bt0 = bar * 4 * beat;
    // pad
    const padLen = Math.floor(4 * beat * SR); const pad = new Float32Array(padLen);
    for (const iv of chord) for (const oct of [0, 12]) {
      const f = mtof(t.root + iv + oct); const det = 1.003;
      for (let i = 0; i < padLen; i++) { const tt = i / SR; const e = Math.min(1, tt / 0.35) * Math.min(1, (4 * beat - tt) / 0.4); pad[i] += (Math.sin(2 * Math.PI * f * tt) + 0.5 * Math.sin(2 * Math.PI * f * det * tt)) * e * (oct ? 0.5 : 1); }
    }
    lp(pad, 1400); addAt(bt0, pad, 0.07);
    // bass
    for (let b = 0; b < 4; b += 2) {
      const f = mtof(t.root + chord[0] - 12); const m = Math.floor(beat * 1.9 * SR); const bs = new Float32Array(m);
      for (let i = 0; i < m; i++) { const tt = i / SR; bs[i] = (Math.sin(2 * Math.PI * f * tt) + 0.25 * Math.sin(4 * Math.PI * f * tt)) * Math.min(1, tt / 0.01) * Math.exp(-tt * 1.8); }
      addAt(bt0 + b * beat, bs, 0.34);
    }
    // arp (8th notes)
    for (let s = 0; s < 8; s++) {
      const iv = chord[t.arp[s]] + 12; const f = mtof(t.root + iv); const m = Math.floor(0.4 * SR); const p = new Float32Array(m);
      for (let i = 0; i < m; i++) { const tt = i / SR; p[i] = (Math.sin(2 * Math.PI * f * tt) * 0.8 + Math.sin(2 * Math.PI * f * 2 * tt) * 0.2) * Math.min(1, tt / 0.004) * Math.exp(-tt * 9); }
      addAt(bt0 + s * 0.5 * beat, p, bar >= 2 ? 0.1 : 0.05);
    }
    // drums
    if (bar >= 1) {
      for (const k of t.kick) addAt(bt0 + k * beat, kick, 0.5);
      for (let h = 0; h < 4 / t.hatEvery; h++) addAt(bt0 + h * t.hatEvery * beat + (t.hatEvery === 0.5 && h % 2 ? 0 : 0), hat, h % 2 ? 0.12 : 0.07);
      if (bar >= 2) { addAt(bt0 + 1 * beat, snare, 0.1); addAt(bt0 + 3 * beat, snare, 0.1); }
    }
  }
  // echo
  const d = Math.floor(beat * 0.75 * SR); for (let i = d; i < n; i++) L[i] += L[i - d] * 0.28;
  lp(L, 6500); normalize(L, 0.8);
  // start/end fade
  const f = Math.floor(0.05 * SR); for (let i = 0; i < f; i++) { L[i] *= i / f; L[n - 1 - i] *= i / f; }
  toMp3(wav('music-' + t.id, L), path.join(root, `public/audio/music/${t.id}.mp3`), '96k');
  console.log(t.id, total.toFixed(1) + 's');
}
tracks.forEach(music);
rmSync(tmp, { recursive: true, force: true });
console.log('tayyor');
