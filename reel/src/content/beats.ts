import type { Body } from './types';

/** Diktor matnidagi "beat"lar soni (hook va CTA'dan tashqari): har element uchun bittadan. */
export const beatCount = (b: Body): number => {
  switch (b.kind) {
    case 'chat': return b.msgs.length + (b.notify ? 1 : 0);
    case 'flow': return b.nodes.length;
    case 'versus': return b.rows.length;
    case 'list':
    case 'steps':
    case 'check': return b.items.length;
    case 'clock': return b.events.length;
    case 'calc': return b.factors.length + 1;
    case 'faq': return b.takeaway ? 2 : 1;
    case 'story': return b.lines.length;
  }
};
