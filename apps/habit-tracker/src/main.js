import { Router } from './core/Router.js';
import { store } from './core/Store.js';
import { StorageService } from './services/StorageService.js';
import { AuthService } from './services/AuthService.js';
import { DashboardScreen } from './screens/DashboardScreen.js';
import { HabitFormScreen } from './screens/HabitFormScreen.js';
import { OnboardingScreen } from './screens/OnboardingScreen.js';

import { HabitDetailsScreen } from './screens/HabitDetailsScreen.js';
import { SettingsScreen } from './screens/SettingsScreen.js';

// Define Routes
const routes = {
    '/': DashboardScreen,
    '/add-habit': HabitFormScreen,
    '/onboarding': OnboardingScreen,
    '/settings': SettingsScreen,
    '/habit-details': HabitDetailsScreen
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Niyam (v2) Initializing...');

    // 1. Init Auth
    AuthService.init();

    // 2. Load Data
    const savedData = StorageService.load();
    const migratedData = StorageService.checkMigration(savedData);

    if (migratedData) {
        // Restore state
        store.set('habits', migratedData.habits || []);
        store.set('userPoints', migratedData.userPoints || 0);
        store.set('onboardingComplete', migratedData.onboardingComplete || false);
    }

    // 3. Start Router
    const router = new Router(routes);

    // Check Onboarding
    const state = store.get();
    if (!state.onboardingComplete) {
        Router.navigate('/onboarding');
    }

    // Handle initial route
    router.handleRoute();
});
