/**
 * Sant Darshan App - Search Service
 * Optimized search with debouncing and caching
 */

import eventBus, { Events } from '../core/events.js';
import state from '../core/state.js';
import { searchSaints, getSearchSuggestions } from './saints.js';
import { debounce } from '../utils/helpers.js';
import { sanitizeInput } from '../utils/sanitize.js';
import { SEARCH_CONFIG } from '../data/constants.js';

/**
 * Search Service
 * Provides debounced search functionality
 */
class SearchService {
    constructor() {
        this.cache = new Map();
        this.maxCacheSize = 100;
        this.isSearching = false;

        // Create debounced search function
        this.debouncedSearch = debounce(
            this.executeSearch.bind(this),
            SEARCH_CONFIG.debounceMs || 300
        );
    }

    /**
     * Perform a search (debounced)
     * @param {string} query
     * @param {Object} options
     */
    search(query, options = {}) {
        const sanitizedQuery = sanitizeInput(query, {
            maxLength: 100,
            allowNewlines: false
        }).trim();

        // Update state with current query
        state.set('searchQuery', sanitizedQuery, { persist: false });

        if (sanitizedQuery.length < SEARCH_CONFIG.minQueryLength) {
            state.set('searchResults', [], { persist: false });
            eventBus.emit(Events.SEARCH_RESULTS, { query: sanitizedQuery, results: [] });
            return;
        }

        // Check cache first
        const cacheKey = this.getCacheKey(sanitizedQuery, options);
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            state.set('searchResults', cached, { persist: false });
            eventBus.emit(Events.SEARCH_RESULTS, { query: sanitizedQuery, results: cached });
            return;
        }

        // Execute debounced search
        this.debouncedSearch(sanitizedQuery, options);
    }

    /**
     * Execute the actual search
     * @param {string} query
     * @param {Object} options
     */
    executeSearch(query, options = {}) {
        if (this.isSearching) return;

        this.isSearching = true;
        eventBus.emit(Events.LOADING_START, { type: 'search' });

        try {
            const results = searchSaints(query, {
                tradition: options.tradition,
                maxResults: SEARCH_CONFIG.maxResults,
                threshold: SEARCH_CONFIG.fuzzyThreshold
            });

            // Cache the results
            const cacheKey = this.getCacheKey(query, options);
            this.addToCache(cacheKey, results);

            // Update state
            state.set('searchResults', results, { persist: false });
            eventBus.emit(Events.SEARCH_RESULTS, { query, results });
        } catch (error) {
            console.error('Search error:', error);
            state.set('searchResults', [], { persist: false });
            eventBus.emit(Events.SEARCH_RESULTS, { query, results: [], error });
        } finally {
            this.isSearching = false;
            eventBus.emit(Events.LOADING_END, { type: 'search' });
        }
    }

    /**
     * Perform immediate search (no debounce)
     * @param {string} query
     * @param {Object} options
     * @returns {Array}
     */
    searchImmediate(query, options = {}) {
        const sanitizedQuery = sanitizeInput(query, {
            maxLength: 100,
            allowNewlines: false
        }).trim();

        if (sanitizedQuery.length < SEARCH_CONFIG.minQueryLength) {
            return [];
        }

        return searchSaints(sanitizedQuery, {
            tradition: options.tradition,
            maxResults: options.maxResults || SEARCH_CONFIG.maxResults,
            threshold: SEARCH_CONFIG.fuzzyThreshold
        });
    }

    /**
     * Get search suggestions
     * @param {string} partial
     * @returns {Array<string>}
     */
    getSuggestions(partial) {
        const sanitized = sanitizeInput(partial, {
            maxLength: 50,
            allowNewlines: false
        }).trim();

        if (sanitized.length < 1) {
            return [];
        }

        return getSearchSuggestions(sanitized, 5);
    }

    /**
     * Clear current search
     */
    clear() {
        this.debouncedSearch.cancel();
        state.set('searchQuery', '', { persist: false });
        state.set('searchResults', [], { persist: false });
        eventBus.emit(Events.SEARCH_RESULTS, { query: '', results: [] });
    }

    /**
     * Get current search query
     * @returns {string}
     */
    getCurrentQuery() {
        return state.get('searchQuery') || '';
    }

    /**
     * Get current search results
     * @returns {Array}
     */
    getCurrentResults() {
        return state.get('searchResults') || [];
    }

    /**
     * Generate cache key
     * @param {string} query
     * @param {Object} options
     * @returns {string}
     */
    getCacheKey(query, options) {
        return `${query}|${options.tradition || 'all'}`;
    }

    /**
     * Add results to cache
     * @param {string} key
     * @param {Array} results
     */
    addToCache(key, results) {
        // Implement LRU-like eviction
        if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, results);
    }

    /**
     * Clear search cache
     */
    clearCache() {
        this.cache.clear();
    }
}

// Create and export singleton
const search = new SearchService();

export default search;
export { SearchService };
