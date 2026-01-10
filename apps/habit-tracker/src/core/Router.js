import { bus } from './EventBus.js';

/**
 * Hash-based Router
 */
export class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
        this.rootElement = document.getElementById('app-root');

        window.addEventListener('hashchange', this.handleRoute.bind(this));
        window.addEventListener('load', this.handleRoute.bind(this));
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.resolveRoute(hash);

        if (route && route !== this.currentRoute) {
            this.currentRoute = route;
            this.renderRoute(route);
            bus.emit('route-change', hash);
        }
    }

    resolveRoute(hash) {
        // Handle dynamic routes (e.g., #/habit/123)
        // Simple regex matching could go here, but for now we'll stick to exact matches 
        // or simplistic splitting. 
        // User strategy: Store "currentHabitId" in store before navigating to detail view.
        return this.routes[hash] || this.routes['*'] || this.routes['/'];
    }

    async renderRoute(routeComponentClass) {
        if (!this.rootElement) return;

        this.rootElement.innerHTML = '';
        const screen = new routeComponentClass();
        const element = await screen.render(); // Allow async render
        this.rootElement.appendChild(element);
    }

    static navigate(path) {
        window.location.hash = path;
    }
}
