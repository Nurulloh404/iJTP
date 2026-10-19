import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT, Theme } from '../theme';
import { usePop, useSoft } from '../lib/anim';
import { Icon } from '../lib/Icon';
import { Pill, cardStyle, grad, onAccent } from '../lib/ui';
import { Sfx } from '../lib/Sfx';
import type { ChatT } from '../content/types';
import type { Timing } from '../lib/voice';

const read = (s: string) => Math.round(Math.min(84, 22 + s.length * 0.85));

export const chatTimes = (b: ChatT, tm?: Timing) => {
  if (tm) {
    const rows = b.msgs.map((m, i) => {
      const at = tm.start[i];
      if (m.from === 'c') return { at, typing: -1 };
      return { at, typing: Math.max(i > 0 ? tm.start[i - 1] + 16 : 0, at - 30) };
    });
    const notifyAt = b.notify ? tm.start[b.msgs.length] : tm.start[b.msgs.length - 1] + 40;
    return { rows, notifyAt, end: tm.total };
  }
  let t = 18;
  const rows = b.msgs.map((m) => {
    if (m.from === 'c') {
      const at = t;
      t = at + 14 + read(m.text);
      return { at, typing: -1 };
    }
    const typing = t;
    const at = typing + 32;
    t = at + 14 + read(m.text);
    return { at, typing };
  });
  const notifyAt = t + 8;
  return { rows, notifyAt, end: notifyAt + (b.notify ? 100 : 56) };
};
export const chatDuration = (b: ChatT, tm?: Timing) => chatTimes(b, tm).end;

const Bubble: React.FC<{ theme: Theme; b: ChatT; m: ChatT['msgs'][number]; at: number; typing: number; first: boolean }> = ({ theme, b, m, at, typing, first }) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 13, 170);
  const bot = m.from === 'b';
  const insta = b.platform === 'instagram';
  const botBg = insta ? 'linear-gradient(135deg,#7c3aed,#db2777)' : 'linear-gradient(135deg,#2aabee,#1c86c8)';
  const clientBg = theme.light ? '#eceef5' : 'rgba(255,255,255,0.1)';
  const showTyping = bot && frame >= typing && frame < at;
  const lbl = useSoft(at + 16, 14);
  return (
    <div data-slot style={{ position: 'relative', display: 'flex', justifyContent: bot ? 'flex-end' : 'flex-start', minHeight: 96 }}>
      {showTyping && (
        <div style={{ position: 'absolute', right: 0, top: 0, background: botBg, borderRadius: '38px 38px 10px 38px', padding: '28px 38px', display: 'flex', gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', opacity: 0.45 + 0.55 * Math.max(0, Math.sin((frame - typing) / 3.2 - i * 0.9)) }} />
          ))}
        </div>
      )}
      <div style={{ opacity: frame >= at ? Math.min(1, p * 1.6) : 0, transform: `translateY(${(1 - p) * 34}px) scale(${0.88 + 0.12 * p})`, transformOrigin: bot ? 'right bottom' : 'left bottom', maxWidth: 700, background: bot ? botBg : clientBg, color: bot ? '#fff' : theme.cardText, borderRadius: bot ? '38px 38px 10px 38px' : '38px 38px 38px 10px', padding: '24px 34px', fontSize: 40, lineHeight: 1.28, fontWeight: 600 }}>
        {m.text}
        {bot && first && b.replyLabel && (
          <div style={{ marginTop: 12, fontSize: 28, fontWeight: 800, opacity: lbl, display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
            <Icon name="zap" size={28} color="#fff" stroke={2.4} />
            {b.replyLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export const Chat: React.FC<{ theme: Theme; b: ChatT; timing?: Timing }> = ({ theme, b, timing }) => {
  const tm = chatTimes(b, timing);
  const panelH = b.notify ? 1010 : 1200;
  const nP = usePop(tm.notifyAt, 12, 150);
  const insta = b.platform === 'instagram';
  const firstBot = b.msgs.findIndex((m) => m.from === 'b');
  const head = useSoft(0, 14);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: 'absolute', left: 60, top: 250, width: 960, height: panelH, ...cardStyle(theme), overflow: 'hidden', opacity: head, transform: `translateY(${(1 - head) * 40}px)` }}>
        <div style={{ height: 132, display: 'flex', alignItems: 'center', gap: 22, padding: '0 36px', borderBottom: `2px solid ${theme.line}` }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: grad(theme), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, color: onAccent(theme) }}>{b.initial}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 42, fontWeight: 800 }}>{b.biz}</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: theme.cardMuted, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: theme.good }} />
              AI yordamchi · onlayn
            </div>
          </div>
          <div style={{ width: 70, height: 70, borderRadius: 22, background: insta ? 'linear-gradient(135deg,#f9a03f,#db2777,#7c3aed)' : 'linear-gradient(135deg,#2aabee,#1c86c8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={insta ? 'camera' : 'plane'} size={38} color="#fff" stroke={2} />
          </div>
        </div>
        <div data-fixed="chat" style={{ height: panelH - 132, padding: '30px 34px', display: 'flex', flexDirection: 'column', gap: 22, overflow: 'hidden' }}>
          {b.msgs.map((m, i) => (
            <Bubble key={i} theme={theme} b={b} m={m} at={tm.rows[i].at} typing={tm.rows[i].typing} first={i === firstBot} />
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 60, top: 250 + panelH + 24, width: 960, display: 'flex', justifyContent: 'center' }}>
        {!b.notify && <Pill theme={theme} text="Namuna suhbat" size={30} />}
      </div>
      {b.notify && (
        <div style={{ position: 'absolute', left: 60, top: 250 + panelH + 36, width: 960, ...cardStyle(theme), padding: '26px 34px', display: 'flex', gap: 26, alignItems: 'center', border: `3px solid ${theme.accent}`, opacity: Math.min(1, nP * 1.5), transform: `translateY(${(1 - nP) * 120}px) scale(${0.94 + 0.06 * nP})` }}>
          <div style={{ width: 96, height: 96, borderRadius: 28, background: 'linear-gradient(135deg,#2aabee,#1c86c8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plane" size={54} color="#fff" stroke={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: theme.cardMuted }}>Telegram · egasiga xabar</div>
            <div style={{ fontSize: 42, fontWeight: 900 }}>{b.notify.title}</div>
            <div style={{ fontSize: 33, fontWeight: 600, color: theme.cardMuted, lineHeight: 1.25 }}>{b.notify.lines.join(' · ')}</div>
          </div>
        </div>
      )}
      {b.msgs.map((m, i) => (
        <Sfx key={i} name="pop" at={tm.rows[i].at} volume={m.from === 'b' ? 0.45 : 0.3} />
      ))}
      {b.notify && <Sfx name="notify" at={tm.notifyAt} volume={0.55} />}
    </AbsoluteFill>
  );
};
