# Template Builder Guide — Cryfield.dev

## Stack

- **Framework:** Astro (static SSG)
- **UI:** Tailwind CSS v4 (dark theme via `@theme`)
- **Animation:** GSAP via `import gsap from 'gsap'`
- **Icons:** LordIcons (`<lord-icon src="/icons/...json" trigger="hover" colors="primary:#COLOR">`) + inline SVGs for social
- **Fonts:** System sans + monospace (CSS variables `--font-sans`, `--font-mono`)

## Global styles (from `global.css`)

Use Tailwind utility classes only. Available custom colors from `@theme`:
- `cry-darkest` — base background (`#0a0a0a`)
- `cry-card` — card surface (`#141414`)
- `cry-text` — primary text (`#e5e5e5`)
- `cry-muted` — secondary text (`#8a8a8a`)
- `cry-lime` — accent green (`#a3e635`)
- `cry-border` — borders (`#2a2a2a`)
- `cry-red`, `cry-amber` — status colors

## Template structure

```
src/pages/plantillas/[slug]/
  index.astro          ← imports and renders the demo component
  README.md            ← full description of this template

src/components/templates/
  [Name]Demo.astro     ← the complete landing page component
  _SKILL.md            ← this file
```

Each `[slug]/index.astro`:
```astro
---
import '../../../styles/global.css'
import Demo from '../../../components/templates/NameDemo.astro'
---
<Demo />
```

## Per-template config pattern

Every demo has a frontmatter `config` object + matching script constants:

```astro
---
const config = {
  defaultCurrency: 'usd',  // 'usd' or 'bs'
  bsRate: 0,               // 0 = auto from API
  ivaOn: true,             // show IVA in prices
}
---
```

Script side (must match):
```js
const BS_RATE = 0
const DEFAULT_CURRENCY = 'usd'
const IVA_ON = true
```

## Currency system (Divisas / Bs)

- API: `GET https://ve.dolarapi.com/v1/dolares/oficial` → `data.promedio`
- Priority: `state.apiRate` (live) > `BS_RATE` (hardcoded fallback) > 1
- Two currencies only: `'usd'` and `'bs'`
- Cart has radio buttons: **Divisas** / **Bs**
- `getRate()` returns 1 for USD, or the BS rate
- `formatPrice(val)` formats with `$` or `Bs.` prefix
- On currency change: reset `state.payment = null`, re-render cart + pay methods

## Payment methods

Per-currency, rendered dynamically in `#pay-methods`:
```js
const PAY_METHODS = {
  usd: ['Zelle', 'Efectivo USD', 'USDT', 'PayPal'],
  bs: ['Pago movil', 'Transferencia'],
}
```

## IVA

Static config, no toggle UI. `IVA_ON` constant controls whether tax row shows in cart.

## WhatsApp integration

All CTAs send preformatted messages via:
```
https://wa.me/584200000000?text=...
```

Include items/plan details, currency type, and payment method if selected.

## Social icons in footer

Four icons in a flex row: WhatsApp, Instagram, Facebook, X (Twitter).
Each is an 32px square with border + hover state.
Use inline SVG paths (filled, `viewBox="0 0 24 24"`).

## Contrast rules

- Main text: `text-cry-text` or `text-amber-100` (no opacity)
- Secondary text: min opacity `/50` on `cry-muted` or `amber-300`
- Labels/hints: min opacity `/40`
- Never use `/10`, `/20`, or `/30` for text — only for backgrounds/borders
- Icons on subtle backgrounds: min `/60`

## GSAP patterns

```js
// Hero entrance
gsap.timeline({ defaults: { ease: 'power3.out' } })
  .from('.hero-title', { y: 40, opacity: 0, duration: 0.7 })
  .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
  // ...

// Toast notification
function showToast(msg) {
  // timeline: slide in → pause → slide out
}

// Add-to-cart bounce
gsap.from(element, { scale: 1.4, duration: 0.2, ease: 'power2.out' })
```

## Checklist (each new template)

- [ ] Frontmatter config (`config` object)
- [ ] Script constants match config
- [ ] Nav with logo + section links
- [ ] Hero with GSAP entrance
- [ ] Core sections (plans/menu/services + prices)
- [ ] Currency selector (Divisas / Bs)
- [ ] Payment methods per currency
- [ ] WhatsApp CTA with preformatted message
- [ ] Social icons in footer
- [ ] "Hecho por Cryfield.dev" in footer
- [ ] Mobile responsive
- [ ] Contrast audit (no text below `/40` opacity)
