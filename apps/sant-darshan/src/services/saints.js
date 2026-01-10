/**
 * Sant Darshan App - Saints Service
 * Efficient saint data access with O(1) indexing
 */

import { getDayOfYear } from '../utils/date.js';
import { memoize, groupBy, sortBy, randomItem } from '../utils/helpers.js';
import { sanitizeId } from '../utils/sanitize.js';

// Data imports (will be populated by data modules)
let SAINTS = [];
let TRADITIONS = {};
let SAINT_STORIES = {};
let SAINT_CONNECTIONS = {};
let SAINT_PLACES = {};
let SAINT_JAYANTIS = [];

// Indexes for O(1) lookup
let saintById = {};
let saintsByTradition = {};
let saintsBySampradaya = {};
let traditionsList = [];

/**
 * Initialize the saints service with data
 * @param {Object} data - Data object with saints, traditions, etc.
 */
export function initSaintsService(data) {
    if (data.saints) SAINTS = data.saints;
    if (data.traditions) TRADITIONS = data.traditions;
    if (data.stories) SAINT_STORIES = data.stories;
    if (data.connections) SAINT_CONNECTIONS = data.connections;
    if (data.places) SAINT_PLACES = data.places;
    if (data.jayantis) SAINT_JAYANTIS = data.jayantis;

    // Build indexes
    buildIndexes();
}

/**
 * Build all indexes for efficient lookups
 */
function buildIndexes() {
    // Index by ID for O(1) lookup
    saintById = {};
    SAINTS.forEach(saint => {
        saintById[saint.id] = saint;
    });

    // Group by tradition
    saintsByTradition = groupBy(SAINTS, 'tradition');

    // Group by sampradaya
    saintsBySampradaya = groupBy(SAINTS, 'sampradaya');

    // Build traditions list
    traditionsList = Object.values(TRADITIONS);
}

/**
 * Get a saint by ID - O(1) lookup
 * @param {string} id - Saint ID
 * @returns {Object|null}
 */
export function getSaint(id) {
    return saintById[sanitizeId(id)] || null;
}

/**
 * Get all saints
 * @returns {Array}
 */
export function getAllSaints() {
    return [...SAINTS];
}

/**
 * Get total saint count
 * @returns {number}
 */
export function getSaintCount() {
    return SAINTS.length;
}

/**
 * Get saints by tradition - O(1) lookup
 * @param {string} traditionId
 * @returns {Array}
 */
export function getSaintsByTradition(traditionId) {
    return saintsByTradition[sanitizeId(traditionId)] || [];
}

/**
 * Get saints by sampradaya
 * @param {string} sampradaya
 * @returns {Array}
 */
export function getSaintsBySampradaya(sampradaya) {
    return saintsBySampradaya[sampradaya] || [];
}

/**
 * Get unique sampradayas for a tradition
 * @param {string} traditionId
 * @returns {Array<string>}
 */
export const getSampradayasForTradition = memoize((traditionId) => {
    const saints = getSaintsByTradition(traditionId);
    const sampradayas = [...new Set(saints.map(s => s.sampradaya))];
    return sampradayas.filter(s => s); // Remove null/undefined
});

/**
 * Get all traditions
 * @returns {Array}
 */
export function getTraditions() {
    return traditionsList;
}

/**
 * Get a tradition by ID
 * @param {string} id
 * @returns {Object|null}
 */
export function getTradition(id) {
    return TRADITIONS[sanitizeId(id)] || null;
}

/**
 * Get tradition count
 * @returns {number}
 */
export function getTraditionCount() {
    return traditionsList.length;
}

/**
 * Get saint count for a tradition
 * @param {string} traditionId
 * @returns {number}
 */
export function getTraditionSaintCount(traditionId) {
    return getSaintsByTradition(traditionId).length;
}

/**
 * Get today's saint (rotates daily)
 * @returns {Object}
 */
export function getTodaysSaint() {
    const dayOfYear = getDayOfYear();
    const index = dayOfYear % SAINTS.length;
    return SAINTS[index];
}

/**
 * Get a random saint
 * @returns {Object}
 */
export function getRandomSaint() {
    return randomItem(SAINTS);
}

/**
 * Get random saints
 * @param {number} count
 * @param {Object} options - Filter options
 * @returns {Array}
 */
