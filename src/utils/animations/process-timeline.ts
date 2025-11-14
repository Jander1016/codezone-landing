
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANIMATION_CONFIG } from './animation-helpers';
import { maskTextRevealVertical } from './text-animations';

/**
 * Viewport size categories based on standard breakpoints
 * 
 * Breakpoints:
 * - mobile: < 768px
 * - tablet: 768px - 1023px
 * - desktop: 1024px - 1919px
 * - large: >= 1920px
 */
export type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'large';

/**
 * Responsive value configuration that adapts to different viewport sizes
 * 
 * Allows specifying different values for each viewport category with a fallback default.
 * Resolution priority: viewport-specific → default → fallback parameter
 * 
 * @template T - The type of value (string, number, etc.)
 * 
 * @example
 * ```typescript
 * const duration: ResponsiveValue<number> = {
 *   mobile: 0.5,
 *   tablet: 0.6,
 *   desktop: 0.6,
 *   large: 0.7,
 *   default: 0.6
 * };
 * ```
 */
export interface ResponsiveValue<T = string> {
	/** Value for mobile viewport (< 768px) */
	mobile?: T;
	/** Value for tablet viewport (768px - 1023px) */
	tablet?: T;
	/** Value for desktop viewport (1024px - 1919px) */
	desktop?: T;
	/** Value for large viewport (>= 1920px) */
	large?: T;
	/** Default fallback value if no viewport-specific value matches */
	default?: T;
}

/**
 * ScrollTrigger animation configuration
 * 
 * Defines when and how ScrollTrigger animations should activate.
 * 
 * @example
 * ```typescript
 * const config: AnimationTriggerConfig = {
 *   start: 'top 80%',
 *   end: 'bottom 20%',
 *   markers: true
 * };
 * ```
 */
export interface AnimationTriggerConfig {
	/** Start position for ScrollTrigger (e.g., 'top 80%', 'center center') */
	start: string;
	/** End position for ScrollTrigger (optional) */
	end?: string;
	/** Enable debug markers for development (default: false) */
	markers?: boolean;
}

/**
 * Configuration options for process timeline animations
 * 
 * Provides fine-grained control over animation behavior with responsive support.
 * All timing and positioning values can be specified per viewport or as direct values.
 * 
 * @example
 * ```typescript
 * // Basic usage with direct values
 * const options: ProcessTimelineOptions = {
 *   markers: true,
 *   duration: 0.6,
 *   distance: 50,
 *   triggerStart: 'top 80%'
 * };
 * 
 * // Advanced usage with responsive values
 * const responsiveOptions: ProcessTimelineOptions = {
 *   markers: false,
 *   duration: {
 *     mobile: 0.5,
 *     desktop: 0.7,
 *     default: 0.6
 *   },
 *   distance: {
 *     mobile: 30,
 *     desktop: 60,
 *     default: 50
 *   },
 *   triggerStart: {
 *     mobile: 'top 85%',
 *     desktop: 'top 75%',
 *     default: 'top 80%'
 *   }
 * };
 * ```
 */
export interface ProcessTimelineOptions {
	/** Enable debug markers for ScrollTrigger (default: false) */
	markers?: boolean;
	/** Animation duration in seconds - can be responsive or direct value */
	duration?: ResponsiveValue<number> | number;
	/** Distance for slide animations in pixels - can be responsive or direct value */
	distance?: ResponsiveValue<number> | number;
	/** ScrollTrigger start position - can be responsive or direct value */
	triggerStart?: ResponsiveValue<string> | string;
}

/**
 * Internal resolved configuration with all values computed for current viewport
 * 
 * This interface represents the final configuration after all responsive values
 * have been resolved to concrete values based on the detected viewport size.
 * Used internally by animation functions to ensure consistent behavior.
 * 
 * @internal
 */
