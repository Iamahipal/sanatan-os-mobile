/**
 * SANATAN OS - Minimal JS
 * Animations handled by CSS for better performance
 */

(function () {
    'use strict';

    // Live Tile flip (Gita AI)
    function initLiveTile() {
        const liveTile = document.getElementById('gitaTile');
        if (!liveTile) return;

        setInterval(() => {
            liveTile.classList.toggle('flipped');
        }, 5000);
    }

    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLiveTile);
    } else {
        initLiveTile();
    }

})();
