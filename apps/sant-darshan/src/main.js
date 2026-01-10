/**
 * Sant Darshan App - Main Entry Point
 * Bootstraps and initializes the entire application
 */

// Core imports
import state from './core/state.js';
import eventBus, { Events } from './core/events.js';
import router from './core/router.js';

// Services
import storage from './services/storage.js';
import saints, { initSaintsService } from './services/saints.js';
import search from './services/search.js';
import achievements from './services/achievements.js';

// Components
import toast from './components/toast.js';
import header from './components/header.js';

// Screens
import HomeScreen from './screens/home.js';
import SaintsListScreen from './screens/saints-list.js';
import SaintDetailScreen from './screens/saint-detail.js';

// Data
import { loadData } from './data/index.js';
import { SCREENS, APP_NAME, APP_VERSION } from './data/constants.js';

/**
 * Application class
 */
class SantDarshanApp {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) {
            console.warn('App already initialized');
            return;
        }

        console.log(`${APP_NAME} v${APP_VERSION} initializing...`);

        try {
            // Load data from global scope (set by saints-data.js)
            this.loadAppData();

            // Initialize state from localStorage
            state.init();

            // Initialize UI components
            toast.init();
            header.init();

            // Register screen renderers
            this.registerScreens();

            // Initialize router
            router.init();

            // Setup global event listeners
            this.setupGlobalListeners();

            // Setup search
            this.setupSearch();

            // Check achievements
            achievements.checkAll();

            // Mark as initialized
            this.initialized = true;

            // Emit ready event
            eventBus.emit(Events.APP_READY, { version: APP_VERSION });

            console.log(`${APP_NAME} initialized successfully`);
        } catch (error) {
            console.error('Failed to initialize app:', error);
            eventBus.emit(Events.APP_ERROR, { type: 'init', error });
        }
    }

    /**
     * Load application data
     */
    loadAppData() {
        // Load from global scope (populated by saints-data.js and phase2-data.js)
        const data = loadData();

        // Initialize saints service with loaded data
        initSaintsService({
            saints: data.saints,
            traditions: data.traditions,
            stories: data.stories,
            connections: data.connections,
            places: data.places,
            jayantis: data.jayantis
        });

        console.log(`Loaded ${data.saints.length} saints`);
    }

    /**
     * Register screen renderers with router
     */
    registerScreens() {
        router.registerScreen(SCREENS.HOME, HomeScreen);
        router.registerScreen(SCREENS.SAINTS_LIST, SaintsListScreen);
        router.registerScreen(SCREENS.SAINT_DETAIL, SaintDetailScreen);
    }

    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        // Saint selection from search
        eventBus.on(Events.SAINT_SELECTED, ({ saintId }) => {
            const saint = saints.getSaint(saintId);
            if (saint) {
                router.navigate(SCREENS.SAINT_DETAIL, {
                    saint,
                    saintId: saint.id,
                    saintName: saint.name
                });
            }
        });

        // Handle visibility change (for streak tracking)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // Could refresh data or check streak
            }
        });

        // Handle offline/online status
        window.addEventListener('online', () => {
            toast.show({ message: 'Back online', type: 'success' });
        });

        window.addEventListener('offline', () => {
            toast.show({ message: 'You are offline', type: 'warning' });
        });

        // Debug logging in development
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            eventBus.on('*', ({ event, data }) => {
                console.debug(`[Event] ${event}`, data);
            });
        }
    }

    /**
     * Setup search functionality
     */
    setupSearch() {
        // Listen for search queries from header
        eventBus.on(Events.SEARCH_QUERY, ({ query }) => {
            search.search(query);
        });
    }

    /**
     * Get app version
     */
    getVersion() {
        return APP_VERSION;
    }

    /**
     * Export user data
     */
    exportData() {
        return storage.exportData();
    }

    /**
     * Import user data
     */
    importData(data) {
        return storage.importData(data);
    }

    /**
     * Reset app
     */
    reset() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            storage.clearAllData();
            window.location.reload();
        }
    }
}

// Create singleton instance
const app = new SantDarshanApp();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Expose to global scope for debugging
if (typeof window !== 'undefined') {
    window.SantDarshanApp = app;
    window.SantDarshanDebug = {
        state,
        eventBus,
        router,
        storage,
        saints,
        achievements
    };
}

export default app;
