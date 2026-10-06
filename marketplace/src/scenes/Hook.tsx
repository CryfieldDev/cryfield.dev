import React from 'react';
import { AbsoluteFill, interpolateColors, random } from 'remotion';
import { C, MONO, SANS, glow } from '../theme';
import { TL, ease, fit, glitchAt, lerp, pop, typed } from '../lib';
import { Glitch } from '../fx/Glitch';
import { Slam } from '../fx/Slam';
import type { Market } from '../data';

const H = TL.hook;
export const LOGO = { text: '<CF/>', y: 760, size: 240 };
export const logoX = (j: number) => 540 + (j - (LOGO.text.length - 1) / 2) * LOGO.size * 0.6;

const Terminal: React.FC<{ m: Market; f: number }> = ({ m, f }) => {
  const enter = pop(f, 0, { damping: 16 });
  // apagado tipo TV CRT: se aplasta a una línea y luego a un punto
  const sy = lerp(f, H.crtOff, H.crtOff + 3, 1, 0.006, ease.in);
  const sx = lerp(f, H.crtOff + 3, H.crtOff + 7, 1, 0.012, ease.in);
  const bright = lerp(f, H.crtOff, H.crtOff + 3, 1, 4);
  const line1 = typed(m.copy.typed, f, H.typeStart, H.typeEnd);
  const sub = typed(m.copy.sub, f, H.subStart, H.subEnd);
  const cursorOn = Math.floor(f / 8) % 2 === 0;
  const errAmt = glitchAt(f, [H.error, H.error + 7], 9);
  if (f >= H.crtOff + 8) return null;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: 960,
          borderRadius: 18,
          border: `2px solid ${C.border}`,
          background: '#0d0d0d',
          boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 60px ${C.lime}14`,
          transform: `scale(${(0.9 + 0.1 * enter) * sx}, ${(0.9 + 0.1 * enter) * sy}) translateX(${errAmt * (random(`tx${f}`) - 0.5) * 40}px)`,
          opacity: Math.min(1, enter * 1.5),
          filter: `brightness(${bright})`,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 28px', borderBottom: `2px solid ${C.border}`, background: '#121212' }}>
          {['#ff5f57', '#febc2e', C.lime].map((c) => (
            <div key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c }} />
          ))}
          <div style={{ marginLeft: 20, fontFamily: MONO, fontSize: 26, color: C.muted }}>bash — cryfield</div>
        </div>
        <div style={{ padding: '40px 44px 52px', fontFamily: MONO, fontSize: 42, lineHeight: 1.6, minHeight: 330 }}>
          <div style={{ color: C.text }}>
            <span style={{ color: C.lime }}>{line1.slice(0, 1)}</span>
            {line1.slice(1)}
            {f < H.error && cursorOn ? <span style={{ background: C.lime, color: C.lime }}>_</span> : null}
          </div>
          {f >= H.error ? (
            <div style={{ fontWeight: 800, textShadow: glow(C.red, 18) }}>
              <Glitch text={m.copy.error} amount={errAmt} f={f} seed="err" style={{ color: C.red }} />
            </div>
          ) : null}
          <div style={{ color: C.muted, fontSize: 34 }}>
            {sub}
            {f >= H.error && cursorOn ? <span style={{ background: C.lime, color: C.lime }}>_</span> : null}
          </div>
        </div>
      </div>
      {/* punto de luz final del apagado */}
      {f >= H.crtOff + 6 ? (
        <div style={{ position: 'absolute', width: 26, height: 26, borderRadius: 99, background: '#fff', boxShadow: glow('#ffffff', 60) }} />
      ) : null}
    </AbsoluteFill>
  );
};

// Letras que se desintegran (caen y giran)
const Crumble: React.FC<{ text: string; f: number; start: number; seed: string; style: React.CSSProperties }> = ({ text, f, start, seed, style }) => (
  <span style={{ display: 'inline-flex', whiteSpace: 'pre', ...style }}>
    {Array.from(text).map((ch, i) => {
      const r = (k: string) => random(`${seed}${k}${i}`);
      const p = lerp(f, start + r('s') * 4, start + 12, 0, 1, ease.in);
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transform: `translate(${(r('x') - 0.5) * 500 * p}px, ${p * p * (400 + r('y') * 700) - Math.sin(Math.PI * p) * 120}px) rotate(${(r('r') - 0.5) * 720 * p}deg)`,
            opacity: 1 - p,
            filter: p > 0 ? `blur(${p * 6}px)` : undefined,
          }}
        >
          {ch}
        </span>
      );
    })}
  </span>
);

const INV = { y: 1010, size: 160 };
const GLYPHS = '#%&*$@<>/{}=+01';

export const Hook: React.FC<{ m: Market; f: number }> = ({ m, f }) => {
  const [s1, s2, s3] = m.copy.slams;
  const [a1, a2, a3] = H.slams;
  const zoom = lerp(f, a3, H.morph, 1, 1.07, ease.out);
  const morphing = f >= H.morph;
  const n = Array.from(s3).length;
  const cell = INV.size * 0.6;
  const srcX = (i: number) => 540 + (i - (n - 1) / 2) * cell;
  const flick = lerp(f, H.flickerStart, H.morph, 0, 0.55);

  return (
    <AbsoluteFill>
      <Terminal m={m} f={f} />

      {f >= a1 ? (
        <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
          {!morphing ? (
            <>
              <Slam text={s1} f={f} at={a1} y={640} style={{ fontFamily: SANS, fontWeight: 900, fontSize: fit(s1, 960, 150), color: C.text, letterSpacing: '-0.02em' }} />
              <Slam text={s2} f={f} at={a2} y={820} style={{ fontFamily: SANS, fontWeight: 900, fontSize: 130, color: C.text }} />
            </>
          ) : (
            <>
              <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: 'translateY(-320px)' }}>
                <Crumble text={s1} f={f} start={H.morph} seed="c1" style={{ fontFamily: SANS, fontWeight: 900, fontSize: fit(s1, 960, 150), color: C.text, letterSpacing: '-0.02em' }} />
              </AbsoluteFill>
              <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: 'translateY(-140px)' }}>
                <Crumble text={s2} f={f} start={H.morph} seed="c2" style={{ fontFamily: SANS, fontWeight: 900, fontSize: 130, color: C.text }} />
              </AbsoluteFill>
            </>
          )}

          {/* INVISIBLE. — cada letra luego vuela y se convierte en el logo <CF/> */}
          {f >= a3 && !morphing ? (
            <Slam
              text={Array.from(s3).map((ch, i) => (f >= H.flickerStart && random(`fl${i}-${f}`) < flick ? ' ' : ch)).join('')}
              f={f}
              at={a3}
              y={INV.y}
              glitch={1}
              style={{ fontFamily: MONO, fontWeight: 800, fontSize: INV.size, color: C.red, textShadow: glow(C.red, 30) }}
            />
          ) : null}
        </AbsoluteFill>
      ) : null}

      {morphing
        ? Array.from(s3).map((ch, i) => {
            const j = Math.min(LOGO.text.length - 1, Math.floor((i * LOGO.text.length) / n));
            const r = (k: string) => random(`m${k}${i}`);
            const st = H.morph + r('s') * 3;
            const pos = (fr: number) => {
              const p = lerp(fr, st, TL.drop.land, 0, 1, ease.inOut);
              const arc = (r('a') > 0.5 ? 1 : -1) * (120 + r('h') * 260);
              const x = srcX(i) * zoom + (1 - zoom) * 540 + (logoX(j) - (srcX(i) * zoom + (1 - zoom) * 540)) * p;
              const y0 = 960 + (INV.y - 960) * zoom;
              const y = y0 + (LOGO.y - y0) * p - Math.sin(Math.PI * p) * arc;
              return { p, x, y };
            };
            const cur = pos(f);
            const glyph =
              cur.p < 0.3 ? ch : cur.p > 0.72 ? LOGO.text[j] : GLYPHS[Math.floor(random(`gl${i}${Math.floor(f / 2)}`) * GLYPHS.length)];
            const color = interpolateColors(cur.p, [0, 0.6, 1], [C.red, '#ffffff', C.lime]);
            const size = INV.size * zoom + (LOGO.size - INV.size * zoom) * cur.p;
            const rot = Math.sin(Math.PI * cur.p) * (r('r') - 0.5) * 540;
            const draw = (pp: { x: number; y: number }, op: number, k: string) => (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: pp.x - size * 0.3,
                  top: pp.y - size * 0.62,
                  width: size * 0.6,
                  textAlign: 'center',
                  fontFamily: MONO,
                  fontWeight: 800,
                  fontSize: size,
                  lineHeight: 1.24,
                  color,
                  opacity: op,
                  transform: `rotate(${rot}deg)`,
                  textShadow: glow(color, 24),
                }}
              >
                {glyph}
              </div>
            );
            return (
              <React.Fragment key={i}>
                {draw(pos(f - 2), 0.18, 't2')}
                {draw(pos(f - 1), 0.35, 't1')}
                {draw(cur, 1, 'c')}
              </React.Fragment>
            );
          })
        : null}
    </AbsoluteFill>
  );
};
