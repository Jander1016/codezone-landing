import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Opciones de configuración para ScrollTrigger
 */
export interface ScrollAnimationOptions {
	/** Elemento que activa la animación */
	trigger: string | Element;
	/** Punto de inicio de la animación (default: 'top 80%') */
	start?: string;
	/** Punto de fin de la animación (default: 'bottom 20%') */
	end?: string;
	/** Sincronizar animación con scroll (default: false) */
	scrub?: boolean | number;
	/** Mostrar markers de debug (default: false) */
	markers?: boolean;
	/** Callback al entrar en viewport */
	onEnter?: () => void;
	/** Callback al salir del viewport */
	onLeave?: () => void;
	/** Acciones de toggle (default: 'play none none none') */
	toggleActions?: string;
}

/**
 * Crea un ScrollTrigger con configuración optimizada
 *
 * @param animation - Timeline o Tween de GSAP a vincular con el scroll
 * @param options - Opciones de configuración del ScrollTrigger
 * @returns ScrollTrigger instance
 *
 * @example
 * ```typescript
 * // ScrollTrigger básico
 * const tl = gsap.timeline();
 * tl.from('.element', { opacity: 0 });
 * createScrollAnimation(tl, { trigger: '#section' });
 *
 * // ScrollTrigger con configuración personalizada
 * const tl = gsap.timeline();
 * tl.from('.cards', { y: 50, stagger: 0.2 });
 * createScrollAnimation(tl, {
 *   trigger: '#services',
 *   start: 'top 70%',
 *   markers: true,
 *   onEnter: () => console.log('Section entered')
 * });
 * ```
 */
export function createScrollAnimation(
	animation: gsap.core.Timeline | gsap.core.Tween,
	options: ScrollAnimationOptions,
): ScrollTrigger {
	return ScrollTrigger.create({
		trigger: options.trigger,
		start: options.start || 'top 80%',
		end: options.end || 'bottom 20%',
		scrub: options.scrub || false,
		markers: options.markers || false,
		toggleActions: options.toggleActions || 'play none none none',
		animation: animation,
		onEnter: options.onEnter,
		onLeave: options.onLeave,
	});
}

/**
 * Crea animaciones batch para múltiples elementos
 * Optimizado para animar muchos elementos similares
 *
 * @param elements - Selector CSS de los elementos a animar
 * @param animationFn - Función que retorna la animación para cada elemento
 * @param options - Opciones de configuración del ScrollTrigger
 *
 * @example
 * ```typescript
 * // Animar múltiples cards
 * batchScrollAnimation(
 *   '.card',
 *   (element) => gsap.from(element, { y: 50, opacity: 0, duration: 0.6 }),
 *   { start: 'top 80%' }
 * );
 *
 * // Animar items con stagger automático
 * batchScrollAnimation(
 *   '.tech-item',
 *   (element) => gsap.from(element, { scale: 0.8, opacity: 0 })
 * );
 * ```
 */
export function batchScrollAnimation(
	elements: string,
	animationFn: (element: Element) => gsap.core.Tween,
	options?: Partial<ScrollAnimationOptions>,
): void {
	ScrollTrigger.batch(elements, {
		onEnter: (batch) => batch.forEach(animationFn),
		start: options?.start || 'top 80%',
		end: options?.end,
	});
}

/**
 * Crea un ScrollTrigger con manejo de errores
 * Útil para prevenir fallos en producción
 *
 * @param config - Configuración del ScrollTrigger
 * @returns ScrollTrigger instance o null si falla
 *
 * @example
 * ```typescript
 * // ScrollTrigger seguro
 * const st = createSafeScrollTrigger({
 *   trigger: '#section',
 *   start: 'top 80%',
 *   animation: myTimeline
 * });
 *
 * if (st) {
 *   console.log('ScrollTrigger created successfully');
 * }
 * ```
 */
export function createSafeScrollTrigger(
	config: ScrollTrigger.Vars,
): ScrollTrigger | null {
	try {
		return ScrollTrigger.create(config);
	} catch (error) {
		console.error('ScrollTrigger error:', error);
		return null;
	}
}

/**
 * Agrupa elementos por filas basándose en su posición Y
 * Útil para animar grids fila por fila
 *
 * @param elements - Array de elementos DOM o selector CSS
 * @param tolerance - Tolerancia en píxeles para considerar misma fila (default: 10)
 * @returns Array de arrays, cada uno conteniendo elementos de una fila
 *
 * @example
 * ```typescript
 * // Agrupar elementos de un grid
 * const items = document.querySelectorAll('.grid-item');
 * const rows = groupByRows(items);
 *
 * // Animar cada fila con delay
 * rows.forEach((row, index) => {
 *   gsap.from(row, {
 *     y: 50,
 *     opacity: 0,
 *     stagger: 0.1,
 *     delay: index * 0.2
 *   });
 * });
 *
 * // Usar con selector CSS
 * const rows = groupByRows('.tech-stack-item');
 * ```
 */
export function groupByRows(
	elements: Element[] | NodeListOf<Element> | string,
	tolerance: number = 10,
): Element[][] {
	// Convertir a array si es necesario
	let elementsArray: Element[];

	if (typeof elements === 'string') {
		elementsArray = Array.from(document.querySelectorAll(elements));
	} else if (elements instanceof NodeList) {
		elementsArray = Array.from(elements);
	} else {
		elementsArray = elements;
	}

	// Si no hay elementos, retornar array vacío
	if (elementsArray.length === 0) {
		return [];
	}

	// Ordenar elementos por posición Y
	const sortedElements = elementsArray.slice().sort((a, b) => {
		const rectA = a.getBoundingClientRect();
		const rectB = b.getBoundingClientRect();
		return rectA.top - rectB.top;
	});

	// Agrupar por filas
	const rows: Element[][] = [];
	let currentRow: Element[] = [];
	let lastY = -1;

	sortedElements.forEach((el) => {
		const rect = el.getBoundingClientRect();
		const currentY = rect.top;

		// Si es el primer elemento o está en la misma fila (dentro de la tolerancia)
		if (lastY === -1 || Math.abs(currentY - lastY) < tolerance) {
			currentRow.push(el);
		} else {
			// Nueva fila
			if (currentRow.length > 0) {
				rows.push(currentRow);
			}
			currentRow = [el];
		}

		lastY = currentY;
	});

	// Agregar la última fila
	if (currentRow.length > 0) {
		rows.push(currentRow);
	}

	return rows;
}
