import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FONT, Theme } from '../theme';
import { usePop, useSoft, clamp01 } from '../lib/anim';
import { Pill, grad, onAccent } from '../lib/ui';
import { Sfx } from '../lib/Sfx';
import { listTimes } from './List';
import type { StepsT } from '../content/types';

export const stepsDuration = (b: StepsT) => listTimes(b.items).end + (b.footer ? 120 : 80);

export const Steps: React.FC<{ theme: Theme; b: StepsT }> = ({ theme, b }) => {
  const frame = useCurrentFrame();
  const tm = listTimes(b.items);
  const h = useSoft(0, 16);
  const fp = usePop(tm.end + 6, 12, 140);
  const n = b.items.length;
  const rowH = n <= 3 ? 330 : n === 4 ? 270 : 220;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: 60, width: 960, top: 255, textAlign: 'center', fontSize: 56, fontWeight: 900, color: theme.text, lineHeight: 1.1, opacity: h, transform: `translateY(${(1 - h) * -30}px)`, letterSpacing: -1 }}>
        {b.heading}
      </div>
      {b.items.map((it, i) => {
        const at = tm.out[i];
        const p = usePop(at, 13, 150);
        const lineFill = clamp01((frame - (at + 10)) / 26);
        const top = 420 + i * rowH;
        return (
          <div key={i} data-fixed={`step${i}`} style={{ position: 'absolute', left: 80, top, width: 920, height: rowH }}>
            {i < n - 1 && (
              <div style={{ position: 'absolute', left: 56 - 5, top: 118, width: 10, height: rowH - 124, borderRadius: 5, background: theme.line, overflow: 'hidden' }}>
                <div style={{ width: '100%', height: `${lineFill * 100}%`, background: grad(theme, 180) }} />
              </div>
            )}
            <div style={{ position: 'absolute', left: 0, top: 0, width: 112, height: 112, borderRadius: '50%', background: grad(theme, 135 + i * 30), color: onAccent(theme), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 62, fontWeight: 900, transform: `scale(${p})`, boxShadow: `0 10px 40px ${theme.accent}55` }}>{i + 1}</div>
            <div style={{ position: 'absolute', left: 150, top: -2, width: 770, opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 70}px)` }}>
              <div style={{ fontSize: 56, fontWeight: 900, color: theme.text, lineHeight: 1.08, letterSpacing: -1 }}>{it.t}</div>
              {it.d && <div style={{ fontSize: 38, fontWeight: 600, color: theme.muted, lineHeight: 1.24, marginTop: 10 }}>{it.d}</div>}
            </div>
          </div>
        );
      })}
      {b.footer && (
        <div style={{ position: 'absolute', left: 60, width: 960, top: 420 + n * rowH - 10, display: 'flex', justifyContent: 'center', opacity: fp, transform: `scale(${0.9 + 0.1 * fp})` }}>
          <Pill theme={theme} text={b.footer} icon="check" size={40} solid color={theme.good} />
        </div>
      )}
      {tm.out.map((a, i) => (
        <React.Fragment key={i}>
          <Sfx name="pop" at={a} volume={0.45} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
