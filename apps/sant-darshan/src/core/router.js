/**
 * Sant Darshan App - Router
 * Screen navigation and history management
 */

import state from './state.js';
import eventBus, { Events } from './events.js';
import { SCREENS, MODALS } from '../data/constants.js';
import { $, addClass, removeClass, hide, show } from '../utils/dom.js';

/**
 * Screen configuration
 */
const screenConfig = {
    [SCREENS.HOME]: {
        title: 'Sant Darshan',
        showBack: false,
        showSearch: true
    },
    [SCREENS.SAINTS_LIST]: {
        title: '', // Dynamic based on tradition
        showBack: true,
        showSearch: true
    },
    [SCREENS.SAINT_DETAIL]: {
        title: '', // Dynamic based on saint
        showBack: true,
        showSearch: false
    }
};

/**
 * Router Class
 * Handles screen navigation and modal management
 */
class Router {
    constructor() {
        this.screens = {};
        this.modals = {};
        this.screenRenderers = {};
        this.modalRenderers = {};
        this.currentCleanup = null;
        this.modalCleanup = null;
        this.previousFocus = null;
    }

    /**
     * Initialize router
     * @param {Object} config - Screen and modal element IDs
     */
    init(config = {}) {
        // Cache screen elements
        Object.values(SCREENS).forEach(screenId => {
            this.screens[screenId] = $(`#${screenId}-screen`);
        });

        // Cache modal elements
        Object.values(MODALS).forEach(modalId => {
            this.modals[modalId] = $(`#${modalId}-modal`);
        });

        // Set up browser back button support
        window.addEventListener('popstate', this.handlePopState.bind(this));

        // Listen for navigation events
        eventBus.on(Events.NAVIGATE, this.handleNavigate.bind(this));
        eventBus.on(Events.MODAL_OPEN, this.handleModalOpen.bind(this));
        eventBus.on(Events.MODAL_CLOSE, this.handleModalClose.bind(this));

        // Show initial screen
        this.showScreen(state.get('currentScreen') || SCREENS.HOME);
    }

    /**
     * Register a screen renderer
     * @param {string} screenId - Screen identifier
     * @param {Object} renderer - Renderer with render() and optional cleanup() methods
     */
    registerScreen(screenId, renderer) {
        this.screenRenderers[screenId] = renderer;
    }

    /**
     * Register a modal renderer
     * @param {string} modalId - Modal identifier
     * @param {Object} renderer - Renderer with render() and optional cleanup() methods
     */
    registerModal(modalId, renderer) {
        this.modalRenderers[modalId] = renderer;
    }

    /**
     * Navigate to a screen
     * @param {string} screenId - Target screen
     * @param {Object} data - Screen data/params
     * @param {Object} options - Navigation options
     */
    navigate(screenId, data = {}, options = {}) {
        const { replace = false, silent = false } = options;

        if (!Object.values(SCREENS).includes(screenId)) {
            console.error(`Unknown screen: ${screenId}`);
            return;
        }

        // Get current state for history
        const previousScreen = state.get('currentScreen');
        const previousData = {
            tradition: state.get('currentTradition'),
            saint: state.get('currentSaint')
        };

        // Update state based on screen
        const updates = {
            currentScreen: screenId,
            previousScreen
        };

        if (data.tradition !== undefined) {
            updates.currentTradition = data.tradition;
        }
        if (data.saint !== undefined) {
            updates.currentSaint = data.saint;
        }
        if (data.filter !== undefined) {
            updates.currentFilter = data.filter;
        }

        // Manage navigation stack
        if (!replace && previousScreen && previousScreen !== screenId) {
            const stack = state.get('navigationStack') || [];
            stack.push({ screen: previousScreen, data: previousData });
            updates.navigationStack = stack;
        }

        state.update(updates, { persist: false });

        // Update browser history
        if (!silent) {
            const historyState = { screenId, data };
            if (replace) {
                history.replaceState(historyState, '', `#${screenId}`);
            } else {
                history.pushState(historyState, '', `#${screenId}`);
            }
        }

        // Show the screen
        this.showScreen(screenId, data);
    }

    /**
     * Go back in navigation history
     */
    back() {
        const stack = state.get('navigationStack') || [];

        if (stack.length > 0) {
            const previous = stack.pop();
            state.set('navigationStack', stack, { persist: false });
            this.navigate(previous.screen, previous.data, { replace: true });
        } else {
            // Default to home
            this.navigate(SCREENS.HOME, {}, { replace: true });
        }
    }

