// Fuente única de precios y textos por mercado.
// Para cambiar un precio o un texto, edita SOLO este archivo y vuelve a renderizar.

export type Plan = {
  name: string; // "PLAN STARTER"
  short: string; // "STARTER" (texto gigante de fondo)
  badge: string;
  target: string;
  price: string; // sin "$", ej. "529.99"
  features: string[];
  highlight?: boolean;
};

export type Market = {
  id: 'us-en' | 'us-es' | 've-es';
  label: string;
  plans: Plan[];
  contact: { whatsapp: string; url: string };
  copy: {
    typed: string;
    error: string;
    sub: string;
    slams: [string, string, string];
    tagline: [string, string];
    rapid: string[];
    plansLabel: string;
    oneTime: string;
    usd: string;
    cta: string;
    ctaFinal: string;
    ctaSlams: [string, string];
    note: string;
    renewal?: string; // solo se muestra si existe
    // imágenes
    coverKicker: string;
    coverTitle: [string, string];
    coverFrom: string;
    included: string;
    includedItems: string[];
    compareTitle: string;
    contactTitle: string;
  };
};

const CONTACT_VE = { whatsapp: '+58 424-171-7524', url: 'cryfield.dev' };
const CONTACT_US = { whatsapp: '+1 (913) 282-2091', url: 'cryfield.dev' };

const featuresEn = [
  ['Single-section page', 'Clean, professional design', 'WhatsApp integrated', '1-year .com domain', '1 year of hosting in Germany', 'SSL certificate included', 'Google indexing'],
  ['Optimised landing page (Astro SSG)', 'Component-based design', 'Extreme mobile optimisation', 'Orders or bookings via WhatsApp', '1-year .com domain', '1 year of hosting in Germany', 'Google indexing', 'SSL certificate included'],
  ['Multi-page architecture (Astro + React)', 'Exclusive design from scratch', 'Advanced animations and effects', 'Node.js backend if needed', 'Advanced SEO with structured data', '1-year .com domain', '1 year of premium hosting', 'Basic editing panel included'],
];

const featuresEs = [
  ['Página simple, una sección', 'Diseño limpio y profesional', 'WhatsApp integrado', 'Dominio .com por 1 año', 'Hosting en Alemania por 1 año', 'Certificado SSL incluido', 'Indexación en Google'],
  ['Landing page optimizada (Astro SSG)', 'Diseño basado en componentes listos', 'Optimización móvil extrema', 'Pedidos o citas por WhatsApp incluido', 'Dominio .com por 1 año', 'Hosting en Alemania por 1 año', 'Indexación en Google', 'Certificado SSL incluido'],
  ['Arquitectura multipágina (Astro + React)', 'Diseño exclusivo desde cero', 'Animaciones y efectos avanzados', 'Backend en Node.js si lo requiere', 'SEO avanzado con datos estructurados', 'Dominio .com por 1 año', 'Hosting premium por 1 año', 'Panel de edición básico incluido'],
];

const targetsEs = [
  'Ideal para emprendedores y negocios que arrancan',
  'Perfecto para restaurantes, gyms y consultorios',
  'Para marcas premium o requerimientos complejos',
];
const badgesEs = ['EMPRENDEDOR', 'EL MÁS POPULAR', 'A LA MEDIDA'];

const copyEs = {
  typed: '$ curl tu-negocio.com',
  error: '✖ 404 — NOT FOUND',
  sub: '> ni en Google. ni en Maps. en ningún lado.',
  slams: ['TU NEGOCIO', 'ES', 'INVISIBLE.'] as [string, string, string],
  tagline: ['TE HACEMOS', 'VISIBLE.'] as [string, string],
  rapid: ['DOMINIO .COM', 'HOSTING', 'SSL', 'WHATSAPP', 'GOOGLE', 'MÓVIL', 'SEO', '3 PLANES'],
  plansLabel: 'PLANES',
  oneTime: 'pago único — 1 año de hosting incluido',
  usd: 'USD',
  cta: 'LO QUIERO →',
  ctaFinal: 'ESCRÍBENOS →',
  ctaSlams: ['PAGO ÚNICO.', 'SIN SORPRESAS.'] as [string, string],
  coverKicker: '// páginas web profesionales',
  coverFrom: 'DESDE',
  coverTitle: ['TU PÁGINA', 'WEB PRO'] as [string, string],
  included: 'LOS 3 PLANES INCLUYEN',
  includedItems: ['Dominio .com por 1 año', 'Hosting por 1 año', 'Certificado SSL', 'WhatsApp integrado', 'Indexación en Google', 'Diseño 100% móvil', 'Carga ultra rápida', 'Soporte incluido'],
  compareTitle: 'ELIGE TU PLAN',
  contactTitle: 'ESCRÍBENOS HOY',
};

