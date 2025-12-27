/**
 * Game of Life - Gamified Habit Tracker
 * Plain JavaScript version for Sanatan OS
 */

// ==================== STATE ====================
const state = {
    habits: [],
    completions: {}, // habitId-date -> boolean
    xp: 0,
    level: 1,
    isGuest: false
};

// Level thresholds
const LEVELS = {
    1: { name: 'Noob', threshold: 0 },
    2: { name: 'Apprentice', threshold: 100 },
    3: { name: 'Warrior', threshold: 300 },
    4: { name: 'Champion', threshold: 600 },
    5: { name: 'Legend', threshold: 1000 },
    6: { name: 'Master', threshold: 1500 },
    7: { name: 'Grandmaster', threshold: 2100 },
    8: { name: 'Immortal', threshold: 2800 },
    9: { name: 'Divine', threshold: 3600 },
    10: { name: 'Ascended', threshold: 4500 }
};

// Default habits
const DEFAULT_HABITS = [
    { id: '1', name: 'Exercise' },
    { id: '2', name: 'Reading' },
    { id: '3', name: 'Meditation' },
    { id: '4', name: 'Water' }
];

// ==================== DOM ELEMENTS ====================
const elements = {
    loginScreen: document.getElementById('login-screen'),
    dashboardScreen: document.getElementById('dashboard-screen'),
    guestBtn: document.getElementById('guest-btn'),
    signOutBtn: document.getElementById('sign-out-btn'),
    gridView: document.getElementById('grid-view'),
    dashboardView: document.getElementById('dashboard-view'),
    btnGrid: document.getElementById('btn-grid'),
    btnDashboard: document.getElementById('btn-dashboard'),
    habitGrid: document.getElementById('habit-grid'),
    habitList: document.getElementById('habit-list'),
    addHabitBtn: document.getElementById('add-habit-btn'),
    addHabitModal: document.getElementById('add-habit-modal'),
    habitNameInput: document.getElementById('habit-name-input'),
    saveHabitBtn: document.getElementById('save-habit-btn'),
    cancelHabitBtn: document.getElementById('cancel-habit-btn'),
    levelDisplay: document.getElementById('level-display'),
    currentXp: document.getElementById('current-xp'),
    nextLevelXp: document.getElementById('next-level-xp'),
    xpFill: document.getElementById('xp-fill'),
    progressCircle: document.getElementById('progress-circle'),
    progressCount: document.getElementById('progress-count'),
    progressLabel: document.getElementById('progress-label')
};

// ==================== INITIALIZATION ====================
function init() {
    loadState();
    bindEvents();
    lucide.createIcons();

    if (state.isGuest) {
        showDashboard();
    }
}

function loadState() {
    const saved = localStorage.getItem('gol_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
    }

    if (state.habits.length === 0) {
        state.habits = [...DEFAULT_HABITS];
    }
}

function saveState() {
    localStorage.setItem('gol_state', JSON.stringify(state));
}

// ==================== EVENT BINDINGS ====================
function bindEvents() {
    // Auth
    elements.guestBtn.addEventListener('click', handleGuestLogin);
    elements.signOutBtn.addEventListener('click', handleSignOut);

    // View toggle
    elements.btnGrid.addEventListener('click', () => switchView('grid'));
    elements.btnDashboard.addEventListener('click', () => switchView('dashboard'));

    // Add habit
    elements.addHabitBtn.addEventListener('click', () => showModal(true));
    elements.cancelHabitBtn.addEventListener('click', () => showModal(false));
    elements.saveHabitBtn.addEventListener('click', handleAddHabit);
    elements.addHabitModal.addEventListener('click', (e) => {
        if (e.target === elements.addHabitModal) showModal(false);
    });
}

// ==================== AUTH ====================
function handleGuestLogin() {
    state.isGuest = true;
    saveState();
    showDashboard();
}

function handleSignOut() {
    state.isGuest = false;
    localStorage.removeItem('gol_state');
    location.reload();
}

function showDashboard() {
    elements.loginScreen.classList.add('hidden');
    elements.dashboardScreen.classList.remove('hidden');
    renderGrid();
    renderDashboardList();
    updateXPBar();
    lucide.createIcons();
}

// ==================== VIEW SWITCHING ====================
function switchView(view) {
    if (view === 'grid') {
        elements.gridView.classList.remove('hidden');
        elements.dashboardView.classList.add('hidden');
        elements.btnGrid.classList.add('active');
        elements.btnDashboard.classList.remove('active');
    } else {
        elements.gridView.classList.add('hidden');
        elements.dashboardView.classList.remove('hidden');
        elements.btnGrid.classList.remove('active');
        elements.btnDashboard.classList.add('active');
        updateProgressRing();
    }
}

// ==================== GRID RENDERING ====================
function renderGrid() {
    const days = generateDays(14);
    const today = new Date().toISOString().split('T')[0];

    let html = `
        <div class="grid-row grid-header">
            <div class="habit-name">Habits</div>
            ${days.map(d => `
                <div class="day-header">
                    <div class="day-name">${d.dayName}</div>
                    <div class="day-num">${d.dayNum}</div>
                </div>
            `).join('')}
        </div>
    `;

    state.habits.forEach(habit => {
        html += `
            <div class="grid-row">
                <div class="habit-name">${habit.name}</div>
                ${days.map(d => {
            const key = `${habit.id}-${d.date}`;
            const completed = state.completions[key] || false;
            const isToday = d.date === today;
            return `
                        <div class="habit-cell ${completed ? 'completed' : ''} ${isToday ? 'today' : ''}" 
                             data-habit="${habit.id}" data-date="${d.date}">
                            ${completed ? '<i data-lucide="check"></i>' : ''}
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    });

    elements.habitGrid.innerHTML = html;
    lucide.createIcons();

    // Bind cell clicks
    document.querySelectorAll('.habit-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            toggleHabit(cell.dataset.habit, cell.dataset.date);
        });
    });
}