interface ResolvedConfig {
	/** Whether debug markers are enabled */
	markers: boolean;
	/** Resolved animation duration in seconds */
	duration: number;
	/** Resolved slide distance in pixels */
	distance: number;
	/** Resolved ScrollTrigger start position */
	triggerStart: string;
	/** The viewport size that was detected */
	viewport: ViewportSize;
}

/**
 * Default responsive configuration for process timeline animations.
 * 
 * These defaults are optimized for smooth animations across all devices:
 * - Shorter durations on mobile for snappier feel
 * - Longer durations on large screens for more dramatic effect
 * - Smaller distances on mobile to avoid excessive movement
 * - Earlier triggers on mobile (higher %) to account for smaller viewport
 * 
 * All values can be overridden through ProcessTimelineOptions.
 */
const DEFAULT_CONFIG: Required<ProcessTimelineOptions> = {
	markers: true,
	duration: {
		mobile: 0.5,
		tablet: 0.6,
		desktop: 0.6,
		large: 0.7,
		default: 0.6
	},
	distance: {
		mobile: 30,
		tablet: 40,
		desktop: 50,
		large: 60,
		default: 50
	},
	triggerStart: {
		mobile: 'top 85%',
		tablet: 'top 80%',
		desktop: 'top 75%',
		large: 'top 70%',
		default: 'top 80%'
	}
};





/**
 * Detects the current viewport size category based on window width.
 * 
 * Uses standard breakpoints to categorize the viewport:
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Desktop: 1024px - 1919px
 * - Large: >= 1920px
 * 
 * This function is used internally to resolve responsive configurations
 * and select the appropriate values for the current viewport.
 * 
 * @returns Current viewport size category
 * 
 * @example
 * ```typescript
 * const size = detectViewportSize();
 * console.log(size); // 'mobile' | 'tablet' | 'desktop' | 'large'
 * 
 * // Example usage in responsive configuration
 * const viewport = detectViewportSize();
 * if (viewport === 'mobile') {
 *   // Apply mobile-specific settings
 * }
 * ```
 */
function detectViewportSize(): ViewportSize {
	const width = window.innerWidth;
	
	if (width < 768) return 'mobile';
	if (width < 1024) return 'tablet';
	if (width < 1920) return 'desktop';
	return 'large';
}

/**
 * Resolves a responsive value based on current viewport size.
 * 
 * This function handles both direct values and ResponsiveValue objects,
 * providing a flexible way to specify viewport-specific configurations.
 * 
 * Resolution priority:
 * 1. Viewport-specific value (mobile, tablet, desktop, large)
 * 2. Default value from ResponsiveValue config
 * 3. Fallback parameter value
 * 
 * @template T - The type of value to resolve (string, number, etc.)
 * @param config - Direct value or ResponsiveValue configuration object
 * @param viewport - Current viewport size category
 * @param fallback - Fallback value if resolution fails
 * @returns Resolved value for the current viewport
 * 
 * @example
 * ```typescript
 * // Direct value - returns as-is
 * resolveResponsiveValue(50, 'mobile', 0); // 50
 * resolveResponsiveValue('top 80%', 'desktop', 'top 70%'); // 'top 80%'
 * 
 * // ResponsiveValue object - resolves based on viewport
 * const duration = { mobile: 0.5, desktop: 0.7, default: 0.6 };
 * resolveResponsiveValue(duration, 'mobile', 0.6); // 0.5
 * resolveResponsiveValue(duration, 'tablet', 0.6); // 0.6 (uses default)
 * resolveResponsiveValue(duration, 'large', 0.6); // 0.6 (uses default)
 * 
 * // Fallback when no match
 * const distance = { desktop: 60 };
 * resolveResponsiveValue(distance, 'mobile', 50); // 50 (uses fallback)
 * ```
 */
