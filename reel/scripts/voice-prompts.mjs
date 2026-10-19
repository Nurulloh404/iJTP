// TTS promptlarini chiqaradi: node scripts/voice-prompts.mjs 002 003 ...   (yoki --check: hammasini tekshiradi)
import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { loadContent } from './manifest.mjs';

const { VIDEOS, beatCount } = await loadContent();
const { default: SCRIPT } = await import(path.resolve(import.meta.dirname, '../voice/ssenariy.mjs'));
const CTA_TAIL = 'Izohda plyus belgisini qoldiring. Konsultatsiya bepul.';

export function beatsFor(v) {
  const s = SCRIPT[v.slug];
  if (!s) throw new Error('ssenariy yo\'q: ' + v.slug);
  const need = beatCount(v.body) + 1; // hook + tana
  if (s.length === need + 1) return s; // CTA bilan to'liq
  if (s.length !== need) throw new Error(`${v.id} ${v.slug}: ${s.length} jumla, kerak ${need}`);
  let cta = (v.cta ?? '').replace(/\*/g, '').trim();
  if (cta && !/[.?!]$/.test(cta)) cta += '.';
  return [...s, `${cta} ${CTA_TAIL}`.trim()];
}
export const promptFor = (v) => beatsFor(v).join(' [pause] ');

const args = process.argv.slice(2);
if (args.includes('--check')) {
  let bad = 0, chars = 0;
  for (const v of VIDEOS) {
    try { chars += promptFor(v).length; } catch (e) { console.log('XATO', e.message); bad++; }
  }
  const extra = Object.keys(SCRIPT).filter((k) => !VIDEOS.some((v) => v.slug === k));
  console.log(`Tekshirildi: ${VIDEOS.length} video, xato ${bad}, ortiqcha slug ${extra.length} ${extra.join(',')}, jami belgi ${chars} (~${Math.round(chars / VIDEOS.length)} / video)`);
  process.exit(bad ? 1 : 0);
} else if (args.includes('--write') || args.includes('--missing')) {
  // --write: voice/prompts.txt (hammasi); --missing: ovozi hali yo'q videolarning promptlari (stdout)
  const have = JSON.parse(readFileSync(path.resolve(import.meta.dirname, '../src/content/voice-data.json'), 'utf8'));
  const list = args.includes('--missing') ? VIDEOS.filter((v) => !have[v.id]) : VIDEOS;
  const text = list.map((v) => `### ${v.id} ${v.slug}\n${promptFor(v)}\n`).join('\n');
  if (args.includes('--write')) {
    writeFileSync(path.resolve(import.meta.dirname, '../voice/prompts.txt'), text);
    console.log(`voice/prompts.txt: ${list.length} ta prompt`);
  } else {
    console.log(text);
    console.error(`${list.length} ta video ovozsiz`);
  }
} else {
  for (const id of args) {
    const v = VIDEOS.find((x) => x.id === id);
    console.log(`### ${id} ${v.slug}\n${promptFor(v)}\n`);
  }
}
