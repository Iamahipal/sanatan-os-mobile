/**
 * Sadhana Guru - Guru Vakya (Contextual Wisdom)
 * Provides wisdom based on user's practice patterns
 */

const GuruVakya = {
    wisdomData: null,

    /**
     * Initialize by loading wisdom data
     */
    async init() {
        try {
            const response = await fetch('data/wisdom.json');
            this.wisdomData = await response.json();
        } catch (error) {
            console.error('Failed to load wisdom data:', error);
            this.wisdomData = [];
        }
    },

    /**
     * Analyze user's patterns and return appropriate wisdom
     */
    getWisdom() {
        if (!this.wisdomData || this.wisdomData.length === 0) {
            return this._getDefaultWisdom();
        }

        const pattern = this._analyzePattern();
        const wisdomSet = this.wisdomData.find(w => w.pattern === pattern);

        if (!wisdomSet) {
            return this._getDefaultWisdom();
        }

        // Pick random quote from set
        const quotes = wisdomSet.quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        return {
            ...randomQuote,
            pattern: pattern,
            context: wisdomSet.context
        };
    },

    /**
     * Analyze user's practice patterns
     */
    _analyzePattern() {
        const state = State.get();
        const daysOnPath = State.getDaysOnPath();
        const stats = State.getTodayStats();
        const phase = Time.getCurrentPhase();
        const tapasya = state.tapasya || {};

        // Check time of day first
        if (phase === 'pratah' && daysOnPath <= 7) {
            return 'morning';
        }
        if (phase === 'sayam') {
            return 'evening';
        }

        // Check tapasya midway
        const activeTapasya = Object.values(tapasya);
        const midwayTapasya = activeTapasya.find(t => t.currentDay >= 30 && t.currentDay <= 45);
        if (midwayTapasya) {
            return 'tapasya_midway';
        }

        // New user
        if (daysOnPath <= 7) {
            return 'new_journey';
        }

        // Analyze recent history
        const recentStats = this._getRecentStats(7);

        // Low consistency
        if (recentStats.completionRate < 0.5) {
            return 'low_consistency';
        }

        // High mechanical quality
        if (recentStats.mechanicalRate > 0.5) {
            return 'mechanical_quality';
        }

        // High focus
        if (recentStats.focusedRate > 0.6) {
            return 'high_focus';
        }

        // Good consistency
        if (recentStats.completionRate >= 0.7) {
            return 'consistent';
        }

        return 'new_journey';
    },

    /**
     * Get stats for recent days
     */
    _getRecentStats(days) {
        const history = State.getProperty('history') || {};
        const practices = State.getProperty('practices') || [];

        let totalPossible = 0;
        let totalCompleted = 0;
        let focused = 0;
        let mechanical = 0;
        let distracted = 0;

        const today = new Date();
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = history[dateStr];
            if (dayData && dayData.entries) {
                totalPossible += practices.length;

                Object.values(dayData.entries).forEach(entry => {
                    if (entry.done) {
                        totalCompleted++;
                        if (entry.quality === 'focused') focused++;
                        else if (entry.quality === 'mechanical') mechanical++;
                        else if (entry.quality === 'distracted') distracted++;
                    }
                });
            }
        }

        const completionRate = totalPossible > 0 ? totalCompleted / totalPossible : 0;
        const focusedRate = totalCompleted > 0 ? focused / totalCompleted : 0;
        const mechanicalRate = totalCompleted > 0 ? mechanical / totalCompleted : 0;

        return { completionRate, focusedRate, mechanicalRate };
    },

    /**
     * Default wisdom fallback
     */
    _getDefaultWisdom() {
        return {
            text: "The soul is neither born, nor does it ever die. It is unborn, eternal, and primeval.",
            source: "Bhagavad Gita 2.20",
            pattern: "default",
            context: "Universal wisdom"
        };
    }
};

// Make it globally available
window.GuruVakya = GuruVakya;
