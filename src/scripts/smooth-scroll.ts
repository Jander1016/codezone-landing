import Lenis from "lenis";

const DESKTOP_BREAKPOINT = 1024;

let lenis: Lenis | null = null;
let animationFrameId: number | null = null;

const isIOS = (): boolean =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform.startsWith("Mac") && navigator.maxTouchPoints > 1);

const isDesktop = (): boolean => window.innerWidth >= DESKTOP_BREAKPOINT;

const shouldUseSmoothScroll = (): boolean => isDesktop() && !isIOS();

function update(time: number) {
    lenis?.raf(time);
    animationFrameId = requestAnimationFrame(update);
}

function initLenis() {
    // if (lenis || !shouldUseSmoothScroll()) return;

    lenis = new Lenis({
        lerp: 0.06,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1.2,
        touchMultiplier: 1.2,
    });

    // Iniciar el loop de animación nativo
    animationFrameId = requestAnimationFrame(update);

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
}

function destroyLenis() {
    if (!lenis) return;

    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    lenis.destroy();
    lenis = null;

    // Restore CSS smooth scroll
    document.documentElement.style.scrollBehavior = "";
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
