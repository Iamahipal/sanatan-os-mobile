/**
 * Sadhana Guru - Main App Entry
 * Application initialization and routing
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        // Load saved state
        Storage.load();

        // Initialize screens
        VowScreen.init();

        // Determine starting screen
        const state = State.get();
        if (state.hasVow) {
            this.showScreen('main');
            MainScreen.init();
        } else {
            this.showScreen('invocation');
        }

        // Subscribe to state changes
        State.subscribe((newState, oldState) => {
            // Handle screen-specific updates
            if (newState.currentScreen === 'main') {
                MainScreen.refresh();
            }
        });
    },

    /**
     * Show a screen by ID
     */
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(`${screenId}Screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            State.set({ currentScreen: screenId });
        }
    },

    /**
     * Show a toast notification
     */
    showToast(message, duration = 3000) {
        // Remove existing toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Make it globally available
window.App = App;
