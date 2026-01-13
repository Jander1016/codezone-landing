/**
 * Services data for the "Tech Your Vibes" section
 * Contains service cards with descriptions and images
 */

import webDevImg from '../assets/images/codezone-servicios-desarrollo-web.webp';
import softwareImg from '../assets/images/codezone-servicios-software.webp';
import apisImg from '../assets/images/codezone-servicios-apis.webp';

export interface ServiceData {
  title: string;
  description: string;
  image: ImageMetadata;
  ctaText: string;
  ctaHref: string;
}

export const services: ServiceData[] = [
  {
    title: 'Desarrollo Web',
    description: 'Diseñamos y desarrollamos sitios web a medida, optimizados para el rendimientos SEO y experiencia de usuario, alineados con la identidad de tu marca.',
    image: webDevImg,
    ctaText: 'Más info',
    ctaHref: '#contact-separator'
  },
  {
    title: 'Software a medida',
    description: 'Creamos aplicaciones y herramientas digitales personalizadas específicas para tu negocio y mejorar tus procesos internos.',
    image: softwareImg,
    ctaText: 'Más info',
    ctaHref: '#contact-separator'
  },
  {
    title: 'Integración de APIs',
    description: 'Implementamos integraciones de sistemas y APIs que conectan tus plataformas, automatizan tareas y garantizan flujos de datos eficientes y seguro.',
    image: apisImg,
    ctaText: 'Más info',
    ctaHref: '#contact-separator'
  }
];
