/**
 * Satsang App v3 - Profile Screen Renderer
 */

import { store } from '../store.js';
import { getNotificationPermission, requestNotificationPermission } from '../services/notifications.js';
import { getCurrentUser, showLoginModal, signOut, isLoggedIn, loadUserSession } from '../services/auth.js';

// Load user session on module load
loadUserSession();

/**
 * Render User Profile Screen
 * @param {Object} state - App state
 */
export function renderProfile(state) {
    const container = document.getElementById('userProfileContainer');
    if (!container) return;

    const savedCount = state.savedEvents.length;
    const reminderCount = Object.keys(state.eventReminders || {}).length;
    const notifPermission = getNotificationPermission();
    const notifStatus = notifPermission === 'granted' ? 'On' :
        notifPermission === 'denied' ? 'Blocked' : 'Off';

    const user = getCurrentUser();
    const loggedIn = isLoggedIn();

    container.innerHTML = `
        <div class="profile-screen">
            <!-- User Profile Card -->
            <div class="profile-hero">
                <div class="profile-hero__avatar">
                    <i data-lucide="${loggedIn ? 'user-check' : 'user'}"></i>
                </div>
                <h2 class="profile-hero__name">${loggedIn ? (user.name || user.phone) : 'Guest User'}</h2>
                <p class="profile-hero__subtitle">${loggedIn ? 'Welcome back!' : 'Sign in for personalized experience'}</p>
                ${loggedIn ? `
                    <button class="btn btn--outline btn--sm" id="signOutBtn">
                        <i data-lucide="log-out"></i>
                        Sign Out
                    </button>
                ` : `
                    <button class="btn btn--primary btn--sm" id="signInBtn">
                        <i data-lucide="log-in"></i>
                        Sign In
                    </button>
                `}
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
                <div class="profile-stat-card" id="donateCardBtn">
                    <div class="profile-stat-card__icon profile-stat-card__icon--donate">
                        <i data-lucide="hand-heart"></i>
                    </div>
                    <div class="profile-stat-card__content">
                        <span class="profile-stat-card__value">🙏</span>
                        <span class="profile-stat-card__label">Donate</span>
                    </div>
                </div>
            </div>
            
            <!-- App Settings Card -->
            <div class="settings-card">
                <h3 class="settings-card__title">App</h3>
                
                <button class="settings-row" id="installAppBtn" style="display: none;">
                    <div class="settings-row__icon settings-row__icon--green">
                        <i data-lucide="download"></i>
                    </div>
                    <div class="settings-row__content">
                        <span class="settings-row__label">Install App</span>
                        <span class="settings-row__value">Add to Home Screen</span>
                    </div>
                    <i data-lucide="chevron-right" class="settings-row__arrow"></i>
                </button>
                
                <button class="settings-row" id="enableNotificationsBtn">
                    <div class="settings-row__icon settings-row__icon--amber">
                        <i data-lucide="bell"></i>
                    </div>
                    <div class="settings-row__content">
                        <span class="settings-row__label">Notifications</span>
                        <span class="settings-row__value">${notifStatus}</span>
                    </div>
                    <i data-lucide="${notifPermission === 'granted' ? 'check-circle' : 'chevron-right'}" class="settings-row__arrow"></i>
                </button>
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
