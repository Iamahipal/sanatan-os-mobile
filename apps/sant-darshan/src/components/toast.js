/**
 * Sant Darshan App - Toast Component
 * Notification toast system
 */

import eventBus, { Events } from '../core/events.js';
import { createElement, addClass, removeClass } from '../utils/dom.js';
import { escapeHtml } from '../utils/sanitize.js';
import { TOAST_DURATION } from '../data/constants.js';

/**
 * Toast Manager
 * Handles showing and hiding toast notifications
 */
class ToastManager {
    constructor() {
        this.container = null;
        this.queue = [];
        this.isShowing = false;
        this.currentToast = null;
        this.timeoutId = null;
    }

    /**
     * Initialize toast manager
     */
    init() {
        // Create container if it doesn't exist
        this.container = document.getElementById('toast-container');

        if (!this.container) {
            this.container = createElement('div', {
                id: 'toast-container',
                className: 'toast-container',
                'aria-live': 'polite',
                'aria-atomic': 'true'
            });
            document.body.appendChild(this.container);
        }

        // Listen for toast events
        eventBus.on(Events.TOAST_SHOW, (data) => this.show(data));
    }

    /**
     * Show a toast notification
     * @param {Object|string} options - Toast options or message string
     */
    show(options) {
        const config = typeof options === 'string'
            ? { message: options }
            : options;

        const {
            message,
            duration = TOAST_DURATION,
            type = 'info',
            icon = null
        } = config;

        // Add to queue
        this.queue.push({ message, duration, type, icon });

        // Process queue if not currently showing
        if (!this.isShowing) {
            this.processQueue();
        }
    }

    /**
     * Process toast queue
     */
    processQueue() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        this.isShowing = true;
        const toast = this.queue.shift();
        this.displayToast(toast);
    }

    /**
     * Display a single toast
     * @param {Object} toast
     */
    displayToast(toast) {
        // Create toast element
        const toastEl = createElement('div', {
            className: `toast toast-${toast.type}`,
            role: 'alert'
        }, [
            toast.icon ? createElement('span', { className: 'toast-icon' }, toast.icon) : null,
            createElement('span', { className: 'toast-message' }, escapeHtml(toast.message))
        ].filter(Boolean));

        // Clear any existing toast
        if (this.currentToast) {
            this.currentToast.remove();
        }

        // Add to container
        this.container.appendChild(toastEl);
        this.currentToast = toastEl;

        // Trigger animation
        requestAnimationFrame(() => {
            addClass(toastEl, 'toast-show');
        });

        // Set timeout to hide
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.hideToast(toastEl);
        }, toast.duration);
    }

    /**
     * Hide a toast
     * @param {HTMLElement} toastEl
     */
    hideToast(toastEl) {
        removeClass(toastEl, 'toast-show');
        addClass(toastEl, 'toast-hide');

        // Remove after animation
        setTimeout(() => {
            toastEl.remove();
            this.currentToast = null;
            this.processQueue();
        }, 300);
    }

    /**
     * Clear all toasts
     */
    clear() {
        clearTimeout(this.timeoutId);
        this.queue = [];

        if (this.currentToast) {
            this.currentToast.remove();
            this.currentToast = null;
        }

        this.isShowing = false;
    }
}

// Create and export singleton
const toast = new ToastManager();

export default toast;
export { ToastManager };

// Convenience function
export function showToast(message, options = {}) {
    toast.show({ message, ...options });
}
