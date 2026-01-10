/**
 * QuoteService - Prana Daily Quotes
 * Loads and serves daily motivational quotes from Vedic scriptures
 */

let quotesCache = null;

export const QuoteService = {
    /**
     * Load quotes from JSON file
     */
    async init() {
        if (quotesCache) return;

        try {
            const response = await fetch('./data/quotes.json');
            if (response.ok) {
                quotesCache = await response.json();
                console.log(`Loaded ${quotesCache.length} quotes`);
            } else {
                throw new Error('Failed to load quotes');
            }
        } catch (error) {
            console.warn('Using fallback quotes:', error);
            quotesCache = this.getFallbackQuotes();
        }
    },

    /**
     * Get quote for today
     * @returns {Object}
     */
    getDailyQuote() {
        if (!quotesCache || quotesCache.length === 0) {
            return this.getFallbackQuotes()[0];
        }

        const today = new Date();
        const dayOfYear = this.getDayOfYear(today);
        const index = dayOfYear % quotesCache.length;

        return quotesCache[index];
    },

    /**
     * Get a random quote
     * @returns {Object}
     */
    getRandomQuote() {
        if (!quotesCache || quotesCache.length === 0) {
            return this.getFallbackQuotes()[0];
        }

        const index = Math.floor(Math.random() * quotesCache.length);
        return quotesCache[index];
    },

    /**
     * Get quote for a specific day number
     * @param {number} dayNum
     * @returns {Object}
     */
    getQuoteByDay(dayNum) {
        if (!quotesCache) return this.getFallbackQuotes()[0];
        return quotesCache.find(q => q.day === dayNum) || this.getDailyQuote();
    },

    /**
     * Get quotes by category
     * @param {string} category
     * @returns {Array}
     */
    getByCategory(category) {
        if (!quotesCache) return [];
        return quotesCache.filter(q => q.category === category);
    },

    /**
     * Get all categories
     * @returns {Array}
     */
    getCategories() {
        if (!quotesCache) return [];
        return [...new Set(quotesCache.map(q => q.category))];
    },

    /**
     * Calculate day of year
     * @param {Date} date
     * @returns {number}
     */
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    },

    /**
     * Fallback quotes if JSON fails to load
     * @returns {Array}
     */
    getFallbackQuotes() {
        return [
            {
                day: 1,
                source: 'Bhagavad Gita 6.35',
                category: 'Self-Mastery & Control',
                sanskrit: 'अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते',
                hindi: 'निरंतर अभ्यास और वैराग्य से मन को वश में किया जा सकता है',
                english: 'Through practice and detachment, the mind can be controlled',
                context: 'Building habits requires consistent daily practice',
                actionable_insight: 'Practice your habit once today, even if imperfectly'
            },
            {
                day: 2,
                source: 'Bhagavad Gita 2.47',
                category: 'Action Over Results',
                sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
                hindi: 'कर्म में ही तुम्हारा अधिकार है, फल में कभी नहीं',
                english: 'You have the right to work only, never to its fruits',
                context: 'Focus on daily habits, not on immediate results',
                actionable_insight: 'Complete your habit without worrying about outcomes'
            },
            {
                day: 3,
                source: 'Bhagavad Gita 3.8',
                category: 'Duty & Responsibility',
                sanskrit: 'नियतं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः',
                hindi: 'अपना नियत कर्म करो, कर्म न करने से कर्म श्रेष्ठ है',
                english: 'Perform your duty, for action is superior to inaction',
                context: 'Show up for your habits even when unmotivated',
                actionable_insight: 'Do your habit today, even if you don\'t feel like it'
            }
        ];
    }
};
