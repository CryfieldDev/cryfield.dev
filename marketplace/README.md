# Cryfield · Videos e imágenes para Marketplace

Genera **3 versiones** del contenido con la estética de cryfield.dev:

| Mercado | Idioma | Precios |
|---|---|---|
| `us-en` | Inglés | USA ($529.99 / $629.99 / $1559.99) |
| `us-es` | Español | USA ($529.99 / $629.99 / $1559.99) |
| `ve-es` | Español | Venezuela ($129.99 / $199.99 / $599.99) |

Cada mercado produce:

- `video-<mercado>.mp4`: video vertical 1080×1920 de 25 s con música y efectos de sonido.
- 7 imágenes cuadradas 1080×1080: portada, qué incluye, 3 planes, comparativa y contacto.

Los textos para pegar en cada publicación están en [`PUBLICACIONES.md`](./PUBLICACIONES.md).

## Uso

Necesitas Node 22+.

```bash
cd marketplace
npm install
npm run studio                 # editor visual en el navegador para ver y ajustar
npm run render                 # renderiza todo en out/
npm run render -- ve-es        # solo Venezuela
npm run render -- us-en --solo-imagenes
```

## Cambiar precios o textos

Todo está en **`src/data.ts`**. Cambias el precio o el texto y vuelves a renderizar.

Si cambias **cuántos items tiene un plan**, también tienes que:

1. Actualizar `featureCounts` en `src/timeline.json`.
2. Regenerar el audio con `python3 scripts/make-audio.py` (requiere `pip install numpy scipy` y ffmpeg).

Así los "blips" del sonido siguen sincronizados con cada item.

## Cómo está hecho

- `src/timeline.json`: los tiempos (en frames, a 30 fps) de cada golpe, transición y efecto. El video y el audio leen los dos este archivo, por eso quedan sincronizados.
- `scripts/make-audio.py`: sintetiza música (120 BPM) y efectos de sonido sin samples ni licencias.
- `src/scenes/`: las escenas del video:
  - Hook: terminal → 404 → apagado CRT → letras que se vuelven el logo.
  - Drop: logo, palabras rápidas y cortina que sale de la "/".
  - Plans: tarjetas 3D que giran de un plan al otro con el precio tipo tragamonedas.
  - Cta: la tarjeta colapsa y se convierte en el botón de contacto.
- `src/stills/`: las imágenes.
- `public/fonts/`: Inter y JetBrains Mono (licencia OFL), incluidas para que funcione sin internet.

> Remotion es gratis para personas y empresas de hasta 3 empleados. Si el equipo crece, revisa su licencia en remotion.dev.
