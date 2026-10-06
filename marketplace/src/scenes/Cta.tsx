import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, MONO, SANS, glow } from '../theme';
import { TL, ease, fit, glitchAt, lerp, pop, scramble, typed } from '../lib';
import { Slam } from '../fx/Slam';
import { Burst } from '../fx/Background';
import { Logo } from './Drop';
import type { Market } from '../data';

const K = TL.cta;
const BTN_Y = 1010;

export const ChatIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.4 8.4 0 1 1 21 11.5z" />
  </svg>
);

const Ring: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const d = f - at;
  if (d < 0 || d > 22) return null;
  const p = lerp(d, 0, 22, 0, 1, ease.out);
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 - 410,
        top: BTN_Y - 85,
        width: 820,
        height: 170,
        borderRadius: 18,
        border: `4px solid ${C.lime}`,
        transform: `scale(${1 + p * 0.45}, ${1 + p * 1.6})`,
        opacity: 1 - p,
        boxShadow: glow(C.lime, 20),
      }}
    />
  );
};

export const Cta: React.FC<{ m: Market; f: number }> = ({ m, f }) => {
  if (f < K.lineIn) return null;
  // línea (de la tarjeta colapsada) → botón
  const grow = Math.min(1.05, pop(f, K.lineIn + 2, { damping: 12, stiffness: 200 }));
  const w = 900 - 80 * Math.min(1, grow);
  const h = 6 + 164 * grow;
  const label = scramble(m.copy.cta, m.copy.ctaFinal, f, K.decodeStart, K.decodeEnd, 'cta');
  const beat = f >= K.final ? Math.max(0, 1 - ((f - K.final) % 15) / 10) : 0;
  const finalPop = f >= K.final ? Math.exp(-(f - K.final) / 6) : 0;
  const shine = lerp(f, K.decodeEnd, K.decodeEnd + 14, -0.6, 1.8);
  const [c1, c2] = m.copy.ctaSlams;
  const outro = pop(f, K.outro, { damping: 14 });

  return (
    <AbsoluteFill>
      {f >= K.outro ? (
        <AbsoluteFill style={{ opacity: Math.min(1, outro * 1.4), transform: `translateY(${(1 - outro) * -60}px)` }}>
          <Logo f={f} glitch={Math.max(glitchAt(f, [K.outro], 10), glitchAt(f, [K.final], 12))} y={300} size={150} />
        </AbsoluteFill>
      ) : null}

      <Slam text={c1} f={f} at={K.slams[0]} y={590} style={{ fontFamily: SANS, fontWeight: 900, fontSize: fit(c1, 960, 130), color: C.text, letterSpacing: '-0.02em' }} />
      <Slam
        text={c2}
        f={f}
        at={K.slams[1]}
        y={760}
        glitch={1}
        style={{ fontFamily: SANS, fontWeight: 900, fontSize: fit(c2, 980, 150), color: C.lime, letterSpacing: '-0.03em', textShadow: glow(C.lime, 30) }}
      />

      <Ring f={f} at={K.final} />
      {K.pulses.map((p) => (
        <Ring key={p} f={f} at={p} />
      ))}

      <div
        style={{
          position: 'absolute',
          left: 540 - w / 2,
          top: BTN_Y - h / 2,
          width: w,
          height: h,
          borderRadius: 18 * Math.min(1, grow),
          background: C.lime,
          boxShadow: glow(C.lime, 30 + 50 * finalPop),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          transform: `scale(${1 + beat * 0.035 + finalPop * 0.08})`,
        }}
      >
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 56, color: C.bg, letterSpacing: '0.04em', whiteSpace: 'pre', opacity: lerp(f, K.lineIn + 4, K.lineIn + 8, 0, 1) }}>
          {label}
        </span>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '30%',
            left: `${-30 + shine * 100}%`,
            background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.7), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
      </div>

      <Burst f={f} at={K.final} x={540} y={BTN_Y} count={50} seed="fin" spread={760} />

      {f >= K.outro ? (
        <>
          <div style={{ position: 'absolute', top: 1185, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: Math.min(1, outro * 2) }}>
            <ChatIcon size={52} color={C.lime} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 50, color: C.text }}>{typed(m.contact.whatsapp, f, K.typeStart, K.typeEnd)}</span>
          </div>
          <div style={{ position: 'absolute', top: 1285, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 44, color: C.lime, opacity: Math.min(1, outro * 2) }}>
            {typed(m.contact.url, f, K.typeStart + 6, K.typeEnd)}
            <span style={{ opacity: Math.floor(f / 8) % 2 ? 0 : 1 }}>▌</span>
          </div>
          <div style={{ position: 'absolute', top: 1440, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                padding: '18px 36px',
                borderRadius: 999,
                border: `2px solid ${C.lime}55`,
                background: `${C.lime}12`,
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 32,
                color: C.text,
                opacity: lerp(f, K.outro + 10, K.outro + 18, 0, 1),
                transform: `translateY(${lerp(f, K.outro + 10, K.outro + 18, 30, 0, ease.out)}px)`,
              }}
            >
              {m.copy.note}
            </div>
          </div>
          {m.copy.renewal ? (
            <div
              style={{
                position: 'absolute',
                top: 1545,
                width: '100%',
                textAlign: 'center',
                fontFamily: MONO,
                fontSize: 28,
                color: C.muted,
                opacity: lerp(f, K.outro + 16, K.outro + 24, 0, 1),
              }}
            >
              {m.copy.renewal}
            </div>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
