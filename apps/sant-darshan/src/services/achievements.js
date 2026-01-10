/**
 * Sant Darshan App - Achievements Service
 * Achievement tracking and unlocking
 */

import state from '../core/state.js';
import eventBus, { Events } from '../core/events.js';
import storage from './storage.js';
import { getSaintCount, getSaintsByTradition } from './saints.js';
import { ACHIEVEMENT_TYPES, MESSAGES } from '../data/constants.js';

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS = [
    // Exploration achievements
    {
        id: 'first_darshan',
        name: 'First Darshan',
        nameHi: 'प्रथम दर्शन',
        icon: '🙏',
        description: 'Visit your first saint',
        type: ACHIEVEMENT_TYPES.EXPLORATION,
        condition: (data) => Object.keys(data.explored || {}).length >= 1
    },
    {
        id: 'devotee',
        name: 'Devoted Seeker',
        nameHi: 'भक्त',
        icon: '🪷',
        description: 'Explore 10 saints',
        type: ACHIEVEMENT_TYPES.EXPLORATION,
        condition: (data) => Object.keys(data.explored || {}).length >= 10
    },
    {
        id: 'scholar',
        name: 'Spiritual Scholar',
        nameHi: 'विद्वान',
        icon: '📚',
        description: 'Explore 25 saints',
        type: ACHIEVEMENT_TYPES.EXPLORATION,
        condition: (data) => Object.keys(data.explored || {}).length >= 25
    },
    {
        id: 'pilgrim',
        name: 'Dedicated Pilgrim',
        nameHi: 'तीर्थयात्री',
        icon: '🚶',
        description: 'Explore 50 saints',
        type: ACHIEVEMENT_TYPES.EXPLORATION,
        condition: (data) => Object.keys(data.explored || {}).length >= 50
    },
    {
        id: 'enlightened',
        name: 'Enlightened One',
        nameHi: 'प्रबुद्ध',
        icon: '✨',
        description: 'Explore all saints',
        type: ACHIEVEMENT_TYPES.EXPLORATION,
        condition: (data) => Object.keys(data.explored || {}).length >= getSaintCount()
    },

    // Streak achievements
    {
        id: 'streak_3',
        name: 'Consistent Seeker',
        nameHi: 'नियमित साधक',
        icon: '🔥',
        description: '3-day darshan streak',
        type: ACHIEVEMENT_TYPES.STREAK,
        condition: (data) => (data.dailyDarshan?.streak || 0) >= 3
    },
    {
        id: 'streak_7',
        name: 'Week of Devotion',
        nameHi: 'भक्ति सप्ताह',
        icon: '🌟',
        description: '7-day darshan streak',
        type: ACHIEVEMENT_TYPES.STREAK,
        condition: (data) => (data.dailyDarshan?.streak || 0) >= 7
    },
    {
        id: 'streak_14',
        name: 'Fortnight of Faith',
        nameHi: 'पाक्षिक साधना',
        icon: '💫',
        description: '14-day darshan streak',
        type: ACHIEVEMENT_TYPES.STREAK,
        condition: (data) => (data.dailyDarshan?.streak || 0) >= 14
    },
    {
        id: 'streak_30',
        name: 'Month of Sadhana',
        nameHi: 'साधना मास',
        icon: '👑',
        description: '30-day darshan streak',
        type: ACHIEVEMENT_TYPES.STREAK,
        condition: (data) => (data.dailyDarshan?.streak || 0) >= 30
    },

    // Favorites achievements
    {
        id: 'collector',
        name: 'Heart Collector',
        nameHi: 'संग्राहक',
        icon: '❤️',
        description: 'Favorite 5 saints',
        type: ACHIEVEMENT_TYPES.FAVORITES,
        condition: (data) => (data.favorites || []).length >= 5
    },
    {
        id: 'devoted_collector',
        name: 'Devoted Collector',
        nameHi: 'समर्पित संग्राहक',
        icon: '💖',
        description: 'Favorite 15 saints',
        type: ACHIEVEMENT_TYPES.FAVORITES,
        condition: (data) => (data.favorites || []).length >= 15
    },

    // Reflection achievements
    {
        id: 'reflector',
        name: 'Deep Reflector',
        nameHi: 'चिंतक',
        icon: '✍️',
        description: 'Write 5 reflections',
        type: ACHIEVEMENT_TYPES.REFLECTION,
        condition: (data) => Object.values(data.notes || {}).flat().length >= 5
    },
    {
        id: 'contemplator',
        name: 'Contemplator',
        nameHi: 'मनन करने वाला',
        icon: '📝',
        description: 'Write 20 reflections',
        type: ACHIEVEMENT_TYPES.REFLECTION,
        condition: (data) => Object.values(data.notes || {}).flat().length >= 20
    },

    // Quiz achievements
    {
        id: 'quiz_starter',
        name: 'Quiz Beginner',
        nameHi: 'प्रारंभी',
        icon: '🎯',
        description: 'Complete first quiz',
        type: ACHIEVEMENT_TYPES.QUIZ,
        condition: (data) => (data.quizStats?.totalCompleted || 0) >= 1
    },
    {
        id: 'quiz_adept',
        name: 'Quiz Adept',
        nameHi: 'प्रवीण',
        icon: '🎓',
        description: 'Complete 10 quizzes',
        type: ACHIEVEMENT_TYPES.QUIZ,
        condition: (data) => (data.quizStats?.totalCompleted || 0) >= 10
    },
    {
        id: 'quiz_master',
        name: 'Quiz Master',
        nameHi: 'ज्ञानी',
        icon: '🏆',
        description: 'Score 100% on 5 quizzes',
        type: ACHIEVEMENT_TYPES.QUIZ,
        condition: (data) => (data.quizStats?.perfectScores || 0) >= 5
    },

    // Tradition achievements
    {
        id: 'tradition_hindu',
        name: 'Hindu Path',
        nameHi: 'हिंदू मार्ग',
        icon: '🕉️',
        description: 'Explore all Hindu saints',
        type: ACHIEVEMENT_TYPES.TRADITION,
        condition: (data) => {
            const hinduSaints = getSaintsByTradition('hindu');
            return hinduSaints.length > 0 &&
                hinduSaints.every(s => data.explored?.[s.id]);
        }
    },
    {
        id: 'tradition_sikh',
        name: 'Sikh Path',
        nameHi: 'सिख मार्ग',
        icon: '☬',
        description: 'Explore all Sikh Gurus',
        type: ACHIEVEMENT_TYPES.TRADITION,
        condition: (data) => {
            const sikhSaints = getSaintsByTradition('sikh');
            return sikhSaints.length > 0 &&
                sikhSaints.every(s => data.explored?.[s.id]);
        }
    },
    {
        id: 'tradition_jain',
        name: 'Jain Path',
        nameHi: 'जैन मार्ग',
        icon: '🙌',
        description: 'Explore all Jain Tirthankaras',
        type: ACHIEVEMENT_TYPES.TRADITION,
        condition: (data) => {
            const jainSaints = getSaintsByTradition('jain');
            return jainSaints.length > 0 &&
                jainSaints.every(s => data.explored?.[s.id]);
        }
    },
    {
        id: 'tradition_buddhist',
        name: 'Buddhist Path',
        nameHi: 'बौद्ध मार्ग',
        icon: '☸️',
        description: 'Explore all Buddhist masters',
        type: ACHIEVEMENT_TYPES.TRADITION,
        condition: (data) => {
            const buddhistSaints = getSaintsByTradition('buddhist');
            return buddhistSaints.length > 0 &&
                buddhistSaints.every(s => data.explored?.[s.id]);
        }
    },

    // Journal achievements
    {
        id: 'journal_starter',
        name: 'Journal Starter',
        nameHi: 'डायरी लेखक',
        icon: '📔',
        description: 'Write your first journal entry',
        type: ACHIEVEMENT_TYPES.REFLECTION,
        condition: (data) => Object.keys(data.journal || {}).length >= 1
    },
    {
        id: 'journal_keeper',
        name: 'Journal Keeper',
        nameHi: 'नियमित लेखक',
        icon: '📕',
        description: 'Write 10 journal entries',
        type: ACHIEVEMENT_TYPES.REFLECTION,
        condition: (data) => Object.keys(data.journal || {}).length >= 10
    }
];

