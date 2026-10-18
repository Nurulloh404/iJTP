// Tekshiruv (Guard) + muqova/kontakt rasmlari.
// node scripts/check.mjs [--ids 001,002] [--out dir] [--hook]
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { setup, selectComposition, renderStill, root } from './lib.mjs';
import { loadVideos } from './manifest.mjs';

const args = process.argv.slice(2);
const get = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const out = path.resolve(get('--out') || path.join(root, '.check'));
mkdirSync(out, { recursive: true });
const videos = await loadVideos();
const ids = get('--ids')?.split(',') ?? videos.map((v) => v.id);

const { serveUrl, browser } = await setup();
const bad = [];
const t0 = Date.now();
for (const id of ids) {
  const comp = await selectComposition({ serveUrl, id: 'Reel', inputProps: { id, guard: true }, puppeteerInstance: browser, browserExecutable: undefined });
  const HOOK = 96, TR = 10, CTA = 120;
  const body = comp.durationInFrames - HOOK - CTA + 2 * TR;
  const settled = HOOK + body - TR - 10;
  try {
    await renderStill({ composition: comp, serveUrl, output: path.join(out, `${id}-body.jpg`), frame: settled, inputProps: { id, guard: true }, puppeteerInstance: browser, imageFormat: 'jpeg', jpegQuality: 70 });
    if (args.includes('--hook')) await renderStill({ composition: comp, serveUrl, output: path.join(out, `${id}-hook.jpg`), frame: 60, inputProps: { id, guard: false }, puppeteerInstance: browser, imageFormat: 'jpeg', jpegQuality: 70 });
    console.log(id, 'OK', (comp.durationInFrames / 30).toFixed(1) + 's');
  } catch (e) {
    const msg = String(e.message || e).split('\n').find((l) => l.includes('OVERFLOW')) || String(e.message || e).slice(0, 300);
    console.log(id, 'XATO', msg);
    bad.push(id);
  }
}
console.log(`Tugadi: ${ids.length} ta, xato: ${bad.length} ${bad.join(',')}, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
await browser.close({ silent: true });
process.exit(bad.length ? 1 : 0);
