import React, { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import { Glitch } from './Glitch';
import { glitchAt, pop } from '../lib';

// Palabra que "golpea" la pantalla: entra gigante y desenfocada, aterriza con rebote + glitch
export const Slam: React.FC<{ text: string; f: number; at: number; y: number; style: CSSProperties; glitch?: number; exit?: CSSProperties }> = ({
  text,
  f,
  at,
  y,
  style,
  glitch = 0.8,
  exit,
}) => {
  if (f < at) return null;
  const s = pop(f, at, { damping: 11, stiffness: 240, mass: 0.6 });
  const scale = 2.6 - 1.6 * s;
  const blur = Math.max(0, (1 - s) * 18);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateY(${y - 960}px)` }}>
      <div style={{ transform: `scale(${scale})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity: Math.min(1, (f - at + 1) / 2), ...exit }}>
        <Glitch text={text} f={f} seed={text} amount={glitchAt(f, [at], 8) * glitch} style={style} />
      </div>
    </AbsoluteFill>
  );
};
