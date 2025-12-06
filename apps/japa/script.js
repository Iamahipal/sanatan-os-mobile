document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const canvas = document.getElementById('japa-canvas');
    const beadCountEl = document.getElementById('bead-count');
    const malaCountEl = document.getElementById('mala-count');
    const mantraSelector = document.getElementById('mantra-selector');
    const muteBtn = document.getElementById('mute-btn');
    const soundOnIcon = document.getElementById('sound-on');
    const soundOffIcon = document.getElementById('sound-off');
    const divineFlash = document.getElementById('divine-flash');
    const malaContainer = document.getElementById('mala-container');
    const levelBadge = document.getElementById('level-badge');
    const levelText = document.getElementById('level-text');
    const statsBtn = document.getElementById('stats-btn');
    const statsModal = document.getElementById('stats-modal');
    const closeStats = document.getElementById('close-stats');
    const totalCountEl = document.getElementById('total-count');
    const streakCountEl = document.getElementById('streak-count');
    const chartContainer = document.getElementById('chart-container');
    const tapSound = document.getElementById('tap-sound');
    const bellSound = document.getElementById('bell-sound');

    // === Mantra Data ===
    const MANTRAS = {
        radha: { text_hi: 'श्री राधा', text_en: 'Shree Radha', color: '#ffeb3b' },
        krishna: { text_hi: 'श्री कृष्ण', text_en: 'Shree Krishna', color: '#00e5ff' },
        ram: { text_hi: 'श्री राम', text_en: 'Shree Ram', color: '#ff9800' },
        shiva: { text_hi: 'ॐ नमः शिवाय', text_en: 'Om Namah Shivaya', color: '#ffffff' },
        hanuman: { text_hi: 'ॐ हनुमते नमः', text_en: 'Om Hanumate Namah', color: '#ff5722' }
    };

    // === Levels ===
    const LEVELS = [
        { name: 'Sadhak', icon: '🙏', min: 0 },
        { name: 'Bhakta', icon: '🙇', min: 1000 },
        { name: 'Yogi', icon: '🧘', min: 10000 },
        { name: 'Siddha', icon: '✨', min: 100000 }
    ];

    // === Constants ===
    const TOTAL_BEADS = 108;
    const BEAD_COUNT = 54; // Visual beads on ring
    const COLLISION_DISTANCE = 60;
    const MAX_PLACEMENT_ATTEMPTS = 12;

    // === State ===
    let state = {
        currentMantra: 'radha',
        beadCount: 0,
        malaCount: 0,
        totalLifetimeCount: 0,
        currentStreak: 0,
        dailyStats: {},
        lastActiveDate: null,
        isMuted: false
    };

    // Track floating elements for collision
    let floatingElements = [];
    let malaRotation = 0;

    // === Initialize ===
    loadState();
    createMalaBeads();
    updateDisplay();
    updateMuteUI();
    updateLevelBadge();
    checkStreak();

    // === Event Listeners ===
    canvas.addEventListener('click', handleTap);
    canvas.addEventListener('touchstart', handleTap, { passive: true });

    mantraSelector.addEventListener('change', (e) => {
        state.currentMantra = e.target.value;
        saveState();
    });

    muteBtn.addEventListener('click', toggleMute);
    statsBtn.addEventListener('click', openStats);
    closeStats.addEventListener('click', closeStatsModal);
    statsModal.addEventListener('click', (e) => {
        if (e.target === statsModal) closeStatsModal();
    });

    // === Core Functions ===

    function handleTap(e) {
        e.preventDefault();

        // Increment counts
        state.beadCount++;
        state.totalLifetimeCount++;
        updateDailyStats();

        // Rotate mala
        rotateMala();

        // Try to place floating mantra
        placeFloatingMantra();

        // Sound & Haptics
        playTapSound();
        if (navigator.vibrate) navigator.vibrate(8);

        // Check for mala completion
        if (state.beadCount >= TOTAL_BEADS) {
            completeMala();
        }

        updateDisplay();
        updateLevelBadge();
        saveState();
    }

    function placeFloatingMantra() {
        const rect = canvas.getBoundingClientRect();
        const padding = 60;
        const mantra = MANTRAS[state.currentMantra];

        // Estimate text size
        const textWidth = mantra.text_hi.length * 14;
        const textHeight = 30;

        let x, y;
        let placed = false;

        // Try to find non-overlapping position
        for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt++) {
            x = padding + Math.random() * (rect.width - padding * 2 - textWidth);
            y = padding + Math.random() * (rect.height - padding * 2 - textHeight);

            if (!isColliding(x, y, textWidth, textHeight)) {
                placed = true;
                break;
            }
        }

        // If no space found, skip spawning (prevents mess)
        if (!placed) return;

        // Create element
        const el = document.createElement('div');
        el.className = 'floating-mantra';
        el.textContent = mantra.text_hi;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.color = mantra.color;
        el.style.fontSize = `${18 + Math.random() * 8}px`;

        canvas.appendChild(el);

        // Track for collision
        const tracking = { x, y, width: textWidth, height: textHeight, el };
        floatingElements.push(tracking);

        // Remove after animation
        setTimeout(() => {
            el.remove();
            const idx = floatingElements.indexOf(tracking);
            if (idx > -1) floatingElements.splice(idx, 1);
        }, 3000);
    }

    function isColliding(x, y, width, height) {
        const buffer = COLLISION_DISTANCE;

        for (const item of floatingElements) {
            const xOverlap = x < item.x + item.width + buffer && x + width + buffer > item.x;
            const yOverlap = y < item.y + item.height + buffer && y + height + buffer > item.y;

            if (xOverlap && yOverlap) return true;
        }
        return false;
    }

    function createMalaBeads() {
        malaContainer.innerHTML = '';
        const radius = 270;

        for (let i = 0; i < BEAD_COUNT; i++) {
            const bead = document.createElement('div');
            bead.className = 'bead';

            const angleDeg = (i * (360 / BEAD_COUNT)) - 90;
            const angleRad = angleDeg * (Math.PI / 180);

            const x = 300 + radius * Math.cos(angleRad) - 14;
            const y = 300 + radius * Math.sin(angleRad) - 14;

            bead.style.left = `${x}px`;
            bead.style.top = `${y}px`;

            malaContainer.appendChild(bead);
        }
    }

    function rotateMala() {
        malaRotation += (360 / TOTAL_BEADS);
        malaContainer.style.transform = `translateX(-50%) rotate(${malaRotation}deg)`;

        // Highlight active bead
        const beads = malaContainer.querySelectorAll('.bead');
        beads.forEach((b, i) => b.classList.remove('active'));
        const activeIdx = state.beadCount % BEAD_COUNT;
        if (beads[activeIdx]) beads[activeIdx].classList.add('active');
    }

    function completeMala() {
        state.beadCount = 0;
        state.malaCount++;

        // Sound
        if (!state.isMuted && bellSound) {
            bellSound.currentTime = 0;
            bellSound.play().catch(() => { });
        }

        // Haptic pattern
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 150]);

        // Divine flash
        divineFlash.classList.add('active');
        setTimeout(() => divineFlash.classList.remove('active'), 1000);

        // Pulse counter
        malaCountEl.classList.add('pulse');
        setTimeout(() => malaCountEl.classList.remove('pulse'), 400);

        // Clear all floating mantras
        floatingElements.forEach(item => {
            if (item.el) item.el.style.opacity = '0';
        });
        setTimeout(() => {
            floatingElements.forEach(item => {
                if (item.el && item.el.parentNode) item.el.remove();
            });
            floatingElements = [];
        }, 300);
    }

    function playTapSound() {
        if (!state.isMuted && tapSound) {
            const clone = tapSound.cloneNode();
            clone.volume = 0.2;
            clone.play().catch(() => { });
        }
    }

    function toggleMute() {
        state.isMuted = !state.isMuted;
        updateMuteUI();
        saveState();
    }

    function updateMuteUI() {
        soundOnIcon.classList.toggle('hidden', state.isMuted);
        soundOffIcon.classList.toggle('hidden', !state.isMuted);
    }

    function updateDisplay() {
        beadCountEl.textContent = state.beadCount;
        malaCountEl.textContent = state.malaCount;
        mantraSelector.value = state.currentMantra;
    }

    function updateLevelBadge() {
        let currentLevel = LEVELS[0];
        for (const level of LEVELS) {
            if (state.totalLifetimeCount >= level.min) {
                currentLevel = level;
            }
        }
        levelText.textContent = currentLevel.name;
        levelBadge.querySelector('.level-icon').textContent = currentLevel.icon;
    }

    function updateDailyStats() {
        const today = new Date().toISOString().split('T')[0];
        if (!state.dailyStats[today]) {
            state.dailyStats[today] = 0;
        }
        state.dailyStats[today]++;
        state.lastActiveDate = today;
    }

    function checkStreak() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];

        if (state.lastActiveDate === todayStr) {
            // Already active today, streak continues
        } else if (state.lastActiveDate === yesterdayStr) {
            // Active yesterday, streak continues
            state.currentStreak++;
        } else if (state.lastActiveDate !== todayStr) {
            // Streak broken
            state.currentStreak = 0;
        }
    }

    // === Stats Modal ===
    function openStats() {
        totalCountEl.textContent = state.totalLifetimeCount.toLocaleString();
        streakCountEl.textContent = state.currentStreak;
        renderChart();
        statsModal.classList.add('active');
    }

    function closeStatsModal() {
        statsModal.classList.remove('active');
    }

    function renderChart() {
        chartContainer.innerHTML = '';
        const days = getLast7Days();
        const maxCount = Math.max(...days.map(d => d.count), 1);

        days.forEach(day => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';

            const height = (day.count / maxCount) * 100;

            bar.innerHTML = `
                <span class="bar-value">${day.count}</span>
                <div class="bar" style="height: ${height}px;"></div>
                <span class="bar-label">${day.label}</span>
            `;
            chartContainer.appendChild(bar);
        });
    }

    function getLast7Days() {
        const result = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = dayNames[date.getDay()];

            result.push({
                date: dateStr,
                label: i === 0 ? 'Today' : dayName,
                count: state.dailyStats[dateStr] || 0
            });
        }
        return result;
    }

    // === Persistence ===
    function loadState() {
        const stored = localStorage.getItem('naamjapa_ultimate');
        if (stored) {
            const parsed = JSON.parse(stored);
            state = { ...state, ...parsed };
        }
    }

    function saveState() {
        localStorage.setItem('naamjapa_ultimate', JSON.stringify(state));
    }
});
