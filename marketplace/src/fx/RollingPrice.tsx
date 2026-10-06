import React from 'react';
import { lerp, ease } from '../lib';

const buildStrip = (from: string, to: string, cycles: number) => {
  const seq: string[] = [from];
  let d = from === ' ' ? -1 : Number(from);
  for (let s = 0; s < cycles * 10; s++) {
    d = (d + 1) % 10;
    seq.push(String(d));
  }
  if (to === ' ') seq.push(' ');
  else while (seq[seq.length - 1] !== to) {
    d = (d + 1) % 10;
    seq.push(String(d));
  }
  return seq;
};

// Precio estilo tragamonedas/odómetro: cada dígito gira desde `from` hasta `to`
export const RollingPrice: React.FC<{
  from: string;
  to: string;
  f: number;
  start: number;
  land: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}> = ({ from, to, f, start, land, fontSize, color, fontFamily }) => {
  const n = Math.max(from.length, to.length);
  const a = from.padStart(n, ' ');
  const b = to.padStart(n, ' ');
  const lineH = fontSize * 1.08;
  const cell = { display: 'inline-block', width: '0.6em', textAlign: 'center' as const };
  return (
    <span style={{ fontFamily, fontSize, color, fontWeight: 800, lineHeight: `${lineH}px`, display: 'inline-flex', whiteSpace: 'pre' }}>
      {Array.from(b).map((ch, i) => {
        if (ch === '.') return <span key={i} style={{ ...cell, width: '0.45em' }}>.</span>;
        const fromCh = a[i] === '.' ? '0' : a[i];
        if (fromCh === ch && f >= land) return <span key={i} style={cell}>{ch}</span>;
        const strip = buildStrip(fromCh, ch, 1 + Math.floor((n - 1 - i) / 2));
        const myLand = land - (n - 1 - i) * 2;
        const pos = (fr: number) => lerp(fr, start, myLand, 0, strip.length - 1, ease.inOut);
        const p = pos(f);
        const speed = Math.abs(p - pos(f - 1));
        const ghosts = speed > 0.25 ? [-0.33, 0.33] : [];
        const hidden = b[i] === ' ' && p >= strip.length - 1;
        if (hidden) return null;
        const col = (offset: number, op: number) => (
          <span
            key={offset}
            style={{
              position: offset === 0 ? 'relative' : 'absolute',
              left: 0,
              top: 0,
              display: 'flex',
              flexDirection: 'column',
              transform: `translateY(${-(p + offset * speed) * lineH}px)`,
              opacity: op,
            }}
          >
            {strip.map((s, k) => (
              <span key={k} style={{ height: lineH }}>{s}</span>
            ))}
          </span>
        );
        return (
          <span key={i} style={{ ...cell, height: lineH, overflow: 'hidden', position: 'relative' }}>
            {col(0, ghosts.length ? 0.55 : 1)}
            {ghosts.map((g) => col(g, 0.3))}
          </span>
        );
      })}
    </span>
  );
};
