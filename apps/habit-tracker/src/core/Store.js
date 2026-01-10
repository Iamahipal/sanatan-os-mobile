import { bus } from './EventBus.js';

/**
 * Reactive Store for State Management
 */
export class Store {
    constructor(initialState = {}) {
        this.state = new Proxy(initialState, {
            set: (target, property, value) => {
                target[property] = value;
                bus.emit('state-change', { property, value, state: this.state });
                return true;
            }
        });
    }

    /**
     * Get current state snapshot
     */
    get() {
        return { ...this.state };
    }

    /**
     * Update state property
     * @param {string} property 
     * @param {any} value 
     */
    set(property, value) {
        this.state[property] = value;
    }

    /**
     * Subscribe to specific property changes
     * @param {string} property 
     * @param {Function} callback 
     */
    subscribe(property, callback) {
        return bus.on('state-change', (data) => {
            if (data.property === property) {
                callback(data.value);
            }
        });
    }
}

// Global store instance
export const store = new Store({
    habits: [],
    userPoints: 0,
    theme: 'dark',
    onboardingComplete: false,
    selectedDate: new Date(),
    loading: true
});
