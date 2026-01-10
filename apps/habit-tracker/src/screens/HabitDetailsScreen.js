import { Component } from '../core/Component.js';
import { Router } from '../core/Router.js';
import { store } from '../core/Store.js';
import { HabitService } from '../services/HabitService.js';
import { StatsService } from '../services/StatsService.js';
import { DateUtils } from '../utils/DateUtils.js';

export class HabitDetailsScreen extends Component {
    template() {
        const state = store.get();
        const habitId = state.currentHabitId;
        const habit = state.habits.find(h => h.id === habitId);

        if (!habit) {
            return `<div style="padding: 20px;">Habit not found</div>`;
        }

        const streak = HabitService.calculateStreak(habit);
        const totalCheckins = Object.keys(habit.entries).length;

        return `
            <div class="habit-details-screen" style="padding: 16px;">
                <header class="app-header" style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
                    <button id="back-btn" class="header-btn">←</button>
                    <h1 style="font-size: 1.2rem; font-weight: 700;">Details</h1>
                     <button id="delete-btn" class="header-btn" style="color: var(--danger);">🗑️</button>
                </header>

                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="width: 64px; height: 64px; background: ${habit.color}; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; color: white;">
                        <span>${habit.icon.charAt(0).toUpperCase()}</span>
                    </div>
                    <h2 style="font-size: 1.8rem;">${habit.name}</h2>
                    <div style="color: var(--text-secondary);">
                        Currently on a <strong style="color: var(--primary);">${streak} day streak</strong>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <div class="card" style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: ${habit.color};">${totalCheckins}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Total Check-ins</div>
                    </div>
                    <div class="card" style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: ${habit.color};">Best</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Streak Logic TBD</div>
                    </div>
                </div>

                <!-- History Calendar Placeholder -->
                <div class="card">
                     <h3 style="margin-bottom: 16px;">History (Last 30 Days)</h3>
                     <div class="calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;">
                        ${this.renderRecentHistory(habit)}
                     </div>
                </div>
            </div>
        `;
    }

    renderRecentHistory(habit) {
        // Simple visual of last 28 days
        const days = [];
        const today = new Date();
        for (let i = 27; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = DateUtils.getDateKey(d);
            const isDone = habit.entries[key]?.status === 'completed';

            days.push(`
                <div style="aspect-ratio: 1; border-radius: 4px; background: ${isDone ? habit.color : 'var(--bg-level-3)'}; opacity: ${isDone ? 1 : 0.3}; font-size: 10px; display: flex; align-items: center; justify-content: center;">
                   ${d.getDate()}
                </div>
            `);
        }
        return days.join('');
    }

    afterRender() {
        this.find('#back-btn').addEventListener('click', () => Router.navigate('/'));

        this.find('#delete-btn').addEventListener('click', () => {
            if (confirm('Delete this habit permanently?')) {
                const habitId = store.get().currentHabitId;
                HabitService.deleteHabit(habitId);
                Router.navigate('/');
            }
        });
    }
}