export function getRandomSaints(count, options = {}) {
    let pool = SAINTS;

    if (options.tradition) {
        pool = getSaintsByTradition(options.tradition);
    }

    if (options.exclude) {
        const excludeSet = new Set(options.exclude);
        pool = pool.filter(s => !excludeSet.has(s.id));
    }

    // Shuffle and take count
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get saints with quotes (for quiz)
 * @returns {Array}
 */
export function getSaintsWithQuotes() {
    return SAINTS.filter(s => s.quotes && s.quotes.length > 0);
}

/**
 * Get saints with birthplace (for quiz)
 * @returns {Array}
 */
export function getSaintsWithBirthplace() {
    return SAINTS.filter(s => s.birthPlace && s.birthPlace.length > 5);
}

/**
 * Get saints with period info (for quiz)
 * @returns {Array}
 */
export function getSaintsWithPeriod() {
    return SAINTS.filter(s => s.period && !s.period.includes('Mythological'));
}

// ==================== STORIES ====================

/**
 * Get stories for a saint
 * @param {string} saintId
 * @returns {Array}
 */
export function getSaintStories(saintId) {
    return SAINT_STORIES[sanitizeId(saintId)] || [];
}

/**
 * Check if saint has stories
 * @param {string} saintId
 * @returns {boolean}
 */
export function hasSaintStories(saintId) {
    return getSaintStories(saintId).length > 0;
}

// ==================== CONNECTIONS ====================

/**
 * Get spiritual connections for a saint
 * @param {string} saintId
 * @returns {Object|null}
 */
export function getSaintConnections(saintId) {
    return SAINT_CONNECTIONS[sanitizeId(saintId)] || null;
}

/**
 * Get a saint's guru
 * @param {string} saintId
 * @returns {Object|null}
 */
export function getSaintGuru(saintId) {
    const connections = getSaintConnections(saintId);
    if (connections?.guru) {
        return getSaint(connections.guru);
    }
    return null;
}

/**
 * Get a saint's disciples
 * @param {string} saintId
 * @returns {Array}
 */
export function getSaintDisciples(saintId) {
    const connections = getSaintConnections(saintId);
    if (connections?.shishyas) {
        return connections.shishyas
            .map(id => getSaint(id))
            .filter(s => s);
    }
    return [];
}

/**
 * Get saints influenced by this saint
 * @param {string} saintId
 * @returns {Array}
 */
export function getSaintInfluenced(saintId) {
    const connections = getSaintConnections(saintId);
    if (connections?.influenced) {
        return connections.influenced
            .map(id => getSaint(id))
            .filter(s => s);
    }
    return [];
}

// ==================== PLACES ====================

/**
 * Get pilgrimage places for a saint
 * @param {string} saintId
 * @returns {Array}
 */
export function getSaintPlaces(saintId) {
    return SAINT_PLACES[sanitizeId(saintId)] || [];
}

/**
 * Check if saint has places
 * @param {string} saintId
 * @returns {boolean}
 */
export function hasSaintPlaces(saintId) {
    return getSaintPlaces(saintId).length > 0;
}

/**
 * Get all saints with places
 * @returns {Array}
 */
export function getSaintsWithPlaces() {
    return Object.keys(SAINT_PLACES).map(id => getSaint(id)).filter(s => s);
}

// ==================== JAYANTIS ====================

/**
 * Get all jayantis
 * @returns {Array}
 */
export function getAllJayantis() {
    return [...SAINT_JAYANTIS];
}

/**
 * Get upcoming jayantis
 * @param {number} daysAhead - Days to look ahead
 * @returns {Array}
 */
export function getUpcomingJayantis(daysAhead = 365) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = SAINT_JAYANTIS
        .map(jayanti => {
            // Calculate this year's date (simplified lunar approximation)
            const thisYear = today.getFullYear();
            const baseMonth = ((jayanti.month || 1) + 1) % 12;
            const baseDay = Math.min(28, jayanti.tithi || 15);

            let date = new Date(thisYear, baseMonth, baseDay);

            // If date has passed this year, use next year
            if (date < today) {
                date = new Date(thisYear + 1, baseMonth, baseDay);
            }

            const daysUntil = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

            return {
                ...jayanti,
                calculatedDate: date,
                daysUntil,
                saint: getSaint(jayanti.saintId)
            };
        })
        .filter(j => j.daysUntil <= daysAhead && j.saint)
        .sort((a, b) => a.daysUntil - b.daysUntil);

    return upcoming;
}

