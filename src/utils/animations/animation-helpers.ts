import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

// --- Helpers para refresh de secciones (reutilizable) ---
let __cz_sectionRefresh_initialized = false;
let __cz_sectionRefresh_resizeInstalled = false;
const __cz_specialSections = new Set<string>();

export interface SectionRefreshOptions {
  specialSectionIds?: string[]; // e.g. ['services-separator']
  specialDelay?: number; // ms delay for special sections (default 150)
  includeResize?: boolean; // instalar handler de resize (default true)
  resizeDebounce?: number; // ms debounce para resize (default 250)
}

/**
 * Registra listeners reutilizables para forzar refresh de ScrollTrigger
 * cuando se dispara el evento 'trigger-section-animations' y en resize.
 * Devuelve una función de cleanup para desregistrar los ids pasados.
 */
export function setupSectionAnimationRefresh(options?: SectionRefreshOptions) {
  const { specialSectionIds, specialDelay = 150, includeResize = true, resizeDebounce = 250 } = options ?? {};

  if (specialSectionIds && specialSectionIds.length > 0) {
    specialSectionIds.forEach(id => __cz_specialSections.add(id));
  }

  // Handler del evento custom
  function onTriggerSectionAnimations(event: Event) {
    const customEvent = event as CustomEvent;
    const sectionId = customEvent.detail?.sectionId;
    if (!sectionId) return;

    // Si hay secciones especiales registradas, sólo actuamos si coincide.
    if (__cz_specialSections.size > 0 && !__cz_specialSections.has(sectionId)) {
      return;
    }

    // Si es una sección "especial" (está registrada), aplicar delay y refrescar sólo sus triggers
    if (__cz_specialSections.has(sectionId)) {
      setTimeout(() => {
        // Refresh global para recalcular posiciones
        ScrollTrigger.refresh();

        // Forzar refresh de los triggers que pertenecen a la sección
        const triggers = ScrollTrigger.getAll();
        triggers.forEach((trigger) => {
          try {
            if (trigger.trigger && trigger.trigger.closest && trigger.trigger.closest(`#${sectionId}`)) {
              trigger.refresh();
            }
          } catch (err) {
            // Ignorar posibles problemas con elementos removidos
          }
        });
      }, specialDelay);

      return;
    }

    // Caso general: refrescar todo
    ScrollTrigger.refresh();
  }

  // Resize debounce handler
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, resizeDebounce);
  }

  // Instalar listeners sólo una vez
  if (!__cz_sectionRefresh_initialized) {
    document.addEventListener('trigger-section-animations', onTriggerSectionAnimations as EventListener);
    __cz_sectionRefresh_initialized = true;
  }

  if (includeResize && !__cz_sectionRefresh_resizeInstalled) {
    window.addEventListener('resize', onResize);
    __cz_sectionRefresh_resizeInstalled = true;
  }

  // Retornar cleanup parcial (elimina los specialSectionIds añadidos por esta llamada)
  return function cleanup() {
    if (specialSectionIds && specialSectionIds.length > 0) {
      specialSectionIds.forEach(id => __cz_specialSections.delete(id));
    }
    // Nota: no eliminamos los listeners globales por defecto para evitar romper otros módulos.
  };
}

/**
 * Anima un separador después de que terminen las animaciones/ScrollTriggers de una sección.
 *
 * Estrategia:
 * - Busca todos los ScrollTriggers cuya `trigger` esté dentro de `sectionSelector`.
 * - Selecciona el trigger cuyo elemento esté más abajo en la página (mayor offsetTop) —
 *   asumimos que corresponde a la "última" animación de la sección.
 * - Si ese trigger tiene una animación asociada (`trigger.animation`), se adjunta un
 *   callback `onComplete` para ejecutar la animación del separador.
 * - Si no se encuentra ningún trigger o animación, se hará un fallback y se animará
 *   el separador tras `timeout` ms.
 *
 * Esta función evita modificar timelines existentes y evita depender de tipos estrictos
 * de GSAP (usa casts a `any` donde es necesario).
 */
export function animateSeparatorAfterSection(
  sectionSelector: string,
  separatorSelector: string,
  opts?: { pollDelay?: number; timeout?: number; finalDelay?: number }
) {
  const { pollDelay = 150, timeout = 4000, finalDelay = 120 } = opts || {};

  let cleanedUp = false;
  const start = Date.now();

  const tryAttach = () => {
    if (cleanedUp) return true;

    const all = ScrollTrigger.getAll();
    // Filtrar triggers cuyo trigger element esté dentro de la sección
    const sectionTriggers = all.filter((t) => {
      try {
        return !!(t.trigger && typeof (t.trigger as Element).closest === 'function' && (t.trigger as Element).closest(sectionSelector));
      } catch (e) {
        return false;
      }
    });

    if (sectionTriggers.length === 0) {
      // Si timeout excedido, fallback: animar separador
      if (Date.now() - start > timeout) {
        animateSeparatorImmediate(separatorSelector, finalDelay);
        return true;
      }
      return false; // seguir intentando
    }

    // Seleccionar el trigger cuyo elemento tenga mayor offsetTop (más abajo en el documento)
    let chosen: any = null;
    let maxTop = -Infinity;
    sectionTriggers.forEach((t) => {
      try {
        const el = t.trigger as Element;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top > maxTop) {
          maxTop = top;
          chosen = t;
        }
      } catch (e) {
        // ignore
      }
    });

    if (!chosen) {
      // fallback
      animateSeparatorImmediate(separatorSelector, finalDelay);
      return true;
    }

    // Si tiene animación asociada, adjuntar onComplete
    const anim = (chosen as any).animation as gsap.core.Tween | gsap.core.Timeline | undefined;
    if (anim && typeof (anim as any).eventCallback === 'function') {
      // Adjuntamos onComplete; guardamos el callback para cleanup
      const cb = () => {
        animateSeparatorImmediate(separatorSelector, finalDelay);
      };
      (anim as any).eventCallback('onComplete', cb);

      // Retornar cleanup que remueve el callback
      return () => {
        cleanedUp = true;
        try {
          (anim as any).eventCallback('onComplete', null);
        } catch (e) {
          /* ignore */
        }
      };
    }

    // Si no hay animación, hacer fallback inmediato
    animateSeparatorImmediate(separatorSelector, finalDelay);
    return true;
  };

  // Helper para animar separador ahora
  function animateSeparatorImmediate(sel: string, delayMs: number) {
    const el = document.querySelector(sel) as Element | null;
    if (!el) return;
    setTimeout(() => {
      try {
        gsap.fromTo(el, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
      } catch (e) {
        // ignore
      }
    }, delayMs);
  }

  // Intentar una vez inmediatamente
  const maybeCleanup = tryAttach();
  if (maybeCleanup) {
    // Si tryAttach devolvió una función (cleanup) o true, manejamos
    if (typeof maybeCleanup === 'function') return maybeCleanup as () => void;
    return () => {
      cleanedUp = true;
    };
  }

  // Si no se pudo adjuntar todavía, poll hasta timeout
  const interval = window.setInterval(() => {
    const result = tryAttach();
    if (result) {
      clearInterval(interval);
      // si result es función, cleanup ya será retornado por tryAttach cuando se invoca inicialmente
    }
  }, pollDelay);

  // Retornar cleanup para cancelar el poll y marcar como limpiado
  return () => {
    cleanedUp = true;
    clearInterval(interval);
  };
}
