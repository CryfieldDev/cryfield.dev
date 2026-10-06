import React from 'react';
import { C, MONO, SANS, glow } from './theme';
import type { Plan } from './data';

export type CardAnim = {
  price: React.ReactNode;
  badge: number; // 0..1
  feature: (i: number) => number; // 0..1
  button: number; // 0..1
  glint: number; // -1 (fuera) .. 2 (fuera)
  contentOpacity?: number;
  buttonPulse?: number;
};

export const STATIC: Omit<CardAnim, 'price'> = { badge: 1, feature: () => 1, button: 1, glint: -1 };

// Tarjeta de plan con el mismo diseño que la sección de precios de la web
export const PlanCard: React.FC<{ plan: Plan; oneTime: string; usd: string; cta: string; anim: CardAnim }> = ({ plan, oneTime, usd, cta, anim }) => {
  const hl = !!plan.highlight;
  const co = anim.contentOpacity ?? 1;
  return (
    <div
      style={{
        position: 'relative',
        width: 900,
        padding: '64px 60px 56px',
        borderRadius: 22,
        border: `2px solid ${hl ? `${C.lime}88` : C.border}`,
        background: hl ? `linear-gradient(160deg, #18200c 0%, ${C.dark} 55%)` : `linear-gradient(160deg, ${C.darker} 0%, ${C.dark} 60%)`,
        boxShadow: hl ? `0 0 80px ${C.lime}33, inset 0 0 60px ${C.lime}10` : '0 30px 80px rgba(0,0,0,0.6)',
        fontFamily: SANS,
      }}
    >
      {/* sello */}
      <div
        style={{
          position: 'absolute',
          top: -26,
          right: 48,
          padding: '10px 28px',
          borderRadius: 999,
          border: `2px solid ${C.lime}88`,
          background: C.bg,
          color: C.lime,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: '0.12em',
          opacity: Math.min(1, anim.badge * 2) * co,
          transform: `scale(${2.4 - 1.4 * anim.badge}) rotate(${(1 - anim.badge) * -14}deg)`,
          boxShadow: anim.badge > 0 ? `0 0 24px ${C.lime}55` : 'none',
        }}
      >
        {plan.badge}
      </div>

      <div style={{ opacity: co }}>
        <div style={{ fontFamily: MONO, fontSize: 30, color: C.muted, letterSpacing: '0.22em', fontWeight: 500 }}>{plan.name}</div>
        <div style={{ marginTop: 10, fontSize: 27, color: `${C.muted}cc`, lineHeight: 1.3 }}>{plan.target}</div>

        <div style={{ marginTop: 26, display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 150, color: C.text, lineHeight: 1 }}>$</span>
          {anim.price}
          <span style={{ marginLeft: 18, fontSize: 36, color: C.muted, fontWeight: 500 }}>{usd}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 25, color: `${C.muted}aa` }}>{oneTime}</div>

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {plan.features.map((ft, i) => {
            const p = anim.feature(i);
            return (
              <div
                key={ft}
                style={{
                  display: 'flex',
                  gap: 18,
                  alignItems: 'flex-start',
                  fontSize: 33,
                  lineHeight: 1.25,
                  color: '#a8a8a8',
                  opacity: p,
                  transform: `translateX(${(1 - p) * -80}px)`,
                  filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
                }}
              >
                <span style={{ color: C.lime, fontWeight: 800, textShadow: p > 0.9 ? glow(C.lime, 12) : 'none' }}>✓</span>
                <span>{ft}</span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 48,
            padding: '30px 0',
            borderRadius: 10,
            textAlign: 'center',
            fontFamily: MONO,
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: '0.06em',
            border: `2px solid ${hl ? `${C.lime}99` : '#3a3a3a'}`,
            background: hl ? `${C.lime}1f` : '#1c1c1c',
            color: hl ? C.lime : C.text,
            opacity: anim.button,
            transform: `translateY(${(1 - anim.button) * 30}px) scale(${1 + (anim.buttonPulse ?? 0) * 0.04})`,
            boxShadow: anim.buttonPulse ? `0 0 ${40 * anim.buttonPulse}px ${C.lime}66` : 'none',
          }}
        >
          {cta}
        </div>
      </div>

      {/* destello que cruza la tarjeta */}
      {anim.glint > -1 && anim.glint < 2 ? (
        <div style={{ position: 'absolute', inset: 0, borderRadius: 22, overflow: 'hidden', pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              bottom: '-20%',
              width: '45%',
              left: `${-50 + anim.glint * 100}%`,
              background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.0) 30%, rgba(220,255,170,0.22) 50%, rgba(255,255,255,0) 70%, transparent 100%)',
              transform: 'skewX(-18deg)',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
