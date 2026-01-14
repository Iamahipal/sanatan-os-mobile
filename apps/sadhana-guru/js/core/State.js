/**
 * Sadhana Guru - State Management
 * Simple reactive state with subscribers
 */

const State = {
    // Core state
    _state: {
        // Vow data
        hasVow: false,
        signature: null,
        vowDate: null,

        // Practices (default sankalpas)
        practices: [
            { id: 'brahma', name: 'Brahma Muhurta', desc: 'Rise before sunrise (4:30 - 5:30 AM)', icon: '🌅', anchor: 'On waking' },
            { id: 'surya', name: 'Surya Namaskar', desc: '12 rounds minimum', icon: '🙏', anchor: 'After freshening up' },
            { id: 'dhyana', name: 'Dhyana', desc: '20 minutes meditation', icon: '🧘', anchor: 'After Surya Namaskar' },
            { id: 'japa', name: 'Japa', desc: '108 mantra repetitions', icon: '📿', anchor: 'After meditation' },
            { id: 'digital', name: 'Digital Brahmacharya', desc: 'No social media before 10 AM', icon: '📵', anchor: 'Until 10 AM' }
        ],

        // Today's data
        todayIntention: null,      // Single word intention for the day
        todayReflection: null,     // Evening reflection text
        todayEntries: {},          // { practiceId: { done: bool, quality: string, reason: string, insight: string } }

        // History (by date string)
        history: {},  // { 'YYYY-MM-DD': { intention, reflection, entries, signed } }

        // Tapasya Mode (66-day commitments)
        tapasya: {},  // { practiceId: { startDate, currentDay, automaticityScores: [] } }

        // Current screen
        currentScreen: 'invocation',

        // Current tab
        currentTab: 'pratah'
    },

    // Subscribers for reactivity
    _subscribers: [],

    /**
     * Get current state (readonly)
     */
    get() {
        return { ...this._state };
    },

    /**
     * Get a specific property
     */
    getProperty(key) {
        return this._state[key];
    },

    /**
     * Update state and notify subscribers
     */
    set(updates) {
        const oldState = { ...this._state };
        this._state = { ...this._state, ...updates };

        // Notify subscribers
        this._subscribers.forEach(callback => {
            callback(this._state, oldState);
        });

        return this._state;
    },

    /**
     * Subscribe to state changes
     */
    subscribe(callback) {
        this._subscribers.push(callback);

        // Return unsubscribe function
        return () => {
            const index = this._subscribers.indexOf(callback);
            if (index > -1) {
                this._subscribers.splice(index, 1);
            }
        };
    },

    /**
     * Reset state to defaults
     */
    reset() {
        this._state = {
            hasVow: false,
            signature: null,
            vowDate: null,
            practices: this._state.practices,
            todayIntention: null,
            todayReflection: null,
            todayEntries: {},
            history: {},
            tapasya: {},
            currentScreen: 'invocation',
            currentTab: 'pratah'
        };

        this._subscribers.forEach(callback => {
            callback(this._state, {});
        });
    },

    // ===== CONVENIENCE METHODS =====

    /**
     * Check if today's entries are complete
     */
    isTodayComplete() {
        const practices = this._state.practices;
        const entries = this._state.todayEntries;

        return practices.every(p => entries[p.id] !== undefined);
    },

    /**
     * Get today's completion stats
     */
    getTodayStats() {
        const entries = this._state.todayEntries;
        const total = this._state.practices.length;

        let done = 0;
        let focused = 0;
        let mechanical = 0;
        let distracted = 0;
        let missed = 0;

        Object.values(entries).forEach(entry => {
            if (entry.done) {
                done++;
                if (entry.quality === 'focused') focused++;
                else if (entry.quality === 'mechanical') mechanical++;
                else if (entry.quality === 'distracted') distracted++;
            } else {
                missed++;
            }
        });

        return { total, done, focused, mechanical, distracted, missed };
    },

    /**
     * Get week's data for drishti view
     */
    getWeekData(startDate) {
        const data = [];
        const currentDate = new Date(startDate);

        for (let i = 0; i < 7; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayData = this._state.history[dateStr] || { entries: {}, signed: false };

            data.push({
                date: new Date(currentDate),
                dateStr,
                ...dayData
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return data;
    },

    /**
     * Get days on path count
     */
    getDaysOnPath() {
        if (!this._state.vowDate) return 0;

        const vowDate = new Date(this._state.vowDate);
        const today = new Date();
        const diffTime = Math.abs(today - vowDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    }
};

// Make it globally available
window.State = State;
