import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';

/** Diktor ovozi bor videolarda effektlar pastroq chalinadi */
export const SfxGain = React.createContext(1);

export type SfxName = 'pop' | 'tick' | 'type' | 'ding' | 'notify' | 'success' | 'whoosh' | 'slam' | 'swipe' | 'error';
const LEN: Record<SfxName, number> = { pop: 6, tick: 4, type: 4, ding: 40, notify: 36, success: 30, whoosh: 18, slam: 20, swipe: 10, error: 14 };

/** SFX `at` kadrda (joriy Sequence'ga nisbatan). */
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({ name, at, volume = 0.5 }) => {
  const gain = React.useContext(SfxGain);
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={LEN[name]} layout="none">
      <Audio src={staticFile(`audio/sfx/${name}.mp3`)} volume={volume * gain} />
    </Sequence>
  );
};
