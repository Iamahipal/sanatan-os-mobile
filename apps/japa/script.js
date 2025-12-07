document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const canvas = document.getElementById('japa-canvas');
    const beadCountEl = document.getElementById('bead-count');
    const malaCountEl = document.getElementById('mala-count');
    const levelText = document.getElementById('level-text');
    const levelBadge = document.getElementById('level-badge');
    const divineFlash = document.getElementById('divine-flash');
    const malaContainer = document.getElementById('mala-container');
    const malaComplete = document.getElementById('mala-complete');
    const completeCount = document.getElementById('complete-count');

    // Name Selector
    const nameSelectorBtn = document.getElementById('name-selector-btn');
    const selectedNameEl = document.getElementById('selected-name');
    const nameModal = document.getElementById('name-modal');
    const nameOptions = document.querySelectorAll('.name-option');

    // Settings
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Language
    const langHi = document.getElementById('lang-hi');
    const langEn = document.getElementById('lang-en');

    // Sound
    const soundOnBtn = document.getElementById('sound-on-btn');
    const soundOffBtn = document.getElementById('sound-off-btn');
    const soundOptions = document.querySelectorAll('.sound-option');

    // Stats
    const totalCountEl = document.getElementById('total-count');
    const streakCountEl = document.getElementById('streak-count');
    const chartContainer = document.getElementById('chart-container');

    // Reset
    const resetData = document.getElementById('reset-data');

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.close;
            document.getElementById(modalId).classList.remove('active');
        });
    });

    // Audio
    const sounds = {
        bell: document.getElementById('bell-sound'),
        conch: document.getElementById('conch-sound'),
        bowl: document.getElementById('bowl-sound'),
        chime: document.getElementById('chime-sound')
    };

    // === Deity Data (7 deities = 7 themes) ===
    const DEITIES = {
        radha: { text_hi: 'श्री राधा', text_en: 'Shree Radha', color: '#ff69b4' },
        krishna: { text_hi: 'श्री कृष्ण', text_en: 'Shree Krishna', color: '#ffd700' },
        ram: { text_hi: 'श्री राम', text_en: 'Shree Ram', color: '#ff9800' },
        shiva: { text_hi: 'ॐ नमः शिवाय', text_en: 'Om Namah Shivaya', color: '#e0e0e0' },
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
        isMuted: false,
        soundType: 'bell'
    };

    let availableSlots = [];
    let occupiedSlots = {};
    let malaRotation = 0;
    let lastTapTime = 0;

    // === Initialize ===
    loadState();
    initGridSlots();
    createMalaBeads();
    updateDisplay();
    updateUI();
    updateLevelBadge();
    checkStreak();
    applyTheme(state.currentDeity); // Theme = Deity

    // === Event Listeners ===
    canvas.addEventListener('pointerdown', handleTap, { passive: false });

    // Name selector
    nameSelectorBtn.addEventListener('click', () => nameModal.classList.add('active'));
    nameModal.addEventListener('click', (e) => {
        if (e.target === nameModal) nameModal.classList.remove('active');
    });

    nameOptions.forEach(option => {
        option.addEventListener('click', () => {
            const deity = option.dataset.deity;
            state.currentDeity = deity;
            applyTheme(deity); // Auto-switch theme
            updateSelectedName();
            updateUI();
            saveState();
            nameModal.classList.remove('active');
        });
    });

    // Settings
    settingsBtn.addEventListener('click', () => {
        updateStats();
        renderChart();
        settingsModal.classList.add('active');
    });
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.remove('active');
    });

    // Accordion
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.dataset.section;
            const content = document.getElementById(`${section}-content`);
            const isOpen = !content.classList.contains('collapsed');

            document.querySelectorAll('.accordion-content').forEach(c => c.classList.add('collapsed'));
            document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));

            if (!isOpen) {
                content.classList.remove('collapsed');
                header.classList.add('open');
            }
        });
    });

    // Language
    langHi.addEventListener('click', () => setLanguage('hi'));
    langEn.addEventListener('click', () => setLanguage('en'));

    // Sound
    soundOnBtn.addEventListener('click', () => setSound(false));
    soundOffBtn.addEventListener('click', () => setSound(true));
    soundOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            state.soundType = opt.dataset.sound;
            updateSoundUI();
            saveState();
        });
    });

    // Reset
    resetData.addEventListener('click', resetAllData);

    // === Grid System ===
    function initGridSlots() {
        availableSlots = [];
        for (let i = 0; i < TOTAL_SLOTS; i++) availableSlots.push(i);
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
        const cellWidth = 100 / GRID_COLS;
        const cellHeight = 100 / GRID_ROWS;

        // Add padding to keep text inside screen (5% from edges)
        const paddingX = 8;
        const paddingY = 5;
        const offsetX = paddingX + (Math.random() * 0.3 + 0.2) * (cellWidth - paddingX * 2);
        const offsetY = paddingY + (Math.random() * 0.3 + 0.2) * (cellHeight - paddingY * 2);

        const left = Math.min(Math.max(col * cellWidth + offsetX, 5), 85); // Clamp 5-85%
        const top = Math.min(Math.max(row * cellHeight + offsetY, 3), 90); // Clamp 3-90%

        return { left: `${left}%`, top: `${top}%` };
    }

    // === Core Tap Handler ===
    function handleTap(e) {
        e.preventDefault();

        const now = Date.now();
        if (now - lastTapTime < 50) return;
        lastTapTime = now;

        state.beadCount++;
        state.totalLifetimeCount++;
        updateDailyStats();

        rotateMala();
        spawnMantraInSlot();

        if (navigator.vibrate) navigator.vibrate(8);

        if (state.beadCount >= TOTAL_BEADS) {
            completeMala();
        }

        updateDisplay();
        updateLevelBadge();
        saveState();
    }

    function spawnMantraInSlot() {
        if (availableSlots.length === 0) freeOldestSlot();

        const slotId = availableSlots.pop();
        const position = getSlotPosition(slotId);

        const deity = DEITIES[state.currentDeity];
        const text = state.language === 'hi' ? deity.text_hi : deity.text_en;

        const el = document.createElement('div');
        el.className = 'floating-mantra';
        el.textContent = text;
        el.style.left = position.left;
        el.style.top = position.top;

        canvas.appendChild(el);

        const timeoutId = setTimeout(() => freeSlot(slotId, el), 3500);
        occupiedSlots[slotId] = { element: el, timeoutId };
    }

    function freeSlot(slotId, element) {
        if (element?.parentNode) element.remove();
        delete occupiedSlots[slotId];
        availableSlots.push(slotId);
    }

    function freeOldestSlot() {
        const slotIds = Object.keys(occupiedSlots);
        if (slotIds.length > 0) {
            const oldestId = parseInt(slotIds[0]);
            const slot = occupiedSlots[oldestId];
            clearTimeout(slot.timeoutId);
            if (slot.element) {
                slot.element.style.opacity = '0';
                setTimeout(() => slot.element?.remove(), 150);
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
            bead.style.left = `${300 + radius * Math.cos(angleRad) - 15}px`;
            bead.style.top = `${300 + radius * Math.sin(angleRad) - 15}px`;
            malaContainer.appendChild(bead);
        }
    }

    function rotateMala() {
        malaRotation += (360 / TOTAL_BEADS);
        malaContainer.style.transform = `translateX(-50%) rotate(${malaRotation}deg)`;
        malaContainer.querySelectorAll('.bead').forEach(b => b.classList.remove('complete-bead'));
    }

    function completeMala() {
        state.beadCount = 0;
        state.malaCount++;

        if (!state.isMuted && sounds[state.soundType]) {
            sounds[state.soundType].currentTime = 0;
            sounds[state.soundType].play().catch(() => { });
        }

        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

        const beads = malaContainer.querySelectorAll('.bead');
        if (beads[0]) {
            beads[0].classList.add('complete-bead');
            setTimeout(() => beads[0].classList.remove('complete-bead'), 1000);
        }

        divineFlash.classList.add('active');
        setTimeout(() => divineFlash.classList.remove('active'), 1000);

        completeCount.textContent = `(${state.malaCount})`;
        malaComplete.classList.add('active');
        setTimeout(() => malaComplete.classList.remove('active'), 2000);

        malaCountEl.classList.add('pulse');
        setTimeout(() => malaCountEl.classList.remove('pulse'), 400);

        clearAllMantras();
    }

    function clearAllMantras() {
        Object.keys(occupiedSlots).forEach(slotId => {
            clearTimeout(occupiedSlots[slotId].timeoutId);
            if (occupiedSlots[slotId].element) occupiedSlots[slotId].element.style.opacity = '0';
        });
        setTimeout(() => {
            Object.values(occupiedSlots).forEach(s => s.element?.remove());
            occupiedSlots = {};
            initGridSlots();
        }, 200);
    }

    // === Settings ===
    function setLanguage(lang) {
        state.language = lang;
        updateUI();
        updateSelectedName();
        saveState();
    }

    function setSound(muted) {
        state.isMuted = muted;
        updateUI();
        saveState();
    }

    function applyTheme(deity) {
        document.body.dataset.theme = deity;
    }

    function updateUI() {
        langHi.classList.toggle('active', state.language === 'hi');
        langEn.classList.toggle('active', state.language === 'en');
        soundOnBtn.classList.toggle('active', !state.isMuted);
        soundOffBtn.classList.toggle('active', state.isMuted);
        updateSoundUI();

        // Update name options
        nameOptions.forEach(opt => {
            const deity = opt.dataset.deity;
            const d = DEITIES[deity];
            opt.querySelector('.name-text').textContent = state.language === 'hi' ? d.text_hi : d.text_en;
            opt.classList.toggle('active', deity === state.currentDeity);
        });
    }

    function updateSoundUI() {
        soundOptions.forEach(opt => opt.classList.toggle('active', opt.dataset.sound === state.soundType));
    }

    function updateSelectedName() {
        const deity = DEITIES[state.currentDeity];
        selectedNameEl.textContent = state.language === 'hi' ? deity.text_hi : deity.text_en;
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
        updateSelectedName();
    }

    function updateLevelBadge() {
        let currentLevel = LEVELS[0];
        for (const level of LEVELS) {
            if (state.totalLifetimeCount >= level.min) currentLevel = level;
        }
        levelText.textContent = currentLevel.name;
        levelBadge.querySelector('.level-icon').textContent = currentLevel.icon;
    }

    function updateDailyStats() {
        const today = new Date().toISOString().split('T')[0];
        if (!state.dailyStats[today]) state.dailyStats[today] = 0;
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

    // === Stats ===
    function updateStats() {
        totalCountEl.textContent = state.totalLifetimeCount.toLocaleString();
        streakCountEl.textContent = state.currentStreak;
    }

    function renderChart() {
        chartContainer.innerHTML = '';
        const days = getLast7Days();
        const maxCount = Math.max(...days.map(d => d.count), 1);

        days.forEach(day => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            const height = Math.max((day.count / maxCount) * 50, 3);
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
        if (stored) state = { ...state, ...JSON.parse(stored) };
    }

    function saveState() {
        localStorage.setItem('naamjapa_premium', JSON.stringify(state));
    }
});
