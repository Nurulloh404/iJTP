import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT, Theme } from '../theme';
import { usePop, useSoft } from '../lib/anim';
import { Pill, Rich, grad, onAccent } from '../lib/ui';
import { Sfx } from '../lib/Sfx';

export const CTA_FRAMES = 120;

export const Cta: React.FC<{ theme: Theme; line: string }> = ({ theme, line }) => {
  const frame = useCurrentFrame();
  const p = usePop(4, 10, 130);
  const t1 = useSoft(18, 16);
  const t2 = useSoft(30, 16);
  const t3 = usePop(44, 12, 160);
  const pulse = (frame % 40) / 40;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 330, width: 920, textAlign: 'center', fontSize: 74, fontWeight: 900, color: theme.text, lineHeight: 1.1, letterSpacing: -1.5, opacity: t1, transform: `translateY(${(1 - t1) * 40}px)` }}>
        <Rich text={line} theme={theme} />
      </div>
      <div style={{ position: 'absolute', top: 700, width: 420, height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[0, 1].map((i) => {
          const ph = (pulse + i * 0.5) % 1;
          return <div key={i} style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: `6px solid ${theme.accent}`, opacity: (1 - ph) * 0.6, transform: `scale(${1 + ph * 0.7})` }} />;
        })}
        <div style={{ width: 340, height: 340, borderRadius: '50%', background: grad(theme), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p * (1 + Math.sin(frame / 7) * 0.025)})`, boxShadow: `0 26px 90px ${theme.accent}77`, position: 'relative' }}>
          <div style={{ position: 'absolute', width: 190, height: 34, borderRadius: 17, background: onAccent(theme), transform: `scaleX(${interpolate(p, [0, 1], [0, 1])})` }} />
          <div style={{ position: 'absolute', width: 34, height: 190, borderRadius: 17, background: onAccent(theme), transform: `scaleY(${interpolate(p, [0, 1], [0, 1])})` }} />
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1170, width: 920, textAlign: 'center', fontSize: 66, fontWeight: 800, color: theme.text, opacity: t2, transform: `translateY(${(1 - t2) * 40}px)`, lineHeight: 1.15 }}>
        Izohda <span style={{ color: theme.accent }}>“+”</span> qoldiring
      </div>
      <div style={{ position: 'absolute', top: 1320, transform: `scale(${t3})`, opacity: t3 }}>
        <Pill theme={theme} text="Bepul konsultatsiya" icon="gift" size={44} solid />
      </div>
      <Sfx name="pop" at={4} volume={0.5} />
      <Sfx name="success" at={44} volume={0.45} />
    </AbsoluteFill>
  );
};
