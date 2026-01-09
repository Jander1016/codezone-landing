import Lenis from "lenis";

const DESKTOP_BREAKPOINT = 1024;
let lenis: Lenis | null = null;

function isDesktop(): boolean {
    return window.innerWidth >= DESKTOP_BREAKPOINT;
}

function initLenis() {
    if (!isDesktop()) {
        return;
    }

    lenis = new Lenis({
        lerp: 0.03,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 2,
        touchMultiplier: 2,
    });

    function raf(time: number) {
        if (lenis) {
            lenis.raf(time);
        }
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

function destroyLenis() {
    if (lenis) {
        lenis.destroy();
        lenis = null;
    }
}

function handleResize() {
    const nowDesktop = isDesktop();
    const hasLenis = lenis !== null;

    if (nowDesktop && !hasLenis) {
        initLenis();
    } else if (!nowDesktop && hasLenis) {
        destroyLenis();
    }
}

// Initialize on load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initLenis();
        window.addEventListener("resize", handleResize);
    });
} else {
    initLenis();
    window.addEventListener("resize", handleResize);
}
