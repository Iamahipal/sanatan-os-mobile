/**
 * DashboardScreen - Main Habit View
 * Shows daily habits with week picker and quote
 */

import { Component } from '../core/Component.js';
import { Store } from '../core/Store.js';
import { navigate } from '../core/Router.js';
import { EventBus, Events } from '../core/EventBus.js';
import { HabitService } from '../services/HabitService.js';
import { QuoteService } from '../services/QuoteService.js';
import { DateUtils } from '../utils/DateUtils.js';

export class DashboardScreen extends Component {
    constructor() {
        super();
        this.selectedDate = Store.getProperty('selectedDate') || new Date();
        this.currentView = 'grid'; // 'grid', 'list', or 'stats'
    }

    template() {
        const quote = QuoteService.getDailyQuote();
        const habits = HabitService.getAll().filter(h => !h.archived);

        return `
            <div class="screen dashboard-screen active">
                <!-- Header -->
                <header class="app-header">
                    <div>
                        <div class="date-label">${DateUtils.format(new Date(), 'long')}</div>
                        <h1 class="header-title">My Habits</h1>
                    </div>
                    <div class="flex gap-2">
                        <button id="settings-btn" class="header-btn" aria-label="Settings">
                            <i data-lucide="settings"></i>
                        </button>
                    </div>
                </header>
                
                <!-- Week Picker -->
                <div class="week-picker" id="week-picker">
                    <div class="week-days">
                        ${this.renderWeekDays()}
                    </div>
                </div>
                
                <!-- Prana Quote -->
                ${quote ? `
                    <div class="card prana-card" style="margin: 0 16px 16px;">
                        <div class="prana-sanskrit">${quote.sanskrit}</div>
                        <div class="prana-translation">${quote.english}</div>
                        <div class="prana-source">— ${quote.source}</div>
                    </div>
                ` : ''}
                
                <!-- Main Content -->
                <main class="screen-content" id="main-content">
                    <div class="habit-list" id="habit-list">
                        ${habits.length > 0
                ? habits.map(h => this.renderHabitCard(h)).join('')
                : this.renderEmptyState()
            }
                    </div>
                </main>
                
                <!-- FAB -->
                <button id="add-fab" class="btn btn-fab" aria-label="Add new habit">
                    <i data-lucide="plus"></i>
                </button>
                
                <!-- Bottom Nav -->
                <nav class="bottom-nav">
                    <button class="nav-tab active" data-view="grid">
                        <i data-lucide="grid-3x3"></i>
                        <span>Grid</span>
                    </button>
                    <button class="nav-tab" data-view="list">
                        <i data-lucide="list"></i>
                        <span>List</span>
                    </button>
                    <button class="nav-tab" data-view="stats">
                        <i data-lucide="bar-chart-3"></i>
                        <span>Stats</span>
                    </button>
                </nav>
            </div>
        `;
    }

    renderWeekDays() {
        const weekDays = DateUtils.getWeekDays(new Date());
        const today = DateUtils.getToday();
        const selectedKey = DateUtils.getDateKey(this.selectedDate);

        return weekDays.map(day => {
            const key = DateUtils.getDateKey(day);
            const isToday = DateUtils.isSameDay(day, today);
            const isSelected = key === selectedKey;

            return `
                <div class="week-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" 
                     data-date="${key}"
                     role="button"
                     aria-label="${DateUtils.format(day, 'long')}"
                     aria-pressed="${isSelected}">
                    <span class="day-name">${DateUtils.getDayName(day, 'short')}</span>
                    <span class="day-num">${day.getDate()}</span>
                </div>
            `;
        }).join('');
    }

    renderHabitCard(habit) {
        const dateKey = DateUtils.getDateKey(this.selectedDate);
        const entry = habit.entries?.[dateKey];
        const isCompleted = entry?.status === 'completed';
        const isSkipped = entry?.status === 'skipped';
        const streak = HabitService.calculateStreak(habit);

        return `
            <div class="habit-card" 
                 data-habit-id="${habit.id}"
                 style="--habit-color: ${habit.color}">
                <div class="habit-header">
                    <div class="habit-info">
                        <div class="habit-icon" style="background: ${habit.color}">
                            <i data-lucide="${habit.icon}"></i>
                        </div>
                        <div>
                            <div class="habit-name">${habit.name}</div>
                            <div class="habit-streak">
                                ${streak > 0
                ? `<span class="streak-fire">🔥</span> ${streak} day streak`
                : 'Start your streak!'}
                            </div>
                        </div>
                    </div>
                    <button class="habit-toggle ${isCompleted ? 'completed' : ''} ${isSkipped ? 'skipped' : ''}"
                            data-action="toggle"
                            data-habit-id="${habit.id}"
                            style="${isCompleted ? `background: ${habit.color}; color: white;` : isSkipped ? 'background: var(--warning); color: white;' : ''}"
                            aria-label="Toggle ${habit.name}">
                        <i data-lucide="${isCompleted ? 'check' : isSkipped ? 'minus' : 'circle'}"></i>
                    </button>
                </div>
                <div class="habit-grid">
                    ${this.renderHeatmap(habit)}
                </div>
            </div>
        `;
    }

