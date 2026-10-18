import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { FONT, Theme } from '../theme';
import { usePop, useSoft } from '../lib/anim';
import { Icon } from '../lib/Icon';
import { Pill, cardStyle, grad, onAccent } from '../lib/ui';
import { Sfx } from '../lib/Sfx';
import type { ClockT } from '../content/types';

const toMin = (s: string) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};
const mono = (events: ClockT['events']) => {
  let prev = -1;
  let add = 0;
  return events.map((e) => {
    let m = toMin(e.time) + add;
    if (m < prev) {
      add += 1440;
      m += 1440;
    }
    prev = m;
    return m;
  });
};
const gapFor = (text: string) => Math.round(Math.min(96, 44 + text.length * 0.7));
export const clockTimes = (b: ClockT) => {
  let at = 34;
  const out = b.events.map((e) => {
    const a = at;
    at += gapFor(e.text);
    return a;
  });
  return { out, end: at };
};
export const clockDuration = (b: ClockT) => clockTimes(b).end + (b.footer ? 120 : 76);

const pad = (n: number) => String(n).padStart(2, '0');

export const Clock: React.FC<{ theme: Theme; b: ClockT }> = ({ theme, b }) => {
  const frame = useCurrentFrame();
  const tm = clockTimes(b);
  const mins = mono(b.events);
  const h = usePop(2, 14, 140);
  // joriy daqiqa: tadbir paydo bo'lishi bilan keyingi vaqtga siljiydi
  const xs: number[] = [0];
  const ys: number[] = [mins[0]];
  b.events.forEach((_, i) => {
    xs.push(Math.max(xs[xs.length - 1] + 1, tm.out[i] - 10));
    ys.push(mins[i]);
    xs.push(Math.max(xs[xs.length - 1] + 1, tm.out[i] + 4));
    ys.push(mins[i]);
  });
  const cur = interpolate(frame, xs, ys, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const m = Math.round(cur) % 1440;
  const hh = Math.floor(m / 60);
  const night = hh >= 21 || hh < 6;
  const fp = usePop(tm.end + 4, 12, 140);
  const n = b.events.length;
  const evH = n <= 4 ? 170 : n === 5 ? 140 : 120;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: 60, width: 960, top: 255, textAlign: 'center', fontSize: 50, fontWeight: 800, color: theme.muted, opacity: h }}>{b.heading}</div>
      <div style={{ position: 'absolute', left: 60, top: 340, width: 960, height: 330, ...cardStyle(theme), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, transform: `scale(${0.9 + 0.1 * h})`, opacity: h }}>
        <div style={{ width: 120, height: 120, borderRadius: 36, background: grad(theme), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={night ? 'moon' : 'sun'} size={70} color={onAccent(theme)} stroke={2} />
        </div>
        <div style={{ fontSize: 230, fontWeight: 900, letterSpacing: -6, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {pad(hh)}
          <span style={{ opacity: Math.floor(frame / 15) % 2 ? 0.25 : 1, color: theme.accent }}>:</span>
          {pad(m % 60)}
        </div>
      </div>
      {b.events.map((e, i) => {
        const p = usePop(tm.out[i], 14, 150);
        const bot = e.who === 'b';
        const owner = e.who === 'o';
        const col = bot ? theme.accent : owner ? '#2aabee' : theme.cardMuted;
        const who = bot ? 'Bot' : owner ? 'Egasi' : 'Mijoz';
        return (
          <div key={i} data-fixed={`ev${i}`} style={{ position: 'absolute', left: 60, top: 700 + i * (evH + 16), width: 960, height: evH, ...cardStyle(theme), border: `${bot ? 3 : 2}px solid ${bot ? theme.accent : owner ? '#2aabee' : theme.line}`, display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px', opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 60}px) scale(${0.94 + 0.06 * p})` }}>
            <div style={{ minWidth: 150, padding: '12px 0', textAlign: 'center', borderRadius: 24, background: `${col}22`, color: col, fontSize: 40, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{e.time}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: col, letterSpacing: 1.5, textTransform: 'uppercase' }}>{who}</div>
              <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.2 }}>{e.text}</div>
            </div>
          </div>
        );
      })}
      {b.footer && (
        <div style={{ position: 'absolute', left: 60, width: 960, top: 700 + n * (evH + 16) + 14, display: 'flex', justifyContent: 'center', opacity: fp, transform: `scale(${0.9 + 0.1 * fp})` }}>
          <Pill theme={theme} text={b.footer} size={40} solid />
        </div>
      )}
      {tm.out.map((a, i) => (
        <Sfx key={i} name={b.events[i].who === 'o' ? 'notify' : 'pop'} at={a} volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};
