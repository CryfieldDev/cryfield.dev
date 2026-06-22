# Gimnasios — Demo Template

**URL:** `/plantillas/gimnasios`
**Component:** `src/components/templates/GymDemo.astro`

## Concepto

Landing page para un gimnasio ficticio ("Ruptura Fit") con planes de membresía, parrilla de clases semanales y agendamiento de clase de prueba por WhatsApp. Tono motivacional, paleta naranja/rojo intenso.

## Secciones

| Sección | Detalle |
|---|---|
| **Nav** | Logo, links a Planes, Clases, Galería, contacto |
| **Hero** | "ROMPÉ TUS LÍMITES" con glow rojo, CTA a planes |
| **Planes** | 3 tarjetas: Mensual ($30) / Trimestral ($75) / Anual ($120), features, selector Divisas/Bs |
| **Clases** | Parrilla semanal Lun–Sáb con horarios, cada clase clickable → WhatsApp con datos |
| **Clase gratis** | CTA destacado "Quiero mi clase de prueba" → WhatsApp |
| **Galería** | Grid de 6 placeholders visuales del espacio |
| **Testimonios** | 3 alumnos ficticios con foto, texto, rating |
| **Footer** | Dirección, horarios, redes sociales, "Hecho por Cryfield.dev" |

## Funcionalidades JS

- **GSAP:** Hero entrance
- **API:** Tasa BCV para toggle Divisas/Bs
- **Planes:** Click para seleccionar, se resalta la card, precio se actualiza según moneda
- **Clases:** Click en cualquier celda de horario → WhatsApp con "Quiero la clase [nombre] el [día] a las [hora]"
- **Clase de prueba:** WhatsApp con datos del interesado
- **Moneda:** Divisas/Bs con métodos de pago dinámicos
