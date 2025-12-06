document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const canvas = document.getElementById('japa-canvas');
    const beadCountEl = document.getElementById('bead-count');
    const malaCountEl = document.getElementById('mala-count');
    const deitySelector = document.getElementById('deity-selector');
    const levelText = document.getElementById('level-text');
    const levelBadge = document.getElementById('level-badge');
    const divineFlash = document.getElementById('divine-flash');
    const malaContainer = document.getElementById('mala-container');
    const malaComplete = document.getElementById('mala-complete');
    const completeCount = document.getElementById('complete-count');

    // Settings
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const langHi = document.getElementById('lang-hi');
    const langEn = document.getElementById('lang-en');
    const soundOnBtn = document.getElementById('sound-on-btn');
    const soundOffBtn = document.getElementById('sound-off-btn');
    const resetData = document.getElementById('reset-data');

    // Stats
    const statsBtn = document.getElementById('stats-btn');
    const statsModal = document.getElementById('stats-modal');
    const closeStats = document.getElementById('close-stats');
    const totalCountEl = document.getElementById('total-count');
    const streakCountEl = document.getElementById('streak-count');
    const chartContainer = document.getElementById('chart-container');

    // Audio
    const tapSound = document.getElementById('tap-sound');
    const bellSound = document.getElementById('bell-sound');

    // === Deity Data ===
    const DEITIES = {
        radha: { text_hi: 'श्री राधा', text_en: 'Shree Radha', color: '#ffd700' },
        krishna: { text_hi: 'श्री कृष्ण', text_en: 'Shree Krishna', color: '#00e5ff' },
        ram: { text_hi: 'श्री राम', text_en: 'Shree Ram', color: '#ff9800' },
        shiva: { text_hi: 'ॐ नमः शिवाय', text_en: 'Om Namah Shivaya', color: '#ffffff' },
        hanuman: { text_hi: 'ॐ हनुमते नमः', text_en: 'Om Hanumate Namah', color: '#ff5722' },
        ganesha: { text_hi: 'ॐ गं गणपतये नमः', text_en: 'Om Gan Ganapataye Namah', color: '#ffeb3b' },
        durga: { text_hi: 'जय माता दी', text_en: 'Jai Mata Di', color: '#e91e63' }
    };

    // === Levels ===
    const LEVELS = [
        { name: 'Aarambh', icon: '🙏', min: 0 },
        { name: 'Sadhak', icon: '🙇', min: 108 },
        { name: 'Bhakta', icon: '📿', min: 1008 },
        { name: 'Rakshak', icon: '🛡️', min: 10008 },
        { name: 'Siddha', icon: '✨', min: 100008 }
    ];

    // === Constants ===
    const TOTAL_BEADS = 108;
    const BEAD_COUNT = 54;
    const GRID_COLS = 4;
    const GRID_ROWS = 5;
    const TOTAL_SLOTS = GRID_COLS * GRID_ROWS;

    // === State ===
    let state = {
        currentDeity: 'radha',
        language: 'hi',
        beadCount: 0,
        malaCount: 0,
        totalLifetimeCount: 0,
        currentStreak: 0,
        dailyStats: {},
        lastActiveDate: null,
        isMuted: false
    };

    // === Invisible Grid System ===
    let availableSlots = [];
    let occupiedSlots = {}; // slotId -> { element, timeoutId }
    let malaRotation = 0;
    let lastTapTime = 0; // Debounce

    // === Initialize ===
    loadState();
    initGridSlots();
    createMalaBeads();
    updateDisplay();
    updateSettingsUI();
    updateLevelBadge();
    checkStreak();

    // === SINGLE Event Listener - pointerdown only (fixes double count) ===
    canvas.addEventListener('pointerdown', handleTap, { passive: false });

    deitySelector.addEventListener('change', (e) => {
        state.currentDeity = e.target.value;
        updateDeityColor();
        saveState();
    });

    // Settings Modal
    settingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    closeSettings.addEventListener('click', () => settingsModal.classList.remove('active'));
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.remove('active');
    });

    langHi.addEventListener('click', () => setLanguage('hi'));
    langEn.addEventListener('click', () => setLanguage('en'));
    soundOnBtn.addEventListener('click', () => setSound(false));
    soundOffBtn.addEventListener('click', () => setSound(true));
    resetData.addEventListener('click', resetAllData);

    // Stats Modal
    statsBtn.addEventListener('click', openStats);
    closeStats.addEventListener('click', () => statsModal.classList.remove('active'));
    statsModal.addEventListener('click', (e) => {
        if (e.target === statsModal) statsModal.classList.remove('active');
    });

    // === Invisible Grid System ===
    function initGridSlots() {
        availableSlots = [];
        for (let i = 0; i < TOTAL_SLOTS; i++) {
            availableSlots.push(i);
        }
        shuffleArray(availableSlots);
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    function getSlotPosition(slotId) {
        const row = Math.floor(slotId / GRID_COLS);
        const col = slotId % GRID_COLS;

        // Calculate percentage positions with padding
        const cellWidth = 100 / GRID_COLS;
        const cellHeight = 100 / GRID_ROWS;

        // Add some variation within the cell
        const offsetX = (Math.random() * 0.4 + 0.3) * cellWidth;
        const offsetY = (Math.random() * 0.4 + 0.3) * cellHeight;

        const left = col * cellWidth + offsetX;
        const top = row * cellHeight + offsetY;

        return { left: `${left}%`, top: `${top}%` };
    }

    // === Core Tap Handler with Debounce ===
    function handleTap(e) {
        e.preventDefault();

        // Debounce - prevent double taps (50ms threshold)
        const now = Date.now();
        if (now - lastTapTime < 50) return;
        lastTapTime = now;

        // Increment counts (exactly 1)
        state.beadCount++;
        state.totalLifetimeCount++;
        updateDailyStats();

        // Rotate mala
        rotateMala();

        // Spawn mantra in grid slot
        spawnMantraInSlot();

        // Sound & Haptics
        playTapSound();
        if (navigator.vibrate) navigator.vibrate(8);

        // Check mala completion
        if (state.beadCount >= TOTAL_BEADS) {
            completeMala();
        }

        updateDisplay();
        updateLevelBadge();
        saveState();
    }

    function spawnMantraInSlot() {
        // If no slots available, free the oldest one
        if (availableSlots.length === 0) {
            freeOldestSlot();
        }

        // Get next available slot
        const slotId = availableSlots.pop();
        const position = getSlotPosition(slotId);

        const deity = DEITIES[state.currentDeity];
        const text = state.language === 'hi' ? deity.text_hi : deity.text_en;

        // Create element
        const el = document.createElement('div');
        el.className = 'floating-mantra';
        el.textContent = text;
        el.style.color = deity.color;
        el.style.left = position.left;
        el.style.top = position.top;

        // Random slight size variation
        el.style.fontSize = `${16 + Math.random() * 6}px`;

        canvas.appendChild(el);

        // Track this slot and schedule freeing
        const timeoutId = setTimeout(() => {
            freeSlot(slotId, el);
        }, 3500);

        occupiedSlots[slotId] = { element: el, timeoutId };
    }

    function freeSlot(slotId, element) {
        if (element && element.parentNode) {
            element.remove();
        }
        delete occupiedSlots[slotId];
        availableSlots.push(slotId);
    }

    function freeOldestSlot() {
        // Find the first occupied slot
        const slotIds = Object.keys(occupiedSlots);
        if (slotIds.length > 0) {
            const oldestId = parseInt(slotIds[0]);
            const slot = occupiedSlots[oldestId];

            clearTimeout(slot.timeoutId);
            if (slot.element) {
                slot.element.style.opacity = '0';
                setTimeout(() => {
                    if (slot.element && slot.element.parentNode) {
                        slot.element.remove();
                    }
                }, 150);
            }
            delete occupiedSlots[oldestId];
            availableSlots.push(oldestId);
        }
    }

    // === Mala Functions ===
    function createMalaBeads() {
        malaContainer.innerHTML = '';
        const radius = 270;

        for (let i = 0; i < BEAD_COUNT; i++) {
            const bead = document.createElement('div');
            bead.className = 'bead';

            const angleDeg = (i * (360 / BEAD_COUNT)) - 90;
            const angleRad = angleDeg * (Math.PI / 180);

            const x = 300 + radius * Math.cos(angleRad) - 15;
            const y = 300 + radius * Math.sin(angleRad) - 15;

            bead.style.left = `${x}px`;
            bead.style.top = `${y}px`;

            malaContainer.appendChild(bead);
        }
    }

    function rotateMala() {
        malaRotation += (360 / TOTAL_BEADS);
        malaContainer.style.transform = `translateX(-50%) rotate(${malaRotation}deg)`;

        const beads = malaContainer.querySelectorAll('.bead');
        beads.forEach(b => b.classList.remove('active'));
        const activeIdx = state.beadCount % BEAD_COUNT;
        if (beads[activeIdx]) beads[activeIdx].classList.add('active');
    }

    function completeMala() {
        state.beadCount = 0;
        state.malaCount++;

        // Bell sound
        if (!state.isMuted && bellSound) {
            bellSound.currentTime = 0;
            bellSound.play().catch(() => { });
        }

        // Haptic
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

        // Divine flash
        divineFlash.classList.add('active');
        setTimeout(() => divineFlash.classList.remove('active'), 1200);

        // Mala Complete message
        completeCount.textContent = `(${state.malaCount})`;
        malaComplete.classList.add('active');
        setTimeout(() => malaComplete.classList.remove('active'), 2000);

        // Counter pulse
        malaCountEl.classList.add('pulse');
        setTimeout(() => malaCountEl.classList.remove('pulse'), 400);

        // Clear ALL mantras immediately
        clearAllMantras();
    }

    function clearAllMantras() {
        // Clear all timeouts and elements
        Object.keys(occupiedSlots).forEach(slotId => {
            const slot = occupiedSlots[slotId];
            clearTimeout(slot.timeoutId);
            if (slot.element) {
                slot.element.style.opacity = '0';
            }
        });

        setTimeout(() => {
            Object.keys(occupiedSlots).forEach(slotId => {
                const slot = occupiedSlots[slotId];
                if (slot.element && slot.element.parentNode) {
                    slot.element.remove();
                }
            });
            occupiedSlots = {};
            initGridSlots(); // Reset all slots
        }, 200);
    }

    function playTapSound() {
        if (!state.isMuted && tapSound) {
            const clone = tapSound.cloneNode();
            clone.volume = 0.15;
            clone.play().catch(() => { });
        }
    }

    // === Settings ===
    function setLanguage(lang) {
        state.language = lang;
        updateSettingsUI();
        updateDeitySelector();
        saveState();
    }

    function setSound(muted) {
        state.isMuted = muted;
        updateSettingsUI();
        saveState();
    }

    function updateSettingsUI() {
        langHi.classList.toggle('active', state.language === 'hi');
        langEn.classList.toggle('active', state.language === 'en');
        soundOnBtn.classList.toggle('active', !state.isMuted);
        soundOffBtn.classList.toggle('active', state.isMuted);
    }

    function updateDeitySelector() {
        const options = deitySelector.options;
        for (let opt of options) {
            const deity = DEITIES[opt.value];
            opt.textContent = state.language === 'hi' ? deity.text_hi : deity.text_en;
        }
    }

    function updateDeityColor() {
        const deity = DEITIES[state.currentDeity];
        document.documentElement.style.setProperty('--deity-color', deity.color);
    }

    function resetAllData() {
        if (confirm('Are you sure? This will delete all your Japa history.')) {
            localStorage.removeItem('naamjapa_premium');
            location.reload();
        }
    }

    // === Display ===
    function updateDisplay() {
        beadCountEl.textContent = state.beadCount;
        malaCountEl.textContent = state.malaCount;
        deitySelector.value = state.currentDeity;
        updateDeityColor();
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
        const todayStr = today.toISOString().split('T')[0];

        if (state.lastActiveDate === todayStr) return;

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (state.lastActiveDate === yesterdayStr && state.dailyStats[yesterdayStr] > 0) {
            state.currentStreak++;
        } else if (state.lastActiveDate !== todayStr) {
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

    function renderChart() {
        chartContainer.innerHTML = '';
        const days = getLast7Days();
        const maxCount = Math.max(...days.map(d => d.count), 1);

        days.forEach(day => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            const height = Math.max((day.count / maxCount) * 100, 4);

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

            result.push({
                date: dateStr,
                label: i === 0 ? 'Today' : dayNames[date.getDay()],
                count: state.dailyStats[dateStr] || 0
            });
        }
        return result;
    }

    // === Persistence ===
    function loadState() {
        const stored = localStorage.getItem('naamjapa_premium');
        if (stored) {
            const parsed = JSON.parse(stored);
            state = { ...state, ...parsed };
        }
        updateDeitySelector();
    }

    function saveState() {
        localStorage.setItem('naamjapa_premium', JSON.stringify(state));
    }
});
