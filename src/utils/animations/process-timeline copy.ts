import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { createScrollAnimation } from './scroll-animations';
import { maskTextRevealVertical } from './text-animations';

/**
 * Configuration options for process timeline animation
 */
export interface ProcessTimelineOptions {
	/** Container selector or element (default: '.process-steps') */
	container?: string | Element;
	/** Card selector (default: '.process-card') */
	cardSelector?: string;
	/** Animation duration in seconds (default: 0.8) */
	duration?: number;
	/** Distance for slide animation in pixels (default: 50) */
	distance?: number;
	/** ScrollTrigger start position (default: 'top 90%') */
	triggerStart?: string;
	/** Enable debug markers (default: false) */
	markers?: boolean;
}

/**
 * Default configuration options for process timeline animations
 */
const DEFAULT_OPTIONS: Required<ProcessTimelineOptions> = {
	container: '.process-steps',
	cardSelector: '.process-card',
	duration: 0.6,
	distance: 50,
	triggerStart: 'top 80%',
	markers: true,
};

/**
 * Resolves an element from a string selector or Element
 * 
 * @param elementOrSelector - CSS selector string or Element
 * @returns Element or null if not found
 */
function resolveElement(elementOrSelector: string | Element): Element | null {
	if (typeof elementOrSelector === 'string') {
		return document.querySelector(elementOrSelector);
	}
	return elementOrSelector;
}

/**
 * Initializes scroll-triggered zigzag timeline animations for process cards
 * 
 * @param options - Configuration options for the animation
 * @returns Array of created ScrollTrigger instances
 * 
 * @example
 * ```typescript
 * // Basic usage
 * initProcessTimeline();
 * 
 * // With custom options
 * initProcessTimeline({
 *   duration: 1.0,
 *   distance: 80,
 *   markers: true
 * });
 * ```
 */
export function initProcessTimeline(
	options?: ProcessTimelineOptions,
): ScrollTrigger[] {
	const processSection = document.querySelector("#process");
	const separator = document.querySelector('.stack-separator');
	const adjustedStart = window.innerWidth <= 768 ? "top 90%" : "top bottom+=400px";

	// Check for prefers-reduced-motion
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion) {
		console.log('[ProcessTimeline] Animations disabled due to prefers-reduced-motion');
		return [];
	}

	// Merge with defaults
	const config = { ...DEFAULT_OPTIONS, ...options };

	// Query container element
	const container = resolveElement(config.container);
	if (!container) {
		console.warn('[ProcessTimeline] Container not found:', config.container);
		return [];
	}


	if (!processSection) return [];

	// Animar el subtítulo (Design Thinking + Scrum)
	const subtitle = processSection.querySelector(".process-subtitle");
	if (subtitle) {
		gsap.from(subtitle, {
			y: 60,
			opacity: 0,
			filter: "blur(10px)",
			duration: 0.8,
			ease: "power2.out",
			scrollTrigger: {
				trigger: subtitle,
				start: "top 80%",
				toggleActions: "play none none none",
			},
		});
	}

	// Animar el título principal (¿Cómo lo hacemos?)
	const title = processSection.querySelector(".process-title");
	if (title) {
		console.log('Process title found:', title);
		console.log('Process title background:', window.getComputedStyle(title).background);
		maskTextRevealVertical(title, {
			duration: 0.6,
			stagger: 0.1,
			ease: "power3.out",
			scrollTrigger: {
				trigger: title,
				start: "top 70%",
				toggleActions: "play none none none",
			},
		});
	}

	// Query all process cards
	const cards = container.querySelectorAll(config.cardSelector);
	if (cards.length === 0) {
		console.warn('[ProcessTimeline] No cards found with selector:', config.cardSelector);
		return [];
	}

	// Detectar tamaño de pantalla
	const isMobile = window.innerWidth < 768;
	const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
	const isDesktop = window.innerWidth >= 1024 && window.innerWidth < 1920;
	const isLargeScreen = window.innerWidth >= 1920;

	// Ocultar todas las cards inicialmente
	gsap.set(cards, { opacity: 0 });

	// Create ScrollTriggers array
	const scrollTriggers: ScrollTrigger[] = [];

	// Crear una animación por cada card con stagger reducido
	cards.forEach((card, index) => {
		// Determine if card is even (inverted layout)
		const isEven = index % 2 !== 0;

		// Query child elements
		const content = card.querySelector('.process-content');
		const imageWrapper = card.querySelector('.process-image-wrapper');

		if (!content || !imageWrapper) {
			console.warn('[ProcessTimeline] Card missing required children:', card);
			return;
		}

		// Calculate animation directions
		// Odd cards (index 0, 2, 4): content from left (-), image from right (+)
		// Even cards (index 1, 3, 5): content from right (+), image from left (-)
		const contentX = isEven ? config.distance : -config.distance;
		const imageX = isEven ? -config.distance : config.distance;

		// Ocultar elementos inicialmente
		gsap.set([content, imageWrapper], { opacity: 0, x: contentX });
		gsap.set(imageWrapper, { x: imageX });

		// Create timeline
		const tl = gsap.timeline();

		// Mostrar la card primero
		tl.to(card, {
			opacity: 1,
			duration: 0.1,
		});

		// Add animations (both start at position 0 for simultaneous effect)
		tl.to(
			content,
			{
				x: 0,
				opacity: 1,
				duration: config.duration,
				ease: 'power2.out',
			},
			0.1,
		);

		tl.to(
			imageWrapper,
			{
				x: 0,
				opacity: 1,
				duration: config.duration,
				ease: 'power2.out',
			},
			0.1,
		);

		// Ajustar el trigger según el índice y tamaño de pantalla
		const getAdjustedStart = () => {
			// Primeras 2 cards siempre usan el trigger base
			// if (index < 3) return config.triggerStart;

			// Para cards 3+ ajustar según pantalla
			if (isMobile) return 'top 95%'; // Móvil: mantener igual
			if (isTablet) return 'top 85%';
			if (isDesktop) return 'top bottom+=600'; // Desktop: activar más temprano
			if (isLargeScreen) return config.triggerStart; // Large: aún más temprano
			return 'top 80%';
		};

		const adjustedStart = getAdjustedStart();

		// Create ScrollTrigger using existing utility
		// const st = createScrollAnimation(tl, {
		// 	trigger: card,
		// 	start: 'top 80%',
		// 	markers: config.markers,
		// });
		const st = ScrollTrigger.create({
			trigger: card,
			start: adjustedStart,
			markers: config.markers,
			animation: tl,
		});

		if (separator) {
			gsap.from(separator, {
				y: 50,
				opacity: 0,
				duration: 0.6,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: separator,
					start: adjustedStart,
					toggleActions: "play none none none",
				},
			});
		}


		scrollTriggers.push(st);
	});

	return scrollTriggers;
}
