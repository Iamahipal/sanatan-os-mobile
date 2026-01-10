/**
 * Sant Darshan App - Learning Paths Service
 * Curated spiritual journeys
 */

import storage from './storage.js';
import { getSaint } from './saints.js';
import eventBus, { Events } from '../core/events.js';

/**
 * Learning path definitions
 */
export const LEARNING_PATHS = [
    {
        id: 'alvars-journey',
        title: '12 Alvars Journey',
        titleHi: 'द्वादश आळ्वार यात्रा',
        description: 'Follow the spiritual journey of the 12 Vaishnavite poet-saints of Tamil Nadu',
        icon: '🙏',
        color: '#FF9933',
        tradition: 'hindu',
        duration: '12 days',
        saints: ['nammalvar', 'andal', 'periyalvar', 'kulasekhara', 'thirumangai'],
        rewards: {
            badge: 'alvar_devotee',
            badgeName: 'Alvar Devotee',
            badgeIcon: '🪷'
        }
    },
    {
        id: 'bhakti-masters',
        title: 'Bhakti Movement Masters',
        titleHi: 'भक्ति आंदोलन के गुरु',
        description: 'Explore the revolutionary saints who spread devotion across India',
        icon: '❤️',
        color: '#E91E63',
        tradition: 'hindu',
        duration: '10 days',
        saints: ['kabir', 'mirabai', 'tulsidas', 'surdas', 'chaitanya', 'tukaram', 'dnyaneshwar', 'namdev'],
        rewards: {
            badge: 'bhakti_master',
            badgeName: 'Bhakti Master',
            badgeIcon: '💖'
        }
    },
    {
        id: 'sikh-gurus',
        title: 'Sikh Gurus Path',
        titleHi: 'सिख गुरु मार्ग',
        description: 'Walk the path of the Ten Sikh Gurus from Nanak to Gobind Singh',
        icon: '☬',
        color: '#1E90FF',
        tradition: 'sikh',
        duration: '10 days',
        saints: ['gurunanak', 'guruangad', 'guruamardas', 'gururamdas', 'guruarjan', 'gurugobindsingh'],
        rewards: {
            badge: 'sikh_devotee',
            badgeName: 'Waheguru Devotee',
            badgeIcon: '🙏'
        }
    },
    {
        id: 'varkari-pilgrimage',
        title: 'Varkari Pilgrimage',
        titleHi: 'वारकरी तीर्थयात्रा',
        description: "Join the spiritual footsteps of Maharashtra's beloved saints",
        icon: '🚶',
        color: '#FF5722',
        tradition: 'hindu',
        duration: '7 days',
        saints: ['dnyaneshwar', 'namdev', 'eknath', 'tukaram', 'janabai', 'chokhamela'],
        rewards: {
            badge: 'varkari',
            badgeName: 'Varkari Pilgrim',
            badgeIcon: '🏃'
        }
    },
    {
        id: 'jain-tirthankaras',
        title: 'Jain Tirthankaras',
        titleHi: 'जैन तीर्थंकर',
        description: 'Learn from the great teachers of non-violence and liberation',
        icon: '🙌',
        color: '#FFD700',
        tradition: 'jain',
        duration: '5 days',
        saints: ['mahavira', 'parshvanatha'],
        rewards: {
            badge: 'jain_seeker',
            badgeName: 'Ahimsa Seeker',
            badgeIcon: '☮️'
        }
    },
    {
        id: 'nayanar-devotion',
        title: 'Nayanar Devotion',
        titleHi: 'नायनार भक्ति',
        description: 'Discover the passionate Shaivite saints of Tamil Nadu',
        icon: '🔱',
        color: '#9C27B0',
        tradition: 'hindu',
        duration: '7 days',
        saints: ['appar', 'sambandar', 'sundarar', 'manikkavacakar'],
        rewards: {
            badge: 'nayanar_devotee',
            badgeName: 'Nayanar Devotee',
            badgeIcon: '🕉️'
        }
    },
    {
        id: 'haridasa-tradition',
        title: 'Haridasa Tradition',
        titleHi: 'हरिदास परंपरा',
        description: 'Explore the devotional music tradition of Karnataka',
        icon: '🎵',
        color: '#4CAF50',
        tradition: 'hindu',
        duration: '5 days',
        saints: ['purandaradasa', 'kanakadasa', 'vyasatirtha'],
        rewards: {
            badge: 'haridasa',
            badgeName: 'Haridasa',
            badgeIcon: '🎶'
        }
    }
];

/**
 * Learning Paths Service
 */
