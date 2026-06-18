# CHANGELOG — Cryfield.dev Landing Page

## Sesión 1 — Configuración inicial y estructura

- Proyecto inicializado con `create-astro` (template `basics`)
- Dependencias instaladas: `tailwindcss`, `@tailwindcss/vite`, `clsx`, `tailwind-merge`, `@astrojs/react`, `@astrojs/sitemap`, `react`, `react-dom`, `@lordicon/element`
- Tema oscuro carbon + acento lime (`#a3e635`) definido en `global.css`
- Layout con crosshair, scanlines CRT, textura grain, hex-burst al click
- Secciones creadas: Hero, StatsBar, ProblemSection, ComparisonTable, HowItWorks, SolutionsSection, PricingCards, FAQ, CTASection
- 19 iconos Lordicon descargados como JSON a `/public/icons/`
- Número WhatsApp: `+584241717524`

## Sesión 2 — Iconos Lordicon Wired / Outline

- Se intentó usar iconos de la familia "wired/outline" desde la CDN de Lordicon
- Los archivos `.li` (formato comprimido propietario) se descargan correctamente pero NO son JSON estándar
- Se descubrió que el player `@lordicon/element` versión 2.3.1 decodifica `.li` con: `atob()` + XOR key 42 + `JSON.parse()`
- Se escribió script Python para convertir `.li` → `.json` usando el mismo decoder
- 6 iconos convertidos y guardados en `/public/icons/`:

| Archivo | Icono Lordicon |
|---------|---------------|
| `food.json` | wired-outline-1927-food-truck |
| `gym.json` | wired-outline-1764-pushups |
| `tech.json` | wired-outline-478-computer-display |
| `beauty.json` | wired-outline-1561-comb |
| `services.json` | wired-outline-950-attract-customers |
| `github.json` | wired-outline-2572-logo-github |

- SolutionsSection actualizada con los 5 iconos nuevos
- Footer actualizado con link a `github.com/CryfieldDev` + icono GitHub animado

## Decisiones técnicas

- El player `<lord-icon>` soporta `.li` nativamente (detecta extensión ≠ `.json` y aplica XOR decoder), pero se optó por convertir a `.json` para evitar dependencia del decoder del player
- Los archivos `.li` originales se eliminaron, solo se conservan los `.json`
- El server dev corre con `--host` para acceso desde la red local

## Estado actual

- Build: ✅ exitoso
- Server: `http://192.168.1.4:4321`
- Todos los iconos de soluciones funcionando con Lordicon wired/outline
