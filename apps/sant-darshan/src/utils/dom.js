/**
 * Sant Darshan App - DOM Utilities
 * Safe and efficient DOM manipulation helpers
 */

import { escapeHtml, sanitizeAttribute, sanitizeId } from './sanitize.js';

/**
 * Query selector shorthand with optional parent
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (default: document)
 * @returns {HTMLElement|null}
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Query selector all shorthand
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (default: document)
 * @returns {NodeList}
 */
export function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * Get element by ID (cached for performance)
 */
const elementCache = new Map();

export function getById(id) {
    if (!elementCache.has(id)) {
        const element = document.getElementById(id);
        if (element) {
            elementCache.set(id, element);
        }
        return element;
    }
    return elementCache.get(id);
}

/**
 * Clear element cache (call on major DOM changes)
 */
export function clearElementCache() {
    elementCache.clear();
}

/**
 * Create an element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Attributes object
 * @param {Array|string} children - Child elements or text
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);

    // Set attributes safely
    Object.entries(attrs).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (key === 'className') {
            element.className = String(value);
        } else if (key === 'classList') {
            if (Array.isArray(value)) {
                value.forEach(cls => element.classList.add(cls));
            }
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = sanitizeAttribute(String(dataValue));
            });
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else if (key === 'html') {
            // Dangerous - only use with trusted content
            element.innerHTML = value;
        } else {
            element.setAttribute(key, sanitizeAttribute(String(value)));
        }
    });

    // Add children
    const childArray = Array.isArray(children) ? children : [children];
    childArray.forEach(child => {
        if (child === null || child === undefined) return;

        if (child instanceof Node) {
            element.appendChild(child);
        } else {
            // Text content - automatically safe
            element.appendChild(document.createTextNode(String(child)));
        }
    });

    return element;
}

/**
 * Shorthand element creators
 */
export const el = {
    div: (attrs, children) => createElement('div', attrs, children),
    span: (attrs, children) => createElement('span', attrs, children),
    p: (attrs, children) => createElement('p', attrs, children),
    h1: (attrs, children) => createElement('h1', attrs, children),
    h2: (attrs, children) => createElement('h2', attrs, children),
    h3: (attrs, children) => createElement('h3', attrs, children),
    h4: (attrs, children) => createElement('h4', attrs, children),
    button: (attrs, children) => createElement('button', attrs, children),
    input: (attrs) => createElement('input', attrs),
    textarea: (attrs, children) => createElement('textarea', attrs, children),
    img: (attrs) => createElement('img', attrs),
    a: (attrs, children) => createElement('a', attrs, children),
    ul: (attrs, children) => createElement('ul', attrs, children),
    li: (attrs, children) => createElement('li', attrs, children),
    section: (attrs, children) => createElement('section', attrs, children),
    article: (attrs, children) => createElement('article', attrs, children),
    nav: (attrs, children) => createElement('nav', attrs, children),
    header: (attrs, children) => createElement('header', attrs, children),
    footer: (attrs, children) => createElement('footer', attrs, children),
    i: (attrs, children) => createElement('i', attrs, children),
    svg: (attrs, children) => createSvgElement('svg', attrs, children),
};

/**
 * Create SVG element (needs different namespace)
 */
export function createSvgElement(tag, attrs = {}, children = []) {
    const ns = 'http://www.w3.org/2000/svg';
    const element = document.createElementNS(ns, tag);

    Object.entries(attrs).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            element.setAttribute(key, String(value));
        }
    });

    const childArray = Array.isArray(children) ? children : [children];
    childArray.forEach(child => {
        if (child instanceof Node) {
            element.appendChild(child);
        }
    });

    return element;
}

/**
 * Clear all children from an element
 * @param {HTMLElement} element
 */
export function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Replace element content with new children
 * @param {HTMLElement} element
 * @param {Array|Node|string} children
 */
