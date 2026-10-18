// videos/captions/NNN.txt (Instagram opisaniyasi) va videos/README.md (indeks) yaratadi.
// node scripts/make-docs.mjs
import path from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { loadVideos } from './manifest.mjs';

const outDir = path.resolve(import.meta.dirname, '..', '..', 'videos');
const capDir = path.join(outDir, 'captions');
mkdirSync(capDir, { recursive: true });

const KIND = { chat: 'Suhbat namunasi', flow: 'Jarayon sxemasi', versus: 'Taqqoslash', list: 'Ro\'yxat', steps: 'Qadamlar', clock: 'Soat bo\'yicha hikoya', calc: 'Misol hisob', check: 'Chek-list', faq: 'Savol-javob', story: 'Hikoya' };
const BASE = ['avtomatlashtirish', 'sunniyintellekt', 'chatbot', 'kichikbiznes', 'uzbekistan'];

const videos = await loadVideos();
const rows = [];
for (const v of videos) {
  const file = `${v.id}-${v.slug}.mp4`;
  if (!existsSync(path.join(outDir, file))) continue;
  const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(outDir, file)]).toString().trim());
  const tags = [...new Set([...v.tags, ...BASE])].map((t) => '#' + t.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const notes = [];
  const said = v.caption.join(' ').toLowerCase();
  if (v.body.kind === 'chat' && !said.includes('namuna')) notes.push('Suhbat namuna sifatida ko\'rsatilgan.');
  if (v.body.kind === 'calc' && !said.includes('misol uchun')) notes.push('Raqamlar misol uchun olingan, o\'zingizniki bilan almashtirib ko\'ring.');
  const text = [
    v.title,
    '',
    ...v.caption.flatMap((p) => [p, '']),
    ...notes.flatMap((p) => [p, '']),
    'Biznesingizga BEPUL konsultatsiya beramiz.',
    'Qiziqsangiz, izohda "+" qoldiring, bog\'lanamiz.',
    '',
    tags.join(' '),
    '',
  ].join('\n');
  writeFileSync(path.join(capDir, `${v.id}.txt`), text);
  rows.push({ v, file, dur });
}

const md = [
  '# Reel videolar (100 ta g\'oya)',
  '',
  'Vertikal 9:16 (1080x1920, 30 fps), ovoz: sintez qilingan musiqa va SFX (diktorsiz). Har bir videoning Instagram opisaniyasi `captions/NNN.txt` faylida, muqova (poster) `thumbs/NNN.jpg` da.',
  '',
  'CTA hammasida bir xil: izohda "+" qoldirish, bepul konsultatsiya. Videolardagi suhbat va raqamlar namuna/misol, haqiqiy natija emas.',
  '',
  '| # | Video | Format | Davomiyligi | Sarlavha |',
  '|---|-------|--------|-------------|----------|',
  ...rows.map(({ v, file, dur }) => `| ${v.id} | [${file}](${file}) | ${KIND[v.body.kind]} | ${dur.toFixed(1)} s | ${v.title.replace(/\|/g, '/')} |`),
  '',
  'Qayta render qilish: `reel/README.md` ga qarang.',
  '',
];
writeFileSync(path.join(outDir, 'README.md'), md.join('\n'));
console.log(rows.length, 'ta video uchun hujjat yaratildi');
