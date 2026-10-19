// Bir nechta videoning ovozi bitta mp3 da (videolar orasida [long pause]) kelganda uni video bo'yicha kesadi:
//   node scripts/voice-split.mjs <raw.mp3> <id1,id2,...> [chiqish-papka]
// Har bir bo'lak <papka>/<id>.mp3 bo'ladi; keyin voice-prep ishlatiladi.
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { loadContent } from './manifest.mjs';

const [raw, idList, outArg] = process.argv.slice(2);
const ids = idList.split(',');
const outDir = path.resolve(outArg ?? path.dirname(raw), 'split');
mkdirSync(outDir, { recursive: true });
const { VIDEOS, beatCount } = await loadContent();
const beats = ids.map((id) => beatCount(VIDEOS.find((v) => v.id === id).body) + 2);
const totalGaps = beats.reduce((a, b) => a + b, 0) - 1;

const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', raw]).toString().trim());
const r = spawnSync('ffmpeg', ['-hide_banner', '-i', raw, '-af', 'silencedetect=noise=-38dB:d=0.7', '-f', 'null', '-'], { encoding: 'utf8' });
const all = [];
let st = null;
for (const line of r.stderr.split('\n')) {
  const a = line.match(/silence_start: ([\d.]+)/);
  const b = line.match(/silence_end: ([\d.]+)/);
  if (a) st = Number(a[1]);
  if (b && st !== null) { all.push({ s: st, e: Number(b[1]) }); st = null; }
}
if (st !== null) all.push({ s: st, e: dur });
const inner = all.filter((g) => g.s > 0.08 && g.e < dur - 0.12);
console.log(`pauzalar: ${inner.length} (kutilgan ${totalGaps}); uzunliklar:`, inner.map((g) => (g.e - g.s).toFixed(2)).join(' '));
if (inner.length !== totalGaps) { console.error(`XATO: ${totalGaps} ta pauza kerak, topildi ${inner.length}`); process.exit(2); }
// Videolar chegarasi: k-video oxiridan keyingi pauza = (beats[0..k] yig'indisi - 1)-chi pauza
const bounds = [];
let cum = 0;
for (let k = 0; k < ids.length - 1; k++) {
  cum += beats[k];
  bounds.push(inner[cum - 1]);
}
// tekshiruv: chegara pauzasi o'z atrofidagi oddiy pauzalardan uzunroq bo'lishi kerak (ogohlantirish)
bounds.forEach((g, k) => {
  const len = g.e - g.s;
  if (len < 1.0) console.warn(`OGOHLANTIRISH: ${ids[k]}/${ids[k + 1]} chegara pauzasi qisqa (${len.toFixed(2)}s)`);
});
const gapLens = bounds.map((g) => (g.e - g.s).toFixed(2));
console.log('video chegaralari (pauza uzunligi):', gapLens.join(' '));
ids.forEach((id, k) => {
  const s = k === 0 ? 0 : (bounds[k - 1].s + bounds[k - 1].e) / 2;
  const e = k === ids.length - 1 ? dur : (bounds[k].s + bounds[k].e) / 2;
  const out = path.join(outDir, `${id}.mp3`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-ss', String(s), '-to', String(e), '-c:a', 'libmp3lame', '-b:a', '128k', out]);
  console.log(`${id}: ${s.toFixed(2)}-${e.toFixed(2)} -> ${out}`);
});
