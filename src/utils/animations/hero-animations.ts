import { conditionalAnimate } from "../accessibility";
import { animateFromWithBlur, animateScaleUp } from "./animation-helpers";
import { maskTextReveal } from "./text-animations";
import { gsap } from "gsap";


  export function initHeroAnimations() {
    const tl = gsap.timeline();

    const header = document.querySelector('header');
    if (header) {
      gsap.set(header, { y: -100, opacity: 0 });
      tl.to(header, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        onStart: () => {
          header.classList.add('is-visible');
        }
      });
    }

    // 2. animation-circles-container con scaleUp (mantiene entrada actual)
    const heroImage = document.querySelector('.animation-circles-container');
    if (heroImage) {
      tl.add(
        animateScaleUp(heroImage, {
          duration: 1.0,
          ease: 'back.out(1.7)'
        }),
        '-=0.3'
      );
    }

    // 3. h2 (hero-title) con maskTextReveal palabra por palabra
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const titleTimeline = maskTextReveal(heroTitle, {
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
      tl.add(titleTimeline, '-=0.5');
    }

    // 4. h1 (hero-subtitle) desde izquierda con blur
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
      tl.add(
        animateFromWithBlur(heroSubtitle, 'left', {
          duration: 0.6,
          ease: 'power3.out'
        }),
        '-=0.4'
      );
    }

    // 5. CTA desde izquierda con blur
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
      tl.add(
        animateFromWithBlur(heroCta, 'left', {
          duration: 0.6,
          ease: 'power3.out'
        }),
        '-=0.4'
      );
    }
    // 6. Separator entra desde abajo
    const separator = document.querySelector('#services-separator');
    if (separator) {
      tl.add(
        gsap.from(separator, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        })
      );
    }

    // Función para iniciar animaciones
    function startAnimations() {
      conditionalAnimate(
        () => tl.play(),
        () => {
          // Fallback: no hacer nada, dejar contenido visible
        }
      );
    }

    // // Escuchar evento del preloader
    // window.addEventListener('preloader:complete', startAnimations);

    // // Fallback: si no hay preloader, iniciar después de un pequeño delay
    setTimeout(() => {
      const preloader = document.getElementById('electric-preloader');
      if (!preloader) {
        startAnimations();
      }
    }, 100);
  }
