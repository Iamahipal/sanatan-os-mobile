/**
 * Satsang App v2 - Hash Router
 * Handles navigation and history
 */

import { store } from './store.js';

class Router {
    constructor() {
        this.routes = {
            'home': () => store.navigate('home'),
            'calendar': () => store.navigate('calendar'),
            'saved': () => store.navigate('saved'),
            'profile': () => store.navigate('profile'),
            'library': () => store.navigate('library'),
            'event': (id) => store.navigate('event', id),
            'vachak': (id) => store.navigate('vachak', id)
        };

        // Bind event listeners
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('popstate', () => this.handleRoute());
    }

    /**
     * Initialize router and handle current hash
     */
    init() {
        this.handleRoute();
    }

    /**
     * Handle current route
     */
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const [route, id] = hash.split('/');

        // Update nav active state
        this.updateNavActive(route);

        // Execute route handler
        if (this.routes[route]) {
            this.routes[route](id);
        } else {
            // Fallback to home
            this.routes['home']();
        }
    }

    /**
     * Navigate to a route
     */
    push(route, id = null) {
        const hash = id ? `#${route}/${id}` : `#${route}`;
        window.location.hash = hash;
    }

    /**
     * Go back in history
     */
    back() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.push('home');
        }
    }

    /**
     * Update navigation active state
     */
    updateNavActive(route) {
        // Map detail screens to their parent nav item
        const navMap = {
            'home': 'home',
            'event': 'home',
            'vachak': 'home',
            'calendar': 'calendar',
            'library': 'library',
            'saved': 'saved',
            'profile': 'profile'
        };

        const activeNav = navMap[route] || 'home';

        document.querySelectorAll('.nav__item').forEach(item => {
            const screen = item.dataset.screen;
            item.classList.toggle('active', screen === activeNav);
        });
    }
}

// Export singleton instance
export const router = new Router();
