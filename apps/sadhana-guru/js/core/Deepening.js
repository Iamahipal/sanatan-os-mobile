/**
 * Sadhana Guru - Pratibimba (Reflection Prompts)
 * Weekly self-inquiry questions based on user's practice patterns
 */

const Pratibimba = {
    promptsData: null,

    /**
     * Initialize by loading prompts data
     */
    async init() {
        try {
            const response = await fetch('data/pratibimba.json');
            this.promptsData = await response.json();
        } catch (error) {
            console.error('Failed to load pratibimba data:', error);
            this.promptsData = [];
        }
    },

    /**
     * Get contextual reflection prompt based on user's patterns
     */
    getPrompt() {
        if (!this.promptsData || this.promptsData.length === 0) {
            return this._getDefaultPrompt();
        }

        const context = this._analyzeContext();
        const promptSet = this._findMatchingPrompts(context);

        // Pick random prompt from set
        const prompts = promptSet.prompts;
        return prompts[Math.floor(Math.random() * prompts.length)];
    },

    /**
     * Analyze user's current context
     */
    _analyzeContext() {
        const daysOnPath = State.getDaysOnPath();
        const history = State.getProperty('history') || {};
        const tapasya = State.getProperty('tapasya') || {};

        // Get recent stats
        const recentStats = this._getRecentStats(7);

        // Check for active tapasya
        let tapasyaDay = 0;
        const activeTapasya = Object.values(tapasya).find(t => t.currentDay <= 66);
        if (activeTapasya) {
            tapasyaDay = activeTapasya.currentDay;
        }

        return {
            daysOnPath,
            completionRate: recentStats.completionRate,
            focusedRate: recentStats.focusedRate,
            mechanicalRate: recentStats.mechanicalRate,
            tapasyaDay
        };
    },

    /**
     * Find matching prompts for context
     */
    _findMatchingPrompts(ctx) {
        // Priority order of checks
        if (ctx.tapasyaDay > 50) {
            return this.promptsData.find(p => p.context === 'tapasya_final') || this._getDefaultSet();
        }
        if (ctx.tapasyaDay >= 21 && ctx.tapasyaDay <= 45) {
            return this.promptsData.find(p => p.context === 'tapasya_midway') || this._getDefaultSet();
        }
        if (ctx.daysOnPath < 7) {
            return this.promptsData.find(p => p.context === 'early_journey') || this._getDefaultSet();
        }
        if (ctx.completionRate < 0.4) {
            return this.promptsData.find(p => p.context === 'struggling') || this._getDefaultSet();
        }
        if (ctx.mechanicalRate > 0.5) {
            return this.promptsData.find(p => p.context === 'mechanical_quality') || this._getDefaultSet();
        }
        if (ctx.focusedRate > 0.6) {
            return this.promptsData.find(p => p.context === 'focused_quality') || this._getDefaultSet();
        }
        if (ctx.completionRate >= 0.6) {
            return this.promptsData.find(p => p.context === 'consistency_building') || this._getDefaultSet();
        }

        return this._getDefaultSet();
    },

    _getRecentStats(days) {
        const history = State.getProperty('history') || {};
        const practices = State.getProperty('practices') || [];

        let totalPossible = 0, totalCompleted = 0;
        let focused = 0, mechanical = 0;

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
                    }
                });
            }
        }

        return {
            completionRate: totalPossible > 0 ? totalCompleted / totalPossible : 0,
            focusedRate: totalCompleted > 0 ? focused / totalCompleted : 0,
            mechanicalRate: totalCompleted > 0 ? mechanical / totalCompleted : 0
        };
    },

    _getDefaultSet() {
        return this.promptsData?.find(p => p.context === 'default') || {
            prompts: ["What did you notice in your practice this week?"]
        };
    },

    _getDefaultPrompt() {
        return "What is arising in your practice that wants to be seen?";
    }
};

/**
 * Sadhana Guru - Digital Mauna (Smart Silence)
 * Reduces notifications during sacred times
 */

