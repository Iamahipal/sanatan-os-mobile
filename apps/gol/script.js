/**
 * Sadhan (साधन) - Habit Tracker
 * Plain JavaScript version for Sanatan OS
 * Enhanced with streak tracking, stats, and analytics
 */

// ==================== STATE ====================
const state = {
    habits: [],
    completions: {}, // habitId-date -> boolean
    xp: 0,
    level: 1,
    isGuest: false,
    currentStreak: 0,
    bestStreak: 0
};

// Level thresholds
const LEVELS = {
    1: { name: 'Beginner', threshold: 0 },
    2: { name: 'Seeker', threshold: 100 },
    3: { name: 'Sadhak', threshold: 300 },
    4: { name: 'Yogi', threshold: 600 },
    5: { name: 'Siddha', threshold: 1000 },
    6: { name: 'Rishi', threshold: 1500 },
    7: { name: 'Maharishi', threshold: 2100 },
    8: { name: 'Brahmarishi', threshold: 2800 },
    9: { name: 'Devarishi', threshold: 3600 },
    10: { name: 'Paramhamsa', threshold: 4500 }
};

// Default habits with emojis
const DEFAULT_HABITS = [
    { id: '1', name: 'Exercise', emoji: '💪' },
    { id: '2', name: 'Reading', emoji: '📚' },
    { id: '3', name: 'Meditation', emoji: '🧘' },
    { id: '4', name: 'Water', emoji: '💧' }
];

// ==================== DOM ELEMENTS ====================
const elements = {};

function cacheElements() {
    elements.loginScreen = document.getElementById('login-screen');
    elements.dashboardScreen = document.getElementById('dashboard-screen');
    elements.guestBtn = document.getElementById('guest-btn');
    elements.signOutBtn = document.getElementById('sign-out-btn');
    elements.gridView = document.getElementById('grid-view');
    elements.dashboardView = document.getElementById('dashboard-view');
    elements.statsView = document.getElementById('stats-view');
    elements.btnGrid = document.getElementById('btn-grid');
    elements.btnDashboard = document.getElementById('btn-dashboard');
    elements.btnStats = document.getElementById('btn-stats');
    elements.habitGrid = document.getElementById('habit-grid');
    elements.habitList = document.getElementById('habit-list');
    elements.addHabitBtn = document.getElementById('add-habit-btn');
    elements.addHabitModal = document.getElementById('add-habit-modal');
    elements.habitNameInput = document.getElementById('habit-name-input');
    elements.saveHabitBtn = document.getElementById('save-habit-btn');
    elements.cancelHabitBtn = document.getElementById('cancel-habit-btn');
    elements.levelDisplay = document.getElementById('level-display');
    elements.currentXp = document.getElementById('current-xp');
    elements.nextLevelXp = document.getElementById('next-level-xp');
    elements.xpFill = document.getElementById('xp-fill');
    elements.progressCircle = document.getElementById('progress-circle');
    elements.progressCount = document.getElementById('progress-count');
    elements.progressLabel = document.getElementById('progress-label');
    elements.streakCount = document.getElementById('streak-count');
    elements.bestStreak = document.getElementById('best-streak');
    elements.weeklyBarFill = document.getElementById('weekly-bar-fill');
    elements.weeklyPercent = document.getElementById('weekly-percent');
    elements.activityGraph = document.getElementById('activity-graph');
    elements.statTotalHabits = document.getElementById('stat-total-habits');
    elements.statCompletedToday = document.getElementById('stat-completed-today');
    elements.statTotalCompletions = document.getElementById('stat-total-completions');
    elements.statPerfectDays = document.getElementById('stat-perfect-days');
}

// ==================== INITIALIZATION ====================
function init() {
    cacheElements();
    loadState();
    bindEvents();
    lucide.createIcons();

    if (state.isGuest) {
        showDashboard();
    }
}

function loadState() {
    const saved = localStorage.getItem('sadhan_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
    }

    if (state.habits.length === 0) {
        state.habits = [...DEFAULT_HABITS];
    }

    // Calculate streaks on load
    calculateStreak();
}

