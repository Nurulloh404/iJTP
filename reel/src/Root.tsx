import React from 'react';
import { Composition } from 'remotion';
import { Reel, totalFrames } from './Reel';
import { getVideo, VIDEOS } from './content';
import { FPS, H, W } from './theme';

export const Root: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={600}
    defaultProps={{ id: VIDEOS[0].id, guard: false }}
    calculateMetadata={({ props }) => ({ durationInFrames: totalFrames(getVideo(props.id)) })}
  />
);
