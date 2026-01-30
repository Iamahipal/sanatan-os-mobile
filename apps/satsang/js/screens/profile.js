/**
 * Satsang App v2 - Profile Screen Renderer
 */

import { store } from '../store.js';

/**
 * Render User Profile Screen
 * @param {Object} state - App state
 */
export function renderProfile(state) {
    const container = document.getElementById('userProfileContainer');
    if (!container) return;

    const savedCount = state.savedEvents.length;
    const reminderCount = Object.keys(state.eventReminders || {}).length;

    container.innerHTML = `
        <div class="profile-screen">
            <!-- User Profile Card -->
            <div class="profile-hero">
                <div class="profile-hero__avatar">
                    <i data-lucide="user"></i>
                </div>
                <h2 class="profile-hero__name">Guest User</h2>
                <p class="profile-hero__subtitle">Sign in for personalized experience</p>
                <button class="btn btn--primary btn--sm">
                    <i data-lucide="log-in"></i>
                    Sign In
                </button>
            </div>
            
            <!-- Quick Stats Grid -->
            <div class="profile-stats-grid">
                <div class="profile-stat-card" data-action="goto-saved">
                    <div class="profile-stat-card__icon">
                        <i data-lucide="heart"></i>
                    </div>
                    <div class="profile-stat-card__content">
                        <span class="profile-stat-card__value">${savedCount}</span>
                        <span class="profile-stat-card__label">Saved</span>
                    </div>
                </div>
                <div class="profile-stat-card">
                    <div class="profile-stat-card__icon profile-stat-card__icon--bell">
                        <i data-lucide="bell"></i>
                    </div>
                    <div class="profile-stat-card__content">
                        <span class="profile-stat-card__value">${reminderCount}</span>
                        <span class="profile-stat-card__label">Reminders</span>
                    </div>
                </div>
            </div>
            
            <!-- Settings Card -->
            <div class="settings-card">
                <h3 class="settings-card__title">Preferences</h3>
                
                <button class="settings-row" id="locationSettingBtn">
                    <div class="settings-row__icon settings-row__icon--primary">
                        <i data-lucide="map-pin"></i>
                    </div>
                    <div class="settings-row__content">
                        <span class="settings-row__label">Location</span>
                        <span class="settings-row__value">${state.userLocation}</span>
                    </div>
                    <i data-lucide="chevron-right" class="settings-row__arrow"></i>
                </button>
                
                <button class="settings-row">
                    <div class="settings-row__icon settings-row__icon--amber">
                        <i data-lucide="bell"></i>
                    </div>
                    <div class="settings-row__content">
                        <span class="settings-row__label">Notifications</span>
                        <span class="settings-row__value">On</span>
                    </div>
                    <i data-lucide="chevron-right" class="settings-row__arrow"></i>
                </button>
                
                <button class="settings-row">
                    <div class="settings-row__icon settings-row__icon--blue">
                        <i data-lucide="globe"></i>
                    </div>
                    <div class="settings-row__content">
                        <span class="settings-row__label">Language</span>
                        <span class="settings-row__value">हिंदी</span>
                    </div>
                    <i data-lucide="chevron-right" class="settings-row__arrow"></i>
                </button>
            </div>
            
            <!-- Support Card -->
            <div class="settings-card">
                <h3 class="settings-card__title">Support</h3>
                
                <button class="settings-row">
                    <div class="settings-row__icon">
                        <i data-lucide="help-circle"></i>
                    </div>
                    <span class="settings-row__label">Help & FAQ</span>
                    <i data-lucide="chevron-right" class="settings-row__arrow"></i>
                </button>
                
                <button class="settings-row">
                    <div class="settings-row__icon">
                        <i data-lucide="message-circle"></i>
                    </div>
                    <span class="settings-row__label">Contact Us</span>
                    <i data-lucide="chevron-right" class="settings-row__arrow"></i>
                </button>
                
                <button class="settings-row">
                    <div class="settings-row__icon">
                        <i data-lucide="star"></i>
                    </div>
                    <span class="settings-row__label">Rate App</span>
                    <i data-lucide="external-link" class="settings-row__arrow"></i>
                </button>
            </div>
            
            <!-- About Card -->
            <div class="settings-card">
                <h3 class="settings-card__title">About</h3>
                
                <button class="settings-row">
                    <div class="settings-row__icon">
                        <i data-lucide="info"></i>
                    </div>
                    <span class="settings-row__label">About Satsang</span>
                    <i data-lucide="chevron-right" class="settings-row__arrow"></i>
                </button>
                
                <button class="settings-row">
                    <div class="settings-row__icon">
                        <i data-lucide="shield"></i>
                    </div>
                    <span class="settings-row__label">Privacy Policy</span>
                    <i data-lucide="chevron-right" class="settings-row__arrow"></i>
                </button>
                
                <div class="settings-row settings-row--static">
                    <div class="settings-row__icon">
                        <i data-lucide="package"></i>
                    </div>
                    <span class="settings-row__label">Version</span>
                    <span class="settings-row__value">2.0.0</span>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="profile-footer">
                <p>Made with 🙏 in Bharat</p>
            </div>
        </div>
    `;
}
