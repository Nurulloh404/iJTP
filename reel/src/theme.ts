export type Theme = {
  name: string;
  light: boolean;
  bg1: string;
  bg2: string;
  accent: string;
  accent2: string;
  text: string;
  muted: string;
  card: string;
  cardText: string;
  cardMuted: string;
  line: string;
  good: string;
  bad: string;
};

export const THEMES: Theme[] = [
  { name: 'midnight', light: false, bg1: '#0b1030', bg2: '#1b2a6b', accent: '#38e1ff', accent2: '#b6ff3c', text: '#ffffff', muted: '#a9b4e8', card: '#141b4a', cardText: '#ffffff', cardMuted: '#9aa7e6', line: '#2c3a8c', good: '#3df5a7', bad: '#ff6b7d' },
  { name: 'sunset', light: false, bg1: '#2a0a2e', bg2: '#7a1f4d', accent: '#ffb347', accent2: '#ff5d8f', text: '#fff7ef', muted: '#e7b6cc', card: '#3b1240', cardText: '#fff7ef', cardMuted: '#e0a9c2', line: '#8c2f63', good: '#7bf0a8', bad: '#ff7a7a' },
  { name: 'emerald', light: false, bg1: '#04201a', bg2: '#0c5a45', accent: '#c6ff4a', accent2: '#4ff0c5', text: '#f2fff9', muted: '#9fd9c5', card: '#0a3a2f', cardText: '#f2fff9', cardMuted: '#93d0bb', line: '#1a7a5e', good: '#c6ff4a', bad: '#ff8a7a' },
  { name: 'ink', light: false, bg1: '#08080a', bg2: '#22222a', accent: '#ffd23f', accent2: '#ff7a3d', text: '#ffffff', muted: '#a9a9b5', card: '#1a1a20', cardText: '#ffffff', cardMuted: '#9c9ca8', line: '#3a3a45', good: '#7dffb0', bad: '#ff6b6b' },
  { name: 'cream', light: true, bg1: '#fff6e8', bg2: '#ffd9c2', accent: '#ff4f5e', accent2: '#2b59ff', text: '#1b1420', muted: '#6d5b66', card: '#ffffff', cardText: '#1b1420', cardMuted: '#6d5b66', line: '#f0cdb8', good: '#12a46a', bad: '#e5384a' },
  { name: 'ocean', light: false, bg1: '#021b2b', bg2: '#066b7a', accent: '#ffcf4a', accent2: '#5ef2e0', text: '#f0fcff', muted: '#9ed6de', card: '#083348', cardText: '#f0fcff', cardMuted: '#8fcad4', line: '#0f8696', good: '#5ef2c0', bad: '#ff7e6b' },
  { name: 'grape', light: false, bg1: '#1a0b3b', bg2: '#5b2bb5', accent: '#ff5fd2', accent2: '#ffe14a', text: '#fbf6ff', muted: '#c9b5f2', card: '#2a1260', cardText: '#fbf6ff', cardMuted: '#bba4ee', line: '#6d3ccc', good: '#7dffc2', bad: '#ff7a8f' },
  { name: 'paper', light: true, bg1: '#f4f7ff', bg2: '#dbe5ff', accent: '#2b59ff', accent2: '#ff8a1f', text: '#0d1330', muted: '#56608a', card: '#ffffff', cardText: '#0d1330', cardMuted: '#56608a', line: '#c7d4ff', good: '#0f9d6a', bad: '#e0364a' },
];

export const FONT = 'ReelInter';
export const W = 1080;
export const H = 1920;
export const FPS = 30;
