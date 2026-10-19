import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { THEMES } from './theme';
import { Background } from './lib/Background';
import { FontGate } from './lib/Fonts';
import { Guard } from './lib/ui';
import { SfxGain } from './lib/Sfx';
import { TR, voiceLayout } from './lib/voice';
import { beatCount } from './content/beats';
import { Hook, HOOK_FRAMES } from './scenes/Hook';
import { Cta, CTA_FRAMES } from './scenes/Cta';
import { BodyView, bodyDuration } from './templates';
import type { VideoSpec } from './content/types';
import { getVideo } from './content';

export { TR };

/** Sahna davomiyliklari: ovoz bo'lsa ovozdan, bo'lmasa standart */
export const layoutFor = (s: VideoSpec, novoice?: boolean) => {
  const v = novoice ? null : voiceLayout(s.id, beatCount(s.body));
  if (v) return { hookDur: v.hookDur, bodyDur: v.bodyDur, ctaDur: v.ctaDur, total: v.total, timing: v.timing, voice: true };
  const bodyDur = bodyDuration(s.body);
  return { hookDur: HOOK_FRAMES, bodyDur, ctaDur: CTA_FRAMES, total: HOOK_FRAMES + bodyDur + CTA_FRAMES - 2 * TR, timing: undefined, voice: false };
};
export const totalFrames = (s: VideoSpec, novoice?: boolean) => layoutFor(s, novoice).total;

export const Reel: React.FC<{ id: string; guard?: boolean; novoice?: boolean }> = ({ id, guard, novoice }) => {
  const spec = getVideo(id);
  const L = layoutFor(spec, novoice);
  const theme = THEMES[spec.theme];
  const { durationInFrames } = useVideoConfig();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pres: any = spec.transition === 'slide' ? slide({ direction: 'from-right' }) : spec.transition === 'wipe' ? wipe({ direction: 'from-left' }) : fade();
  const timing = linearTiming({ durationInFrames: TR });
  return (
    <FontGate>
      <SfxGain.Provider value={L.voice ? 0.55 : 1}>
      <AbsoluteFill>
        <Background theme={theme} style={spec.bg} seed={Number(spec.id)} />
        <Audio
          src={staticFile(`audio/music/m${spec.music}.mp3`)}
          loop
          volume={(f) => interpolate(f, [0, 20, durationInFrames - 40, durationInFrames], [0, L.voice ? 0.085 : 0.2, L.voice ? 0.085 : 0.2, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
        {L.voice && <Audio src={staticFile(`voice/${spec.id}.mp3`)} volume={1} />}
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={L.hookDur}>
            <Hook theme={theme} text={spec.hook} tag={spec.tag} icon={spec.icon} style={spec.hookStyle} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={pres} timing={timing} />
          <TransitionSeries.Sequence durationInFrames={L.bodyDur}>
            <Guard on={guard} label={spec.id + ' ' + spec.slug}>
              <div style={{ position: 'absolute', inset: 0, transform: 'translateY(40px)' }}>
                <BodyView theme={theme} b={spec.body} timing={L.timing} />
              </div>
            </Guard>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={pres} timing={timing} />
          <TransitionSeries.Sequence durationInFrames={L.ctaDur}>
            <Cta theme={theme} line={spec.cta ?? 'Sizga ham shunday *yordamchi* kerakmi?'} />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
      </SfxGain.Provider>
    </FontGate>
  );
};
