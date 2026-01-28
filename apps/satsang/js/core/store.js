/**
 * Simple Pub/Sub Store
 */

class Store {
    constructor() {
        this.state = {
            events: [],
            vachaks: [],
            categories: [],
            filter: 'all',
            location: 'Mathura'
        };
        this.listeners = new Set();
    }

    init(initialState) {
        this.state = { ...this.state, ...initialState };
        this.notify();
    }

    getState() {
        return this.state;
    }

    subscribe(fn) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    notify() {
        this.listeners.forEach(fn => fn(this.state));
    }

    // Actions
    setFilter(category) {
        this.state.filter = category;
        this.notify();
    }
}

export const store = new Store();
