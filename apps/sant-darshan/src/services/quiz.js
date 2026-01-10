/**
 * Sant Darshan App - Quiz Service
 * Quiz generation and game logic
 */

import state from '../core/state.js';
import eventBus, { Events } from '../core/events.js';
import storage from './storage.js';
import {
    getAllSaints,
    getSaintsWithQuotes,
    getSaintsWithBirthplace,
    getSaintsWithPeriod,
    getTraditions
} from './saints.js';
import { shuffleArray, randomItem, pickRandom } from '../utils/helpers.js';
import { QUIZ_CONFIG } from '../data/constants.js';

/**
 * Quiz question types and generators
 */
const QUESTION_GENERATORS = {
    /**
     * Quote attribution question
     */
    quote_attribution: () => {
        const saintsWithQuotes = getSaintsWithQuotes();
        if (saintsWithQuotes.length < 4) return null;

        const correct = randomItem(saintsWithQuotes);
        const quote = randomItem(correct.quotes);

        const options = [correct];
        while (options.length < 4) {
            const random = randomItem(saintsWithQuotes);
            if (!options.find(o => o.id === random.id)) {
                options.push(random);
            }
        }

        return {
            type: 'quote_attribution',
            question: `Who said: "${quote}"`,
            questionHi: 'यह किसने कहा?',
            options: shuffleArray(options.map(s => ({
                id: s.id,
                text: s.name,
                textHi: s.nameHi
            }))),
            correctId: correct.id,
            explanation: `This quote is from ${correct.name}.`
        };
    },

    /**
     * Tradition identification question
     */
    tradition: () => {
        const saints = getAllSaints();
        const traditions = getTraditions();

        if (saints.length === 0 || traditions.length < 4) return null;

        const saint = randomItem(saints);

        return {
            type: 'tradition',
            question: `Which tradition does ${saint.name} belong to?`,
            questionHi: `${saint.nameHi || saint.name} किस परंपरा से हैं?`,
            options: traditions.map(t => ({
                id: t.id,
                text: t.name,
                textHi: t.nameHi
            })),
            correctId: saint.tradition,
            explanation: `${saint.name} belongs to the ${traditions.find(t => t.id === saint.tradition)?.name || saint.tradition} tradition.`
        };
    },

    /**
     * Birthplace question
     */
    birthplace: () => {
        const saintsWithPlace = getSaintsWithBirthplace();
        if (saintsWithPlace.length < 4) return null;

        const correct = randomItem(saintsWithPlace);
        const options = [{ id: correct.id, text: correct.birthPlace }];

        while (options.length < 4) {
            const random = randomItem(saintsWithPlace);
            if (!options.find(o => o.text === random.birthPlace)) {
                options.push({ id: random.id, text: random.birthPlace });
            }
        }

        return {
            type: 'birthplace',
            question: `Where was ${correct.name} born?`,
            questionHi: `${correct.nameHi || correct.name} कहाँ पैदा हुए?`,
            options: shuffleArray(options),
            correctId: correct.id,
            explanation: `${correct.name} was born in ${correct.birthPlace}.`
        };
    },

    /**
     * Sampradaya question
     */
    sampradaya: () => {
        const saints = getAllSaints();
        const allSampradayas = [...new Set(saints.map(s => s.sampradaya).filter(s => s))];

        if (allSampradayas.length < 4) return null;

        const saint = randomItem(saints.filter(s => s.sampradaya));
        const options = [{ id: saint.sampradaya, text: saint.sampradaya }];

        while (options.length < 4) {
            const random = randomItem(allSampradayas);
            if (!options.find(o => o.text === random)) {
                options.push({ id: random, text: random });
            }
        }

        return {
            type: 'sampradaya',
            question: `${saint.name} belonged to which sampradaya/movement?`,
            questionHi: `${saint.nameHi || saint.name} किस संप्रदाय से थे?`,
            options: shuffleArray(options),
            correctId: saint.sampradaya,
            explanation: `${saint.name} was part of the ${saint.sampradaya} sampradaya.`
        };
    },

    /**
     * Time period question
     */
    period: () => {
        const saintsWithPeriod = getSaintsWithPeriod();
        if (saintsWithPeriod.length < 4) return null;

        const correct = randomItem(saintsWithPeriod);
        const options = [{ id: correct.id, text: correct.period }];

        while (options.length < 4) {
            const random = randomItem(saintsWithPeriod);
            if (!options.find(o => o.text === random.period)) {
                options.push({ id: random.id, text: random.period });
            }
        }

        return {
            type: 'period',
            question: `When did ${correct.name} live?`,
            questionHi: `${correct.nameHi || correct.name} का काल क्या था?`,
            options: shuffleArray(options),
            correctId: correct.id,
            explanation: `${correct.name} lived during ${correct.period}.`
        };
    }
};

/**
 * Quiz Service
 */
class QuizService {
    constructor() {
        this.currentSession = null;
    }

    /**
     * Generate quiz questions
     * @param {number} count - Number of questions
     * @returns {Array}
     */
    generateQuestions(count = QUIZ_CONFIG.questionsPerRound) {
        const questions = [];
        const types = [...QUIZ_CONFIG.questionTypes];
        let attempts = 0;
        const maxAttempts = count * 3;

        while (questions.length < count && attempts < maxAttempts) {
            attempts++;

            // Pick a random question type
            const type = randomItem(types);
            const generator = QUESTION_GENERATORS[type];

            if (generator) {
                const question = generator();
                if (question) {
                    questions.push(question);
                }
            }
        }

        return questions;
    }

