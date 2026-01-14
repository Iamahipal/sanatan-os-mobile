/**
 * Sadhana Guru - Storage Service
 * Handles localStorage persistence with structured data
 */

const Storage = {
    STORAGE_KEY: 'sadhanaGuru',
    DATE_KEY: 'sadhanaGuruDate',

    /**
     * Save current state to localStorage
     */
    save() {
        try {
            const state = State.get();

            // Only save persistent data (not UI state)
            const dataToSave = {
                hasVow: state.hasVow,
                signature: state.signature,
                vowDate: state.vowDate,
                practices: state.practices,
                todayIntention: state.todayIntention,
                todayReflection: state.todayReflection,
                todayEntries: state.todayEntries,
                history: state.history,
                tapasya: state.tapasya
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
            localStorage.setItem(this.DATE_KEY, this._getTodayString());

            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },

    /**
     * Load state from localStorage
     */
    load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (!saved) return false;

            const data = JSON.parse(saved);

            // Check if it's a new day
            const savedDate = localStorage.getItem(this.DATE_KEY);
            const today = this._getTodayString();

            if (savedDate !== today) {
                // New day - archive yesterday's data to history
                if (savedDate) {
                    data.history = data.history || {};
                    data.history[savedDate] = {
                        intention: data.todayIntention || null,
                        reflection: data.todayReflection || null,
                        entries: { ...data.todayEntries },
                        signed: true
                    };
                }

                // Reset today's data
                data.todayIntention = null;
                data.todayReflection = null;
                data.todayEntries = {};
                localStorage.setItem(this.DATE_KEY, today);
            }

            // Update state
            State.set(data);

            return true;
        } catch (error) {
            console.error('Storage load error:', error);
            return false;
        }
    },

    /**
     * Clear all stored data
     */
    clear() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.DATE_KEY);
            State.reset();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },

    /**
     * Export data as JSON
     */
    export() {
        const state = State.get();
        return JSON.stringify({
            hasVow: state.hasVow,
            signature: state.signature,
            vowDate: state.vowDate,
            practices: state.practices,
            history: state.history,
            exportDate: new Date().toISOString()
        }, null, 2);
    },

    /**
     * Import data from JSON
     */
    import(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            if (!data.hasVow || !data.vowDate) {
                throw new Error('Invalid data format');
            }

            State.set({
                hasVow: data.hasVow,
                signature: data.signature,
                vowDate: data.vowDate,
                practices: data.practices || State.getProperty('practices'),
                history: data.history || {},
                todayEntries: {}
            });

            this.save();
            return true;
        } catch (error) {
            console.error('Storage import error:', error);
            return false;
        }
    },

    // ===== PRIVATE METHODS =====

    _getTodayString() {
        return new Date().toISOString().split('T')[0];
    }
};

// Auto-save on state changes (debounced)
let saveTimeout = null;
State.subscribe(() => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        Storage.save();
    }, 500);
});

// Make it globally available
window.Storage = Storage;
