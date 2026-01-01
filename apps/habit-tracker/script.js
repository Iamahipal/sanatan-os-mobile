/**
 * Sanatan OS Habit Tracker
 * Core JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===== CONSTANTS =====
    const STORAGE_KEY = 'sanatan_habit_tracker';

    const ICONS = [
        'sun', 'moon', 'star', 'heart', 'zap', 'flame', 'droplet', 'leaf',
        'flower-2', 'tree', 'mountain', 'waves', 'wind', 'cloud', 'snowflake',
        'umbrella', 'coffee', 'apple', 'carrot', 'beef', 'cake', 'cookie',
        'dumbbell', 'bike', 'footprints', 'timer', 'alarm-clock', 'calendar',
        'book-open', 'pen-tool', 'music', 'mic', 'headphones', 'camera',
        'palette', 'brush', 'scissors', 'hammer', 'wrench', 'laptop',
        'smartphone', 'tv', 'gamepad-2', 'puzzle', 'target', 'trophy',
        'medal', 'award', 'gift', 'sparkles', 'smile', 'meh', 'frown'
    ];

    const COLORS = [
        '#007AFF', // Blue
        '#AF52DE', // Purple
        '#FF2D55', // Pink
        '#FF9500', // Orange
        '#30B0C7', // Teal
        '#34C759'  // Green
    ];

    const MILESTONES = [
        { days: 7, name: 'Week Warrior', emoji: '🌱' },
        { days: 21, name: 'Habit Builder', emoji: '🌿' },
        { days: 30, name: 'Monthly Master', emoji: '🌳' },
        { days: 66, name: 'Habit Formed', emoji: '💪' },
        { days: 100, name: 'Century Legend', emoji: '🏆' },
        { days: 365, name: 'Year Champion', emoji: '👑' }
    ];

    // ===== PRANA QUOTES - Daily Motivation =====
    const PRANA_QUOTES = [
        { text: "योगस्थः कुरु कर्माणि", translation: "Be steadfast in yoga, perform actions", source: "Gita 2.48" },
        { text: "कर्मण्येवाधिकारस्ते", translation: "Your right is to action alone", source: "Gita 2.47" },
        { text: "अभ्यासेन तु कौन्तेय", translation: "Through practice, O Arjuna", source: "Gita 6.35" },
        { text: "श्रद्धावाँल्लभते ज्ञानम्", translation: "The faithful attain wisdom", source: "Gita 4.39" },
        { text: "समत्वं योग उच्यते", translation: "Equanimity is called yoga", source: "Gita 2.48" },
        { text: "आत्मानं रथिनं विद्धि", translation: "Know the Self as the charioteer", source: "Katha 1.3.3" },
        { text: "तपस्विभ्योऽधिको योगी", translation: "The yogi is greater than the ascetic", source: "Gita 6.46" },
        { text: "उद्धरेदात्मनात्मानम्", translation: "Elevate yourself by yourself", source: "Gita 6.5" },
        { text: "नियतं कुरु कर्म त्वम्", translation: "Perform your prescribed duties", source: "Gita 3.8" },
        { text: "मनः प्रसादः सौम्यत्वम्", translation: "Serenity of mind, gentleness", source: "Gita 17.16" },
        { text: "धृतिः क्षमा दमो", translation: "Fortitude, forgiveness, self-control", source: "Gita 16.3" },
        { text: "सत्त्वं रजस्तम इति", translation: "Sattva, Rajas, Tamas - the three gunas", source: "Gita 14.5" }
    ];

    // ===== AUSPICIOUS DAYS CALCULATOR =====
    function getTithi(date) {
        // Simplified lunar phase calculation
        const lunationLength = 29.53058867;
        const newMoon = new Date(2024, 0, 11); // Known new moon date
        const diff = (date - newMoon) / (1000 * 60 * 60 * 24);
        const phase = ((diff % lunationLength) + lunationLength) % lunationLength;
        const tithi = Math.floor(phase / (lunationLength / 30)) + 1;
        return tithi;
    }

    function getAuspiciousInfo(date) {
        const tithi = getTithi(date);
        const dayInfo = { tithi, isAuspicious: false, type: null, name: null };

        // Purnima (Full Moon) - Tithi 15 of Shukla Paksha
        if (tithi === 15) {
            dayInfo.isAuspicious = true;
            dayInfo.type = 'purnima';
            dayInfo.name = 'पूर्णिमा';
        }
        // Amavasya (New Moon) - Tithi 30
        else if (tithi === 30 || tithi === 0) {
            dayInfo.isAuspicious = true;
            dayInfo.type = 'amavasya';
            dayInfo.name = 'अमावस्या';
        }
        // Ekadashi - 11th day of each fortnight
        else if (tithi === 11 || tithi === 26) {
            dayInfo.isAuspicious = true;
            dayInfo.type = 'ekadashi';
            dayInfo.name = 'एकादशी';
        }

        return dayInfo;
    }

    function getDailyPranaQuote() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        return PRANA_QUOTES[dayOfYear % PRANA_QUOTES.length];
    }

    // ===== DOM ELEMENTS =====
    // Screens
    const screens = {
        onboarding: document.getElementById('onboarding'),
        dashboard: document.getElementById('dashboard'),
        habitForm: document.getElementById('habit-form'),
        habitDetail: document.getElementById('habit-detail'),
        timeline: document.getElementById('timeline'),
        settings: document.getElementById('settings')
    };

    // Onboarding
    const onboardingSlides = document.querySelectorAll('.onboarding-slide');
    const onboardingDots = document.querySelectorAll('.dot');
    const skipBtn = document.getElementById('skip-btn');
    const nextBtn = document.getElementById('next-btn');

    // Dashboard
    const todayDateEl = document.getElementById('today-date');
    const completionPctEl = document.getElementById('completion-pct');
    const weekDaysContainer = document.getElementById('week-days');
    const habitListEl = document.getElementById('habit-list');
    const emptyStateEl = document.getElementById('empty-state');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const navTabs = document.querySelectorAll('.nav-tab[data-view]');

    // Form
    const formBackBtn = document.getElementById('form-back-btn');
    const formTitle = document.getElementById('form-title');
    const saveHabitBtn = document.getElementById('save-habit-btn');
    const habitNameInput = document.getElementById('habit-name');
    const habitQuestionInput = document.getElementById('habit-question');
    const typeButtons = document.querySelectorAll('.type-btn');
    const measurableOptions = document.querySelector('.measurable-options');
    const habitTargetInput = document.getElementById('habit-target');
    const habitUnitInput = document.getElementById('habit-unit');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const iconPicker = document.getElementById('icon-picker');
    const frequencyRadios = document.querySelectorAll('input[name="frequency"]');
    const specificDaysOptions = document.querySelector('.specific-days-options');
    const xPerWeekOptions = document.querySelector('.x-per-week-options');
    const dayButtons = document.querySelectorAll('.day-btn');
    const timesPerWeekInput = document.getElementById('times-per-week');
    const reminderToggle = document.getElementById('reminder-toggle');
    const reminderTimeRow = document.querySelector('.reminder-time-row');
    const reminderTimeInput = document.getElementById('reminder-time');
    const timelineToggle = document.getElementById('timeline-toggle');

    // Detail
    const detailBackBtn = document.getElementById('detail-back-btn');
    const detailTitle = document.getElementById('detail-title');
    const editHabitBtn = document.getElementById('edit-habit-btn');
    const scoreValue = document.getElementById('score-value');
    const monthValue = document.getElementById('month-value');
    const yearValue = document.getElementById('year-value');
    const totalValue = document.getElementById('total-value');
    const scoreGraph = document.getElementById('score-graph');
    const historyGraph = document.getElementById('history-graph');
    const calendarGrid = document.getElementById('calendar-grid');
    const scoreFilter = document.getElementById('score-filter');
    const historyFilter = document.getElementById('history-filter');

    // Timeline
    const timelineBackBtn = document.getElementById('timeline-back-btn');
    const timelineContent = document.getElementById('timeline-content');

    // Settings
    const settingsBackBtn = document.getElementById('settings-back-btn');
    const gaugeValue = document.getElementById('gauge-value');
    const resetAllBtn = document.getElementById('reset-all-btn');

    // Modals
    const entryModal = document.getElementById('entry-modal');
    const entryModalTitle = document.getElementById('entry-modal-title');
    const closeEntryModal = document.getElementById('close-entry-modal');
    const markDoneBtn = document.getElementById('mark-done');
    const markSkipBtn = document.getElementById('mark-skip');
    const entryNoteInput = document.getElementById('entry-note');

    const measureModal = document.getElementById('measure-modal');
    const measureModalTitle = document.getElementById('measure-modal-title');
    const closeMeasureModal = document.getElementById('close-measure-modal');
    const measureValueInput = document.getElementById('measure-value');
    const measureUnitEl = document.getElementById('measure-unit');
    const measureTargetDisplay = document.getElementById('measure-target-display');
    const measureSubmitBtn = document.getElementById('measure-submit');

    const celebrationOverlay = document.getElementById('celebration');
    const celebrationText = document.getElementById('celebration-text');
    const celebrationSubtext = document.getElementById('celebration-subtext');
    const confettiContainer = document.getElementById('confetti');

    // Category Modal
    const categoryPickerBtn = document.getElementById('category-picker-btn');
    const selectedCategoryEl = document.getElementById('selected-category');
    const categoryModal = document.getElementById('category-modal');
    const closeCategoryModal = document.getElementById('close-category-modal');
    const categoryList = document.getElementById('category-list');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const addCategoryBtn = document.getElementById('add-category-btn');

    // Delete Modal
    const deleteModal = document.getElementById('delete-modal');
    const closeDeleteModal = document.getElementById('close-delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const archiveHabitBtn = document.getElementById('archive-habit-btn');
    const deleteHabitBtn = document.getElementById('delete-habit-btn');

    // ===== STATE =====
    let state = {
        onboardingComplete: false,
        habits: [],
        categories: ['Morning', 'Health', 'Learning', 'Work', 'Personal'],
        selectedDate: new Date(),
        editingHabitId: null,
        selectedHabitId: null
    };

    // Form state
    let formState = {
        type: 'boolean',
        color: COLORS[0],
        icon: 'sun',
        frequency: 'everyday',
        specificDays: [],
        timesPerWeek: 3,
        reminder: false,
        reminderTime: '09:00',
        showOnTimeline: true,
        category: null,
        // Sprint B additions
        allowRestDays: false,
        maxRestDays: 1,
        ritual: 'none',
        stackAfter: null
    };

    // ===== INITIALIZATION =====
    function init() {
        loadState();
        initColorPicker();
        initIconPicker();
        bindEvents();
        initNotifications();
        startReminderScheduler();

        if (state.onboardingComplete) {
            showScreen('dashboard');
            renderDashboard();
        } else {
            showScreen('onboarding');
        }
    }

    function initColorPicker() {
        const colorPicker = document.querySelector('.color-picker');
        if (!colorPicker) return;

        colorPicker.innerHTML = COLORS.map((color, index) => `
            <button class="color-swatch ${index === 0 ? 'active' : ''}" 
                    data-color="${color}" 
                    style="background: ${color};"
                    aria-label="Select color ${color}"></button>
        `).join('');

        // Re-bind click events since elements are new
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                // Remove active class from all
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                // Add to clicked
                e.target.classList.add('active');
                // Update state
                formState.color = e.target.dataset.color;
            });
        });
    }

    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
                state.selectedDate = new Date();
            }
        } catch (e) {
            console.error('Failed to load state:', e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                onboardingComplete: state.onboardingComplete,
                habits: state.habits,
                categories: state.categories
            }));
        } catch (e) {
            console.error('Failed to save state:', e);
        }
    }

    // ===== SCREEN NAVIGATION =====
    function showScreen(screenName) {
        Object.values(screens).forEach(screen => {
            if (screen) {
                screen.style.display = 'none';
                screen.classList.remove('animate-fade-in', 'animate-scale-in');
            }
        });
        if (screens[screenName]) {
            screens[screenName].style.display = 'flex';

            // Animation logic
            if (['habitForm', 'habitDetail', 'settings'].includes(screenName)) {
                screens[screenName].classList.add('animate-scale-in');
            } else {
                screens[screenName].classList.add('animate-fade-in');
            }
            // Reset scroll
            window.scrollTo(0, 0);
        }
        lucide.createIcons();
    }

    // ===== ONBOARDING =====
    let currentSlide = 0;

    function updateOnboardingSlide(index) {
        onboardingSlides.forEach((slide, i) => {
            slide.classList.remove('active', 'exit');
            if (i === index) {
                slide.classList.add('active');
            } else if (i < index) {
                slide.classList.add('exit');
            }
        });

        onboardingDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update slide background color
        const slideColor = onboardingSlides[index].style.getPropertyValue('--slide-color');
        screens.onboarding.style.background = slideColor;

        // Change next button to checkmark on last slide
        if (index === onboardingSlides.length - 1) {
            nextBtn.innerHTML = '<i data-lucide="check"></i>';
            lucide.createIcons();
        }
    }

    function completeOnboarding() {
        state.onboardingComplete = true;
        saveState();
        showScreen('dashboard');
        renderDashboard();
    }

    // ===== DASHBOARD =====
    function renderDashboard() {
        renderPranaQuote();
        renderTodayDate();
        renderWeekPicker();
        renderHabitList();
        updateCompletionPct();
    }

    function renderPranaQuote() {
        const pranaQuoteEl = document.getElementById('prana-quote');
        if (!pranaQuoteEl) return;

        const quote = getDailyPranaQuote();
        pranaQuoteEl.innerHTML = `
            <div class="prana-sanskrit">${quote.text}</div>
            <div class="prana-translation">${quote.translation}</div>
            <div class="prana-source">— ${quote.source}</div>
        `;
    }

    function renderTodayDate() {
        const today = new Date();
        const options = { day: 'numeric', month: 'short' };
        const dateStr = today.toLocaleDateString('en-US', options);

        // Check for auspicious day
        const auspicious = getAuspiciousInfo(today);
        if (auspicious.isAuspicious) {
            todayDateEl.innerHTML = `Today, ${dateStr} <span class="auspicious-badge ${auspicious.type}">${auspicious.name}</span>`;
        } else {
            todayDateEl.textContent = `Today, ${dateStr}`;
        }
    }

    function renderWeekPicker() {
        weekDaysContainer.innerHTML = '';
        const today = new Date();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Get start of current week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);

            const dayEl = document.createElement('div');
            dayEl.className = 'week-day';
            if (isSameDay(date, today)) {
                dayEl.classList.add('today');
            }
            if (isSameDay(date, state.selectedDate)) {
                dayEl.classList.add('selected');
            }

            // Check for auspicious day
            const auspicious = getAuspiciousInfo(date);
            if (auspicious.isAuspicious) {
                dayEl.classList.add('auspicious', auspicious.type);
            }

            dayEl.innerHTML = `
                <span class="day-name">${dayNames[date.getDay()]}</span>
                <span class="day-num">${date.getDate()}</span>
                ${auspicious.isAuspicious ? `<span class="auspicious-dot ${auspicious.type}"></span>` : ''}
            `;

            dayEl.addEventListener('click', () => {
                state.selectedDate = date;
                renderWeekPicker();
                renderHabitList();
            });

            weekDaysContainer.appendChild(dayEl);
        }
    }

    function renderHabitList() {
        // Clear existing habits (keep empty state)
        const existingCards = habitListEl.querySelectorAll('.habit-card');
        existingCards.forEach(card => card.remove());

        if (state.habits.length === 0) {
            emptyStateEl.style.display = 'flex';
            return;
        }

        emptyStateEl.style.display = 'none';

        state.habits.forEach(habit => {
            const card = createHabitCard(habit);
            habitListEl.appendChild(card);
        });
    }

    function createHabitCard(habit) {
        const card = document.createElement('div');
        card.className = 'habit-card';
        card.dataset.habitId = habit.id;

        const dateKey = getDateKey(state.selectedDate);
        const entry = habit.entries[dateKey];
        const status = entry?.status || null;
        const streak = calculateStreak(habit);

        card.innerHTML = `
            <div class="habit-header">
                <div class="habit-info">
                    <div class="habit-icon" style="background: ${habit.color}">
                        <i data-lucide="${habit.icon}"></i>
                    </div>
                    <div>
                        <div class="habit-name">${habit.name}</div>
                        <div class="habit-streak">${streak > 0 ? `🔥 <span>${streak}</span> day streak` : 'Start your streak!'}</div>
                    </div>
                </div>
                <div class="habit-actions">
                    <button class="action-btn add-entry" data-action="entry" aria-label="Add entry for ${habit.name}">
                        <i data-lucide="plus"></i>
                    </button>
                    <button class="action-btn check ${status === 'completed' ? 'done' : status === 'skipped' ? 'skipped' : ''}" data-action="check" aria-label="Toggle status for ${habit.name}">
                        <i data-lucide="${status === 'completed' ? 'check' : status === 'skipped' ? 'x' : 'circle'}"></i>
                    </button>
                </div>
            </div>
            <div class="habit-grid" style="--habit-color: ${habit.color}">
                ${generateContributionGrid(habit)}
            </div>
        `;

        // Event listeners
        card.querySelector('[data-action="entry"]').addEventListener('click', (e) => {
            e.stopPropagation();
            openEntryModal(habit);
        });

        card.querySelector('[data-action="check"]').addEventListener('click', (e) => {
            e.stopPropagation();
            quickToggleHabit(habit);
        });

        card.addEventListener('click', () => {
            openHabitDetail(habit);
        });

        lucide.createIcons({ nodes: [card] });
        return card;
    }

    function generateContributionGrid(habit) {
        const cells = [];
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);

        for (let i = 0; i < 52 * 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateKey = getDateKey(date);
            const entry = habit.entries[dateKey];

            let level = '';
            if (entry?.status === 'completed') {
                if (habit.type === 'measurable' && entry.value && habit.target) {
                    const pct = (entry.value / habit.target.value) * 100;
                    if (pct >= 100) level = 'level-4';
                    else if (pct >= 75) level = 'level-3';
                    else if (pct >= 50) level = 'level-2';
                    else level = 'level-1';
                } else {
                    level = 'level-4';
                }
            }

            cells.push(`<div class="grid-cell ${level}"></div>`);
        }

        return cells.join('');
    }

    function quickToggleHabit(habit) {
        const dateKey = getDateKey(state.selectedDate);
        const currentStatus = habit.entries[dateKey]?.status;

        if (!habit.entries[dateKey]) {
            habit.entries[dateKey] = {};
        }

        if (currentStatus === 'completed') {
            habit.entries[dateKey].status = 'skipped';
        } else if (currentStatus === 'skipped') {
            delete habit.entries[dateKey].status;
        } else {
            habit.entries[dateKey].status = 'completed';
            checkMilestones(habit);
        }

        saveState();
        renderHabitList();
        updateCompletionPct();
    }

    function updateCompletionPct() {
        if (!completionPctEl) return;
        const dateKey = getDateKey(state.selectedDate);
        const activeHabits = state.habits.filter(h => isHabitActiveOnDate(h, state.selectedDate));

        if (activeHabits.length === 0) {
            completionPctEl.textContent = '0%';
            return;
        }

        const completed = activeHabits.filter(h => h.entries[dateKey]?.status === 'completed').length;
        const pct = Math.round((completed / activeHabits.length) * 100);
        completionPctEl.textContent = `${pct}%`;
    }

    // ===== HABIT FORM =====
    function initIconPicker() {
        iconPicker.innerHTML = '';
        ICONS.forEach(icon => {
            const btn = document.createElement('button');
            btn.className = 'icon-option';
            btn.dataset.icon = icon;
            if (icon === formState.icon) btn.classList.add('active');
            btn.innerHTML = `<i data-lucide="${icon}"></i>`;
            btn.addEventListener('click', () => selectIcon(icon));
            iconPicker.appendChild(btn);
        });
        lucide.createIcons({ nodes: [iconPicker] });
    }

    function selectIcon(icon) {
        formState.icon = icon;
        document.querySelectorAll('.icon-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.icon === icon);
        });
    }

    function resetFormState() {
        formState = {
            type: 'boolean',
            color: COLORS[0],
            icon: 'sun',
            frequency: 'everyday',
            specificDays: [],
            timesPerWeek: 3,
            reminder: false,
            reminderTime: '09:00',
            showOnTimeline: true
        };
        state.editingHabitId = null;

        // Reset UI
        habitNameInput.value = '';
        habitQuestionInput.value = '';
        habitTargetInput.value = '';
        habitUnitInput.value = '';
        measurableOptions.style.display = 'none';
        specificDaysOptions.style.display = 'none';
        xPerWeekOptions.style.display = 'none';
        reminderTimeRow.style.display = 'none';

        typeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.type === 'boolean'));
        colorSwatches.forEach(s => s.classList.toggle('active', s.dataset.color === COLORS[0]));
        frequencyRadios[0].checked = true;
        dayButtons.forEach(btn => btn.classList.remove('active'));
        reminderToggle.classList.remove('active');
        timelineToggle.classList.add('active');

        initIconPicker();
    }

    function openAddHabitForm() {
        resetFormState();
        formTitle.textContent = 'Add Habit';
        showScreen('habitForm');
    }

    function openEditHabitForm(habit) {
        state.editingHabitId = habit.id;
        formTitle.textContent = 'Edit Habit';

        // Populate form
        habitNameInput.value = habit.name;
        habitQuestionInput.value = habit.question || '';
        formState.type = habit.type;
        formState.color = habit.color;
        formState.icon = habit.icon;
        formState.frequency = habit.frequency.type;
        formState.specificDays = habit.frequency.days || [];
        formState.timesPerWeek = habit.frequency.count || 3;
        formState.reminder = habit.reminder.enabled;
        formState.reminderTime = habit.reminder.time;
        formState.showOnTimeline = habit.showOnTimeline;

        if (habit.target) {
            habitTargetInput.value = habit.target.value;
            habitUnitInput.value = habit.target.unit;
        }

        // Update UI
        typeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.type === habit.type));
        measurableOptions.style.display = habit.type === 'measurable' ? 'block' : 'none';

        colorSwatches.forEach(s => s.classList.toggle('active', s.dataset.color === habit.color));
        initIconPicker();

        frequencyRadios.forEach(r => r.checked = r.value === habit.frequency.type);
        updateFrequencyOptions();

        dayButtons.forEach(btn => {
            btn.classList.toggle('active', formState.specificDays.includes(parseInt(btn.dataset.day)));
        });

        timesPerWeekInput.value = formState.timesPerWeek;
        reminderToggle.classList.toggle('active', habit.reminder.enabled);
        reminderTimeRow.style.display = habit.reminder.enabled ? 'block' : 'none';
        reminderTimeInput.value = habit.reminder.time;
        timelineToggle.classList.toggle('active', habit.showOnTimeline);

        showScreen('habitForm');
    }

    function saveHabit() {
        const name = habitNameInput.value.trim();
        if (!name) {
            alert('Please enter a habit name');
            return;
        }

        const habit = {
            id: state.editingHabitId || generateId(),
            name,
            question: habitQuestionInput.value.trim() || `Did you ${name.toLowerCase()} today?`,
            type: formState.type,
            target: formState.type === 'measurable' ? {
                value: parseInt(habitTargetInput.value) || 1,
                unit: habitUnitInput.value.trim() || 'times'
            } : null,
            color: formState.color,
            icon: formState.icon,
            frequency: {
                type: formState.frequency,
                days: formState.frequency === 'specific' ? formState.specificDays : null,
                count: formState.frequency === 'x_per_week' ? parseInt(timesPerWeekInput.value) : null
            },
            reminder: {
                enabled: formState.reminder,
                time: formState.reminderTime
            },
            showOnTimeline: formState.showOnTimeline,
            createdAt: new Date().toISOString(),
            entries: {}
        };

        if (state.editingHabitId) {
            // Preserve existing entries when editing
            const existing = state.habits.find(h => h.id === state.editingHabitId);
            if (existing) {
                habit.entries = existing.entries;
                habit.createdAt = existing.createdAt;
            }
            state.habits = state.habits.map(h => h.id === state.editingHabitId ? habit : h);
        } else {
            state.habits.push(habit);
        }

        saveState();
        showScreen('dashboard');
        renderDashboard();
    }

    function updateFrequencyOptions() {
        const selected = document.querySelector('input[name="frequency"]:checked').value;
        formState.frequency = selected;

        specificDaysOptions.style.display = selected === 'specific' ? 'block' : 'none';
        xPerWeekOptions.style.display = selected === 'x_per_week' ? 'block' : 'none';
    }

    // ===== HABIT DETAIL =====
    function openHabitDetail(habit) {
        state.selectedHabitId = habit.id;
        detailTitle.textContent = habit.name;

        // Calculate stats
        const entries = Object.entries(habit.entries);
        const completed = entries.filter(([_, e]) => e.status === 'completed');
        const total = completed.length;

        // Score (last 30 days)
        const last30 = getEntriesForPeriod(habit, 30);
        const last30Completed = last30.filter(e => e.status === 'completed').length;
        const expectedDays = getExpectedDaysInPeriod(habit, 30);
        const score = expectedDays > 0 ? Math.round((last30Completed / expectedDays) * 100) : 0;

        scoreValue.textContent = `${score}%`;
        updateScoreRing(score);

        // Month & year change (placeholder)
        monthValue.textContent = '+5%';
        yearValue.textContent = '+5%';
        totalValue.textContent = total;

        renderCalendarGrid(habit);
        renderHistoryGraph(habit);

        showScreen('habitDetail');
    }

    function updateScoreRing(score) {
        const circle = document.querySelector('.score-circle');
        if (circle) {
            const circumference = 100;
            const offset = circumference - (score / 100) * circumference;
            circle.style.strokeDasharray = `${circumference - offset}, ${circumference}`;
        }
    }

    function renderCalendarGrid(habit) {
        calendarGrid.innerHTML = '';
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Generate last 3 months
        for (let m = -2; m <= 0; m++) {
            const month = new Date(currentYear, currentMonth + m, 1);
            const daysInMonth = new Date(currentYear, currentMonth + m + 1, 0).getDate();

            for (let d = 1; d <= daysInMonth; d++) {
                const date = new Date(currentYear, currentMonth + m, d);
                const dateKey = getDateKey(date);
                const entry = habit.entries[dateKey];

                const dayEl = document.createElement('div');
                dayEl.className = 'calendar-day';
                dayEl.textContent = d;

                if (entry?.status === 'completed') {
                    dayEl.classList.add('completed');
                    dayEl.style.background = habit.color;
                }
                if (isSameDay(date, today)) {
                    dayEl.classList.add('today');
                }

                calendarGrid.appendChild(dayEl);
            }
        }
    }

    function renderHistoryGraph(habit) {
        historyGraph.innerHTML = '';
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = getDateKey(date);
            const entry = habit.entries[dateKey];

            const bar = document.createElement('div');
            bar.className = 'bar';

            if (entry?.status === 'completed') {
                if (habit.type === 'measurable' && entry.value && habit.target) {
                    const pct = Math.min((entry.value / habit.target.value) * 100, 100);
                    bar.style.height = `${pct}%`;
                } else {
                    bar.style.height = '100%';
                }
                bar.style.background = habit.color;
            } else {
                bar.style.height = '10%';
                bar.style.background = '#E0E0E0';
            }

            historyGraph.appendChild(bar);
        }
    }

    // ===== TIMELINE =====
    function openTimeline() {
        renderTimeline();
        showScreen('timeline');
    }

    function renderTimeline() {
        timelineContent.innerHTML = '';

        // Get all entries with timeline visibility
        const allEntries = [];
        state.habits.filter(h => h.showOnTimeline).forEach(habit => {
            Object.entries(habit.entries).forEach(([dateKey, entry]) => {
                if (entry.status === 'completed') {
                    allEntries.push({
                        habit,
                        dateKey,
                        entry
                    });
                }
            });
        });

        // Sort by date descending
        allEntries.sort((a, b) => new Date(b.dateKey) - new Date(a.dateKey));

        // Render
        allEntries.slice(0, 50).forEach(({ habit, dateKey, entry }) => {
            const date = new Date(dateKey);
            const entryEl = document.createElement('div');
            entryEl.className = 'timeline-entry';
            entryEl.innerHTML = `
                <div class="timeline-line">
                    <div class="timeline-dot" style="background: ${habit.color}"></div>
                </div>
                <div class="timeline-card">
                    <div class="timeline-date">${formatDate(date)}</div>
                    <div class="timeline-habit">
                        <i data-lucide="${habit.icon}" style="stroke: ${habit.color}"></i>
                        <span>${habit.name}</span>
                        <span class="timeline-badge">Completed</span>
                    </div>
                    ${entry.note ? `<p class="timeline-note">${entry.note}</p>` : ''}
                </div>
            `;
            timelineContent.appendChild(entryEl);
        });

        if (allEntries.length === 0) {
            timelineContent.innerHTML = '<p class="empty-timeline">No entries yet</p>';
        }

        lucide.createIcons({ nodes: [timelineContent] });
    }

    // ===== SETTINGS =====
    function openSettings() {
        updateOverallScore();
        showScreen('settings');
    }

    function updateOverallScore() {
        if (state.habits.length === 0) {
            gaugeValue.textContent = '0';
            return;
        }

        let totalScore = 0;
        state.habits.forEach(habit => {
            const last30 = getEntriesForPeriod(habit, 30);
            const completed = last30.filter(e => e.status === 'completed').length;
            const expected = getExpectedDaysInPeriod(habit, 30);
            if (expected > 0) {
                totalScore += (completed / expected) * 100;
            }
        });

        const avgScore = Math.round(totalScore / state.habits.length);
        gaugeValue.textContent = avgScore;

        // Update gauge fill
        const gaugeFill = document.querySelector('.gauge-fill');
        if (gaugeFill) {
            const dashArray = (avgScore / 100) * 157;
            gaugeFill.style.strokeDasharray = `${dashArray}, 157`;
        }
    }

    // ===== SPRINT B: WEEKLY REPORT =====
    function generateWeeklyReport() {
        const reportContent = document.getElementById('report-content');
        if (!reportContent) return;

        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);

        let totalCompleted = 0;
        let totalExpected = 0;
        let bestStreak = 0;
        const habitScores = [];

        state.habits.forEach(habit => {
            let weekCompleted = 0;
            let weekExpected = 0;
            const streak = calculateStreak(habit);
            if (streak > bestStreak) bestStreak = streak;

            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + i);
                const dateKey = getDateKey(date);

                if (isHabitActiveOnDate(habit, date)) {
                    weekExpected++;
                    if (habit.entries[dateKey]?.status === 'completed') {
                        weekCompleted++;
                    }
                }
            }

            totalCompleted += weekCompleted;
            totalExpected += weekExpected;

            const score = weekExpected > 0 ? Math.round((weekCompleted / weekExpected) * 100) : 0;
            habitScores.push({ name: habit.name, score, color: habit.color });
        });

        const overallScore = totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0;

        reportContent.innerHTML = `
            <div class="report-stat-grid">
                <div class="report-stat">
                    <div class="report-stat-value">${overallScore}%</div>
                    <div class="report-stat-label">Week Score</div>
                </div>
                <div class="report-stat">
                    <div class="report-stat-value">${totalCompleted}/${totalExpected}</div>
                    <div class="report-stat-label">Completed</div>
                </div>
                <div class="report-stat">
                    <div class="report-stat-value">🔥 ${bestStreak}</div>
                    <div class="report-stat-label">Best Streak</div>
                </div>
                <div class="report-stat">
                    <div class="report-stat-value">${state.habits.length}</div>
                    <div class="report-stat-label">Active Habits</div>
                </div>
            </div>
            <div class="report-habit-list">
                ${habitScores.map(h => `
                    <div class="report-habit">
                        <span class="report-habit-name">${h.name}</span>
                        <span class="report-habit-score ${h.score >= 80 ? 'good' : h.score >= 50 ? 'medium' : 'poor'}">${h.score}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function openWeeklyReport() {
        generateWeeklyReport();
        const modal = document.getElementById('weekly-report-modal');
        if (modal) modal.classList.add('active');
        lucide.createIcons();
    }

    function closeWeeklyReport() {
        const modal = document.getElementById('weekly-report-modal');
        if (modal) modal.classList.remove('active');
    }

    function generateReportText() {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);

        let totalCompleted = 0;
        let totalExpected = 0;

        state.habits.forEach(habit => {
            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + i);
                const dateKey = getDateKey(date);

                if (isHabitActiveOnDate(habit, date)) {
                    totalExpected++;
                    if (habit.entries[dateKey]?.status === 'completed') {
                        totalCompleted++;
                    }
                }
            }
        });

        const score = totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0;

        return `🙏 My Weekly Niyam Report 🙏
        
📊 Score: ${score}%
✅ Completed: ${totalCompleted}/${totalExpected} habits
💪 ${state.habits.length} active niyams

🔥 Stay consistent, stay disciplined!
— Niyam (Sanatan OS)`;
    }

    function showToast(message) {
        // Check if toast already exists
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 0.9rem;
            z-index: 1000;
            animation: toastIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // ===== MODALS =====
    function openEntryModal(habit) {
        state.selectedHabitId = habit.id;

        if (habit.type === 'measurable') {
            measureModalTitle.textContent = habit.name;
            measureUnitEl.textContent = habit.target?.unit || 'times';
            measureTargetDisplay.textContent = `${habit.target?.value || 1} ${habit.target?.unit || 'times'}`;
            measureValueInput.value = '';
            measureModal.classList.add('active');
        } else {
            entryModalTitle.textContent = habit.name;
            entryNoteInput.value = '';
            entryModal.classList.add('active');
        }
    }

    function closeModals() {
        entryModal.classList.remove('active');
        measureModal.classList.remove('active');
    }

    function markHabitDone(status) {
        const habit = state.habits.find(h => h.id === state.selectedHabitId);
        if (!habit) return;

        const dateKey = getDateKey(state.selectedDate);
        if (!habit.entries[dateKey]) {
            habit.entries[dateKey] = {};
        }

        habit.entries[dateKey].status = status;
        habit.entries[dateKey].note = entryNoteInput.value.trim();

        if (status === 'completed') {
            checkMilestones(habit);
        }

        saveState();
        closeModals();
        renderHabitList();
        updateCompletionPct();
    }

    function submitMeasurable() {
        const habit = state.habits.find(h => h.id === state.selectedHabitId);
        if (!habit) return;

        const value = parseInt(measureValueInput.value) || 0;
        const dateKey = getDateKey(state.selectedDate);

        if (!habit.entries[dateKey]) {
            habit.entries[dateKey] = {};
        }

        habit.entries[dateKey].value = value;
        habit.entries[dateKey].status = value >= (habit.target?.value || 1) ? 'completed' : 'partial';

        if (habit.entries[dateKey].status === 'completed') {
            checkMilestones(habit);
        }

        saveState();
        closeModals();
        renderHabitList();
        updateCompletionPct();
    }

    // ===== CELEBRATIONS =====
    function checkMilestones(habit) {
        const streak = calculateStreak(habit);

        const milestone = MILESTONES.find(m => m.days === streak);
        if (milestone) {
            showCelebration(milestone.emoji, milestone.name, `${streak} day streak!`);
        }
    }

    function showCelebration(emoji, title, subtitle) {
        celebrationText.textContent = title;
        celebrationSubtext.textContent = subtitle;
        document.querySelector('.celebration-icon').textContent = emoji;

        // Create confetti
        confettiContainer.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = `${Math.random() * -50}%`;
            confetti.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confettiContainer.appendChild(confetti);
        }

        celebrationOverlay.classList.add('active');

        setTimeout(() => {
            celebrationOverlay.classList.remove('active');
        }, 3000);
    }

    // ===== UTILITY FUNCTIONS =====
    function generateId() {
        return 'habit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }

    function calculateStreak(habit) {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i <= 365; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = getDateKey(date);

            if (habit.entries[dateKey]?.status === 'completed') {
                streak++;
            } else if (i > 0) {
                break;
            }
        }

        return streak;
    }

    function isHabitActiveOnDate(habit, date) {
        const freq = habit.frequency;

        if (freq.type === 'everyday') return true;

        if (freq.type === 'specific' && freq.days) {
            return freq.days.includes(date.getDay());
        }

        return true;
    }

    function getEntriesForPeriod(habit, days) {
        const entries = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = getDateKey(date);

            if (habit.entries[dateKey]) {
                entries.push(habit.entries[dateKey]);
            }
        }

        return entries;
    }

    function getExpectedDaysInPeriod(habit, days) {
        const freq = habit.frequency;

        if (freq.type === 'everyday') return days;

        if (freq.type === 'specific' && freq.days) {
            let count = 0;
            const today = new Date();
            for (let i = 0; i < days; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                if (freq.days.includes(date.getDay())) count++;
            }
            return count;
        }

        if (freq.type === 'x_per_week') {
            return Math.ceil(days / 7) * (freq.count || 3);
        }

        return days;
    }

    // ===== EVENT BINDINGS =====
    function bindEvents() {
        // Onboarding
        nextBtn.addEventListener('click', () => {
            if (currentSlide < onboardingSlides.length - 1) {
                currentSlide++;
                updateOnboardingSlide(currentSlide);
            } else {
                completeOnboarding();
            }
        });

        skipBtn.addEventListener('click', completeOnboarding);

        onboardingDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateOnboardingSlide(currentSlide);
            });
        });

        // Dashboard
        addHabitBtn.addEventListener('click', openAddHabitForm);
        settingsBtn.addEventListener('click', openSettings);

        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                if (view === 'timeline') {
                    openTimeline();
                } else if (view === 'grid') {
                    showScreen('dashboard');
                    renderDashboard();
                }
            });
        });

        // Add Habit Button
        if (addHabitBtn) {
            addHabitBtn.addEventListener('click', openAddHabitForm);
        }

        // Report Button
        if (reportBtn) {
            reportBtn.addEventListener('click', openWeeklyReport);
        }

        // Form
        formBackBtn.addEventListener('click', () => {
            showScreen('dashboard');
            renderDashboard();
        });

        saveHabitBtn.addEventListener('click', saveHabit);

        typeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                formState.type = btn.dataset.type;
                typeButtons.forEach(b => b.classList.toggle('active', b === btn));
                measurableOptions.style.display = formState.type === 'measurable' ? 'block' : 'none';
            });
        });

        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                formState.color = swatch.dataset.color;
                colorSwatches.forEach(s => s.classList.toggle('active', s === swatch));
            });
        });

        frequencyRadios.forEach(radio => {
            radio.addEventListener('change', updateFrequencyOptions);
        });

        dayButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const day = parseInt(btn.dataset.day);
                btn.classList.toggle('active');
                if (formState.specificDays.includes(day)) {
                    formState.specificDays = formState.specificDays.filter(d => d !== day);
                } else {
                    formState.specificDays.push(day);
                }
            });
        });

        reminderToggle.addEventListener('click', () => {
            formState.reminder = !formState.reminder;
            reminderToggle.classList.toggle('active', formState.reminder);
            reminderTimeRow.style.display = formState.reminder ? 'block' : 'none';
        });

        timelineToggle.addEventListener('click', () => {
            formState.showOnTimeline = !formState.showOnTimeline;
            timelineToggle.classList.toggle('active', formState.showOnTimeline);
        });

        // Sprint B: Rest Days Toggle
        const restDaysToggle = document.getElementById('rest-days-toggle');
        const restDaysOptions = document.querySelector('.rest-days-options');
        if (restDaysToggle) {
            restDaysToggle.addEventListener('click', () => {
                formState.allowRestDays = !formState.allowRestDays;
                restDaysToggle.classList.toggle('active', formState.allowRestDays);
                if (restDaysOptions) {
                    restDaysOptions.style.display = formState.allowRestDays ? 'block' : 'none';
                }
            });
        }

        // Sprint B: Ritual Buttons
        const ritualButtons = document.querySelectorAll('.ritual-btn');
        ritualButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                formState.ritual = btn.dataset.ritual;
                ritualButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Sprint B: Weekly Report
        const closeWeeklyReportBtn = document.getElementById('close-weekly-report');
        if (closeWeeklyReportBtn) {
            closeWeeklyReportBtn.addEventListener('click', closeWeeklyReport);
        }

        const shareReportBtn = document.getElementById('share-report-btn');
        if (shareReportBtn) {
            shareReportBtn.addEventListener('click', async () => {
                const report = generateReportText();
                try {
                    if (navigator.share) {
                        await navigator.share({ title: 'My Weekly Niyam Report', text: report });
                    } else {
                        await navigator.clipboard.writeText(report);
                        showToast('Report copied to clipboard!');
                    }
                } catch (e) {
                    console.log('Share cancelled');
                }
            });
        }

        const reportBtn = document.getElementById('report-btn');
        if (reportBtn) {
            reportBtn.addEventListener('click', openWeeklyReport);
        }

        // Detail
        detailBackBtn.addEventListener('click', () => {
            showScreen('dashboard');
            renderDashboard();
        });

        editHabitBtn.addEventListener('click', () => {
            const habit = state.habits.find(h => h.id === state.selectedHabitId);
            if (habit) openEditHabitForm(habit);
        });

        // Timeline
        timelineBackBtn.addEventListener('click', () => {
            showScreen('dashboard');
            renderDashboard();
        });

        // Settings
        settingsBackBtn.addEventListener('click', () => {
            showScreen('dashboard');
            renderDashboard();
        });

        resetAllBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                state = {
                    onboardingComplete: true,
                    habits: [],
                    selectedDate: new Date(),
                    editingHabitId: null,
                    selectedHabitId: null
                };
                saveState();
                showScreen('dashboard');
                renderDashboard();
            }
        });

        // Modals
        closeEntryModal.addEventListener('click', closeModals);
        closeMeasureModal.addEventListener('click', closeModals);

        markDoneBtn.addEventListener('click', () => markHabitDone('completed'));
        markSkipBtn.addEventListener('click', () => markHabitDone('skipped'));
        measureSubmitBtn.addEventListener('click', submitMeasurable);

        entryModal.addEventListener('click', (e) => {
            if (e.target === entryModal) closeModals();
        });

        measureModal.addEventListener('click', (e) => {
            if (e.target === measureModal) closeModals();
        });

        celebrationOverlay.addEventListener('click', () => {
            celebrationOverlay.classList.remove('active');
        });

        // Category Modal
        if (categoryPickerBtn) {
            categoryPickerBtn.addEventListener('click', openCategoryModal);
        }
        if (closeCategoryModal) {
            closeCategoryModal.addEventListener('click', () => categoryModal.classList.remove('active'));
        }
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', addNewCategory);
        }
        if (categoryModal) {
            categoryModal.addEventListener('click', (e) => {
                if (e.target === categoryModal) categoryModal.classList.remove('active');
            });
        }

        // Delete/Archive
        if (deleteHabitBtn) {
            deleteHabitBtn.addEventListener('click', () => deleteModal.classList.add('active'));
        }
        if (archiveHabitBtn) {
            archiveHabitBtn.addEventListener('click', archiveHabit);
        }
        if (closeDeleteModal) {
            closeDeleteModal.addEventListener('click', () => deleteModal.classList.remove('active'));
        }
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.remove('active'));
        }
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', deleteHabit);
        }
        if (deleteModal) {
            deleteModal.addEventListener('click', (e) => {
                if (e.target === deleteModal) deleteModal.classList.remove('active');
            });
        }
    }

    // ===== CATEGORY FUNCTIONS =====
    function openCategoryModal() {
        renderCategoryList();
        categoryModal.classList.add('active');
    }

    function renderCategoryList() {
        categoryList.innerHTML = '';

        // None option
        const noneItem = document.createElement('div');
        noneItem.className = `category-item ${formState.category === null ? 'active' : ''}`;
        noneItem.innerHTML = `<span class="category-name">None</span>`;
        noneItem.addEventListener('click', () => selectCategory(null));
        categoryList.appendChild(noneItem);

        // User categories
        state.categories.forEach(cat => {
            const item = document.createElement('div');
            item.className = `category-item ${formState.category === cat ? 'active' : ''}`;
            item.innerHTML = `
                <span class="category-name">${cat}</span>
                <span class="category-count">${state.habits.filter(h => h.category === cat).length}</span>
            `;
            item.addEventListener('click', () => selectCategory(cat));
            categoryList.appendChild(item);
        });
    }

    function selectCategory(category) {
        formState.category = category;
        selectedCategoryEl.textContent = category || 'None';
        categoryModal.classList.remove('active');
    }

    function addNewCategory() {
        const name = newCategoryNameInput.value.trim();
        if (!name) return;
        if (state.categories.includes(name)) {
            alert('Category already exists');
            return;
        }
        state.categories.push(name);
        saveState();
        newCategoryNameInput.value = '';
        renderCategoryList();
    }

    // ===== DELETE/ARCHIVE FUNCTIONS =====
    function deleteHabit() {
        state.habits = state.habits.filter(h => h.id !== state.selectedHabitId);
        saveState();
        deleteModal.classList.remove('active');
        showScreen('dashboard');
        renderDashboard();
    }

    function archiveHabit() {
        const habit = state.habits.find(h => h.id === state.selectedHabitId);
        if (habit) {
            habit.archived = !habit.archived;
            saveState();
            showScreen('dashboard');
            renderDashboard();
        }
    }

    // ===== NOTIFICATION SYSTEM =====
    let notificationPermission = 'default';
    let reminderInterval = null;

    function initNotifications() {
        if (!('Notification' in window)) {
            console.log('Notifications not supported');
            return;
        }

        notificationPermission = Notification.permission;

        if (notificationPermission === 'default') {
            // Will request permission when user enables first reminder
            console.log('Notification permission not yet requested');
        }
    }

    async function requestNotificationPermission() {
        if (!('Notification' in window)) {
            return false;
        }

        if (Notification.permission === 'granted') {
            notificationPermission = 'granted';
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            notificationPermission = permission;
            return permission === 'granted';
        }

        return false;
    }

    function startReminderScheduler() {
        // Check reminders every minute
        checkReminders(); // Initial check
        reminderInterval = setInterval(checkReminders, 60000);
    }

    function checkReminders() {
        if (notificationPermission !== 'granted') return;

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const today = getDateKey(now);
        const dayOfWeek = now.getDay();

        state.habits.forEach(habit => {
            // Skip if no reminder set or archived
            if (!habit.reminder?.enabled || habit.archived) return;

            // Skip if already marked today
            if (habit.entries[today]?.status) return;

            // Check if habit is scheduled for today
            if (!isHabitActiveOnDate(habit, now)) return;

            // Check if it's reminder time (exact minute match)
            if (habit.reminder.time === currentTime) {
                sendHabitReminder(habit);
            }
        });
    }

    function sendHabitReminder(habit) {
        const notification = new Notification('Habit Reminder 🔔', {
            body: habit.question || `Time to ${habit.name}!`,
            icon: '/icon.png',
            badge: '/icon.png',
            tag: `habit-${habit.id}`,
            requireInteraction: true,
            actions: [
                { action: 'complete', title: '✓ Done' },
                { action: 'skip', title: '✕ Skip' }
            ]
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
            // Quick complete the habit
            const today = getDateKey(new Date());
            if (!habit.entries[today]) {
                habit.entries[today] = {};
            }
            habit.entries[today].status = 'completed';
            saveState();
            renderDashboard();
            checkMilestones(habit);
        };

        // Auto-close after 30 seconds
        setTimeout(() => notification.close(), 30000);
    }

    // Request permission when reminder toggle is enabled
    const originalReminderToggle = reminderToggle;
    if (originalReminderToggle) {
        originalReminderToggle.addEventListener('click', async () => {
            if (!formState.reminder) {
                // User is enabling reminders
                const granted = await requestNotificationPermission();
                if (!granted) {
                    alert('Please enable notifications in your browser settings to receive habit reminders.');
                }
            }
        });
    }

    // ===== FIREBASE AUTH & SYNC =====
    let currentUser = null;
    const googleSigninBtn = document.getElementById('google-signin-btn');
    const signoutBtn = document.getElementById('signout-btn');
    const signedOutState = document.getElementById('signed-out-state');
    const signedInState = document.getElementById('signed-in-state');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const syncStatus = document.getElementById('sync-status');
    const syncNowBtn = document.getElementById('sync-now-btn');

    // Check if Firebase is available
    function isFirebaseAvailable() {
        return typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0;
    }

    // Initialize Firebase Auth listener
    function initFirebaseAuth() {
        if (!isFirebaseAvailable()) {
            console.log('Firebase not configured');
            return;
        }

        auth.onAuthStateChanged(async (user) => {
            currentUser = user;
            updateAuthUI(user);

            if (user) {
                // User signed in - load cloud data
                await loadFromCloud();
            }
        });
    }

    // Update UI based on auth state
    function updateAuthUI(user) {
        if (!signedOutState || !signedInState) return;

        if (user) {
            signedOutState.style.display = 'none';
            signedInState.style.display = 'flex';
            if (userAvatar) userAvatar.src = user.photoURL || '';
            if (userName) userName.textContent = user.displayName || 'User';
            if (userEmail) userEmail.textContent = user.email || '';
        } else {
            signedOutState.style.display = 'flex';
            signedInState.style.display = 'none';
        }
        lucide.createIcons();
    }

    // Update sync status indicator
    function updateSyncStatus(status) {
        if (!syncStatus) return;

        syncStatus.className = 'sync-status';
        switch (status) {
            case 'syncing':
                syncStatus.classList.add('syncing');
                syncStatus.innerHTML = '<i data-lucide="refresh-cw"></i><span>Syncing...</span>';
                break;
            case 'synced':
                syncStatus.innerHTML = '<i data-lucide="check-circle"></i><span>Synced</span>';
                break;
            case 'error':
                syncStatus.classList.add('error');
                syncStatus.innerHTML = '<i data-lucide="alert-circle"></i><span>Sync Error</span>';
                break;
        }
        lucide.createIcons({ nodes: [syncStatus] });
    }

    // Google Sign In
    async function signInWithGoogle() {
        if (!isFirebaseAvailable()) {
            alert('Firebase is not configured. Please add your Firebase config in firebase-config.js');
            return;
        }

        try {
            await auth.signInWithPopup(googleProvider);
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Sign in failed: ' + error.message);
        }
    }

    // Sign Out
    async function signOut() {
        if (!isFirebaseAvailable()) return;

        try {
            await auth.signOut();
            currentUser = null;
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    // Save habits to Firestore
    async function saveToCloud() {
        if (!currentUser || !isFirebaseAvailable()) return;

        updateSyncStatus('syncing');

        try {
            const userRef = getUserRef(currentUser.uid);
            await userRef.set({
                habits: state.habits,
                categories: state.categories,
                lastSynced: new Date().toISOString()
            }, { merge: true });

            updateSyncStatus('synced');
            console.log('Data saved to cloud');
        } catch (error) {
            console.error('Cloud save error:', error);
            updateSyncStatus('error');
        }
    }

    // Load habits from Firestore
    async function loadFromCloud() {
        if (!currentUser || !isFirebaseAvailable()) return;

        updateSyncStatus('syncing');

        try {
            const userRef = getUserRef(currentUser.uid);
            const doc = await userRef.get();

            if (doc.exists) {
                const cloudData = doc.data();

                // Merge cloud data with local data (cloud wins for conflicts)
                if (cloudData.habits) {
                    state.habits = cloudData.habits;
                }
                if (cloudData.categories) {
                    state.categories = cloudData.categories;
                }

                saveState(); // Save to local storage
                renderDashboard();
            } else {
                // No cloud data - upload local data
                await saveToCloud();
            }

            updateSyncStatus('synced');
        } catch (error) {
            console.error('Cloud load error:', error);
            updateSyncStatus('error');
        }
    }

    // Override saveState to also sync to cloud
    const originalSaveState = saveState;
    saveState = function () {
        originalSaveState();
        // Debounce cloud sync
        if (currentUser && isFirebaseAvailable()) {
            clearTimeout(window.cloudSyncTimeout);
            window.cloudSyncTimeout = setTimeout(saveToCloud, 2000);
        }
    };

    // Bind auth events
    if (googleSigninBtn) {
        googleSigninBtn.addEventListener('click', signInWithGoogle);
    }
    if (signoutBtn) {
        signoutBtn.addEventListener('click', signOut);
    }
    if (syncNowBtn) {
        syncNowBtn.addEventListener('click', async () => {
            if (currentUser) {
                await saveToCloud();
            } else {
                alert('Please sign in to sync your data');
            }
        });
    }

    // Initialize Firebase auth after a short delay
    setTimeout(initFirebaseAuth, 500);

    // ===== WEEKLY REPORT =====
    function openWeeklyReport() {
        const modal = document.getElementById('weekly-report-modal');
        const content = document.getElementById('report-content');
        if (!modal || !content) return;

        // Calculate stats for the last 7 days
        const today = new Date();
        const last7Days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            last7Days.push(getDateKey(d));
        }

        let totalEntries = 0;
        let totalCompleted = 0;
        const habitStats = state.habits.map(habit => {
            let completed = 0;
            let possible = 0;
            last7Days.forEach(dateKey => {
                if (isHabitActiveOnDate(habit, new Date(dateKey))) {
                    possible++;
                    if (habit.entries[dateKey]?.status === 'completed') {
                        completed++;
                        totalCompleted++;
                    }
                }
            });
            totalEntries += possible;
            return {
                name: habit.name,
                completed,
                possible,
                score: possible > 0 ? (completed / possible) * 100 : 0
            };
        });

        // Top Performing
        habitStats.sort((a, b) => b.score - a.score);
        const topHabits = habitStats.slice(0, 3).filter(h => h.score > 0);

        // Needs Focus
        const focusHabits = habitStats.filter(h => h.score < 50 && h.possible > 0).slice(0, 3);

        const overallScore = totalEntries > 0 ? Math.round((totalCompleted / totalEntries) * 100) : 0;

        content.innerHTML = `
            <div class="report-score">
                <div class="score-number">${overallScore}%</div>
                <div class="score-label">Weekly Compliance</div>
            </div>
            
            <div class="report-section">
                <h3>🏆 Top Performing</h3>
                ${topHabits.length > 0 ? `
                    <ul class="report-list">
                        ${topHabits.map(h => `
                            <li>
                                <span>${h.name}</span>
                                <span class="report-val">${Math.round(h.score)}%</span>
                            </li>
                        `).join('')}
                    </ul>
                ` : '<p class="empty-text">No completed habits yet</p>'}
            </div>

            <div class="report-section">
                <h3>🎯 Focus Area</h3>
                ${focusHabits.length > 0 ? `
                    <ul class="report-list">
                        ${focusHabits.map(h => `
                            <li>
                                <span>${h.name}</span>
                                <span class="report-val">${Math.round(h.score)}%</span>
                            </li>
                        `).join('')}
                    </ul>
                ` : '<p class="empty-text">Keep it up!</p>'}
            </div>
        `;

        modal.classList.add('active');
        // Force display flex via style slightly later to ensure transition works if needed
        // but class 'active' should handle it via CSS
    }

    function closeWeeklyReport() {
        const modal = document.getElementById('weekly-report-modal');
        if (modal) modal.classList.remove('active');
    }

    function generateReportText() {
        const today = new Date().toLocaleDateString();
        return `My Niyam Weekly Report (${today})\nCheck out my habit progress!`;
    }

    // ===== START APP =====
    init();
});

