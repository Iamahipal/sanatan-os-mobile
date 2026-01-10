/**
 * HabitFormScreen - Add/Edit Habit
 * Form for creating and editing habits
 */

import { Component } from '../core/Component.js';
import { Store } from '../core/Store.js';
import { Router, navigate } from '../core/Router.js';
import { HabitService } from '../services/HabitService.js';
import { EventBus, Events } from '../core/EventBus.js';

const ICONS = [
    'sun', 'moon', 'star', 'heart', 'zap', 'flame', 'droplet', 'leaf',
    'flower-2', 'mountain', 'waves', 'cloud', 'coffee', 'apple',
    'dumbbell', 'bike', 'footprints', 'clock', 'book-open', 'pen-tool',
    'music', 'headphones', 'camera', 'palette', 'laptop', 'smartphone',
    'gamepad-2', 'target', 'trophy', 'medal', 'gift', 'sparkles', 'brain'
];

const COLORS = [
    '#007AFF', '#5856D6', '#AF52DE', '#FF2D55', '#FF3B30',
    '#FF9500', '#FFCC00', '#34C759', '#00C7BE', '#30B0C7',
    '#5AC8FA', '#8E8E93'
];

export class HabitFormScreen extends Component {
    constructor() {
        super();

        // Check if editing
        const editingId = Store.getProperty('editingHabitId');
        this.isEditing = !!editingId;
        this.habit = editingId ? HabitService.getById(editingId) : null;

        // Form state
        this.formData = {
            name: this.habit?.name || '',
            question: this.habit?.question || '',
            icon: this.habit?.icon || 'sun',
            color: this.habit?.color || COLORS[0],
            type: this.habit?.type || 'boolean',
            frequency: this.habit?.frequency?.type || 'everyday',
            specificDays: this.habit?.frequency?.days || [],
            target: this.habit?.target?.value || '',
            unit: this.habit?.target?.unit || '',
            reminder: this.habit?.reminder?.enabled || false,
            reminderTime: this.habit?.reminder?.time || '09:00'
        };
    }