    renderHeatmap(habit, compact = true) {
        const today = new Date();
        const cells = [];
        const days = compact ? 90 : 365; // Show 90 days on card, 365 in details

        for (let i = days - 1; i >= 0; i--) {
            const date = DateUtils.addDays(today, -i);
            const key = DateUtils.getDateKey(date);
            const entry = habit.entries?.[key];
            const isCompleted = entry?.status === 'completed';

            cells.push(`
                <div class="grid-cell ${isCompleted ? 'level-4' : ''}" 
                     title="${DateUtils.format(date, 'short')}"></div>
            `);
        }

        return cells.join('');
    }

    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon">✨</div>
                <h2 class="empty-title">No habits yet</h2>
                <p class="empty-text">Create your first habit to start building consistency.</p>
                <button id="create-first-btn" class="btn btn-primary">
                    Create First Habit
                </button>
            </div>
        `;
    }

    afterRender() {
        // Settings
        this.on('#settings-btn', 'click', () => navigate('/settings'));

        // FAB
        this.on('#add-fab', 'click', () => navigate('/add-habit'));

        // Empty state button
        const createBtn = this.find('#create-first-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => navigate('/add-habit'));
        }

        // Week day selection
        this.delegate('click', '.week-day', (e, el) => {
            const dateKey = el.dataset.date;
            this.selectedDate = new Date(dateKey + 'T00:00:00');
            Store.set('selectedDate', this.selectedDate);
            this.refreshHabits();
            this.refreshWeekPicker();
        });

        // Habit card click (open details)
        this.delegate('click', '.habit-card', (e, el) => {
            // Don't navigate if toggle button was clicked
            if (e.target.closest('[data-action="toggle"]')) return;

            const habitId = el.dataset.habitId;
            Store.set('currentHabitId', habitId);
            navigate('/habit-details');
        });

        // Toggle button
        this.delegate('click', '[data-action="toggle"]', (e, el) => {
            e.stopPropagation();
            const habitId = el.dataset.habitId;
            this.toggleHabit(habitId);
        });

        // Listen for habit changes
        const unsubscribe = EventBus.on(Events.HABIT_TOGGLED, () => {
            this.refreshHabits();
        });
        this.registerCleanup(unsubscribe);

        // Nav tab click handlers for view switching
        this.delegate('click', '.nav-tab', (e, el) => {
            const view = el.dataset.view;
            if (view && view !== this.currentView) {
                this.switchView(view);
            }
        });

        // Init Lucide icons
        this.initIcons();
    }

    toggleHabit(habitId) {
        const newStatus = HabitService.toggle(habitId, this.selectedDate);

        // Add animation class
        const card = this.find(`[data-habit-id="${habitId}"]`);
        if (card && newStatus === 'completed') {
            card.classList.add('just-completed');
            setTimeout(() => card.classList.remove('just-completed'), 600);
        }

        // Show toast for milestone
        const habit = HabitService.getById(habitId);
        if (habit && newStatus === 'completed') {
            const streak = HabitService.calculateStreak(habit);
            const milestone = HabitService.getMilestone(streak);
            if (milestone && streak === milestone.days) {
                EventBus.emit(Events.TOAST_SHOW, {
                    message: `${milestone.emoji} ${milestone.name}!`,
                    duration: 3000
                });
            }
        }
    }

    refreshHabits() {
        const list = this.find('#habit-list');
        if (!list) return;

        const habits = HabitService.getAll().filter(h => !h.archived);
        list.innerHTML = habits.length > 0
            ? habits.map(h => this.renderHabitCard(h)).join('')
            : this.renderEmptyState();

        this.initIcons();
    }

    refreshWeekPicker() {
        const picker = this.find('.week-days');
        if (picker) {
            picker.innerHTML = this.renderWeekDays();
        }
    }

    initIcons() {
        if (window.lucide) {
            setTimeout(() => lucide.createIcons(), 10);
        }
    }

    switchView(view) {
        this.currentView = view;

        // Update nav tabs
        this.findAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === view);
        });

        // Show/hide FAB - only visible on Grid view
        const fab = this.find('#add-fab');
        if (fab) {
            fab.style.display = view === 'grid' ? 'flex' : 'none';
        }

        // Update content
        const list = this.find('#habit-list');
        if (!list) return;

        const habits = HabitService.getAll().filter(h => !h.archived);

        if (view === 'list') {
            list.innerHTML = habits.length > 0
                ? this.renderListView(habits)
                : this.renderEmptyState();
        } else if (view === 'stats') {
            list.innerHTML = this.renderStatsView(habits);
        } else {
            // Grid view (default)
            list.innerHTML = habits.length > 0
                ? habits.map(h => this.renderHabitCard(h)).join('')
                : this.renderEmptyState();
        }

        this.initIcons();
    }

    renderListView(habits) {
        return habits.map(habit => {
            const dateKey = DateUtils.getDateKey(this.selectedDate);
            const entry = habit.entries?.[dateKey];
            const isCompleted = entry?.status === 'completed';
            const isSkipped = entry?.status === 'skipped';
            const streak = HabitService.calculateStreak(habit);

            return `
                <div class="list-item" 
                     data-habit-id="${habit.id}"
                     style="--habit-color: ${habit.color}">
                    <div class="list-item-left">
                        <button class="habit-toggle ${isCompleted ? 'completed' : ''} ${isSkipped ? 'skipped' : ''}"
                                data-action="toggle"
                                data-habit-id="${habit.id}"
                                style="background: ${isCompleted ? habit.color : 'var(--bg-level-2)'}"
                                aria-label="Toggle ${habit.name}">
                            ${isCompleted ? '✓' : isSkipped ? '−' : '○'}
                        </button>
                        <div class="list-item-info">
                            <div class="list-item-name">${habit.name}</div>
                            <div class="list-item-streak">
                                ${streak > 0 ? `🔥 ${streak} day streak` : 'Start today!'}
                            </div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" style="color: var(--text-tertiary)"></i>
                </div>
            `;
        }).join('');
    }

    renderStatsView(habits) {
        const totalHabits = habits.length;
        const today = DateUtils.getDateKey(new Date());

        // Calculate today's completion
        let completedToday = 0;
        habits.forEach(habit => {
            if (habit.entries?.[today]?.status === 'completed') {
                completedToday++;
            }
        });

        // Calculate overall stats
        let totalCompletions = 0;
        let longestStreak = 0;

        habits.forEach(habit => {
            const entries = habit.entries || {};
            totalCompletions += Object.values(entries).filter(e => e.status === 'completed').length;
            const streak = HabitService.calculateStreak(habit);
            if (streak > longestStreak) longestStreak = streak;
        });

        const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

        return `
            <div class="stats-container">
                <div class="stats-header">
                    <h2>Today's Progress</h2>
                    <div class="stats-progress-ring">
                        <span class="stats-percentage">${completionRate}%</span>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background: rgba(255, 107, 53, 0.15); color: var(--primary)">
                            <i data-lucide="check-circle-2"></i>
                        </div>
                        <div class="stat-value">${completedToday}/${totalHabits}</div>
                        <div class="stat-label">Completed Today</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: rgba(255, 107, 53, 0.15); color: var(--primary)">
                            <i data-lucide="flame"></i>
                        </div>
                        <div class="stat-value">${longestStreak}</div>
                        <div class="stat-label">Best Streak</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: rgba(48, 209, 88, 0.15); color: var(--success)">
                            <i data-lucide="trophy"></i>
                        </div>
                        <div class="stat-value">${totalCompletions}</div>
                        <div class="stat-label">Total Completions</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: rgba(255, 107, 53, 0.15); color: var(--primary)">
                            <i data-lucide="target"></i>
                        </div>
                        <div class="stat-value">${totalHabits}</div>
                        <div class="stat-label">Active Habits</div>
                    </div>
                </div>
                
                ${totalHabits === 0 ? `
                    <div class="stats-empty">
                        <p>Create habits to see your statistics!</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
}
