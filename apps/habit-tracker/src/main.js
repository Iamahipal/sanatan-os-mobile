/**
 * Niyam - Habit Tracker
 * Main Entry Point
 */

import { Router, navigate } from './core/Router.js';
import { Store } from './core/Store.js';
import { EventBus, Events } from './core/EventBus.js';
import { StorageService } from './services/StorageService.js';
import { ThemeService } from './services/ThemeService.js';
import { QuoteService } from './services/QuoteService.js';

// Screens (lazy loaded for performance)
import { OnboardingScreen } from './screens/OnboardingScreen.js';
import { DashboardScreen } from './screens/DashboardScreen.js';
import { HabitFormScreen } from './screens/HabitFormScreen.js';
import { HabitDetailsScreen } from './screens/HabitDetailsScreen.js';
import { SettingsScreen } from './screens/SettingsScreen.js';

/**
 * Initialize the application
 */
async function init() {
    console.log('🙏 Niyam - Starting...');

    try {
        // Initialize services
        await StorageService.init();
        await QuoteService.init();

        // Load saved state
        const savedState = StorageService.load();
        if (savedState) {
            Store.hydrate(savedState);
        }

        // Initialize theme
        ThemeService.init();

        // Register routes
        Router.register('/', DashboardScreen, { title: 'Niyam - My Habits' });
        Router.register('/onboarding', OnboardingScreen, { title: 'Welcome to Niyam' });
        Router.register('/add-habit', HabitFormScreen, { title: 'Add Habit' });
        Router.register('/edit-habit', HabitFormScreen, { title: 'Edit Habit' });
        Router.register('/habit-details', HabitDetailsScreen, { title: 'Habit Details' });
        Router.register('/settings', SettingsScreen, { title: 'Settings' });

        // Get app container
        const appRoot = document.getElementById('app');

        // Initialize router
        Router.init(appRoot);

        // Check onboarding status
        if (!Store.getProperty('onboardingComplete')) {
            navigate('/onboarding');
        } else {
            navigate('/');
        }

        // Mark loading complete
        Store.set('isLoading', false);

        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }

        // Emit app ready event
        EventBus.emit(Events.APP_READY);
        console.log('✅ Niyam - Ready!');

    } catch (error) {
        console.error('❌ Niyam - Init failed:', error);
        EventBus.emit(Events.APP_ERROR, { error, context: 'init' });
        showErrorState();
    }
}

/**
 * Show error state if app fails to load
 */
function showErrorState() {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 24px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">😔</div>
                <h1 style="font-size: 20px; margin-bottom: 8px;">Something went wrong</h1>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">Please refresh the page to try again.</p>
                <button onclick="location.reload()" style="background: var(--primary); color: white; padding: 12px 24px; border-radius: 12px; border: none; cursor: pointer;">
                    Refresh
                </button>
            </div>
        `;
    }
}

/**
 * Toast notification helper
 * @param {string} message
 * @param {number} duration
 */
export function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, duration);
}

// Subscribe to toast events
EventBus.on(Events.TOAST_SHOW, ({ message, duration }) => {
    showToast(message, duration);
});

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