    template() {
        const title = this.isEditing ? 'Edit Habit' : 'Add Habit';

        return `
            <div class="screen form-screen active">
                <header class="app-header">
                    <button id="back-btn" class="header-btn" aria-label="Go back">
                        <i data-lucide="chevron-left"></i>
                    </button>
                    <h1 class="header-title">${title}</h1>
                    <button id="save-btn" class="header-btn" style="color: var(--primary); font-weight: 600;">
                        Save
                    </button>
                </header>
                
                <main class="screen-content">
                    <!-- Name -->
                    <div class="form-section">
                        <div class="form-group">
                            <label class="form-label">Habit Name *</label>
                            <input type="text" 
                                   id="habit-name" 
                                   class="form-input" 
                                   placeholder="e.g., Morning Meditation"
                                   value="${this.formData.name}"
                                   maxlength="50"
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Daily Question (optional)</label>
                            <input type="text" 
                                   id="habit-question" 
                                   class="form-input" 
                                   placeholder="e.g., Did you meditate today?"
                                   value="${this.formData.question}"
                                   maxlength="100">
                        </div>
                    </div>
                    
                    <!-- Icon -->
                    <div class="form-section">
                        <div class="form-section-title">Icon</div>
                        <div class="icon-picker" id="icon-picker">
                            ${ICONS.map(icon => `
                                <button type="button" 
                                        class="icon-option ${icon === this.formData.icon ? 'active' : ''}" 
                                        data-icon="${icon}"
                                        aria-label="Select ${icon} icon">
                                    <i data-lucide="${icon}"></i>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Color -->
                    <div class="form-section">
                        <div class="form-section-title">Color</div>
                        <div class="color-picker" id="color-picker">
                            ${COLORS.map(color => `
                                <button type="button" 
                                        class="color-swatch ${color === this.formData.color ? 'active' : ''}" 
                                        data-color="${color}"
                                        style="background: ${color}"
                                        aria-label="Select color ${color}">
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Frequency -->
                    <div class="form-section">
                        <div class="form-section-title">Frequency</div>
                        <div class="card" style="padding: 0;">
                            <label class="settings-item" style="border-bottom: 1px solid var(--border-default);">
                                <span>Every Day</span>
                                <input type="radio" name="frequency" value="everyday" 
                                       ${this.formData.frequency === 'everyday' ? 'checked' : ''}>
                            </label>
                            <label class="settings-item" style="border-bottom: 1px solid var(--border-default);">
                                <span>Specific Days</span>
                                <input type="radio" name="frequency" value="specific"
                                       ${this.formData.frequency === 'specific' ? 'checked' : ''}>
                            </label>
                            <label class="settings-item">
                                <span>X Times per Week</span>
                                <input type="radio" name="frequency" value="x_per_week"
                                       ${this.formData.frequency === 'x_per_week' ? 'checked' : ''}>
                            </label>
                        </div>
                        
                        <!-- Specific Days (hidden by default) -->
                        <div id="specific-days" class="mt-4" style="display: ${this.formData.frequency === 'specific' ? 'block' : 'none'}">
                            <div class="flex gap-2">
                                ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => `
                                    <button type="button" 
                                            class="btn btn-secondary day-btn ${this.formData.specificDays.includes(i) ? 'active' : ''}"
                                            data-day="${i}"
                                            style="flex: 1; padding: 8px;">
                                        ${day}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Reminder -->
                    <div class="form-section">
                        <div class="form-section-title">Reminder</div>
                        <div class="card">
                            <div class="flex justify-between items-center">
                                <span>Daily Reminder</span>
                                <button type="button" 
                                        id="reminder-toggle" 
                                        class="toggle ${this.formData.reminder ? 'active' : ''}"
                                        role="switch"
                                        aria-checked="${this.formData.reminder}">
                                </button>
                            </div>
                            
                            <div id="reminder-time-row" class="mt-4" style="display: ${this.formData.reminder ? 'block' : 'none'}">
                                <input type="time" 
                                       id="reminder-time" 
                                       class="form-input"
                                       value="${this.formData.reminderTime}">
                            </div>
                        </div>
                    </div>
                    
                    ${this.isEditing ? `
                        <div class="form-section" style="margin-top: 32px;">
                            <button type="button" id="delete-btn" class="btn btn-ghost" style="color: var(--danger); width: 100%;">
                                <i data-lucide="trash-2"></i>
                                Delete Habit
                            </button>
                        </div>
                    ` : ''}
                </main>
            </div>
        `;
    }

    afterRender() {
        // Back button
        this.on('#back-btn', 'click', () => Router.back());

        // Save button
        this.on('#save-btn', 'click', () => this.save());

        // Name input
        this.on('#habit-name', 'input', (e) => {
            this.formData.name = e.target.value;
        });

        // Question input
        this.on('#habit-question', 'input', (e) => {
            this.formData.question = e.target.value;
        });

        // Icon selection
        this.delegate('click', '.icon-option', (e, el) => {
            this.formData.icon = el.dataset.icon;
            this.findAll('.icon-option').forEach(opt => opt.classList.remove('active'));
            el.classList.add('active');
        });

        // Color selection
        this.delegate('click', '.color-swatch', (e, el) => {
            this.formData.color = el.dataset.color;
            this.findAll('.color-swatch').forEach(opt => opt.classList.remove('active'));
            el.classList.add('active');
        });

        // Frequency radio
        this.delegate('change', 'input[name="frequency"]', (e) => {
            this.formData.frequency = e.target.value;
            const specificDays = this.find('#specific-days');
            specificDays.style.display = e.target.value === 'specific' ? 'block' : 'none';
        });

        // Day buttons
        this.delegate('click', '.day-btn', (e, el) => {
            const day = parseInt(el.dataset.day);
            const index = this.formData.specificDays.indexOf(day);
            if (index > -1) {
                this.formData.specificDays.splice(index, 1);
                el.classList.remove('active');
            } else {
                this.formData.specificDays.push(day);
                el.classList.add('active');
            }
        });

        // Reminder toggle
        this.on('#reminder-toggle', 'click', (e) => {
            this.formData.reminder = !this.formData.reminder;
            e.target.classList.toggle('active', this.formData.reminder);
            e.target.setAttribute('aria-checked', this.formData.reminder);
            this.find('#reminder-time-row').style.display = this.formData.reminder ? 'block' : 'none';
        });

        // Reminder time
        const timeInput = this.find('#reminder-time');
        if (timeInput) {
            timeInput.addEventListener('change', (e) => {
                this.formData.reminderTime = e.target.value;
            });
        }

        // Delete button
        const deleteBtn = this.find('#delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.delete());
        }

        // Init icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    save() {
        const name = this.formData.name.trim();

        if (!name) {
            EventBus.emit(Events.TOAST_SHOW, { message: 'Please enter a habit name' });
            this.find('#habit-name')?.focus();
            return;
        }

        const habitData = {
            name,
            question: this.formData.question.trim() || `Did you ${name.toLowerCase()} today?`,
            icon: this.formData.icon,
            color: this.formData.color,
            type: this.formData.type,
            frequency: {
                type: this.formData.frequency,
                days: this.formData.frequency === 'specific' ? this.formData.specificDays : null
            },
            reminder: {
                enabled: this.formData.reminder,
                time: this.formData.reminderTime
            }
        };

        if (this.isEditing && this.habit) {
            HabitService.update(this.habit.id, habitData);
            EventBus.emit(Events.TOAST_SHOW, { message: 'Habit updated!' });
        } else {
            HabitService.create(habitData);
            EventBus.emit(Events.TOAST_SHOW, { message: 'Habit created!' });
        }

        // Clear editing state
        Store.set('editingHabitId', null);
        navigate('/');
    }

    delete() {
        if (!this.habit) return;

        if (confirm(`Delete "${this.habit.name}"? This cannot be undone.`)) {
            HabitService.delete(this.habit.id);
            Store.set('editingHabitId', null);
            EventBus.emit(Events.TOAST_SHOW, { message: 'Habit deleted' });
            navigate('/');
        }
    }
}
