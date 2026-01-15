import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { maskTextRevealVertical } from "./text-animations";
import {
  setupSectionAnimationRefresh,
  animateSeparatorAfterSection,
} from "./animation-helpers";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------
 * Accesibilidad moved inside function
 * -------------------------------------------------- */

export function initServicesAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    ScrollTrigger.disable();
    return;
  }

  const section = document.querySelector("#services");
  if (!section) return;

  const logo = section.querySelector("img");
  const claim = section.querySelector("h2");
  const paragraphs = section.querySelectorAll(
    ".paragraph-1, .paragraph-2"
  );
  const cards = [...section.querySelectorAll(".service-card")];
  const separator = document.querySelector("#process-separator");

  /* --------------------------------------------------
   * Logo
   * -------------------------------------------------- */
  logo &&
    gsap.from(logo, {
      y: 60,
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: logo,
        start: "top 80%",
      },
    });

  /* --------------------------------------------------
   * Claim
   * -------------------------------------------------- */
  claim &&
    maskTextRevealVertical(claim, {
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: claim,
        start: "top 80%",
      },
    });

  /* --------------------------------------------------
   * Párrafos
   * -------------------------------------------------- */
  paragraphs.forEach((p, i) => {
    gsap.from(p, {
      y: 40,
      opacity: 0,
      filter: "blur(8px)",
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: p,
        start: i === 0 ? "top 70%" : "top 80%",
      },
    });
  });

  /* --------------------------------------------------
   * Cards (Timeline + matchMedia)
   * -------------------------------------------------- */
  if (cards.length) {
    ScrollTrigger.matchMedia({
      "(max-width: 768px)": () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
          },
        });

        tl.from(cards, {
          y: 100,
          opacity: 0,
          rotate: i => (i % 2 === 0 ? 10 : -10),
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
        });

        return () => tl.kill();
      },

      "(min-width: 769px)": () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        });

        tl
          .from([cards[0], cards[2]], {
            y: 120,
            opacity: 0,
            rotate: i => (i === 0 ? 10 : -10),
            duration: 0.9,
            ease: "power3.out",
          })
          .from(
            cards[1],
            {
              y: 120,
              opacity: 0,
              rotate: 0,
              duration: 0.9,
              ease: "power3.out",
            },
            0.3
          );

        return () => tl.kill();
      },
    });
  }

  /* --------------------------------------------------
   * Separador
   * -------------------------------------------------- */
  separator &&
    gsap.from(separator, {
      y: 50,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: separator,
        start: "top 75%",
      },
    });

  /* --------------------------------------------------
   * Refresh optimizado
   * -------------------------------------------------- */
  setupSectionAnimationRefresh({
    specialSectionIds: ["services-separator"],
    includeResize: true,
    resizeDebounce: 250,
  });

  animateSeparatorAfterSection("#services", "#services-separator", {
    pollDelay: 150,
    timeout: 4000,
    finalDelay: 120,
  });
}
