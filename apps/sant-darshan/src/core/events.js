/**
 * Sant Darshan App - Event Bus
 * Pub/Sub system for decoupled component communication
 */

/**
 * Event types used throughout the app
 */
export const Events = {
    // Navigation
    NAVIGATE: 'navigate',
    SCREEN_CHANGED: 'screen:changed',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',

    // State changes
    STATE_CHANGED: 'state:changed',
    STORAGE_UPDATED: 'storage:updated',

    // User actions
    SAINT_SELECTED: 'saint:selected',
    TRADITION_SELECTED: 'tradition:selected',
    FILTER_CHANGED: 'filter:changed',

    // Favorites
    FAVORITE_ADDED: 'favorite:added',
    FAVORITE_REMOVED: 'favorite:removed',

    // Progress
    SAINT_EXPLORED: 'saint:explored',
    PROGRESS_UPDATED: 'progress:updated',

    // Notes
    NOTE_ADDED: 'note:added',
    NOTE_DELETED: 'note:deleted',

    // Quiz
    QUIZ_STARTED: 'quiz:started',
    QUIZ_ANSWERED: 'quiz:answered',
    QUIZ_COMPLETED: 'quiz:completed',

    // Achievements
    ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',

    // Journal
    JOURNAL_SAVED: 'journal:saved',

    // Learning paths
    PATH_STARTED: 'path:started',
    PATH_PROGRESS: 'path:progress',
    PATH_COMPLETED: 'path:completed',

    // Streak
    STREAK_UPDATED: 'streak:updated',

    // Search
    SEARCH_QUERY: 'search:query',
    SEARCH_RESULTS: 'search:results',

    // UI
    TOAST_SHOW: 'toast:show',
    LOADING_START: 'loading:start',
    LOADING_END: 'loading:end',

    // App lifecycle
    APP_READY: 'app:ready',
    APP_ERROR: 'app:error'
};

/**
 * Simple but powerful event bus implementation
 */
class EventBus {
    constructor() {
        this.listeners = new Map();
        this.onceListeners = new Map();
        this.history = [];
        this.maxHistory = 50;
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (typeof callback !== 'function') {
            throw new Error('Event callback must be a function');
        }

        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        this.listeners.get(event).add(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event (only fires once)
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    once(event, callback) {
        if (typeof callback !== 'function') {
            throw new Error('Event callback must be a function');
        }

        if (!this.onceListeners.has(event)) {
            this.onceListeners.set(event, new Set());
        }

        this.onceListeners.get(event).add(callback);

        return () => this.onceListeners.get(event)?.delete(callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback to remove
     */
    off(event, callback) {
        this.listeners.get(event)?.delete(callback);
        this.onceListeners.get(event)?.delete(callback);
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        // Track history for debugging
        this.history.push({
            event,
            data,
            timestamp: Date.now()
        });

        // Trim history if too long
        if (this.history.length > this.maxHistory) {
            this.history = this.history.slice(-this.maxHistory);
        }

        // Call regular listeners
        const listeners = this.listeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for "${event}":`, error);
                }
            });
        }

        // Call and remove once listeners
        const onceListeners = this.onceListeners.get(event);
        if (onceListeners) {
            onceListeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in once event handler for "${event}":`, error);
                }
            });
            onceListeners.clear();
        }

        // Also emit wildcard event for debugging/logging
        if (event !== '*') {
            const wildcardListeners = this.listeners.get('*');
            if (wildcardListeners) {
                wildcardListeners.forEach(callback => {
                    try {
                        callback({ event, data });
                    } catch (error) {
                        console.error('Error in wildcard event handler:', error);
                    }
                });
            }
        }
    }

    /**
     * Check if event has listeners
     * @param {string} event - Event name
     * @returns {boolean}
     */
    hasListeners(event) {
        return (
            (this.listeners.get(event)?.size > 0) ||
            (this.onceListeners.get(event)?.size > 0)
        );
    }

    /**
     * Get listener count for an event
     * @param {string} event - Event name
     * @returns {number}
     */
    listenerCount(event) {
        return (
            (this.listeners.get(event)?.size || 0) +
            (this.onceListeners.get(event)?.size || 0)
        );
    }

    /**
     * Remove all listeners for an event
     * @param {string} event - Event name (optional, removes all if not specified)
     */
    removeAll(event) {
        if (event) {
            this.listeners.delete(event);
            this.onceListeners.delete(event);
        } else {
            this.listeners.clear();
            this.onceListeners.clear();
        }
    }

    /**
     * Get event history (for debugging)
     * @returns {Array}
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Clear event history
     */
    clearHistory() {
        this.history = [];
    }
}

// Create singleton instance
const eventBus = new EventBus();

// Export both the class and singleton
export { EventBus };
export default eventBus;

// Convenience functions
export const on = (event, callback) => eventBus.on(event, callback);
export const once = (event, callback) => eventBus.once(event, callback);
export const off = (event, callback) => eventBus.off(event, callback);
export const emit = (event, data) => eventBus.emit(event, data);
