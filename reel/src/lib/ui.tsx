import React, { useLayoutEffect, useRef } from 'react';
import { getRemotionEnvironment } from 'remotion';
import { FONT, Theme } from '../theme';
import { parseRich } from './anim';
import { Icon, IconName } from './Icon';

export const cardStyle = (t: Theme): React.CSSProperties => ({
  background: t.card,
  color: t.cardText,
  borderRadius: 44,
  border: `2px solid ${t.line}`,
  boxShadow: t.light ? '0 14px 44px rgba(40,30,80,.14)' : '0 16px 48px rgba(0,0,0,.38)',
});

export const grad = (t: Theme, deg = 135) => `linear-gradient(${deg}deg, ${t.accent}, ${t.accent2})`;

/** Matn rangi: gradient fonda o'qiladigan rang */
export const onAccent = (t: Theme) => (t.light ? '#ffffff' : '#07101c');

export const Rich: React.FC<{ text: string; theme: Theme; accent?: string; style?: React.CSSProperties }> = ({ text, theme, accent, style }) => (
  <span style={style}>
    {parseRich(text).map((p, i) => (
      <span key={i} style={p.a ? { color: accent ?? theme.accent } : undefined}>
        {p.t}
      </span>
    ))}
  </span>
);

export const Pill: React.FC<{ theme: Theme; text: string; icon?: IconName; color?: string; size?: number; solid?: boolean; style?: React.CSSProperties }> = ({
  theme, text, icon, color, size = 38, solid, style,
}) => {
  const c = color ?? theme.accent;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: `${size * 0.34}px ${size * 0.8}px`, borderRadius: 999, fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: 0.5, color: solid ? onAccent(theme) : c, background: solid ? c : `${c}22`, border: `2px solid ${c}${solid ? '' : '88'}`, ...style }}>
      {icon && <Icon name={icon} size={size * 1.05} color="currentColor" stroke={2.4} />}
      <span>{text}</span>
    </div>
  );
};

/** Render paytida (guard=true bo'lsa) kontent xavfsiz zonadan chiqmaganini tekshiradi. */
export const Guard: React.FC<{ on?: boolean; label: string; children: React.ReactNode }> = ({ on, label, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!on || !ref.current) return;
    const bad: string[] = [];
    ref.current.querySelectorAll<HTMLElement>('*').forEach((el) => {
      const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? '').trim());
      const r = el.getBoundingClientRect();
      if (hasText && (r.bottom > 1640 || r.right > 1058 || r.left < 22 || r.top < 150)) bad.push(`"${(el.textContent ?? '').slice(0, 40)}" rect=${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}`);
      if (el.dataset.fixed !== undefined && (el.scrollHeight > el.clientHeight + 3 || el.scrollWidth > el.clientWidth + 3)) bad.push(`fixed-overflow ${el.dataset.fixed} sh=${el.scrollHeight} ch=${el.clientHeight}`);
    });
    if (bad.length) throw new Error(`OVERFLOW[${label}]: ` + bad.slice(0, 4).join(' | '));
  });
  return <div ref={ref} style={{ position: 'absolute', inset: 0 }}>{children}</div>;
};

export const isRendering = () => getRemotionEnvironment().isRendering;
