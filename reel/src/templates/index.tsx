import React from 'react';
import { Theme } from '../theme';
import type { Body } from '../content/types';
import { Chat, chatDuration } from './Chat';
import { Flow, flowDuration } from './Flow';
import { Versus, versusDuration } from './Versus';
import { List, listDuration } from './List';
import { Steps, stepsDuration } from './Steps';
import { Clock, clockDuration } from './Clock';
import { Calc, calcDuration } from './Calc';
import { Check, checkDuration } from './Check';
import { Faq, faqDuration } from './Faq';
import { Story, storyDuration } from './Story';

export const bodyDuration = (b: Body): number => Math.round(rawDuration(b));
const rawDuration = (b: Body): number => {
  switch (b.kind) {
    case 'chat': return chatDuration(b);
    case 'flow': return flowDuration(b);
    case 'versus': return versusDuration(b);
    case 'list': return listDuration(b);
    case 'steps': return stepsDuration(b);
    case 'clock': return clockDuration(b);
    case 'calc': return calcDuration(b);
    case 'check': return checkDuration(b);
    case 'faq': return faqDuration(b);
    case 'story': return storyDuration(b);
  }
};

export const BodyView: React.FC<{ theme: Theme; b: Body }> = ({ theme, b }) => {
  switch (b.kind) {
    case 'chat': return <Chat theme={theme} b={b} />;
    case 'flow': return <Flow theme={theme} b={b} />;
    case 'versus': return <Versus theme={theme} b={b} />;
    case 'list': return <List theme={theme} b={b} />;
    case 'steps': return <Steps theme={theme} b={b} />;
    case 'clock': return <Clock theme={theme} b={b} />;
    case 'calc': return <Calc theme={theme} b={b} />;
    case 'check': return <Check theme={theme} b={b} />;
    case 'faq': return <Faq theme={theme} b={b} />;
    case 'story': return <Story theme={theme} b={b} />;
  }
};
