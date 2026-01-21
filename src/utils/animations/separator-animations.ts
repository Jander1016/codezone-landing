
import { gsap } from "gsap";

export function initSeparatorAnimation() {
    // Get all separator SVGs
    const separators = document.querySelectorAll(".separator-svg");

    separators.forEach((sep) => {
        // Buscar el turbulence dentro del SVG
        const turb = sep.querySelector('[id^="turbulence-"]');

        // Get animation parameters from data attributes
        const fadeDuration = parseFloat(
            sep.getAttribute("data-fade-duration") || "3.5",
        );
        const wormDuration = parseFloat(
            sep.getAttribute("data-worm-duration") || "1.5",
        );
        const loopInterval = parseFloat(
            sep.getAttribute("data-loop-interval") || "120",
        );

        if (!turb) {
            console.warn(`Turbulence element not found in separator`);
            // Fallback: just fade in without worm effect
            gsap.to(sep, {
                opacity: 1,
                duration: fadeDuration,
                ease: "power2.out",
            });
            return;
        }

        // Obtener el ID del wiggle filter
        const wiggleFilter = sep.querySelector('[id^="wiggle-"]');
        const wiggleId = wiggleFilter ? wiggleFilter.id : null;

        // Fade in animation
        gsap.to(sep, {
            opacity: 1,
            duration: fadeDuration,
            ease: "power2.out",
        });

        // Función para ejecutar el efecto worm
        function playWormEffect() {
            // Aplicar el filtro
            if (wiggleId) {
                gsap.set(sep, { filter: `url(#${wiggleId})` });
            }

            // Animar el seed para crear movimiento horizontal suave
            gsap.to(turb, {
                attr: { baseFrequency: 0.09 },
                duration: wormDuration,
                yoyo: true,
                repeat: 12,
                ease: "sine.inOut",
                onComplete: () => {
                    // Remover el filtro al finalizar
                    gsap.set(sep, { filter: "none" });
                    // Reset baseFrequency
                    gsap.set(turb, { attr: { baseFrequency: 0 } });
                },
            });
        }

        // Ejecutar el efecto inmediatamente después del fade-in
        gsap.delayedCall(fadeDuration, playWormEffect);

        // Configurar el bucle continuo
        gsap.delayedCall(fadeDuration + loopInterval, function loop() {
            playWormEffect();
            gsap.delayedCall(loopInterval, loop);
        });
    });
}
