import Lenis from "lenis";

let lenis: Lenis | null = null;
let animationFrameId: number | null = null;

function update(time: number) {
    lenis?.raf(time);
    animationFrameId = requestAnimationFrame(update);
}

function initLenis() {
    if (lenis) return;

    lenis = new Lenis({
        lerp: 0.06,
        smoothWheel: true,
        syncTouch: false, // Ensure touch sync is configured correctly for mobile
        wheelMultiplier: 1.2,
        touchMultiplier: 1.2,
    });

    // Iniciar el loop de animación nativo
    animationFrameId = requestAnimationFrame(update);

    // Disable CSS smooth scroll to avoid conflicts with Lenis
    document.documentElement.style.scrollBehavior = "auto";
}

export function getLenis(): Lenis | null {
    return lenis;
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

export function initSmoothScroll() {
    initLenis();
}
