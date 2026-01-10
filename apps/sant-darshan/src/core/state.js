/**
 * Sant Darshan App - State Management
 * Reactive state management with persistence
 */

import eventBus, { Events } from './events.js';
import { deepEqual, deepMerge, safeClone } from '../utils/helpers.js';
import { safeJsonParse } from '../utils/sanitize.js';
import { STORAGE_KEY, STORAGE_VERSION, SCREENS } from '../data/constants.js';

/**
 * Default application state structure
 */
const DEFAULT_STATE = {
    // App state
    version: STORAGE_VERSION,
    initialized: false,

    // Navigation state
    currentScreen: SCREENS.HOME,
    previousScreen: null,
    currentTradition: null,
    currentSaint: null,
    currentFilter: 'all',
    navigationStack: [],

    // Active modal
    activeModal: null,
    modalData: null,

    // User progress
    favorites: [],
    explored: {},  // { [saintId]: { visitedAt, timeSpent } }
    notes: {},     // { [saintId]: [{ id, text, createdAt }] }

    // Daily darshan
    dailyDarshan: {
        lastShown: null,
        streak: 0,
        lastStreakDate: null
    },

    // Quiz stats
    quizStats: {
        totalCompleted: 0,
        perfectScores: 0,
        questionsAnswered: 0,
        correctAnswers: 0
    },

    // Quiz session (transient)
    quizSession: null,

    // Achievements
    unlockedAchievements: [],

    // Learning paths
    pathProgress: {}, // { [pathId]: { completed: [], currentIndex: 0 } }

    // Journal
    journal: {}, // { [date]: { text, createdAt } }

    // Search
    searchQuery: '',
    searchResults: [],

    // UI state
    isLoading: false,
    toasts: []
};

/**
 * State Manager Class
 * Provides reactive state with subscriptions
 */
class StateManager {
    constructor() {
        this.state = { ...DEFAULT_STATE };
        this.subscribers = new Map();
        this.persistKeys = [
            'favorites',
            'explored',
            'notes',
            'dailyDarshan',
            'quizStats',
            'unlockedAchievements',
            'pathProgress',
            'journal',
            'version'
        ];
        this.persistTimeout = null;
        this.persistDelay = 300; // Debounce persistence
    }

