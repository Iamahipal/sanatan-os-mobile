/**
 * Sant Darshan App - Journal Service
 * Daily reflection journal management
 */

import storage from './storage.js';
import { getDayOfYear, getTodayString, getCalendarDates } from '../utils/date.js';
import { JOURNAL_CONFIG } from '../data/constants.js';

/**
 * Journal prompts - 365 daily prompts
 */
export const JOURNAL_PROMPTS = [
    "How can you apply today's saint's teachings in your daily life?",
    "What aspect of this saint's life inspires you the most?",
    "If you could ask this saint one question, what would it be?",
    "How does this saint's message resonate with your current life situation?",
    "What obstacles in your spiritual journey can this saint's story help you overcome?",
    "Write about a time when you experienced something similar to this saint's teaching.",
    "How would your life change if you fully embraced this saint's philosophy?",
    "What small step can you take today inspired by this saint?",
    "Reflect on how this saint's devotion compares to your own spiritual practice.",
    "What wisdom from this saint would you share with someone struggling?",
    "How does this saint's story challenge your assumptions?",
    "What sacrifice made by this saint impresses you most?",
    "How can you cultivate the qualities this saint embodied?",
    "What modern problems could this saint's teachings solve?",
    "Describe a moment of divine grace in your own life.",
    "How does faith manifest in your daily actions?",
    "What does devotion mean to you after reading about this saint?",
    "How can you bring more mindfulness to your routines?",
    "What would you give up for your spiritual growth?",
    "How do you find peace in difficult times?",
    "What teachings from this tradition resonate most with you?",
    "How can you serve others as this saint did?",
    "What fears hold you back from deeper spiritual practice?",
    "How can you cultivate more compassion today?",
    "What role does gratitude play in your life?",
    "How can you better balance worldly and spiritual duties?",
    "What does surrender to the divine mean to you?",
    "How can you practice non-attachment in daily life?",
    "What wisdom would you pass on to future generations?",
    "How has your understanding of spirituality evolved?",
    "What brings you closest to feeling divine presence?",
    "How can you transform obstacles into opportunities?",
    "What does true contentment look like?",
    "How can you deepen your spiritual practice?",
    "What acts of kindness can you perform today?",
    "How do you deal with doubt in your spiritual journey?",
    "What does inner peace mean to you?",
    "How can you be more present in each moment?",
    "What spiritual practices nurture your soul?",
    "How can you spread positivity to those around you?",
    "What lessons have hardships taught you?",
    "How do you maintain faith during challenges?",
    "What does selfless service look like in your life?",
    "How can you cultivate more patience?",
    "What brings meaning to your life?",
    "How do you connect with the divine?",
    "What spiritual goal do you want to achieve?",
    "How can you practice humility today?",
    "What does true wisdom mean to you?",
    "How can you better listen to your inner voice?",
    // Extended prompts for full year
    "What sacred text or teaching moves you most?",
    "How do you find stillness in a busy world?",
    "What does enlightenment mean to you?",
    "How can you be a better example to others?",
    "What spiritual truth have you discovered?",
    "How do you honor the divine in daily tasks?",
    "What does true love look like spiritually?",
    "How can you release negative attachments?",
    "What does your ideal spiritual day look like?",
    "How do you stay grounded in your values?",
    "What does community mean in spiritual growth?",
    "How can you cultivate deeper awareness?",
    "What does the divine want for your life?",
    "How do you practice acceptance?",
    "What brings you spiritual joy?",
    "How can you better understand others?",
    "What does your soul need right now?",
    "How do you maintain spiritual discipline?",
    "What truth are you seeking?",
    "How can you be more authentic?"
];

/**
 * Journal Service
 */
class JournalService {
    /**
     * Get today's journal prompt
     * @returns {string}
     */
    getTodaysPrompt() {
        const dayOfYear = getDayOfYear();
        const index = dayOfYear % JOURNAL_PROMPTS.length;
        return JOURNAL_PROMPTS[index];
    }

    /**
     * Get a specific prompt by index
     * @param {number} index
     * @returns {string}
     */
    getPrompt(index) {
        return JOURNAL_PROMPTS[index % JOURNAL_PROMPTS.length];
    }

