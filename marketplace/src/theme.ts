import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// Fuentes incluidas en public/fonts (Inter y JetBrains Mono, licencia OFL) → funciona sin internet
export const SANS = 'Inter';
export const MONO = 'JetBrains Mono';
loadFont({ family: SANS, url: staticFile('fonts/Inter-latin.woff2'), weight: '400 900' });
loadFont({ family: MONO, url: staticFile('fonts/JetBrainsMono-latin.woff2'), weight: '400 800' });

// Mismos tokens que src/styles/global.css de la web
export const C = {
  bg: '#0a0a0a',
  dark: '#141414',
  darker: '#1a1a1a',
  card: '#1f1f1f',
  border: '#2a2a2a',
  text: '#f0f0f0',
  muted: '#6b6b6b',
  lime: '#a3e635',
  limeDark: '#84cc16',
  red: '#ff4466',
  cyan: '#22d3ee',
};

export const glow = (color = C.lime, r = 40) => `0 0 ${r * 0.25}px ${color}, 0 0 ${r}px ${color}88, 0 0 ${r * 2.5}px ${color}44`;