function resolveResponsiveValue<T>(
	config: ResponsiveValue<T> | T,
	viewport: ViewportSize,
	fallback: T
): T {
	// If direct value (not an object), return it
	if (typeof config !== 'object' || config === null) {
		return config as T;
	}
	
	// Handle ResponsiveValue object
	const responsiveConfig = config as ResponsiveValue<T>;
	
	// Try viewport-specific value first
	if (responsiveConfig[viewport] !== undefined) {
		return responsiveConfig[viewport]!;
	}
	
	// Try default value
	if (responsiveConfig.default !== undefined) {
		return responsiveConfig.default;
	}
	
	// Use fallback
	return fallback;
}

/**
 * Resolves complete configuration by merging user options with defaults
 * and resolving all responsive values for the current viewport.
 * 
 * This function:
 * 1. Merges user-provided options with DEFAULT_CONFIG
 * 2. Resolves all responsive values (duration, distance, triggerStart) to concrete values
 * 3. Returns a ResolvedConfig object ready for use by animation functions
 * 
 * @param options - User-provided configuration options (optional)
 * @param viewport - Current viewport size category
 * @returns Fully resolved configuration with concrete values
 * 
 * @example
 * ```typescript
 * // With default configuration
 * const viewport = detectViewportSize();
 * const config = resolveConfig(undefined, viewport);
 * // Returns: { markers: false, duration: 0.5, distance: 30, triggerStart: 'top 85%', viewport: 'mobile' }
 * 
 * // With custom options
 * const config = resolveConfig({
 *   markers: true,
 *   duration: 0.8
 * }, 'desktop');
 * // Returns: { markers: true, duration: 0.8, distance: 50, triggerStart: 'top 75%', viewport: 'desktop' }
 * 
 * // With responsive options
 * const config = resolveConfig({
 *   duration: { mobile: 0.4, desktop: 0.8 },
 *   distance: { mobile: 20, desktop: 70 }
 * }, 'mobile');
 * // Returns: { markers: false, duration: 0.4, distance: 20, triggerStart: 'top 85%', viewport: 'mobile' }
 * ```
 */
function resolveConfig(
	options: ProcessTimelineOptions | undefined,
	viewport: ViewportSize
): ResolvedConfig {
	// Merge with defaults
	const merged = {
		markers: options?.markers ?? DEFAULT_CONFIG.markers,
		duration: options?.duration ?? DEFAULT_CONFIG.duration,
		distance: options?.distance ?? DEFAULT_CONFIG.distance,
		triggerStart: options?.triggerStart ?? DEFAULT_CONFIG.triggerStart
	};
	
	// Resolve responsive values for current viewport
	return {
		markers: merged.markers,
		duration: resolveResponsiveValue(merged.duration, viewport, 0.6),
		distance: resolveResponsiveValue(merged.distance, viewport, 50),
		triggerStart: resolveResponsiveValue(merged.triggerStart, viewport, 'top 80%'),
		viewport
	};
}

/**
 * Creates subtitle animation with ScrollTrigger.
 * 
 * Animates the subtitle element from bottom with a blur effect, creating a smooth
 * entrance as the element enters the viewport. This is typically the first animation
 * in the process timeline sequence.
 * 
 * Animation properties:
 * - Slides up from 60px below final position
 * - Fades in from opacity 0 to 1
 * - Blur effect transitions from 10px to 0
 * - Uses smooth easing for natural motion
 * 
 * @param subtitle - The subtitle element to animate
 * @param config - Resolved configuration with duration, trigger position, and markers
 * @returns ScrollTrigger instance for the animation, or null if element is invalid
 * 
 * @example
 * ```typescript
 * const subtitle = document.querySelector('.process-subtitle');
 * const config = resolveConfig(options, viewport);
 * 
 * if (subtitle) {
 *   const trigger = createSubtitleAnimation(subtitle, config);
 *   if (trigger) {
 *     console.log('Subtitle animation created:', trigger.id);
 *   }
 * }
 * ```
 */
