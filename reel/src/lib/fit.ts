import { fitText } from '@remotion/layout-utils';
import { FONT } from '../theme';

const cache = new Map<string, number>();

/** Bir qator matn `width` ga sig'adigan eng katta shrift o'lchami (keshlanadi — har kadrda qayta o'lchanmaydi). */
export const fitSize = (text: string, width: number, weight: '700' | '900'): number => {
  const key = `${weight}|${width}|${text}`;
  let v = cache.get(key);
  if (v === undefined) {
    v = fitText({ text, withinWidth: width, fontFamily: FONT, fontWeight: weight }).fontSize;
    cache.set(key, v);
  }
  return v;
};