class PathsService {
    /**
     * Get all learning paths
     * @returns {Array}
     */
    getAllPaths() {
        return LEARNING_PATHS.map(path => this.enrichPath(path));
    }

    /**
     * Get a specific path by ID
     * @param {string} pathId
     * @returns {Object|null}
     */
    getPath(pathId) {
        const path = LEARNING_PATHS.find(p => p.id === pathId);
        if (!path) return null;
        return this.enrichPath(path);
    }

    /**
     * Enrich path with progress and saint details
     * @param {Object} path
     * @returns {Object}
     */
    enrichPath(path) {
        const progress = storage.getPathProgress(path.id);
        const saints = path.saints
            .map(id => getSaint(id))
            .filter(s => s);

        const completedCount = progress.completed?.length || 0;
        const totalCount = saints.length;

        return {
            ...path,
            saints,
            progress: {
                completed: progress.completed || [],
                currentIndex: progress.currentIndex || 0,
                startedAt: progress.startedAt,
                completedCount,
                totalCount,
                percentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
                isStarted: !!progress.startedAt,
                isCompleted: completedCount >= totalCount
            }
        };
    }

    /**
     * Get paths by tradition
     * @param {string} traditionId
     * @returns {Array}
     */
    getPathsByTradition(traditionId) {
        return this.getAllPaths().filter(p => p.tradition === traditionId);
    }

    /**
     * Get started paths
     * @returns {Array}
     */
    getStartedPaths() {
        return this.getAllPaths().filter(p => p.progress.isStarted && !p.progress.isCompleted);
    }

    /**
     * Get completed paths
     * @returns {Array}
     */
    getCompletedPaths() {
        return this.getAllPaths().filter(p => p.progress.isCompleted);
    }

    /**
     * Start a learning path
     * @param {string} pathId
     * @returns {Object} The started path
     */
    startPath(pathId) {
        const path = this.getPath(pathId);
        if (!path) return null;

        storage.startPath(pathId);
        eventBus.emit(Events.PATH_STARTED, { pathId, path });

        return this.getPath(pathId);
    }

    /**
     * Get current saint in a path
     * @param {string} pathId
     * @returns {Object|null}
     */
    getCurrentSaint(pathId) {
        const path = this.getPath(pathId);
        if (!path || !path.progress.isStarted) return null;

        const currentIndex = path.progress.currentIndex;
        return path.saints[currentIndex] || null;
    }

    /**
     * Get next saint in a path
     * @param {string} pathId
     * @returns {Object|null}
     */
    getNextSaint(pathId) {
        const path = this.getPath(pathId);
        if (!path) return null;

        const nextIndex = path.progress.currentIndex;
        return path.saints[nextIndex] || null;
    }

    /**
     * Mark a saint as completed in a path
     * @param {string} pathId
     * @param {string} saintId
     */
    markSaintCompleted(pathId, saintId) {
        const path = this.getPath(pathId);
        if (!path) return;

        storage.markPathSaintCompleted(pathId, saintId);

        // Check if path is now complete
        const updatedPath = this.getPath(pathId);
        if (updatedPath.progress.isCompleted) {
            eventBus.emit(Events.PATH_COMPLETED, {
                pathId,
                path: updatedPath
            });
        }
    }

    /**
     * Check if a saint is completed in a path
     * @param {string} pathId
     * @param {string} saintId
     * @returns {boolean}
     */
    isSaintCompleted(pathId, saintId) {
        const path = this.getPath(pathId);
        if (!path) return false;
        return path.progress.completed.includes(saintId);
    }

    /**
     * Get progress statistics
     * @returns {Object}
     */
    getStats() {
        const all = this.getAllPaths();
        const started = all.filter(p => p.progress.isStarted);
        const completed = all.filter(p => p.progress.isCompleted);

        return {
            total: all.length,
            started: started.length,
            completed: completed.length,
            inProgress: started.length - completed.length
        };
    }

    /**
     * Get recommended path based on user's exploration
     * @returns {Object|null}
     */
    getRecommendedPath() {
        const notStarted = this.getAllPaths().filter(p => !p.progress.isStarted);

        if (notStarted.length === 0) {
            // Recommend a path to continue
            const inProgress = this.getStartedPaths();
            return inProgress[0] || null;
        }

        // Recommend based on explored saints
        // (Could be enhanced with more sophisticated logic)
        return notStarted[0];
    }
}

// Create and export singleton
const paths = new PathsService();

export default paths;
export { PathsService, LEARNING_PATHS };