/**
 * Achievements Service
 */
class AchievementsService {
    constructor() {
        this.achievements = ACHIEVEMENTS;
        this.setupListeners();
    }

    /**
     * Setup event listeners to check achievements
     */
    setupListeners() {
        // Check achievements on relevant events
        const checkEvents = [
            Events.SAINT_EXPLORED,
            Events.FAVORITE_ADDED,
            Events.NOTE_ADDED,
            Events.QUIZ_COMPLETED,
            Events.STREAK_UPDATED,
            Events.JOURNAL_SAVED
        ];

        checkEvents.forEach(event => {
            eventBus.on(event, () => this.checkAll());
        });
    }

    /**
     * Get all achievements with unlock status
     * @returns {Array}
     */
    getAll() {
        const unlocked = storage.getUnlockedAchievements();

        return this.achievements.map(achievement => ({
            ...achievement,
            unlocked: unlocked.includes(achievement.id)
        }));
    }

    /**
     * Get unlocked achievements
     * @returns {Array}
     */
    getUnlocked() {
        return this.getAll().filter(a => a.unlocked);
    }

    /**
     * Get locked achievements
     * @returns {Array}
     */
    getLocked() {
        return this.getAll().filter(a => !a.unlocked);
    }

    /**
     * Get achievement by ID
     * @param {string} id
     * @returns {Object|null}
     */
    getById(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (!achievement) return null;

        return {
            ...achievement,
            unlocked: storage.isAchievementUnlocked(id)
        };
    }

