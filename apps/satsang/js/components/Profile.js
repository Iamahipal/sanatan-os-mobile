/**
 * Profile Component
 */
import { store } from '../store.js';

export function Profile() {
    const state = store.getState();
    const savedCount = state.savedEvents.length;
    // Mock following count for now
    const followingCount = 3;
    const registeredCount = 0;

    const container = document.createElement('div');
    container.className = 'profile-padding';

    container.innerHTML = `
        <div class="info-grid">
             <div class="info-item full-width" style="border: none; box-shadow: var(--shadow-1);">
                <div class="profile-avatar-sm">👤</div>
                <div>
                     <h3>Guest Devotee</h3>
                     <p>Sign in to sync your journey</p>
                </div>
                <button class="btn-secondary sm" style="margin-left: auto;">Login</button>
             </div>
        </div>

        <div class="profile-stats-row" style="background: #FFF; padding: 16px; border-radius: 16px; margin-bottom: 24px; justify-content: space-around;">
             <div class="stat-box">
                <span class="stat-num">${savedCount}</span>
                <span class="stat-lbl">Saved</span>
            </div>
             <div class="stat-box">
                <span class="stat-num">${registeredCount}</span>
                <span class="stat-lbl">Events</span>
            </div>
             <div class="stat-box">
                <span class="stat-num">${followingCount}</span>
                <span class="stat-lbl">Following</span>
            </div>
        </div>

        <div class="list-menu">
            <button class="menu-item-row">
                <i data-lucide="ticket"></i>
                <span>My Registrations</span>
                <i data-lucide="chevron-right" class="arrow"></i>
            </button>
            <button class="menu-item-row">
                <i data-lucide="heart-handshake"></i>
                <span>Donation History</span>
                 <i data-lucide="chevron-right" class="arrow"></i>
            </button>
             <button class="menu-item-row">
                <i data-lucide="settings"></i>
                <span>Settings</span>
                 <i data-lucide="chevron-right" class="arrow"></i>
            </button>
             <button class="menu-item-row">
                <i data-lucide="help-circle"></i>
                <span>Help & Support</span>
                 <i data-lucide="chevron-right" class="arrow"></i>
            </button>
        </div>
    `;

    // Styles removed - moved to style.css

    // Event Handlers
    container.querySelector('.btn-secondary.sm').onclick = () => {
        alert('Login functionality coming soon!');
    };

    return container;
}