function createSubtitleAnimation(
	subtitle: Element,
	config: ResolvedConfig
): ScrollTrigger | null {
	if (!subtitle) {
		return null;
	}
	
	// Create the animation tween
	const tween = gsap.from(subtitle, {
		y: 60,
		opacity: 0,
		filter: 'blur(10px)',
		duration: config.duration,
		ease: ANIMATION_CONFIG.easings.smooth
	});
	
	// Create and return the ScrollTrigger
	// Use "top bottom" to trigger when subtitle enters viewport
	return ScrollTrigger.create({
		trigger: subtitle,
		start: "top bottom-=100",
		markers: config.markers,
		animation: tween,
		id: 'process-subtitle'
	});
}

/**
 * Creates title animation with ScrollTrigger using vertical text reveal effect.
 * 
 * Animates the title element using a vertical mask reveal animation that reveals
 * text word-by-word from bottom to top. This creates a dramatic entrance effect
 * that draws attention to the main heading. This animation typically runs after
 * the subtitle animation in the process timeline sequence.
 * 
 * Animation properties:
 * - Uses maskTextRevealVertical for word-by-word reveal
 * - Fast stagger timing between words for dynamic feel
 * - Smooth easing for natural motion
 * - Triggered when title enters viewport
 * 
 * The function leverages the existing text-animations module to maintain
 * consistency with other text reveal animations across the site.
 * 
 * @param title - The title element to animate
 * @param config - Resolved configuration with duration, trigger position, and markers
 * @returns ScrollTrigger instance from maskTextRevealVertical, or null if element is invalid or animation fails
 * 
 * @example
 * ```typescript
 * const title = document.querySelector('.process-title');
 * const config = resolveConfig(options, viewport);
 * 
 * if (title) {
 *   const trigger = createTitleAnimation(title, config);
 *   if (trigger) {
 *     console.log('Title animation created:', trigger.id);
 *   }
 * }
 * ```
 * 
 * @see maskTextRevealVertical - The underlying animation function from text-animations module
 */
function createTitleAnimation(
	title: Element,
	config: ResolvedConfig
): ScrollTrigger | null {
	if (!title) {
		return null;
	}
	
	// Use maskTextRevealVertical from text-animations module
	// Use "top bottom" to trigger when title enters viewport
	const result = maskTextRevealVertical(title, {
		duration: config.duration,
		stagger: ANIMATION_CONFIG.stagger.fast,
		ease: ANIMATION_CONFIG.easings.default,
		scrollTrigger: {
			trigger: title,
			start: "top bottom-=100",
			markers: config.markers,
			id: 'process-title'
		}
	});
	
	// Return the ScrollTrigger instance or null
	return result.scrollTrigger || null;
}

/**
 * Creates animation for a single process card with zigzag pattern.
 * 
 * Animates a process card with a slide-in effect when it enters the viewport.
 * Cards alternate between left-to-right and right-to-left animations based on
 * their index, creating a dynamic zigzag pattern:
 * 
 * - Even index cards (0, 2, 4...): content slides from LEFT, image from RIGHT
 * - Odd index cards (1, 3, 5...): content slides from RIGHT, image from LEFT
 * 
 * Animation sequence:
 * 1. Card fades in (opacity 0 → 1, duration 0.1s)
 * 2. Content and image slide in simultaneously from opposite directions
 * 3. Both elements fade in while sliding (opacity 0 → 1)
 * 
 * Each card has its own independent ScrollTrigger that activates when the card
 * itself enters the viewport, ensuring smooth scroll-based animations without
 * blocking or dependencies on other cards.
 * 
 * @param card - The card element to animate
 * @param index - Card index (0-based) used to determine animation direction
 * @param config - Resolved configuration with duration, distance, trigger position, and markers
 * @returns ScrollTrigger instance for the card animation, or null if card is invalid or missing children
 * 
 * @example
 * ```typescript
 * const cards = document.querySelectorAll('.process-card');
 * const config = resolveConfig(options, viewport);
 * 
 * cards.forEach((card, index) => {
 *   const trigger = createCardAnimation(card, index, config);
 *   if (trigger) {
 *     console.log(`Card ${index} animation created:`, trigger.id);
 *   }
 * });
 * 
 * // Card 0: content from left (-50px), image from right (+50px)
 * // Card 1: content from right (+50px), image from left (-50px)
 * // Card 2: content from left (-50px), image from right (+50px)
 * // ...and so on
 * ```
 */
