import { Component } from '../core/Component.js';
import { HabitService } from '../services/HabitService.js';
import { DateUtils } from '../utils/DateUtils.js';

export class HabitCard extends Component {
    constructor(habit) {
        super();
        this.habit = habit;
    }

    template() {
        const streak = HabitService.calculateStreak(this.habit);
        const todayKey = DateUtils.getDateKey(new Date());
        const isCompletedToday = this.habit.entries[todayKey]?.status === 'completed';

        return `
            <div class="habit-card" style="border-left: 4px solid ${this.habit.color}; flex-shrink: 0; min-height: 100px;">
                <div class="habit-header">
                    <div class="flex items-center">
                        <div class="habit-icon" style="background: ${this.habit.color}">
                            <span>${this.habit.icon.charAt(0).toUpperCase()}</span> 
                        </div>
                        <div>
                            <h3 style="font-size: 1.1rem; font-weight: 600;">${this.habit.name}</h3>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">
                                ${streak > 0 ? `🔥 ${streak} day streak` : 'Start your streak!'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="habit-actions">
                        <button class="action-btn toggle-btn btn-icon" 
                            style="background: ${isCompletedToday ? this.habit.color : 'var(--bg-level-2)'}; 
                                   color: ${isCompletedToday ? 'white' : 'var(--text-secondary)'}"
                            aria-label="Toggle habit">
                            ${isCompletedToday ? '✓' : '○'}
                        </button>
                    </div>
                </div>
                
                <div class="heatmap-grid" style="color: ${this.habit.color}">
                    ${this.renderHeatmap()}
                </div>
            </div>
        `;
    }

    renderHeatmap() {
        const grid = [];
        const today = new Date();
        for (let i = 51; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = DateUtils.getDateKey(d);
            const entry = this.habit.entries[key];
            const isActive = entry?.status === 'completed';

            grid.push(`<div class="grid-cell ${isActive ? 'active' : ''}" title="${key}"></div>`);
        }
        return grid.join('');
    }

    afterRender() {
        const btn = this.find('.toggle-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleToggle();
            });
        }
    }

    handleToggle() {
        const today = new Date();
        HabitService.toggleHabit(this.habit.id, today);
    }
}
