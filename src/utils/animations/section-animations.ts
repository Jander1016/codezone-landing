import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { maskTextRevealVertical, blurTextReveal } from './text-animations';
import { groupByRows } from './scroll-animations';
import { ANIMATION_CONFIG } from './animation-helpers';

/**
 * Opciones de configuración para animaciones de sección
 */
export interface SectionAnimationOptions {
  /** Punto de inicio del ScrollTrigger (default: 'top 80%') */
  start?: string;
  /** Duración base de las animaciones (default: 0.6) */
  duration?: number;
  /** Delay entre animaciones secuenciales (default: 0.2) */
  sequenceDelay?: number;
  /** Mostrar markers de debug (default: false) */
  markers?: boolean;
}

/**
 * Opciones específicas para animación de items en grid
 */
export interface GridItemsAnimationOptions extends SectionAnimationOptions {
  /** Selector de los items a animar */
  itemsSelector: string;
  /** Animar por filas (default: true) */
  animateByRows?: boolean;
  /** Delay entre filas (default: 0.15) */
  rowDelay?: number;
  /** Delay entre items de la misma fila (default: 0.1) */
  itemDelay?: number;
}

/**
 * Selectores CSS para la sección Stack Tecnológico
 */
const STACK_SELECTORS = {
  section: '#stack',
  subtitle: '.stack-subtitle',
  title: '.stack-title',
  gridContainer: '.stack-grid',
  items: '.tech-stack-card'
} as const;

/**
 * Selectores CSS para la sección Contacto
 */
const CONTACT_SELECTORS = {
  section: '#contact',
  title: '.contact-title',
  paragraphs: '.contact-paragraph',
  logo: '.contact-logo img',
  buttons: '.contact-buttons a',
  form: '.form-contact'
} as const;

/**
 * Configuración por defecto de animaciones para cada sección
 */
const ANIMATION_DEFAULTS = {
  stack: {
    start: 'top 85%',
    duration: 0.7,
    sequenceDelay: 0.2,
    subtitle: {
      y: 60,
      blur: 10,
      ease: 'power2.out'
    },
    title: {
      stagger: 0.1,
      ease: 'power3.out'
    },
    items: {
      rowDelay: 0.3,
      itemDelay: 0.15,
      y: 50,
      ease: 'power2.out'
    }
  },
  contact: {
    start: 'top 85%',
    duration: 0.6,
    sequenceDelay: 0.2,
    title: {
      stagger: 0.1,
      ease: 'power3.out'
    },
    blur: {
      offset: 50,
      blur: 10,
      ease: 'power2.out'
    },
    stagger: {
      paragraphs: 0.15,
      buttons: 0.1
    }
  }
} as const;

/**
 * Anima items de un grid de forma secuencial, opcionalmente por filas
 * Función auxiliar reutilizable para animar grids en cualquier sección
 * 
 * @param container - Selector o elemento contenedor del grid
 * @param options - Opciones de configuración
 * @returns ScrollTrigger creado
 * 
 * @example
 * ```typescript
 * // Animar items por filas
 * animateGridItems('#stack', {
 *   itemsSelector: '.tech-stack-card',
 *   animateByRows: true,
 *   rowDelay: 0.15
 * });
 * 
 * // Animar items secuencialmente sin agrupar por filas
 * animateGridItems('#services', {
 *   itemsSelector: '.service-card',
 *   animateByRows: false,
 *   itemDelay: 0.1
 * });
 * ```
 */
