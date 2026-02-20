import Dexie, { type Table } from 'dexie';

export interface Favorite {
    saintId: string;
    addedAt: number;
}

export interface Explored {
    saintId: string;
    exploredAt: number;
}

export interface JournalEntry {
    id?: number;
    date: string; // YYYY-MM-DD
    saintId: string;
    prompt: string;
    text: string;
    timestamp: number;
}

export interface Streak {
    id: string; // usually 'user_streak'
    lastOpened: number; // timestamp
    currentStreak: number;
    bestStreak: number;
}

export interface Achievement {
    id: string;
    unlockedAt: number;
}

export class SantDarshanDB extends Dexie {
    favorites!: Table<Favorite, string>;
    explored!: Table<Explored, string>;
    journal!: Table<JournalEntry, number>;
    streak!: Table<Streak, string>;
    achievements!: Table<Achievement, string>;

    constructor() {
        super('SantDarshanDB');

        this.version(1).stores({
            favorites: 'saintId, addedAt',
            explored: 'saintId, exploredAt',
            journal: '++id, date, saintId, timestamp',
            streak: 'id, lastOpened',
            achievements: 'id, unlockedAt'
        });
    }
}

export const db = new SantDarshanDB();
