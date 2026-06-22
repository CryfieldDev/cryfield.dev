# Plan de trabajo — Cryfield.dev

## Auditoría Lighthouse (manual — pendiente corregir)

### Página Principal (`/`)

| Categoría | Estado | Detalle |
|---|---|---|
| SEO | ✅ Bueno | Meta tags, OG, Twitter Card, sitemap, headings correctos |
| Accesibilidad | ⚠️ Regular | Faltan `alt` en algunos `<img>`, contraste borderline en `text-cry-muted` |
| Performance | ✅ Muy bueno | Estático, fuentes con `font-display:swap`, sin render-blocking excesivo |
| Best Practices | ⚠️ Regular | Sin CSP, sin HSTS, sin `_headers` para caché |

### GastroDemo (Pizzería)

| Categoría | Estado | Detalle |
|---|---|---|
| SEO | ⚠️ Regular | Sin `<meta name="description">` en esta página |
| Accesibilidad | ⚠️ Regular | Modal/Lightbox sin focus trap, sin `aria-modal`, botones sin `aria-label` |
| Performance | ✅ Bueno | GSAP ~30KB (necesario para animaciones). `loading="lazy"` en imágenes ✅ |
| Best Practices | ⚠️ Regular | Sin `lang` en template (heredado del layout). Imágenes sin `width`/`height` |

### Problemas detectados (por prioridad)

1. **`width` y `height` en imágenes del menú** — Elimina Cumulative Layout Shift (CLS)
2. **`aria-label` en botones** — `.js-add-direct` (`+`), `.js-qty-down` (`-`), `.js-qty-up` (`+`) del carrito
3. **Focus trap en modal y lightbox** — Al abrir, el foco no se puede escapar tabulando detrás del overlay
4. **Meta description en GastroDemo** — Agregar `<meta name="description">` en la página de la pizzería
5. **Skip link** — Enlace para saltar al contenido principal al inicio del `<body>`
6. **Imágenes Unsplash sin dimensiones** — Las `<img>` del menú no tienen `width`/`height` fijos
7. **Content Security Policy** — Para protección contra XSS en sitio con formularios y enlaces externos
8. **Contraste en reseñas** — `text-gray-600` sobre `bg-white` está justo (~5.5:1), ideal subir a `gray-700`
