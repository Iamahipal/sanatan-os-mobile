/**
 * Sant Darshan App - Data Index
 * Loads and exports all data with indexing
 */

// Import data from existing files (will be loaded via script tags)
// These are populated by the existing saints-data.js and phase2-data.js

import { TRADITIONS } from './traditions.js';

// Re-export traditions
export { TRADITIONS } from './traditions.js';

/**
 * Data holder - populated by loadData()
 */
const DATA = {
    saints: [],
    traditions: TRADITIONS,
    stories: {},
    connections: {},
    places: {},
    jayantis: [],
    paths: [],
    achievements: [],
    prompts: []
};

/**
 * Indexes for O(1) lookups
 */
const INDEXES = {
    saintById: new Map(),
    saintsByTradition: new Map(),
    saintsBySampradaya: new Map()
};

/**
 * Load data from global variables (set by existing script files)
 * This allows us to reuse the existing data files
 */
export function loadData() {
    // Get saints from global scope (loaded by saints-data.js)
    if (typeof window !== 'undefined' && window.SAINTS) {
        DATA.saints = window.SAINTS;
    }

    // Get extended data from global scope (loaded by phase2-data.js)
    if (typeof window !== 'undefined') {
        if (window.SAINT_STORIES) DATA.stories = window.SAINT_STORIES;
        if (window.SAINT_CONNECTIONS) DATA.connections = window.SAINT_CONNECTIONS;
        if (window.SAINT_PLACES) DATA.places = window.SAINT_PLACES;
        if (window.SAINT_JAYANTIS) DATA.jayantis = window.SAINT_JAYANTIS;
        if (window.LEARNING_PATHS) DATA.paths = window.LEARNING_PATHS;
        if (window.JOURNAL_PROMPTS) DATA.prompts = window.JOURNAL_PROMPTS;
    }

    // Build indexes
    buildIndexes();

    return DATA;
}

/**
 * Build indexes for efficient lookups
 */
function buildIndexes() {
    // Clear existing indexes
    INDEXES.saintById.clear();
    INDEXES.saintsByTradition.clear();
    INDEXES.saintsBySampradaya.clear();

    // Build indexes from saints array
    DATA.saints.forEach(saint => {
        // Index by ID
        INDEXES.saintById.set(saint.id, saint);

        // Index by tradition
        if (!INDEXES.saintsByTradition.has(saint.tradition)) {
            INDEXES.saintsByTradition.set(saint.tradition, []);
        }
        INDEXES.saintsByTradition.get(saint.tradition).push(saint);

        // Index by sampradaya
        if (saint.sampradaya) {
            if (!INDEXES.saintsBySampradaya.has(saint.sampradaya)) {
                INDEXES.saintsBySampradaya.set(saint.sampradaya, []);
            }
            INDEXES.saintsBySampradaya.get(saint.sampradaya).push(saint);
        }
    });
}

/**
 * Get saint by ID - O(1)
 */
export function getSaintById(id) {
    return INDEXES.saintById.get(id) || null;
}

/**
 * Get saints by tradition - O(1)
 */
export function getSaintsByTradition(traditionId) {
    return INDEXES.saintsByTradition.get(traditionId) || [];
}

/**
 * Get saints by sampradaya - O(1)
 */
export function getSaintsBySampradaya(sampradaya) {
    return INDEXES.saintsBySampradaya.get(sampradaya) || [];
}

/**
 * Get all saints
 */
export function getAllSaints() {
    return DATA.saints;
}

/**
 * Get saint count
 */
export function getSaintCount() {
    return DATA.saints.length;
}

/**
 * Get all data
 */
export function getData() {
    return DATA;
}

/**
 * Get indexes (for debugging)
 */
export function getIndexes() {
    return INDEXES;
}

export default {
    loadData,
    getData,
    getSaintById,
    getSaintsByTradition,
    getSaintsBySampradaya,
    getAllSaints,
    getSaintCount,
    TRADITIONS
};
