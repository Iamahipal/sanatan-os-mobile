/**
 * ThemeService - Theme Management
 * Handles dark/light mode with system preference detection
 */

import { Store } from '../core/Store.js';
import { EventBus, Events } from '../core/EventBus.js';
import { StorageService } from './StorageService.js';

export const ThemeService = {
    /**
     * Initialize theme from stored preference or system
     */
    init() {
        // Get stored theme or detect system preference
        const stored = Store.getProperty('theme');
        const system = this.getSystemTheme();
        const theme = stored || system;

        this.apply(theme);

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', (e) => {
                    // Only auto-switch if user hasn't set a preference
                    if (!Store.getProperty('theme')) {
                        this.apply(e.matches ? 'dark' : 'light');
                    }
                });
        }
    },

    /**
     * Get system theme preference
     * @returns {string}
     */
    getSystemTheme() {
        if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    },

    /**
     * Get current theme
     * @returns {string}
     */
    getCurrent() {
        return Store.getProperty('theme') || 'dark';
    },

    /**
     * Toggle between dark and light
     */
    toggle() {
        const current = this.getCurrent();
        const next = current === 'dark' ? 'light' : 'dark';
        this.set(next);
    },

    /**
     * Set theme
     * @param {string} theme - 'dark' | 'light'
     */
    set(theme) {
        Store.set('theme', theme);
        this.apply(theme);
        StorageService.save(Store.getPersistedState());
        EventBus.emit(Events.THEME_CHANGE, theme);
    },

    /**
     * Apply theme to DOM
     * @param {string} theme
     */
    apply(theme) {
        const root = document.documentElement;
        const body = document.body;

        // Remove existing theme classes
        body.classList.remove('theme-dark', 'theme-light');
        root.removeAttribute('data-theme');

        // Apply new theme
        if (theme === 'light') {
            body.classList.add('theme-light');
            root.setAttribute('data-theme', 'light');
        } else {
            body.classList.add('theme-dark');
            root.setAttribute('data-theme', 'dark');
        }

        // Update meta theme-color for mobile browsers
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', theme === 'dark' ? '#000000' : '#FFFFFF');
        }
    },

    /**
     * Check if dark mode is active
     * @returns {boolean}
     */
    isDark() {
        return this.getCurrent() === 'dark';
    }
};
