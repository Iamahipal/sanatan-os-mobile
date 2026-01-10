/**
 * Sant Darshan App - Modals Index
 * Export all modal renderers
 */

export { default as QuizModal } from './quiz.js';
export { default as AchievementsModal } from './achievements.js';
export { default as JournalModal } from './journal.js';
export { default as PathsModal } from './paths.js';
export { default as ShareCardModal } from './share-card.js';
export { default as PilgrimageModal } from './pilgrimage.js';
export { default as JayantiModal } from './jayanti.js';

/**
 * Modal registry for dynamic modal loading
 */
export const ModalRegistry = {
    quiz: () => import('./quiz.js').then(m => m.default),
    achievements: () => import('./achievements.js').then(m => m.default),
    journal: () => import('./journal.js').then(m => m.default),
    paths: () => import('./paths.js').then(m => m.default),
    'share-card': () => import('./share-card.js').then(m => m.default),
    pilgrimage: () => import('./pilgrimage.js').then(m => m.default),
    jayanti: () => import('./jayanti.js').then(m => m.default)
};

/**
 * Get modal renderer by name
 * @param {string} name - Modal name
 * @returns {Promise<Object>} Modal renderer
 */
export async function getModal(name) {
    const loader = ModalRegistry[name];
    if (!loader) {
        console.warn(`Unknown modal: ${name}`);
        return null;
    }
    return loader();
}
