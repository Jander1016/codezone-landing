
  /**
   * ObserverManager
   * 
   * Gestiona el IntersectionObserver para actualizar el estado activo de los links de navegación.
   * Coordina la detección de secciones visibles y actualiza el estado aria-current de los links.
   * Puede pausarse temporalmente durante scrolls programáticos para evitar conflictos.
   * 
   * @namespace ObserverManager
   */
//   const ObserverManager = {
//     observer: null as IntersectionObserver | null,
//     linkMap: new Map<string, HTMLElement[]>(),
//     links: [] as HTMLElement[],
//     isPaused: false,

//     /**
//      * Inicializa el IntersectionObserver y construye el linkMap.
//      * Crea un mapa de hrefs a elementos de link y configura el observer
//      * para detectar qué sección está visible en el viewport.
//      * 
//      * @param {HTMLElement[]} linkElements - Array de elementos de link a observar
//      * @returns {void}
//      */
//     initialize(linkElements: HTMLElement[]): void {
//       this.links = linkElements;
//       this.linkMap.clear();

//       // Construir linkMap: href -> array de elementos
//       linkElements.forEach((link) => {
//         const href = link.getAttribute("href");
//         if (!href) return;
        
//         if (!this.linkMap.has(href)) {
//           this.linkMap.set(href, []);
//         }
//         this.linkMap.get(href)!.push(link);
//       });

//       // Configurar IntersectionObserver con opciones globales
//       const observerOptions = window.SCROLL_CONFIG.OBSERVER;
      
//       this.observer = new IntersectionObserver((entries) => {
//         entries.forEach((entry) => {
//           // Ignorar cambios si está pausado o durante scroll programático
//           if (this.isPaused || window.isProgrammaticScroll) return;
          
//           if (entry.isIntersecting) {
//             const id = entry.target.id;
//             if (!id) return;
            
//             // No marcar la sección de contacto como activa
//             if (id === "contact-separator" || id === "contact") return;
            
//             const href = `#${id}`;
//             this.setActiveLink(href);
//           }
//         });
//       }, observerOptions);

//       // Observar todos los elementos target
//       this.linkMap.forEach((_v, href) => {
//         if (!href || !href.startsWith("#")) return;
//         const id = href.slice(1);
//         const target = document.getElementById(id);
//         if (target && this.observer) {
//           this.observer.observe(target);
//         }
//       });
//     },

//     /**
//      * Pausa el observer por una duración específica.
//      * Durante la pausa, el observer ignora cambios de intersección.
//      * Se reactiva automáticamente después del tiempo especificado.
//      * 
//      * @param {number} [duration=SCROLL_CONFIG.OBSERVER_PAUSE_DURATION] - Duración de la pausa en milisegundos
//      * @returns {void}
//      */
//     pause(duration: number = window.SCROLL_CONFIG.OBSERVER_PAUSE_DURATION): void {
//       this.isPaused = true;
      
//       setTimeout(() => {
//         this.isPaused = false;
//       }, duration);
//     },

//     /**
//      * Resume el observer inmediatamente.
//      * Cancela cualquier pausa en progreso y reactiva la detección de intersecciones.
//      * 
//      * @returns {void}
//      */
//     resume(): void {
//       this.isPaused = false;
//     },

//     /**
//      * Verifica si el observer está activo.
//      * Un observer está activo cuando no está pausado.
//      * 
//      * @returns {boolean} true si el observer está activo, false si está pausado
//      */
//     isActive(): boolean {
//       return !this.isPaused;
//     },

//     /**
//      * Establece el link activo basado en href.
//      * Remueve aria-current de todos los links y lo establece en los links
//      * que coinciden con el href especificado.
//      * 
//      * @param {string | null} href - Href del link a activar (ej: "#services"), o null para limpiar todos
//      * @returns {void}
//      */
//     setActiveLink(href: string | null): void {
//       // Remover aria-current de todos los links
//       this.links.forEach((link) => {
//         link.removeAttribute("aria-current");
//       });

//       // Si no hay href, solo limpiar
//       if (!href) return;

//       // Establecer aria-current en los links correspondientes
//       const matchingLinks = this.linkMap.get(href) || [];
//       matchingLinks.forEach((link) => {
//         link.setAttribute("aria-current", "page");
//       });
//     }
//   };


  /**
   * Función unificada para manejar clicks de navegación.
   * Coordina el scroll programático, pausa el observer, actualiza el estado activo,
   * dispara animaciones de sección y limpia el hash de la URL.
   * 
   * @param {Event} e - Evento de click del navegador
   * @param {string} href - Href del link clickeado (debe ser un hash, ej: "#services")
   * @returns {Promise<void>}
   */
  async function handleNavigationClick(e: Event, href: string): Promise<void> {
    // Validar que sea un hash
    if (!href || !href.startsWith("#")) return;

    // Prevenir comportamiento default
    e.preventDefault();

    // Extraer ID y obtener elemento target
    const id = href.slice(1);
    const target = document.getElementById(id);
    
    if (!target) {
      console.warn('Navigation: target not found', id);
      return;
    }

    // Actualizar estado activo
    const activeHref = (href === "#contact-separator") ? null : href;

    // Disparar evento para animaciones de sección
    const event = new CustomEvent('trigger-section-animations', {
      detail: { sectionId: id }
    });
    document.dispatchEvent(event);

    // Remover hash de la URL
    removeHashFromUrl();
  }

  /**
   * Remueve el hash de la URL sin recargar la página.
   * Usa history.replaceState para limpiar el hash manteniendo el resto de la URL.
   * 
   * @returns {void}
   */
  function removeHashFromUrl(): void {
    if (window.location.hash) {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (err) {
        /* ignore */
      }
    }
  }

  export function initNavActiveLinks() {
    try {
      const links = Array.from(
        document.querySelectorAll('a[href^="#"].nav-link, #mobilemenu-items a'),
      ) as HTMLElement[];

      if (!links.length) return;

      // Aplicar handleNavigationClick a todos los links
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        link.addEventListener("click", (e) => {
          handleNavigationClick(e, href);
        });
      });


      // Escuchar evento personalizado para sincronización
      window.addEventListener('codezone:setActiveNavHref', (ev) => {
        // @ts-ignore: event detail typing
        ObserverManager.setActiveLink(ev.detail);
      });

      // Aplicar handleNavigationClick al logo/brand
      const brandAnchor = document.querySelector('a.brand[href="#hero"]');
      if (brandAnchor) {
        brandAnchor.addEventListener('click', (e) => {
          handleNavigationClick(e, "#hero");
        });
      }

      // Handler para botones CTA de contacto
      document.addEventListener("click", (e) => {
        const maybeElement = e.target;
        const anchor =
          maybeElement instanceof Element
            ? maybeElement.closest('a[href="#contact-separator"]')
            : null;
        if (anchor) {
          handleNavigationClick(e, "#contact-separator");
        }
      });

      window.addEventListener('hashchange', () => {
        const h = window.location.hash || '';
        if (!h) return;
        const id = h.slice(1);
        if (!id) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
          return;
        }
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        history.replaceState(null, '', window.location.pathname + window.location.search);
      });

      window.addEventListener('popstate', () => removeHashFromUrl());
    } catch (err) {
      /* ignore errors in nav initialization */
    }
  }