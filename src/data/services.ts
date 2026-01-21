// import webDevImg from '../assets/images/bg-services-cards/codezone-servicios-desarrollo-web-v2.webp';
// import softwareImg from '../assets/images/bg-services-cards/codezone-servicios-software-v2.webp';
// import apisImg from '../assets/images/bg-services-cards/codezone-servicios-apis-v2.webp';

export interface ServiceData {
  title: string;
  description: string;
  image?: string;
  video?: string;
  ctaText: string;
  ctaHref: string;
}

export const services: ServiceData[] = [
  {
    title: 'Desarrollo Web',
    description: 'Diseñamos y desarrollamos sitios web a medida, optimizados para el rendimientos SEO y experiencia de usuario, alineados con la identidad de tu marca.',
    video: '/videos/cz-servicio-desarrollo.webm',
    ctaText: 'Más info',
    ctaHref: '#servicios-desarrollo-web'
  },
  {
    title: 'Software a medida',
    description: 'Creamos aplicaciones y herramientas digitales personalizadas específicas para tu negocio y mejorar tus procesos internos.',
    image: '/codezone-servicios-software-v2.webp',
    ctaText: 'Más info',
    ctaHref: '#servicios-software'
  },
  {
    title: 'Integración de APIs',
    description: 'Implementamos integraciones de sistemas y APIs que conectan tus plataformas, automatizan tareas y garantizan flujos de datos eficientes y seguro.',
    video: '/videos/cz-servicio-apis.webm',
    ctaText: 'Más info',
    ctaHref: '#servicios-apis'
  }
];
