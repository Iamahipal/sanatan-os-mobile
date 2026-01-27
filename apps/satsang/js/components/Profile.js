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
        <div class="organizer-card" style="margin-bottom: 24px; background: var(--md-sys-color-surface-container-low); border: none;">
            <div class="organizer-info" style="display:flex; align-items:center; gap:16px;">
                <div class="profile-avatar-sm" style="background:var(--md-sys-color-surface-variant); color:var(--md-sys-color-on-surface-variant);">👤</div>
                <div>
                     <h3 style="margin:0; font-size:1.1rem; color:var(--md-sys-color-on-surface); font-weight:600;">Guest Devotee</h3>
                     <p style="margin:4px 0 0; font-size:0.9rem; color:var(--md-sys-color-on-surface-variant);">Sign in to sync your journey</p>
                </div>
            </div>
            <button class="btn-secondary sm" style="height:36px; padding:0 16px;">Login</button>
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
