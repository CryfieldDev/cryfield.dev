# Gastronomía / Pizzería — Demo Template

**URL:** `/plantillas/gastronomia`
**Component:** `src/components/templates/GastroDemo.astro`

## Concepto

Landing page para una pizzería ficticia ("Pizza Roma") con menú digital interactivo. El cliente puede elegir pizzas, agregarles extras (toppings), armar un pedido, seleccionar moneda (Divisas/Bs) y método de pago, y enviar todo por WhatsApp.

Aunque el ejemplo es una pizzería, el sistema de menú con extras sirve para cualquier rubro gastronómico.

## Secciones

| Sección | Detalle |
|---|---|
| **Nav** | Logo SVG de pizza + "ROMA", links a Pizzas y Reseñas, carrito con contador |
| **Hero** | "LA PIZZA PERFECTA", badge de horno de leña, ilustración SVG de pizza con toppings |
| **Menú** | 4 categorías (Pizzas Clásicas, Pizzas Especiales, Bebidas, Postres), cada ítem con thumbnail WebP, precio USD + BS |
| **Toppings Modal** | Al hacer clic en una pizza se abre un modal con imagen, nombre, descripción + checkboxes de extras (Queso extra, Pepperoni, Champiñones, etc.) con precio individual |
| **Carrito flotante** | Lista de ítems con toppings visibles, qty +/-/remove, subtotal/IVA/total, selector Divisas/Bs, métodos de pago dinámicos, botón WhatsApp |
| **Reseñas** | 3 cards con reseñas ficticias sobre las pizzas |
| **Footer** | Pizza SVG + marca, horarios, dirección, redes sociales (WA/IG/FB/X) |

## Funcionalidades JS

- **GSAP:** Hero entrance animation, toast slide-in, modal scale-in
- **API:** `ve.dolarapi.com/v1/dolares/oficial` para tasa BCV en vivo (fallback a hardcode)
- **Toppings:** Modal con 8 toppings seleccionables, total se actualiza en vivo, se agrupan por combinación única en el carrito
- **Moneda:** Toggle Divisas (USD) / Bs — precios en menú muestran ambas, carrito convierte
- **Carrito:** Add/remove items con toppings, qty controls, IVA estático, total en moneda seleccionada
- **Pago:** Métodos dinámicos según moneda (USD→Zelle/Efectivo USD/USDT/PayPal, Bs→Pago móvil/Transferencia)
- **WhatsApp:** Mensaje preformateado con items, toppings, moneda y método de pago
- **Toast:** Notificación al agregar item
- **Imágenes:** WebP via Unsplash con `auto=format&fm=webp`, fallback oculto si no carga

## Datos de ejemplo

```js
const r = {
  name: "Pizza Roma",
  tagline: "La tradizione italiana en cada rebanada",
  slogan: "Masa madre, horno de leña y los mejores ingredientes desde 2015",
}
```

```js
// 8 toppings disponibles
const toppings = [
  { n: 'Queso extra', p: 1.50 },
  { n: 'Pepperoni', p: 1.00 },
  { n: 'Champiñones', p: 1.00 },
  { n: 'Aceitunas', p: 0.75 },
  { n: 'Cebolla', p: 0.75 },
  { n: 'Pimientos', p: 0.75 },
  { n: 'Jamón', p: 1.50 },
  { n: 'Anchoas', p: 2.00 },
]
```
