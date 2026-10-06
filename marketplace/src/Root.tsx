import React from 'react';
import { Composition, Still } from 'remotion';
import { Promo } from './Promo';
import { Compare, Contact, Cover, Included, PlanStill } from './stills/Stills';
import { MARKETS } from './data';
import { TL } from './lib';

// Nombres de archivo de cada imagen (en el orden en que conviene subirlas a Marketplace)
export const STILLS = [
  { key: '1-portada', el: Cover },
  { key: '2-incluye', el: Included },
  { key: '3-plan-1', el: (p: { market: string }) => <PlanStill market={p.market} index={0} /> },
  { key: '4-plan-2', el: (p: { market: string }) => <PlanStill market={p.market} index={1} /> },
  { key: '5-plan-3', el: (p: { market: string }) => <PlanStill market={p.market} index={2} /> },
  { key: '6-comparativa', el: Compare },
  { key: '7-contacto', el: Contact },
];

export const Root: React.FC = () => (
  <>
    {MARKETS.map((m) => {
      m.plans.forEach((p, i) => {
        if (p.features.length !== TL.plans.featureCounts[i]) {
          throw new Error(`${m.id}: el plan ${i + 1} tiene ${p.features.length} items; actualiza featureCounts en timeline.json y regenera el audio`);
        }
      });
      return (
        <React.Fragment key={m.id}>
          <Composition
            id={`promo-${m.id}`}
            component={Promo}
            durationInFrames={TL.durationInFrames}
            fps={TL.fps}
            width={TL.width}
            height={TL.height}
            defaultProps={{ market: m.id }}
          />
          {STILLS.map((s) => (
            <Still key={s.key} id={`img-${m.id}-${s.key}`} component={s.el} width={1080} height={1080} defaultProps={{ market: m.id }} />
          ))}
        </React.Fragment>
      );
    })}
  </>
);
