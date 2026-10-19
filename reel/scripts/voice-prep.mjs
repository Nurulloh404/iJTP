// ElevenLabs'dan olingan xom mp3 ni beat'larga bo'ladi, orasiga aniq pauza qo'yadi va
// public/voice/NNN.mp3 hamda src/content/voice-data.json ni yangilaydi.
// node scripts/voice-prep.mjs <id> <raw.mp3>
import path from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { loadContent } from './manifest.mjs';

const root = path.resolve(import.meta.dirname, '..');
const [id, raw] = process.argv.slice(2);
const SPEED = 1.06; // ovoz tempi (balandlik o'zgarmaydi)
const LEAD = 0.12;
const GAP_HOOK = 0.55, GAP_BODY = 0.42, GAP_CTA = 0.65;

const { VIDEOS, beatCount } = await loadContent();
const v = VIDEOS.find((x) => x.id === id);
if (!v) throw new Error('video topilmadi ' + id);
const N = beatCount(v.body) + 2;

const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', raw]).toString().trim());

function silences(d) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', raw, '-af', `silencedetect=noise=-38dB:d=${d}`, '-f', 'null', '-'], { encoding: 'utf8' });
  const out = [];
  let st = null;
  for (const line of r.stderr.split('\n')) {
    const a = line.match(/silence_start: ([\d.]+)/);
    const b = line.match(/silence_end: ([\d.]+)/);
    if (a) st = Number(a[1]);
    if (b && st !== null) { out.push({ s: st, e: Number(b[1]) }); st = null; }
  }
  if (st !== null) out.push({ s: st, e: dur }); // fayl oxirigacha davom etgan jimlik
  return out;
}

let gaps = [];
for (const d of [0.7, 0.55, 0.4]) {
  const all = silences(d);
  const lead = all.find((g) => g.s < 0.08);
  const trail = all.find((g) => g.e > dur - 0.12 && g.s > 0.5);
  const inner = all.filter((g) => g !== lead && g !== trail);
  if (inner.length >= N - 1) {
    gaps = inner.sort((a, b) => b.e - b.s - (a.e - a.s)).slice(0, N - 1).sort((a, b) => a.s - b.s);
    gaps.lead = lead; gaps.trail = trail;
    break;
  }
}
if (gaps.length !== N - 1) { console.error(`XATO ${id}: ${N - 1} ta pauza kerak, topildi ${gaps.length}`); process.exit(2); }

const speechStart = gaps.lead ? Math.max(0, gaps.lead.e - 0.05) : 0;
const speechEnd = gaps.trail ? Math.min(dur, gaps.trail.s + 0.1) : dur;
const PAD = 0.07;
const segs = [];
for (let k = 0; k < N; k++) {
  const s = k === 0 ? speechStart : gaps[k - 1].e - PAD;
  const e = k === N - 1 ? speechEnd : gaps[k].s + PAD;
  segs.push({ s, e });
}

// Filtr: har segment + aniq pauzalar
const parts = [];
const labels = [];
parts.push(`anullsrc=r=44100:cl=mono,atrim=0:${LEAD}[lead]`);
labels.push('[lead]');
const gapAfter = (k) => (k === 0 ? GAP_HOOK : k === N - 2 ? GAP_CTA : GAP_BODY);
segs.forEach((g, k) => {
  const len = g.e - g.s;
  parts.push(`[0:a]aresample=44100,aformat=channel_layouts=mono,atrim=start=${g.s}:end=${g.e},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st=${Math.max(0, len - 0.03)}:d=0.03[a${k}]`);
  labels.push(`[a${k}]`);
  if (k < N - 1) {
    parts.push(`anullsrc=r=44100:cl=mono,atrim=0:${gapAfter(k)}[g${k}]`);
    labels.push(`[g${k}]`);
  }
});
parts.push(`${labels.join('')}concat=n=${labels.length}:v=0:a=1,atempo=${SPEED}[out]`);
const outFile = path.join(root, 'public/voice', `${id}.mp3`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-filter_complex', parts.join(';'), '-map', '[out]', '-ac', '1', '-ar', '44100', '-b:a', '128k', outFile]);

// beat vaqtlari (soniya)
let t = LEAD;
const beats = [];
segs.forEach((g, k) => {
  const len = g.e - g.s;
  beats.push({ s: +(t / SPEED).toFixed(3), e: +((t + len) / SPEED).toFixed(3) });
  t += len + (k < N - 1 ? gapAfter(k) : 0);
});
const total = +(t / SPEED).toFixed(3);
const dataPath = path.join(root, 'src/content/voice-data.json');
const data = existsSync(dataPath) ? JSON.parse(readFileSync(dataPath, 'utf8')) : {};
data[id] = { total, beats };
writeFileSync(dataPath, JSON.stringify(data, null, 1) + '\n');
console.log(`${id}: ${N} beat, jami ${total}s`, beats.map((b) => `${b.s}-${b.e}`).join(' '));
