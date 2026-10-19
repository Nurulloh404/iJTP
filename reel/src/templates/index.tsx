import React from 'react';
import { Theme } from '../theme';
import type { Body } from '../content/types';
import type { Timing } from '../lib/voice';
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

export const bodyDuration = (b: Body, tm?: Timing): number => Math.round(rawDuration(b, tm));
const rawDuration = (b: Body, tm?: Timing): number => {
  switch (b.kind) {
    case 'chat': return chatDuration(b, tm);
    case 'flow': return flowDuration(b, tm);
    case 'versus': return versusDuration(b, tm);
    case 'list': return listDuration(b, tm);
    case 'steps': return stepsDuration(b, tm);
    case 'clock': return clockDuration(b, tm);
    case 'calc': return calcDuration(b, tm);
    case 'check': return checkDuration(b, tm);
    case 'faq': return faqDuration(b, tm);
    case 'story': return storyDuration(b, tm);
  }
};

export const BodyView: React.FC<{ theme: Theme; b: Body; timing?: Timing }> = ({ theme, b, timing }) => {
  switch (b.kind) {
    case 'chat': return <Chat theme={theme} b={b} timing={timing} />;
    case 'flow': return <Flow theme={theme} b={b} timing={timing} />;
    case 'versus': return <Versus theme={theme} b={b} timing={timing} />;
    case 'list': return <List theme={theme} b={b} timing={timing} />;
    case 'steps': return <Steps theme={theme} b={b} timing={timing} />;
    case 'clock': return <Clock theme={theme} b={b} timing={timing} />;
    case 'calc': return <Calc theme={theme} b={b} timing={timing} />;
    case 'check': return <Check theme={theme} b={b} timing={timing} />;
    case 'faq': return <Faq theme={theme} b={b} timing={timing} />;
    case 'story': return <Story theme={theme} b={b} timing={timing} />;
  }
};
