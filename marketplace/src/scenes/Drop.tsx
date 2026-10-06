import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { C, MONO, SANS, glow } from '../theme';
import { TL, ease, fit, glitchAt, lerp, pop, rapidFrames, typed } from '../lib';
import { Glitch } from '../fx/Glitch';
import { Slam } from '../fx/Slam';
import { LOGO, logoX } from './Hook';
import type { Market } from '../data';

const D = TL.drop;
export const RAPID_BG = ['lime', 'dark', 'lime', 'dark', 'lime', 'dark', 'dark', 'lime'] as const;

export const Logo: React.FC<{ f: number; glitch: number; y?: number; size?: number }> = ({ f, glitch, y = LOGO.y, size = LOGO.size }) => (
  <>
    {Array.from(LOGO.text).map((ch, j) => {
      const x = 540 + (j - (LOGO.text.length - 1) / 2) * size * 0.6;
      return (
        <div
          key={j}
          style={{
            position: 'absolute',
            left: x - size * 0.3,
            top: y - size * 0.62,
            width: size * 0.6,
            textAlign: 'center',
            fontFamily: MONO,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1.24,
            textShadow: glow(C.lime, size / 6),
          }}
        >
          <Glitch text={ch} amount={glitch} f={f} seed={`lg${j}`} style={{ color: C.lime }} />
        </div>
      );
    })}
  </>
);

const Rapid: React.FC<{ m: Market; f: number }> = ({ m, f }) => {
  const frames = rapidFrames();
  let i = frames.length - 1;
  while (i > 0 && f < frames[i]) i--;
  const word = m.copy.rapid[i];
  const d = f - frames[i];
  const lime = RAPID_BG[i] === 'lime';
  const p = lerp(d, 0, 5, 0, 1, ease.out);
  const jolt = d < 2 ? (random(`rj${i}`) - 0.5) * 60 : 0;
  return (
    <AbsoluteFill style={{ background: lime ? C.lime : C.bg }}>
      {!lime ? <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${C.lime}22, transparent 60%)` }} /> : null}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateX(${jolt}px)` }}>
        <div style={{ transform: `scale(${1.5 - 0.5 * p}) rotate(${(1 - p) * (random(`rr${i}`) - 0.5) * 10}deg)`, opacity: Math.min(1, d / 1.5 + 0.3) }}>
          <Glitch
            text={word}
            amount={(1 - p) * 0.9}
            f={f}
            seed={`rw${i}`}
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: fit(word, 980, 230),
              letterSpacing: '-0.03em',
              color: lime ? C.bg : C.text,
              textShadow: lime ? 'none' : glow(C.lime, 20),
            }}
          />
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 220, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 34, fontWeight: 700, color: lime ? C.bg : C.lime }}>
        [{String(i + 1).padStart(2, '0')}/{String(frames.length).padStart(2, '0')}]
      </div>
      <div style={{ position: 'absolute', bottom: 220, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 34, color: lime ? `${C.bg}aa` : C.muted }}>
        &lt;CF/&gt; cryfield.dev
      </div>
    </AbsoluteFill>
  );
};

export const Drop: React.FC<{ m: Market; f: number }> = ({ m, f }) => {
  if (f >= D.rapidStart) return <Rapid m={m} f={f} />;
  const land = pop(f, D.land, { damping: 9, stiffness: 200 });
  // zoom hacia la "/" del logo → la barra se convierte en la cortina verde
  const slashX = logoX(3);
  const zoom = f > D.wipe ? lerp(f, D.wipe, D.rapidStart, 1, 11, ease.expoIn) : 1;
  const wipeW = f > D.wipe + 3 ? lerp(f, D.wipe + 3, D.rapidStart, 0, 3400, ease.expoIn) : 0;
  const [t1, t2] = m.copy.tagline;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transformOrigin: `${slashX}px ${LOGO.y}px`, transform: `scale(${zoom})` }}>
        <AbsoluteFill style={{ transformOrigin: `540px ${LOGO.y}px`, transform: `scale(${1.25 - 0.25 * land})` }}>
          <Logo f={f} glitch={glitchAt(f, [D.land, D.land + 4], 12)} />
        </AbsoluteFill>
        <div style={{ position: 'absolute', top: 920, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 46, color: C.muted, letterSpacing: '0.04em' }}>
          {typed(m.contact.url, f, D.urlStart, D.urlEnd)}
          <span style={{ color: C.lime, opacity: Math.floor(f / 8) % 2 ? 0 : 1 }}>▌</span>
        </div>
        <Slam text={t1} f={f} at={D.tagline[0]} y={1180} style={{ fontFamily: SANS, fontWeight: 900, fontSize: fit(t1, 960, 120), color: C.text, letterSpacing: '-0.02em' }} />
        <Slam
          text={t2}
          f={f}
          at={D.tagline[1]}
          y={1350}
          glitch={1}
          style={{ fontFamily: SANS, fontWeight: 900, fontSize: fit(t2, 980, 210), color: C.lime, letterSpacing: '-0.03em', textShadow: glow(C.lime, 40) }}
        />
      </AbsoluteFill>
      {wipeW > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: slashX - wipeW / 2,
            top: LOGO.y - 2400,
            width: wipeW,
            height: 4800,
            background: C.lime,
            transform: 'rotate(22deg)',
            boxShadow: glow(C.lime, 60),
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
