import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Theme, W, H } from '../theme';
import { seeded } from './anim';

export type BgStyle = 'blobs' | 'grid' | 'rays' | 'dots' | 'stripes' | 'rings';

export const Background: React.FC<{ theme: Theme; style: BgStyle; seed: number }> = ({ theme, style, seed }) => {
  const frame = useCurrentFrame();
  const r = seeded(seed * 7919 + 13);
  const t = frame / 30;
  const base: React.CSSProperties = { background: `linear-gradient(${160 + Math.floor(r() * 40)}deg, ${theme.bg1} 0%, ${theme.bg2} 100%)` };
  const a1 = theme.accent;
  const a2 = theme.accent2;
  const alpha = theme.light ? '22' : '2e';

  const blobs = Array.from({ length: 3 }, (_, i) => {
    const x = r() * W;
    const y = r() * H;
    const size = 700 + r() * 500;
    const col = i % 2 ? a2 : a1;
    const dx = Math.sin(t * 0.5 + i * 2) * 90;
    const dy = Math.cos(t * 0.4 + i * 3) * 120;
    return (
      <div key={i} style={{ position: 'absolute', left: x - size / 2 + dx, top: y - size / 2 + dy, width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${col}${alpha} 0%, ${col}00 68%)` }} />
    );
  });

  let deco: React.ReactNode = null;
  if (style === 'grid') {
    const off = (t * 20) % 90;
    deco = (
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${theme.line}55 2px, transparent 2px), linear-gradient(90deg, ${theme.line}55 2px, transparent 2px)`, backgroundSize: '90px 90px', backgroundPosition: `0px ${off}px`, opacity: 0.55 }} />
    );
  } else if (style === 'dots') {
    const off = (t * 14) % 60;
    deco = <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${theme.line}99 3px, transparent 3.5px)`, backgroundSize: '60px 60px', backgroundPosition: `${off}px ${off}px`, opacity: 0.7 }} />;
  } else if (style === 'stripes') {
    deco = <div style={{ position: 'absolute', inset: -300, transform: 'rotate(-18deg)', backgroundImage: `repeating-linear-gradient(90deg, ${theme.line}33 0px, ${theme.line}33 80px, transparent 80px, transparent 160px)` }} />;
  } else if (style === 'rays') {
    const rot = t * 4;
    deco = (
      <div style={{ position: 'absolute', left: W / 2 - 1600, top: H * 0.38 - 1600, width: 3200, height: 3200, transform: `rotate(${rot}deg)`, background: `repeating-conic-gradient(from 0deg, ${a1}${theme.light ? '14' : '1c'} 0deg 9deg, transparent 9deg 24deg)`, WebkitMaskImage: 'radial-gradient(circle, black 10%, transparent 55%)', maskImage: 'radial-gradient(circle, black 10%, transparent 55%)' }} />
    );
  } else if (style === 'rings') {
    deco = (
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const rr = 220 + i * 190 + ((t * 24) % 190);
          const op = interpolate(rr, [220, 1200], [0.5, 0], { extrapolateRight: 'clamp' });
          return <circle key={i} cx={W / 2} cy={H * 0.42} r={rr} fill="none" stroke={a1} strokeOpacity={op * 0.5} strokeWidth={3} />;
        })}
      </svg>
    );
  }
  return (
    <AbsoluteFill style={base}>
      {blobs}
      {deco}
    </AbsoluteFill>
  );
};
