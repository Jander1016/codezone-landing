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
    description: 'Sintetizamos la información recogida y priorizamos los retos a abordar, conectando los objetivos estratégicos con la identidad única del proyecto, asegurando que cada decisión potencie su carácter diferencial.',
    image: '/03-codezone-definir.webp'
  },
  {
    number: 3,
    title: 'Idear',
    description: 'Diseñamos soluciones técnicas alineadas con el negocio, concebidas desde un enfoque creativo y complementadas con propuestas de valor cuya incorporación estará sujeta a la aprobación del cliente.',
    image: '/05-codezone-idear.webp'
  },
  {
    number: 4,
    title: 'Prototipar',
    description: 'Elaboramos prototipos y maquetas visuales de las soluciones técnicas que permiten a clientes y usuarios validar, de forma anticipada, que el desarrollo del proyecto se mantiene alineado con lo previamente definido.',
    image: '/02-codezone-prototipar.webp'
  },
  {
    number: 5,
    title: 'Desarrollar y testear',
    description: 'Convertimos esos prototipos en productos digitales (paso a paso con SCRUM), presentando avances en cada fase para que el cliente los valide y podamos retroalimentarnos de su feedback, perfeccionando al mismo tiempo la experiencia de usuario.',
    image: '/04-codezone-desarrollar.webp'
  },
  {
    number: 6,
    title: 'Acompañar',
    description: 'Tras la entrega, acompañamos a nuestros clientes en la evolución de su negocio, respondiendo a nuevas necesidades y cambios estratégicos, con la vocación de convertirnos en un equipo de confianza a largo plazo.',
    image: '/06-codezone-acompañar.webp'
  }
];
