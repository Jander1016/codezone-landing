/**
 * Services data for the "Tech Your Vibes" section
 * Contains service cards with descriptions and images
 */

export interface ServiceData {
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaHref: string;
}

export const services: ServiceData[] = [
  {
    title: 'Desarrollo Web',
    description: 'Diseñamos y desarrollamos sitios web a medida, optimizados para el rendimientos SEO y experiencia de usuario, alineados con la identidad de tu marca.',
    image: '/codezone-servicios-desarrollo-web.webp',
    ctaText: 'Más info',
    ctaHref: '#contact-separator'
  },
  {
    title: 'Software a medida',
    description: 'Creamos aplicaciones y herramientas digitales personalizadas específicas para tu negocio y mejorar tus procesos internos.',
    image: '/codezone-servicios-software.webp',
    ctaText: 'Más info',
    ctaHref: '#contact-separator'
  },
  {
    title: 'Integración de APIs',
    description: 'Implementamos integraciones de sistemas y APIs que conectan tus plataformas, automatizan tareas y garantizan flujos de datos eficientes y seguro.',
    image: '/codezone-servicios-apis.webp',
    ctaText: 'Más info',
    ctaHref: '#contact-separator'
  }
];
