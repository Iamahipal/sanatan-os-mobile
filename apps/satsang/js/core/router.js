/**
 * Hash Router
 */
export class Router {
    constructor(routes) {
        this.routes = routes;
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const [route, param] = hash.split('/');

        // Highlight Nav
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.toggle('active', el.getAttribute('href') === `#${route}`);
        });

        if (this.routes[route]) {
            this.routes[route](param);
        } else {
            console.warn('Route not found:', route);
            // Default to home
            this.routes['home']();
        }
    }
}
