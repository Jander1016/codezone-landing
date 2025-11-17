
import { gsap } from 'gsap';
import { animateFromWithBlur, ANIMATION_CONFIG } from './animation-helpers';
import {  maskTextRevealMix } from './text-animations';


export function animateContactSection() {

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
			duration: 0.6,
			ease: ANIMATION_CONFIG.easings.default,
			scrollTrigger: {
				trigger: contactTitle,
				start: 'top bottom+=450',
				// markers: true,
			}
		});
	}

	// 3. Párrafos en secuencia con gap fijo

	contactParagraphs.forEach((p) => {
		animateFromWithBlur(p, "left", {
			duration: 0.6,
			stagger: 0.2,
			ease: "power3.out",
			scrollTrigger: {
				trigger: p,
				start: 'top bottom+=450',
			},
		});
	});


	// Logo y botones después de párrafos
	if (contactLogo) {
		animateFromWithBlur(contactLogo, "left", {
			duration: 0.6,
			stagger: 0.2,
			ease: "power3.out",
			scrollTrigger: {
				trigger: contactLogo,
				start: 'top bottom+=450',
			},
		});
	}

	if (contactButtons) {
		animateFromWithBlur(contactButtons, "left", {
			duration: 0.6,
			stagger: 0.2,
			ease: "power3.out",
			scrollTrigger: {
				trigger: contactButtons,
				start: 'top bottom+=500',
			},
		});
	}

	if (contactForm) {
		gsap.from(contactForm, {
			y: 30,
			opacity: 0,
			filter: "blur(20px)",
			duration: 0.6,
			stagger: 0.2,
			ease: "power3.out",
			scrollTrigger: {
				trigger: contactForm,
				start: 'top bottom+=350',
			},
		});
	}
}