export function animateGridItems(
  container: string | Element,
  options: GridItemsAnimationOptions
): ScrollTrigger | null {
  // Obtener el elemento contenedor
  const containerEl = typeof container === 'string'
    ? document.querySelector(container)
    : container;

  // Validar que el contenedor existe
  if (!containerEl) {
    console.warn(`animateGridItems: Container not found - ${container}`);
    return null;
  }

  // Seleccionar los items a animar
  const items = containerEl.querySelectorAll(options.itemsSelector);

  // Validar que hay items para animar
  if (!items || items.length === 0) {
    console.warn(`animateGridItems: No items found with selector - ${options.itemsSelector}`);
    return null;
  }

  // Configuración por defecto
  const config = {
    start: options.start || 'top 90%',
    duration: options.duration || ANIMATION_CONFIG.durations.normal,
    animateByRows: options.animateByRows !== false, // default true
    rowDelay: options.rowDelay || 0.15,
    itemDelay: options.itemDelay || 0.1,
    markers: options.markers || false
  };

  // Crear timeline con ScrollTrigger
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start: config.start,
      markers: config.markers
    }
  });

  // Animar por filas o secuencialmente
  if (config.animateByRows) {
    // Agrupar items por filas
    const rows = groupByRows(items);

    // Animar cada fila de manera secuencial con dirección alternada
    rows.forEach((row, rowIndex) => {
      // Alternar dirección: filas pares desde la izquierda, impares desde la derecha
      const isEvenRow = rowIndex % 2 === 0;
      const xOffset = isEvenRow ? -30 : 30;
      
      // Calcular el tiempo de inicio para que las filas se animen una después de la otra
      const startTime = rowIndex * (config.duration + config.rowDelay);
      
      timeline.from(row, {
        x: xOffset,
        y: 30,
        opacity: 0,
        duration: config.duration,
        stagger: {
          each: config.itemDelay,
          from: isEvenRow ? 'start' : 'end' // Alternar dirección del stagger
        },
        ease: 'power2.out'
      }, startTime);
    });
  } else {
    // Animar todos los items secuencialmente sin agrupar
    timeline.from(items, {
      y: 50,
      opacity: 0,
      duration: config.duration,
      stagger: config.itemDelay,
      ease: 'power2.out'
    });
  }

  // Retornar el ScrollTrigger creado
  return timeline.scrollTrigger as ScrollTrigger;
}

/**
 * Anima todos los elementos de la sección Stack Tecnológico
 * 
 * Secuencia de animación:
 * 1. Texto superior (subtítulo) - blur desde abajo
 * 2. Título principal (h2) - maskTextRevealVertical
 * 3. Items del grid - aparición secuencial por filas
 * 
 * @param sectionSelector - Selector de la sección (default: '#stack')
 * @param options - Opciones de configuración
 * @returns Array de ScrollTriggers creados
 * 
 * @example
 * ```typescript
 * // Uso básico
 * animateStackSection();
 * 
 * // Con configuración personalizada
 * animateStackSection('#stack', {
 *   duration: 0.8,
 *   sequenceDelay: 0.3,
 *   markers: true
 * });
 * ```
 */
export function animateStackSection(
  sectionSelector: string = '#stack',
  options?: SectionAnimationOptions
): ScrollTrigger[] {
  // Detectar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return [];
  }

  // Configuración con valores por defecto
  const config = {
    start: options?.start || ANIMATION_DEFAULTS.stack.start,
    duration: options?.duration || ANIMATION_DEFAULTS.stack.duration,
    sequenceDelay: options?.sequenceDelay || ANIMATION_DEFAULTS.stack.sequenceDelay,
    markers: options?.markers || false
  };

  const triggers: ScrollTrigger[] = [];

  // Seleccionar la sección
  const section = document.querySelector(sectionSelector);
  if (!section) {
    console.warn(`animateStackSection: Section not found - ${sectionSelector}`);
    return triggers;
  }

  // 1. Animar el subtítulo con blur desde abajo
  const subtitle = section.querySelector(STACK_SELECTORS.subtitle);
  if (subtitle) {
    const subtitleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: subtitle,
        start: config.start,
        markers: config.markers
      }
    });

    subtitleTimeline.from(subtitle, {
      y: ANIMATION_DEFAULTS.stack.subtitle.y,
      opacity: 0,
      filter: `blur(${ANIMATION_DEFAULTS.stack.subtitle.blur}px)`,
      duration: config.duration,
      ease: ANIMATION_DEFAULTS.stack.subtitle.ease
    });

    if (subtitleTimeline.scrollTrigger) {
      triggers.push(subtitleTimeline.scrollTrigger as ScrollTrigger);
    }
  } else {
    console.warn(`animateStackSection: Subtitle not found - ${STACK_SELECTORS.subtitle}`);
  }

  // 2. Animar el título usando maskTextRevealVertical
  const title = section.querySelector(STACK_SELECTORS.title);
  if (title) {
    const titleAnimation = maskTextRevealVertical(title, {
      duration: config.duration,
      stagger: ANIMATION_DEFAULTS.stack.title.stagger,
      ease: ANIMATION_DEFAULTS.stack.title.ease,
      scrollTrigger: {
        trigger: title,
        start: config.start,
        markers: config.markers
      }
    });

    // maskTextRevealVertical con scrollTrigger retorna un Tween con scrollTrigger
    if ('scrollTrigger' in titleAnimation && titleAnimation.scrollTrigger) {
      triggers.push(titleAnimation.scrollTrigger as ScrollTrigger);
    }
  } else {
    console.warn(`animateStackSection: Title not found - ${STACK_SELECTORS.title}`);
  }

  // 3. Animar items del grid usando animateGridItems()
  const gridContainer = section.querySelector(STACK_SELECTORS.gridContainer);
  if (gridContainer) {
    const gridTrigger = animateGridItems(gridContainer, {
      itemsSelector: STACK_SELECTORS.items,
      start: config.start,
      duration: config.duration,
      animateByRows: true,
      rowDelay: ANIMATION_DEFAULTS.stack.items.rowDelay,
      itemDelay: ANIMATION_DEFAULTS.stack.items.itemDelay,
      markers: config.markers
    });

    if (gridTrigger) {
      triggers.push(gridTrigger);
    }
  } else {
    console.warn(`animateStackSection: Grid container not found - ${STACK_SELECTORS.gridContainer}`);
  }

  return triggers;
}

