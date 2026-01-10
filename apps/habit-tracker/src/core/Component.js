/**
 * Component - Base Class for UI Components
 * Provides lifecycle hooks, DOM helpers, and event binding
 */

export class Component {
    constructor() {
        this.element = null;
        this.isMounted = false;
        this.eventCleanups = [];
    }

    /**
     * Template method - override in subclasses
     * @returns {string} HTML string
     */
    template() {
        return '<div>Component</div>';
    }

    /**
     * Render the component
     * @returns {HTMLElement}
     */
    render() {
        const html = this.template();
        const temp = document.createElement('div');
        temp.innerHTML = html.trim();
        this.element = temp.firstElementChild;

        // Call afterRender hook
        this.afterRender();

        return this.element;
    }

    /**
     * Hook called after render (for event binding)
     * Override in subclasses
     */
    afterRender() {
        // Override in subclass
    }

    /**
     * Mount lifecycle hook
     * Called when component is added to DOM
     */
    async mount() {
        this.isMounted = true;
        this.bindEvents();
    }

    /**
     * Unmount lifecycle hook
     * Called when component is removed from DOM
     */
    async unmount() {
        this.isMounted = false;
        this.cleanup();
    }

    /**
     * Bind events - override in subclasses
     */
    bindEvents() {
        // Override in subclass
    }

    /**
     * Cleanup event listeners and subscriptions
     */
    cleanup() {
        this.eventCleanups.forEach(cleanup => {
            try {
                cleanup();
            } catch (e) {
                console.warn('Cleanup error:', e);
            }
        });
        this.eventCleanups = [];
    }

    /**
     * Find element within component
     * @param {string} selector
     * @returns {HTMLElement|null}
     */
    find(selector) {
        return this.element?.querySelector(selector);
    }

    /**
     * Find all elements within component
     * @param {string} selector
     * @returns {NodeList}
     */
    findAll(selector) {
        return this.element?.querySelectorAll(selector) || [];
    }

    /**
     * Add event listener with automatic cleanup
     * @param {string} selector - CSS selector or 'self' for root element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    on(selector, event, handler) {
        const target = selector === 'self' ? this.element : this.find(selector);
        if (target) {
            target.addEventListener(event, handler);
            this.eventCleanups.push(() => target.removeEventListener(event, handler));
        }
    }

    /**
     * Add delegated event listener
     * @param {string} event - Event type
     * @param {string} selector - CSS selector for delegation
     * @param {Function} handler - Event handler
     */
    delegate(event, selector, handler) {
        const delegateHandler = (e) => {
            const target = e.target.closest(selector);
            if (target && this.element.contains(target)) {
                handler(e, target);
            }
        };
        this.element.addEventListener(event, delegateHandler);
        this.eventCleanups.push(() => this.element.removeEventListener(event, delegateHandler));
    }

    /**
     * Register a subscription for cleanup
     * @param {Function} unsubscribe
     */
    registerCleanup(unsubscribe) {
        this.eventCleanups.push(unsubscribe);
    }

    /**
     * Update component by re-rendering
     * Useful for reactive updates
     */
    update() {
        if (!this.element || !this.element.parentNode) return;

        const parent = this.element.parentNode;
        const newElement = this.render();
        parent.replaceChild(newElement, this.element);
        this.element = newElement;
    }

    /**
     * Show the component
     */
    show() {
        if (this.element) {
            this.element.style.display = '';
        }
    }

    /**
     * Hide the component
     */
    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }

    /**
     * Add CSS class
     * @param {string} className
     */
    addClass(className) {
        this.element?.classList.add(className);
    }

    /**
     * Remove CSS class
     * @param {string} className
     */
    removeClass(className) {
        this.element?.classList.remove(className);
    }

    /**
     * Toggle CSS class
     * @param {string} className
     * @param {boolean} [force]
     */
    toggleClass(className, force) {
        this.element?.classList.toggle(className, force);
    }

    /**
     * Set element attribute
     * @param {string} name
     * @param {string} value
     */
    setAttr(name, value) {
        this.element?.setAttribute(name, value);
    }

    /**
     * Set element text content
     * @param {string} selector
     * @param {string} text
     */
    setText(selector, text) {
        const el = this.find(selector);
        if (el) el.textContent = text;
    }

    /**
     * Set element HTML content
     * @param {string} selector
     * @param {string} html
     */
    setHTML(selector, html) {
        const el = this.find(selector);
        if (el) el.innerHTML = html;
    }
}
