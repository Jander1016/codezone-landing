import { gsap } from 'gsap';
import { ANIMATION_CONFIG } from './animation-helpers';

/**
 * Opciones de configuración para animaciones de texto
 */
export interface MaskTextRevealOptions {
  /** Duración de la animación por palabra (default: 0.6) */
  duration?: number;
  /** Delay entre palabras (default: 0.1) */
  stagger?: number;
  /** Función de easing (default: 'power3.out') */
  ease?: string;
  /** Delay antes de iniciar la animación (default: 0) */
  delay?: number;
  /** Configuración opcional de ScrollTrigger (pasa el objeto de configuración si quieres que la timeline use ScrollTrigger) */
  scrollTrigger?: any;
  /** Callback al completar la animación */
  onComplete?: () => void;
}


export function maskTextReveal2(
  element: string | Element,
  options?: MaskTextRevealOptions
): gsap.core.Timeline {

  const el = typeof element === 'string'
    ? document.querySelector(element)
    : element;

  // Crear timeline vacío si el elemento no existe
  if (!el) {
    console.warn(`maskTextReveal: Element not found - ${element}`);
    return gsap.timeline();
  }

  // Obtener el texto y dividirlo en palabras
  const text = el.textContent || '';
  const words = text.trim();

  // Si no hay palabras, retornar timeline vacío
  if (words.length === 0) {
    console.warn(`maskTextReveal: No text content found in element`);
    return gsap.timeline();
  }

  // Reemplazar el contenido con spans para cada palabra
  // Usamos un wrapper con overflow hidden y padding para evitar cortar descendentes
  el.innerHTML = words
    .split(/\s+/)
    .map(word => `<span class="word-mask-wrapper"><span class="word-mask-inner">${word}&nbsp;</span></span>`)
    .join('');

  const wordElements = el.querySelectorAll('.word-mask-inner');

  gsap.set(wordElements, {
    yPercent: 100,
    autoAlpha: 0
  });

  // Crear y configurar la animación (devolvemos la timeline de inmediato y añadimos la animación dentro de requestAnimationFrame
  // para asegurarnos de que el DOM se haya reflowed y las posiciones sean correctas).
  const timeline = gsap.timeline({
    delay: options?.delay || 0,
    onComplete: options?.onComplete,
    // Permitir pasar configuración de ScrollTrigger desde options (opcional)
    ...(options?.scrollTrigger ? { scrollTrigger: options.scrollTrigger } : {})
  });

  // Calculamos posiciones tras un reflow para asegurar medidas correctas (especialmente si el DOM cambia recientemente).
  // Devolvemos la timeline inmediatamente; la animación se añadirá dentro de requestAnimationFrame.
  requestAnimationFrame(() => {
    const elemsArray = Array.from(wordElements) as Element[];
    const positions = elemsArray.map(elm => elm.getBoundingClientRect());
    const items = elemsArray.map((elm, i) => ({ elm, top: positions[i].top, left: positions[i].left, index: i }));

    items.sort((a, b) => {
      // Ordenar por top desc (bottom -> top). Si están muy cerca, ordenar por left asc (izquierda -> derecha).
      const topDiff = b.top - a.top;
      if (Math.abs(topDiff) > 1) return topDiff;
      // Si están prácticamente en la misma línea, mantener el orden L->R
      return a.left - b.left;
    });

    const sortedEls = items.map(i => i.elm);

    // Animar los spans internos desde el estado inicial (yPercent:100, autoAlpha:0) hacia visible
    timeline.to(sortedEls, {
      yPercent: 0,
      opacity: 1,
      autoAlpha: 1, // La palabra se hace visible
      duration: options?.duration || ANIMATION_CONFIG.durations.normal,
      stagger: options?.stagger || ANIMATION_CONFIG.stagger.fast,
      ease: options?.ease || ANIMATION_CONFIG.easings.default
    });
  });

  return timeline;
}

/**
 * Revela texto con efecto blur desde una dirección específica
 * 
 * @param element - Selector CSS o elemento DOM que contiene el texto
 * @param direction - Dirección desde donde aparece el texto
 * @param options - Opciones de configuración de la animación
 * @returns GSAP Tween
 * 
 * @example
 * ```typescript
 * // Blur reveal desde la izquierda
 * blurTextReveal('.subtitle', 'left');
 * 
 * // Blur reveal desde la derecha con duración personalizada
 * blurTextReveal('.description', 'right', {
 *   duration: 0.8,
 *   ease: 'power2.out'
 * });
 * ```
 */
export function blurTextReveal(
  element: string | Element,
  direction: 'left' | 'right',
  options?: MaskTextRevealOptions
): gsap.core.Tween {
  const el = typeof element === 'string'
    ? document.querySelector(element)
    : element;

  // Si el elemento no existe, retornar tween vacío
  if (!el) {
    console.warn(`blurTextReveal: Element not found - ${element}`);
    return gsap.to({}, {});
  }

  const xOffset = direction === 'left' ? -50 : 50;

  return gsap.from(el, {
    x: xOffset,
    opacity: 0,
    filter: 'blur(10px)',
    duration: options?.duration || ANIMATION_CONFIG.durations.normal,
    ease: options?.ease || ANIMATION_CONFIG.easings.default,
    delay: options?.delay || 0,
    onComplete: options?.onComplete
  });
}
