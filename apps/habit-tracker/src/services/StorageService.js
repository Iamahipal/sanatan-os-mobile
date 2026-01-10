/**
 * StorageService - Persistence Layer
 * LocalStorage with IndexedDB fallback for large data
 */

const STORAGE_KEY = 'niyam_app';
const DB_NAME = 'NiyamDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';

let db = null;

/**
 * Initialize IndexedDB
 */
async function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

export const StorageService = {
    /**
     * Initialize storage (call on app start)
     */
    async init() {
        try {
            await initIndexedDB();
            console.log('IndexedDB initialized');
        } catch (error) {
            console.warn('IndexedDB unavailable, using localStorage only:', error);
        }
    },

    /**
     * Load state from storage
     * @returns {Object|null}
     */
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;

            const data = JSON.parse(raw);
            return this.migrate(data);
        } catch (error) {
            console.error('Storage load error:', error);
            return null;
        }
    },

    /**
     * Save state to storage with debouncing
     * @param {Object} state
     */
    save(state) {
        // Clear any pending save
        if (this._saveTimeout) {
            clearTimeout(this._saveTimeout);
        }

        // Debounce saves by 300ms
        this._saveTimeout = setTimeout(() => {
            this._doSave(state);
        }, 300);
    },

    /**
     * Immediate save (bypasses debounce)
     * @param {Object} state
     */
    saveNow(state) {
        if (this._saveTimeout) {
            clearTimeout(this._saveTimeout);
        }
        this._doSave(state);
    },

    /**
     * Internal save implementation
     */
    _doSave(state) {
        try {
            const toSave = {
                habits: state.habits || [],
                categories: state.categories || [],
                theme: state.theme || 'dark',
                onboardingComplete: state.onboardingComplete || false,
                version: 2
            };

            const json = JSON.stringify(toSave);
            localStorage.setItem(STORAGE_KEY, json);

        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.warn('LocalStorage quota exceeded, falling back to IndexedDB');
                this._saveToIndexedDB(state);
            } else {
                console.error('Storage save error:', error);
            }
        }
    },

    /**
     * Save to IndexedDB (fallback)
     */
    async _saveToIndexedDB(state) {
        if (!db) return;

        try {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            await store.put({ id: 'app_state', ...state });
        } catch (error) {
            console.error('IndexedDB save error:', error);
        }
    },

    /**
     * Migrate data from older versions
     * @param {Object} data
     * @returns {Object}
     */
    migrate(data) {
        if (!data) return null;

        // Version 1 -> 2: Ensure habits have IDs
        if (!data.version || data.version < 2) {
            if (data.habits) {
                data.habits = data.habits.map(habit => ({
                    ...habit,
                    id: habit.id || crypto.randomUUID(),
                    entries: habit.entries || {},
                    frequency: habit.frequency || { type: 'everyday' }
                }));
            }
            data.version = 2;
        }

        return data;
    },

    /**
     * Export data as JSON
     * @returns {string}
     */
    export() {
        const data = this.load();
        return JSON.stringify(data, null, 2);
    },

    /**
     * Import data from JSON
     * @param {string} json
     * @returns {boolean}
     */
    import(json) {
        try {
            const data = JSON.parse(json);
            if (!data.habits) {
                throw new Error('Invalid data format');
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    },

    /**
     * Clear all data
     */
    clear() {
        localStorage.removeItem(STORAGE_KEY);
        if (db) {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).clear();
            } catch (error) {
                console.warn('IndexedDB clear error:', error);
            }
        }
    }
};
