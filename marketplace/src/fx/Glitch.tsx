import React, { CSSProperties } from 'react';
import { random } from 'remotion';
import { C } from '../theme';

// Texto con separación RGB y cortes horizontales desplazados.
export const Glitch: React.FC<{ text: string; amount: number; f: number; seed?: string; style?: CSSProperties }> = ({
  text,
  amount,
  f,
  seed = 'g',
  style,
}) => {
  const base: CSSProperties = { whiteSpace: 'pre', ...style };
  if (amount <= 0.01) return <span style={{ display: 'inline-block', ...base }}>{text}</span>;
  const r = (k: string) => random(`${seed}-${f}-${k}`);
  const dx = amount * (6 + r('dx') * 22);
  const dy = amount * (r('dy') - 0.5) * 8;
  const layer: CSSProperties = { ...base, position: 'absolute', left: 0, top: 0, textShadow: 'none' };
  const slices = [0, 1, 2, 3].filter((k) => r(`s${k}`) < amount * 0.9);
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...base }}>
      <span style={{ ...layer, color: C.red, opacity: 0.9, transform: `translate(${-dx}px, ${dy}px)` }}>{text}</span>
      <span style={{ ...layer, color: C.cyan, opacity: 0.9, transform: `translate(${dx}px, ${-dy}px)` }}>{text}</span>
      <span style={{ position: 'relative', opacity: r('o') < amount * 0.25 ? 0.2 : 1 }}>{text}</span>
      {slices.map((k) => {
        const top = r(`t${k}`) * 85;
        const h = 4 + r(`h${k}`) * 16;
        return (
          <span
            key={k}
            style={{
              ...layer,
              clipPath: `inset(${top}% -20% ${Math.max(0, 100 - top - h)}% -20%)`,
              transform: `translateX(${(r(`x${k}`) - 0.5) * 120 * amount}px)`,
              background: style?.color === C.bg ? undefined : 'transparent',
            }}
          >
            {text}
          </span>
        );
      })}
    </span>
  );
};
