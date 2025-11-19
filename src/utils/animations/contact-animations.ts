
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ANIMATION_CONFIG } from './animation-helpers';
import { maskTextRevealMix } from './text-animations';


export function animateContactSection() {


	gsap.registerPlugin(ScrollTrigger);

	const section = document.querySelector("#contact");

	if (!section) return;

	const contactTitle = section.querySelector(".contact-title");
	const contactParagraphs = section.querySelectorAll(".contact-paragraph");
	const contactLogo = section.querySelector(".contact-logo img");
	const contactButtons = section.querySelector(".contact-buttons");
	const contactForm = section.querySelector(".form-info");


	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	if (prefersReducedMotion) {
		return [];
	}

	// 1. Título con máscara de texto
	if (contactTitle) {

		maskTextRevealMix(contactTitle, {
			duration: ANIMATION_CONFIG.durations.verySlow,
			ease: ANIMATION_CONFIG.easings.default,
			scrollTrigger: {
				trigger: contactTitle,
				start: 'top-=420% 90%',
			},
		})
	}

	// 3. Párrafos en secuencia con gap fijo
	contactParagraphs.forEach((p) => {
		gsap.from(p, {
			x: -30,
			opacity: 0,
			filter: "blur(20px)",
			duration: ANIMATION_CONFIG.durations.slow,
			ease: ANIMATION_CONFIG.easings.default,
			scrollTrigger: {
				trigger: p,
				start: 'top-=850 90%',
			},
		});
	});


	// Logo y botones después de párrafos
	if (contactLogo) {
		gsap.from(contactLogo, {
			x: -30,
			opacity: 0,
			filter: "blur(20px)",
			duration: ANIMATION_CONFIG.durations.slow,
			ease: ANIMATION_CONFIG.easings.default,
			scrollTrigger: {
				trigger: contactLogo,
				start: 'top-=850 90%',
			},
		});
	}

	if (contactButtons) {
		gsap.from(contactButtons, {
			x: -30,
			opacity: 0,
			filter: "blur(20px)",
			duration: ANIMATION_CONFIG.durations.slow,
			ease: ANIMATION_CONFIG.easings.default,
			scrollTrigger: {
				trigger: contactButtons,
				start: 'top-=850 90%',
			},
		});
	}

	if (contactForm) {
		gsap.from(contactForm, {
			y: 30,
			opacity: 0,
			filter: "blur(20px)",
			duration: ANIMATION_CONFIG.durations.slow,
			ease: ANIMATION_CONFIG.easings.default,
			scrollTrigger: {
				trigger: contactForm,
				start: 'top-=105% 90%',
			},
		});
	}
}