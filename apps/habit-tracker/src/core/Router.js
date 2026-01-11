/**
 * Router - Hash-based SPA Navigation
 * Handles screen transitions and history
 */

import { EventBus, Events } from './EventBus.js';
import { Store } from './Store.js';

class RouterClass {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.currentScreen = null;
        this.rootElement = null;
        this.history = [];

        // Bind event handlers
        this.handleHashChange = this.handleHashChange.bind(this);
    }

    /**
     * Initialize the router
     * @param {HTMLElement} rootElement - Container for screens
     */
    init(rootElement) {
        this.rootElement = rootElement;

        // Listen for hash changes
        window.addEventListener('hashchange', this.handleHashChange);

        // Handle initial route
        this.handleHashChange();

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state?.route) {
                this.navigateTo(e.state.route, false);
            }
        });
    }

    /**
     * Register a route
     * @param {string} path - Route path (e.g., '/', '/settings')
     * @param {Function} ScreenClass - Screen component class
     * @param {Object} options - Route options
     */
    register(path, ScreenClass, options = {}) {
        this.routes.set(path, {
            ScreenClass,
            title: options.title || 'Niyam',
            requiresAuth: options.requiresAuth || false,
            transition: options.transition || 'fade'
        });
    }

    /**
     * Handle hash changes
     */
    handleHashChange() {
        const hash = window.location.hash.slice(1) || '/';
        // Avoid re-navigation if we're already on this route
        if (hash !== this.currentRoute) {
            this.navigateTo(hash, false);
        }
    }

    /**
     * Navigate to a route
     * @param {string} path - Route path
     * @param {boolean} addToHistory - Add to browser history
     */
    async navigateTo(path, addToHistory = true) {
        // Emit before event (can be used for guards)
        EventBus.emit(Events.ROUTE_BEFORE, { from: this.currentRoute, to: path });

        const route = this.routes.get(path);

        if (!route) {
            console.warn(`Route not found: ${path}, redirecting to /`);
            window.location.hash = '#/';
            return;
        }

        // Auth guard
        if (route.requiresAuth && !Store.getProperty('user')) {
            console.warn('Route requires auth, redirecting to /');
            window.location.hash = '#/';
            return;
        }

        // Cleanup current screen
        if (this.currentScreen?.unmount) {
            await this.currentScreen.unmount();
        }

        // Clear root and create new screen
        this.rootElement.innerHTML = '';

        try {
            const screen = new route.ScreenClass();
            this.currentScreen = screen;

            // Render and mount
            const element = await screen.render();
            this.rootElement.appendChild(element);

            // Call mount lifecycle
            if (screen.mount) {
                await screen.mount();
            }

            // Track previous route for back navigation
            if (this.currentRoute && this.currentRoute !== path) {
                this.previousRoute = this.currentRoute;
            }

            // Update state
            this.currentRoute = path;

            // Update browser history (only for forward navigation)
            if (addToHistory && path !== this.previousRoute) {
                window.history.pushState({ route: path }, '', `#${path}`);
            }

            // Update document title
            document.title = route.title;

            // Emit route change
            EventBus.emit(Events.ROUTE_CHANGE, { path, route });

        } catch (error) {
            console.error('Router error:', error);
            EventBus.emit(Events.APP_ERROR, { error, context: 'router' });
        }
    }

    /**
     * Navigate back - uses browser history for proper back navigation
     */
    back() {
        // If we have a previous route and it's not onboarding, go there
        if (this.previousRoute && this.previousRoute !== '/onboarding') {
            window.history.back();
        } else {
            // Otherwise go to dashboard
            window.location.hash = '#/';
        }
    }

    /**
     * Get current route
     * @returns {string}
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Check if we can go back
     * @returns {boolean}
     */
    canGoBack() {
        return this.history.length > 1;
    }

    /**
     * Destroy router (cleanup)
     */
    destroy() {
        window.removeEventListener('hashchange', this.handleHashChange);
        if (this.currentScreen?.unmount) {
            this.currentScreen.unmount();
        }
    }
}

// Singleton instance
export const Router = new RouterClass();

// Convenience navigation function
export function navigate(path) {
    Router.navigateTo(path);
}
