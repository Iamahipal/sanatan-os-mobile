import { store } from '../core/Store.js';
import { StorageService } from './StorageService.js';
import { DateUtils } from '../utils/DateUtils.js';

/**
 * Habit Service
 * Handles all business logic for habits (CRUD, Toggling, Streaks)
 */
export const HabitService = {

    /**
     * Create a new habit
     * @param {string} name 
     * @param {string} icon 
     * @param {string} color 
     */
    createHabit(name, icon = 'sun', color = '#0A84FF') {
        const newHabit = {
            id: crypto.randomUUID(),
            name,
            icon,
            color,
            createdAt: new Date().toISOString(),
            entries: {}, // { '2024-01-01': { status: 'completed' } }
            frequency: { type: 'everyday' },
            reminder: { enabled: false }
        };

        const habits = [...store.get().habits, newHabit];
        this.updateHabits(habits);
        return newHabit;
    },

    /**
     * Toggle habit status for a date
     * @param {string} habitId 
     * @param {Date} date 
     */
    toggleHabit(habitId, date) {
        const state = store.get();
        const dateKey = DateUtils.getDateKey(date);

        const updatedHabits = state.habits.map(h => {
            if (h.id !== habitId) return h;

            const entries = { ...h.entries };
            const currentStatus = entries[dateKey]?.status;

            if (currentStatus === 'completed') {
                delete entries[dateKey]; // Unmark
            } else {
                entries[dateKey] = { status: 'completed', timestamp: Date.now() };
            }

            return { ...h, entries };
        });

        this.updateHabits(updatedHabits);
    },

    /**
     * Calculate current streak
     * @param {Object} habit 
     */
    calculateStreak(habit) {
        let streak = 0;
        const today = DateUtils.getToday();
        const dateKey = DateUtils.getDateKey(today);

        // If done today, start from today. If not, start from yesterday.
        let current = habit.entries[dateKey] ? today : new Date(today.setDate(today.getDate() - 1));

        while (true) {
            const key = DateUtils.getDateKey(current);
            if (habit.entries[key]?.status === 'completed') {
                streak++;
                current.setDate(current.getDate() - 1); // Go back one day
            } else {
                break;
            }
        }
        return streak;
    },

    /**
     * Internal helper to update store and storage
     */
    updateHabits(newHabits) {
        store.set('habits', newHabits);
        StorageService.save(store.get());
    },

    /**
     * Update an existing habit
     * @param {string} id 
     * @param {Object} updates 
     */
    updateHabit(id, updates) {
        const habits = store.get().habits.map(h =>
            h.id === id ? { ...h, ...updates } : h
        );
        this.updateHabits(habits);
    },

    /**
     * Delete a habit
     * @param {string} id 
     */
    deleteHabit(id) {
        const habits = store.get().habits.filter(h => h.id !== id);
        this.updateHabits(habits);
    },

    /**
     * Archive a habit (soft delete)
     * @param {string} id 
     */
    archiveHabit(id) {
        this.updateHabit(id, { archived: true });
    }
};
