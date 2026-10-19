// Papkadagi NNN*.mp3 fayllarini (ElevenLabs'dan yuklab olingan xom ovoz) qayta ishlaydi:
//   node scripts/voice-ingest.mjs <papka>
// Fayl nomi 3 xonali video raqami bilan boshlansin (masalan 014.mp3 yoki 014-bot.mp3).
// Keyin: node scripts/render-all.mjs --ids 014,015 --force
import path from 'node:path';
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const dir = path.resolve(process.argv[2] ?? '.');
const files = readdirSync(dir).filter((f) => /^\d{3}.*\.mp3$/i.test(f)).sort();
const ok = [];
const bad = [];
for (const f of files) {
  const id = f.slice(0, 3);
  const r = spawnSync('node', [path.resolve(import.meta.dirname, 'voice-prep.mjs'), id, path.join(dir, f)], { stdio: 'inherit' });
  (r.status === 0 ? ok : bad).push(id);
}
console.log(`\nTayyor: ${ok.length} (${ok.join(',')}); xato: ${bad.length} (${bad.join(',')})`);
if (ok.length) console.log(`Render: node scripts/render-all.mjs --ids ${ok.join(',')} --force`);
process.exit(bad.length ? 1 : 0);
