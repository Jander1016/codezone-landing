import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_BREAKPOINT = 1024;

let lenis: Lenis | null = null;

const isIOS = (): boolean =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform.startsWith("Mac") && navigator.maxTouchPoints > 1);

const isDesktop = (): boolean => window.innerWidth >= DESKTOP_BREAKPOINT;

const shouldUseSmoothScroll = (): boolean => isDesktop() && !isIOS();

function initLenis() {
    // if (lenis || !shouldUseSmoothScroll()) return;

    lenis = new Lenis({
        lerp: 0.06,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1.2,
        touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Disable CSS smooth scroll to avoid conflicts with Lenis
    document.documentElement.style.scrollBehavior = "auto";

    // Interceptar clicks en enlaces internos para usar Lenis smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href");
            if (href && href !== "#") {
                const target = document.querySelector(href);
                if (target && lenis) {
                    e.preventDefault();

                    const style = window.getComputedStyle(target);
                    const scrollMarginTop = parseInt(style.scrollMarginTop) || 0;

                    lenis.scrollTo(target as HTMLElement, { offset: -scrollMarginTop });
                }
            }
        });
    });

    ScrollTrigger.refresh();
}

function destroyLenis() {
    if (!lenis) return;

    lenis.destroy();
    lenis = null;

    // IMPORTANTE: No usamos ScrollTrigger.killAll() para mantener animaciones nativas en móvil
    // Removemos el ticker de gsap
    gsap.ticker.remove((time) => {
        lenis?.raf(time * 1000);
    });

    // Restore CSS smooth scroll
    document.documentElement.style.scrollBehavior = "";

    // Forzamos refresh para volver a comportamiento nativo
    ScrollTrigger.refresh();
}

function handleResize() {
    if (shouldUseSmoothScroll()) {
        if (!lenis) initLenis();
    } else {
        if (lenis) destroyLenis();
    }
}

export function initSmoothScroll() {
    handleResize(); // Check initial state
    window.addEventListener("resize", handleResize);
}