function createCardAnimation(
	card: Element,
	index: number,
	config: ResolvedConfig
): ScrollTrigger | null {
	// Query child elements
	const content = card.querySelector('.process-content');
	const imageWrapper = card.querySelector('.process-image-wrapper');
	
	if (!content || !imageWrapper) {
		console.warn('[ProcessTimeline] Card missing required children:', card);
		return null;
	}
	
	// Calculate zigzag directions
	// Odd index (1, 3, 5): content from right (+), image from left (-)
	// Even index (0, 2, 4): content from left (-), image from right (+)
	const isOdd = index % 2 !== 0;
	const contentX = isOdd ? config.distance : -config.distance;
	const imageX = isOdd ? -config.distance : config.distance;
	
	// Set initial state: hide card and position children
	gsap.set(card, { opacity: 0 });
	gsap.set(content, { opacity: 0, x: contentX });
	gsap.set(imageWrapper, { opacity: 0, x: imageX });
	
	// Create timeline for the card animation
	const tl = gsap.timeline();
	
	// Step 1: Fade in the card container
	tl.to(card, {
		opacity: 1,
		duration: 0.1
	});
	
	// Step 2: Animate content (slide in from offset position)
	tl.to(content, {
		x: 0,
		opacity: 1,
		duration: config.duration,
		ease: ANIMATION_CONFIG.easings.smooth
	}, 0.1); // Start at 0.1s (after card fade-in)
	
	// Step 3: Animate image wrapper (slide in from opposite direction, simultaneous with content)
	tl.to(imageWrapper, {
		x: 0,
		opacity: 1,
		duration: config.duration,
		ease: ANIMATION_CONFIG.easings.smooth
	}, 0.1); // Start at 0.1s (simultaneous with content)
	
	// Create ScrollTrigger for this card
	// Use "top bottom" to trigger when card enters viewport from bottom
	// This ensures cards animate as soon as they become visible
	return ScrollTrigger.create({
		trigger: card,
		start: "top bottom-=100",
		markers: config.markers,
		animation: tl,
		id: `process-card-${index}`
	});
}

/**
 * Creates separator animation that triggers after all process cards complete.
 * 
 * This function implements a sequential animation approach where the separator
 * animates only after the last card's animation has completed. It uses a polling
 * mechanism to detect when the last card's ScrollTrigger is created and attaches
 * an onComplete callback to coordinate the timing.
 * 
 * Animation sequence:
 * 1. Wait for last card's ScrollTrigger to be created
 * 2. Attach onComplete callback to last card's animation
 * 3. When last card completes, wait 150ms
 * 4. Animate separator from bottom with fade-in effect
 * 
 * Fallback behavior:
 * - If no cards exist, animates separator immediately with its own ScrollTrigger
 * - If last card's trigger not found after timeout, uses fallback ScrollTrigger
 * 
 * The function returns a cleanup function that should be called if the animation
 * needs to be cancelled or cleaned up before completion.
 * 
 * @param separator - The separator element to animate
 * @param cards - Array of card elements (used to find the last card)
 * @param config - Resolved configuration with duration, trigger position, and markers
 * @returns Cleanup function to cancel polling and prevent animation
 * 
 * @example
 * ```typescript
 * const separator = document.querySelector('.stack-separator');
 * const cards = Array.from(document.querySelectorAll('.process-card'));
 * const config = resolveConfig(options, viewport);
 * 
 * if (separator && cards.length > 0) {
 *   const cleanup = createSeparatorAnimation(separator, cards, config);
 *   
 *   // Later, if needed:
 *   // cleanup(); // Cancels the animation setup
 * }
 * 
 * // With no cards (immediate animation):
 * if (separator && cards.length === 0) {
 *   const cleanup = createSeparatorAnimation(separator, [], config);
 *   // Separator animates immediately with ScrollTrigger
 * }
 * ```
 */