    /**
     * Show a screen element and render its content
     * @param {string} screenId - Screen to show
     * @param {Object} data - Screen data
     */
    showScreen(screenId, data = {}) {
        // Run cleanup for previous screen
        if (this.currentCleanup) {
            this.currentCleanup();
            this.currentCleanup = null;
        }

        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                hide(screen);
                removeClass(screen, 'active');
            }
        });

        // Show target screen
        const targetScreen = this.screens[screenId];
        if (targetScreen) {
            show(targetScreen);
            addClass(targetScreen, 'active');
        }

        // Update header
        this.updateHeader(screenId, data);

        // Render screen content
        const renderer = this.screenRenderers[screenId];
        if (renderer && typeof renderer.render === 'function') {
            const cleanup = renderer.render(targetScreen, data);
            if (typeof cleanup === 'function') {
                this.currentCleanup = cleanup;
            }
        }

        // Scroll to top
        window.scrollTo(0, 0);

        // Emit event
        eventBus.emit(Events.SCREEN_CHANGED, { screenId, data });
    }

    /**
     * Update header based on current screen
     * @param {string} screenId
     * @param {Object} data
     */
    updateHeader(screenId, data = {}) {
        const config = screenConfig[screenId] || {};
        const backBtn = $('#back-btn');
        const searchBtn = $('#search-btn');
        const pageTitle = $('#page-title');

        // Back button
        if (backBtn) {
            if (config.showBack) {
                show(backBtn, 'flex');
                backBtn.onclick = () => this.back();
            } else {
                hide(backBtn);
            }
        }

        // Search button
        if (searchBtn) {
            if (config.showSearch) {
                show(searchBtn, 'flex');
            } else {
                hide(searchBtn);
            }
        }

        // Page title
        if (pageTitle) {
            let title = config.title;

            if (screenId === SCREENS.SAINTS_LIST && data.tradition) {
                // Get tradition name from data or state
                title = data.traditionName || state.get('currentTradition')?.name || 'Saints';
            } else if (screenId === SCREENS.SAINT_DETAIL && data.saint) {
                title = data.saint.name || 'Saint';
            }

            pageTitle.textContent = title || 'Sant Darshan';
        }
    }

    /**
     * Open a modal
     * @param {string} modalId - Modal identifier
     * @param {Object} data - Modal data
     */
    openModal(modalId, data = {}) {
        if (!Object.values(MODALS).includes(modalId)) {
            console.error(`Unknown modal: ${modalId}`);
            return;
        }

        // Store previous focus for restoration
        this.previousFocus = document.activeElement;

        // Close any open modal first
        this.closeModal();

        // Update state
        state.update({
            activeModal: modalId,
            modalData: data
        }, { persist: false });

        // Get modal element
        const modal = this.modals[modalId];
        if (!modal) {
            console.error(`Modal element not found: ${modalId}`);
            return;
        }

        // Show modal
        show(modal);
        addClass(modal, 'active');
        document.body.classList.add('modal-open');

        // Render modal content
        const renderer = this.modalRenderers[modalId];
        if (renderer && typeof renderer.render === 'function') {
            const cleanup = renderer.render(modal, data);
            if (typeof cleanup === 'function') {
                this.modalCleanup = cleanup;
            }
        }

        // Setup close handlers
        this.setupModalCloseHandlers(modal, modalId);

        // Focus first focusable element
        const firstFocusable = modal.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();

        // Add escape key handler
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
    }

    /**
     * Setup modal close handlers
     * @param {HTMLElement} modal
     * @param {string} modalId
     */
    setupModalCloseHandlers(modal, modalId) {
        // Close button
        const closeBtn = modal.querySelector('.modal-close, [data-close-modal]');
        if (closeBtn) {
            closeBtn.onclick = () => this.closeModal();
        }

        // Backdrop click
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.onclick = (e) => {
                if (e.target === backdrop) {
                    this.closeModal();
                }
            };
        }

        // Also close on clicking the modal overlay itself (outside content)
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        };
    }

    /**
     * Close the active modal
     */
    closeModal() {
        const activeModalId = state.get('activeModal');
        if (!activeModalId) return;

        // Run cleanup
        if (this.modalCleanup) {
            this.modalCleanup();
            this.modalCleanup = null;
        }

        // Hide modal
        const modal = this.modals[activeModalId];
        if (modal) {
            removeClass(modal, 'active');
            hide(modal);
        }

        // Update state
        state.update({
            activeModal: null,
            modalData: null
        }, { persist: false });

        document.body.classList.remove('modal-open');

        // Remove escape handler
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }

        // Restore focus
        if (this.previousFocus) {
            this.previousFocus.focus();
            this.previousFocus = null;
        }

        eventBus.emit(Events.MODAL_CLOSE, { modalId: activeModalId });
    }

    /**
     * Handle navigation event
     * @param {Object} data
     */
    handleNavigate(data) {
        const { screen, ...rest } = data;
        this.navigate(screen, rest);
    }

    /**
     * Handle modal open event
     * @param {Object} data
     */
    handleModalOpen(data) {
        const { modal, ...rest } = data;
        this.openModal(modal, rest);
    }

    /**
     * Handle modal close event
     */
    handleModalClose() {
        this.closeModal();
    }

    /**
     * Handle browser back button
     * @param {PopStateEvent} event
     */
    handlePopState(event) {
        if (event.state?.screenId) {
            this.navigate(event.state.screenId, event.state.data || {}, { silent: true });
        } else {
            // Default to home on invalid state
            this.navigate(SCREENS.HOME, {}, { silent: true, replace: true });
        }
    }

    /**
     * Check if a modal is currently open
     * @returns {boolean}
     */
    isModalOpen() {
        return state.get('activeModal') !== null;
    }

    /**
     * Get current screen
     * @returns {string}
     */
    getCurrentScreen() {
        return state.get('currentScreen');
    }
}

// Create and export singleton instance
const router = new Router();

export default router;
export { Router };

// Convenience functions
export const navigate = (screen, data, options) => router.navigate(screen, data, options);
export const back = () => router.back();
export const openModal = (modal, data) => router.openModal(modal, data);
export const closeModal = () => router.closeModal();
