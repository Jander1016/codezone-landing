import { animateFromWithBlur } from "./animation-helpers";
import { maskTextReveal } from "./text-animations";
import { gsap } from "gsap";

export function initHeroAnimations() {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });

  const header = document.querySelector('header');
  if (header) {
    gsap.set(header, { y: -100, opacity: 0 });
    tl.to(header, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      onStart: () => {
        header.classList.add('is-visible');
      }
    });
  }

  const heroImage = document.querySelector('.animation-circles-container');
  if (heroImage) {
    tl.add(
      gsap.from(heroImage, {
        scale: 0.9,

        filter: 'blur(10px)',
        duration: 0.8,
        ease: 'back.out(1.7)'
      }),
      0 // Start immediately at timeline start
    );
  }

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const titleTimeline = maskTextReveal(heroTitle, {
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out'
    });
    tl.add(titleTimeline, '-=0.6');
  }

  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    tl.add(
      animateFromWithBlur(heroSubtitle, 'left', {
        duration: 0.5,
        ease: 'power3.out'
      }),
      '-=0.4'
    );
  }

  const heroCta = document.querySelector('.hero-cta');
  if (heroCta) {
    tl.add(
      animateFromWithBlur(heroCta, 'left', {
        duration: 0.5,
        ease: 'power3.out'
      }),
      '-=0.4'
    );
  }

  const separator = document.querySelector('#services-separator');
  if (separator) {
    tl.add(
      gsap.from(separator, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
      }),
      '-=0.3'
    );
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    tl.progress(1).pause();
  } else {
    tl.play();
  }
}