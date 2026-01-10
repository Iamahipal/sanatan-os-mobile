/**
 * Sant Darshan App - Learning Paths Modal
 * Guided learning journeys
 */

import { clearChildren, createElement, addClass, removeClass } from '../utils/dom.js';
import { escapeHtml } from '../utils/sanitize.js';
import paths from '../services/paths.js';
import { navigate, closeModal } from '../core/router.js';
import { showToast } from '../components/toast.js';

/**
 * Paths Modal Renderer
 */
const PathsModal = {
    container: null,
    cleanupFns: [],
    currentView: 'list', // 'list' | 'detail'
    selectedPathId: null,

    /**
     * Render the paths modal
     * @param {HTMLElement} container
     * @param {Object} data
     * @returns {Function} Cleanup function
     */
    render(container, data = {}) {
        this.container = container;
        this.cleanupFns = [];
        this.currentView = data.pathId ? 'detail' : 'list';
        this.selectedPathId = data.pathId || null;

        // Build modal structure
        this.buildModal();
        this.renderCurrentView();

        return () => this.cleanup();
    },

    /**
     * Build modal structure
     */
    buildModal() {
        this.container.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container modal-full-height">
                <div class="modal-header">
                    <div class="modal-title-group">
                        <h2 class="modal-title">Learning Paths</h2>
                        <p class="modal-title-hi" lang="hi">ज्ञान पथ</p>
                    </div>
                    <button class="modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="paths-content"></div>
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
     * Render current view
     */
    renderCurrentView() {
        const content = this.container.querySelector('#paths-content');
        if (!content) return;

        if (this.currentView === 'detail' && this.selectedPathId) {
            this.renderPathDetail(content);
        } else {
            this.renderPathsList(content);
        }
    },

    /**
     * Render paths list
     */
    renderPathsList(content) {
        const allPaths = paths.getAllPaths();
        const activePath = paths.getActivePath();
        const stats = paths.getStats();

        content.innerHTML = `
            <!-- Overall Progress -->
            <div class="paths-overview">
                <div class="overview-stat">
                    <span class="stat-icon"><i class="fas fa-road"></i></span>
                    <div class="stat-info">
                        <span class="stat-value">${stats.completedPaths}</span>
                        <span class="stat-label">Paths Completed</span>
                    </div>
                </div>
                <div class="overview-stat">
                    <span class="stat-icon"><i class="fas fa-check-circle"></i></span>
                    <div class="stat-info">
                        <span class="stat-value">${stats.completedSteps}</span>
                        <span class="stat-label">Steps Done</span>
                    </div>
                </div>
            </div>

            ${activePath ? `
                <!-- Active Path -->
                <div class="active-path-section">
                    <h3 class="section-title">
                        <i class="fas fa-play-circle"></i> Continue Learning
                    </h3>
                    ${this.renderPathCard(activePath, true)}
                </div>
            ` : ''}

            <!-- All Paths -->
            <div class="paths-section">
                <h3 class="section-title">
                    <i class="fas fa-compass"></i> All Learning Paths
                </h3>
                <div class="paths-list">
                    ${allPaths.map(path => this.renderPathCard(path, false)).join('')}
                </div>
            </div>
        `;

        // Path card clicks
        content.querySelectorAll('.path-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectedPathId = card.dataset.pathId;
                this.currentView = 'detail';
                this.renderCurrentView();
            });
        });
    },

    /**
     * Render path card
     */
    renderPathCard(path, isActive) {
        const progress = paths.getPathProgress(path.id);
        const statusIcon = progress.completed ? 'fa-check-circle' :
                          progress.started ? 'fa-play-circle' : 'fa-circle';
        const statusClass = progress.completed ? 'completed' :
                           progress.started ? 'in-progress' : '';

        return `
            <div class="path-card ${statusClass} ${isActive ? 'active' : ''}" data-path-id="${escapeHtml(path.id)}">
                <div class="path-icon">${path.icon}</div>
                <div class="path-info">
                    <h4 class="path-title">${escapeHtml(path.title)}</h4>
                    <p class="path-description">${escapeHtml(path.description)}</p>
                    <div class="path-meta">
                        <span class="path-steps">
                            <i class="fas fa-list"></i> ${path.steps.length} steps
                        </span>
                        <span class="path-duration">
                            <i class="fas fa-clock"></i> ${path.estimatedDays} days
                        </span>
                    </div>
                    ${progress.started ? `
                        <div class="path-progress">
                            <div class="progress-bar">
                                <div class="progress-bar-fill" style="width: ${progress.percentage}%"></div>
                            </div>
                            <span class="progress-text">${progress.completedSteps}/${path.steps.length}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="path-status">
                    <i class="fas ${statusIcon}"></i>
                </div>
            </div>
        `;
    },

    /**
     * Render path detail
     */
    renderPathDetail(content) {
        const path = paths.getPath(this.selectedPathId);
        if (!path) {
            this.currentView = 'list';
            this.renderCurrentView();
            return;
        }

        const progress = paths.getPathProgress(path.id);
        const currentStep = paths.getCurrentStep(path.id);

        content.innerHTML = `
            <button class="btn btn-text back-btn" id="back-to-list">
                <i class="fas fa-arrow-left"></i> All Paths
            </button>

            <!-- Path Header -->
            <div class="path-header">
                <div class="path-header-icon">${path.icon}</div>
                <h3 class="path-header-title">${escapeHtml(path.title)}</h3>
                ${path.titleHi ? `<p class="path-header-title-hi" lang="hi">${escapeHtml(path.titleHi)}</p>` : ''}
                <p class="path-header-description">${escapeHtml(path.description)}</p>
            </div>

            <!-- Progress -->
            <div class="path-detail-progress">
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${progress.percentage}%"></div>
                </div>
                <div class="progress-info">
                    <span>${progress.completedSteps} of ${path.steps.length} steps completed</span>
                    <span>${Math.round(progress.percentage)}%</span>
                </div>
            </div>

            <!-- Steps -->
            <div class="path-steps">
                <h4 class="steps-title">Steps</h4>
                <div class="steps-list">
                    ${path.steps.map((step, index) => this.renderStep(step, index, progress, currentStep)).join('')}
                </div>
            </div>

            ${!progress.started ? `
                <div class="path-actions">
                    <button class="btn btn-primary btn-block" id="start-path-btn">
                        <i class="fas fa-play"></i> Start This Path
                    </button>
                </div>
            ` : progress.completed ? `
                <div class="path-complete-banner">
                    <i class="fas fa-trophy"></i>
                    <span>Path Completed!</span>
                </div>
            ` : ''}
        `;

        // Back button
        const backBtn = content.querySelector('#back-to-list');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.currentView = 'list';
                this.renderCurrentView();
            });
        }

        // Start button
        const startBtn = content.querySelector('#start-path-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                paths.startPath(path.id);
                showToast('Path started!', 'success');
                this.renderCurrentView();
            });
        }

        // Step actions
        content.querySelectorAll('.step-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const stepIndex = parseInt(btn.dataset.stepIndex, 10);
                this.handleStepAction(path, stepIndex);
            });
        });

        // Navigate to saint
        content.querySelectorAll('.step-saint-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const saintId = link.dataset.saintId;
                closeModal();
                navigate('saint', { id: saintId });
            });
        });
    },

    /**
     * Render step
     */
    renderStep(step, index, progress, currentStep) {
        const isCompleted = progress.completedStepIndexes?.includes(index);
        const isCurrent = currentStep && currentStep.index === index;
        const isLocked = !progress.started || (index > 0 && !progress.completedStepIndexes?.includes(index - 1) && !isCurrent);

        let statusClass = '';
        let statusIcon = 'fa-circle';
        if (isCompleted) {
            statusClass = 'completed';
            statusIcon = 'fa-check-circle';
        } else if (isCurrent) {
            statusClass = 'current';
            statusIcon = 'fa-play-circle';
        } else if (isLocked) {
            statusClass = 'locked';
            statusIcon = 'fa-lock';
        }

        return `
            <div class="step-card ${statusClass}">
                <div class="step-number">
                    <i class="fas ${statusIcon}"></i>
                </div>
                <div class="step-info">
                    <h5 class="step-title">${escapeHtml(step.title)}</h5>
                    <p class="step-description">${escapeHtml(step.description)}</p>
                    ${step.saintId ? `
                        <button class="btn btn-sm btn-text step-saint-link" data-saint-id="${escapeHtml(step.saintId)}">
                            <i class="fas fa-user"></i> View Saint
                        </button>
                    ` : ''}
                </div>
                ${!isLocked && !isCompleted ? `
                    <button class="btn btn-sm btn-primary step-action-btn" data-step-index="${index}">
                        ${isCurrent ? 'Complete' : 'Start'}
                    </button>
                ` : ''}
            </div>
        `;
    },

    /**
     * Handle step action
     */
    handleStepAction(path, stepIndex) {
        const step = path.steps[stepIndex];

        // If step has a saint, navigate to it
        if (step.saintId) {
            closeModal();
            navigate('saint', { id: step.saintId });
            // Mark step as completed after viewing
            paths.completeStep(path.id, stepIndex);
        } else {
            // Just mark as completed
            paths.completeStep(path.id, stepIndex);
            showToast('Step completed!', 'success');
            this.renderCurrentView();
        }
    },

    /**
     * Cleanup
     */
    cleanup() {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }
};

export default PathsModal;
