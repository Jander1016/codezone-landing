import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateGridItems } from "./section-animations";
import { maskTextRevealVertical } from "./text-animations";
import { setupSectionAnimationRefresh } from "./animation-helpers";

gsap.registerPlugin(ScrollTrigger);

// // Configuración para evitar saltos en iOS
// ScrollTrigger.config({ ignoreMobileResize: true });
// ScrollTrigger.normalizeScroll({ allowNestedScroll: true });

export function animateServicesSection(): ScrollTrigger[] {
  const triggers: ScrollTrigger[] = [];
  const servicesSection = document.querySelector("#services");
  if (!servicesSection) return triggers;

  const logo = servicesSection.querySelector("img");
  const claim = servicesSection.querySelector("h2");
  const paragraphs = servicesSection.querySelectorAll(".paragraph-1, .paragraph-2");
  const gridContainer = servicesSection.querySelector(".services-grid");
  const separator = document.querySelector("#process-separator");

  const cards = Array.from(servicesSection.querySelectorAll(".service-card"));

  const isMobile = () => window.innerWidth <= 768;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: gridContainer,
      start: "top 80%",
    },
  });

  // Helpers de optimización
  const getBlur = () => (isMobile() ? "0px" : "10px");
  const getBlurText = () => (isMobile() ? "0px" : "8px");

  // 1. Logo
  if (logo) {
    const t = gsap.from(logo, {
      y: 60,
      opacity: 0,
      filter: `blur(${getBlur()})`,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: logo,
        start: "top 80%",
      },
    });
    if (t.scrollTrigger) triggers.push(t.scrollTrigger);
  }

  // 2. Claim
  if (claim) {
    const claimAnim = maskTextRevealVertical(claim, {
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: claim,
        start: "top 80%",
      },
    });
    // @ts-ignore
    if (claimAnim.scrollTrigger) triggers.push(claimAnim.scrollTrigger);
  }

  // 3. Párrafos
  paragraphs.forEach((p) => {
    const t = gsap.from(p, {
      y: 40,
      opacity: 0,
      filter: `blur(${getBlurText()})`,
      duration: 0.6,
      ease: "power4.out",
      scrollTrigger: {
        trigger: p,
        start: "top 85%",
      },
    });
    if (t.scrollTrigger) triggers.push(t.scrollTrigger);
  });

  // 4. Grid de tarjetas
  if (gridContainer) {
    if(isMobile()){
      animateGridItems(gridContainer, {
        itemsSelector: ".service-card",
        start: "top 80%",
      });
    }else{
       tl.addLabel("cardsStart", "-=0.1");

        const card1 = cards[0];
        const card2 = cards[1];
        const card3 = cards[2];

        if (card1) {
          tl.fromTo(
            card1,
            { y: 100, autoAlpha: 0, rotate: 6 },
            {
              y: 0,
              autoAlpha: 1,
              rotate: 0,
              duration: 1.0,
              ease: "power3.out",
            },
            "cardsStart",
          );
        }

        if (card3) {
          tl.fromTo(
            card3,
            { y: 100, autoAlpha: 0, rotate: -6 },
            {
              y: 0,
              autoAlpha: 1,
              rotate: 0,
              duration: 1.0,
              ease: "power3.out",
            },
            "cardsStart",
          );
        }

        if (card2) {
          tl.fromTo(
            card2,
            { y: 100, autoAlpha: 0, rotate: 0 },
            {
              y: 0,
              autoAlpha: 1,
              rotate: 0,
              duration: 1.0,
              ease: "power3.out",
            },
            "cardsStart+=0.2",
          );
        }
    }
  }

  // 5. Separador
  if (separator) {
    const t = gsap.from(separator, {
      y: 50,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: separator,
        start: "top 85%",
      },
    });
    if (t.scrollTrigger) triggers.push(t.scrollTrigger);
  }

  // Helpers de refresco
  setupSectionAnimationRefresh({
    specialSectionIds: ["services-separator"],
    specialDelay: 150,
    includeResize: true,
    resizeDebounce: 250,
  });

  return triggers;
}