    /**
     * Start a new quiz session
     * @param {Object} options
     * @returns {Object} Quiz session
     */
    startQuiz(options = {}) {
        const questionCount = options.questionCount || QUIZ_CONFIG.questionsPerRound;
        const questions = this.generateQuestions(questionCount);

        if (questions.length === 0) {
            eventBus.emit(Events.APP_ERROR, {
                type: 'quiz',
                message: 'Failed to generate quiz questions'
            });
            return null;
        }

        this.currentSession = {
            id: Date.now().toString(),
            questions,
            currentIndex: 0,
            answers: [],
            score: 0,
            startedAt: Date.now(),
            completedAt: null,
            status: 'in_progress'
        };

        // Save to state
        state.set('quizSession', this.currentSession, { persist: false });
        eventBus.emit(Events.QUIZ_STARTED, { session: this.currentSession });

        return this.currentSession;
    }

    /**
     * Get current question
     * @returns {Object|null}
     */
    getCurrentQuestion() {
        if (!this.currentSession) return null;
        return this.currentSession.questions[this.currentSession.currentIndex];
    }

    /**
     * Get current question number (1-indexed)
     * @returns {number}
     */
    getCurrentQuestionNumber() {
        if (!this.currentSession) return 0;
        return this.currentSession.currentIndex + 1;
    }

    /**
     * Get total questions count
     * @returns {number}
     */
    getTotalQuestions() {
        if (!this.currentSession) return 0;
        return this.currentSession.questions.length;
    }

    /**
     * Submit an answer
     * @param {string} answerId - Selected answer ID
     * @returns {Object} Result with isCorrect, correctId
     */
    submitAnswer(answerId) {
        if (!this.currentSession || this.currentSession.status !== 'in_progress') {
            return null;
        }

        const question = this.getCurrentQuestion();
        if (!question) return null;

        const isCorrect = answerId === question.correctId;

        const answerRecord = {
            questionIndex: this.currentSession.currentIndex,
            selectedId: answerId,
            correctId: question.correctId,
            isCorrect,
            answeredAt: Date.now()
        };

        this.currentSession.answers.push(answerRecord);

        if (isCorrect) {
            this.currentSession.score++;
        }

        state.set('quizSession', this.currentSession, { persist: false });

        eventBus.emit(Events.QUIZ_ANSWERED, {
            answer: answerRecord,
            question,
            isCorrect,
            currentScore: this.currentSession.score
        });

        return {
            isCorrect,
            correctId: question.correctId,
            explanation: question.explanation
        };
    }

    /**
     * Move to next question
     * @returns {boolean} True if there's a next question
     */
    nextQuestion() {
        if (!this.currentSession || this.currentSession.status !== 'in_progress') {
            return false;
        }

        const nextIndex = this.currentSession.currentIndex + 1;

        if (nextIndex >= this.currentSession.questions.length) {
            // Quiz complete
            this.completeQuiz();
            return false;
        }

        this.currentSession.currentIndex = nextIndex;
        state.set('quizSession', this.currentSession, { persist: false });

        return true;
    }

    /**
     * Check if quiz is complete
     * @returns {boolean}
     */
    isQuizComplete() {
        if (!this.currentSession) return true;
        return this.currentSession.answers.length >= this.currentSession.questions.length;
    }

    /**
     * Complete the quiz and record stats
     */
    completeQuiz() {
        if (!this.currentSession) return;

        this.currentSession.status = 'completed';
        this.currentSession.completedAt = Date.now();

        // Calculate final score
        const score = this.currentSession.score;
        const total = this.currentSession.questions.length;

        // Record in storage
        storage.recordQuizCompletion(score, total);

        state.set('quizSession', this.currentSession, { persist: false });

        eventBus.emit(Events.QUIZ_COMPLETED, {
            session: this.currentSession,
            score,
            total,
            percentage: (score / total) * 100,
            isPerfect: score === total
        });
    }

    /**
     * Get quiz result
     * @returns {Object|null}
     */
    getResult() {
        if (!this.currentSession) return null;

        const score = this.currentSession.score;
        const total = this.currentSession.questions.length;
        const percentage = (score / total) * 100;

        let message, emoji;
        if (percentage === 100) {
            message = 'Perfect Score! You are a true devotee!';
            emoji = '🏆';
        } else if (percentage >= 80) {
            message = 'Excellent! Your knowledge is impressive!';
            emoji = '🌟';
        } else if (percentage >= 60) {
            message = 'Good effort! Keep learning!';
            emoji = '📚';
        } else if (percentage >= 40) {
            message = 'Not bad! There\'s room to grow.';
            emoji = '🙏';
        } else {
            message = 'Keep exploring the saints\' teachings!';
            emoji = '🪷';
        }

        return {
            score,
            total,
            percentage,
            isPerfect: percentage === 100,
            message,
            emoji,
            timeTaken: this.currentSession.completedAt - this.currentSession.startedAt,
            answers: this.currentSession.answers
        };
    }

    /**
     * Reset/end current quiz session
     */
    resetQuiz() {
        this.currentSession = null;
        state.set('quizSession', null, { persist: false });
    }

    /**
     * Get quiz statistics
     * @returns {Object}
     */
    getStats() {
        return storage.getQuizStats();
    }

    /**
     * Check if a quiz is in progress
     * @returns {boolean}
     */
    isInProgress() {
        return this.currentSession?.status === 'in_progress';
    }
}

// Create and export singleton
const quiz = new QuizService();

export default quiz;
export { QuizService, QUESTION_GENERATORS };