export const MARKETS: Market[] = [
  {
    id: 'us-en',
    label: 'USA · English',
    contact: CONTACT_US,
    plans: [
      { name: 'STARTER PLAN', short: 'STARTER', badge: 'ENTREPRENEUR', target: 'Ideal for entrepreneurs and businesses just starting out', price: '529.99', features: featuresEn[0] },
      { name: 'GROWTH PLAN', short: 'GROWTH', badge: 'MOST POPULAR', target: 'Perfect for restaurants, gyms and clinics', price: '629.99', features: featuresEn[1] },
      { name: 'CUSTOM PLAN', short: 'CUSTOM', badge: 'TAILOR-MADE', target: 'For premium brands or complex requirements', price: '1559.99', features: featuresEn[2], highlight: true },
    ],
    copy: {
      typed: '$ curl your-business.com',
      error: '✖ 404 — NOT FOUND',
      sub: '> not on Google. not on Maps. nowhere.',
      slams: ['YOUR BUSINESS', 'IS', 'INVISIBLE.'],
      tagline: ['WE MAKE YOU', 'VISIBLE.'],
      rapid: ['.COM DOMAIN', 'HOSTING', 'SSL', 'WHATSAPP', 'GOOGLE', 'MOBILE', 'SEO', '3 PLANS'],
      plansLabel: 'PLANS',
      oneTime: 'one-time — 1 year of hosting included',
      usd: 'USD',
      cta: 'I WANT IT →',
      ctaFinal: 'MESSAGE US →',
      ctaSlams: ['ONE PAYMENT.', 'NO SURPRISES.'],
      note: '.com domain + 1 year of hosting included',
      coverKicker: '// professional websites',
      coverFrom: 'FROM',
      coverTitle: ['YOUR PRO', 'WEBSITE'],
      included: 'ALL 3 PLANS INCLUDE',
      includedItems: ['1-year .com domain', '1 year of hosting', 'SSL certificate', 'WhatsApp integrated', 'Google indexing', '100% mobile design', 'Ultra-fast loading', 'Support included'],
      compareTitle: 'PICK YOUR PLAN',
      contactTitle: 'MESSAGE US TODAY',
    },
  },
  {
    id: 'us-es',
    label: 'USA · Español',
    contact: CONTACT_US,
    plans: [
      { name: 'PLAN STARTER', short: 'STARTER', badge: badgesEs[0], target: targetsEs[0], price: '529.99', features: featuresEs[0] },
      { name: 'PLAN GROWTH', short: 'GROWTH', badge: badgesEs[1], target: targetsEs[1], price: '629.99', features: featuresEs[1] },
      { name: 'PLAN CUSTOM', short: 'CUSTOM', badge: badgesEs[2], target: targetsEs[2], price: '1559.99', features: featuresEs[2], highlight: true },
    ],
    copy: { ...copyEs, note: 'Dominio .com + hosting por 1 año incluidos' },
  },
  {
    id: 've-es',
    label: 'Venezuela · Español',
    contact: CONTACT_VE,
    plans: [
      { name: 'PLAN ECONÓMICO', short: 'ECONÓMICO', badge: badgesEs[0], target: targetsEs[0], price: '129.99', features: featuresEs[0] },
      { name: 'PLAN STARTER', short: 'STARTER', badge: badgesEs[1], target: targetsEs[1], price: '199.99', features: featuresEs[1] },
      { name: 'PLAN CUSTOM', short: 'CUSTOM', badge: badgesEs[2], target: targetsEs[2], price: '599.99', features: featuresEs[2], highlight: true },
    ],
    copy: { ...copyEs, note: 'Paga en USD o Bs · tasa BCV del día', renewal: 'Renovación desde el mes 13: $129/año o $15/mes' },
  },
];

export const getMarket = (id: string) => {
  const m = MARKETS.find((x) => x.id === id);
  if (!m) throw new Error(`Mercado desconocido: ${id}`);
  return m;
};
