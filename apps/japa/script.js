document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const canvas = document.getElementById('japa-canvas');
    const beadCountEl = document.getElementById('bead-count');
    const malaCountEl = document.getElementById('mala-count');
    const mantraSelector = document.getElementById('mantra-selector');
    const muteBtn = document.getElementById('mute-btn');
    const soundOnIcon = document.getElementById('sound-on');
    const soundOffIcon = document.getElementById('sound-off');
    const divineFlash = document.getElementById('divine-flash');
    const tapSound = document.getElementById('tap-sound');
    const bellSound = document.getElementById('bell-sound');

    // State
    const TOTAL_BEADS = 108;
    let state = {
        currentMantra: 'श्री राधा',
        beadCount: 0,
        malaCount: 0,
        isMuted: false,
        placedMantras: [] // Store {x, y, width, height} for collision detection
    };

    // Load state from localStorage
    loadState();
    updateDisplay();
    updateMuteUI();

    // Event Listeners
    canvas.addEventListener('click', handleTap);
    canvas.addEventListener('touchstart', handleTap, { passive: true });

    mantraSelector.addEventListener('change', (e) => {
        state.currentMantra = e.target.value;
        saveState();
    });

    muteBtn.addEventListener('click', toggleMute);

    // --- Core Functions ---

    function handleTap(e) {
        e.preventDefault();

        // Increment bead
        state.beadCount++;

        // Get tap position or random position
        let x, y;
        if (e.type === 'touchstart' && e.touches[0]) {
            const rect = canvas.getBoundingClientRect();
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else if (e.type === 'click') {
            const rect = canvas.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        // Create floating mantra near tap position (with some randomness)
        createFloatingMantra(x, y);

        // Play sound
        playTapSound();

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Check for mala completion
        if (state.beadCount >= TOTAL_BEADS) {
            completeMala();
        }

        updateDisplay();
        saveState();
    }

    function createFloatingMantra(tapX, tapY) {
        const canvasRect = canvas.getBoundingClientRect();
        const padding = 50;
        const fontSize = 18 + Math.random() * 14; // 18-32px

        // Estimate text dimensions
        const textWidth = state.currentMantra.length * fontSize * 0.6;
        const textHeight = fontSize * 1.2;

        // Try to find a non-overlapping position
        let x, y;
        let attempts = 0;
        const maxAttempts = 15;

        do {
            // Start from tap position with random offset
            if (tapX && tapY && attempts < 5) {
                x = tapX + (Math.random() - 0.5) * 100;
                y = tapY + (Math.random() - 0.5) * 100;
            } else {
                // Random position
                x = padding + Math.random() * (canvasRect.width - padding * 2 - textWidth);
                y = padding + Math.random() * (canvasRect.height - padding * 2 - textHeight);
            }

            // Clamp to canvas bounds
            x = Math.max(padding, Math.min(x, canvasRect.width - textWidth - padding));
            y = Math.max(padding, Math.min(y, canvasRect.height - textHeight - padding));

            attempts++;
        } while (isOverlapping(x, y, textWidth, textHeight) && attempts < maxAttempts);

        // If still overlapping after max attempts, scale down
        let finalFontSize = fontSize;
        if (attempts >= maxAttempts) {
            finalFontSize = fontSize * 0.7;
        }

        // Create element
        const mantraEl = document.createElement('div');
        mantraEl.className = 'floating-mantra';
        mantraEl.textContent = state.currentMantra;
        mantraEl.style.left = `${x}px`;
        mantraEl.style.top = `${y}px`;
        mantraEl.style.fontSize = `${finalFontSize}px`;

        // Random slight rotation for organic feel
        const rotation = (Math.random() - 0.5) * 10;
        mantraEl.style.transform = `rotate(${rotation}deg)`;

        canvas.appendChild(mantraEl);

        // Track for collision detection
        state.placedMantras.push({
            x,
            y,
            width: textWidth,
            height: textHeight,
            element: mantraEl
        });

        // Limit total mantras on screen to prevent performance issues
        if (state.placedMantras.length > 80) {
            const oldest = state.placedMantras.shift();
            if (oldest.element && oldest.element.parentNode) {
                oldest.element.style.animation = 'fadeOutMantra 0.3s forwards';
                setTimeout(() => oldest.element.remove(), 300);
            }
        }
    }

    function isOverlapping(x, y, width, height) {
        const buffer = 10; // Minimum gap between texts

        for (const placed of state.placedMantras) {
            const xOverlap = x < placed.x + placed.width + buffer && x + width + buffer > placed.x;
            const yOverlap = y < placed.y + placed.height + buffer && y + height + buffer > placed.y;

            if (xOverlap && yOverlap) {
                return true;
            }
        }
        return false;
    }

    function completeMala() {
        // Reset bead count
        state.beadCount = 0;
        state.malaCount++;

        // Play bell sound
        if (!state.isMuted && bellSound) {
            bellSound.currentTime = 0;
            bellSound.play().catch(e => console.log('Bell play failed', e));
        }

        // Haptic pattern
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }

        // Divine flash effect
        divineFlash.classList.add('active');
        setTimeout(() => divineFlash.classList.remove('active'), 800);

        // Pulse the mala counter
        malaCountEl.classList.add('pulse-celebration');
        setTimeout(() => malaCountEl.classList.remove('pulse-celebration'), 500);

        // Clear all floating mantras with animation
        clearAllMantras();
    }

    function clearAllMantras() {
        // Fade out all mantras
        state.placedMantras.forEach((item, index) => {
            if (item.element) {
                item.element.style.animation = 'fadeOutMantra 0.5s forwards';
                item.element.style.animationDelay = `${index * 0.02}s`;
            }
        });

        // Clear after animation
        setTimeout(() => {
            state.placedMantras.forEach(item => {
                if (item.element && item.element.parentNode) {
                    item.element.remove();
                }
            });
            state.placedMantras = [];
        }, 600);
    }

    function playTapSound() {
        if (!state.isMuted && tapSound) {
            // Clone for overlapping sounds
            const soundClone = tapSound.cloneNode();
            soundClone.volume = 0.3;
            soundClone.play().catch(() => { });
        }
    }

    function toggleMute() {
        state.isMuted = !state.isMuted;
        updateMuteUI();
        saveState();
    }

    function updateMuteUI() {
        if (state.isMuted) {
            soundOnIcon.classList.add('hidden');
            soundOffIcon.classList.remove('hidden');
        } else {
            soundOnIcon.classList.remove('hidden');
            soundOffIcon.classList.add('hidden');
        }
    }

    function updateDisplay() {
        beadCountEl.textContent = state.beadCount;
        malaCountEl.textContent = state.malaCount;
    }

    function loadState() {
        const stored = localStorage.getItem('naamjapa_state');
        if (stored) {
            const parsed = JSON.parse(stored);
            state.currentMantra = parsed.currentMantra || state.currentMantra;
            state.beadCount = parsed.beadCount || 0;
            state.malaCount = parsed.malaCount || 0;
            state.isMuted = parsed.isMuted || false;

            // Set selector to current mantra
            mantraSelector.value = state.currentMantra;
        }
    }

    function saveState() {
        localStorage.setItem('naamjapa_state', JSON.stringify({
            currentMantra: state.currentMantra,
            beadCount: state.beadCount,
            malaCount: state.malaCount,
            isMuted: state.isMuted
        }));
    }
});
