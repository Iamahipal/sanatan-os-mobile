/**
 * Sant Darshan App - Achievements Modal
 * Displays all achievements and progress
 */

import { clearChildren, createElement, addClass, removeClass } from '../utils/dom.js';
import { escapeHtml } from '../utils/sanitize.js';
import achievements from '../services/achievements.js';
import { closeModal } from '../core/router.js';

/**
 * Achievements Modal Renderer
 */
const AchievementsModal = {
    container: null,
    cleanupFns: [],

    /**
     * Render the achievements modal
     * @param {HTMLElement} container
     * @param {Object} data
     * @returns {Function} Cleanup function
     */
    render(container, data = {}) {
        this.container = container;
        this.cleanupFns = [];

        // Build modal structure
        this.buildModal();

        return () => this.cleanup();
    },

    /**
     * Build modal structure
     */
    buildModal() {
        const stats = achievements.getStats();
        const allAchievements = achievements.getAllAchievements();
        const unlocked = allAchievements.filter(a => a.unlocked);
        const locked = allAchievements.filter(a => !a.unlocked);

        this.container.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-title-group">
                        <h2 class="modal-title">Achievements</h2>
                        <p class="modal-title-hi" lang="hi">उपलब्धियाँ</p>
                    </div>
                    <button class="modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Stats Summary -->
                    <div class="achievements-summary">
                        <div class="achievements-stat">
                            <span class="stat-value">${stats.unlocked}</span>
                            <span class="stat-label">Unlocked</span>
                        </div>
                        <div class="achievements-stat">
                            <span class="stat-value">${stats.total}</span>
                            <span class="stat-label">Total</span>
                        </div>
                        <div class="achievements-stat">
                            <span class="stat-value">${stats.totalPoints}</span>
                            <span class="stat-label">Points</span>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="achievements-progress">
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width: ${stats.percentage}%"></div>
                        </div>
                        <span class="progress-text">${Math.round(stats.percentage)}% Complete</span>
                    </div>

                    ${unlocked.length > 0 ? `
                        <!-- Unlocked Achievements -->
                        <div class="achievements-section">
                            <h3 class="section-title">
                                <i class="fas fa-trophy"></i>
                                Unlocked (${unlocked.length})
                            </h3>
                            <div class="achievements-list">
                                ${unlocked.map(a => this.renderAchievement(a, true)).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${locked.length > 0 ? `
                        <!-- Locked Achievements -->
                        <div class="achievements-section">
                            <h3 class="section-title">
                                <i class="fas fa-lock"></i>
                                Locked (${locked.length})
                            </h3>
                            <div class="achievements-list">
                                ${locked.map(a => this.renderAchievement(a, false)).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Setup close button
        const closeBtn = this.container.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal());
        }

        // Backdrop click
        const backdrop = this.container.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => closeModal());
        }
    },

    /**
     * Render a single achievement
     */
    renderAchievement(achievement, isUnlocked) {
        const progressHtml = !isUnlocked && achievement.progress !== undefined ? `
            <div class="achievement-progress">
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${Math.min(100, achievement.progress)}%"></div>
                </div>
                <span class="progress-text">${Math.round(achievement.progress)}%</span>
            </div>
        ` : '';

        const unlockedDateHtml = isUnlocked && achievement.unlockedAt ? `
            <span class="achievement-date">
                <i class="fas fa-calendar-check"></i>
                ${new Date(achievement.unlockedAt).toLocaleDateString()}
            </span>
        ` : '';

        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon ${isUnlocked ? '' : 'locked'}">
                    ${achievement.icon}
                </div>
                <div class="achievement-info">
                    <h4 class="achievement-title">${escapeHtml(achievement.title)}</h4>
                    <p class="achievement-description">${escapeHtml(achievement.description)}</p>
                    ${progressHtml}
                    ${unlockedDateHtml}
                </div>
                <div class="achievement-points">
                    <span class="points-value">${achievement.points}</span>
                    <span class="points-label">pts</span>
                </div>
            </div>
        `;
    },

    /**
     * Cleanup
     */
    cleanup() {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }
};

export default AchievementsModal;
