/**
 * Simple Hash Router
 * Handles SPA navigation
 */

export class Router {
    constructor(routes) {
        this.routes = routes; // Map of 'route' -> callback
        this.currentRoute = null;

        window.addEventListener('hashchange', () => this._handleRoute());
        window.addEventListener('load', () => this._handleRoute());
    }

    _handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const [path, param] = hash.split('/');

        if (this.routes[path]) {
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
