import { conditionalAnimate } from "../accessibility";
import { animateFromWithBlur, animateScaleUp } from "./animation-helpers";
import { maskTextReveal } from "./text-animations";
import { gsap } from "gsap";

export function initHeroAnimations() {
  const tl = gsap.timeline({
    paused: true, // Create paused, play immediately via conditionalAnimate to respect preferences
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

  // 2. animation-circles-container con scaleUp
  const heroImage = document.querySelector('.animation-circles-container');
  if (heroImage) {
    tl.add(
      animateScaleUp(heroImage, {
        duration: 0.8,
        ease: 'back.out(1.7)'
      }),
      0 // Start immediately at timeline start
    );
  }

  // 3. h2 (hero-title) con maskTextReveal
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const titleTimeline = maskTextReveal(heroTitle, {
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out'
    });
    tl.add(titleTimeline, '-=0.6');
  }

  // 4. h1 (hero-subtitle)
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

  // 5. CTA
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

  // 6. Separator
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

  // Execute immediately
  conditionalAnimate(
    () => tl.play(),
    () => {
      // Preferences reduced motion: ensure visibility manually if needed, 
      // but conditionalAnimate usually handles the 'no animation' check 
      // by not playing. We should ensure final state is set.
      tl.progress(1);
    }
  );
}