function saveState() {
    localStorage.setItem('sadhan_state', JSON.stringify(state));
}

// ==================== EVENT BINDINGS ====================
function bindEvents() {
    // Auth
    elements.guestBtn.addEventListener('click', handleGuestLogin);
    elements.signOutBtn.addEventListener('click', handleSignOut);

    // View toggle
    elements.btnGrid.addEventListener('click', () => switchView('grid'));
    elements.btnDashboard.addEventListener('click', () => switchView('dashboard'));
    elements.btnStats.addEventListener('click', () => switchView('stats'));

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
    localStorage.removeItem('sadhan_state');
    location.reload();
}

function showDashboard() {
    elements.loginScreen.classList.add('hidden');
    elements.dashboardScreen.classList.remove('hidden');
    renderGrid();
    renderDashboardList();
    updateXPBar();
    updateStreakDisplay();
    lucide.createIcons();
}

// ==================== VIEW SWITCHING ====================
function switchView(view) {
    // Hide all views
    elements.gridView.classList.add('hidden');
    elements.dashboardView.classList.add('hidden');
    elements.statsView.classList.add('hidden');

    // Remove active from all buttons
    elements.btnGrid.classList.remove('active');
    elements.btnDashboard.classList.remove('active');
    elements.btnStats.classList.remove('active');

    if (view === 'grid') {
        elements.gridView.classList.remove('hidden');
        elements.btnGrid.classList.add('active');
    } else if (view === 'dashboard') {
        elements.dashboardView.classList.remove('hidden');
        elements.btnDashboard.classList.add('active');
        updateProgressRing();
    } else if (view === 'stats') {
        elements.statsView.classList.remove('hidden');
        elements.btnStats.classList.add('active');
        renderStatsView();
    }
}

// ==================== STREAK CALCULATION ====================
function calculateStreak() {
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);

    // Check consecutive perfect days backwards from today
    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const dayComplete = isDayComplete(dateStr);

        if (dayComplete) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // If today is not complete, check if yesterday started the streak
            if (checkDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
            }
            break;
        }
    }

    state.currentStreak = streak;

    // Update best streak
    if (streak > state.bestStreak) {
        state.bestStreak = streak;
    }
}

function isDayComplete(dateStr) {
    if (state.habits.length === 0) return false;

    for (const habit of state.habits) {
        const key = `${habit.id}-${dateStr}`;
        if (!state.completions[key]) {
            return false;
        }
    }
    return true;
}

