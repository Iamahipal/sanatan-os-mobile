/**
 * HabitDetailsScreen - Habit Statistics View
 * Shows detailed stats, calendar, and history
 */

import { Component } from '../core/Component.js';
import { Store } from '../core/Store.js';
import { Router, navigate } from '../core/Router.js';
import { HabitService } from '../services/HabitService.js';
import { DateUtils } from '../utils/DateUtils.js';

export class HabitDetailsScreen extends Component {
    constructor() {
        super();
        const habitId = Store.getProperty('currentHabitId');
        this.habit = habitId ? HabitService.getById(habitId) : null;
    }

    template() {
        if (!this.habit) {
            return `
                <div class="screen active" style="display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center;">
                        <p>Habit not found</p>
                        <button id="back-btn" class="btn btn-primary mt-4">Go Back</button>
                    </div>
                </div>
            `;
        }

        const streak = HabitService.calculateStreak(this.habit);
        const stats = HabitService.getStats(this.habit, 'month');
        const yearStats = HabitService.getStats(this.habit, 'year');
        const allStats = HabitService.getStats(this.habit, 'all');

        return `
            <div class="screen habit-detail-screen active">
                <!-- Header -->
                <header class="app-header">
                    <button id="back-btn" class="header-btn" aria-label="Go back">
                        <i data-lucide="chevron-left"></i>
                    </button>
                    <h1 class="header-title">${this.habit.name}</h1>
                    <button id="edit-btn" class="header-btn" aria-label="Edit habit">
                        <i data-lucide="edit-2"></i>
                    </button>
                </header>
                
                <main class="screen-content">
                    <!-- Streak Card -->
                    <div class="card" style="text-align: center; background: ${this.habit.color}; color: white; margin-bottom: 16px;">
                        <div style="font-size: 48px; font-weight: 700;">${streak}</div>
                        <div style="font-size: 14px; opacity: 0.9;">Day Streak</div>
                        ${streak > 0 ? `<div style="margin-top: 8px;">🔥 Keep it going!</div>` : ''}
                    </div>
                    
                    <!-- Stats Grid -->
                    <div class="card" style="margin-bottom: 16px;">
                        <h3 style="margin-bottom: 16px; font-size: 14px; text-transform: uppercase; color: var(--text-tertiary);">
                            Statistics
                        </h3>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                            <div>
                                <div style="font-size: 24px; font-weight: 700; color: ${this.habit.color};">${stats.rate}%</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">This Month</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 700; color: ${this.habit.color};">${yearStats.completed}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">This Year</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 700; color: ${this.habit.color};">${allStats.completed}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Total</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Contribution Graph -->
                    <div class="card" style="margin-bottom: 16px;">
                        <h3 style="margin-bottom: 16px; font-size: 14px; text-transform: uppercase; color: var(--text-tertiary);">
                            Last 365 Days
                        </h3>
                        <div class="contribution-graph" style="--habit-color: ${this.habit.color}">
                            ${this.renderYearGrid()}
                        </div>
                    </div>
                    
                    <!-- Recent History -->
                    <div class="card">
                        <h3 style="margin-bottom: 16px; font-size: 14px; text-transform: uppercase; color: var(--text-tertiary);">
                            Recent Activity
                        </h3>
                        <div class="history-list">
                            ${this.renderRecentHistory()}
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div style="margin-top: 24px;">
                        <button id="archive-btn" class="btn btn-ghost" style="width: 100%; color: var(--text-secondary);">
                            <i data-lucide="archive"></i>
                            Archive Habit
                        </button>
                    </div>
                </main>
            </div>
        `;
    }

    renderYearGrid() {
        const today = new Date();
        const cells = [];

        for (let i = 364; i >= 0; i--) {
            const date = DateUtils.addDays(today, -i);
            const key = DateUtils.getDateKey(date);
            const entry = this.habit.entries?.[key];
            const isCompleted = entry?.status === 'completed';

            cells.push(`
                <div class="grid-cell ${isCompleted ? 'level-4' : ''}" 
                     title="${DateUtils.format(date, 'short')}"></div>
            `);
        }

        return `
            <div class="habit-grid" style="grid-template-columns: repeat(52, 1fr);">
                ${cells.join('')}
            </div>
        `;
    }

    renderRecentHistory() {
        const entries = [];
        const today = new Date();

        // Get last 14 days
        for (let i = 0; i < 14; i++) {
            const date = DateUtils.addDays(today, -i);
            const key = DateUtils.getDateKey(date);
            const entry = this.habit.entries?.[key];

            if (entry?.status) {
                entries.push({
                    date,
                    status: entry.status,
                    note: entry.note
                });
            }
        }

        if (entries.length === 0) {
            return '<div style="text-align: center; color: var(--text-tertiary); padding: 16px;">No activity yet</div>';
        }

        return entries.map(e => `
            <div class="flex justify-between items-center" style="padding: 8px 0; border-bottom: 1px solid var(--border-default);">
                <div>
                    <div style="font-weight: 500;">${DateUtils.format(e.date, 'relative')}</div>
                    ${e.note ? `<div style="font-size: 12px; color: var(--text-secondary);">${e.note}</div>` : ''}
                </div>
                <div style="color: ${e.status === 'completed' ? 'var(--success)' : 'var(--text-tertiary)'};">
                    ${e.status === 'completed' ? '✓ Done' : '− Skipped'}
                </div>
            </div>
        `).join('');
    }

    afterRender() {
        // Back button
        this.on('#back-btn', 'click', () => {
            Store.set('currentHabitId', null);
            Router.back();
        });

        // Edit button
        const editBtn = this.find('#edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                Store.set('editingHabitId', this.habit.id);
                navigate('/edit-habit');
            });
        }

        // Archive button
        const archiveBtn = this.find('#archive-btn');
        if (archiveBtn) {
            archiveBtn.addEventListener('click', () => {
                if (confirm(`Archive "${this.habit.name}"? You can restore it later.`)) {
                    HabitService.archive(this.habit.id);
                    Store.set('currentHabitId', null);
                    navigate('/');
                }
            });
        }

        // Init icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }
}
