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
/**
 * Revela texto palabra por palabra usando clip-path
 * Divide el texto en spans individuales y anima cada uno con efecto de máscara
 * 
 * @param element - Selector CSS o elemento DOM que contiene el texto
 * @param options - Opciones de configuración de la animación
 * @returns GSAP Timeline
 * 
 * @example
 * ```typescript
 * // Reveal básico
 * maskTextReveal('.hero-title');
 * 
 * // Reveal con configuración personalizada
 * maskTextReveal('.claim', {
 *   duration: 0.8,
 *   stagger: 0.15,
 *   ease: 'power2.out',
 *   onComplete: () => console.log('Animation complete')
 * });
 * ```
 */
export function maskTextReveal(
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
  const words = text.trim().split(/\s+/);

  // Si no hay palabras, retornar timeline vacío
  if (words.length === 0) {
    console.warn(`maskTextReveal: No text content found in element`);
    return gsap.timeline();
  }

  // Reemplazar el contenido con spans para cada palabra
  // Usamos un wrapper con overflow hidden y padding para evitar cortar descendentes
  el.innerHTML = words
    .map(word => `<span class="word-mask-wrapper" style="display: inline-block; overflow: hidden;"><span class="word-mask-inner" style="display: inline-block; padding-bottom: 0.15em;">${word}</span></span>`)
    .join(' ');


  // Crear y configurar la animación
  const timeline = gsap.timeline({
    delay: options?.delay || 0,
    onComplete: options?.onComplete
  });

  // Animar los spans internos con clip-path horizontal
  timeline.from(el.querySelectorAll('.word-mask-inner'), {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0,
    autoAlpha: 1,     // La palabra se hace visible
    duration: options?.duration || ANIMATION_CONFIG.durations.normal,
    stagger: options?.stagger || ANIMATION_CONFIG.stagger.fast,
    ease: options?.ease || ANIMATION_CONFIG.easings.default
  });

  return timeline;
}

export function maskTextRevealVertical(
  element: string | Element,
  options?: MaskTextRevealOptions
): gsap.core.Timeline | gsap.core.Tween {

  const el = typeof element === 'string'
    ? document.querySelector(element)
    : element;

  // Crear timeline vacío si el elemento no existe
  if (!el) {
    console.warn(`maskTextReveal2: Element not found - ${element}`);
    return gsap.timeline();
  }

  // Obtener el texto y dividirlo en palabras
  const text = el.textContent || '';
  const words = text.trim().split(/\s+/);

  // Si no hay palabras, retornar timeline vacío
  if (words.length === 0) {
    console.warn(`maskTextReveal2: No text content found in element`);
    return gsap.timeline();
  }

  // Obtener el estilo del elemento (background para gradientes o color para texto normal)
  const computedStyle = window.getComputedStyle(el);
  const background = computedStyle.background || computedStyle.backgroundImage;
  const color = computedStyle.color;
  const hasGradient = background.includes('gradient');

  // Crear spans con overflow hidden
  // Si tiene gradiente, aplicarlo con background-clip: text
  // Si no, usar el color normal del texto
  el.innerHTML = words
    .map(word => {
      if (hasGradient) {
        return `<span style="display: inline-block; overflow: hidden;">
          <span style="display: inline-block; background: ${background}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${word}</span>
        </span>`;
      } else {
        return `<span style="display: inline-block; overflow: hidden;">
          <span style="display: inline-block; color: ${color};">${word}</span>
        </span>`;
      }
    })
    .join(' ');

  const innerSpans = el.querySelectorAll('span > span');

  // Si se proporciona scrollTrigger, usar gsap.from directamente
  if (options?.scrollTrigger) {
    return gsap.from(innerSpans, {
      y: 100,
      duration: options?.duration || ANIMATION_CONFIG.durations.normal,
      stagger: options?.stagger || ANIMATION_CONFIG.stagger.fast,
      ease: options?.ease || ANIMATION_CONFIG.easings.default,
      scrollTrigger: options.scrollTrigger,
      delay: options?.delay || 0,
      onComplete: options?.onComplete
    });
  }

  // Si no hay scrollTrigger, crear timeline normal
  const timeline = gsap.timeline({
    delay: options?.delay || 0,
    onComplete: options?.onComplete
  });

  timeline.from(innerSpans, {
    y: 100,
    duration: options?.duration || ANIMATION_CONFIG.durations.normal,
    stagger: options?.stagger || ANIMATION_CONFIG.stagger.fast,
    ease: options?.ease || ANIMATION_CONFIG.easings.default
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


export function maskTextRevealMix(
  element: string | Element,
  options?: MaskTextRevealOptions
): gsap.core.Timeline | gsap.core.Tween {

  const el = typeof element === 'string'
    ? document.querySelector(element)
    : element;

  // Crear timeline vacío si el elemento no existe
  if (!el) {
    console.warn(`maskTextRevealMix: Element not found - ${element}`);
    return gsap.timeline();
  }

  // Obtener el texto y dividirlo en palabras
  const text = el.textContent || '';
  const words = text.trim().split(/\s+/);

  // Si no hay palabras, retornar timeline vacío
  if (words.length === 0) {
    console.warn(`maskTextReveal2: No text content found in element`);
    return gsap.timeline();
  }

  const computedStyle = window.getComputedStyle(el);
  const background = computedStyle.background || computedStyle.backgroundImage;
  const color = computedStyle.color;
  const hasGradient = background.includes('gradient');

  el.innerHTML = words
    .map(word => {
      if (hasGradient) {
        return `<span style="display: inline-block; overflow: hidden;">
          <span style="display: inline-block; background: ${background}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${word}</span>
        </span>`;
      } else {
        return `<span style="display: inline-block; overflow: hidden;">
          <span style="display: inline-block; color: ${color};">${word}</span>
        </span>`;
      }
    })
    .join(' ');

  const innerSpans = el.querySelectorAll('span > span');

  // Si se proporciona scrollTrigger, usar gsap.from directamente
  if (options?.scrollTrigger) {
    return gsap.from(innerSpans, {
      clipPath: 'inset(0 100% 0 0)',
      opacity: 0,
      autoAlpha: 1,     // La palabra se hace visible
      duration: options?.duration || ANIMATION_CONFIG.durations.normal,
      ease: options?.ease || ANIMATION_CONFIG.easings.default,
      scrollTrigger: options.scrollTrigger,
      delay: options?.delay || 0,
      onComplete: options?.onComplete
    });
  }

  // Si no hay scrollTrigger, crear timeline normal
  const timeline = gsap.timeline({
    delay: options?.delay || 0,
    onComplete: options?.onComplete
  });

  timeline.from(innerSpans, {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0,
    autoAlpha: 1,     // La palabra se hace visible
    duration: options?.duration || ANIMATION_CONFIG.durations.normal,
    stagger: options?.stagger || ANIMATION_CONFIG.stagger.fast,
    ease: options?.ease || ANIMATION_CONFIG.easings.default
  });

  return timeline;
}