import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fitSize } from '../lib/fit';
import { FONT, Theme } from '../theme';
import { parseRich, usePop, useSoft } from '../lib/anim';
import { Icon, IconName } from '../lib/Icon';
import { Pill, grad, onAccent } from '../lib/ui';
import { Sfx } from '../lib/Sfx';

export const HOOK_FRAMES = 96;

export const Hook: React.FC<{ theme: Theme; text: string; tag: string; icon: IconName; style: 'pop' | 'rise' | 'type' | 'slam' }> = ({ theme, text, tag, icon, style }) => {
  const frame = useCurrentFrame();
  const lines = text.split('\n');
  const plain = lines.map((l) => l.replace(/\*/g, ''));
  const size = Math.max(
    74,
    Math.min(
      150,
      ...plain.map((l) => fitSize(l, 920, '900')),
    ),
  );
  const iconPop = usePop(2, 12, 120);
  const tagIn = useSoft(0, 14);
  const float = Math.sin(frame / 14) * 10;

  let charCount = 0;
  const totalChars = plain.join('').length;
  const typed = style === 'type' ? Math.floor(interpolate(frame, [10, 10 + totalChars * 1.2], [0, totalChars], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })) : totalChars;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: tagIn, transform: `translateY(${(1 - tagIn) * -30}px)` }}>
        <Pill theme={theme} text={tag} size={34} />
      </div>
      <div style={{ position: 'absolute', top: 480, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${iconPop}) translateY(${float}px)` }}>
        <div style={{ width: 210, height: 210, borderRadius: 64, background: grad(theme), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 24px 80px ${theme.accent}66` }}>
          <Icon name={icon} size={118} color={onAccent(theme)} stroke={1.8} />
        </div>
      </div>
      <div style={{ position: 'absolute', top: 830, left: 80, right: 80, textAlign: 'center', color: theme.text, fontWeight: 900, fontSize: size, lineHeight: 1.08, letterSpacing: -2 }}>
        {lines.map((line, li) => {
          const delay = 8 + li * (style === 'slam' ? 14 : 9);
          const p = usePop(delay, style === 'slam' ? 9 : 13, style === 'slam' ? 220 : 150);
          const rise = interpolate(frame - delay, [0, 14], [110, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const parts = parseRich(line);
          const start = charCount;
          charCount += line.replace(/\*/g, '').length;
          let acc = start;
          const content = parts.map((pt, i) => {
            const s = acc;
            acc += pt.t.length;
            const shown = style === 'type' ? pt.t.slice(0, Math.max(0, Math.min(pt.t.length, typed - s))) : pt.t;
            const hidden = style === 'type' ? pt.t.slice(shown.length) : '';
            return (
              <span key={i} style={pt.a ? { color: theme.accent } : undefined}>
                {shown}
                <span style={{ opacity: 0 }}>{hidden}</span>
              </span>
            );
          });
          if (style === 'rise') {
            return (
              <div key={li} style={{ overflow: 'hidden', paddingBottom: 12, marginBottom: -12 }}>
                <div style={{ transform: `translateY(${rise}%)` }}>{content}</div>
              </div>
            );
          }
          if (style === 'slam') {
            const sc = interpolate(p, [0, 1], [2.6, 1]);
            const shake = frame - delay > 0 && frame - delay < 8 ? Math.sin((frame - delay) * 3) * 8 : 0;
            return (
              <div key={li} style={{ opacity: Math.min(1, p * 2), transform: `scale(${sc}) translateX(${shake}px)` }}>
                {content}
              </div>
            );
          }
          if (style === 'type') return (
            <div key={li}>
              {content}
              {li === lines.length - 1 && <span style={{ display: 'inline-block', width: 10, height: size * 0.78, background: theme.accent, opacity: Math.floor(frame / 8) % 2, marginLeft: 8, verticalAlign: 'baseline' }} />}
            </div>
          );
          return (
            <div key={li} style={{ opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})` }}>
              {content}
            </div>
          );
        })}
      </div>
      {style === 'slam' ? lines.map((_, i) => <Sfx key={i} name="slam" at={8 + i * 14} volume={0.45} />) : <Sfx name="whoosh" at={4} volume={0.35} />}
      {style === 'type' && Array.from({ length: Math.min(14, Math.ceil(totalChars / 3)) }, (_, i) => <Sfx key={i} name="type" at={12 + i * 4} volume={0.25} />)}
    </AbsoluteFill>
  );
};
