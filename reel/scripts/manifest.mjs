import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(import.meta.dirname, '..');

/** src/content (TypeScript) ni Node uchun yig'ib, VIDEOS ro'yxatini qaytaradi */
export async function loadVideos() {
  const dir = path.join(root, '.build');
  mkdirSync(dir, { recursive: true });
  const outfile = path.join(dir, `content-${Date.now()}.mjs`);
  await build({ entryPoints: [path.join(root, 'src/content/index.ts')], bundle: true, format: 'esm', platform: 'node', outfile, logLevel: 'error' });
  const mod = await import(pathToFileURL(outfile).href);
  return mod.VIDEOS;
}
