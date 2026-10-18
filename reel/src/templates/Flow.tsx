import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT, Theme } from '../theme';
import { usePop, useSoft, clamp01 } from '../lib/anim';
import { Icon } from '../lib/Icon';
import { Pill, cardStyle, grad, onAccent } from '../lib/ui';
import { Sfx } from '../lib/Sfx';
import type { FlowT } from '../content/types';

const STEP = 36;
export const flowDuration = (b: FlowT) => 20 + b.nodes.length * STEP + (b.footer ? 130 : 90);

export const Flow: React.FC<{ theme: Theme; b: FlowT }> = ({ theme, b }) => {
  const frame = useCurrentFrame();
  const n = b.nodes.length;
  const nodeH = n <= 3 ? 230 : n === 4 ? 200 : 168;
  const gap = n <= 4 ? 70 : 56;
  const total = n * nodeH + (n - 1) * gap;
  const top = 300 + Math.max(0, (1050 - total) / 2);
  const railX = 60 + 36 + 56;
  const done = 20 + n * STEP;
  const footP = usePop(done + 10, 12, 140);
  // paket aylanib yuradi
  const cyc = 70;
  const pk = ((frame - done) % cyc) / cyc;
  const pkOn = frame > done;
  const pkY = top + 56 + pk * (total - 112);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {b.nodes.slice(0, -1).map((_, i) => {
        const y0 = top + i * (nodeH + gap) + nodeH;
        const start = 20 + i * STEP + 18;
        const fill = clamp01((frame - start) / 22);
        return (
          <div key={i} style={{ position: 'absolute', left: railX - 4, top: y0 - 2, width: 8, height: gap + 4, borderRadius: 4, background: theme.line, overflow: 'hidden' }}>
            <div style={{ width: 8, height: `${fill * 100}%`, background: grad(theme, 180), borderRadius: 4 }} />
          </div>
        );
      })}
      {b.nodes.map((nd, i) => {
        const at = 20 + i * STEP;
        const p = usePop(at, 13, 150);
        const last = i === n - 1;
        return (
          <div key={i} data-fixed={`flow${i}`} style={{ position: 'absolute', left: 60, top: top + i * (nodeH + gap), width: 960, height: nodeH, ...cardStyle(theme), display: 'flex', alignItems: 'center', gap: 32, padding: '0 36px', opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * (i % 2 ? 160 : -160)}px) scale(${0.92 + 0.08 * p})`, border: last && frame > done ? `3px solid ${theme.accent}` : `2px solid ${theme.line}` }}>
            <div style={{ width: 112, height: 112, borderRadius: 32, background: grad(theme, 135 + i * 25), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={nd.icon} size={64} color={onAccent(theme)} stroke={2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.08, letterSpacing: -1 }}>{nd.title}</div>
              <div style={{ fontSize: 36, fontWeight: 600, color: theme.cardMuted, lineHeight: 1.2, marginTop: 6 }}>{nd.sub}</div>
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: theme.accent, opacity: 0.9 }}>{i + 1}</div>
          </div>
        );
      })}
      {pkOn && (
        <div style={{ position: 'absolute', left: railX - 14, top: pkY - 14, width: 28, height: 28, borderRadius: '50%', background: theme.accent2, boxShadow: `0 0 36px 10px ${theme.accent2}aa` }} />
      )}
      {b.footer && (
        <div style={{ position: 'absolute', left: 60, width: 960, top: top + total + 56, display: 'flex', justifyContent: 'center', opacity: footP, transform: `scale(${0.9 + 0.1 * footP})` }}>
          <Pill theme={theme} text={b.footer} icon="check" size={40} solid color={theme.good} />
        </div>
      )}
      {b.nodes.map((_, i) => (
        <Sfx key={i} name="pop" at={20 + i * STEP} volume={0.4} />
      ))}
      <Sfx name="success" at={done + 10} volume={0.4} />
    </AbsoluteFill>
  );
};
