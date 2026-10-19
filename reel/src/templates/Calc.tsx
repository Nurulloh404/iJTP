import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { FONT, Theme } from '../theme';
import { usePop, useSoft } from '../lib/anim';
import { Pill, cardStyle, grad, onAccent } from '../lib/ui';
import { Sfx } from '../lib/Sfx';
import type { CalcT } from '../content/types';
import type { Timing } from '../lib/voice';

const FSTEP = 62;
export const calcValue = (b: CalcT) => b.factors.reduce((a, f) => a * f.value, 1) / b.resultDiv;
export const fmt = (n: number) => {
  const r = n >= 100 ? Math.round(n) : Math.round(n * 10) / 10;
  const s = Number.isInteger(r) ? String(r) : String(r).replace('.', ',');
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
export const calcDuration = (b: CalcT, tm?: Timing) => (tm ? tm.total : 26 + b.factors.length * FSTEP + 70 + 150 + (b.footer ? 30 : 0));

export const Calc: React.FC<{ theme: Theme; b: CalcT; timing?: Timing }> = ({ theme, b, timing }) => {
  const frame = useCurrentFrame();
  const n = b.factors.length;
  const h = useSoft(0, 16);
  const factorAt = (i: number) => (timing ? timing.start[i] : 26 + i * FSTEP);
  const resAt = timing ? timing.start[n] : 26 + n * FSTEP + 14;
  const rp = usePop(resAt, 12, 120);
  const count = interpolate(frame, [resAt + 6, resAt + 56], [0, calcValue(b)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const fp = usePop(resAt + 70, 12, 140);
  const fH = n <= 3 ? 170 : 140;
  const opH = 46;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: 60, width: 960, top: 255, textAlign: 'center', fontSize: 52, fontWeight: 900, color: theme.text, opacity: h, lineHeight: 1.1 }}>{b.heading}</div>
      {b.factors.map((f, i) => {
        const at = factorAt(i);
        const p = usePop(at, 13, 150);
        const v = interpolate(frame, [at + 4, at + 26], [0, f.value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
        const top = 380 + i * (fH + opH);
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ position: 'absolute', left: 60, width: 960, top: top - opH + 2, height: opH, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 52, fontWeight: 900, color: theme.accent, opacity: p }}>×</div>
            )}
            <div data-fixed={`calc${i}`} style={{ position: 'absolute', left: 60, top, width: 960, height: fH, ...cardStyle(theme), display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', opacity: Math.min(1, p * 1.6), transform: `scale(${0.92 + 0.08 * p})` }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: theme.cardMuted, width: 440, lineHeight: 1.2 }}>{f.label}</div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 100, fontWeight: 900, color: theme.accent, fontVariantNumeric: 'tabular-nums', letterSpacing: -2 }}>{fmt(Math.round(v))}</span>
                <span style={{ fontSize: 40, fontWeight: 800, marginLeft: 12 }}>{f.unit}</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: 'absolute', left: 60, top: 380 + n * (fH + opH) + 4, width: 960, height: 400, borderRadius: 52, background: grad(theme), color: onAccent(theme), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${rp})`, opacity: Math.min(1, rp * 1.5), boxShadow: `0 24px 80px ${theme.accent}55` }}>
        <div style={{ fontSize: 42, fontWeight: 800, opacity: 0.9 }}>= {b.resultLabel}</div>
        <div style={{ fontSize: 210, fontWeight: 900, lineHeight: 1, letterSpacing: -6, fontVariantNumeric: 'tabular-nums', marginBottom: 22 }}>{fmt(count)}</div>
        <div style={{ fontSize: 56, fontWeight: 900 }}>{b.resultUnit}</div>
      </div>
      {b.footer && (
        <div style={{ position: 'absolute', left: 60, width: 960, top: 380 + n * (fH + opH) + 4 + 400 + 36, display: 'flex', justifyContent: 'center', opacity: fp, transform: `scale(${0.9 + 0.1 * fp})` }}>
          <Pill theme={theme} text={b.footer} size={36} />
        </div>
      )}
      {b.factors.map((_, i) => (
        <Sfx key={i} name="tick" at={factorAt(i)} volume={0.5} />
      ))}
      <Sfx name="whoosh" at={resAt} volume={0.35} />
      <Sfx name="ding" at={resAt + 52} volume={0.45} />
    </AbsoluteFill>
  );
};
