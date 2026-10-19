import voiceData from '../content/voice-data.json';

export type Beat = { s: number; e: number };
export type VoiceInfo = { total: number; beats: Beat[] };
/** Tana sahnasiga nisbatan kadrlarda: har beat uchun boshlanish va davomiylik */
export type Timing = { start: number[]; dur: number[]; total: number };

export const TR = 10; // sahnalar orasidagi o'tish (kadr)
const LEAD = 14; // tana sahnasi birinchi beat'dan shuncha oldin boshlanadi
const TAIL = 24;
const f = (s: number) => Math.round(s * 30);

export const getVoice = (id: string): VoiceInfo | undefined => (voiceData as unknown as Record<string, VoiceInfo>)[id];

export type VoiceLayout = { hookDur: number; bodyDur: number; ctaDur: number; total: number; timing: Timing };

/** Ovoz bo'yicha sahna davomiyliklari: beats = [hook, ...tana, cta] */
export const voiceLayout = (id: string, nBody: number): VoiceLayout | null => {
  const v = getVoice(id);
  if (!v) return null;
  if (v.beats.length !== nBody + 2) throw new Error(`Ovoz beat soni mos emas (${id}): ${v.beats.length} != ${nBody + 2}`);
  const bodyStart = Math.max(60, f(v.beats[1].s) - LEAD);
  const ctaStart = f(v.beats[nBody + 1].s) - LEAD;
  const bodyDur = ctaStart - bodyStart + TR;
  const total = f(v.total) + TAIL;
  const timing: Timing = { start: [], dur: [], total: bodyDur };
  for (let i = 0; i < nBody; i++) {
    const b = v.beats[1 + i];
    timing.start.push(f(b.s) - bodyStart);
    timing.dur.push(f(b.e) - f(b.s));
  }
  return { hookDur: bodyStart + TR, bodyDur, ctaDur: total - ctaStart, total, timing };
};
