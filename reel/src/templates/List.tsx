import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT, Theme } from '../theme';
import { usePop, useSoft } from '../lib/anim';
import { Pill, cardStyle, grad, onAccent } from '../lib/ui';
import { Sfx } from '../lib/Sfx';
import type { ListT } from '../content/types';

export const itemGap = (t: string, d?: string) => Math.round(Math.min(96, 46 + (t.length + (d?.length ?? 0)) * 0.55));
export const listTimes = (items: { t: string; d?: string }[]) => {
  let at = 30;
  const out: number[] = [];
  items.forEach((it) => {
    out.push(at);
    at += itemGap(it.t, it.d);
  });
  return { out, end: at };
};
export const listDuration = (b: ListT) => listTimes(b.items).end + (b.footer ? 120 : 80);

export const List: React.FC<{ theme: Theme; b: ListT }> = ({ theme, b }) => {
  const tm = listTimes(b.items);
  const h = useSoft(0, 16);
  const fp = usePop(tm.end + 6, 12, 140);
  const n = b.items.length;
  const cardH = n <= 3 ? 290 : n === 4 ? 250 : 210;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: 60, width: 960, top: 255, textAlign: 'center', fontSize: 56, fontWeight: 900, color: theme.text, lineHeight: 1.1, opacity: h, transform: `translateY(${(1 - h) * -30}px)`, letterSpacing: -1 }}>
        {b.heading}
      </div>
      {b.items.map((it, i) => {
        const p = usePop(tm.out[i], 14, 150);
        return (
          <div key={i} data-fixed={`list${i}`} style={{ position: 'absolute', left: 60, top: 400 + i * (cardH + 24), width: 960, height: cardH, ...cardStyle(theme), display: 'flex', alignItems: 'center', gap: 30, padding: '0 36px', opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * (i % 2 ? 200 : -200)}px)` }}>
            <div style={{ width: 112, height: 112, borderRadius: '50%', background: grad(theme, 135 + i * 30), color: onAccent(theme), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, letterSpacing: -1 }}>{it.t}</div>
              {it.d && <div style={{ fontSize: 36, fontWeight: 600, color: theme.cardMuted, lineHeight: 1.22, marginTop: 8 }}>{it.d}</div>}
            </div>
          </div>
        );
      })}
      {b.footer && (
        <div style={{ position: 'absolute', left: 60, width: 960, top: 400 + n * (cardH + 24) + 20, display: 'flex', justifyContent: 'center', opacity: fp, transform: `scale(${0.9 + 0.1 * fp})` }}>
          <Pill theme={theme} text={b.footer} size={40} solid />
        </div>
      )}
      {tm.out.map((a, i) => (
        <Sfx key={i} name="pop" at={a} volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};
