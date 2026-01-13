/**
 * Process steps data for the "¿Cómo lo hacemos?" section
 * Contains Design Thinking + Scrum methodology steps
 */

export interface ProcessStepData {
  number?: number;
  title: string;
  description: string;
  image?: string;
}

export const PROCESS_STEPS: ProcessStepData[] = [
  {
    number: 1,
    title: 'Empatizar',
    description: 'Escuchamos y comprendemos a las personas que dan vida al negocio, profundizando en su contexto, retos y necesidades reales.',
    image: '/01-codezone-empatizar.webp'
  },
  {
    number: 2,
    title: 'Definir',
    description: 'Sintetizamos la información para priorizar retos. Conectamos objetivos estratégicos con la identidad del proyecto, potenciando su valor diferencial.',
    image: '/03-codezone-definir.webp'
  },
  {
    number: 3,
    title: 'Idear',
    description: 'Diseñamos soluciones técnicas alineadas al negocio. Ideamos propuestas de valor desde un enfoque creativo, sujetas a su aprobación.',
    image: '/05-codezone-idear.webp'
  },
  {
    number: 4,
    title: 'Prototipar',
    description: 'Elaboramos prototipos y maquetas visuales. Clientes y usuarios validan anticipadamente que el desarrollo se mantiene alineado con lo definido.',
    image: '/02-codezone-prototipar.webp'
  },
  {
    number: 5,
    title: 'Desarrollar y testear',
    description: 'Desarrollamos los prototipos con SCRUM. Presentamos avances continuos para la validación del cliente, integrando su feedback para optimizar la UX.',
    image: '/04-codezone-desarrollar.webp'
  },
  {
    number: 6,
    title: 'Acompañar',
    description: 'Tras la entrega, acompañamos la evolución de su negocio. Respondemos a nuevas necesidades para ser su equipo de confianza a largo plazo.',
    image: '/06-codezone-acompañar.webp'
  }
];
