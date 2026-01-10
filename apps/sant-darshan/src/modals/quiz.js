/**
 * Sant Darshan App - Quiz Modal
 * Interactive quiz about saints
 */

import { clearChildren, createElement, addClass, removeClass } from '../utils/dom.js';
import { escapeHtml } from '../utils/sanitize.js';
import quiz from '../services/quiz.js';
import { closeModal } from '../core/router.js';

/**
 * Quiz Modal Renderer
 */
const QuizModal = {
    container: null,
    cleanupFns: [],

    /**
     * Render the quiz modal
     * @param {HTMLElement} container
     * @param {Object} data
     * @returns {Function} Cleanup function
     */
    render(container, data = {}) {
        this.container = container;
        this.cleanupFns = [];

        // Build modal structure
        this.buildModal();

        // Start a new quiz if none in progress
        if (!quiz.isInProgress()) {
            quiz.startQuiz();
        }

        // Render current state
        this.renderCurrentState();

        return () => this.cleanup();
    },

    /**
     * Build modal structure
     */
    buildModal() {
        this.container.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-title-group">
                        <h2 class="modal-title">Quiz</h2>
                        <p class="modal-title-hi" lang="hi">प्रश्नोत्तरी</p>
                    </div>
                    <button class="modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="quiz-content"></div>
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
     * Render current quiz state
     */
    renderCurrentState() {
        const content = this.container.querySelector('#quiz-content');
        if (!content) return;

        if (quiz.isQuizComplete()) {
            this.renderResult(content);
        } else {
            this.renderQuestion(content);
        }
    },

    /**
     * Render current question
     */
    renderQuestion(content) {
        const question = quiz.getCurrentQuestion();
        const questionNum = quiz.getCurrentQuestionNumber();
        const totalQuestions = quiz.getTotalQuestions();

        if (!question) {
            content.innerHTML = '<p>Error loading question</p>';
            return;
        }

        content.innerHTML = `
            <div class="quiz-progress">
                <span class="quiz-progress-text">Question ${questionNum} of ${totalQuestions}</span>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${(questionNum / totalQuestions) * 100}%"></div>
                </div>
            </div>

            <div class="quiz-question">
                <p class="question-text">${escapeHtml(question.question)}</p>
                ${question.questionHi ? `<p class="question-text-hi" lang="hi">${escapeHtml(question.questionHi)}</p>` : ''}
            </div>

            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option" data-option-id="${escapeHtml(option.id)}" data-index="${index}">
                        <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                        <span class="option-text">${escapeHtml(option.text)}</span>
                        ${option.textHi ? `<span class="option-text-hi" lang="hi">${escapeHtml(option.textHi)}</span>` : ''}
                    </button>
                `).join('')}
            </div>

            <div id="quiz-feedback" class="quiz-feedback"></div>
        `;

        // Setup option click handlers
        const options = content.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.addEventListener('click', () => this.handleAnswer(option));
        });
    },

    /**
     * Handle answer selection
     */
    handleAnswer(optionEl) {
        const optionId = optionEl.dataset.optionId;
        const result = quiz.submitAnswer(optionId);

        if (!result) return;

        // Disable all options
        const options = this.container.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.disabled = true;
            opt.classList.add('disabled');

            if (opt.dataset.optionId === result.correctId) {
                opt.classList.add('correct');
            } else if (opt === optionEl && !result.isCorrect) {
                opt.classList.add('incorrect');
            }
        });

        // Show feedback
        const feedback = this.container.querySelector('#quiz-feedback');
        if (feedback) {
            feedback.innerHTML = `
                <div class="feedback-card ${result.isCorrect ? 'correct' : 'incorrect'}">
                    <i class="fas ${result.isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <span>${result.isCorrect ? 'Correct!' : 'Incorrect'}</span>
                </div>
                ${result.explanation ? `<p class="feedback-explanation">${escapeHtml(result.explanation)}</p>` : ''}
                <button class="btn btn-primary" id="next-question-btn">
                    ${quiz.isQuizComplete() ? 'See Results' : 'Next Question'}
                </button>
            `;

            const nextBtn = feedback.querySelector('#next-question-btn');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (quiz.isQuizComplete()) {
                        this.renderCurrentState();
                    } else {
                        quiz.nextQuestion();
                        this.renderCurrentState();
                    }
                });
            }
        }
    },

    /**
     * Render quiz results
     */
    renderResult(content) {
        const result = quiz.getResult();

        if (!result) {
            content.innerHTML = '<p>Error loading results</p>';
            return;
        }

        content.innerHTML = `
            <div class="quiz-result">
                <div class="result-emoji">${result.emoji}</div>
                <h3 class="result-title">${result.isPerfect ? 'Perfect Score!' : 'Quiz Complete!'}</h3>
                <div class="result-score">
                    <span class="score-value">${result.score}</span>
                    <span class="score-divider">/</span>
                    <span class="score-total">${result.total}</span>
                </div>
                <p class="result-percentage">${Math.round(result.percentage)}% correct</p>
                <p class="result-message">${escapeHtml(result.message)}</p>
            </div>

            <div class="quiz-actions">
                <button class="btn btn-primary" id="retry-quiz-btn">
                    <i class="fas fa-redo"></i> Try Again
                </button>
                <button class="btn btn-secondary" id="close-quiz-btn">
                    Close
                </button>
            </div>
        `;

        // Setup buttons
        const retryBtn = content.querySelector('#retry-quiz-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                quiz.resetQuiz();
                quiz.startQuiz();
                this.renderCurrentState();
            });
        }

        const closeBtn = content.querySelector('#close-quiz-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal());
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

export default QuizModal;
