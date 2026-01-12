
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANIMATION_CONFIG } from './animation-helpers';
import { maskTextRevealVertical } from './text-animations';

export function initProcessTimeline() {
	const processSection = document.querySelector('#process');
	if (!processSection) {
		console.warn('[ProcessTimeline] Process section not found');
		return;
	}

	const subtitle = processSection.querySelector('.process-subtitle');
	const title = processSection.querySelector('.process-title');
	const separator = document.querySelector('#stack-separator');
	const scrollTriggers: ScrollTrigger[] = [];

	// Check for prefers-reduced-motion
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion) {
		console.log('[ProcessTimeline] Animations disabled due to prefers-reduced-motion');
		return;
	}

	// 1. Animate subtitle
	if (subtitle) {
		const subtitleTL = gsap.timeline();

		subtitleTL.from(subtitle, {
			y: 60,
			opacity: 0,
			filter: 'blur(10px)',
			duration: 0.6,
			ease: ANIMATION_CONFIG.easings.smooth
		});

		const st = ScrollTrigger.create({
			trigger: subtitle,
			start: 'top 90%',
			animation: subtitleTL,
			id: 'process-subtitle'
		});
		scrollTriggers.push(st);
	}

	// 2. Animate title
	if (title) {
		const result = maskTextRevealVertical(title, {
			duration: 0.6,
			stagger: ANIMATION_CONFIG.stagger.fast,
			ease: ANIMATION_CONFIG.easings.default,
			scrollTrigger: {
				trigger: title,
				start: 'top 90%',
				id: 'process-title'
			}
		});

		if (result.scrollTrigger) {
			scrollTriggers.push(result.scrollTrigger);
		}
	}

	// 3. Animate separator (after last card)
	if (separator) {
		gsap.from(separator, {
			y: 50,
			opacity: 0,
			duration: 0.6,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: separator,
				start: "top bottom+=200",
			},
		});
	}
}