    /**
     * Get all prompts
     * @returns {Array<string>}
     */
    getAllPrompts() {
        return [...JOURNAL_PROMPTS];
    }

    /**
     * Get today's journal entry
     * @returns {Object|null}
     */
    getTodaysEntry() {
        return storage.getTodaysJournalEntry();
    }

    /**
     * Get journal entry for a specific date
     * @param {string} dateString - YYYY-MM-DD format
     * @returns {Object|null}
     */
    getEntry(dateString) {
        return storage.getJournalEntry(dateString);
    }

    /**
     * Save today's journal entry
     * @param {string} text
     */
    saveEntry(text) {
        storage.saveJournalEntry(text);
    }

    /**
     * Save journal entry for a specific date
     * @param {string} text
     * @param {string} dateString
     */
    saveEntryForDate(text, dateString) {
        storage.saveJournalEntry(text, dateString);
    }

    /**
     * Get all journal entries
     * @returns {Object}
     */
    getAllEntries() {
        return storage.getJournal();
    }

    /**
     * Get entry count
     * @returns {number}
     */
    getEntryCount() {
        return storage.getJournalCount();
    }

    /**
     * Get calendar data for display
     * @param {number} days - Number of days to show
     * @returns {Array}
     */
    getCalendarData(days = JOURNAL_CONFIG.calendarDays) {
        const calendar = getCalendarDates(days);
        const entries = this.getAllEntries();

        return calendar.map(day => ({
            ...day,
            hasEntry: !!entries[day.dateString],
            entry: entries[day.dateString] || null
        }));
    }

    /**
     * Get recent entries
     * @param {number} limit
     * @returns {Array}
     */
    getRecentEntries(limit = 10) {
        const entries = this.getAllEntries();

        return Object.entries(entries)
            .map(([date, entry]) => ({
                date,
                ...entry
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    /**
     * Get entries with dates that have entries
     * @returns {Array<string>}
     */
    getDatesWithEntries() {
        return Object.keys(this.getAllEntries());
    }

    /**
     * Check if today has an entry
     * @returns {boolean}
     */
    hasTodaysEntry() {
        return !!this.getTodaysEntry();
    }

    /**
     * Get streak of consecutive journal days
     * @returns {number}
     */
    getJournalStreak() {
        const entries = this.getAllEntries();
        const dates = Object.keys(entries).sort().reverse();

        if (dates.length === 0) return 0;

        const today = getTodayString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        // Check if we have an entry for today or yesterday
        if (dates[0] !== today && dates[0] !== yesterdayString) {
            return 0;
        }

        let streak = 1;
        let currentDate = new Date(dates[0]);

        for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(currentDate);
            prevDate.setDate(prevDate.getDate() - 1);
            const expectedDate = prevDate.toISOString().split('T')[0];

            if (dates[i] === expectedDate) {
                streak++;
                currentDate = prevDate;
            } else {
                break;
            }
        }

        return streak;
    }

    /**
     * Get word count for all entries
     * @returns {number}
     */
    getTotalWordCount() {
        const entries = this.getAllEntries();
        return Object.values(entries)
            .reduce((total, entry) => {
                const words = (entry.text || '').split(/\s+/).filter(w => w.length > 0);
                return total + words.length;
            }, 0);
    }

    /**
     * Search journal entries
     * @param {string} query
     * @returns {Array}
     */
    searchEntries(query) {
        if (!query || query.length < 2) return [];

        const entries = this.getAllEntries();
        const normalizedQuery = query.toLowerCase();

        return Object.entries(entries)
            .filter(([date, entry]) =>
                entry.text?.toLowerCase().includes(normalizedQuery)
            )
            .map(([date, entry]) => ({
                date,
                ...entry,
                // Add context around match
                matchContext: this.getMatchContext(entry.text, normalizedQuery)
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    /**
     * Get text context around a match
     * @param {string} text
     * @param {string} query
     * @returns {string}
     */
    getMatchContext(text, query) {
        const index = text.toLowerCase().indexOf(query);
        if (index === -1) return '';

        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + query.length + 50);

        let context = text.slice(start, end);
        if (start > 0) context = '...' + context;
        if (end < text.length) context = context + '...';

        return context;
    }
}

// Create and export singleton
const journal = new JournalService();

export default journal;
export { JournalService, JOURNAL_PROMPTS };
