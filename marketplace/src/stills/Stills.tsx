import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, MONO, SANS, glow } from '../theme';
import { fit } from '../lib';
import { Grid, Overlay, Particles } from '../fx/Background';
import { PlanCard, STATIC } from '../PlanCard';
import { ChatIcon } from '../scenes/Cta';
import { getMarket, type Market } from '../data';

// Imágenes 1080x1080 para Marketplace (misma estética que el video)

const Frame: React.FC<{ children: React.ReactNode; horizon?: number; grid?: number }> = ({ children, horizon = 72, grid = 0.6 }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${C.lime}14, transparent 60%)` }} />
    <Grid f={0} opacity={grid} horizon={horizon} />
    <Particles f={40} opacity={0.6} count={34} w={1080} h={1080} />
    {children}
    <Overlay f={0} />
  </AbsoluteFill>
);

const TopBar: React.FC<{ m: Market; right?: string }> = ({ m, right }) => (
  <div style={{ position: 'absolute', top: 48, left: 60, right: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, color: C.lime, textShadow: glow(C.lime, 14) }}>&lt;CF/&gt;</span>
      <span style={{ fontFamily: MONO, fontSize: 26, color: C.muted }}>{m.contact.url}</span>
    </div>
    {right ? <span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.lime, letterSpacing: '0.12em' }}>{right}</span> : null}
  </div>
);

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ padding: '12px 22px', borderRadius: 999, border: `2px solid ${C.lime}55`, background: `${C.bg}cc`, fontFamily: MONO, fontSize: 24, color: C.text }}>{children}</span>
);

export const Cover: React.FC<{ market: string }> = ({ market }) => {
  const m = getMarket(market);
  const [t1, t2] = m.copy.coverTitle;
  const cheapest = m.plans[0].price;
  return (
    <Frame horizon={74}>
      <TopBar m={m} right={`[ 3 ${m.copy.plansLabel} ]`} />
      <div style={{ position: 'absolute', top: 175, left: 70, right: 70 }}>
        <div style={{ fontFamily: MONO, fontSize: 32, color: C.lime }}>{m.copy.coverKicker}</div>
        <div style={{ marginTop: 18, fontFamily: SANS, fontWeight: 900, fontSize: fit(t1, 940, 150), lineHeight: 0.95, color: C.text, letterSpacing: '-0.03em' }}>{t1}</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: fit(t2, 940, 170), lineHeight: 1, color: C.lime, letterSpacing: '-0.03em', textShadow: glow(C.lime, 36) }}>{t2}</div>
        <div style={{ marginTop: 34, display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <span style={{ fontFamily: MONO, fontSize: 36, color: C.muted, fontWeight: 700 }}>{m.copy.coverFrom}</span>
          <span style={{ fontFamily: MONO, fontSize: 112, color: C.text, fontWeight: 800 }}>${cheapest}</span>
          <span style={{ fontFamily: SANS, fontSize: 34, color: C.muted }}>{m.copy.usd}</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 30, color: '#9a9a9a' }}>{m.copy.oneTime}</div>
      </div>
      <div style={{ position: 'absolute', bottom: 60, left: 60, right: 60, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
        {m.copy.rapid.slice(0, 4).map((r) => (
          <Chip key={r}>✓ {r}</Chip>
        ))}
      </div>
    </Frame>
  );
};

export const Included: React.FC<{ market: string }> = ({ market }) => {
  const m = getMarket(market);
  const [a, b] = m.copy.ctaSlams;
  return (
    <Frame horizon={90} grid={0.4}>
      <TopBar m={m} />
      <div style={{ position: 'absolute', top: 150, width: '100%', textAlign: 'center' }}>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 64, color: C.text, letterSpacing: '-0.02em' }}>{a} </span>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 64, color: C.lime, letterSpacing: '-0.02em', textShadow: glow(C.lime, 20) }}>{b}</span>
      </div>
      <div style={{ position: 'absolute', top: 290, left: 70, right: 70, borderRadius: 18, border: `2px solid ${C.border}`, background: '#0d0d0de8', overflow: 'hidden', boxShadow: `0 0 60px ${C.lime}14` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: `2px solid ${C.border}`, background: '#121212' }}>
          {['#ff5f57', '#febc2e', C.lime].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 99, background: c }} />
          ))}
          <span style={{ marginLeft: 14, fontFamily: MONO, fontSize: 22, color: C.muted }}>bash — cryfield</span>
        </div>
        <div style={{ padding: '30px 38px 38px', fontFamily: MONO }}>
          <div style={{ fontSize: 30, color: C.text }}>
            <span style={{ color: C.lime }}>$</span> cat {m.copy.included.toLowerCase().replace(/ /g, '_')}.txt
          </div>
          <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 36, columnGap: 30 }}>
            {m.copy.includedItems.map((it) => (
              <div key={it} style={{ display: 'flex', gap: 14, fontSize: 31, color: '#cfcfcf', fontFamily: SANS }}>
                <span style={{ color: C.lime, fontWeight: 800, textShadow: glow(C.lime, 10) }}>✓</span>
                {it}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 30, fontSize: 26, color: C.muted }}>
            &gt; {m.copy.note}
            <span style={{ color: C.lime }}> ▌</span>
          </div>
        </div>
      </div>
    </Frame>
  );
};

export const PlanStill: React.FC<{ market: string; index: number }> = ({ market, index }) => {
  const m = getMarket(market);
  const plan = m.plans[index];
  return (
    <Frame horizon={80} grid={0.35}>
      {[90, 990].map((y, k) => (
        <div
          key={y}
          style={{
            position: 'absolute',
            top: y - 110,
            left: k ? -300 : -80,
            whiteSpace: 'nowrap',
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 220,
            color: 'transparent',
            WebkitTextStroke: `2px ${C.lime}30`,
          }}
        >
          {Array(4).fill(`${plan.short} — `).join('')}
        </div>
      ))}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `scale(${plan.features.length > 7 ? 0.84 : 0.88})`, marginTop: 20 }}>
          <PlanCard
            plan={plan}
            oneTime={m.copy.oneTime}
            usd={m.copy.usd}
            cta={m.copy.cta}
            anim={{ ...STATIC, price: <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 150, color: C.text, lineHeight: 1 }}>{plan.price}</span> }}
          />
        </div>
      </AbsoluteFill>
    </Frame>
  );
};

export const Compare: React.FC<{ market: string }> = ({ market }) => {
  const m = getMarket(market);
  return (
    <Frame horizon={92} grid={0.4}>
      <TopBar m={m} />
      <div style={{ position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 96, color: C.text, letterSpacing: '-0.03em' }}>
        {m.copy.compareTitle}
      </div>
      <div style={{ position: 'absolute', top: 290, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {m.plans.map((p) => (
          <div
            key={p.name}
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '34px 40px',
              borderRadius: 18,
              border: `2px solid ${p.highlight ? `${C.lime}99` : C.border}`,
              background: p.highlight ? `linear-gradient(120deg, #18200c, ${C.dark})` : `${C.dark}ee`,
              boxShadow: p.highlight ? `0 0 50px ${C.lime}30` : 'none',
            }}
          >
            <div>
              <div style={{ fontFamily: MONO, fontSize: 30, color: C.text, letterSpacing: '0.16em', fontWeight: 700 }}>{p.name}</div>
              <div style={{ marginTop: 10, display: 'inline-block', padding: '6px 18px', borderRadius: 999, border: `2px solid ${C.lime}66`, fontFamily: MONO, fontSize: 20, color: C.lime, letterSpacing: '0.1em' }}>
                {p.badge}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 78, color: p.highlight ? C.lime : C.text, textShadow: p.highlight ? glow(C.lime, 18) : 'none' }}>${p.price}</span>
              <span style={{ fontFamily: SANS, fontSize: 26, color: C.muted }}>{m.copy.usd}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 50, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 25, color: '#9a9a9a' }}>
        {m.copy.oneTime}
        <div style={{ marginTop: 8, color: C.lime }}>{m.copy.note}</div>
      </div>
    </Frame>
  );
};

export const Contact: React.FC<{ market: string }> = ({ market }) => {
  const m = getMarket(market);
  return (
    <Frame horizon={70}>
      <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 170, color: C.lime, textShadow: glow(C.lime, 40) }}>&lt;CF/&gt;</div>
      <div style={{ position: 'absolute', top: 360, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: fit(m.copy.contactTitle, 960, 110), color: C.text, letterSpacing: '-0.03em' }}>
        {m.copy.contactTitle}
      </div>
      <div style={{ position: 'absolute', top: 520, left: 140, right: 140, padding: '30px 0', borderRadius: 18, background: C.lime, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, boxShadow: glow(C.lime, 40) }}>
        <ChatIcon size={54} color={C.bg} />
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 50, color: C.bg }}>{m.contact.whatsapp}</span>
      </div>
      <div style={{ position: 'absolute', top: 690, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 44, color: C.lime }}>
        {m.contact.url}
        <span> ▌</span>
      </div>
      <div style={{ position: 'absolute', top: 790, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Chip>{m.copy.note}</Chip>
      </div>
    </Frame>
  );
};
