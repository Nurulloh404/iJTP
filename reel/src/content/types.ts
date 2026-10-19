import type { IconName } from '../lib/Icon';
import type { BgStyle } from '../lib/Background';

export type ChatT = {
  kind: 'chat';
  platform: 'instagram' | 'telegram';
  biz: string;
  initial: string;
  msgs: { from: 'c' | 'b'; text: string }[];
  replyLabel?: string;
  notify?: { title: string; lines: string[] };
};
export type FlowT = { kind: 'flow'; nodes: { icon: IconName; title: string; sub: string }[]; footer?: string };
export type VersusT = { kind: 'versus'; left: string; right: string; rows: { l: string; r: string }[]; footer?: string };
export type ListT = { kind: 'list'; heading: string; items: { t: string; d?: string }[]; footer?: string };
export type StepsT = { kind: 'steps'; heading: string; items: { t: string; d?: string }[]; footer?: string };
export type ClockT = { kind: 'clock'; heading: string; events: { time: string; text: string; who: 'c' | 'b' | 'o' }[]; footer?: string };
export type CalcT = {
  kind: 'calc';
  heading: string;
  factors: { label: string; value: number; unit: string }[];
  resultDiv: number;
  resultUnit: string;
  resultLabel: string;
  footer?: string;
};
export type CheckT = { kind: 'check'; heading: string; items: { t: string; d?: string }[]; negative?: boolean; footer?: string };
export type FaqT = { kind: 'faq'; q: string; a: string; takeaway?: string };
export type StoryT = { kind: 'story'; lines: { text: string; style?: 'big' | 'quiet' | 'accent' }[] };

export type Body = ChatT | FlowT | VersusT | ListT | StepsT | ClockT | CalcT | CheckT | FaqT | StoryT;

/** Mualliflik yozuvi (kontent fayllarida) */
export type Entry = {
  slug: string;
  title: string; // Instagram sarlavhasi / ichki nom
  tag: string; // yuqoridagi kichik yorliq
  hook: string; // \n — qator, *so'z* — urg'u
  icon: IconName;
  cta?: string;
  caption: string[]; // opisaniya abzatslari
  tags: string[]; // xeshteglar (# siz)
  body: Body;
};

export type VideoSpec = Entry & {
  id: string; // "001"
  theme: number;
  bg: BgStyle;
  music: number; // 1..6
  hookStyle: 'pop' | 'rise' | 'type' | 'slam';
  transition: 'fade' | 'slide' | 'wipe';
};