/**
 * Anima todos los elementos de la sección Contacto
 * 
 * Secuencia de animación:
 * 1. Título h2 - maskTextRevealVertical
 * 2. Párrafos de información - blur desde izquierda
 * 3. Logo Codezone - blur desde izquierda
 * 4. Botones de contacto - blur desde izquierda
 * 5. Formulario - blur desde derecha
 * 
 * @param sectionSelector - Selector de la sección (default: '#contact')
 * @param options - Opciones de configuración
 * @returns Array de ScrollTriggers creados
 * 
 * @example
 * ```typescript
 * // Uso básico
 * animateContactSection();
 * 
 * // Con configuración personalizada
 * animateContactSection('#contact', {
 *   duration: 0.7,
 *   sequenceDelay: 0.25
 * });
 * ```
 */
export function animateContactSection(
  sectionSelector: string = '#contact',
  options?: SectionAnimationOptions
): ScrollTrigger[] {
  // Detectar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return [];
  }

  // Configuración con valores por defecto
  const config = {
    start: options?.start || ANIMATION_DEFAULTS.contact.start,
    duration: options?.duration || ANIMATION_DEFAULTS.contact.duration,
    sequenceDelay: options?.sequenceDelay || ANIMATION_DEFAULTS.contact.sequenceDelay,
    markers: options?.markers || false
  };

  const triggers: ScrollTrigger[] = [];

  // Seleccionar la sección
  const section = document.querySelector(sectionSelector);
  if (!section) {
    console.warn(`animateContactSection: Section not found - ${sectionSelector}`);
    return triggers;
  }

  // 1. Animar el título usando maskTextRevealVertical
  const title = section.querySelector(CONTACT_SELECTORS.title);
  if (title) {
    const titleAnimation = maskTextRevealVertical(title, {
      duration: config.duration,
      stagger: ANIMATION_DEFAULTS.contact.title.stagger,
      ease: ANIMATION_DEFAULTS.contact.title.ease,
      scrollTrigger: {
        trigger: title,
        start: config.start,
        markers: config.markers
      }
    });

    // maskTextRevealVertical con scrollTrigger retorna un Tween con scrollTrigger
    if ('scrollTrigger' in titleAnimation && titleAnimation.scrollTrigger) {
      triggers.push(titleAnimation.scrollTrigger as ScrollTrigger);
    }
  } else {
    console.warn(`animateContactSection: Title not found - ${CONTACT_SELECTORS.title}`);
  }

  // 2. Animar párrafos con blurTextReveal('left') y stagger
  const paragraphs = section.querySelectorAll(CONTACT_SELECTORS.paragraphs);
  if (paragraphs && paragraphs.length > 0) {
    const paragraphsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: paragraphs[0],
        start: config.start,
        markers: config.markers
      }
    });

    paragraphsTimeline.from(paragraphs, {
      x: -ANIMATION_DEFAULTS.contact.blur.offset,
      opacity: 0,
      filter: `blur(${ANIMATION_DEFAULTS.contact.blur.blur}px)`,
      duration: config.duration,
      stagger: ANIMATION_DEFAULTS.contact.stagger.paragraphs,
      ease: ANIMATION_DEFAULTS.contact.blur.ease
    });

    if (paragraphsTimeline.scrollTrigger) {
      triggers.push(paragraphsTimeline.scrollTrigger as ScrollTrigger);
    }
  } else {
    console.warn(`animateContactSection: Paragraphs not found - ${CONTACT_SELECTORS.paragraphs}`);
  }

  // 3. Animar logo con blurTextReveal('left')
  const logo = section.querySelector(CONTACT_SELECTORS.logo);
  if (logo) {
    const logoTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: logo,
        start: config.start,
        markers: config.markers
      }
    });

    logoTimeline.from(logo, {
      x: -ANIMATION_DEFAULTS.contact.blur.offset,
      opacity: 0,
      filter: `blur(${ANIMATION_DEFAULTS.contact.blur.blur}px)`,
      duration: config.duration,
      ease: ANIMATION_DEFAULTS.contact.blur.ease
    });

    if (logoTimeline.scrollTrigger) {
      triggers.push(logoTimeline.scrollTrigger as ScrollTrigger);
    }
  } else {
    console.warn(`animateContactSection: Logo not found - ${CONTACT_SELECTORS.logo}`);
  }

  // 4. Animar botones con blurTextReveal('left') y stagger
  const buttons = section.querySelectorAll(CONTACT_SELECTORS.buttons);
  if (buttons && buttons.length > 0) {
    const buttonsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: buttons[0],
        start: config.start,
        markers: config.markers
      }
    });

    buttonsTimeline.from(buttons, {
      x: -ANIMATION_DEFAULTS.contact.blur.offset,
      opacity: 0,
      filter: `blur(${ANIMATION_DEFAULTS.contact.blur.blur}px)`,
      duration: config.duration,
      stagger: ANIMATION_DEFAULTS.contact.stagger.buttons,
      ease: ANIMATION_DEFAULTS.contact.blur.ease
    });

    if (buttonsTimeline.scrollTrigger) {
      triggers.push(buttonsTimeline.scrollTrigger as ScrollTrigger);
    }
  } else {
    console.warn(`animateContactSection: Buttons not found - ${CONTACT_SELECTORS.buttons}`);
  }

  // 5. Animar formulario con blurTextReveal('right')
  const form = section.querySelector(CONTACT_SELECTORS.form);
  if (form) {
    const formTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: form,
        start: config.start,
        markers: config.markers
      }
    });

    formTimeline.from(form, {
      x: ANIMATION_DEFAULTS.contact.blur.offset,
      opacity: 0,
      filter: `blur(${ANIMATION_DEFAULTS.contact.blur.blur}px)`,
      duration: config.duration,
      ease: ANIMATION_DEFAULTS.contact.blur.ease
    });

    if (formTimeline.scrollTrigger) {
      triggers.push(formTimeline.scrollTrigger as ScrollTrigger);
    }
  } else {
    console.warn(`animateContactSection: Form not found - ${CONTACT_SELECTORS.form}`);
  }

  return triggers;
}

/**
 * Limpia todas las animaciones de secciones
 * Destruye todos los ScrollTriggers creados por las funciones de animación de secciones
 * para prevenir memory leaks y conflictos cuando se desmonta el componente o se navega fuera
 * 
 * Esta función debe llamarse cuando:
 * - Se desmonta un componente que usa animaciones de sección
 * - Se navega a otra página
 * - Se necesita reinicializar las animaciones
 * 
 * @example
 * ```typescript
 * // Limpiar al desmontar componente
 * onCleanup(() => {
 *   cleanupSectionAnimations();
 * });
 * 
 * // Limpiar antes de reinicializar
 * cleanupSectionAnimations();
 * animateStackSection();
 * ```
 */
export function cleanupSectionAnimations(): void {
  // Obtener todos los ScrollTriggers activos
  const allTriggers = ScrollTrigger.getAll();
  
  // Destruir cada ScrollTrigger
  allTriggers.forEach(trigger => {
    trigger.kill();
  });
  
  // Log para debugging (solo en desarrollo)
  if (import.meta.env.DEV) {
    console.log(`cleanupSectionAnimations: Destroyed ${allTriggers.length} ScrollTriggers`);
  }
}