function generateDays(count) {
    const days = [];
    const today = new Date();

    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        days.push({
            date: date.toISOString().split('T')[0],
            dayName: date.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2),
            dayNum: date.getDate()
        });
    }

    return days;
}

// ==================== DASHBOARD RENDERING ====================
function renderDashboardList() {
    const today = new Date().toISOString().split('T')[0];

    let html = '';
    state.habits.forEach(habit => {
        const key = `${habit.id}-${today}`;
        const completed = state.completions[key] || false;

        html += `
            <div class="habit-list-item ${completed ? 'completed' : ''}" 
                 data-habit="${habit.id}" data-date="${today}">
                <div class="habit-checkbox">
                    <i data-lucide="check"></i>
                </div>
                <span class="habit-name">${habit.name}</span>
                <span class="habit-xp">+10 XP</span>
            </div>
        `;
    });

    elements.habitList.innerHTML = html;
    lucide.createIcons();

    // Bind item clicks
    document.querySelectorAll('.habit-list-item').forEach(item => {
        item.addEventListener('click', () => {
            toggleHabit(item.dataset.habit, item.dataset.date);
        });
    });

    updateProgressRing();
}

function updateProgressRing() {
    const today = new Date().toISOString().split('T')[0];
    let completed = 0;

    state.habits.forEach(habit => {
        const key = `${habit.id}-${today}`;
        if (state.completions[key]) completed++;
    });

    const total = state.habits.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    // Update ring
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (percentage / 100) * circumference;
    elements.progressCircle.style.strokeDashoffset = offset;

    // Update text
    elements.progressCount.textContent = `${completed}/${total}`;
    elements.progressLabel.textContent = percentage === 100 ? '🎉 Perfect!' : 'Complete';
}

// ==================== HABIT ACTIONS ====================
function toggleHabit(habitId, date) {
    const key = `${habitId}-${date}`;
    const wasCompleted = state.completions[key] || false;

    // Toggle
    state.completions[key] = !wasCompleted;

    // XP logic
    const today = new Date().toISOString().split('T')[0];
    if (date === today) {
        if (!wasCompleted) {
            addXP(10);
            checkDailyBonus();
        } else {
            addXP(-10);
        }
    }

    saveState();
    renderGrid();
    renderDashboardList();
}

// ==================== XP SYSTEM ====================
function addXP(amount) {
    state.xp = Math.max(0, state.xp + amount);
    updateLevel();
    updateXPBar();
    saveState();
}

function updateLevel() {
    let newLevel = 1;
    for (let lvl = 10; lvl >= 1; lvl--) {
        if (state.xp >= LEVELS[lvl].threshold) {
            newLevel = lvl;
            break;
        }
    }

    if (newLevel > state.level) {
        // Level up!
        state.level = newLevel;
        showLevelUpAnimation();
    }
    state.level = newLevel;
}

function updateXPBar() {
    const current = LEVELS[state.level];
    const next = LEVELS[state.level + 1] || { threshold: current.threshold + 500 };

    const progress = ((state.xp - current.threshold) / (next.threshold - current.threshold)) * 100;

    elements.levelDisplay.textContent = `Lv.${state.level} ${current.name}`;
    elements.currentXp.textContent = `${state.xp} XP`;
    elements.nextLevelXp.textContent = `${next.threshold} XP`;
    elements.xpFill.style.width = `${Math.min(progress, 100)}%`;
}

function checkDailyBonus() {
    const today = new Date().toISOString().split('T')[0];
    let allComplete = true;

    state.habits.forEach(habit => {
        const key = `${habit.id}-${today}`;
        if (!state.completions[key]) {
            allComplete = false;
        }
    });

    if (allComplete && state.habits.length > 0) {
        // 100% daily completion bonus!
        addXP(50);
        showBonusMessage('Daily Bonus! +50 XP');
    }
}

function showLevelUpAnimation() {
    // Simple celebration - could add confetti later
    alert(`🎉 Level Up! You're now a ${LEVELS[state.level].name}!`);
}

function showBonusMessage(msg) {
    alert(`✨ ${msg}`);
}

// ==================== ADD HABIT ====================
function showModal(show) {
    if (show) {
        elements.addHabitModal.classList.remove('hidden');
        elements.habitNameInput.value = '';
        elements.habitNameInput.focus();
    } else {
        elements.addHabitModal.classList.add('hidden');
    }
}

function handleAddHabit() {
    const name = elements.habitNameInput.value.trim();
    if (!name) return;

    const newHabit = {
        id: Date.now().toString(),
        name: name
    };

    state.habits.push(newHabit);
    saveState();
    showModal(false);
    renderGrid();
    renderDashboardList();
    lucide.createIcons();
}

// ==================== START ====================
document.addEventListener('DOMContentLoaded', init);