// ==================== SEARCH ====================

/**
 * Search saints by query
 * @param {string} query
 * @param {Object} options
 * @returns {Array}
 */
export function searchSaints(query, options = {}) {
    const {
        tradition = null,
        maxResults = 50,
        threshold = 0.6
    } = options;

    if (!query || query.length < 2) {
        return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    let pool = tradition ? getSaintsByTradition(tradition) : SAINTS;

    const results = pool
        .map(saint => {
            const score = calculateSearchScore(saint, normalizedQuery);
            return { saint, score };
        })
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(result => result.saint);

    return results;
}

/**
 * Calculate search relevance score
 * @param {Object} saint
 * @param {string} query
 * @returns {number}
 */
function calculateSearchScore(saint, query) {
    let score = 0;
    const fields = [
        { value: saint.name?.toLowerCase(), weight: 100 },
        { value: saint.nameLocal?.toLowerCase(), weight: 90 },
        { value: saint.nameHi?.toLowerCase(), weight: 90 },
        { value: saint.sampradaya?.toLowerCase(), weight: 70 },
        { value: saint.birthPlace?.toLowerCase(), weight: 60 },
        { value: saint.tradition?.toLowerCase(), weight: 50 }
    ];

    for (const field of fields) {
        if (!field.value) continue;

        if (field.value === query) {
            score += field.weight;
        } else if (field.value.startsWith(query)) {
            score += field.weight * 0.9;
        } else if (field.value.includes(query)) {
            score += field.weight * 0.7;
        } else {
            // Fuzzy match
            const similarity = calculateSimilarity(field.value, query);
            if (similarity > 0.6) {
                score += field.weight * similarity * 0.5;
            }
        }
    }

    return score;
}

/**
 * Calculate string similarity (simplified Levenshtein-based)
 * @param {string} a
 * @param {string} b
 * @returns {number} Similarity between 0 and 1
 */
function calculateSimilarity(a, b) {
    if (!a || !b) return 0;
    if (a === b) return 1;

    // Simple approach: check for word matches
    const wordsA = a.split(/\s+/);
    const wordsB = b.split(/\s+/);

    let matchCount = 0;
    for (const wordB of wordsB) {
        if (wordsA.some(wordA => wordA.includes(wordB) || wordB.includes(wordA))) {
            matchCount++;
        }
    }

    return matchCount / Math.max(wordsA.length, wordsB.length);
}

/**
 * Get search suggestions based on partial input
 * @param {string} partial
 * @param {number} limit
 * @returns {Array<string>}
 */
export function getSearchSuggestions(partial, limit = 5) {
    if (!partial || partial.length < 1) return [];

    const query = partial.toLowerCase();
    const suggestions = new Set();

    // Add matching saint names
    for (const saint of SAINTS) {
        if (saint.name.toLowerCase().startsWith(query)) {
            suggestions.add(saint.name);
        }
        if (suggestions.size >= limit) break;
    }

    // Add matching sampradayas
    for (const sampradaya of Object.keys(saintsBySampradaya)) {
        if (sampradaya.toLowerCase().startsWith(query)) {
            suggestions.add(sampradaya);
        }
        if (suggestions.size >= limit) break;
    }

    return [...suggestions].slice(0, limit);
}

// Export service object for convenient access
const saintsService = {
    init: initSaintsService,
    getSaint,
    getAllSaints,
    getSaintCount,
    getSaintsByTradition,
    getSaintsBySampradaya,
    getSampradayasForTradition,
    getTraditions,
    getTradition,
    getTraditionCount,
    getTraditionSaintCount,
    getTodaysSaint,
    getRandomSaint,
    getRandomSaints,
    getSaintsWithQuotes,
    getSaintsWithBirthplace,
    getSaintsWithPeriod,
    getSaintStories,
    hasSaintStories,
    getSaintConnections,
    getSaintGuru,
    getSaintDisciples,
    getSaintInfluenced,
    getSaintPlaces,
    hasSaintPlaces,
    getSaintsWithPlaces,
    getAllJayantis,
    getUpcomingJayantis,
    searchSaints,
    getSearchSuggestions
};

export default saintsService;
