/**
 * Simple Hash Router
 * Handles SPA navigation
 */

export class Router {
    constructor(routes) {
        this.routes = routes; // Map of 'route' -> callback
        this.currentRoute = null;

        window.addEventListener('hashchange', () => this._handleRoute());
        window.addEventListener('hashchange', () => this._handleRoute());

        // Trigger immediately as the app is already initialized
        this._handleRoute();
    }

    _handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        console.log('[Router] Hash change:', hash); // DEBUG
        const [path, param] = hash.split('/');

        if (this.routes[path]) {
            console.log('[Router] Route found:', path, 'Param:', param); // DEBUG
            // Close any open modals
            document.querySelectorAll('.modal-backdrop').forEach(m => m.remove());

            this.currentRoute = path;
            // Scroll restoration (Simple "To Top")
            document.querySelectorAll('.screen').forEach(s => s.scrollTop = 0);
            window.scrollTo(0, 0);

            this.routes[path](param);
        } else {
            console.warn(`Route not found: ${path}`);
            window.location.hash = 'home';
        }

        // Update active state in bottom nav
        this._updateNav(path);
    }

    _updateNav(path) {
        const nav = document.querySelector('.bottom-nav');

        // Hide nav on detail screens
        if (['event', 'vachak'].includes(path)) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }

        document.querySelectorAll('.nav-item').forEach(btn => {
            const tab = btn.dataset.tab;
            if (tab === path) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    navigate(path) {
        window.location.hash = path;
    }
}
