/**
 * Date Utilities
 * Centralized date handling to avoid timezone bugs
 */
export const DateUtils = {
    /**
     * Get a standardized date key (YYYY-MM-DD)
     * @param {Date} date 
     * @returns {string} 
     */
    getDateKey(date) {
        if (!date) date = new Date();
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    },

    /**
     * Get start of day (00:00:00)
     * @param {Date} date 
     */
    startOfDay(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    },

    /**
     * Check if two dates are the same day
     */
    isSameDay(d1, d2) {
        return this.getDateKey(d1) === this.getDateKey(d2);
    },

    /**
     * Get array of dates for a week view
     * @param {Date} centerDate 
     */
    getWeekDays(centerDate) {
        const dates = [];
        const start = new Date(centerDate);
        start.setDate(centerDate.getDate() - centerDate.getDay()); // Go to Sunday

        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            dates.push(d);
        }
        return dates;
    },

    /**
     * Get today's date
     */
    getToday() {
        return new Date();
    }
};