function createSeparatorAnimation(
	separator: Element,
	cards: Element[],
	config: ResolvedConfig
): () => void {
	// Handle case where cards array is empty - animate separator immediately
	if (cards.length === 0) {
		gsap.from(separator, {
			y: 50,
			opacity: 0,
			duration: config.duration,
			ease: ANIMATION_CONFIG.easings.smooth,
			scrollTrigger: {
				trigger: separator,
				start: "top bottom-=100",
				markers: config.markers,
				id: 'process-separator'
			}
		});
		return () => {}; // Return empty cleanup function
	}
	
	// Get the last card from the array
	const lastCard = cards[cards.length - 1];
	
	// Polling mechanism configuration
	const pollInterval = 100; // Check every 100ms
	const maxAttempts = 50; // Maximum 5 seconds (50 * 100ms)
	let attempts = 0;
	let cleanedUp = false;
	
	// Polling function to find last card's ScrollTrigger
	const checkAndAttach = () => {
		if (cleanedUp) return;
		
		attempts++;
		
		// Get all ScrollTriggers and find the one matching the last card
		const allTriggers = ScrollTrigger.getAll();
		const lastCardTrigger = allTriggers.find(st => st.trigger === lastCard);
		
		if (lastCardTrigger && lastCardTrigger.animation) {
			// Found the trigger! Attach onComplete callback
			const anim = lastCardTrigger.animation as gsap.core.Timeline;
			
			anim.eventCallback('onComplete', () => {
				if (cleanedUp) return;
				
				// Wait 150ms after last card completes, then animate separator
				setTimeout(() => {
					gsap.from(separator, {
						y: 50,
						opacity: 0,
						duration: config.duration,
						ease: ANIMATION_CONFIG.easings.smooth
					});
				}, 150);
			});
			
			// Clear the interval - we're done
			clearInterval(interval);
			return;
		}
		
		// Timeout fallback: if maxAttempts reached, animate with ScrollTrigger
		if (attempts >= maxAttempts) {
			console.warn('[ProcessTimeline] Separator animation timeout, using fallback ScrollTrigger');
			gsap.from(separator, {
				y: 50,
				opacity: 0,
				duration: config.duration,
				ease: ANIMATION_CONFIG.easings.smooth,
				scrollTrigger: {
					trigger: separator,
					start: "top bottom-=100",
					markers: config.markers,
					id: 'process-separator-fallback'
				}
			});
			clearInterval(interval);
		}
	};
	
	// Start polling
	const interval = setInterval(checkAndAttach, pollInterval);
	
	// Return cleanup function
	return () => {
		cleanedUp = true;
		clearInterval(interval);
	};
}

