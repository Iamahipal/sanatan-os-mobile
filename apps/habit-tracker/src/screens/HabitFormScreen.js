import { Component } from '../core/Component.js';
import { HabitService } from '../services/HabitService.js';
import { Router } from '../core/Router.js';

export class HabitFormScreen extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            color: '#0A84FF',
            icon: 'sun'
        };
        this.colors = ['#0A84FF', '#FF453A', '#32D74B', '#FF9F0A', '#BF5AF2', '#64D2FF'];
    }

    template() {
        return `
            <div class="habit-form-screen" style="padding: 16px;">
                <header class="app-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <button id="cancel-btn" style="font-size: 1rem; color: var(--text-secondary);">Cancel</button>
                    <h1 style="font-size: 1.2rem; margin: 0;">New Habit</h1>
                    <button id="save-btn" style="font-size: 1rem; font-weight: 600; color: var(--primary);">Save</button>
                </header>

                <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: block; font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px;">Name</label>
                    <input type="text" id="habit-name" placeholder="e.g. Read Books" value="${this.state.name}"
                        style="width: 100%; padding: 16px; border-radius: 12px; border: 1px solid var(--bg-level-3); background: var(--bg-level-1); color: var(--text-primary); font-size: 1rem;">
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: block; font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px;">Color</label>
                    <div class="color-picker" style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;">
                        ${this.colors.map(c => `
                            <button class="color-swatch" data-color="${c}" 
                                style="width: 44px; height: 44px; border-radius: 50%; background: ${c}; 
                                       border: ${this.state.color === c ? '3px solid white' : 'none'};
                                       box-shadow: ${this.state.color === c ? '0 0 0 2px ' + c : 'none'};">
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Simpler Icon Text Input for now, fully picker later -->
                 <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: block; font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px;">Icon (Lucide Name)</label>
                    <input type="text" id="habit-icon" placeholder="e.g. book-open" value="${this.state.icon}"
                        style="width: 100%; padding: 16px; border-radius: 12px; border: 1px solid var(--bg-level-3); background: var(--bg-level-1); color: var(--text-primary); font-size: 1rem;">
                </div>
            </div>
        `;
    }

    afterRender() {
        // Name Input
        this.find('#habit-name').addEventListener('input', (e) => {
            this.state.name = e.target.value;
        });

        // Icon Input
        this.find('#habit-icon').addEventListener('input', (e) => {
            this.state.icon = e.target.value;
        });

        // Color Picker
        this.element.querySelectorAll('.color-swatch').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.state.color = e.target.dataset.color;
                this.update(); // Re-render to show selection
            });
        });

        // Save
        this.find('#save-btn').addEventListener('click', () => {
            if (!this.state.name) {
                alert('Please enter a name');
                return;
            }
            HabitService.createHabit(this.state.name, this.state.icon, this.state.color);
            Router.navigate('/');
        });

        // Cancel
        this.find('#cancel-btn').addEventListener('click', () => {
            Router.navigate('/');
        });
    }
}
