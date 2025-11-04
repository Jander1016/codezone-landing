/**
 * Detecta si el usuario prefiere movimiento reducido
 * @returns true si el usuario tiene prefers-reduced-motion activado
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Ejecuta una animación o un fallback según la preferencia del usuario
 * 
 * @param animationFn - Función que ejecuta la animación
 * @param fallbackFn - Función alternativa si el usuario prefiere movimiento reducido
 * 
 * @example
 * ```typescript
 * conditionalAnimate(
 *   () => gsap.from('.element', { opacity: 0, y: 50 }),
 *   () => gsap.set('.element', { opacity: 1 })
 * );
 * ```
 */
export function conditionalAnimate(
  animationFn: () => void,
  fallbackFn?: () => void
): void {
  if (prefersReducedMotion()) {
    // Si el usuario prefiere movimiento reducido, ejecutar fallback o no hacer nada
    if (fallbackFn) {
      fallbackFn();
    }
  } else {
    // Ejecutar animación normal
    animationFn();
  }
}

/**
 * Escucha cambios dinámicos en la preferencia de movimiento reducido
 * 
 * @param callback - Función que se ejecuta cuando cambia la preferencia
 * @returns Función para remover el listener
 * 
 * @example
 * ```typescript
 * const removeListener = onReducedMotionChange((reducedMotion) => {
 *   console.log('Reduced motion:', reducedMotion);
 *   if (reducedMotion) {
 *     // Pausar animaciones
 *   } else {
 *     // Reanudar animaciones
 *   }
 * });
 * 
 * // Cleanup
 * removeListener();
 * ```
 */
export function onReducedMotionChange(
  callback: (reducedMotion: boolean) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handler = (event: MediaQueryListEvent) => {
    callback(event.matches);
  };

  // Usar addEventListener si está disponible, sino usar addListener (legacy)
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  } else {
    // @ts-ignore - Legacy API
    mediaQuery.addListener(handler);
    // @ts-ignore - Legacy API
    return () => mediaQuery.removeListener(handler);
  }
}
