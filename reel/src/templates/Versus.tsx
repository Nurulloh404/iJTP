import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FONT, Theme } from '../theme';
import { usePop, useSoft } from '../lib/anim';
import { Icon } from '../lib/Icon';
import { Pill, cardStyle } from '../lib/ui';
import { Sfx } from '../lib/Sfx';
import type { VersusT } from '../content/types';
import type { Timing } from '../lib/voice';

const ROW = 58;
export const versusDuration = (b: VersusT, tm?: Timing) => (tm ? tm.total : 44 + b.rows.length * ROW + (b.footer ? 130 : 90));

export const Versus: React.FC<{ theme: Theme; b: VersusT; timing?: Timing }> = ({ theme, b, timing }) => {
  const frame = useCurrentFrame();
  const h = usePop(4, 14, 150);
  const rowAt = (i: number) => (timing ? timing.start[i] : 44 + i * ROW);
  const fp = usePop(timing ? timing.start[b.rows.length - 1] + 70 : 44 + b.rows.length * ROW + 6, 12, 140);
  const n = b.rows.length;
  const rowH = n <= 3 ? 250 : n === 4 ? 215 : 178;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: 60, top: 260, width: 960, display: 'flex', gap: 24, opacity: h, transform: `translateY(${(1 - h) * -30}px)` }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Pill theme={theme} text={b.left} icon="x" color={theme.bad} size={44} />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Pill theme={theme} text={b.right} icon="check" color={theme.good} size={44} solid />
        </div>
      </div>
      {b.rows.map((r, i) => {
        const at = rowAt(i);
        const pl = usePop(at, 14, 150);
        const pr = usePop(at + 12, 14, 150);
        const top = 400 + i * (rowH + 22);
        return (
          <div key={i} style={{ position: 'absolute', left: 60, top, width: 960, height: rowH, display: 'flex', gap: 24 }}>
            <div data-fixed={`vl${i}`} style={{ flex: 1, ...cardStyle(theme), border: `2px solid ${theme.bad}66`, padding: '0 30px', display: 'flex', alignItems: 'center', gap: 16, opacity: Math.min(1, pl * 1.6), transform: `translateX(${(1 - pl) * -90}px)` }}>
              <Icon name="x" size={40} color={theme.bad} stroke={3} />
              <div style={{ fontSize: 40, fontWeight: 700, color: theme.cardMuted, lineHeight: 1.18 }}>{r.l}</div>
            </div>
            <div data-fixed={`vr${i}`} style={{ flex: 1, ...cardStyle(theme), border: `3px solid ${theme.good}`, padding: '0 30px', display: 'flex', alignItems: 'center', gap: 16, opacity: Math.min(1, pr * 1.6), transform: `translateX(${(1 - pr) * 90}px) scale(${0.95 + 0.05 * pr})` }}>
              <Icon name="check" size={44} color={theme.good} stroke={3.2} />
              <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.18 }}>{r.r}</div>
            </div>
          </div>
        );
      })}
      {b.footer && (
        <div style={{ position: 'absolute', left: 60, width: 960, top: 400 + n * (rowH + 22) + 24, display: 'flex', justifyContent: 'center', opacity: fp, transform: `scale(${0.9 + 0.1 * fp})` }}>
          <Pill theme={theme} text={b.footer} size={40} solid />
        </div>
      )}
      {b.rows.map((_, i) => (
        <React.Fragment key={i}>
          <Sfx name="tick" at={rowAt(i)} volume={0.4} />
          <Sfx name="pop" at={rowAt(i) + 12} volume={0.45} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
