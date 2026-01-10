/**
 * DateUtils - Date Manipulation Utilities
 */

export const DateUtils = {
    /**
     * Get date key for storage (YYYY-MM-DD)
     * @param {Date} date
     * @returns {string}
     */
    getDateKey(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Get today's date at midnight
     * @returns {Date}
     */
    getToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    },

    /**
     * Check if two dates are the same day
     * @param {Date} date1
     * @param {Date} date2
     * @returns {boolean}
     */
    isSameDay(date1, date2) {
        return this.getDateKey(date1) === this.getDateKey(date2);
    },

    /**
     * Check if date is today
     * @param {Date} date
     * @returns {boolean}
     */
    isToday(date) {
        return this.isSameDay(date, new Date());
    },

    /**
     * Check if date is in the past
     * @param {Date} date
     * @returns {boolean}
     */
    isPast(date) {
        const today = this.getToday();
        const check = new Date(date);
        check.setHours(0, 0, 0, 0);
        return check < today;
    },

    /**
     * Check if date is in the future
     * @param {Date} date
     * @returns {boolean}
     */
    isFuture(date) {
        const today = this.getToday();
        const check = new Date(date);
        check.setHours(0, 0, 0, 0);
        return check > today;
    },

    /**
     * Get start of week (Sunday)
     * @param {Date} date
     * @returns {Date}
     */
    getStartOfWeek(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - d.getDay());
        return d;
    },

    /**
     * Get array of 7 days for current week
     * @param {Date} date
     * @returns {Array<Date>}
     */
    getWeekDays(date) {
        const start = this.getStartOfWeek(date);
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            days.push(day);
        }
        return days;
    },

    /**
     * Format date for display
     * @param {Date} date
     * @param {string} format - 'short' | 'long' | 'relative'
     * @returns {string}
     */
    format(date, format = 'short') {
        const d = new Date(date);

        switch (format) {
            case 'short':
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            case 'long':
                return d.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                });
            case 'relative':
                if (this.isToday(date)) return 'Today';
                if (this.isSameDay(date, this.addDays(new Date(), -1))) return 'Yesterday';
                if (this.isSameDay(date, this.addDays(new Date(), 1))) return 'Tomorrow';
                return this.format(date, 'short');
            default:
                return d.toLocaleDateString();
        }
    },

    /**
     * Add days to a date
     * @param {Date} date
     * @param {number} days
     * @returns {Date}
     */
    addDays(date, days) {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    },

    /**
     * Get day name
     * @param {Date} date
     * @param {string} format - 'short' | 'long'
     * @returns {string}
     */
    getDayName(date, format = 'short') {
        const options = { weekday: format === 'short' ? 'short' : 'long' };
        return new Date(date).toLocaleDateString('en-US', options);
    },

    /**
     * Get days between two dates
     * @param {Date} start
     * @param {Date} end
     * @returns {number}
     */
    daysBetween(start, end) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((end - start) / oneDay));
    }
};
