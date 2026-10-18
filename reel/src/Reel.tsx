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
import { Hook, HOOK_FRAMES } from './scenes/Hook';
import { Cta, CTA_FRAMES } from './scenes/Cta';
import { BodyView, bodyDuration } from './templates';
import type { VideoSpec } from './content/types';
import { getVideo } from './content';

export const TR = 10;
export const totalFrames = (s: VideoSpec) => HOOK_FRAMES + bodyDuration(s.body) + CTA_FRAMES - 2 * TR;
/** Tanasi tinch holatga kelgan kadr (tekshiruv/muqova uchun) */
export const settledFrame = (s: VideoSpec) => HOOK_FRAMES + bodyDuration(s.body) - TR - 10;

export const Reel: React.FC<{ id: string; guard?: boolean }> = ({ id, guard }) => {
  const spec = getVideo(id);
  const theme = THEMES[spec.theme];
  const { durationInFrames } = useVideoConfig();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pres: any = spec.transition === 'slide' ? slide({ direction: 'from-right' }) : spec.transition === 'wipe' ? wipe({ direction: 'from-left' }) : fade();
  const timing = linearTiming({ durationInFrames: TR });
  return (
    <FontGate>
      <AbsoluteFill>
        <Background theme={theme} style={spec.bg} seed={Number(spec.id)} />
        <Audio
          src={staticFile(`audio/music/m${spec.music}.mp3`)}
          loop
          volume={(f) => interpolate(f, [0, 20, durationInFrames - 40, durationInFrames], [0, 0.2, 0.2, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={HOOK_FRAMES}>
            <Hook theme={theme} text={spec.hook} tag={spec.tag} icon={spec.icon} style={spec.hookStyle} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={pres} timing={timing} />
          <TransitionSeries.Sequence durationInFrames={bodyDuration(spec.body)}>
            <Guard on={guard} label={spec.id + ' ' + spec.slug}>
              <div style={{ position: 'absolute', inset: 0, transform: 'translateY(40px)' }}>
                <BodyView theme={theme} b={spec.body} />
              </div>
            </Guard>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={pres} timing={timing} />
          <TransitionSeries.Sequence durationInFrames={CTA_FRAMES}>
            <Cta theme={theme} line={spec.cta ?? 'Sizga ham shunday *yordamchi* kerakmi?'} />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </FontGate>
  );
};