export function replaceChildren(element, children) {
    clearChildren(element);

    const childArray = Array.isArray(children) ? children : [children];
    childArray.forEach(child => {
        if (child === null || child === undefined) return;

        if (child instanceof Node) {
            element.appendChild(child);
        } else {
            element.appendChild(document.createTextNode(String(child)));
        }
    });
}

/**
 * Add event listener with automatic cleanup tracking
 */
const eventListeners = new WeakMap();

export function addListener(element, event, handler, options) {
    element.addEventListener(event, handler, options);

    // Track for potential cleanup
    if (!eventListeners.has(element)) {
        eventListeners.set(element, []);
    }
    eventListeners.get(element).push({ event, handler, options });

    // Return cleanup function
    return () => element.removeEventListener(event, handler, options);
}

/**
 * Delegate event handling to parent element
 * @param {HTMLElement} parent - Parent element to listen on
 * @param {string} event - Event type
 * @param {string} selector - CSS selector for target elements
 * @param {Function} handler - Event handler
 * @returns {Function} Cleanup function
 */
export function delegate(parent, event, selector, handler) {
    const delegatedHandler = (e) => {
        const target = e.target.closest(selector);
        if (target && parent.contains(target)) {
            handler.call(target, e, target);
        }
    };

    parent.addEventListener(event, delegatedHandler);

    return () => parent.removeEventListener(event, delegatedHandler);
}

/**
 * Show element
 */
export function show(element, display = 'block') {
    if (element) {
        element.style.display = display;
    }
}

/**
 * Hide element
 */
export function hide(element) {
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Toggle element visibility
 */
export function toggle(element, display = 'block') {
    if (element) {
        element.style.display = element.style.display === 'none' ? display : 'none';
    }
}

/**
 * Add class(es) to element
 */
export function addClass(element, ...classes) {
    if (element) {
        element.classList.add(...classes);
    }
}

/**
 * Remove class(es) from element
 */
export function removeClass(element, ...classes) {
    if (element) {
        element.classList.remove(...classes);
    }
}

/**
 * Toggle class on element
 */
export function toggleClass(element, className, force) {
    if (element) {
        return element.classList.toggle(className, force);
    }
    return false;
}

/**
 * Check if element has class
 */
export function hasClass(element, className) {
    return element?.classList?.contains(className) ?? false;
}

/**
 * Set multiple styles at once
 */
export function setStyles(element, styles) {
    if (element && styles) {
        Object.assign(element.style, styles);
    }
}

/**
 * Get computed style value
 */
export function getStyle(element, property) {
    return element ? getComputedStyle(element).getPropertyValue(property) : '';
}

/**
 * Wait for animation/transition to complete
 */
export function onAnimationEnd(element) {
    return new Promise(resolve => {
        const handler = () => {
            element.removeEventListener('animationend', handler);
            element.removeEventListener('transitionend', handler);
            resolve();
        };
        element.addEventListener('animationend', handler);
        element.addEventListener('transitionend', handler);
    });
}

/**
 * Scroll element into view smoothly
 */
export function scrollIntoView(element, options = {}) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            ...options
        });
    }
}

/**
 * Focus element with optional scroll prevention
 */
export function focusElement(element, preventScroll = false) {
    if (element && typeof element.focus === 'function') {
        element.focus({ preventScroll });
    }
}

/**
 * Trap focus within a container (for modals)
 */
export function trapFocus(container) {
    const focusableSelector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const focusableElements = container.querySelectorAll(focusableSelector);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handler = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable?.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable?.focus();
            }
        }
    };

    container.addEventListener('keydown', handler);

    // Focus first element
    firstFocusable?.focus();

    // Return cleanup function
    return () => container.removeEventListener('keydown', handler);
}

/**
 * Create a Material ripple effect
 */
export function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const ripple = createElement('span', {
        className: 'ripple-effect',
        style: {
            left: `${event.clientX - rect.left}px`,
            top: `${event.clientY - rect.top}px`
        }
    });

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

/**
 * Setup ripple effect on multiple elements
 */
export function setupRipples(selector = '.ripple') {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.addEventListener('click', createRipple);
    });
}
