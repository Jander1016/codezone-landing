/**
 * Process steps data for the "¿Cómo lo hacemos?" section
 * Contains Design Thinking + Scrum methodology steps
 */

import imgEmpatizar from '../assets/images/01-codezone-empatizar.webp';
import imgDefinir from '../assets/images/03-codezone-definir.webp';
import imgIdear from '../assets/images/05-codezone-idear.webp';
import imgPrototipar from '../assets/images/02-codezone-prototipar.webp';
import imgDesarrollar from '../assets/images/04-codezone-desarrollar.webp';
import imgAcompanar from '../assets/images/06-codezone-acompañar.webp';

export interface ProcessStepData {
  number?: number;
  title: string;
  description: string;
  image?: ImageMetadata;
}

export const PROCESS_STEPS: ProcessStepData[] = [
  {
    number: 1,
    title: 'Empatizar',
    description: 'Escuchamos y comprendemos a las personas que dan vida al negocio, profundizando en su contexto, retos y necesidades reales.',
    image: imgEmpatizar
  },
  {
    number: 2,
    title: 'Definir',
    description: 'Sintetizamos la información para priorizar retos. Conectamos objetivos estratégicos con la identidad del proyecto, potenciando su valor diferencial.',
    image: imgDefinir
  },
  {
    number: 3,
    title: 'Idear',
    description: 'Diseñamos soluciones técnicas alineadas al negocio. Ideamos propuestas de valor desde un enfoque creativo, sujetas a su aprobación.',
    image: imgIdear
  },
  {
    number: 4,
    title: 'Prototipar',
    description: 'Elaboramos prototipos y maquetas visuales. Clientes y usuarios validan anticipadamente que el desarrollo se mantiene alineado con lo definido.',
    image: imgPrototipar
  },
  {
    number: 5,
    title: 'Desarrollar y testear',
    description: 'Desarrollamos los prototipos con SCRUM. Presentamos avances continuos para la validación del cliente, integrando su feedback para optimizar la UX.',
    image: imgDesarrollar
  },
  {
    number: 6,
    title: 'Acompañar',
    description: 'Tras la entrega, acompañamos la evolución de su negocio. Respondemos a nuevas necesidades para ser su equipo de confianza a largo plazo.',
    image: imgAcompanar
  }
];
