import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { openBrowser, selectComposition, renderStill, renderMedia } from '@remotion/renderer';

export const root = path.resolve(import.meta.dirname, '..');
export const BROWSER = process.env.BROWSER_EXE || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

export async function setup() {
  const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), onProgress: () => {} });
  const browser = await openBrowser('chrome', { browserExecutable: BROWSER, chromiumOptions: { gl: 'angle' } });
  return { serveUrl, browser };
}
export { selectComposition, renderStill, renderMedia };
