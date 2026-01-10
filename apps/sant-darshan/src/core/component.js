/**
 * Sant Darshan App - Component Base
 * Base class for creating reusable UI components
 */

import { createElement, clearChildren, addListener } from '../utils/dom.js';
import { escapeHtml } from '../utils/sanitize.js';
import state from './state.js';
import eventBus from './events.js';

/**
 * Base Component Class
 * Provides lifecycle management and rendering utilities
 */
export class Component {
    /**
     * Create a new component
     * @param {HTMLElement} container - Container element
     * @param {Object} props - Component properties
     */
    constructor(container, props = {}) {
        this.container = container;
        this.props = props;
        this.element = null;
        this.children = [];
        this.listeners = [];
        this.stateSubscriptions = [];
        this.eventSubscriptions = [];
        this.mounted = false;
    }

    /**
     * Render the component - override in subclass
     * @returns {HTMLElement|string}
     */
    render() {
        throw new Error('Component.render() must be implemented');
    }

    /**
     * Called after component is mounted to DOM
     * Override to add event listeners, etc.
     */
    onMount() { }

    /**
     * Called before component is unmounted
     * Override for cleanup
     */
    onUnmount() { }

    /**
     * Called when props change
     * @param {Object} prevProps
     */
    onPropsChange(prevProps) { }

    /**
     * Mount the component to the DOM
     */
    mount() {
        if (this.mounted) return;

        const rendered = this.render();

        if (typeof rendered === 'string') {
            // If render returns HTML string, parse it safely
            const template = document.createElement('template');
            template.innerHTML = rendered.trim();
            this.element = template.content.firstChild;
        } else if (rendered instanceof HTMLElement) {
            this.element = rendered;
        }

        if (this.element && this.container) {
            this.container.appendChild(this.element);
        }

        this.mounted = true;
        this.onMount();
    }

    /**
     * Unmount the component from the DOM
     */
    unmount() {
        if (!this.mounted) return;

        // Call onUnmount hook
        this.onUnmount();

        // Remove event listeners
        this.listeners.forEach(cleanup => cleanup());
        this.listeners = [];

        // Unsubscribe from state
        this.stateSubscriptions.forEach(unsub => unsub());
        this.stateSubscriptions = [];

        // Unsubscribe from events
        this.eventSubscriptions.forEach(unsub => unsub());
        this.eventSubscriptions = [];

        // Unmount children
        this.children.forEach(child => child.unmount());
        this.children = [];

        // Remove element from DOM
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }

        this.element = null;
        this.mounted = false;
    }

    /**
     * Update component with new props
     * @param {Object} newProps
     */
    update(newProps) {
        const prevProps = { ...this.props };
        this.props = { ...this.props, ...newProps };

        if (this.mounted) {
            this.onPropsChange(prevProps);
            this.rerender();
        }
    }

    /**
     * Re-render the component
     */
    rerender() {
        if (!this.mounted || !this.element) return;

        const parent = this.element.parentNode;
        const nextSibling = this.element.nextSibling;

        // Unmount and remount
        this.unmount();
        this.mount();

        // Re-insert at same position if needed
        if (parent && this.element) {
            if (nextSibling) {
                parent.insertBefore(this.element, nextSibling);
            } else {
                parent.appendChild(this.element);
            }
        }
    }

    /**
     * Add an event listener with automatic cleanup
     * @param {HTMLElement} element
     * @param {string} event
     * @param {Function} handler
     * @param {Object} options
     * @returns {Function} Cleanup function
     */
    listen(element, event, handler, options) {
        const cleanup = addListener(element, event, handler, options);
        this.listeners.push(cleanup);
        return cleanup;
    }

    /**
     * Subscribe to state changes with automatic cleanup
     * @param {string|Array} keys
     * @param {Function} callback
     * @returns {Function} Unsubscribe function
     */
    subscribeState(keys, callback) {
        const unsub = state.subscribe(keys, callback);
        this.stateSubscriptions.push(unsub);
        return unsub;
    }

    /**
     * Subscribe to events with automatic cleanup
     * @param {string} event
     * @param {Function} callback
     * @returns {Function} Unsubscribe function
     */
    subscribeEvent(event, callback) {
        const unsub = eventBus.on(event, callback);
        this.eventSubscriptions.push(unsub);
        return unsub;
    }

    /**
     * Add a child component
     * @param {Component} child
     */
    addChild(child) {
        this.children.push(child);
        if (this.mounted) {
            child.mount();
        }
    }

    /**
     * Remove a child component
     * @param {Component} child
     */
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.unmount();
        }
    }

    /**
     * Helper to create elements
     */
    createElement(tag, attrs, children) {
        return createElement(tag, attrs, children);
    }

    /**
     * Helper to escape HTML
     */
    escape(str) {
        return escapeHtml(str);
    }
}

/**
 * Functional component helper
 * Creates a simple component from a render function
 * @param {Function} renderFn - Function that returns HTML or element
 * @returns {Function} Component factory
 */
export function createComponent(renderFn) {
    return class extends Component {
        render() {
            return renderFn(this.props, this);
        }
    };
}

/**
 * Render a component or array of components to a container
 * @param {HTMLElement} container
 * @param {Component|Array} components
 */
export function render(container, components) {
    clearChildren(container);

    const componentArray = Array.isArray(components) ? components : [components];

    componentArray.forEach(component => {
        if (component instanceof Component) {
            component.container = container;
            component.mount();
        } else if (component instanceof HTMLElement) {
            container.appendChild(component);
        } else if (typeof component === 'string') {
            container.insertAdjacentHTML('beforeend', component);
        }
    });
}

/**
 * Create a list of components from data
 * @param {Array} items - Data items
 * @param {Function} ComponentClass - Component class to instantiate
 * @param {Function} keyFn - Function to get unique key from item
 * @returns {Array<Component>}
 */
export function createList(items, ComponentClass, keyFn = (item, i) => i) {
    return items.map((item, index) => {
        const component = new ComponentClass(null, {
            ...item,
            key: keyFn(item, index)
        });
        return component;
    });
}

export default Component;
