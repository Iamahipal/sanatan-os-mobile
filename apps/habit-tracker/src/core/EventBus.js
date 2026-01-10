/**
 * EventBus - Pub/Sub Event System
 * Enables decoupled communication between components
 */

class EventBusClass {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event (once only)
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     */
    once(event, callback) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback(...args);
        };
        this.on(event, wrapper);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler to remove
     */
    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    /**
     * Emit an event to all subscribers
     * @param {string} event - Event name
     * @param {*} data - Data to pass to handlers
     */
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`EventBus error in "${event}":`, error);
                }
            });
        }
    }

    /**
     * Remove all listeners for an event (or all events)
     * @param {string} [event] - Optional event name
     */
    clear(event) {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }
}

// Singleton instance
export const EventBus = new EventBusClass();

// Event constants for type safety
export const Events = {
    // State events
    STATE_CHANGE: 'state:change',
    STATE_INIT: 'state:init',

    // Navigation events
    ROUTE_CHANGE: 'route:change',
    ROUTE_BEFORE: 'route:before',

    // Habit events
    HABIT_CREATED: 'habit:created',
    HABIT_UPDATED: 'habit:updated',
    HABIT_DELETED: 'habit:deleted',
    HABIT_TOGGLED: 'habit:toggled',

    // UI events
    TOAST_SHOW: 'toast:show',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',
    THEME_CHANGE: 'theme:change',

    // App lifecycle
    APP_READY: 'app:ready',
    APP_ERROR: 'app:error'
};
