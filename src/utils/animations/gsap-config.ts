import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Inicializa GSAP con configuración global y registro de plugins
 * Debe ejecutarse una sola vez al cargar la aplicación
 */
export function initGSAP(): void {
  // Registrar plugin ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Configurar defaults globales de GSAP
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.6
  });

  // Configurar defaults de ScrollTrigger
  ScrollTrigger.defaults({
    toggleActions: 'play none none none',
    start: 'top 80%',
    markers: false
  });

  // Configurar refresh de ScrollTrigger en resize con debounce
  let resizeTimer: ReturnType<typeof setTimeout>;
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
}

/**
 * Limpia todos los ScrollTriggers y animaciones GSAP
 * Útil para cleanup global o navegación SPA
 */
export function cleanupGSAP(): void {
  // Matar todos los ScrollTriggers activos
  ScrollTrigger.getAll().forEach(st => st.kill());
  
  // Matar todas las animaciones activas
  gsap.killTweensOf('*');
  
}
