import { gsap } from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScrollAnimation } from './scroll-animations';
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
	duration: 0.8,
	distance: 50,
	triggerStart: 'top 85%',
	markers: false,
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

	// Query all process cards
	const cards = container.querySelectorAll(config.cardSelector);
	if (cards.length === 0) {
		console.warn('[ProcessTimeline] No cards found with selector:', config.cardSelector);
		return [];
	}

	// Create ScrollTriggers array
	const scrollTriggers: ScrollTrigger[] = [];

	// Iterate through cards
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

		// Create timeline
		const tl = gsap.timeline();

		// Add animations (both start at position 0 for simultaneous effect)
		tl.from(
			content,
			{
				x: contentX,
				opacity: 0,
				duration: config.duration,
				ease: 'power2.out',
			},
			0,
		);

		tl.from(
			imageWrapper,
			{
				x: imageX,
				opacity: 0,
				duration: config.duration,
				ease: 'power2.out',
			},
			0,
		);

		// Create ScrollTrigger using existing utility
		const st = createScrollAnimation(tl, {
			trigger: card,
			start: config.triggerStart,
			markers: config.markers,
		});

		scrollTriggers.push(st);
	});

	return scrollTriggers;
}
