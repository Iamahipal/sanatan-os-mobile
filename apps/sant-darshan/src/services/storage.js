/**
 * Sant Darshan App - Storage Service
 * High-level API for managing persisted user data
 */

import state from '../core/state.js';
import eventBus, { Events } from '../core/events.js';
import { generateId } from '../utils/helpers.js';
import { sanitizeInput, sanitizeId } from '../utils/sanitize.js';
import { getTodayString, isStreakMaintained, now } from '../utils/date.js';
import { MESSAGES, JOURNAL_CONFIG } from '../data/constants.js';

/**
 * Storage Service
 * Provides methods for managing all persisted user data
 */
class StorageService {
    // ==================== FAVORITES ====================

    /**
     * Get all favorites
     * @returns {Array<string>} Array of saint IDs
     */
    getFavorites() {
        return state.get('favorites') || [];
    }

    /**
     * Check if a saint is favorited
     * @param {string} saintId
     * @returns {boolean}
     */
    isFavorite(saintId) {
        const favorites = this.getFavorites();
        return favorites.includes(sanitizeId(saintId));
    }

    /**
     * Add a saint to favorites
     * @param {string} saintId
     */
    addFavorite(saintId) {
        const id = sanitizeId(saintId);
        const favorites = this.getFavorites();

        if (!favorites.includes(id)) {
            favorites.push(id);
            state.set('favorites', favorites);
            eventBus.emit(Events.FAVORITE_ADDED, { saintId: id });
            this.showToast(MESSAGES.FAVORITE_ADDED);
        }
    }

    /**
     * Remove a saint from favorites
     * @param {string} saintId
     */
    removeFavorite(saintId) {
        const id = sanitizeId(saintId);
        const favorites = this.getFavorites();
        const index = favorites.indexOf(id);

        if (index > -1) {
            favorites.splice(index, 1);
            state.set('favorites', favorites);
            eventBus.emit(Events.FAVORITE_REMOVED, { saintId: id });
            this.showToast(MESSAGES.FAVORITE_REMOVED);
        }
    }

    /**
     * Toggle favorite status
     * @param {string} saintId
     * @returns {boolean} New favorite status
     */
    toggleFavorite(saintId) {
        if (this.isFavorite(saintId)) {
            this.removeFavorite(saintId);
            return false;
        } else {
            this.addFavorite(saintId);
            return true;
        }
    }

    // ==================== EXPLORED ====================

    /**
     * Get explored saints data
     * @returns {Object}
     */
    getExplored() {
        return state.get('explored') || {};
    }

    /**
     * Get count of explored saints
     * @returns {number}
     */
    getExploredCount() {
        return Object.keys(this.getExplored()).length;
    }

    /**
     * Check if a saint has been explored
     * @param {string} saintId
     * @returns {boolean}
     */
    isExplored(saintId) {
        const explored = this.getExplored();
        return !!explored[sanitizeId(saintId)];
    }

    /**
     * Mark a saint as explored
     * @param {string} saintId
     */
    markExplored(saintId) {
        const id = sanitizeId(saintId);
        const explored = this.getExplored();

        if (!explored[id]) {
            explored[id] = {
                visitedAt: now(),
                timeSpent: 0,
                visitCount: 1
            };
        } else {
            explored[id].visitCount = (explored[id].visitCount || 1) + 1;
            explored[id].lastVisitedAt = now();
        }

        state.set('explored', explored);
        eventBus.emit(Events.SAINT_EXPLORED, { saintId: id });
        eventBus.emit(Events.PROGRESS_UPDATED, { exploredCount: this.getExploredCount() });
    }

    /**
     * Update time spent on a saint
     * @param {string} saintId
     * @param {number} additionalTime - Time in milliseconds
     */
    updateTimeSpent(saintId, additionalTime) {
        const id = sanitizeId(saintId);
        const explored = this.getExplored();

        if (explored[id]) {
            explored[id].timeSpent = (explored[id].timeSpent || 0) + additionalTime;
            state.set('explored', explored);
        }
    }

    // ==================== NOTES/REFLECTIONS ====================

    /**
     * Get notes for a saint
     * @param {string} saintId
     * @returns {Array}
     */
    getNotes(saintId) {
        const notes = state.get('notes') || {};
        return notes[sanitizeId(saintId)] || [];
    }

    /**
     * Get all notes count
     * @returns {number}
     */
    getTotalNotesCount() {
        const notes = state.get('notes') || {};
        return Object.values(notes).flat().length;
    }

