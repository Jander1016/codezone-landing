import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { maskTextRevealVertical } from './text-animations';

// Registrar plugin (seguro hacerlo una vez al cargar este módulo)
gsap.registerPlugin(ScrollTrigger);
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
  /** Callback opcional cuando TODOS los items han sido revelados */
  onComplete?: () => void;
}

/**
 * Selectores CSS para la sección Stack Tecnológico
 */
const STACK_SELECTORS = {
  section: '#stack',
  subtitle: '.stack-subtitle',
  title: '.stack-title',
  gridContainer: '.stack-grid',
  items: '.tech-stack-card',
  separator: '#contact-separator'
} as const;

/**
 * Configuración por defecto de animaciones para cada sección
 */
const ANIMATION_DEFAULTS = {
  stack: {
    start: 'top 90%',
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
      stagger: 0.12,
      duration: 0.7,
      y: 0,
      ease: 'back.out(1.7)'
    }
  }
} as const;


export function animateGridItems(
  container: string | Element,
  options: GridItemsAnimationOptions
): ScrollTrigger | null {
  // Obtener el elemento contenedor
  const containerEl = typeof container === 'string'
    ? document.querySelector(container)
    : container;

  // Validar contenedor
  if (!containerEl) {
    console.warn(`animateGridItems: Container not found - ${container}`);
    return null;
  }

  // Seleccionar items
  const items = Array.from(containerEl.querySelectorAll(options.itemsSelector));
  if (!items.length) {
    console.warn(`animateGridItems: No items found with selector - ${options.itemsSelector}`);
    return null;
  }

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Mostrar elementos directamente sin animación
    items.forEach(item => {
      gsap.set(item, { opacity: 1 });
    });
    return null;
  }
  // Estado inicial: ocultar y escalar hacia abajo
  gsap.set(items, { opacity: 0, scale: 0.8 });

  // Usar valores pasados o defaults mínimos
  const duration = options.duration ?? 0.6;
  const itemDelay = options.itemDelay ?? 0.15;
  const start = options.start ?? 'top 90%';
  const markers = options.markers ?? false;

  const revealed = new Set<Element>();
  let allRevealedCalled = false;

  const animateBatch = (batch: Element[]) => {
    batch.forEach(b => revealed.add(b));
    const tween = gsap.to(batch, {
      opacity: 1,
      scale: 1,
      duration: duration,
      ease: 'back.out(1.7)',
      stagger: { each: itemDelay }
    });

    tween.eventCallback('onComplete', () => {
      if (!allRevealedCalled && revealed.size === items.length) {
        allRevealedCalled = true;
        options.onComplete?.();
      }
    });
  };

  ScrollTrigger.batch(items, {
    interval: 0.1,
    start: start,
    onEnter: animateBatch,
    onEnterBack: animateBatch
  });

  const containerTrigger = ScrollTrigger.create({
    trigger: containerEl,
    start: start,
    markers: markers
  });

  return containerTrigger as ScrollTrigger;
}

export function animateStackSection(
  sectionSelector: string = '#stack',
  options?: SectionAnimationOptions
): ScrollTrigger[] {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return [];

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
 
  const getStartPosition = () => {
    if (options?.start) return options.start;
    return 'top 80%';
  };

  const config = {
    start: getStartPosition(),
    duration: options?.duration || (isMobile ? 0.5 : ANIMATION_DEFAULTS.stack.duration),
    sequenceDelay: options?.sequenceDelay || ANIMATION_DEFAULTS.stack.sequenceDelay,
    markers: options?.markers || false
  };

  const triggers: ScrollTrigger[] = [];

  const section = document.querySelector(sectionSelector);
  if (!section) {
    console.warn(`animateStackSection: Section not found - ${sectionSelector}`);
    return triggers;
  }

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

    if ('scrollTrigger' in titleAnimation && titleAnimation.scrollTrigger) {
      triggers.push(titleAnimation.scrollTrigger as ScrollTrigger);
    }
  } else {
    console.warn(`animateStackSection: Title not found - ${STACK_SELECTORS.title}`);
  }

  const gridContainer = section.querySelector(STACK_SELECTORS.gridContainer);
  if (gridContainer) {
    const gridTrigger = animateGridItems(gridContainer, {
      itemsSelector: STACK_SELECTORS.items,
      duration: isMobile ? 0.6 : 0.8,
      rowDelay: isMobile ? 0.4 : isTablet ? 0.5 : 0.6,
      itemDelay: isMobile ? 0.15 : 0.2,
      start: config.start,
      // markers: true
    });

    if (gridTrigger) {
      triggers.push(gridTrigger);
    }
  } else {
    console.warn(`animateStackSection: Grid container not found - ${STACK_SELECTORS.gridContainer}`);
  }

  const separator = document.querySelector(STACK_SELECTORS.separator);
  if (separator) {
    gsap.from(separator, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: separator,
        start: config.start,
      },
    });
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
  const allTriggers = ScrollTrigger.getAll();

  allTriggers.forEach(trigger => {
    trigger.kill();
  });

  if (import.meta.env.DEV) {
    console.log(`cleanupSectionAnimations: Destroyed ${allTriggers.length} ScrollTriggers`);
  }
}
