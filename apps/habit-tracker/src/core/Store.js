/**
 * Store - Reactive State Management
 * Central state with Proxy-based reactivity
 */

import { EventBus, Events } from './EventBus.js';

class StoreClass {
    constructor() {
        this.state = this.createReactiveState({
            // Auth
            user: null,

            // App state
            isLoading: true,
            onboardingComplete: false,
            theme: 'dark',

            // Data
            habits: [],
            categories: ['Morning', 'Health', 'Learning', 'Work', 'Personal'],

            // UI state
            selectedDate: new Date(),
            currentHabitId: null,
            editingHabitId: null
        });

        this.subscribers = new Map();
    }

    /**
     * Create a Proxy-wrapped reactive state
     */
    createReactiveState(initial) {
        const store = this;

        return new Proxy(initial, {
            set(target, property, value) {
                const oldValue = target[property];
                target[property] = value;

                // Emit change event
                EventBus.emit(Events.STATE_CHANGE, {
                    property,
                    value,
                    oldValue,
                    state: { ...target }
                });

                // Notify property-specific subscribers
                if (store.subscribers.has(property)) {
                    store.subscribers.get(property).forEach(cb => {
                        try {
                            cb(value, oldValue);
                        } catch (error) {
                            console.error(`Store subscriber error for "${property}":`, error);
                        }
                    });
                }

                return true;
            }
        });
    }

    /**
     * Get current state snapshot (immutable copy)
     * @returns {Object}
     */
    get() {
        return { ...this.state };
    }

    /**
     * Get a specific property
     * @param {string} key
     * @returns {*}
     */
    getProperty(key) {
        return this.state[key];
    }

    /**
     * Set a state property
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        this.state[key] = value;
    }

    /**
     * Update multiple properties at once
     * @param {Object} updates
     */
    update(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.state[key] = value;
        });
    }

    /**
     * Subscribe to changes on a specific property
     * @param {string} property
     * @param {Function} callback - (newValue, oldValue) => void
     * @returns {Function} Unsubscribe function
     */
    subscribe(property, callback) {
        if (!this.subscribers.has(property)) {
            this.subscribers.set(property, new Set());
        }
        this.subscribers.get(property).add(callback);

        return () => {
            this.subscribers.get(property).delete(callback);
        };
    }

    /**
     * Subscribe to any state change
     * @param {Function} callback
     * @returns {Function} Unsubscribe function
     */
    subscribeAll(callback) {
        return EventBus.on(Events.STATE_CHANGE, callback);
    }

    /**
     * Initialize state from storage
     * @param {Object} savedState
     */
    hydrate(savedState) {
        if (!savedState) return;

        // Merge saved state, excluding runtime properties
        const { isLoading, selectedDate, currentHabitId, editingHabitId, ...persistable } = savedState;

        Object.entries(persistable).forEach(([key, value]) => {
            if (this.state.hasOwnProperty(key)) {
                this.state[key] = value;
            }
        });

        EventBus.emit(Events.STATE_INIT, this.get());
    }

    /**
     * Get state for persistence (excludes runtime properties)
     * @returns {Object}
     */
    getPersistedState() {
        const { isLoading, selectedDate, currentHabitId, editingHabitId, user, ...persistable } = this.state;
        return persistable;
    }

    /**
     * Reset state to defaults
     */
    reset() {
        this.state.habits = [];
        this.state.onboardingComplete = false;
        this.state.theme = 'dark';
        this.state.categories = ['Morning', 'Health', 'Learning', 'Work', 'Personal'];
    }
}

// Singleton instance
export const Store = new StoreClass();
