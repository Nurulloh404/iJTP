import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT, Theme } from '../theme';
import { usePop, useSoft } from '../lib/anim';
import { Icon } from '../lib/Icon';
import { Pill, cardStyle } from '../lib/ui';
import { Sfx } from '../lib/Sfx';
import { listTimes } from './List';
import type { CheckT } from '../content/types';
import type { Timing } from '../lib/voice';

export const checkDuration = (b: CheckT, tm?: Timing) => (tm ? tm.total : listTimes(b.items).end + (b.footer ? 120 : 80));

export const Check: React.FC<{ theme: Theme; b: CheckT; timing?: Timing }> = ({ theme, b, timing }) => {
  const frame = useCurrentFrame();
  const tm = listTimes(b.items, timing);
  const h = useSoft(0, 16);
  const fp = usePop(tm.end + 6, 12, 140);
  const n = b.items.length;
  const rowH = n <= 4 ? 200 : n === 5 ? 178 : 154;
  const col = b.negative ? theme.bad : theme.good;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: 60, width: 960, top: 255, textAlign: 'center', fontSize: 56, fontWeight: 900, color: theme.text, lineHeight: 1.1, opacity: h, transform: `translateY(${(1 - h) * -30}px)`, letterSpacing: -1 }}>
        {b.heading}
      </div>
      {b.items.map((it, i) => {
        const at = tm.out[i];
        const p = usePop(at, 14, 150);
        const tick = usePop(at + 8, 9, 200);
        const draw = interpolate(frame - (at + 8), [0, 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={i} data-fixed={`chk${i}`} style={{ position: 'absolute', left: 60, top: 390 + i * (rowH + 18), width: 960, height: rowH, ...cardStyle(theme), border: `2px solid ${frame >= at + 8 ? col + 'aa' : theme.line}`, display: 'flex', alignItems: 'center', gap: 30, padding: '0 36px', opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 120}px)` }}>
            <div style={{ width: 92, height: 92, borderRadius: 28, border: `4px solid ${col}`, background: frame >= at + 8 ? col : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `scale(${frame >= at + 8 ? 0.8 + 0.2 * tick : 1})` }}>
              {frame >= at + 8 && (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={theme.light ? '#fff' : '#06130d'} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  {b.negative ? <path d="M18 6L6 18M6 6l12 12" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} /> : <path d="M20 6L9 17l-5-5" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />}
                </svg>
              )}
            </div>
            <div>
              <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, letterSpacing: -0.8 }}>{it.t}</div>
              {it.d && <div style={{ fontSize: 34, fontWeight: 600, color: theme.cardMuted, lineHeight: 1.2, marginTop: 6 }}>{it.d}</div>}
            </div>
          </div>
        );
      })}
      {b.footer && (
        <div style={{ position: 'absolute', left: 60, width: 960, top: 390 + n * (rowH + 18) + 18, display: 'flex', justifyContent: 'center', opacity: fp, transform: `scale(${0.9 + 0.1 * fp})` }}>
          <Pill theme={theme} text={b.footer} size={40} solid color={col} />
        </div>
      )}
      {tm.out.map((a, i) => (
        <React.Fragment key={i}>
          <Sfx name="swipe" at={a} volume={0.25} />
          <Sfx name={b.negative ? 'error' : 'tick'} at={a + 8} volume={0.45} />
        </React.Fragment>
      ))}
      <Sfx name={b.negative ? 'pop' : 'success'} at={tm.end + 6} volume={0.4} />
    </AbsoluteFill>
  );
};