    /**
     * Initialize state from localStorage
     */
    init() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = safeJsonParse(stored);
                if (parsed) {
                    // Migrate if needed
                    const migrated = this.migrate(parsed);
                    // Merge with defaults (preserves structure)
                    this.state = deepMerge({ ...DEFAULT_STATE }, migrated);
                }
            }
            this.state.initialized = true;
            eventBus.emit(Events.STATE_CHANGED, { key: 'initialized', value: true });
        } catch (error) {
            console.error('Failed to initialize state:', error);
            this.state = { ...DEFAULT_STATE, initialized: true };
        }
    }

    /**
     * Migrate state from older versions
     * @param {Object} oldState - State from storage
     * @returns {Object} Migrated state
     */
    migrate(oldState) {
        let state = { ...oldState };

        // Version 1 -> 2 migration example
        if (!state.version || state.version < 2) {
            // Convert old format if needed
            if (Array.isArray(state.explored)) {
                const exploredObj = {};
                state.explored.forEach(id => {
                    exploredObj[id] = { visitedAt: Date.now(), timeSpent: 0 };
                });
                state.explored = exploredObj;
            }
            state.version = STORAGE_VERSION;
        }

        return state;
    }

    /**
     * Get current state or a specific key
     * @param {string} key - Optional key path (supports dot notation)
     * @returns {*}
     */
    get(key = null) {
        if (!key) {
            return safeClone(this.state);
        }

        const keys = key.split('.');
        let value = this.state;

        for (const k of keys) {
            if (value === null || value === undefined) {
                return undefined;
            }
            value = value[k];
        }

        // Return clone for objects to prevent mutation
        return typeof value === 'object' && value !== null
            ? safeClone(value)
            : value;
    }

    /**
     * Set state value
     * @param {string} key - Key path (supports dot notation)
     * @param {*} value - New value
     * @param {Object} options - Options
     */
    set(key, value, options = {}) {
        const { silent = false, persist = true } = options;

        const keys = key.split('.');
        const lastKey = keys.pop();
        let current = this.state;

        // Navigate to parent
        for (const k of keys) {
            if (!current[k] || typeof current[k] !== 'object') {
                current[k] = {};
            }
            current = current[k];
        }

        const oldValue = current[lastKey];

        // Skip if value hasn't changed
        if (deepEqual(oldValue, value)) {
            return;
        }

        // Set new value
        current[lastKey] = value;

        // Notify subscribers
        if (!silent) {
            this.notifySubscribers(key, value, oldValue);
            eventBus.emit(Events.STATE_CHANGED, { key, value, oldValue });
        }

        // Persist if needed
        if (persist && this.shouldPersist(key)) {
            this.schedulePersist();
        }
    }

    /**
     * Update state with partial object
     * @param {Object} updates - Partial state updates
     * @param {Object} options - Options
     */
    update(updates, options = {}) {
        Object.entries(updates).forEach(([key, value]) => {
            this.set(key, value, { ...options, persist: false });
        });

        // Single persist call for all updates
        if (options.persist !== false) {
            this.schedulePersist();
        }
    }

    /**
     * Check if key should be persisted
     * @param {string} key
     * @returns {boolean}
     */
    shouldPersist(key) {
        const rootKey = key.split('.')[0];
        return this.persistKeys.includes(rootKey);
    }

    /**
     * Schedule persistence (debounced)
     */
    schedulePersist() {
        clearTimeout(this.persistTimeout);
        this.persistTimeout = setTimeout(() => this.persist(), this.persistDelay);
    }

    /**
     * Persist state to localStorage
     */
    persist() {
        try {
            const toPersist = {};
            this.persistKeys.forEach(key => {
                if (this.state[key] !== undefined) {
                    toPersist[key] = this.state[key];
                }
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
            eventBus.emit(Events.STORAGE_UPDATED, toPersist);
        } catch (error) {
            console.error('Failed to persist state:', error);
            eventBus.emit(Events.APP_ERROR, {
                type: 'storage',
                message: 'Failed to save data',
                error
            });
        }
    }

    /**
     * Subscribe to state changes
     * @param {string|Array} keys - Key(s) to watch
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(keys, callback) {
        const keyArray = Array.isArray(keys) ? keys : [keys];

        keyArray.forEach(key => {
            if (!this.subscribers.has(key)) {
                this.subscribers.set(key, new Set());
            }
            this.subscribers.get(key).add(callback);
        });

        // Return unsubscribe function
        return () => {
            keyArray.forEach(key => {
                this.subscribers.get(key)?.delete(callback);
            });
        };
    }

    /**
     * Notify subscribers of state change
     * @param {string} key
     * @param {*} value
     * @param {*} oldValue
     */
    notifySubscribers(key, value, oldValue) {
        // Notify exact key subscribers
        this.subscribers.get(key)?.forEach(callback => {
            try {
                callback(value, oldValue, key);
            } catch (error) {
                console.error(`Error in state subscriber for "${key}":`, error);
            }
        });

        // Notify parent key subscribers (e.g., 'explored' when 'explored.kabir' changes)
        const parts = key.split('.');
        for (let i = 1; i < parts.length; i++) {
            const parentKey = parts.slice(0, i).join('.');
            this.subscribers.get(parentKey)?.forEach(callback => {
                try {
                    callback(this.get(parentKey), null, parentKey);
                } catch (error) {
                    console.error(`Error in parent state subscriber for "${parentKey}":`, error);
                }
            });
        }

        // Notify wildcard subscribers
        this.subscribers.get('*')?.forEach(callback => {
            try {
                callback(value, oldValue, key);
            } catch (error) {
                console.error('Error in wildcard state subscriber:', error);
            }
        });
    }

    /**
     * Reset state to defaults
     * @param {boolean} clearStorage - Also clear localStorage
     */
    reset(clearStorage = true) {
        this.state = { ...DEFAULT_STATE, initialized: true };

        if (clearStorage) {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                console.error('Failed to clear storage:', error);
            }
        }

        eventBus.emit(Events.STATE_CHANGED, { key: '*', value: this.state });
    }

    /**
     * Get derived/computed values
     */
    get computed() {
        return {
            exploredCount: () => Object.keys(this.state.explored || {}).length,
            favoritesCount: () => this.state.favorites?.length || 0,
            notesCount: () => Object.values(this.state.notes || {}).flat().length,
            achievementsCount: () => this.state.unlockedAchievements?.length || 0,
            currentStreak: () => this.state.dailyDarshan?.streak || 0,
            quizAccuracy: () => {
                const stats = this.state.quizStats;
                if (!stats.questionsAnswered) return 0;
                return stats.correctAnswers / stats.questionsAnswered;
            }
        };
    }
}

// Create and export singleton instance
const state = new StateManager();

export default state;
export { StateManager, DEFAULT_STATE };
