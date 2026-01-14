/**
 * Sadhana Guru - Time Utilities
 * Muhurta calculations and time-based logic
 */

const Time = {
    // Muhurta definitions (approximate hours)
    MUHURTAS: [
        { name: 'Brahma', nameHindi: 'ब्रह्म', start: 4, end: 6, desc: 'Hour of creation' },
        { name: 'Pratha', nameHindi: 'प्रातः', start: 6, end: 8, desc: 'Morning' },
        { name: 'Sangava', nameHindi: 'संगव', start: 8, end: 10, desc: 'Gathering time' },
        { name: 'Madhyahna', nameHindi: 'मध्याह्न', start: 10, end: 12, desc: 'Midday' },
        { name: 'Aparahna', nameHindi: 'अपराह्न', start: 12, end: 14, desc: 'Afternoon' },
        { name: 'Sayahna', nameHindi: 'सायह्न', start: 14, end: 16, desc: 'Late afternoon' },
        { name: 'Pradosha', nameHindi: 'प्रदोष', start: 16, end: 18, desc: 'Evening twilight' },
        { name: 'Nishita', nameHindi: 'निशीथ', start: 18, end: 20, desc: 'Night begins' },
        { name: 'Ratri', nameHindi: 'रात्रि', start: 20, end: 4, desc: 'Night' }
    ],

    // Phase cutoffs
    MORNING_CUTOFF: 10,  // Morning phase ends at 10 AM
    EVENING_START: 16,   // Evening phase starts at 4 PM
    DAY_END: 22,         // Day ends at 10 PM (for signing off)

    /**
     * Get current Muhurta
     */
    getCurrentMuhurta() {
        const hour = new Date().getHours();

        for (const muhurta of this.MUHURTAS) {
            if (muhurta.end > muhurta.start) {
                // Normal case (start < end)
                if (hour >= muhurta.start && hour < muhurta.end) {
                    return muhurta;
                }
            } else {
                // Wrapping case (Ratri: 20-4)
                if (hour >= muhurta.start || hour < muhurta.end) {
                    return muhurta;
                }
            }
        }

        // Default fallback
        return this.MUHURTAS[0];
    },

    /**
     * Get current phase: 'pratah' (morning) or 'sayam' (evening)
     */
    getCurrentPhase() {
        const hour = new Date().getHours();

        if (hour < this.MORNING_CUTOFF) {
            return 'pratah';
        } else if (hour >= this.EVENING_START) {
            return 'sayam';
        }

        // Midday - could be either, default to pratah
        return 'pratah';
    },

    /**
     * Check if morning phase is still open
     */
    isMorningOpen() {
        return new Date().getHours() < this.MORNING_CUTOFF;
    },

    /**
     * Check if evening phase is active
     */
    isEveningActive() {
        const hour = new Date().getHours();
        return hour >= this.EVENING_START && hour < this.DAY_END;
    },

    /**
     * Check if day can still be signed off
     */
    canSignOff() {
        return new Date().getHours() < this.DAY_END;
    },

    /**
     * Format date for display
     */
    formatDate(date = new Date()) {
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },

    /**
     * Format short date
     */
    formatShortDate(date = new Date()) {
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        });
    },

    /**
     * Get day of week short name
     */
    getDayName(date = new Date()) {
        return date.toLocaleDateString('en-IN', { weekday: 'short' });
    },

    /**
     * Get start of current week (Sunday)
     */
    getWeekStart(date = new Date()) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    },

    /**
     * Format time
     */
    formatTime(date = new Date()) {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },

    /**
     * Get today's date string (YYYY-MM-DD)
     */
    getTodayString() {
        return new Date().toISOString().split('T')[0];
    },

    /**
     * Check if a date is today
     */
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },

    /**
     * Get relative day description
     */
    getRelativeDay(date) {
        const today = new Date();
        const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));

        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return `${diff} days ago`;

        return this.formatShortDate(date);
    }
};

// Make it globally available
window.Time = Time;