    /**
     * Add a note for a saint
     * @param {string} saintId
     * @param {string} text
     * @returns {Object} The created note
     */
    addNote(saintId, text) {
        const id = sanitizeId(saintId);
        const sanitizedText = sanitizeInput(text, {
            maxLength: JOURNAL_CONFIG.maxEntryLength,
            allowNewlines: true
        });

        if (!sanitizedText) {
            return null;
        }

        const notes = state.get('notes') || {};
        if (!notes[id]) {
            notes[id] = [];
        }

        const note = {
            id: generateId('note'),
            text: sanitizedText,
            createdAt: now()
        };

        notes[id].unshift(note); // Add to beginning
        state.set('notes', notes);

        eventBus.emit(Events.NOTE_ADDED, { saintId: id, note });
        this.showToast(MESSAGES.NOTE_SAVED);

        return note;
    }

    /**
     * Delete a note
     * @param {string} saintId
     * @param {string} noteId
     */
    deleteNote(saintId, noteId) {
        const id = sanitizeId(saintId);
        const nId = sanitizeId(noteId);
        const notes = state.get('notes') || {};

        if (notes[id]) {
            const index = notes[id].findIndex(n => n.id === nId);
            if (index > -1) {
                notes[id].splice(index, 1);
                state.set('notes', notes);
                eventBus.emit(Events.NOTE_DELETED, { saintId: id, noteId: nId });
                this.showToast(MESSAGES.NOTE_DELETED);
            }
        }
    }

    // ==================== DAILY DARSHAN & STREAK ====================

    /**
     * Get daily darshan data
     * @returns {Object}
     */
    getDailyDarshan() {
        return state.get('dailyDarshan') || {
            lastShown: null,
            streak: 0,
            lastStreakDate: null
        };
    }

    /**
     * Check if daily darshan should be shown today
     * @returns {boolean}
     */
    shouldShowDailyDarshan() {
        const darshan = this.getDailyDarshan();
        const today = getTodayString();
        return darshan.lastShown !== today;
    }

    /**
     * Mark daily darshan as shown and update streak
     */
    markDailyDarshanShown() {
        const today = getTodayString();
        const darshan = this.getDailyDarshan();

        let newStreak = 1;

        // Calculate streak
        if (darshan.lastStreakDate) {
            if (isStreakMaintained(darshan.lastStreakDate)) {
                newStreak = (darshan.streak || 0) + 1;
            }
        }

        const updatedDarshan = {
            lastShown: today,
            streak: newStreak,
            lastStreakDate: today
        };

        state.set('dailyDarshan', updatedDarshan);
        eventBus.emit(Events.STREAK_UPDATED, { streak: newStreak });
    }

    /**
     * Get current streak
     * @returns {number}
     */
    getStreak() {
        return this.getDailyDarshan().streak || 0;
    }

    // ==================== QUIZ STATS ====================

    /**
     * Get quiz statistics
     * @returns {Object}
     */
    getQuizStats() {
        return state.get('quizStats') || {
            totalCompleted: 0,
            perfectScores: 0,
            questionsAnswered: 0,
            correctAnswers: 0
        };
    }

    /**
     * Record quiz completion
     * @param {number} score - Score achieved
     * @param {number} total - Total questions
     */
    recordQuizCompletion(score, total) {
        const stats = this.getQuizStats();

        stats.totalCompleted += 1;
        stats.questionsAnswered += total;
        stats.correctAnswers += score;

        if (score === total) {
            stats.perfectScores += 1;
        }

        state.set('quizStats', stats);
        eventBus.emit(Events.QUIZ_COMPLETED, { score, total, stats });
    }

    // ==================== ACHIEVEMENTS ====================

    /**
     * Get unlocked achievements
     * @returns {Array<string>}
     */
    getUnlockedAchievements() {
        return state.get('unlockedAchievements') || [];
    }

    /**
     * Check if achievement is unlocked
     * @param {string} achievementId
     * @returns {boolean}
     */
    isAchievementUnlocked(achievementId) {
        return this.getUnlockedAchievements().includes(sanitizeId(achievementId));
    }

    /**
     * Unlock an achievement
     * @param {string} achievementId
     * @returns {boolean} True if newly unlocked
     */
    unlockAchievement(achievementId) {
        const id = sanitizeId(achievementId);
        const unlocked = this.getUnlockedAchievements();

        if (!unlocked.includes(id)) {
            unlocked.push(id);
            state.set('unlockedAchievements', unlocked);
            eventBus.emit(Events.ACHIEVEMENT_UNLOCKED, { achievementId: id });
            return true;
        }

        return false;
    }

    // ==================== LEARNING PATHS ====================

    /**
     * Get progress for a learning path
     * @param {string} pathId
     * @returns {Object}
     */
    getPathProgress(pathId) {
        const progress = state.get('pathProgress') || {};
        return progress[sanitizeId(pathId)] || {
            completed: [],
            currentIndex: 0,
            startedAt: null
        };
    }

