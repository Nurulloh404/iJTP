import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { fitSize } from '../lib/fit';
import { FONT, Theme } from '../theme';
import { balanceLine, parseRich, usePop } from '../lib/anim';
import { Sfx } from '../lib/Sfx';
import { grad, onAccent } from '../lib/ui';
import type { StoryT } from '../content/types';

const dwell = (text: string) => Math.round(Math.max(66, 42 + text.replace(/[\n*]/g, '').length * 1.55));
export const storyTimes = (b: StoryT) => {
  let at = 6;
  const out = b.lines.map((l) => {
    const a = at;
    at += dwell(l.text);
    return { at: a, len: dwell(l.text) };
  });
  const lastItem = out[out.length - 1];
  lastItem.len += 56; // oxirgi jumla sahna oxirigacha ko'rinib turadi
  return { out, end: at + 56 };
};
export const storyDuration = (b: StoryT) => storyTimes(b).end;

const Line: React.FC<{ theme: Theme; text: string; style: 'big' | 'quiet' | 'accent'; len: number; last: boolean }> = ({ theme, text, style, len, last }) => {
  const frame = useCurrentFrame();
  const lines = style === 'quiet' ? text.split('\n') : text.split('\n').flatMap((l) => balanceLine(l, 17));
  const plain = lines.map((l) => l.replace(/\*/g, ''));
  const maxW = 900;
  const cap = style === 'quiet' ? 78 : style === 'accent' ? 132 : 150;
  const size = Math.max(60, Math.min(cap, ...plain.map((l) => fitSize(l, maxW, style === 'quiet' ? '700' : '900'))));
  const out = last ? 1 : interpolate(frame, [len - 10, len], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const color = style === 'quiet' ? theme.muted : style === 'accent' ? theme.accent : theme.text;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily: FONT, opacity: out, transform: `translateY(${(1 - out) * -50}px)` }}>
      <div style={{ width: 920, textAlign: 'center', fontSize: size, fontWeight: style === 'quiet' ? 700 : 900, lineHeight: 1.1, letterSpacing: style === 'quiet' ? -0.5 : -2.5, color }}>
        {lines.map((l, li) => {
          const p = usePop(li * 8, 14, 150);
          return (
            <div key={li} style={{ opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 50}px) scale(${0.9 + 0.1 * p})` }}>
              {parseRich(l).map((pt, i) => (
                <span key={i} style={pt.a ? { color: style === 'accent' ? theme.text : theme.accent2 } : undefined}>
                  {pt.t}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Story: React.FC<{ theme: Theme; b: StoryT }> = ({ theme, b }) => {
  const tm = storyTimes(b);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {b.lines.map((l, i) => (
        <Sequence key={i} from={tm.out[i].at} durationInFrames={tm.out[i].len}>
          <Line theme={theme} text={l.text} style={l.style ?? 'big'} len={tm.out[i].len} last={i === b.lines.length - 1} />
          <Sfx name={l.style === 'accent' ? 'slam' : 'whoosh'} at={0} volume={l.style === 'accent' ? 0.4 : 0.22} />
        </Sequence>
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1500, display: 'flex', justifyContent: 'center', gap: 16 }}>
        {b.lines.map((_, i) => {
          const active = frame >= tm.out[i].at;
          return <div key={i} style={{ width: active ? 46 : 18, height: 18, borderRadius: 9, background: active ? theme.accent : theme.line, transition: 'none' }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};