function updateStreakDisplay() {
    calculateStreak();
    if (elements.streakCount) {
        elements.streakCount.textContent = state.currentStreak;
    }
    if (elements.bestStreak) {
        elements.bestStreak.textContent = state.bestStreak;
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
        const emoji = habit.emoji || '';
        html += `
            <div class="grid-row">
                <div class="habit-name">${emoji} ${habit.name}</div>
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
        const emoji = habit.emoji || '';

        html += `
            <div class="habit-list-item ${completed ? 'completed' : ''}" 
                 data-habit="${habit.id}" data-date="${today}">
                <div class="habit-checkbox">
                    <i data-lucide="check"></i>
                </div>
                <span class="habit-name">${emoji} ${habit.name}</span>
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
    if (elements.progressCircle) {
        elements.progressCircle.style.strokeDashoffset = offset;
    }

    // Update text
    if (elements.progressCount) {
        elements.progressCount.textContent = `${completed}/${total}`;
    }
    if (elements.progressLabel) {
        elements.progressLabel.textContent = percentage === 100 ? '🎉 Perfect!' : 'Complete';
    }
}

// ==================== STATS VIEW ====================
function renderStatsView() {
    updateWeeklyProgress();
    renderActivityGraph();
    updateStatsGrid();
}

function updateWeeklyProgress() {
    const days = generateDays(7);
    let totalPossible = state.habits.length * 7;
    let totalCompleted = 0;

    days.forEach(d => {
        state.habits.forEach(habit => {
            const key = `${habit.id}-${d.date}`;
            if (state.completions[key]) totalCompleted++;
        });
    });

    const percentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    if (elements.weeklyBarFill) {
        elements.weeklyBarFill.style.width = `${percentage}%`;
    }
    if (elements.weeklyPercent) {
        elements.weeklyPercent.textContent = `${percentage}%`;
    }
}

function renderActivityGraph() {
    const days = generateDays(7);
    const today = new Date().toISOString().split('T')[0];

    let html = '';
    days.forEach(d => {
        let completed = 0;
        state.habits.forEach(habit => {
            const key = `${habit.id}-${d.date}`;
            if (state.completions[key]) completed++;
        });

        const total = state.habits.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        const height = Math.max(4, percentage);
        const isToday = d.date === today;

        html += `
            <div class="activity-bar">
                <div class="bar-value">${completed}/${total}</div>
                <div class="bar-fill ${isToday ? 'today' : ''}" style="height: ${height}px;"></div>
                <span class="bar-label">${d.dayName}</span>
            </div>
        `;
    });

    if (elements.activityGraph) {
        elements.activityGraph.innerHTML = html;
    }
}

function updateStatsGrid() {
    // Total habits
    if (elements.statTotalHabits) {
        elements.statTotalHabits.textContent = state.habits.length;
    }

    // Completed today
    const today = new Date().toISOString().split('T')[0];
    let completedToday = 0;
    state.habits.forEach(habit => {
        const key = `${habit.id}-${today}`;
        if (state.completions[key]) completedToday++;
    });
    if (elements.statCompletedToday) {
        elements.statCompletedToday.textContent = completedToday;
    }

    // Total completions (all time)
    const totalCompletions = Object.values(state.completions).filter(v => v).length;
    if (elements.statTotalCompletions) {
        elements.statTotalCompletions.textContent = totalCompletions;
    }

    // Perfect days count
    const perfectDays = countPerfectDays();
    if (elements.statPerfectDays) {
        elements.statPerfectDays.textContent = perfectDays;
    }
}

function countPerfectDays() {
    const dates = new Set();
    Object.keys(state.completions).forEach(key => {
        const date = key.split('-').slice(1).join('-');
        dates.add(date);
    });

    let perfectCount = 0;
    dates.forEach(dateStr => {
        if (isDayComplete(dateStr)) {
            perfectCount++;
        }
    });

    return perfectCount;
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

    // Recalculate streak
    calculateStreak();

    saveState();
    renderGrid();
    renderDashboardList();
    updateStreakDisplay();
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

    if (elements.levelDisplay) {
        elements.levelDisplay.textContent = `Lv.${state.level} ${current.name}`;
    }
    if (elements.currentXp) {
        elements.currentXp.textContent = `${state.xp} XP`;
    }
    if (elements.nextLevelXp) {
        elements.nextLevelXp.textContent = `${next.threshold} XP`;
    }
    if (elements.xpFill) {
        elements.xpFill.style.width = `${Math.min(progress, 100)}%`;
    }
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
        showBonusToast('🎉 Daily Bonus! +50 XP');
    }
}

function showLevelUpAnimation() {
    showBonusToast(`🎉 Level Up! You're now a ${LEVELS[state.level].name}!`);
}

function showBonusToast(msg) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'bonus-toast';
    toast.textContent = msg;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #22C55E, #4ADE80);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
        z-index: 1000;
        animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Add toast animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes toastIn {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes toastOut {
        from { opacity: 1; }
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);

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

    // Simple emoji detection from start of name
    const emojiMatch = name.match(/^(\p{Emoji}+)\s*/u);
    let emoji = '';
    let habitName = name;

    if (emojiMatch) {
        emoji = emojiMatch[1];
        habitName = name.slice(emojiMatch[0].length);
    }

    const newHabit = {
        id: Date.now().toString(),
        name: habitName || name,
        emoji: emoji
    };

    state.habits.push(newHabit);
    saveState();
    showModal(false);
    renderGrid();
    renderDashboardList();
    updateStatsGrid();
    lucide.createIcons();
}

// ==================== START ====================
document.addEventListener('DOMContentLoaded', init);
