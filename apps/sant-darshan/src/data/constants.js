/**
 * Sant Darshan App - Constants
 * Central configuration and magic values
 */

// App metadata
export const APP_NAME = 'Sant Darshan';
export const APP_VERSION = '2.0.0';
export const STORAGE_KEY = 'santDarshanData';
export const STORAGE_VERSION = 2;

// UI Configuration
export const TOAST_DURATION = 2500;
export const SEARCH_DEBOUNCE_MS = 300;
export const ANIMATION_DURATION = {
    short: 150,
    medium: 300,
    long: 500
};

// Progress ring configuration
export const PROGRESS_RING = {
    radius: 15.5,
    circumference: 97.389, // 2 * PI * radius
    strokeWidth: 3
};

// Quiz configuration
export const QUIZ_CONFIG = {
    questionsPerRound: 5,
    questionTypes: ['quote_attribution', 'tradition', 'birthplace', 'sampradaya', 'period'],
    perfectScoreThreshold: 1.0
};

// Search configuration
export const SEARCH_CONFIG = {
    minQueryLength: 2,
    fuzzyThreshold: 0.6,
    maxResults: 50,
    weights: {
        exactMatch: 100,
        startsWithMatch: 90,
        wordMatch: 70,
        fuzzyMatch: 50
    }
};

// Journal configuration
export const JOURNAL_CONFIG = {
    maxEntryLength: 5000,
    calendarDays: 28
};

// Jayanti configuration
export const JAYANTI_CONFIG = {
    lookAheadDays: 365
};

// Tradition colors
export const TRADITION_COLORS = {
    hindu: '#E85D04',
    sikh: '#0077B6',
    jain: '#D4A574',
    buddhist: '#7C5CBF'
};

// Default avatar gradients by tradition
export const AVATAR_GRADIENTS = {
    hindu: 'linear-gradient(135deg, #FF9933 0%, #E85D04 100%)',
    sikh: 'linear-gradient(135deg, #00A8E8 0%, #0077B6 100%)',
    jain: 'linear-gradient(135deg, #F4D03F 0%, #D4A574 100%)',
    buddhist: 'linear-gradient(135deg, #9B59B6 0%, #7C5CBF 100%)',
    default: 'linear-gradient(135deg, #FF9933 0%, #E85D04 100%)'
};

// Screen identifiers
export const SCREENS = {
    HOME: 'home',
    SAINTS_LIST: 'saints-list',
    SAINT_DETAIL: 'saint-detail'
};

// Modal identifiers
export const MODALS = {
    DAILY_DARSHAN: 'daily-darshan',
    QUIZ: 'quiz',
    ACHIEVEMENTS: 'achievements',
    PATHS: 'paths',
    JOURNAL: 'journal',
    SHARE_CARD: 'share-card',
    PILGRIMAGE: 'pilgrimage',
    JAYANTI: 'jayanti',
    SEARCH: 'search'
};

// Achievement types
export const ACHIEVEMENT_TYPES = {
    EXPLORATION: 'exploration',
    STREAK: 'streak',
    FAVORITES: 'favorites',
    REFLECTION: 'reflection',
    QUIZ: 'quiz',
    TRADITION: 'tradition',
    PATH: 'path'
};

// Place types for pilgrimage
export const PLACE_TYPES = {
    BIRTHPLACE: 'birthplace',
    SAMADHI: 'samadhi',
    SADHANA: 'sadhana',
    TEMPLE: 'temple',
    RESIDENCE: 'residence',
    MIRACLE: 'miracle',
    NIRVAN: 'nirvan',
    CREATION: 'creation',
    MARRIAGE: 'marriage'
};

// Story types
export const STORY_TYPES = {
    ORIGIN: 'origin',
    TEACHING: 'teaching',
    MIRACLE: 'miracle',
    DEATH: 'death'
};

// Card styles for sharing
export const CARD_STYLE_IDS = {
    MINIMAL: 'minimal',
    ORNATE: 'ornate',
    DARK: 'dark'
};

// Error messages
export const ERRORS = {
    STORAGE_READ: 'Failed to read saved data',
    STORAGE_WRITE: 'Failed to save data',
    SAINT_NOT_FOUND: 'Saint not found',
    INVALID_TRADITION: 'Invalid tradition',
    QUIZ_GENERATION_FAILED: 'Failed to generate quiz questions'
};

// Success messages
export const MESSAGES = {
    NOTE_SAVED: 'Reflection saved',
    NOTE_DELETED: 'Reflection deleted',
    FAVORITE_ADDED: 'Added to favorites',
    FAVORITE_REMOVED: 'Removed from favorites',
    JOURNAL_SAVED: 'Journal entry saved',
    ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
    QUIZ_PERFECT: 'Perfect score!',
    CARD_DOWNLOADED: 'Card downloaded',
    CARD_SHARED: 'Card shared'
};

// Accessibility
export const A11Y = {
    MODAL_ROLE: 'dialog',
    LIVE_REGION_POLITE: 'polite',
    LIVE_REGION_ASSERTIVE: 'assertive'
};

Object.freeze(APP_NAME);
Object.freeze(SCREENS);
Object.freeze(MODALS);
