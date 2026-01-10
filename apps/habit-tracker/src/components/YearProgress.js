import { Component } from '../core/Component.js';
import { DateUtils } from '../utils/DateUtils.js';

export class YearProgress extends Component {
    template() {
        return `
            <div class="year-progress-component" style="padding: 16px;">
                 <h2 style="font-size: 1rem; margin-bottom: 12px; font-weight: 600;">Year Progress</h2>
                 <div style="display: grid; grid-template-columns: repeat(20, 1fr); gap: 4px; justify-content: center;">
                    ${this.renderDots()}
                 </div>
                 <div style="margin-top: 12px; font-size: 0.8rem; color: var(--text-secondary); text-align: center;">
                    ${this.getProgressText()}
                 </div>
            </div>
        `;
    }

    renderDots() {
        const dots = [];
        const today = new Date();
        const year = today.getFullYear();
        const start = new Date(year, 0, 1);
        const dayOfYear = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        const totalDays = 365; // Simplify leap year logic for now

        for (let i = 0; i < totalDays; i++) {
            const isPast = i < dayOfYear;
            const isToday = i === dayOfYear;
            let color = 'var(--bg-level-3)';
            if (isPast) color = 'var(--primary)';
            if (isToday) color = 'var(--warning)';

            dots.push(`
                <div style="width: 6px; height: 6px; border-radius: 50%; background: ${color}; opacity: ${isPast || isToday ? 1 : 0.3};"></div>
            `);
        }
        return dots.join('');
    }

    getProgressText() {
        const today = new Date();
        const start = new Date(today.getFullYear(), 0, 1);
        const diff = today - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        const percent = Math.round((day / 365) * 100);
        const remaining = 365 - day;
        return `${remaining} days left • ${percent}% complete`;
    }
}
