/**
 * Process steps data for the "¿Cómo lo hacemos?" section
 * Contains Design Thinking + Scrum methodology steps
 */

export interface ProcessStepData {
  number: number;
  title: string;
  description: string;
  image: string;
}

export const processSteps: ProcessStepData[] = [
  {
    number: 1,
    title: 'Empatizar',
    description: 'Escuchamos y comprendemos a las personas que dan vida al negocio, profundizando en su contexto, retos y necesidades reales.',
    image: '/01-codezone-empatizar.webp'
  },
  {
    number: 2,
    title: 'Definir',
    description: 'Escuchamos y comprendemos a las personas que dan vida al negocio, profundizando en su contexto, retos y necesidades reales.',
    image: '/03-codezone-definir.webp'
  },
  {
    number: 3,
    title: 'Idear',
    description: 'Generamos múltiples soluciones creativas y viables que respondan a los desafíos identificados.',
    image: '/05-codezone-idear.webp'
  },
  {
    number: 4,
    title: 'Prototipar',
    description: 'Creamos prototipos tangibles para visualizar y validar las ideas antes de la implementación.',
    image: '/02-codezone-prototipar.webp'
  },
  {
    number: 5,
    title: 'Desarrollar',
    description: 'Implementamos la solución con metodologías ágiles, asegurando calidad y adaptabilidad.',
    image: '/04-codezone-desarrollar.webp'
  },
  {
    number: 6,
    title: 'Acompañar',
    description: 'Brindamos soporte continuo y evolución del producto según las necesidades del negocio.',
    image: '/06-codezone-acompañar.webp'
  }
];
