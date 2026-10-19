// node scripts/render-all.mjs [--ids 001,002 | --from 1 --to 20] [--concurrency 4] [--crf 24] [--force]
import path from 'node:path';
import { existsSync, mkdirSync, statSync, renameSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { setup, selectComposition, renderStill, renderMedia, root } from './lib.mjs';
import { loadVideos } from './manifest.mjs';

const args = process.argv.slice(2);
const get = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const outDir = path.resolve(root, '..', 'videos');
const thumbDir = path.join(outDir, 'thumbs');
mkdirSync(thumbDir, { recursive: true });

const videos = await loadVideos();
let ids = get('--ids')?.split(',');
if (!ids) {
  const from = Number(get('--from', 1));
  const to = Number(get('--to', videos.length));
  ids = videos.filter((v) => Number(v.id) >= from && Number(v.id) <= to).map((v) => v.id);
}
const concurrency = Number(get('--concurrency', 4));
const crf = Number(get('--crf', 24));
const force = args.includes('--force');

const { serveUrl, browser } = await setup();
for (const id of ids) {
  const v = videos.find((x) => x.id === id);
  const file = path.join(outDir, `${id}-${v.slug}.mp4`);
  if (!force && existsSync(file)) { console.log(id, 'bor, o\'tkazildi'); continue; }
  const t0 = Date.now();
  const inputProps = { id, guard: false };
  const comp = await selectComposition({ serveUrl, id: 'Reel', inputProps, puppeteerInstance: browser });
  await renderStill({ composition: comp, serveUrl, output: path.join(thumbDir, `${id}.jpg`), frame: 45, inputProps, puppeteerInstance: browser, imageFormat: 'jpeg', jpegQuality: 88 });
  const tmp = file.replace(/\.mp4$/, '.tmp.mp4');
  let last = 0;
  await renderMedia({
    composition: comp, serveUrl, codec: 'h264', outputLocation: tmp, inputProps, puppeteerInstance: browser,
    concurrency, crf, imageFormat: 'jpeg', jpegQuality: 88, pixelFormat: 'yuv420p', x264Preset: 'fast', audioCodec: 'aac', audioBitrate: '128k',
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p > last) { last = p; process.stdout.write(`${id}:${p * 10}% `); } },
  });
  // ovoz balandligini -16 LUFS ga keltiramiz (video oqimi nusxalanadi)
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-movflags', '+faststart', file]);
  rmSync(tmp, { force: true });
  const mb = (statSync(file).size / 1048576).toFixed(1);
  console.log(`\n${id} ${v.slug} ${(comp.durationInFrames / 30).toFixed(1)}s ${mb}MB render=${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close({ silent: true });
