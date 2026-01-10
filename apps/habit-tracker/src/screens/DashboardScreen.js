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
                            aria-label="Toggle ${habit.name}">
                        ${isCompleted ? '✓' : isSkipped ? '−' : '○'}
                    </button>
                </div>
                <div class="habit-grid">
                    ${this.renderHeatmap(habit)}
                </div>
            </div>
        `;
    }

    renderHeatmap(habit) {
        const today = new Date();
        const cells = [];

        // Last 52 days
        for (let i = 51; i >= 0; i--) {
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
}
