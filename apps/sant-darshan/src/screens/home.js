/**
 * Sant Darshan App - Home Screen
 * Main landing screen with traditions, progress, and quick actions
 */

import { $, clearChildren, delegate } from '../utils/dom.js';
import { escapeHtml } from '../utils/sanitize.js';
import state from '../core/state.js';
import eventBus, { Events } from '../core/events.js';
import { navigate, openModal } from '../core/router.js';
import { SCREENS, MODALS } from '../data/constants.js';
import { TRADITIONS } from '../data/traditions.js';
import storage from '../services/storage.js';
import saints, { getTodaysSaint, getSaintCount, getTraditions, getSaint } from '../services/saints.js';
import achievements from '../services/achievements.js';
import {
    createTraditionCard,
    createFavoriteCard,
    createTodaySaintCard,
    createActionCard,
    createStatCard,
    createProgressRing
} from '../components/cards.js';

/**
 * Home Screen Renderer
 */
const HomeScreen = {
    container: null,
    cleanupFns: [],

    /**
     * Render the home screen
     * @param {HTMLElement} container
     * @returns {Function} Cleanup function
     */
    render(container) {
        this.container = container;
        this.cleanupFns = [];

        // Build the screen content
        this.buildContent();

        // Setup event handlers
        this.setupEventHandlers();

        // Check if should show daily darshan modal
        this.checkDailyDarshan();

        // Return cleanup function
        return () => this.cleanup();
    },

    /**
     * Build the home screen content
     */
    buildContent() {
        const content = this.container.querySelector('.screen-content') || this.container;
        clearChildren(content);

        // Progress banner
        content.appendChild(this.createProgressBanner());

        // Favorites carousel (if any)
        const favorites = storage.getFavorites();
        if (favorites.length > 0) {
            content.appendChild(this.createFavoritesSection(favorites));
        }

        // Today's saint
        const todaysSaint = getTodaysSaint();
        if (todaysSaint) {
            content.appendChild(this.createTodaySection(todaysSaint));
        }

        // Traditions grid
        content.appendChild(this.createTraditionsSection());

        // Stats section
        content.appendChild(this.createStatsSection());

        // Wisdom quote
        content.appendChild(this.createWisdomSection());

        // Action cards
        content.appendChild(this.createActionsSection());
    },

    /**
     * Create progress banner
     */
    createProgressBanner() {
        const explored = storage.getExploredCount();
        const total = getSaintCount();
        const percentage = total > 0 ? (explored / total) * 100 : 0;
        const streak = storage.getStreak();

        const section = document.createElement('section');
        section.className = 'progress-banner';
        section.innerHTML = `
            <div class="progress-banner-content">
                <div class="progress-ring-container">
                    ${this.createProgressRingSVG(percentage)}
                    <div class="progress-ring-text">
                        <span class="progress-percent">${Math.round(percentage)}%</span>
                    </div>
                </div>
                <div class="progress-info">
                    <h3 class="progress-title">Your Journey</h3>
                    <p class="progress-subtitle">${explored} of ${total} saints explored</p>
                    ${streak > 0 ? `<p class="progress-streak"><i class="fas fa-fire"></i> ${streak} day streak</p>` : ''}
                </div>
            </div>
        `;

        return section;
    },

    /**
     * Create progress ring SVG
     */
    createProgressRingSVG(percentage) {
        const radius = 15.5;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return `
            <svg class="progress-ring" viewBox="0 0 40 40">
                <circle class="progress-ring-bg" cx="20" cy="20" r="${radius}" fill="none" stroke="var(--surface-variant)" stroke-width="3"/>
                <circle class="progress-ring-circle" cx="20" cy="20" r="${radius}" fill="none" stroke="var(--primary-color)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" transform="rotate(-90 20 20)"/>
            </svg>
        `;
    },

    /**
     * Create favorites section
     */
    createFavoritesSection(favoriteIds) {
        const section = document.createElement('section');
        section.className = 'favorites-section';
        section.innerHTML = `
            <h3 class="section-title"><i class="fas fa-heart"></i> Favorites</h3>
            <div class="favorites-carousel"></div>
        `;

        const carousel = section.querySelector('.favorites-carousel');
        favoriteIds.forEach(id => {
            const saint = getSaint(id);
            if (saint) {
                carousel.appendChild(createFavoriteCard(saint, {
                    onClick: (s) => this.onSaintClick(s)
                }));
            }
        });

        return section;
    },

    /**
     * Create today's saint section
     */
    createTodaySection(saint) {
        const section = document.createElement('section');
        section.className = 'today-section';

        section.appendChild(createTodaySaintCard(saint, {
            onClick: (s) => this.onSaintClick(s)
        }));

        return section;
    },

    /**
     * Create traditions grid section
     */
    createTraditionsSection() {
        const traditions = getTraditions();

        const section = document.createElement('section');
        section.className = 'traditions-section';
        section.innerHTML = `
            <h3 class="section-title">Explore by Tradition</h3>
            <div class="traditions-grid"></div>
        `;

        const grid = section.querySelector('.traditions-grid');
        traditions.forEach(tradition => {
            grid.appendChild(createTraditionCard(tradition, {
                onClick: (t) => this.onTraditionClick(t)
            }));
        });

        return section;
    },

    /**
     * Create stats section
     */
    createStatsSection() {
        const stats = [
            {
                icon: 'fas fa-om',
                value: getSaintCount(),
                label: 'Saints',
                color: 'var(--hindu-color)'
            },
            {
                icon: 'fas fa-layer-group',
                value: Object.keys(TRADITIONS).length,
                label: 'Traditions',
                color: 'var(--sikh-color)'
            },
            {
                icon: 'fas fa-check-circle',
                value: storage.getExploredCount(),
                label: 'Explored',
                color: 'var(--success-color)'
            },
            {
                icon: 'fas fa-trophy',
                value: achievements.getUnlocked().length,
                label: 'Achievements',
                color: 'var(--jain-color)'
            }
        ];

        const section = document.createElement('section');
        section.className = 'stats-section';
        section.innerHTML = `<div class="stats-grid"></div>`;

        const grid = section.querySelector('.stats-grid');
        stats.forEach(stat => {
            grid.appendChild(createStatCard(stat));
        });

        return section;
    },

    /**
     * Create wisdom quote section
     */
    createWisdomSection() {
        const todaysSaint = getTodaysSaint();
        const quote = todaysSaint?.quotes?.[0] || '"The light of knowledge removes the darkness of ignorance."';

        const section = document.createElement('section');
        section.className = 'wisdom-section';
        section.innerHTML = `
            <div class="wisdom-card">
                <i class="fas fa-quote-left wisdom-icon"></i>
                <p class="wisdom-text">${escapeHtml(quote)}</p>
                ${todaysSaint ? `<p class="wisdom-author">— ${escapeHtml(todaysSaint.name)}</p>` : ''}
            </div>
        `;

        return section;
    },

    /**
     * Create action cards section
     */
    createActionsSection() {
        const quizStats = storage.getQuizStats();
        const achievementStats = achievements.getStats();
        const journalCount = storage.getJournalCount();

        const actions = [
            {
                id: 'quiz',
                icon: 'fas fa-question-circle',
                title: 'Quiz',
                subtitle: `${quizStats.totalCompleted} completed`,
                onClick: () => openModal(MODALS.QUIZ)
            },
            {
                id: 'achievements',
                icon: 'fas fa-trophy',
                title: 'Achievements',
                subtitle: `${achievementStats.unlocked}/${achievementStats.total} unlocked`,
                onClick: () => openModal(MODALS.ACHIEVEMENTS)
            },
            {
                id: 'paths',
                icon: 'fas fa-road',
                title: 'Learning Paths',
                subtitle: 'Curated journeys',
                onClick: () => openModal(MODALS.PATHS)
            },
            {
                id: 'journal',
                icon: 'fas fa-book',
                title: 'Journal',
                subtitle: `${journalCount} entries`,
                onClick: () => openModal(MODALS.JOURNAL)
            },
            {
                id: 'pilgrimage',
                icon: 'fas fa-map-marker-alt',
                title: 'Pilgrimage',
                subtitle: 'Sacred places',
                onClick: () => openModal(MODALS.PILGRIMAGE)
            },
            {
                id: 'jayanti',
                icon: 'fas fa-calendar-alt',
                title: 'Jayanti Calendar',
                subtitle: 'Birth anniversaries',
                onClick: () => openModal(MODALS.JAYANTI)
            }
        ];

        const section = document.createElement('section');
        section.className = 'actions-section';
        section.innerHTML = `
            <h3 class="section-title">Features</h3>
            <div class="actions-grid"></div>
        `;

        const grid = section.querySelector('.actions-grid');
        actions.forEach(action => {
            grid.appendChild(createActionCard(action));
        });

        return section;
    },

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Listen for progress updates to refresh UI
        const progressUnsub = eventBus.on(Events.PROGRESS_UPDATED, () => {
            this.buildContent();
        });
        this.cleanupFns.push(progressUnsub);

        // Listen for favorite changes
        const favUnsub = eventBus.on(Events.FAVORITE_ADDED, () => {
            this.buildContent();
        });
        this.cleanupFns.push(favUnsub);

        const favRemoveUnsub = eventBus.on(Events.FAVORITE_REMOVED, () => {
            this.buildContent();
        });
        this.cleanupFns.push(favRemoveUnsub);
    },

    /**
     * Check and show daily darshan modal
     */
    checkDailyDarshan() {
        if (storage.shouldShowDailyDarshan()) {
            // Could show a daily darshan modal here
            storage.markDailyDarshanShown();
        }
    },

    /**
     * Handle tradition card click
     */
    onTraditionClick(tradition) {
        navigate(SCREENS.SAINTS_LIST, {
            tradition: tradition.id,
            traditionName: tradition.name
        });
    },

    /**
     * Handle saint click
     */
    onSaintClick(saint) {
        navigate(SCREENS.SAINT_DETAIL, {
            saint: saint,
            saintId: saint.id,
            saintName: saint.name
        });
    },

    /**
     * Cleanup function
     */
    cleanup() {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }
};

export default HomeScreen;
