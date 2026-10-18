import type { Entry, VideoSpec } from './types';
import type { BgStyle } from '../lib/Background';
import { CHAT } from './chat';
import { FLOW } from './flow';
import { VERSUS } from './versus';
import { LISTS } from './lists';
import { STEPS } from './steps';
import { CLOCKS } from './clocks';
import { CALCS } from './calcs';
import { CHECKS } from './checks';
import { FAQS } from './faqs';
import { STORIES } from './stories';

// Shablonlar aralashib chiqadi: 1-video chat, 2-video flow, ... 11-video yana chat va h.k.
const GROUPS: Entry[][] = [CHAT, FLOW, VERSUS, LISTS, STEPS, CLOCKS, CALCS, CHECKS, FAQS, STORIES];
const BGS: BgStyle[] = ['blobs', 'grid', 'rays', 'dots', 'stripes', 'rings'];
const HOOKS: VideoSpec['hookStyle'][] = ['pop', 'rise', 'type', 'slam'];
const TRANS: VideoSpec['transition'][] = ['fade', 'slide', 'wipe'];
// Mavzu tartibi: ketma-ket videolar bir-biriga o'xshamasligi uchun qadam
const THEME_ORDER = [0, 4, 1, 7, 2, 6, 3, 5];

export const VIDEOS: VideoSpec[] = (() => {
  const out: VideoSpec[] = [];
  const rounds = Math.max(...GROUPS.map((g) => g.length));
  let k = 0;
  for (let r = 0; r < rounds; r++) {
    for (let g = 0; g < GROUPS.length; g++) {
      const e = GROUPS[g][r];
      if (!e) continue;
      out.push({
        ...e,
        id: String(k + 1).padStart(3, '0'),
        theme: THEME_ORDER[(k + Math.floor(k / 8)) % THEME_ORDER.length],
        bg: BGS[(k * 5 + Math.floor(k / 6)) % BGS.length],
        music: (k % 6) + 1,
        hookStyle: HOOKS[(k + Math.floor(k / 4)) % HOOKS.length],
        transition: TRANS[(k + Math.floor(k / 3)) % TRANS.length],
      });
      k++;
    }
  }
  return out;
})();

export const getVideo = (id: string): VideoSpec => {
  const v = VIDEOS.find((x) => x.id === id);
  if (!v) throw new Error('Video topilmadi: ' + id);
  return v;
};