    /**
     * Get achievements by type
     * @param {string} type
     * @returns {Array}
     */
    getByType(type) {
        return this.getAll().filter(a => a.type === type);
    }

    /**
     * Check all achievements and unlock newly earned ones
     * @returns {Array} Newly unlocked achievements
     */
    checkAll() {
        const newlyUnlocked = [];
        const userData = this.getUserData();

        for (const achievement of this.achievements) {
            if (!storage.isAchievementUnlocked(achievement.id)) {
                try {
                    if (achievement.condition(userData)) {
                        const wasNew = storage.unlockAchievement(achievement.id);
                        if (wasNew) {
                            newlyUnlocked.push(achievement);
                            this.showUnlockToast(achievement);
                        }
                    }
                } catch (error) {
                    console.error(`Error checking achievement ${achievement.id}:`, error);
                }
            }
        }

        return newlyUnlocked;
    }

    /**
     * Get user data for condition checking
     * @returns {Object}
     */
    getUserData() {
        return {
            explored: state.get('explored') || {},
            favorites: state.get('favorites') || [],
            notes: state.get('notes') || {},
            dailyDarshan: state.get('dailyDarshan') || {},
            quizStats: state.get('quizStats') || {},
            pathProgress: state.get('pathProgress') || {},
            journal: state.get('journal') || {}
        };
    }

    /**
     * Show achievement unlock toast
     * @param {Object} achievement
     */
    showUnlockToast(achievement) {
        eventBus.emit(Events.TOAST_SHOW, {
            message: `${achievement.icon} ${achievement.name} unlocked!`,
            duration: 3000
        });
    }

    /**
     * Get progress towards next achievement in a type
     * @param {string} type
     * @returns {Object|null}
     */
    getNextProgress(type) {
        const typeAchievements = this.getByType(type)
            .filter(a => !a.unlocked)
            .sort((a, b) => this.getAchievementOrder(a) - this.getAchievementOrder(b));

        if (typeAchievements.length === 0) return null;

        const next = typeAchievements[0];
        const userData = this.getUserData();

        // Calculate progress based on type
        let current = 0;
        let target = 0;

        switch (type) {
            case ACHIEVEMENT_TYPES.EXPLORATION:
                current = Object.keys(userData.explored).length;
                target = this.extractNumber(next.description) || getSaintCount();
                break;
            case ACHIEVEMENT_TYPES.STREAK:
                current = userData.dailyDarshan?.streak || 0;
                target = this.extractNumber(next.description) || 7;
                break;
            case ACHIEVEMENT_TYPES.FAVORITES:
                current = userData.favorites?.length || 0;
                target = this.extractNumber(next.description) || 5;
                break;
            case ACHIEVEMENT_TYPES.REFLECTION:
                current = Object.values(userData.notes || {}).flat().length;
                target = this.extractNumber(next.description) || 5;
                break;
            case ACHIEVEMENT_TYPES.QUIZ:
                current = userData.quizStats?.totalCompleted || 0;
                target = this.extractNumber(next.description) || 1;
                break;
        }

        return {
            achievement: next,
            current,
            target,
            percentage: Math.min(100, (current / target) * 100)
        };
    }

    /**
     * Extract number from description
     * @param {string} description
     * @returns {number|null}
     */
    extractNumber(description) {
        const match = description.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }

    /**
     * Get achievement order for sorting
     * @param {Object} achievement
     * @returns {number}
     */
    getAchievementOrder(achievement) {
        const num = this.extractNumber(achievement.description);
        return num || 999;
    }

    /**
     * Get achievement statistics
     * @returns {Object}
     */
    getStats() {
        const all = this.getAll();
        const unlocked = all.filter(a => a.unlocked);

        return {
            total: all.length,
            unlocked: unlocked.length,
            locked: all.length - unlocked.length,
            percentage: (unlocked.length / all.length) * 100
        };
    }
}

// Create and export singleton
const achievements = new AchievementsService();

export default achievements;
export { AchievementsService, ACHIEVEMENTS };
