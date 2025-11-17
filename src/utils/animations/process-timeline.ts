
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANIMATION_CONFIG } from './animation-helpers';
import { maskTextRevealVertical } from './text-animations';

export function initProcessTimeline() {
	const processCards = document.querySelectorAll('.process-card');
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

	let topOffset = 80;

	processCards.forEach((card) => {

		const isReversedCard = card.classList.contains('process-card-reverse');
		const content = card.querySelector('.process-content');
		const imageWrapper = card.querySelector('.process-image-wrapper');

		if (!content || !imageWrapper) {
			console.warn('[ProcessTimeline] Card missing required children:', card);
			return;
		}
		const contentX = isReversedCard ? 50 : -50;
		const imageX = isReversedCard ? -50 : 50;

		topOffset += 10;

		const tl = gsap.timeline();

		tl.from(content, {
			x: contentX,
			opacity: 0,
			duration: 0.8,
			ease: 'power2.out'
		}, 0);

		tl.from(imageWrapper, {
			x: imageX,
			opacity: 0,
			duration: 0.8,
			ease: 'power2.out'
		}, 0);

		ScrollTrigger.create({
			trigger: card,
			start: `top ${topOffset}%`,
			toggleActions: 'play none none none',
			animation: tl,
		});
	});

	// 4. Animate separator (after last card)
	if (separator) {
		gsap.from(separator, {
			y: 50,
			opacity: 0,
			duration: 0.6,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: separator,
				start: "top bottom+=200",
				markers: true,
			},
		});
	}
}