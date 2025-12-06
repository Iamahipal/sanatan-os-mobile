document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mantraText = document.getElementById('mantra-text');
    const currentBeadDisplay = document.getElementById('current-bead');
    const todayMalasDisplay = document.getElementById('today-malas');
    const malaContainer = document.getElementById('mala-container');
    const japaArea = document.getElementById('japa-area');
    const backBtn = document.getElementById('back-btn');
    const resetBtn = document.getElementById('reset-btn'); // Still exists in HTML? Actually I removed it in index.html diff but let's check. 
    // Wait, I replaced header content. Did I keep reset-btn?
    // In my index.html replacement, I replaced the entire header block including reset-btn with header-controls?
    // Let's re-read index.html content briefly to be sure. 
    // Just to be safe, I'll assume I might have removed it or it's gone. The prompt didn't explicitly ask to keep 'Reset Counter' button, but it's good practice. 
    // Actually, the prompt says "Reset currentBead back to 0 automatically".
    // I will check for elements existence before adding listeners.

    const muteBtn = document.getElementById('mute-btn');
    const historyBtn = document.getElementById('history-btn');
    const historyDrawer = document.getElementById('history-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const historyList = document.getElementById('history-list');
    const flowerContainer = document.getElementById('flower-container');
    const bellSound = document.getElementById('bell-sound');
    const iconSoundOn = document.getElementById('icon-sound-on');
    const iconSoundOff = document.getElementById('icon-sound-off');

    // State
    const TOTAL_BEADS = 108;
    const BEAD_RADIUS = 400;

    let state = {
        currentBead: 0,
        todayMalaCount: 0,
        history: {}, // { 'YYYY-MM-DD': count }
        lastDate: new Date().toDateString(),
        isMuted: false
    };

    // Load State
    loadState();
    checkDailyReset();

    // Initialize Display
    updateDisplay();
    createMala();
    renderHistory();
    updateMuteUI();

    // Event Listeners
    japaArea.addEventListener('click', handleTap);
    backBtn.addEventListener('click', () => window.history.back());

    if (muteBtn) {
        muteBtn.addEventListener('click', toggleMute);
    }

    if (historyBtn) {
        historyBtn.addEventListener('click', () => {
            renderHistory();
            historyDrawer.classList.add('open');
        });
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => {
            historyDrawer.classList.remove('open');
        });
    }

    // Functions

    function loadState() {
        const stored = localStorage.getItem('japa_state');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge with default to handle schema updates
            state = { ...state, ...parsed };
        }
    }

    function saveState() {
        localStorage.setItem('japa_state', JSON.stringify(state));
    }

    function checkDailyReset() {
        const today = new Date().toDateString();

        if (state.lastDate !== today) {
            // It's a new day!
            // Save yesterday's count if > 0
            if (state.todayMalaCount > 0) {
                // Convert lastDate to friendly format or keep as key?
                // Use ISO date key for sorting: YYYY-MM-DD
                // But lastDate is "Fri Dec 06 2025".
                // Let's rely on the fact that logic runs on load.
                // We'll trust lastDate string for simplicity or parse it.
                // Better: Use lastDate as the key for history content.
                state.history[state.lastDate] = state.todayMalaCount;
            }

            // Reset Today
            state.todayMalaCount = 0;
            state.currentBead = 0; // Optional: Reset bead too? Yes, fresh start.
            state.lastDate = today;
            saveState();
            updateDisplay();
        }
    }

    function updateDisplay() {
        currentBeadDisplay.textContent = state.currentBead;
        if (todayMalasDisplay) {
            todayMalasDisplay.textContent = state.todayMalaCount;
        }
    }

    function createMala() {
        malaContainer.innerHTML = '';
        // Create 108 beads (or fewer visual ones, but prompt asked for 108 div generation earlier, let's stick to 108 for accuracy)
        for (let i = 0; i < TOTAL_BEADS; i++) {
            const bead = document.createElement('div');
            bead.className = 'bead';

            // Angle math
            const angleDeg = (i * (360 / TOTAL_BEADS)) - 90; // Start at top/bottom? -90 is top. 
            // Wait, we want active one at bottom?
            // "positioned so the bottom half curves..."
            // Let's assume standard circle. Rotation handles position.
            const angleRad = angleDeg * (Math.PI / 180);

            const x = 400 + BEAD_RADIUS * Math.cos(angleRad) - 20;
            const y = 400 + BEAD_RADIUS * Math.sin(angleRad) - 20;

            bead.style.left = `${x}px`;
            bead.style.top = `${y}px`;

            malaContainer.appendChild(bead);
        }
        rotateMala();
    }

    function rotateMala() {
        // Rotate such that current bead is at the bottom?
        // Or simply rotate forward.
        // Prompt: "Rotate ... so the next bead slides into the 'active' position"
        const anglePerBead = 360 / TOTAL_BEADS;
        const rotation = -(state.currentBead * anglePerBead);
        malaContainer.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    }

    function handleTap(e) {
        // Increment
        state.currentBead++;

        // Visuals
        pulseMantra();
        rotateMala();

        // Logic check
        if (state.currentBead >= TOTAL_BEADS) {
            completeMala();
        } else {
            // Normal Step
            updateDisplay();

            // Haptic (Short)
            if (navigator.vibrate) navigator.vibrate(15);

            // Sound (Tick? Optional, prompt only asked for Bell at end. But maybe quiet tick?)
            // We'll stick to silence for beads unless requested.
        }

        saveState();
    }

    function completeMala() {
        // Reset Logic
        state.currentBead = 0;
        state.todayMalaCount++;

        // Update DB immediately
        state.history[state.lastDate] = state.todayMalaCount; // Keep updating today's history entry potentially? 
        // Or just save 'todayMalaCount' in state, and push to history only on reset?
        // Plan said: "Daily Reset... keep yesterday's data".
        // Use history for PAST days. Today is state.todayMalaCount.

        updateDisplay();
        rotateMala(); // Reset rotation to 0 visually or keep spinning? 
        // logic: rotation = -(currentBead * angle). currentBead is 0, so rotation becomes 0.
        // This might cause a "snap back" visual.
        // To make it smooth infinite: we should likely track 'totalTaps' for rotation, not reset 'currentBead' for rotation.
        // Refinement: use a separate rotation counter.

        // Haptic (Long)
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

        // Sound
        if (!state.isMuted && bellSound) {
            bellSound.currentTime = 0;
            bellSound.play().catch(e => console.log('Audio play failed', e));
        }

        // Celebration
        triggerFlowerShower();
    }

    // Better Rotation Logic:
    // We want the ring to keep turning, not snap back.
    // So let's base rotation on total lifetime taps or a separate counter that doesn't reset.
    // However, beads are identical. Snapping back to 0 might look fine if it matches 360deg.
    // 360 deg is 1 full circle. 0 is same as 360.
    // So snapping from 107 -> 108(==0) should be smooth if code handles it.
    // currentBead 107 -> rotation X. 
    // Tap -> current becomes 108. (which is 0).
    // If we set state.currentBead = 0 immediately, rotation becomes 0.
    // from 356deg to 0deg is a visual jump unless we use 360.
    // Workaround: We can disable transition, jump to 0 (which is 0), then enable transition?
    // Or just let it snap?
    // Ideally, for infinite feel: `rotation` variable accumulates forever.
    let visualRotationSteps = parseInt(localStorage.getItem('japa_visualSteps')) || 0;

    // Override handleTap logic to use visual steps
    function handleTap_refined(e) {
        state.currentBead++;
        visualRotationSteps++;
        localStorage.setItem('japa_visualSteps', visualRotationSteps);

        pulseMantra();

        // Update Rotation using visual steps (always increasing)
        const anglePerBead = 360 / TOTAL_BEADS;
        const rotation = -(visualRotationSteps * anglePerBead);
        malaContainer.style.transform = `translateX(-50%) rotate(${rotation}deg)`;

        if (state.currentBead >= TOTAL_BEADS) {
            completeMala();
        } else {
            updateDisplay();
            if (navigator.vibrate) navigator.vibrate(15);
        }
        saveState();
    }

    // Replace the listener
    japaArea.removeEventListener('click', handleTap);
    japaArea.addEventListener('click', handleTap_refined);

    function pulseMantra() {
        mantraText.classList.remove('pulse-anim');
        void mantraText.offsetWidth;
        mantraText.classList.add('pulse-anim');
    }

    function toggleMute() {
        state.isMuted = !state.isMuted;
        updateMuteUI();
        saveState();
    }

    function updateMuteUI() {
        if (state.isMuted) {
            iconSoundOn.classList.add('hidden');
            iconSoundOff.classList.remove('hidden');
        } else {
            iconSoundOn.classList.remove('hidden');
            iconSoundOff.classList.add('hidden');
        }
    }

    function triggerFlowerShower() {
        const particles = ['✨', '🌸', '🌼', '📿', '🕉️'];
        for (let i = 0; i < 30; i++) {
            const el = document.createElement('div');
            el.className = 'flower'; // Reuse existing class
            el.textContent = particles[Math.floor(Math.random() * particles.length)];
            el.style.left = Math.random() * 100 + 'vw';
            el.style.animationDuration = (Math.random() * 2 + 2) + 's';
            el.style.fontSize = (Math.random() * 20 + 20) + 'px';
            flowerContainer.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        }
    }

    function renderHistory() {
        historyList.innerHTML = '';

        // Convert history object to array, sort by date desc
        // History keys are strings "Fri Dec 06 2025" or similar. Date.parse works.
        const entries = Object.entries(state.history).map(([dateStr, count]) => {
            return { dateStr, count, time: Date.parse(dateStr) };
        });

        // Add "Yesterday" if not in history explicitly but relevant?
        // No, just show what we have.

        entries.sort((a, b) => b.time - a.time);

        // Take last 7
        const recent = entries.slice(0, 7);

        if (recent.length === 0) {
            historyList.innerHTML = '<li class="history-item" style="justify-content:center; opacity:0.5;">No history yet</li>';
            return;
        }

        recent.forEach(entry => {
            const li = document.createElement('li');
            li.className = 'history-item';

            // Format Date: "Mon, Oct 27"
            const dateObj = new Date(entry.time);
            const dateFmt = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

            const isHigh = entry.count >= 10; // Highlight arbitrary "High" number
            const countClass = isHigh ? 'count gold-text' : 'count';

            li.innerHTML = `
                <span class="date">${dateFmt}</span>
                <span class="${countClass}">${entry.count} Malas</span>
            `;
            historyList.appendChild(li);
        });
    }
});