    /**
     * Start a learning path
     * @param {string} pathId
     */
    startPath(pathId) {
        const id = sanitizeId(pathId);
        const progress = state.get('pathProgress') || {};

        if (!progress[id] || !progress[id].startedAt) {
            progress[id] = {
                completed: [],
                currentIndex: 0,
                startedAt: now()
            };
            state.set('pathProgress', progress);
            eventBus.emit(Events.PATH_STARTED, { pathId: id });
        }
    }

    /**
     * Mark a saint as completed in a path
     * @param {string} pathId
     * @param {string} saintId
     */
    markPathSaintCompleted(pathId, saintId) {
        const pId = sanitizeId(pathId);
        const sId = sanitizeId(saintId);
        const progress = state.get('pathProgress') || {};

        if (!progress[pId]) {
            progress[pId] = { completed: [], currentIndex: 0 };
        }

        if (!progress[pId].completed.includes(sId)) {
            progress[pId].completed.push(sId);
            progress[pId].currentIndex = progress[pId].completed.length;
            state.set('pathProgress', progress);
            eventBus.emit(Events.PATH_PROGRESS, {
                pathId: pId,
                saintId: sId,
                completed: progress[pId].completed.length
            });
        }
    }

    // ==================== JOURNAL ====================

    /**
     * Get journal entries
     * @returns {Object}
     */
    getJournal() {
        return state.get('journal') || {};
    }

    /**
     * Get journal entry for a specific date
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {Object|null}
     */
    getJournalEntry(dateString) {
        const journal = this.getJournal();
        return journal[dateString] || null;
    }

    /**
     * Get today's journal entry
     * @returns {Object|null}
     */
    getTodaysJournalEntry() {
        return this.getJournalEntry(getTodayString());
    }

    /**
     * Save a journal entry
     * @param {string} text
     * @param {string} dateString - Optional date (default: today)
     */
    saveJournalEntry(text, dateString = null) {
        const date = dateString || getTodayString();
        const sanitizedText = sanitizeInput(text, {
            maxLength: JOURNAL_CONFIG.maxEntryLength,
            allowNewlines: true
        });

        const journal = this.getJournal();
        journal[date] = {
            text: sanitizedText,
            createdAt: now(),
            updatedAt: now()
        };

        state.set('journal', journal);
        eventBus.emit(Events.JOURNAL_SAVED, { date, text: sanitizedText });
        this.showToast(MESSAGES.JOURNAL_SAVED);
    }

    /**
     * Get journal entries count
     * @returns {number}
     */
    getJournalCount() {
        return Object.keys(this.getJournal()).length;
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Show a toast notification
     * @param {string} message
     */
    showToast(message) {
        eventBus.emit(Events.TOAST_SHOW, { message });
    }

    /**
     * Export all user data
     * @returns {Object}
     */
    exportData() {
        return {
            favorites: this.getFavorites(),
            explored: this.getExplored(),
            notes: state.get('notes') || {},
            dailyDarshan: this.getDailyDarshan(),
            quizStats: this.getQuizStats(),
            unlockedAchievements: this.getUnlockedAchievements(),
            pathProgress: state.get('pathProgress') || {},
            journal: this.getJournal(),
            exportedAt: now()
        };
    }

    /**
     * Import user data
     * @param {Object} data - Data to import
     */
    importData(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid import data');
        }

        // Validate and import each section
        if (Array.isArray(data.favorites)) {
            state.set('favorites', data.favorites.map(sanitizeId));
        }
        if (data.explored && typeof data.explored === 'object') {
            state.set('explored', data.explored);
        }
        if (data.notes && typeof data.notes === 'object') {
            state.set('notes', data.notes);
        }
        if (data.dailyDarshan && typeof data.dailyDarshan === 'object') {
            state.set('dailyDarshan', data.dailyDarshan);
        }
        if (data.quizStats && typeof data.quizStats === 'object') {
            state.set('quizStats', data.quizStats);
        }
        if (Array.isArray(data.unlockedAchievements)) {
            state.set('unlockedAchievements', data.unlockedAchievements.map(sanitizeId));
        }
        if (data.pathProgress && typeof data.pathProgress === 'object') {
            state.set('pathProgress', data.pathProgress);
        }
        if (data.journal && typeof data.journal === 'object') {
            state.set('journal', data.journal);
        }

        this.showToast('Data imported successfully');
    }

    /**
     * Clear all user data
     */
    clearAllData() {
        state.reset(true);
        this.showToast('All data cleared');
    }
}

// Create and export singleton
const storage = new StorageService();

export default storage;
export { StorageService };
