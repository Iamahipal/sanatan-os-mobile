import { Component } from '../core/Component.js';
import { store } from '../core/Store.js';
import { HabitCard } from '../components/HabitCard.js';
import { YearProgress } from '../components/YearProgress.js';
import { QuoteService } from '../services/QuoteService.js';

export class DashboardScreen extends Component {
    template() {
        const quote = QuoteService.getDailyQuote();

        return `
            <div class="dashboard-screen">
                <header class="app-header" style="background: var(--bg-level-0); padding: 16px;">
                    <div class="flex justify-between items-center">
                        <div>
                            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary);">
                                ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </div>
                            <h1 style="font-size: 1.8rem; font-weight: 700;">My Habits</h1>
                        </div>
                        <button id="year-progress-btn" class="header-btn" style="margin-right: 8px; width: 32px; height: 32px; border-radius: 50%; border: none; background: var(--bg-level-2); display: flex; align-items: center; justify-content: center;">
                             📅
                        </button>
                        <button id="settings-btn" class="avatar" style="width: 32px; height: 32px; background: var(--bg-level-2); border-radius: 50%; border: none; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                             ⚙️
                        </button>
                    </div>
                </header>
                
                <div id="year-progress-container" style="display: none; background: var(--bg-level-1); border-radius: 12px; margin: 0 16px 16px 16px;">
                    <!-- YearProgress component rendered here -->
                </div>

                <!-- Daily Prana -->
                <div class="card" style="margin: 16px; background: linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%); color: white; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-family: 'Tiro Devanagari Sanskrit', serif; font-size: 1.1rem; margin-bottom: 8px;">
                        ${quote.sanskrit}
                    </div>
                    <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 12px;">
                        ${quote.english}
                    </div>
                    <div style="font-size: 0.75rem; opacity: 0.5;">
                        — ${quote.source}
                    </div>
                </div>

                <main style="flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 100px;">
                    <div id="habit-list-container" style="display: flex; flex-direction: column; gap: 16px;">
                        <!-- Habits rendered here -->
                    </div>
                </main>
                
                <button id="add-fab" class="btn-primary" 
                    style="position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: var(--shadow-md);">
                    +
                </button>
            </div>
        `;
    }

    afterRender() {
        const container = this.find('#habit-list-container');

        // Subscription
        this.unsubscribe = store.subscribe('habits', (habits) => {
            this.renderHabits(habits, container);
        });

        // Year Progress Toggle
        const ypContainer = this.find('#year-progress-container');
        const ypComponent = new YearProgress();
        ypContainer.innerHTML = ypComponent.template(); // Simple render for now

        this.find('#year-progress-btn').addEventListener('click', () => {
            const isHidden = ypContainer.style.display === 'none';
            ypContainer.style.display = isHidden ? 'block' : 'none';
        });

        // Settings Button
        this.find('#settings-btn').addEventListener('click', () => {
            import('../core/Router.js').then(({ Router }) => {
                Router.navigate('/settings');
            });
        });

        // Initial Render
        const { habits } = store.get();
        this.renderHabits(habits, container);

        // Add Button
        this.find('#add-fab').addEventListener('click', () => {
            import('../core/Router.js').then(({ Router }) => {
                Router.navigate('/add-habit');
            });
        });
    }

    async renderHabits(habits, container) {
        if (!container) return;
        container.innerHTML = '';

        if (habits.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 48px 0; color: var(--text-secondary);">
                    <div style="font-size: 48px; margin-bottom: 16px;">✨</div>
                    <p>No habits yet. Create your first one!</p>
                </div>
            `;
            return;
        }

        // Create instances of HabitCard
        for (const habit of habits) {
            const card = new HabitCard(habit);
            const element = card.render();

            // Add click listener for details
            element.addEventListener('click', () => {
                store.set('currentHabitId', habit.id);
                // Dynamically import router again if needed or rely on global/module scope
                import('../core/Router.js').then(({ Router }) => {
                    Router.navigate('/habit-details');
                });
            });

            container.appendChild(element);
        }
    }
}
