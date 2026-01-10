/**
 * Sant Darshan App - Date Utilities
 * Date manipulation and formatting helpers
 */

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 * @returns {string}
 */
export function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get current timestamp
 * @returns {number}
 */
export function now() {
    return Date.now();
}

/**
 * Get day of year (1-366)
 * @param {Date} date - Date object (default: today)
 * @returns {number}
 */
export function getDayOfYear(date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Format date for display
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
    const d = date instanceof Date ? date : new Date(date);

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
    };

    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(d);
}

/**
 * Format date as relative time (e.g., "2 days ago")
 * @param {Date|string|number} date - Date to format
 * @returns {string}
 */
export function formatRelative(date) {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Get days until a future date
 * @param {Date|string} futureDate - Target date
 * @returns {number} Days until (negative if past)
 */
export function daysUntil(futureDate) {
    const target = futureDate instanceof Date ? futureDate : new Date(futureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffMs = target - today;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format days until as human readable
 * @param {number} days - Number of days
 * @returns {string}
 */
export function formatDaysUntil(days) {
    if (days === 0) return 'Today!';
    if (days === 1) return 'Tomorrow!';
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days < 7) return `In ${days} days`;
    if (days < 30) return `In ${Math.floor(days / 7)} weeks`;
    if (days < 365) return `In ${Math.floor(days / 30)} months`;
    return `In ${Math.floor(days / 365)} years`;
}

/**
 * Check if two dates are the same day
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

/**
 * Check if date is today
 * @param {Date|string} date
 * @returns {boolean}
 */
export function isToday(date) {
    const d = date instanceof Date ? date : new Date(date);
    return isSameDay(d, new Date());
}

/**
 * Check if date is yesterday
 * @param {Date|string} date
 * @returns {boolean}
 */
export function isYesterday(date) {
    const d = date instanceof Date ? date : new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(d, yesterday);
}

/**
 * Get array of dates for calendar display
 * @param {number} days - Number of days to include
 * @param {Date} startDate - Start date (default: today - days)
 * @returns {Array<{date: Date, dateString: string}>}
 */
export function getCalendarDates(days = 28, startDate = null) {
    const dates = [];
    const start = startDate || new Date();

    // If no startDate, go back 'days' from today
    if (!startDate) {
        start.setDate(start.getDate() - days + 1);
    }

    for (let i = 0; i < days; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push({
            date,
            dateString: date.toISOString().split('T')[0],
            dayOfWeek: date.getDay(),
            dayOfMonth: date.getDate(),
            isToday: isToday(date)
        });
    }

    return dates;
}

/**
 * Get month name
 * @param {number} month - Month index (0-11)
 * @param {boolean} short - Use short name
 * @returns {string}
 */
export function getMonthName(month, short = false) {
    const date = new Date(2000, month, 1);
    return new Intl.DateTimeFormat('en-IN', {
        month: short ? 'short' : 'long'
    }).format(date);
}

/**
 * Get weekday name
 * @param {number} day - Day index (0-6, 0 = Sunday)
 * @param {boolean} short - Use short name
 * @returns {string}
 */
export function getWeekdayName(day, short = true) {
    const date = new Date(2000, 0, 2 + day); // Jan 2, 2000 was a Sunday
    return new Intl.DateTimeFormat('en-IN', {
        weekday: short ? 'short' : 'long'
    }).format(date);
}

/**
 * Parse ISO date string safely
 * @param {string} dateString - ISO date string
 * @returns {Date|null}
 */
export function parseDate(dateString) {
    if (!dateString || typeof dateString !== 'string') {
        return null;
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
}

/**
 * Calculate Jayanti date for current year
 * Based on Hindu lunar calendar approximation
 * @param {Object} jayanti - Jayanti definition with month, tithi, etc.
 * @returns {Date|null}
 */
export function calculateJayantiDate(jayanti) {
    // This is a simplified calculation
    // For accurate lunar dates, you'd need a proper panchang library

    if (!jayanti || !jayanti.month || jayanti.tithi === undefined) {
        return null;
    }

    const currentYear = new Date().getFullYear();
    const lunarMonthOffset = jayanti.month - 1; // 0-indexed

    // Approximate: Hindu months roughly align with Gregorian months
    // with about 15-20 day offset. Tithi roughly adds 0-30 days
    const baseMonth = (lunarMonthOffset + 2) % 12; // Approximate alignment
    const baseDay = Math.min(28, jayanti.tithi);

    try {
        const date = new Date(currentYear, baseMonth, baseDay);
        return date;
    } catch {
        return null;
    }
}

/**
 * Check if streak is maintained (consecutive days)
 * @param {string} lastDateString - Last activity date (YYYY-MM-DD)
 * @returns {boolean}
 */
export function isStreakMaintained(lastDateString) {
    if (!lastDateString) return false;

    const lastDate = parseDate(lastDateString);
    if (!lastDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    // Streak is maintained if last activity was today or yesterday
    return diffDays <= 1;
}