/**
 * Initializes process timeline animations with sequential flow.
 * 
 * This function orchestrates the complete animation sequence for the process section,
 * creating a smooth, coordinated flow of animations that activate as the user scrolls:
 * 
 * **Animation Sequence:**
 * 1. **Subtitle** - Slides up from bottom with blur effect when entering viewport
 * 2. **Title** - Vertical text reveal with word-by-word stagger when entering viewport
 * 3. **Cards** - Each card animates independently with zigzag pattern when entering viewport
 * 4. **Separator** - Slides up from bottom after the last card completes its animation
 * 
 * **Key Features:**
 * - Respects user's prefers-reduced-motion preference
 * - Responsive configuration that adapts to viewport size
 * - Individual ScrollTriggers for each card (no blocking)
 * - Sequential separator timing coordinated with last card
 * - Graceful handling of missing elements
 * - Debug markers support for development
 * 
 * **Responsive Behavior:**
 * The function automatically detects the viewport size and applies appropriate
 * animation values. Default responsive values are optimized for each device:
 * - Mobile: Faster animations (0.5s), smaller distances (30px), earlier triggers (85%)
 * - Tablet: Balanced animations (0.6s), medium distances (40px), standard triggers (80%)
 * - Desktop: Standard animations (0.6s), larger distances (50px), later triggers (75%)
 * - Large: Dramatic animations (0.7s), largest distances (60px), latest triggers (70%)
 * 
 * @param options - Optional configuration to customize animation behavior
 * @returns Array of created ScrollTrigger instances (empty if animations disabled or section not found)
 * 
 * @example
 * ```typescript
 * // Basic usage with default configuration
 * const triggers = initProcessTimeline();
 * console.log(`Created ${triggers.length} ScrollTriggers`);
 * 
 * // Enable debug markers for development
 * initProcessTimeline({ markers: true });
 * 
 * // Custom animation timing with direct values
 * initProcessTimeline({
 *   duration: 0.8,
 *   distance: 60,
 *   triggerStart: 'top 70%'
 * });
 * 
 * // Responsive configuration for different viewports
 * initProcessTimeline({
 *   duration: {
 *     mobile: 0.4,
 *     tablet: 0.6,
 *     desktop: 0.8,
 *     large: 1.0,
 *     default: 0.6
 *   },
 *   distance: {
 *     mobile: 20,
 *     desktop: 70,
 *     default: 50
 *   },
 *   triggerStart: {
 *     mobile: 'top 90%',
 *     desktop: 'top 70%',
 *     default: 'top 80%'
 *   }
 * });
 * 
 * // Mixed configuration (some responsive, some direct)
 * initProcessTimeline({
 *   markers: false,
 *   duration: 0.7, // Direct value for all viewports
 *   distance: { mobile: 25, desktop: 60 }, // Responsive
 *   triggerStart: 'top 75%' // Direct value for all viewports
 * });
 * ```
 * 
 * @see ProcessTimelineOptions - Configuration interface with all available options
 * @see ResponsiveValue - Interface for viewport-specific values
 * @see ViewportSize - Viewport size categories (mobile, tablet, desktop, large)
 */
