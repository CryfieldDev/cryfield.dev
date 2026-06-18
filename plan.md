# Plan de Plantillas Web — Cryfield.dev

## Objetivo

Crear 9 landing pages demo dentro del sitio, una por cada categoría de negocio.
Cada demo es una página independiente en `/plantillas/[slug]` con diseño propio,
contenido ficticio realista y funcionalidades específicas del rubro.

---

## Categorías

### 1. Gastronomía — `/plantillas/gastronomia`
- Hero con foto de plato destacado + nombre del restaurante ficticio
- Menú digital con categorías (entradas, principales, postres, bebidas)
- Cada plato con foto, descripción y precio
- Carrito de compras que arma un pedido
- Botón "Pedir por WhatsApp" que envía el resumen del pedido
- Sección de reseñas de clientes ficticios
- Footer con horarios, dirección y redes sociales

### 2. Gimnasios — `/plantillas/gimnasios`
- Hero con foto de personas entrenando + propuesta de valor
- Planes de membresía mensual/trimestral/anual
- Parrilla de clases semanales (horarios por día)
- Sección "Clase de prueba gratis" con formulario de agendamiento
- Galería de fotos del espacio
- Testimonios de alumnos
- Footer con dirección y contacto

### 3. Consultorios — `/plantillas/consultorios`
- Hero con foto del doctor/a + nombre y especialidad
- Credenciales y títulos académicos
- Servicios ofrecidos con descripción
- Sección de testimonios de pacientes
- Botón "Agenda tu cita" que redirige a WhatsApp con datos prellenados
- Ubicación del consultorio
- Horarios de atención

### 4. Tiendas / Retail — `/plantillas/tiendas`
- Hero con foto de la tienda o productos destacados
- Catálogo de productos con imagen, nombre, precio
- Carrito de compras lateral o modal
- Checkout que arma pedido y lo envía por WhatsApp
- Sección "Lo más vendido"
- Categorías de productos con filtros

### 5. Tecnología / Reparaciones — `/plantillas/tecnologia`
- Hero con foto de técnico trabajando + eslogan
- Servicios ofrecidos (reparación de PC, celulares, soporte IT, etc.)
- Precios de servicios más comunes
- Sección "Cómo trabajamos" (pasos: diagnóstico, presupuesto, reparación, entrega)
- Botón de contacto directo a WhatsApp
- Reseñas de clientes

### 6. Belleza / Estética — `/plantillas/belleza`
- Hero elegante con foto del salón/barbería
- Galería de trabajos (antes/después, cortes, uñas, maquillaje)
- Lista de servicios con precios
- Sección "Reserva tu turno" que envía a WhatsApp
- Reseñas de clientes
- Ubicación en mapa ficticio

### 7. Inmobiliarias — `/plantillas/inmobiliarias`
- Hero con foto de propiedad destacada
- Galería de propiedades en venta/alquiler
- Cada propiedad con fotos, precio, ubicación, descripción
- Filtros por tipo (casa, apto, local) y operación (venta, alquiler)
- Formulario de contacto por propiedad
- Sección "Sobre nosotros" (agencia ficticia)

### 8. Educación — `/plantillas/educacion`
- Hero con foto de estudiantes/clase + propuesta
- Cursos ofrecidos con duración, nivel y precio
- Parrilla de horarios
- Sección "Inscribirme ahora" con formulario
- Testimonios de alumnos
- Sección "Sobre el profesor/institución"

### 9. Servicios / Talleres — `/plantillas/servicios`
- Hero con foto del taller o trabajo realizado
- Servicios ofrecidos con precios referenciales
- Galería de trabajos realizados
- Sección "Solicitar presupuesto" con formulario a WhatsApp
- Horarios de atención
- Ubicación

---

## Estructura de archivos

```
src/
  pages/
    plantillas/
      index.astro             ← Grid con las 9 tarjetas y link a cada demo
      gastronomia.astro
      gimnasios.astro
      consultorios.astro
      tiendas.astro
      tecnologia.astro
      belleza.astro
      inmobiliarias.astro
      educacion.astro
      servicios.astro
  components/
    templates/
      GastroDemo.astro
      GymDemo.astro
      ConsultorioDemo.astro
      TiendaDemo.astro
      TecnologiaDemo.astro
      BellezaDemo.astro
      InmobiliariaDemo.astro
      EducacionDemo.astro
      ServicioDemo.astro
```

Cada `[categoria].astro` en pages importa su componente demo y lo renderiza.
Cada demo component contiene TODO el HTML de esa landing (hero, secciones, footer),
con su propio diseño y paleta de colores.

---

## Checklist de progreso

- [ ] Estructura inicial: `plantillas/index.astro` + archivos de cada categoría
- [ ] **1. Gastronomía** — demo completa
- [ ] **2. Gimnasios** — demo completa
- [ ] **3. Consultorios** — demo completa
- [ ] **4. Tiendas / Retail** — demo completa
- [ ] **5. Tecnología / Reparaciones** — demo completa
- [ ] **6. Belleza / Estética** — demo completa
- [ ] **7. Inmobiliarias** — demo completa
- [ ] **8. Educación** — demo completa
- [ ] **9. Servicios / Talleres** — demo completa
