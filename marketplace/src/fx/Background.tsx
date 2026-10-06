import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { noise2D } from '@remotion/noise';
import { C } from '../theme';

// Piso de cuadrícula neón en perspectiva
export const Grid: React.FC<{ f: number; opacity: number; speed?: number; horizon?: number }> = ({ f, opacity, speed = 6, horizon = 58 }) => {
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity, perspective: 900, perspectiveOrigin: `50% ${horizon - 8}%`, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: '-100%',
          width: '300%',
          top: `${horizon}%`,
          height: 840,
          transformOrigin: '50% 0%',
          transform: 'rotateX(76deg)',
          backgroundImage: `linear-gradient(${C.lime}66 3px, transparent 3px), linear-gradient(90deg, ${C.lime}66 3px, transparent 3px)`,
          backgroundSize: '110px 110px',
          backgroundPosition: `0 ${(f * speed) % 110}px`,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 100%)',
        }}
      />
      {/* resplandor del horizonte */}
      <div
        style={{
          position: 'absolute',
          left: '-10%',
          width: '120%',
          top: `${horizon - 9}%`,
          height: '18%',
          background: `radial-gradient(ellipse at center, ${C.lime}40 0%, ${C.lime}10 40%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: `${horizon}%`, height: 2, background: `${C.lime}aa`, boxShadow: `0 0 30px ${C.lime}` }} />
    </AbsoluteFill>
  );
};

export const Particles: React.FC<{ f: number; opacity: number; count?: number; w?: number; h?: number }> = ({ f, opacity, count = 60, w = 1080, h = 1920 }) => {
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity }}>
      {Array.from({ length: count }, (_, i) => {
        const speed = 1 + random(`ps${i}`) * 4;
        const size = 2 + random(`pz${i}`) * 5;
        const y = ((random(`py${i}`) * (h + 200) - f * speed) % (h + 200) + h + 200) % (h + 200) - 100;
        const x = random(`px${i}`) * w + noise2D(`pn${i}`, f * 0.01, 0) * 60;
        const tw = 0.35 + 0.65 * Math.abs(noise2D(`pt${i}`, f * 0.05, 1));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              background: i % 7 === 0 ? C.text : C.lime,
              opacity: tw,
              boxShadow: `0 0 ${size * 3}px ${C.lime}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Scanlines + viñeta + grano (look CRT de la web)
export const Overlay: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <AbsoluteFill
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 5px)',
        backgroundPosition: `0 ${(f * 0.5) % 5}px`,
        opacity: 0.55,
      }}
    />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.75) 100%)' }} />
  </AbsoluteFill>
);

export const Flash: React.FC<{ f: number; hits: { at: number; color?: string; strength?: number; len?: number }[] }> = ({ f, hits }) => (
  <>
    {hits.map((h, i) => {
      const len = h.len ?? 8;
      const d = f - h.at;
      if (d < 0 || d > len) return null;
      return <AbsoluteFill key={i} style={{ background: h.color ?? '#fff', opacity: (h.strength ?? 0.85) * (1 - d / len) ** 2, mixBlendMode: 'screen' }} />;
    })}
  </>
);

// Estallido de partículas desde un punto
export const Burst: React.FC<{ f: number; at: number; x: number; y: number; count?: number; seed?: string; spread?: number; color?: string }> = ({
  f,
  at,
  x,
  y,
  count = 28,
  seed = 'b',
  spread = 520,
  color = C.lime,
}) => {
  const d = f - at;
  if (d < 0 || d > 26) return null;
  const p = d / 26;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const ang = random(`${seed}a${i}`) * Math.PI * 2;
        const dist = spread * (0.35 + random(`${seed}d${i}`) * 0.65) * (1 - (1 - p) ** 3);
        const size = 4 + random(`${seed}s${i}`) * 10;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.cos(ang) * dist - size / 2,
              top: y + Math.sin(ang) * dist + 200 * p * p - size / 2,
              width: size,
              height: size,
              background: i % 4 === 0 ? '#fff' : color,
              opacity: 1 - p,
              transform: `rotate(${p * 360 * (random(`${seed}r${i}`) - 0.5)}deg)`,
              boxShadow: `0 0 ${size * 2}px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};
