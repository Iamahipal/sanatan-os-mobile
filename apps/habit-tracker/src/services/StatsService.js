import { DateUtils } from '../utils/DateUtils.js';

/**
 * Stats Service
 * Pure functions to calculate analytics from habit data
 */
export const StatsService = {

    /**
     * Calculate completion percentage for a specific date
     * @param {Array} habits 
     * @param {Date} date 
     */
    getDailyCompletion(habits, date) {
        const dateKey = DateUtils.getDateKey(date);

        // Filter habits active on this day (simplified for now: all habits are active everyday)
        // Future: Check habit.frequency.days
        const activeHabits = habits.filter(h => !h.archived);

        if (activeHabits.length === 0) return 0;

        const completedCount = activeHabits.filter(h => {
            return h.entries[dateKey]?.status === 'completed';
        }).length;

        return Math.round((completedCount / activeHabits.length) * 100);
    },

    /**
     * Get total check-ins across all time
     */
    getTotalCheckins(habits) {
        return habits.reduce((total, h) => {
            return total + Object.keys(h.entries).length;
        }, 0);
    },

    /**
     * Get best streak among all habits
     */
    getBestStreak(habits) {
        // This requires expensive calculation if not cached. 
        // For now, return placeholder or simple logic
        return 0;
    }
};
