/**
 * Storage Service
 * Handles persistence and migration from legacy data
 */
export const StorageService = {
    KEY: 'sanatan_habit_tracker',

    load() {
        try {
            const raw = localStorage.getItem(this.KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.error('Storage Load Error:', e);
            return null;
        }
    },

    save(state) {
        try {
            // Only persist what's needed, not UI state like loading
            const toSave = {
                habits: state.habits,
                userPoints: state.userPoints,
                theme: state.theme,
                onboardingComplete: state.onboardingComplete
            };
            localStorage.setItem(this.KEY, JSON.stringify(toSave));
        } catch (e) {
            console.error('Storage Save Error:', e);
            // Future: Handler for quota exceeded -> IndexedDB fallback
        }
    },

    /**
     * Check if data is from legacy version and needs migration
     * The legacy app stored everything under 'sanatan_habit_tracker' with a specific shape.
     * We are keeping the same key for now to easily pick up old data,
     * but we might want to migrate it to a cleaner schema.
     */
    checkMigration(data) {
        if (!data) return data;

        // Example migration: ensure habits have IDs (legacy might rely on index)
        if (data.habits) {
            data.habits.forEach(h => {
                if (!h.id) h.id = crypto.randomUUID();
            });
        }

        return data;
    }
};
