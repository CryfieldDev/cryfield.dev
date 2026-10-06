import React from 'react';
import { AbsoluteFill, interpolateColors } from 'remotion';
import { noise2D } from '@remotion/noise';
import { C, MONO, SANS } from '../theme';
import { TL, ease, fit, lerp, planStart, pop, scramble } from '../lib';
import { RollingPrice } from '../fx/RollingPrice';
import { Burst } from '../fx/Background';
import { PlanCard } from '../PlanCard';
import type { Market } from '../data';

const P = TL.plans;
const CARD_Y = 1010;

const Marquee: React.FC<{ text: string; f: number; y: number; dir: number }> = ({ text, f, y, dir }) => (
  <div
    style={{
      position: 'absolute',
      top: y - 120,
      left: 0,
      whiteSpace: 'nowrap',
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: 230,
      letterSpacing: '-0.02em',
      color: 'transparent',
      WebkitTextStroke: `2px ${C.lime}40`,
      transform: `translateX(${dir > 0 ? -1400 + ((f * 5) % 1400) : -((f * 5) % 1400)}px)`,
    }}
  >
    {Array(8).fill(`${text} — `).join('')}
  </div>
);

export const Plans: React.FC<{ m: Market; f: number }> = ({ m, f }) => {
  const plans = m.plans;
  const q = Math.min(plans.length - 1, Math.floor((f - P.start) / P.length));
  const lf = f - planStart(q);

  // giro 3D: la tarjeta actual se convierte en la siguiente
  let shown = q;
  let angle = 0;
  if (q < plans.length - 1 && lf >= P.flip) {
    const a = lerp(lf, P.flip, P.length, 0, 180, ease.inOut);
    if (a < 90) angle = a;
    else {
      shown = q + 1;
      angle = a - 180;
    }
  }
  const pre = shown !== q; // la siguiente tarjeta aparece en su estado inicial
  const slf = pre ? -1 : lf;
  const plan = plans[shown];
  const from = shown === 0 ? '000.00' : plans[shown - 1].price;

  const featP = (i: number) => lerp(slf, P.featStart + i * P.featStep, P.featStart + i * P.featStep + 8, 0, 1, ease.out);
  const landBump = slf >= P.rollLand ? Math.exp(-(slf - P.rollLand) / 5) : 0;
  const pulse = slf > P.button + 8 ? Math.max(0, 1 - (f % 15) / 9) : 0;

  // morph de entrada: el panel verde de "3 PLANES" se encoge y se vuelve la tarjeta
  const mt = shown === 0 ? Math.min(1, pop(f, P.start, { damping: 18, stiffness: 150 })) : 1;
  const cardOpacity = shown === 0 ? lerp(f, P.start + 7, P.start + 14, 0, 1) : 1;

  // colapso final: la última tarjeta se aplasta en una línea que será el botón
  const end = TL.cta.start;
  const collapseY = lerp(f, end, end + 8, 1, 0.006, ease.expoIn);
  const collapseContent = lerp(f, end, end + 4, 1, 0);

  const floatX = noise2D('fx', f * 0.02, 0) * 4;
  const floatY = noise2D('fy', f * 0.02, 0) * 7;
  const scale = (1 - Math.sin((Math.abs(angle) / 180) * Math.PI) * 0.25) * (1 + landBump * 0.035) * (f >= end ? lerp(f, end, end + 8, 1, 1.05) : 1);

  const label = `// ${m.copy.plansLabel} 0${shown + 1}/0${plans.length}`;
  const prevLabel = `// ${m.copy.plansLabel} 0${Math.max(1, shown)}/0${plans.length}`;

  return (
    <AbsoluteFill style={{ opacity: f >= end + 9 ? 0 : 1 }}>
      <Marquee text={plan.short} f={f} y={250} dir={1} />
      <Marquee text={plan.short} f={f} y={1770} dir={-1} />

      <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.lime, letterSpacing: '0.1em' }}>
        {shown > 0 && !pre ? scramble(prevLabel, label, lf, 0, 10, 'lbl') : label}
      </div>

      {/* indicador de progreso */}
      <div style={{ position: 'absolute', bottom: 110, left: 340, width: 400, display: 'flex', gap: 16 }}>
        {plans.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 6, borderRadius: 4, background: i <= shown ? C.lime : C.border, boxShadow: i === shown ? `0 0 16px ${C.lime}` : 'none' }} />
        ))}
      </div>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 2400 }}>
        <div
          style={{
            transform: `translateY(${CARD_Y - 960}px) rotateY(${angle + floatY}deg) rotateX(${floatX}deg) scale(${scale}) scaleY(${collapseY})`,
            opacity: cardOpacity,
            filter: f >= end ? `brightness(${lerp(f, end, end + 8, 1, 3)})` : undefined,
          }}
        >
          <PlanCard
            plan={plan}
            oneTime={m.copy.oneTime}
            usd={m.copy.usd}
            cta={m.copy.cta}
            anim={{
              price: <RollingPrice from={from} to={plan.price} f={slf} start={P.rollStart} land={P.rollLand} fontSize={150} color={C.text} fontFamily={MONO} />,
              badge: Math.min(1.1, pop(slf, P.badge, { damping: 9, stiffness: 260 })),
              feature: featP,
              button: lerp(slf, P.button, P.button + 8, 0, 1, ease.out),
              glint: lerp(slf, P.rollLand, P.rollLand + 18, -0.6, 1.8),
              buttonPulse: pulse,
              contentOpacity: collapseContent,
            }}
          />
        </div>
      </AbsoluteFill>

      {!pre ? <Burst f={slf} at={P.rollLand} x={470} y={CARD_Y - 380} count={plan.highlight ? 44 : 26} seed={`pb${shown}`} spread={plan.highlight ? 700 : 480} /> : null}

      {mt < 1 || f < P.start + 16 ? (
        <div
          style={{
            position: 'absolute',
            left: 90 * mt,
            top: (CARD_Y - 540) * mt,
            width: 1080 - 180 * mt,
            height: 1920 - (1920 - 1080) * mt,
            borderRadius: 22 * mt,
            background: interpolateColors(mt, [0, 0.7, 1], [C.lime, C.lime, C.dark]),
            opacity: lerp(f, P.start + 9, P.start + 16, 1, 0),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: fit(m.copy.rapid[m.copy.rapid.length - 1], 980, 230),
              letterSpacing: '-0.03em',
              color: C.bg,
              whiteSpace: 'nowrap',
              transform: `scale(${1 - 0.6 * mt})`,
              opacity: lerp(f, P.start, P.start + 7, 1, 0),
            }}
          >
            {m.copy.rapid[m.copy.rapid.length - 1]}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
