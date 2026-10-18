import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

/** 0..1 sakrash animatsiyasi; `delay` kadrda. */
export const usePop = (delay = 0, damping = 14, stiffness = 150) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness, mass: 0.7 } });
};

/** Yumshoq (overshoot'siz) 0..1 */
export const useSoft = (delay = 0, dur = 18) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** `*so'z*` belgisi bilan ajratilgan bo'laklar */
export const parseRich = (s: string): { t: string; a: boolean }[] => {
  const out: { t: string; a: boolean }[] = [];
  s.split('*').forEach((part, i) => {
    if (part) out.push({ t: part, a: i % 2 === 1 });
  });
  return out;
};

export const stripRich = (s: string) => s.replace(/\*/g, '');

/** Deterministik tasodifiy */
export const seeded = (seed: number) => {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

/** Uzun qatorni muvozanatli ikkiga bo'ladi (`*` urg'u belgisini buzmasdan). */
export const balanceLine = (line: string, maxChars = 17): string[] => {
  const plainLen = (t: string) => t.replace(/\*/g, '').length;
  if (plainLen(line) <= maxChars) return [line];
  const words = line.split(' ');
  if (words.length < 2) return [line];
  let best = 1;
  let bestDiff = Infinity;
  for (let k = 1; k < words.length; k++) {
    const a = plainLen(words.slice(0, k).join(' '));
    const b = plainLen(words.slice(k).join(' '));
    const d = Math.abs(a - b);
    if (d < bestDiff) {
      bestDiff = d;
      best = k;
    }
  }
  let first = words.slice(0, best).join(' ');
  let second = words.slice(best).join(' ');
  if ((first.match(/\*/g) ?? []).length % 2 === 1) {
    first += '*';
    second = '*' + second;
  }
  return [first, ...(plainLen(second) > maxChars + 7 ? balanceLine(second, maxChars) : [second])];
};
