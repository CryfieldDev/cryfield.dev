// Renderiza videos + imágenes de todos los mercados (o solo los que pases):
//   npm run render                 → todo
//   npm run render -- ve-es        → solo Venezuela
//   npm run render -- us-en --solo-imagenes
//   npm run render -- drako-us-en drako-us-es   → versiones del vendedor Drako
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';

const args = process.argv.slice(2);
const onlyStills = args.includes('--solo-imagenes');
const onlyVideo = args.includes('--solo-video');
const all = ['us-en', 'us-es', 've-es', 'drako-us-en', 'drako-us-es'];
const markets = args.filter((a) => all.includes(a));
const targets = markets.length ? markets : all;
const browserExecutable = process.env.REMOTION_BROWSER || null;
const STILLS = ['1-portada', '2-incluye', '3-plan-1', '4-plan-2', '5-plan-3', '6-comparativa', '7-contacto'];

console.log('Empaquetando proyecto…');
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });

for (const m of targets) {
  const dir = path.resolve('out', m);
  mkdirSync(dir, { recursive: true });
  if (!onlyStills) {
    const composition = await selectComposition({ serveUrl, id: `promo-${m}`, inputProps: { market: m }, browserExecutable });
    let last = -1;
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      crf: 16,
      audioBitrate: '256k',
      outputLocation: path.join(dir, `video-${m}.mp4`),
      inputProps: { market: m },
      browserExecutable,
      onProgress: ({ progress }) => {
        const pct = Math.floor(progress * 10) * 10;
        if (pct !== last) {
          last = pct;
          process.stdout.write(`  ${m} video ${pct}%\n`);
        }
      },
    });
    console.log(`✓ out/${m}/video-${m}.mp4`);
  }
  if (!onlyVideo) {
    for (const s of STILLS) {
      const composition = await selectComposition({ serveUrl, id: `img-${m}-${s}`, inputProps: { market: m }, browserExecutable });
      await renderStill({ composition, serveUrl, output: path.join(dir, `${s}.png`), inputProps: { market: m }, browserExecutable });
    }
    console.log(`✓ out/${m}/ (${STILLS.length} imágenes)`);
  }
}
