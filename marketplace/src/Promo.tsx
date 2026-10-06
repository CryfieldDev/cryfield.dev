import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { noise2D } from '@remotion/noise';
import { C } from './theme';
import { TL, lerp, planStart, rapidFrames } from './lib';
import { Flash, Grid, Overlay, Particles } from './fx/Background';
import { Hook } from './scenes/Hook';
import { Drop } from './scenes/Drop';
import { Plans } from './scenes/Plans';
import { Cta } from './scenes/Cta';
import { getMarket } from './data';

// Golpes de cámara: [frame, intensidad]
const HITS: [number, number][] = [
  [TL.hook.error, 10],
  [TL.hook.slams[0], 16],
  [TL.hook.slams[1], 16],
  [TL.hook.slams[2], 30],
  [TL.drop.land, 46],
  [TL.drop.tagline[0], 14],
  [TL.drop.tagline[1], 22],
  ...rapidFrames().map((r) => [r, 10] as [number, number]),
  ...[0, 1, 2].map((i) => [planStart(i) + TL.plans.rollLand, 16] as [number, number]),
  [TL.cta.start, 8],
  [TL.cta.slams[0], 18],
  [TL.cta.slams[1], 24],
  [TL.cta.final, 40],
];

const shake = (f: number) => {
  let x = 0;
  let y = 0;
  let r = 0;
  for (const [at, s] of HITS) {
    const d = f - at;
    if (d < 0 || d > 16) continue;
    const a = s * Math.exp(-d / 3.5);
    x += noise2D(`x${at}`, d * 0.8, 0) * a;
    y += noise2D(`y${at}`, d * 0.8, 0) * a;
    r += noise2D(`r${at}`, d * 0.8, 0) * a * 0.04;
  }
  return { x, y, r };
};

export const Promo: React.FC<{ market: string }> = ({ market }) => {
  const f = useCurrentFrame();
  const m = getMarket(market);
  const s = shake(f);
  const bgOn = f >= TL.drop.land && (f < TL.drop.rapidStart || f >= TL.plans.start);
  const gridOpacity = bgOn ? (f < TL.drop.rapidStart ? lerp(f, TL.drop.land, TL.drop.land + 10, 0, 0.9) : f < TL.cta.start ? 0.45 : 0.75) : 0;

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg) scale(1.04)` }}>
        <Grid f={f} opacity={gridOpacity} speed={f >= TL.plans.start ? 3 : 8} />
        <Particles f={f} opacity={bgOn ? 0.8 : f < TL.drop.land ? 0.25 : 0} />
        {f < TL.drop.land ? <Hook m={m} f={f} /> : null}
        {f >= TL.drop.land && f < TL.plans.start ? <Drop m={m} f={f} /> : null}
        {f >= TL.plans.start && f < TL.cta.start + 10 ? <Plans m={m} f={f} /> : null}
        {f >= TL.cta.start ? <Cta m={m} f={f} /> : null}
      </AbsoluteFill>
      <Flash
        f={f}
        hits={[
          { at: TL.hook.slams[0], strength: 0.6, len: 6 },
          { at: TL.hook.slams[2], color: C.red, strength: 0.35, len: 8 },
          { at: TL.drop.land, strength: 0.95, len: 12 },
          ...[0, 1, 2].map((i) => ({ at: planStart(i) + TL.plans.rollLand, color: C.lime, strength: 0.18, len: 8 })),
          { at: TL.cta.lineIn, strength: 0.5, len: 6 },
          { at: TL.cta.final, color: C.lime, strength: 0.55, len: 14 },
        ]}
      />
      <Overlay f={f} />
      <Audio src={staticFile('audio/soundtrack.mp3')} />
    </AbsoluteFill>
  );
};
