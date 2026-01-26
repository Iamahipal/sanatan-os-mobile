/**
 * Satsang App - Central Store
 * Simple state management with subscription pattern
 */

class Store {
    constructor() {
        this.state = {
            events: [],
            vachaks: [],
            cities: {},
            filters: {
                city: 'all',
                type: 'all',
                search: ''
            },
            savedEvents: this._loadSaved(),
            user: this._loadUser(),
            calendar: {
                month: new Date().getMonth(),
                year: new Date().getFullYear()
            }
        };
        this.listeners = new Set();
    }

    // Initialize data
    init(events, vachaks, cities) {
        this.setState({ events, vachaks, cities });
    }

    // Get current state
    getState() {
        return this.state;
    }

    // Update state and notify listeners
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this._notify();
    }

    // Subscribe to changes
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener); // Unsubscribe
    }

    _notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Actions
    setFilter(key, value) {
        this.setState({
            filters: { ...this.state.filters, [key]: value }
        });
    }

    toggleSaveEvent(eventId) {
        let saved = [...this.state.savedEvents];
        if (saved.includes(eventId)) {
            saved = saved.filter(id => id !== eventId);
        } else {
            saved.push(eventId);
        }

        localStorage.setItem('satsang_saved_events', JSON.stringify(saved));
        this.setState({ savedEvents: saved });
    }

    updateCalendar(month, year) {
        this.setState({
            calendar: { month, year }
        });
    }

    saveUser(userData) {
        localStorage.setItem('satsang_user', JSON.stringify(userData));
        this.setState({ user: userData });
    }

    // Helpers
    _loadSaved() {
        return JSON.parse(localStorage.getItem('satsang_saved_events') || '[]');
    }

    _loadUser() {
        return JSON.parse(localStorage.getItem('satsang_user') || 'null');
    }
}

export const store = new Store();
