import { Easing, interpolate, random, spring } from 'remotion';
import TL from './timeline.json';

export { TL };
export const FPS = TL.fps;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const lerp = (f: number, a: number, b: number, from: number, to: number, easing?: (n: number) => number) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing });

export const pop = (f: number, start: number, config: Partial<{ damping: number; stiffness: number; mass: number }> = {}) =>
  f < start ? 0 : spring({ frame: f - start, fps: FPS, config: { damping: 14, stiffness: 180, mass: 0.7, ...config } });

export const ease = {
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  expoIn: Easing.in(Easing.exp),
  expoOut: Easing.out(Easing.exp),
};

export const typed = (text: string, f: number, start: number, end: number) =>
  Array.from(text).slice(0, Math.floor(lerp(f, start, end, 0, Array.from(text).length))).join('');

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#%&*<>/{}[]=+';

// Transforma el texto `from` en `to` pasando por caracteres aleatorios (decoder)
export const scramble = (from: string, to: string, f: number, start: number, end: number, seed = 's') => {
  const p = lerp(f, start, end, 0, 1);
  const a = Array.from(from);
  const b = Array.from(to);
  const len = Math.max(a.length, b.length);
  if (p <= 0) return from;
  if (p >= 1) return to;
  return Array.from({ length: len }, (_, i) => {
    const th = 0.2 + (0.8 * i) / len;
    if (p >= th) return b[i] ?? '';
    if (p < th - 0.55) return a[i] ?? '';
    const target = b[i] ?? a[i] ?? ' ';
    if (target === ' ') return ' ';
    return GLYPHS[Math.floor(random(`${seed}-${i}-${Math.floor(f / 2)}`) * GLYPHS.length)];
  }).join('');
};

// Glitch: intensidad que decae tras cada disparo
export const glitchAt = (f: number, hits: number[], len = 10) =>
  hits.reduce((acc, h) => (f >= h && f < h + len ? Math.max(acc, 1 - (f - h) / len) : acc), 0);

// Tamaño de fuente para que el texto quepa en un ancho (estimación conservadora)
export const fit = (text: string, maxW: number, maxSize: number, k = 0.74) =>
  Math.min(maxSize, maxW / (Math.max(1, Array.from(text).length) * k));

export const rapidFrames = () =>
  Array.from({ length: TL.drop.rapidCount }, (_, i) => Math.round(TL.drop.rapidStart + i * 7.5));

export const planStart = (i: number) => TL.plans.start + i * TL.plans.length;
