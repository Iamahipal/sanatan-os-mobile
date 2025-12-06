/**
 * SANATAN OS - Windows Phone Animation System
 * Fast, smooth tile animations - no lag
 */

(function () {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        // Tile entrance animation
        entranceDelay: 30,       // ms between each tile (fast cascade)
        entranceDuration: 200,   // ms for each tile to animate in

        // Live tile flip
        liveFlipInterval: 5000,  // ms between flips

        // Tap feedback
        tapScale: 0.95,
        tapDuration: 100
    };

    // ============================================
    // TILE ENTRANCE ANIMATION (Windows Phone Style)
    // ============================================
    function animateTilesEntrance() {
        const tiles = document.querySelectorAll('.grid-container > *');

        // Set initial state (off-screen, invisible)
        tiles.forEach(tile => {
            tile.style.opacity = '0';
            tile.style.transform = 'translateY(30px) scale(0.9)';
        });

        // Animate each tile with staggered delay
        tiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.style.transition = `opacity ${CONFIG.entranceDuration}ms ease-out, transform ${CONFIG.entranceDuration}ms cubic-bezier(0.2, 0, 0.2, 1)`;
                tile.style.opacity = '1';
                tile.style.transform = 'translateY(0) scale(1)';
            }, index * CONFIG.entranceDelay);
        });
    }

    // ============================================
    // LIVE TILE FLIP (Gita AI)
    // ============================================
    function initLiveTile() {
        const liveTile = document.getElementById('gitaTile');
        if (!liveTile) return;

        setInterval(() => {
            liveTile.classList.toggle('flipped');
        }, CONFIG.liveFlipInterval);
    }

    // ============================================
    // TAP FEEDBACK (Quick press effect)
    // ============================================
    function initTapFeedback() {
        const tiles = document.querySelectorAll('.tile');

        tiles.forEach(tile => {
            // Touch events
            tile.addEventListener('touchstart', () => {
                tile.style.transition = `transform ${CONFIG.tapDuration}ms ease`;
                tile.style.transform = `scale(${CONFIG.tapScale})`;
            }, { passive: true });

            tile.addEventListener('touchend', () => {
                tile.style.transform = 'scale(1)';
            }, { passive: true });

            tile.addEventListener('touchcancel', () => {
                tile.style.transform = 'scale(1)';
            }, { passive: true });

            // Mouse events (for desktop)
            tile.addEventListener('mousedown', () => {
                tile.style.transition = `transform ${CONFIG.tapDuration}ms ease`;
                tile.style.transform = `scale(${CONFIG.tapScale})`;
            });

            tile.addEventListener('mouseup', () => {
                tile.style.transform = 'scale(1)';
            });

            tile.addEventListener('mouseleave', () => {
                tile.style.transform = 'scale(1)';
            });
        });
    }

    // ============================================
    // HAPTIC FEEDBACK (if available)
    // ============================================
    function hapticFeedback() {
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }

    // ============================================
    // INITIALIZE
    // ============================================
    function init() {
        // Wait for fonts and styles to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onReady);
        } else {
            onReady();
        }
    }

    function onReady() {
        // Small delay to ensure CSS is applied
        requestAnimationFrame(() => {
            animateTilesEntrance();
            initLiveTile();
            initTapFeedback();
        });
    }

    // Start
    init();

})();
