/**
 * HabitService - Habit Management
 * CRUD operations, toggle, and streak calculations
 */

import { Store } from '../core/Store.js';
import { EventBus, Events } from '../core/EventBus.js';
import { StorageService } from './StorageService.js';
import { DateUtils } from '../utils/DateUtils.js';

export const HabitService = {
    /**
     * Get all habits
     * @returns {Array}
     */
    getAll() {
        return Store.getProperty('habits') || [];
    },

    /**
     * Get habit by ID
     * @param {string} id
     * @returns {Object|null}
     */
    getById(id) {
        return this.getAll().find(h => h.id === id) || null;
    },

    /**
     * Create a new habit
     * @param {Object} data
     * @returns {Object}
     */
    create(data) {
        const habit = {
            id: crypto.randomUUID(),
            name: data.name,
            question: data.question || `Did you ${data.name.toLowerCase()} today?`,
            type: data.type || 'boolean',
            icon: data.icon || 'sun',
            color: data.color || '#0A84FF',
            target: data.target || null,
            frequency: data.frequency || { type: 'everyday' },
            reminder: data.reminder || { enabled: false, time: '09:00' },
            category: data.category || null,
            showOnTimeline: data.showOnTimeline !== false,
            createdAt: new Date().toISOString(),
            entries: {}
        };

        const habits = [...this.getAll(), habit];
        this._updateHabits(habits);

        EventBus.emit(Events.HABIT_CREATED, habit);
        return habit;
    },

    /**
     * Update a habit
     * @param {string} id
     * @param {Object} updates
     * @returns {Object|null}
     */
    update(id, updates) {
        const habits = this.getAll().map(h =>
            h.id === id ? { ...h, ...updates } : h
        );

        const updated = habits.find(h => h.id === id);
        if (updated) {
            this._updateHabits(habits);
            EventBus.emit(Events.HABIT_UPDATED, updated);
        }

        return updated;
    },

    /**
     * Delete a habit
     * @param {string} id
     */
    delete(id) {
        const habits = this.getAll().filter(h => h.id !== id);
        this._updateHabits(habits);
        EventBus.emit(Events.HABIT_DELETED, { id });
    },

    /**
     * Archive a habit (soft delete)
     * @param {string} id
     */
    archive(id) {
        this.update(id, { archived: true, archivedAt: new Date().toISOString() });
    },

    /**
     * Toggle habit completion for a date
     * @param {string} habitId
     * @param {Date} date
     * @returns {string} New status
     */
    toggle(habitId, date = new Date()) {
        const dateKey = DateUtils.getDateKey(date);
        const habits = this.getAll();
        let newStatus = null;

        const updated = habits.map(h => {
            if (h.id !== habitId) return h;

            const entries = { ...h.entries };
            const current = entries[dateKey]?.status;

            if (current === 'completed') {
                // Completed -> Skipped
                entries[dateKey] = { ...entries[dateKey], status: 'skipped' };
                newStatus = 'skipped';
            } else if (current === 'skipped') {
                // Skipped -> None (remove entry)
                delete entries[dateKey];
                newStatus = null;
            } else {
                // None -> Completed
                entries[dateKey] = {
                    status: 'completed',
                    timestamp: Date.now()
                };
                newStatus = 'completed';
            }

            return { ...h, entries };
        });

        this._updateHabits(updated);
        EventBus.emit(Events.HABIT_TOGGLED, { habitId, date, status: newStatus });

        return newStatus;
    },

    /**
     * Mark habit as completed with optional value
     * @param {string} habitId
     * @param {Date} date
     * @param {Object} data - { value, note }
     */
    markComplete(habitId, date, data = {}) {
        const dateKey = DateUtils.getDateKey(date);
        const habits = this.getAll().map(h => {
            if (h.id !== habitId) return h;

            const entries = { ...h.entries };
            entries[dateKey] = {
                status: 'completed',
                timestamp: Date.now(),
                value: data.value,
                note: data.note
            };

            return { ...h, entries };
        });

        this._updateHabits(habits);
        EventBus.emit(Events.HABIT_TOGGLED, { habitId, date, status: 'completed' });
    },

    /**
     * Calculate current streak for a habit
     * @param {Object} habit
     * @returns {number}
     */
    calculateStreak(habit) {
        if (!habit?.entries) return 0;

        let streak = 0;
        const today = DateUtils.getToday();
        const todayKey = DateUtils.getDateKey(today);

        // Check if today is completed or if we should start from yesterday
        let current = new Date(today);
        if (!habit.entries[todayKey]?.status) {
            current.setDate(current.getDate() - 1);
        }

        // Count consecutive completed days
        while (true) {
            const key = DateUtils.getDateKey(current);

            if (habit.entries[key]?.status === 'completed') {
                streak++;
                current.setDate(current.getDate() - 1);
            } else {
                break;
            }

            // Safety limit
            if (streak > 1000) break;
        }

        return streak;
    },

    /**
     * Get completion stats for a habit
     * @param {Object} habit
     * @param {string} period - 'week' | 'month' | 'year' | 'all'
     * @returns {Object}
     */
    getStats(habit, period = 'month') {
        if (!habit?.entries) return { completed: 0, total: 0, rate: 0 };

        const today = DateUtils.getToday();
        let startDate = new Date(today);

        switch (period) {
            case 'week':
                startDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(today.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(today.getFullYear() - 1);
                break;
            case 'all':
                startDate = new Date(habit.createdAt);
                break;
        }

        let completed = 0;
        let total = 0;

        const current = new Date(startDate);
        while (current <= today) {
            if (this.isActiveOnDate(habit, current)) {
                total++;
                const key = DateUtils.getDateKey(current);
                if (habit.entries[key]?.status === 'completed') {
                    completed++;
                }
            }
            current.setDate(current.getDate() + 1);
        }

        return {
            completed,
            total,
            rate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    },

    /**
     * Check if habit is active on a specific date
     * @param {Object} habit
     * @param {Date} date
     * @returns {boolean}
     */
    isActiveOnDate(habit, date) {
        if (!habit.frequency) return true;

        const day = date.getDay();

        switch (habit.frequency.type) {
            case 'everyday':
                return true;
            case 'specific':
                return habit.frequency.days?.includes(day);
            case 'x_per_week':
                // For x_per_week, we just check if it's a weekday
                // More sophisticated logic could be added
                return true;
            default:
                return true;
        }
    },

    /**
     * Get habits for today (filtered by frequency)
     * @returns {Array}
     */
    getTodayHabits() {
        const today = new Date();
        return this.getAll()
            .filter(h => !h.archived)
            .filter(h => this.isActiveOnDate(h, today));
    },

    /**
     * Get milestone for current streak
     * @param {number} streak
     * @returns {Object|null}
     */
    getMilestone(streak) {
        const milestones = [
            { days: 7, name: 'Week Warrior', emoji: '🌱' },
            { days: 21, name: 'Habit Builder', emoji: '🌿' },
            { days: 30, name: 'Monthly Master', emoji: '🌳' },
            { days: 66, name: 'Habit Formed', emoji: '💪' },
            { days: 100, name: 'Century Legend', emoji: '🏆' },
            { days: 365, name: 'Year Champion', emoji: '👑' }
        ];

        for (let i = milestones.length - 1; i >= 0; i--) {
            if (streak >= milestones[i].days) {
                return milestones[i];
            }
        }
        return null;
    },

    /**
     * Internal: Update habits in store and persist
     */
    _updateHabits(habits) {
        Store.set('habits', habits);
        StorageService.save(Store.getPersistedState());
    }
};
