import { writable } from 'svelte/store';
import { db } from '$lib/services/StorageService';
import { browser } from '$app/environment';

export const favorites = writable<Set<string>>(new Set());
export const explored = writable<Set<string>>(new Set());
export const streak = writable({ current: 0, best: 0, lastOpened: 0 });

// Init function to load data from Dexie
export async function initUserStore() {
    if (!browser) return;

    // Load Favorites
    const favDocs = await db.favorites.toArray();
    favorites.set(new Set(favDocs.map(f => f.saintId)));

    // Load Explored
    const expDocs = await db.explored.toArray();
    explored.set(new Set(expDocs.map(e => e.saintId)));

    // Load Streak
    const streakDoc = await db.streak.get('user_streak');
    if (streakDoc) {
        streak.set({
            current: streakDoc.currentStreak,
            best: streakDoc.bestStreak,
            lastOpened: streakDoc.lastOpened
        });
    }
}

// Actions
export async function toggleFavorite(saintId: string) {
    if (!browser) return;

    const isFav = await db.favorites.get(saintId);
    if (isFav) {
        await db.favorites.delete(saintId);
        favorites.update(set => {
            set.delete(saintId);
            return set;
        });
    } else {
        await db.favorites.add({ saintId, addedAt: Date.now() });
        favorites.update(set => {
            set.add(saintId);
            return set;
        });
    }
}

export async function markExplored(saintId: string) {
    if (!browser) return;

    const isExp = await db.explored.get(saintId);
    if (!isExp) {
        await db.explored.add({ saintId, exploredAt: Date.now() });
        explored.update(set => {
            set.add(saintId);
            return set;
        });
    }
}

export async function updateStreak() {
    if (!browser) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNum = today.getTime();

    const streakDoc = await db.streak.get('user_streak');

    if (!streakDoc) {
        const newStreak = { id: 'user_streak', lastOpened: todayNum, currentStreak: 1, bestStreak: 1 };
        await db.streak.add(newStreak);
        streak.set({ current: 1, best: 1, lastOpened: todayNum });
        return;
    }

    const lastOpened = new Date(streakDoc.lastOpened);
    lastOpened.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - lastOpened.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        // Increment streak
        const newCurrent = streakDoc.currentStreak + 1;
        const newBest = Math.max(newCurrent, streakDoc.bestStreak);
        await db.streak.update('user_streak', {
            lastOpened: todayNum,
            currentStreak: newCurrent,
            bestStreak: newBest
        });
        streak.set({ current: newCurrent, best: newBest, lastOpened: todayNum });
    } else if (diffDays > 1) {
        // Reset streak
        await db.streak.update('user_streak', {
            lastOpened: todayNum,
            currentStreak: 1
        });
        streak.set({ current: 1, best: streakDoc.bestStreak, lastOpened: todayNum });
    }
}
