import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import { FONT } from '../theme';

const FACES: [number, string][] = [
  [500, 'Inter-Medium.otf'],
  [600, 'Inter-SemiBold.otf'],
  [700, 'Inter-Bold.otf'],
  [800, 'Inter-ExtraBold.otf'],
  [900, 'Inter-Black.otf'],
];

export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      FACES.map(async ([w, file]) => {
        const f = new FontFace(FONT, `url(${staticFile('fonts/' + file)})`, { weight: String(w) });
        await f.load();
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(f);
      }),
    )
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);
  return ready ? <>{children}</> : null;
};
