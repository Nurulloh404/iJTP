import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FONT, Theme } from '../theme';
import { usePop, useSoft } from '../lib/anim';
import { Pill, cardStyle, grad, onAccent } from '../lib/ui';
import { Sfx } from '../lib/Sfx';
import type { FaqT } from '../content/types';

const A_START = 70;
const CPF = 0.85; // kadrdagi belgi
export const faqDuration = (b: FaqT) => A_START + Math.round(b.a.length / CPF) + (b.takeaway ? 150 : 90);

export const Faq: React.FC<{ theme: Theme; b: FaqT }> = ({ theme, b }) => {
  const frame = useCurrentFrame();
  const qp = usePop(4, 14, 140);
  const ap = usePop(A_START - 12, 14, 150);
  const typed = Math.max(0, Math.min(b.a.length, Math.floor((frame - A_START) * CPF)));
  const endAt = A_START + Math.round(b.a.length / CPF);
  const tp = usePop(endAt + 10, 12, 140);
  const shown = b.a.slice(0, typed);
  const rest = b.a.slice(typed);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: 60, top: 270, width: 960, ...cardStyle(theme), border: `3px solid ${theme.accent}`, padding: '44px 46px 52px', opacity: Math.min(1, qp * 1.5), transform: `scale(${0.92 + 0.08 * qp})`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 20, top: -70, fontSize: 420, fontWeight: 900, color: theme.accent, opacity: 0.12, lineHeight: 1 }}>?</div>
        <Pill theme={theme} text="Savol" size={30} solid />
        <div style={{ marginTop: 28, fontSize: 68, fontWeight: 900, lineHeight: 1.1, letterSpacing: -1.5, position: 'relative' }}>{b.q}</div>
      </div>
      <div style={{ position: 'absolute', left: 60, top: 760, width: 960, ...cardStyle(theme), padding: '44px 46px 52px', opacity: Math.min(1, ap * 1.5), transform: `translateY(${(1 - ap) * 50}px)` }}>
        <Pill theme={theme} text="Javob" size={30} solid color={theme.good} />
        <div style={{ marginTop: 28, fontSize: 46, fontWeight: 600, lineHeight: 1.28 }}>
          {shown}
          <span style={{ opacity: 0 }}>{rest}</span>
          {typed < b.a.length && frame > A_START && <span style={{ position: 'absolute', marginLeft: 4, width: 6, height: 46, background: theme.accent, transform: 'translateY(6px)' }} />}
        </div>
      </div>
      {b.takeaway && (
        <div style={{ position: 'absolute', left: 60, width: 960, bottom: 380, display: 'flex', justifyContent: 'center', opacity: tp, transform: `scale(${0.9 + 0.1 * tp})` }}>
          <div style={{ padding: '26px 44px', borderRadius: 40, background: grad(theme), color: onAccent(theme), fontSize: 42, fontWeight: 900, textAlign: 'center', lineHeight: 1.15 }}>{b.takeaway}</div>
        </div>
      )}
      <Sfx name="pop" at={4} volume={0.45} />
      <Sfx name="swipe" at={A_START - 12} volume={0.3} />
      {Array.from({ length: Math.ceil(b.a.length / 6) }, (_, i) => (i % 2 === 0 ? <Sfx key={i} name="type" at={A_START + Math.round((i * 6) / CPF)} volume={0.14} /> : null))}
      {b.takeaway && <Sfx name="ding" at={endAt + 10} volume={0.4} />}
    </AbsoluteFill>
  );
};
