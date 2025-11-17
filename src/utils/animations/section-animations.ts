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

  // Estado inicial: ocultar items (no se cambia display para no alterar comportamiento de foco)
  gsap.set(items, { opacity: 0, scale: 0.8 });

  // Usar valores pasados o defaults mínimos
  const duration = options.duration ?? 0.6;
  const itemDelay = options.itemDelay ?? 0.15;
  const start = options.start ?? 'top 90%';
  const markers = options.markers ?? false;

  // Usar ScrollTrigger.batch para revelar elementos cuando entran al viewport
  // Esto evita que todos se muestren a la vez y permite animarlos en pequeños grupos
  // Llevar registro de qué elementos ya fueron revelados para poder
  // disparar un callback cuando TODOS estén visibles
  const revealed = new Set<Element>();
  let allRevealedCalled = false;

  ScrollTrigger.batch(items, {
    interval: 0.1,
    start: start,
    onEnter: (batch) => {
      batch.forEach(b => revealed.add(b));
      // Animar el batch que acaba de entrar
      const tween = gsap.to(batch, {
        opacity: 1,
        scale: 1,
        duration: duration,
        ease: 'back.out(1.7)',
        stagger: { each: itemDelay }
      });
      // Cuando termine la animación, comprobar si todos los items fueron revelados
      tween.eventCallback('onComplete', () => {
        if (!allRevealedCalled && revealed.size === items.length) {
          allRevealedCalled = true;
          options.onComplete?.();
        }
      });
    },
    onEnterBack: (batch) => {
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
    }
  });

  // Devuelto: crear un ScrollTrigger auxiliar sobre el contenedor para permitir limpieza/seguimiento
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
  // Detectar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return [];

  // Detectar tamaño de pantalla
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024 && window.innerWidth < 1920;
  const isLargeScreen = window.innerWidth >= 1920;

  // Configuración responsive con ajuste para pantallas grandes
  const getStartPosition = () => {
    if (options?.start) return options.start;
    if (isMobile) return 'top bottom+=350'; // Mobile: se activa cuando está casi visible
    if (isTablet) return 'top bottom+=150';
    if (isDesktop) return 'top bottom+=900';
    if (isLargeScreen) return 'top bottom+=300'; // Pantallas grandes: se activa antes
    return 'top bottom+=200';
  };

  const config = {
    start: getStartPosition(),
    duration: options?.duration || (isMobile ? 0.5 : ANIMATION_DEFAULTS.stack.duration),
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

  // 3. Animar items del grid usando animateGridItems (lightbulb effect)
  const gridContainer = section.querySelector(STACK_SELECTORS.gridContainer);
  if (gridContainer) {
    const gridTrigger = animateGridItems(gridContainer, {
      itemsSelector: STACK_SELECTORS.items,
      duration: isMobile ? 0.6 : 0.8,
      rowDelay: isMobile ? 0.4 : isTablet ? 0.5 : 0.6,
      itemDelay: isMobile ? 0.15 : 0.2,
      start: config.start,
      markers: config.markers,
      onComplete: () => {
        // Cuando todos los items han sido revelados, animar el separador secuencialmente
        const sep = section.querySelector(STACK_SELECTORS.separator);
        if (sep) {
          gsap.from(sep, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
          });
        }
      }
    });

    if (gridTrigger) {
      triggers.push(gridTrigger);
    }
  } else {
    console.warn(`animateStackSection: Grid container not found - ${STACK_SELECTORS.gridContainer}`);
  }

  // Nota: la animación del separador se dispara secuencialmente desde el callback
  // `onComplete` que se pasa a `animateGridItems`. No se crea un ScrollTrigger
  // independiente para el separador aquí para evitar duplicados.

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
