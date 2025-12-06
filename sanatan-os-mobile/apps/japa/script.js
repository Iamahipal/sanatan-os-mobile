document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mantraText = document.getElementById('mantra-text');
    const currentBeadDisplay = document.getElementById('current-bead');
    const todayMalasDisplay = document.getElementById('today-malas');
    const malaContainer = document.getElementById('mala-container');
    const japaArea = document.getElementById('japa-area');
    // const backBtn = document.getElementById('back-btn'); // Now an <a> tag, default behavior works

    // Check elements existence just in case
    const backBtn = document.getElementById('back-btn');

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

    // backBtn is now an anchor, no need for click listener unless preventing default?
    // If user asked for pointing to ../../index.html, href does that.
    // If it was a button, we'd need location.href.
    // I put <a href="../../index.html"> in HTML, so JS listener is not needed for nav.

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
                state.history[state.lastDate] = state.todayMalaCount;
            }

            // Reset Today
            state.todayMalaCount = 0;
            state.currentBead = 0;
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
        for (let i = 0; i < TOTAL_BEADS; i++) {
            const bead = document.createElement('div');
            bead.className = 'bead';

            // Angle math
            const angleDeg = (i * (360 / TOTAL_BEADS)) - 90;
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
        const anglePerBead = 360 / TOTAL_BEADS;
        const rotation = -(state.currentBead * anglePerBead);
        malaContainer.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    }

    function handleTap(e) {
        state.currentBead++;

        pulseMantra();
        rotateMala();

        if (state.currentBead >= TOTAL_BEADS) {
            completeMala();
        } else {
            updateDisplay();
            if (navigator.vibrate) navigator.vibrate(15);
        }

        saveState();
    }

    function completeMala() {
        state.currentBead = 0;
        state.todayMalaCount++;
        state.history[state.lastDate] = state.todayMalaCount;

        updateDisplay();
        rotateMala();

        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

        if (!state.isMuted && bellSound) {
            bellSound.currentTime = 0;
            bellSound.play().catch(e => console.log('Audio play failed', e));
        }

        triggerFlowerShower();
    }

    let visualRotationSteps = parseInt(localStorage.getItem('japa_visualSteps')) || 0;

    function handleTap_refined(e) {
        state.currentBead++;
        visualRotationSteps++;
        localStorage.setItem('japa_visualSteps', visualRotationSteps);

        pulseMantra();

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
            el.className = 'flower';
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
        const entries = Object.entries(state.history).map(([dateStr, count]) => {
            return { dateStr, count, time: Date.parse(dateStr) };
        });

        entries.sort((a, b) => b.time - a.time);
        const recent = entries.slice(0, 7);

        if (recent.length === 0) {
            historyList.innerHTML = '<li class="history-item" style="justify-content:center; opacity:0.5;">No history yet</li>';
            return;
        }

        recent.forEach(entry => {
            const li = document.createElement('li');
            li.className = 'history-item';

            const dateObj = new Date(entry.time);
            const dateFmt = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

            const isHigh = entry.count >= 10;
            const countClass = isHigh ? 'count gold-text' : 'count';

            li.innerHTML = `
                <span class="date">${dateFmt}</span>
                <span class="${countClass}">${entry.count} Malas</span>
            `;
            historyList.appendChild(li);
        });
    }
});
