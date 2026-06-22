# Cryfield.dev

Landing page + demos para agencia de desarrollo web. Sitios estáticos ultra-rápidos con Astro + Tailwind CSS.

---

## ✅ Lo que está hecho

### Página principal (`/`)

| Sección | Componente | Estado |
|---------|-----------|--------|
| Hero | `Hero.astro` | Terminal animado, headline con gradiente, 3 CTAs |
| Stats | `StatsBar.astro` | 4 métricas clave |
| Pain Points | `ProblemSection.astro` | 4 problemas con iconos Lordicon |
| Comparativa | `ComparisonTable.astro` | Cryfield vs WordPress/Wix |
| Cómo funciona | `HowItWorks.astro` | 3 pasos: WhatsApp > Desarrollo > Lanzamiento |
| Soluciones | `SolutionsSection.astro` | 9 verticales de negocio |
| Precios | `PricingCards.astro` | 3 planes ($99.99 / $139.99 / $299.99) |
| FAQ | `FAQ.astro` | 8 preguntas frecuentes (acordeón) |
| CTA / Contacto | `CTASection.astro` | Formulario con validación > redirect WhatsApp |
| Layout global | `Layout.astro` | Nav, footer, SEO meta, crosshair, scanlines, CSP |

### Galería de plantillas (`/plantillas`)

- Listado de 9 verticales con links (2 construidas, 7 pendientes)

### Demos construidas

- **Pizzería** (`/plantillas/gastronomia`) — Carrito, modal toppings, lightbox, tasas BCV en vivo, WhatsApp
- **Gimnasio** (`/plantillas/gimnasios`) — Planes, horario semanal, BMI calculator, trainers, animejs

### Infraestructura

- **Astro 6** con SSG, Tailwind CSS v4, GSAP 3.15, animejs 4.4, Lordicon
- **Build a `dist/`** — exitoso, sitemap generado
- **server.bat** — Script para levantar dev + tunel Serveo
- **CHANGELOG.md** — Registro de sesiones de desarrollo
- **plan.md** — Auditoría Lighthouse y pendientes

---

## 📝 Lo que está por hacer

### Prioritario (Lighthouse)

- [ ] **`width`/`height` en imágenes del menú** — Eliminar CLS en GastroDemo
- [ ] **`aria-label` en botones del carrito** — `+`, `-` en `.js-add-direct`, `.js-qty-down`, `.js-qty-up`
- [ ] **Focus trap en modal/lightbox** — Evitar que el foco escape detrás del overlay (GastroDemo)
- [ ] **Meta description en GastroDemo** — Agregar `<meta name="description">` en la página
- [ ] **Contraste en reseñas** — Subir `text-gray-600` a `gray-700`

### Plantillas pendientes (7 de 9)

- [ ] **Consultorios** (`/plantillas/consultorios`)
- [ ] **Tiendas / E-commerce** (`/plantillas/tiendas`)
- [ ] **Tecnología / SaaS** (`/plantillas/tecnologia`)
- [ ] **Belleza / Peluquerías** (`/plantillas/belleza`)
- [ ] **Inmobiliarias** (`/plantillas/inmobiliarias`)
- [ ] **Educación / Cursos** (`/plantillas/educacion`)
- [ ] **Servicios profesionales** (`/plantillas/servicios`)

### Mejoras generales

- [ ] Unificar `GymDemo.astro` vs la página standalone — decidir cuál versión mantener
- [ ] Actualizar `README.md` (aún tiene el template default de Astro)
- [ ] Agregar `_headers` para caché y seguridad (HSTS)
- [ ] Subir assets propios a `src/assets/` (ahora vacío)
- [ ] Decidir si usar React (`@astrojs/react` instalado pero sin uso)

---

## Comandos

```bash
npm run dev       # Dev server en puerto 3000
npm run build     # Build a dist/
npm run preview   # Preview del build
server.bat start  # Dev + tunel Serveo
server.bat stop   # Apagar servidores
```
