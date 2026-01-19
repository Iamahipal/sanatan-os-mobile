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
    const completeDeityName = document.getElementById('complete-deity-name');

    // Name Selector
    const nameSelectorBtn = document.getElementById('name-selector-btn');
    const selectedNameEl = document.getElementById('selected-name');
    const deityNameText = document.getElementById('deity-name-text'); // Centered display (hidden)
    const counterDeityName = document.getElementById('counter-deity-name'); // Counter display
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

    // Stats - Enhanced
    const totalNaamsEl = document.getElementById('total-naams');
    const totalMalasEl = document.getElementById('total-malas');
    const bestDayEl = document.getElementById('best-day');
    const streakCountEl = document.getElementById('streak-count');
    const chartContainer = document.getElementById('chart-container');

    // Reset
    const resetData = document.getElementById('reset-data');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmCancel = document.getElementById('confirm-cancel');
    const confirmDelete = document.getElementById('confirm-delete');

    // Reminder
    const reminderToggleBtn = document.getElementById('reminder-toggle-btn');
    const reminderTimeSection = document.getElementById('reminder-time-section');
    const reminderTimeInput = document.getElementById('reminder-time');
    const reminderStatus = document.getElementById('reminder-status');

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.close;
            document.getElementById(modalId).classList.remove('active');
        });
    });

    // Audio with graceful fallback for offline/failed loads
    const sounds = {
        bell: document.getElementById('bell-sound'),
        conch: document.getElementById('conch-sound'),
        bowl: document.getElementById('bowl-sound'),
        chime: document.getElementById('chime-sound')
    };

    // Track which sounds loaded successfully
    const soundsLoaded = { bell: false, conch: false, bowl: false, chime: false };
    Object.entries(sounds).forEach(([name, audio]) => {
        if (audio) {
            audio.addEventListener('canplaythrough', () => { soundsLoaded[name] = true; });
            audio.addEventListener('error', () => {
                console.warn(`[Audio] Failed to load ${name} sound - will use vibration fallback`);
                soundsLoaded[name] = false;
            });
        }
    });

    // Helper to play sound (no vibration fallback - haptics only on mala completion)
    function playSound(soundType) {
        const audio = sounds[soundType];
        if (audio && soundsLoaded[soundType]) {
            audio.currentTime = 0;
            audio.play().catch(() => { });
        }
        // Note: No vibration fallback here - haptic feedback is in completeMala() only
    }

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
        soundType: 'bell',
        reminderEnabled: false,
        reminderTime: '06:00'
    };

    let malaRotation = 0;
    let lastTapTime = 0;

    // === Initialize ===
    loadState();
    createMalaBeads();
    updateDisplay();
    updateUI();
    updateLevelBadge();
    checkStreak();
    applyTheme(state.currentDeity); // Theme = Deity

    // === Event Listeners ===
    // Tap anywhere on canvas
    canvas.addEventListener('pointerdown', handleTap, { passive: false });

    // Also listen for taps on mala section (below counter)
    const malaSection = document.querySelector('.mala-section');
    if (malaSection) {
        malaSection.addEventListener('pointerdown', (e) => {
            // Don't count if tapping on counter display
            if (!e.target.closest('.counter-display')) {
                handleTap(e);
            }
        }, { passive: false });
    }

    // Keyboard support (Spacebar / Enter = count japa)
    document.addEventListener('keydown', (e) => {
        // Only trigger if no modal is open
        const anyModalOpen = nameModal.classList.contains('active') ||
            settingsModal.classList.contains('active');

        if (!anyModalOpen && (e.code === 'Space' || e.code === 'Enter')) {
            e.preventDefault();
            handleTap(e);
        }
    });

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

    // Reset - Show confirmation modal
    resetData.addEventListener('click', () => {
        settingsModal.classList.remove('active'); // Close settings first
        confirmModal.classList.add('active');
    });

    // Confirmation modal - Cancel
    confirmCancel.addEventListener('click', () => {
        confirmModal.classList.remove('active');
    });

    // Confirmation modal - Delete (confirm)
    confirmDelete.addEventListener('click', () => {
        confirmModal.classList.remove('active');
        resetAllData();
    });

    // Close confirm modal on backdrop click
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) confirmModal.classList.remove('active');
    });

    // Reminder
    initReminder();
    reminderToggleBtn.addEventListener('click', toggleReminder);
    reminderTimeInput.addEventListener('change', updateReminderTime);

    // Note: Floating mantra functions removed - deity name now displayed statically in center

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

        if (state.beadCount >= TOTAL_BEADS) {
            completeMala();
        }

        updateDisplay();
        updateLevelBadge();
        saveState();
    }

    // === Mala Functions ===
    function createMalaBeads() {
        malaContainer.innerHTML = '';
        const radius = 270;
        const centerX = 300;
        const centerY = 300;
        const totalBeadsInCircle = BEAD_COUNT + 1; // 54 regular + 1 meru = 55
        const beadOffset = 15; // Half of bead width (30px)

        // Create all beads including Meru at position 0
        for (let i = 0; i < totalBeadsInCircle; i++) {
            const bead = document.createElement('div');

            // Meru bead at position 0 (first bead)
            if (i === 0) {
                bead.className = 'bead meru-bead';
            } else {
                bead.className = 'bead';
            }

            const angleDeg = (i * (360 / totalBeadsInCircle)) - 90;
            const angleRad = angleDeg * (Math.PI / 180);
            bead.style.left = `${centerX + radius * Math.cos(angleRad) - beadOffset}px`;
            bead.style.top = `${centerY + radius * Math.sin(angleRad) - beadOffset}px`;
            malaContainer.appendChild(bead);
        }
    }

    function rotateMala() {
        malaRotation += (360 / TOTAL_BEADS);
        malaContainer.style.transform = `translateX(-50%) rotate(${malaRotation}deg)`;
        // Removed expensive querySelectorAll on every tap - only clear on mala complete
    }

    function completeMala() {
        state.beadCount = 0;
        state.malaCount++;

        // Play sound using graceful fallback helper
        if (!state.isMuted) {
            playSound(state.soundType);
        }

        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

        const beads = malaContainer.querySelectorAll('.bead');
        if (beads[0]) {
            beads[0].classList.add('complete-bead');
            setTimeout(() => beads[0].classList.remove('complete-bead'), 1000);
        }

        divineFlash.classList.add('active');
        setTimeout(() => divineFlash.classList.remove('active'), 1000);

        // Update deity name in completion popup
        const deity = DEITIES[state.currentDeity];
        if (completeDeityName) {
            completeDeityName.textContent = state.language === 'hi' ? deity.text_hi : deity.text_en;
        }

        completeCount.textContent = `(${state.malaCount})`;
        malaComplete.classList.add('active');
        setTimeout(() => malaComplete.classList.remove('active'), 2500);

        malaCountEl.classList.add('pulse');
        setTimeout(() => malaCountEl.classList.remove('pulse'), 400);
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
        const text = state.language === 'hi' ? deity.text_hi : deity.text_en;
        selectedNameEl.textContent = text;

        // Also update the centered deity name display (hidden on home)
        if (deityNameText) {
            deityNameText.textContent = text;
        }

        // Update counter deity name display
        if (counterDeityName) {
            counterDeityName.textContent = text;
        }
    }

    function resetAllData() {
        // Called after user confirms via modal
        localStorage.removeItem('naamjapa_premium');
        location.reload();
    }

    // === Display ===
    function updateDisplay() {
        beadCountEl.textContent = state.beadCount;
        malaCountEl.textContent = state.malaCount;
        // Note: updateSelectedName only called when deity changes, not every tap
    }

    function updateLevelBadge() {
        let currentLevel = LEVELS[0];
        for (const level of LEVELS) {
            if (state.totalLifetimeCount >= level.min) currentLevel = level;
        }
        levelText.textContent = currentLevel.name;
        // Note: Lucide icons are SVG, no need to update textContent
    }

    function updateDailyStats() {
        const today = new Date().toISOString().split('T')[0];
        const isFirstTapToday = !state.dailyStats[today];

        if (isFirstTapToday) {
            state.dailyStats[today] = 0;
            // Update streak when user taps for first time today
            updateStreak(today);
        }

        state.dailyStats[today]++;
        state.lastActiveDate = today;
    }

    function updateStreak(today) {
        // Calculate yesterday's date
        const todayDate = new Date(today);
        const yesterday = new Date(todayDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (state.lastActiveDate === yesterdayStr) {
            // User was active yesterday - continue streak
            state.currentStreak++;
        } else if (state.lastActiveDate === today) {
            // Already counted today, do nothing
        } else if (state.lastActiveDate === null) {
            // First time user - start streak at 1
            state.currentStreak = 1;
        } else {
            // Missed one or more days - reset streak to 1 (today counts)
            state.currentStreak = 1;
        }

        saveState();
    }

    function checkStreak() {
        // Called on page load to verify streak is still valid
        const today = new Date().toISOString().split('T')[0];

        // If user already has activity today, streak is valid
        if (state.dailyStats[today] && state.dailyStats[today] > 0) {
            return; // Streak already counted for today
        }

        // Check if streak should be reset (no activity yesterday)
        const todayDate = new Date();
        const yesterday = new Date(todayDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // If last active was before yesterday, streak is broken
        if (state.lastActiveDate &&
            state.lastActiveDate !== today &&
            state.lastActiveDate !== yesterdayStr) {
            state.currentStreak = 0;
            saveState();
        }
    }

    // === Stats ===
    function updateStats() {
        // Total Naams
        totalNaamsEl.textContent = state.totalLifetimeCount.toLocaleString();

        // Total Malas (108 per mala)
        const totalMalas = Math.floor(state.totalLifetimeCount / 108);
        totalMalasEl.textContent = totalMalas.toLocaleString();

        // Best Day - find max from daily stats
        const dailyCounts = Object.values(state.dailyStats);
        const bestDay = dailyCounts.length > 0 ? Math.max(...dailyCounts) : 0;
        bestDayEl.textContent = bestDay.toLocaleString();

        // Day Streak
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

    // Debounced save - don't write localStorage on every tap
    let saveTimeout = null;
    function saveState() {
        // Clear pending save
        if (saveTimeout) clearTimeout(saveTimeout);
        // Debounce: save after 500ms of no taps
        saveTimeout = setTimeout(() => {
            localStorage.setItem('naamjapa_premium', JSON.stringify(state));
        }, 500);
    }

    // === Reminder System ===
    function initReminder() {
        // Restore UI from state
        if (state.reminderEnabled) {
            reminderToggleBtn.classList.add('active');
            reminderTimeSection.classList.add('visible');
        }
        reminderTimeInput.value = state.reminderTime;
        updateReminderStatus();

        // Start checking for reminder time
        if (state.reminderEnabled) {
            startReminderCheck();
        }
    }

    function toggleReminder() {
        if (!state.reminderEnabled) {
            // Enabling - request notification permission first
            requestNotificationPermission().then(granted => {
                if (granted) {
                    state.reminderEnabled = true;
                    reminderToggleBtn.classList.add('active');
                    reminderTimeSection.classList.add('visible');
                    updateReminderStatus();
                    startReminderCheck();
                    saveState();
                } else {
                    reminderStatus.textContent = '❌ Notification permission denied';
                }
            });
        } else {
            // Disabling
            state.reminderEnabled = false;
            reminderToggleBtn.classList.remove('active');
            reminderTimeSection.classList.remove('visible');
            updateReminderStatus();
            saveState();
        }
    }

    function updateReminderTime() {
        state.reminderTime = reminderTimeInput.value;
        updateReminderStatus();
        saveState();
    }

    function updateReminderStatus() {
        if (state.reminderEnabled) {
            const [hours, mins] = state.reminderTime.split(':');
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            reminderStatus.textContent = `⏰ Reminder set for ${displayHours}:${mins} ${period} daily`;
        } else {
            reminderStatus.textContent = '';
        }
    }

    async function requestNotificationPermission() {
        if (!('Notification' in window)) {
            reminderStatus.textContent = '❌ Notifications not supported';
            return false;
        }

        // Request notification permission
        let permission = Notification.permission;
        if (permission !== 'granted' && permission !== 'denied') {
            permission = await Notification.requestPermission();
        }

        if (permission !== 'granted') {
            reminderStatus.textContent = '❌ Notification permission denied';
            return false;
        }

        // Initialize Firebase and get FCM token
        try {
            // Initialize Firebase (if not already) - config from firebase-config.js
            if (!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
            }

            // Register Firebase messaging service worker
            // Note: Service worker must be at the root of the app's scope
            // If app is hosted at /apps/japa/, the SW should be at /apps/japa/firebase-messaging-sw.js
            const swPath = './firebase-messaging-sw.js';
            const registration = await navigator.serviceWorker.register(swPath);
            console.log('Firebase SW registered:', registration);

            // Get messaging instance
            const messaging = firebase.messaging();

            // Get FCM token - VAPID key from firebase-config.js
            const fcmToken = await messaging.getToken({
                vapidKey: FCM_VAPID_KEY,
                serviceWorkerRegistration: registration
            });

            if (fcmToken) {
                console.log('FCM Token:', fcmToken);
                // Save token to state for later use
                state.fcmToken = fcmToken;
                saveState();

                reminderStatus.textContent = '✅ Push notifications enabled!';

                // Listen for foreground messages
                messaging.onMessage((payload) => {
                    console.log('Foreground message received:', payload);
                    // Show notification manually for foreground
                    if (Notification.permission === 'granted') {
                        new Notification(payload.notification?.title || '🙏 Naam Jap', {
                            body: payload.notification?.body || 'Time for Japa!',
                            icon: '/icons/icon-192.png'
                        });
                    }
                });

                return true;
            } else {
                reminderStatus.textContent = '⚠️ Could not get push token';
                return true; // Still allow local notifications
            }
        } catch (err) {
            console.error('Firebase messaging setup failed:', err);
            reminderStatus.textContent = '⚠️ Push setup failed, using local notifications';
            return true; // Fall back to local notifications
        }
    }

    let reminderInterval = null;
    let lastNotifiedDate = null;

    function startReminderCheck() {
        // Check every minute
        if (reminderInterval) clearInterval(reminderInterval);
        reminderInterval = setInterval(checkReminderTime, 60000);
        // Also check immediately
        checkReminderTime();
    }

    function checkReminderTime() {
        if (!state.reminderEnabled) return;

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const today = now.toISOString().split('T')[0];

        // Only notify once per day at the set time
        if (currentTime === state.reminderTime && lastNotifiedDate !== today) {
            lastNotifiedDate = today;
            showReminderNotification();
        }
    }

    function showReminderNotification() {
        if (Notification.permission === 'granted') {
            const notification = new Notification('🙏 Naam Jap Reminder', {
                body: 'Time for your daily Naam Jap sadhana!',
                icon: '../../icons/icon-192.png',
                badge: '../../icons/icon-192.png',
                vibrate: [200, 100, 200],
                tag: 'naamjap-reminder',
                requireInteraction: true
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }
});
