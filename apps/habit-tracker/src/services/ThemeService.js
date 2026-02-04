/**
 * ThemeService - Theme Management
 * Light Mode Only (Mobile Optimized)
 */

import { Store } from '../core/Store.js';
import { StorageService } from './StorageService.js';

export const ThemeService = {
    /**
     * Initialize theme - Enforce Light Mode
     */
    init() {
        // Enforce light mode regardless of previous settings
        this.apply('light');
    },

    /**
     * Get current theme
     * @returns {string} Always returns 'light'
     */
    getCurrent() {
        return 'light';
    },

    /**
     * Set theme (No-op as we enforce light mode)
     */
    set(theme) {
        // Ignore changes, enforce light
        this.apply('light');
    },

    /**
     * Apply theme to DOM
     * @param {string} theme - 'dark' | 'light'
     */
    apply(theme) {
        // Force light mode
        const root = document.documentElement;
        const body = document.body;

        // Ensure only light theme classes exist
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
        root.removeAttribute('data-theme');
        root.setAttribute('data-theme', 'light');

        // Update meta theme-color for mobile browsers
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', '#FFFFFF');
        }
    },

    /**
     * Check if dark mode is active
     * @returns {boolean} Always false
     */
    isDark() {
        return false;
    }
};