export function initProcessTimeline2(
	options?: ProcessTimelineOptions
): ScrollTrigger[] {
	// 8.1: Check for prefers-reduced-motion
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	
	if (prefersReducedMotion) {
		console.log('[ProcessTimeline] Animations disabled due to prefers-reduced-motion');
		return [];
	}
	
	// 8.2: Detect viewport and resolve configuration
	const viewport = detectViewportSize();
	const config = resolveConfig(options, viewport);
	
	console.log('[ProcessTimeline] Initialized with config:', {
		viewport,
		duration: config.duration,
		distance: config.distance,
		triggerStart: config.triggerStart
	});
	
	// 8.3: Query DOM elements
	const processSection = document.querySelector('#process');
	if (!processSection) {
		console.warn('[ProcessTimeline] Process section not found');
		return [];
	}
	
	const subtitle = processSection.querySelector('.process-subtitle');
	const title = processSection.querySelector('.process-title');
	const cards = Array.from(processSection.querySelectorAll('.process-card'));
	const separator = document.querySelector('.stack-separator');
	
	// Create empty scrollTriggers array
	const scrollTriggers: ScrollTrigger[] = [];
	
	// 8.4: Create animations with individual ScrollTriggers
	// Each element animates when it enters the viewport
	
	// 1. Animate subtitle
	if (subtitle) {
		const subtitleTL = gsap.timeline();
		
		subtitleTL.from(subtitle, {
			y: 60,
			opacity: 0,
			filter: 'blur(10px)',
			duration: config.duration,
			ease: ANIMATION_CONFIG.easings.smooth
		});
		
		const st = ScrollTrigger.create({
			trigger: subtitle,
			start: 'top 90%',
			toggleActions: 'play none none none',
			markers: config.markers,
			animation: subtitleTL,
			id: 'process-subtitle'
		});
		scrollTriggers.push(st);
	}
	
	// 2. Animate title
	if (title) {
		const result = maskTextRevealVertical(title, {
			duration: config.duration,
			stagger: ANIMATION_CONFIG.stagger.fast,
			ease: ANIMATION_CONFIG.easings.default,
			scrollTrigger: {
				trigger: title,
				start: 'top 90%',
				toggleActions: 'play none none none',
				markers: config.markers,
				id: 'process-title'
			}
		});
		
		if (result.scrollTrigger) {
			scrollTriggers.push(result.scrollTrigger);
		}
	}
	
	// 3. Animate cards (individual ScrollTriggers with consistent values)
	cards.forEach((card, index) => {
		const content = card.querySelector('.process-content');
		const imageWrapper = card.querySelector('.process-image-wrapper');
		
		if (!content || !imageWrapper) {
			console.warn('[ProcessTimeline] Card missing required children:', card);
			return;
		}
		
		// Calculate zigzag directions (like the example's inverted logic)
		const isOdd = index % 2 !== 0;
		const contentX = isOdd ? config.distance : -config.distance;
		const imageX = isOdd ? -config.distance : config.distance;
		
		// Create timeline for the card animation (like the example)
		const cardTL = gsap.timeline();
		
		// Fade in card container first
		cardTL.from(card, {
			opacity: 0,
			duration: 0.1
		});
		
		// Animate content and image from their offset positions (both start at position '0.1')
		cardTL.from(content, {
			x: contentX,
			opacity: 0,
			duration: config.duration,
			ease: ANIMATION_CONFIG.easings.smooth
		}, 0.1);
		
		cardTL.from(imageWrapper, {
			x: imageX,
			opacity: 0,
			duration: config.duration,
			ease: ANIMATION_CONFIG.easings.smooth
		}, 0.1);
		
		// Create ScrollTrigger with toggleActions (like the example)
		const st = ScrollTrigger.create({
			trigger: card,
			start: 'top 90%',
			toggleActions: 'play none none none',
			markers: config.markers,
			animation: cardTL,
			id: `process-card-${index}`
		});
		scrollTriggers.push(st);
	});
	
	// 4. Animate separator (after last card)
	if (separator && cards.length > 0) {
		createSeparatorAnimation(separator, cards, config);
	}
	
	return scrollTriggers;
}


export function initProcessTimeline(){
	const processCards = document.querySelectorAll('.process-card');
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion) {
		console.log('[ProcessTimeline] Animations disabled due to prefers-reduced-motion');
		return;
	}

	processCards.forEach((card, index) => {

		const isReversedCard = card.classList.contains('process-card-reverse');
		const content = card.querySelector('.process-content');
		const imageWrapper = card.querySelector('.process-image-wrapper');

		if (!content || !imageWrapper) {
			console.warn('[ProcessTimeline] Card missing required children:', card);
			return;
		}
		const contentX = isReversedCard ? 50 : -50;
		const imageX = isReversedCard ? -50 : 50;

		const tl = gsap.timeline();
		
		tl.from(content, {
			x: contentX,
			opacity: 0,
			duration: 0.8,
			ease: 'power2.out'
		},0);

		tl.from(imageWrapper, {
			x: imageX,
			opacity: 0,
			duration: 0.8,
			ease: 'power2.out'
		},0);
		ScrollTrigger.create({
			trigger: card,
			start: 'top 90%',
			toggleActions: 'play none none none',
			animation: tl,
			markers: true,
		});
	});
}