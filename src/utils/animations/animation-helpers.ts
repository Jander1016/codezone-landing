import { gsap } from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Configuración centralizada de animaciones
 * Permite ajustar timings y easings globalmente
 */
export const ANIMATION_CONFIG = {
  durations: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.0,
    verySlow: 1.5
  },
  easings: {
    smooth: 'power2.out',
    bounce: 'back.out(1.7)',
    elastic: 'elastic.out(1, 0.5)',
    default: 'power3.out'
  },
  stagger: {
    fast: 0.1,
    normal: 0.2,
    slow: 0.3
  }
} as const;

/**
 * Anima un elemento desde una dirección específica con efecto blur
 * 
 * @param element - Selector CSS o elemento DOM
 * @param direction - Dirección desde donde aparece el elemento
 * @param options - Opciones adicionales de GSAP
 * @returns GSAP Tween
 * 
 * @example
 * ```typescript
 * // Animar desde la izquierda con blur
 * animateFromWithBlur('.hero-title', 'left', { duration: 0.8 });
 * 
 * // Animar desde arriba con configuración personalizada
 * animateFromWithBlur('.topnav', 'top', { 
 *   duration: 0.6, 
 *   ease: 'power3.out' 
 * });
 * ```
 */
export function animateFromWithBlur(
  element: string | Element,
  direction: 'left' | 'right' | 'top' | 'bottom',
  options?: gsap.TweenVars
): gsap.core.Tween {
  const directionMap = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    top: { x: 0, y: -50 },
    bottom: { x: 0, y: 50 }
  };

  const offset = directionMap[direction];

  return gsap.from(element, {
    ...offset,
    opacity: 0,
    filter: 'blur(10px)',
    duration: ANIMATION_CONFIG.durations.normal,
    ease: ANIMATION_CONFIG.easings.default,
    ...options
  });
}

/**
 * Anima un elemento con efecto de escala desde pequeño a tamaño normal
 * 
 * @param element - Selector CSS o elemento DOM
 * @param options - Opciones adicionales de GSAP
 * @returns GSAP Tween
 * 
 * @example
 * ```typescript
 * // Scale up básico
 * animateScaleUp('.logo');
 * 
 * // Scale up con bounce effect
 * animateScaleUp('.card', { 
 *   duration: 1, 
 *   ease: 'back.out(1.7)' 
 * });
 * ```
 */
export function animateScaleUp(
  element: string | Element,
  options?: gsap.TweenVars
): gsap.core.Tween {
  return gsap.from(element, {
    scale: 0.9,
    opacity: 0,
    duration: ANIMATION_CONFIG.durations.slow,
    ease: ANIMATION_CONFIG.easings.bounce,
    ...options
  });
}

/**
 * Anima un elemento con rotación y posicionamiento
 * 
 * @param element - Selector CSS o elemento DOM
 * @param rotation - Grados de rotación inicial
 * @param options - Opciones adicionales de GSAP
 * @returns GSAP Tween
 * 
 * @example
 * ```typescript
 * // Rotar desde -15 grados
 * animateRotateIn('.card', -15);
 * 
 * // Rotar con posicionamiento desde abajo
 * animateRotateIn('.service-card', -15, { 
 *   y: 100, 
 *   duration: 0.8 
 * });
 * ```
 */
export function animateRotateIn(
  element: string | Element,
  rotation: number,
  options?: gsap.TweenVars
): gsap.core.Tween {
  return gsap.from(element, {
    rotation,
    opacity: 0,
    duration: ANIMATION_CONFIG.durations.normal,
    ease: ANIMATION_CONFIG.easings.default,
    ...options
  });
}

/**
 * Limpia y destruye timelines y ScrollTriggers para prevenir memory leaks
 * 
 * @param timeline - Timeline de GSAP a destruir (puede ser null)
 * @param scrollTriggers - Array de ScrollTriggers a destruir (opcional)
 * 
 * @example
 * ```typescript
 * // Cleanup básico de timeline
 * const tl = gsap.timeline();
 * // ... animaciones
 * cleanupAnimation(tl);
 * 
 * // Cleanup con ScrollTriggers
 * const tl = gsap.timeline();
 * const st = ScrollTrigger.create({ ... });
 * cleanupAnimation(tl, [st]);
 * ```
 */
export function cleanupAnimation(
  timeline: gsap.core.Timeline | null,
  scrollTriggers?: ScrollTrigger[]
): void {
  // Destruir timeline si existe
  if (timeline) {
    timeline.kill();
  }

  // Destruir ScrollTriggers si existen
  if (scrollTriggers && scrollTriggers.length > 0) {
    scrollTriggers.forEach(st => {
      if (st) {
        st.kill();
      }
    });
  }
}