const DigitalMauna = {
    /**
     * Check if we should be silent (reduce interruptions)
     */
    shouldBeSilent() {
        const reasons = [];

        // Check sacred times
        if (this._isPradosha()) {
            reasons.push('pradosha');
        }

        // Check if user is in a flow state (3+ focused days)
        if (this._isInFlow()) {
            reasons.push('flow_state');
        }

        // Check Ekadashi (11th day of lunar cycle - simplified check)
        if (this._isEkadashi()) {
            reasons.push('ekadashi');
        }

        return {
            silent: reasons.length > 0,
            reasons
        };
    },

    /**
     * Check if it's Pradosha (evening twilight transition)
     */
    _isPradosha() {
        const hour = new Date().getHours();
        // Pradosha is roughly 1.5 hours before and after sunset
        // Simplified: 5:30 PM - 7:30 PM
        return hour >= 17 && hour < 20;
    },

    /**
     * Check if user is in a flow state (consecutive focused days)
     */
    _isInFlow() {
        const history = State.getProperty('history') || {};
        const practices = State.getProperty('practices') || [];

        let consecutiveFocusedDays = 0;
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = history[dateStr];
            if (!dayData || !dayData.entries) break;

            const entries = Object.values(dayData.entries);
            const focused = entries.filter(e => e.done && e.quality === 'focused').length;

            if (focused >= practices.length / 2) {
                consecutiveFocusedDays++;
            } else {
                break;
            }
        }

        return consecutiveFocusedDays >= 3;
    },

    /**
     * Simplified Ekadashi check (11th day of lunar month)
     * In production, would use a proper lunar calendar API
     */
    _isEkadashi() {
        // Simplified: check if day of month is 11 or 26 (roughly)
        const dayOfMonth = new Date().getDate();
        return dayOfMonth === 11 || dayOfMonth === 26;
    },

    /**
     * Get silence message to display
     */
    getSilenceMessage() {
        const status = this.shouldBeSilent();

        if (!status.silent) return null;

        if (status.reasons.includes('pradosha')) {
            return {
                icon: '🌅',
                title: 'Pradosha Kaal',
                message: 'The twilight transition. A time for inner stillness.',
                duration: 'short'
            };
        }

        if (status.reasons.includes('flow_state')) {
            return {
                icon: '🌊',
                title: 'In Flow',
                message: 'You have been focused for 3+ days. The practice is doing itself.',
                duration: 'long'
            };
        }

        if (status.reasons.includes('ekadashi')) {
            return {
                icon: '🌙',
                title: 'Ekadashi',
                message: 'A day for lightness and reflection.',
                duration: 'day'
            };
        }

        return null;
    }
};

/**
 * Sadhana Guru - Adaptive Challenge (Shraddha Scaling)
 * Suggests deepening when user is ready
 */

const AdaptiveChallenge = {
    /**
     * Check if user is ready for a challenge
     */
    isReadyForChallenge() {
        const history = State.getProperty('history') || {};
        const practices = State.getProperty('practices') || [];

        // Need at least 14 days of data
        const historyDates = Object.keys(history).sort().reverse();
        if (historyDates.length < 14) return { ready: false };

        // Check last 14 days
        let perfectDays = 0;
        let highQualityDays = 0;
        const today = new Date();

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = history[dateStr];
            if (!dayData || !dayData.entries) continue;

            const entries = Object.values(dayData.entries);
            const completed = entries.filter(e => e.done).length;
            const focused = entries.filter(e => e.done && e.quality === 'focused').length;

            if (completed === practices.length) perfectDays++;
            if (focused >= completed * 0.7) highQualityDays++;
        }

        // Ready if 80%+ perfect days and high quality
        const ready = perfectDays >= 11 && highQualityDays >= 8;

        return {
            ready,
            perfectDays,
            highQualityDays,
            totalDays: 14
        };
    },

    /**
     * Get challenge suggestions
     */
    getChallengeSuggestions() {
        const practices = State.getProperty('practices') || [];

        return practices.map(practice => ({
            id: practice.id,
            name: practice.name,
            icon: practice.icon,
            challenges: this._getChallengesForPractice(practice.id)
        }));
    },

    _getChallengesForPractice(practiceId) {
        const challengeMap = {
            'brahma': [
                { text: 'Wake 15 minutes earlier', difficulty: 'gentle' },
                { text: 'Add gratitude practice upon waking', difficulty: 'moderate' },
                { text: 'Full silence until sunrise', difficulty: 'intensive' }
            ],
            'surya': [
                { text: 'Add 4 more rounds (16 total)', difficulty: 'gentle' },
                { text: 'Practice with breath awareness', difficulty: 'moderate' },
                { text: 'Complete 24 rounds', difficulty: 'intensive' }
            ],
            'dhyana': [
                { text: 'Add 5 more minutes', difficulty: 'gentle' },
                { text: 'Practice Trataka (candle gazing) first', difficulty: 'moderate' },
                { text: 'Sit for 45 continuous minutes', difficulty: 'intensive' }
            ],
            'japa': [
                { text: 'Add one more mala (216 total)', difficulty: 'gentle' },
                { text: 'Practice with mala internalized', difficulty: 'moderate' },
                { text: 'Complete 3 malas (324 repetitions)', difficulty: 'intensive' }
            ],
            'digital': [
                { text: 'Extend to 12 noon', difficulty: 'gentle' },
                { text: 'One full digital detox day per week', difficulty: 'moderate' },
                { text: 'No screens after 8 PM', difficulty: 'intensive' }
            ]
        };

        return challengeMap[practiceId] || [
            { text: 'Deepen your current practice', difficulty: 'gentle' },
            { text: 'Add conscious breathing', difficulty: 'moderate' },
            { text: 'Double the duration', difficulty: 'intensive' }
        ];
    }
};

// Make globally available
window.Pratibimba = Pratibimba;
window.DigitalMauna = DigitalMauna;
window.AdaptiveChallenge = AdaptiveChallenge;
