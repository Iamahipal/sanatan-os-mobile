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

    // === Deity Data (7 Deities) ===
    const DEITIES = {
        radha: {
            text_hi: 'श्री राधा',
            text_en: 'Shree Radha',
            color: '#ffd700'
        },
        krishna: {
            text_hi: 'श्री कृष्ण',
            text_en: 'Shree Krishna',
            color: '#00e5ff'
        },
        ram: {
            text_hi: 'श्री राम',
            text_en: 'Shree Ram',
            color: '#ff9800'
        },
        shiva: {
            text_hi: 'ॐ नमः शिवाय',
            text_en: 'Om Namah Shivaya',
            color: '#ffffff'
        },
        hanuman: {
            text_hi: 'ॐ हनुमते नमः',
            text_en: 'Om Hanumate Namah',
            color: '#ff5722'
        },
        ganesha: {
            text_hi: 'ॐ गं गणपतये नमः',
            text_en: 'Om Gan Ganapataye Namah',
            color: '#ffeb3b'
        },
        durga: {
            text_hi: 'जय माता दी',
            text_en: 'Jai Mata Di',
            color: '#e91e63'
        }
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
    const GRID_SLOTS = 20;

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

    // Grid slot tracking
    let gridSlots = [];
    let slotIndex = 0;
    let malaRotation = 0;

    // === Initialize ===
    loadState();
    initGridSlots();
    createMalaBeads();
    updateDisplay();
    updateSettingsUI();
    updateLevelBadge();
    checkStreak();

    // === Event Listeners ===
    canvas.addEventListener('click', handleTap);
    canvas.addEventListener('touchstart', handleTap, { passive: true });

    deitySelector.addEventListener('change', (e) => {
        state.currentDeity = e.target.value;
        updateDeityColor();
        saveState();
    });

    // Settings
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

    // Stats
    statsBtn.addEventListener('click', openStats);
    closeStats.addEventListener('click', () => statsModal.classList.remove('active'));
    statsModal.addEventListener('click', (e) => {
        if (e.target === statsModal) statsModal.classList.remove('active');
    });

    // === Grid Slot System ===
    function initGridSlots() {
        gridSlots = [];
        for (let i = 0; i < GRID_SLOTS; i++) {
            const slot = document.createElement('div');
            slot.className = 'grid-slot';
            slot.dataset.index = i;
            canvas.appendChild(slot);
            gridSlots.push({ element: slot, filled: false });
        }
        shuffleSlots();
    }

    function shuffleSlots() {
        // Fisher-Yates shuffle for random order
        for (let i = gridSlots.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gridSlots[i], gridSlots[j]] = [gridSlots[j], gridSlots[i]];
        }
        slotIndex = 0;
    }

    function getNextEmptySlot() {
        // Find next empty slot
        for (let i = 0; i < gridSlots.length; i++) {
            const idx = (slotIndex + i) % gridSlots.length;
            if (!gridSlots[idx].filled) {
                slotIndex = idx + 1;
                return gridSlots[idx];
            }
        }
        // All full - clear oldest and reshuffle
        clearOldestMantra();
        shuffleSlots();
        return gridSlots[0];
    }

    function clearOldestMantra() {
        const oldestSlot = gridSlots.find(s => s.filled);
        if (oldestSlot && oldestSlot.element.firstChild) {
            oldestSlot.element.firstChild.style.opacity = '0';
            setTimeout(() => {
                if (oldestSlot.element.firstChild) {
                    oldestSlot.element.firstChild.remove();
                }
                oldestSlot.filled = false;
            }, 200);
        }
    }

    // === Core Functions ===
    function handleTap(e) {
        e.preventDefault();

        state.beadCount++;
        state.totalLifetimeCount++;
        updateDailyStats();

        rotateMala();
        spawnMantraInSlot();
        playTapSound();

        if (navigator.vibrate) navigator.vibrate(8);

        if (state.beadCount >= TOTAL_BEADS) {
            completeMala();
        }

        updateDisplay();
        updateLevelBadge();
        saveState();
    }

    function spawnMantraInSlot() {
        const slot = getNextEmptySlot();
        const deity = DEITIES[state.currentDeity];
        const text = state.language === 'hi' ? deity.text_hi : deity.text_en;

        const el = document.createElement('div');
        el.className = 'floating-mantra';
        el.textContent = text;
        el.style.color = deity.color;

        slot.element.appendChild(el);
        slot.filled = true;

        // Remove after animation
        setTimeout(() => {
            if (el.parentNode) el.remove();
            slot.filled = false;
        }, 4000);
    }

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

        // Mala Complete celebration message
        completeCount.textContent = `(${state.malaCount})`;
        malaComplete.classList.add('active');
        setTimeout(() => malaComplete.classList.remove('active'), 2000);

        // Counter pulse
        malaCountEl.classList.add('pulse');
        setTimeout(() => malaCountEl.classList.remove('pulse'), 400);

        // Clear all mantras
        clearAllMantras();
    }

    function clearAllMantras() {
        gridSlots.forEach(slot => {
            if (slot.element.firstChild) {
                slot.element.firstChild.style.opacity = '0';
            }
        });
        setTimeout(() => {
            gridSlots.forEach(slot => {
                slot.element.innerHTML = '';
                slot.filled = false;
            });
            shuffleSlots();
        }, 300);
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

        if (state.lastActiveDate === todayStr) {
            return; // Already counted today
        }

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
