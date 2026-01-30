/**
 * Satsang App v2 - State Management
 * Simple Pub/Sub Store with localStorage persistence
 */

class Store {
    constructor() {
        // Initial State
        this.state = {
            // Data
            vachaks: [],
            events: [],
            cities: {},

            // UI State
            currentScreen: 'home',
            currentId: null,
            previousScreen: null,

            // Filters
            selectedCity: 'all',
            selectedCategory: 'all',

            // User Data
            savedEvents: [],
            userLocation: 'All India',

            // Loading States
            isLoading: true
        };

        // Subscribers
        this.listeners = new Map();

        // Load persisted data
        this._loadFromStorage();
    }

    /**
     * Initialize store with data
     */
    init(data) {
        this.state = {
            ...this.state,
            ...data,
            isLoading: false
        };
        this._notify('*');
    }

    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Subscribe to state changes
     * @param {string} key - State key to watch ('*' for all)
     * @param {Function} callback - Function to call on change
     * @returns {Function} Unsubscribe function
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);

        // Return unsubscribe function
        return () => this.listeners.get(key).delete(callback);
    }

    /**
     * Update state and notify subscribers
     */
    setState(updates) {
        const changedKeys = Object.keys(updates);

        // Update state
        this.state = { ...this.state, ...updates };

        // Notify specific key subscribers
        changedKeys.forEach(key => this._notify(key));

        // Notify wildcard subscribers
        this._notify('*');

        // Persist user data
        this._saveToStorage();
    }

    // ============================================
    // ACTIONS
    // ============================================

    /**
     * Navigate to a screen
     */
    navigate(screen, id = null) {
        this.setState({
            previousScreen: this.state.currentScreen,
            currentScreen: screen,
            currentId: id
        });
    }

    /**
     * Go back to previous screen
     */
    goBack() {
        const previous = this.state.previousScreen || 'home';
        this.setState({
            currentScreen: previous,
            currentId: null,
            previousScreen: null
        });
    }

    /**
     * Set city filter
     */
    setCity(city) {
        this.setState({
            selectedCity: city,
            userLocation: city === 'all' ? 'All India' : this.state.cities[city]?.name || city
        });
    }

    /**
     * Set category filter
     */
    setCategory(category) {
        this.setState({ selectedCategory: category });
    }

    /**
     * Toggle event save status
     */
    toggleSaveEvent(eventId) {
        const saved = [...this.state.savedEvents];
        const index = saved.indexOf(eventId);

        if (index > -1) {
            saved.splice(index, 1);
        } else {
            saved.push(eventId);
        }

        this.setState({ savedEvents: saved });
    }

    /**
     * Check if event is saved
     */
    isEventSaved(eventId) {
        return this.state.savedEvents.includes(eventId);
    }

    /**
     * Get filtered events
     */
    getFilteredEvents() {
        let filtered = [...this.state.events];

        // Filter by city
        if (this.state.selectedCity !== 'all') {
            filtered = filtered.filter(e => e.location.city === this.state.selectedCity);
        }

        // Filter by category
        if (this.state.selectedCategory !== 'all') {
            filtered = filtered.filter(e => e.type === this.state.selectedCategory);
        }

        return filtered;
    }

    /**
     * Get saved events
     */
    getSavedEvents() {
        return this.state.events.filter(e => this.state.savedEvents.includes(e.id));
    }

    /**
     * Get event by ID
     */
    getEvent(id) {
        return this.state.events.find(e => e.id === id);
    }

    /**
     * Get vachak by ID
     */
    getVachak(id) {
        return this.state.vachaks.find(v => v.id === id);
    }

    /**
     * Get events by vachak
     */
    getEventsByVachak(vachakId) {
        return this.state.events.filter(e => e.vachakId === vachakId);
    }

    /**
     * Get featured/live event
     */
    getFeaturedEvent() {
        // Priority: Live events, then soonest upcoming
        const live = this.state.events.find(e => e.features?.isLive);
        if (live) return live;

        // Sort by start date and return first
        const sorted = [...this.state.events].sort((a, b) =>
            new Date(a.dates.start) - new Date(b.dates.start)
        );
        return sorted[0] || null;
    }

    // ============================================
    // PRIVATE METHODS
    // ============================================

    _notify(key) {
        // Notify subscribers for this key
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(fn => {
                try {
                    fn(this.state);
                } catch (e) {
                    console.error('Store subscriber error:', e);
                }
            });
        }
    }

    _saveToStorage() {
        try {
            const persistedData = {
                savedEvents: this.state.savedEvents,
                selectedCity: this.state.selectedCity,
                userLocation: this.state.userLocation
            };
            localStorage.setItem('satsang_store', JSON.stringify(persistedData));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    _loadFromStorage() {
        try {
            const data = localStorage.getItem('satsang_store');
            if (data) {
                const parsed = JSON.parse(data);
                this.state = { ...this.state, ...parsed };
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
        }
    }
}

// Export singleton instance
export const store = new Store();
