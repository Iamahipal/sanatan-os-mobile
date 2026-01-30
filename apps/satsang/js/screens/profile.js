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

    container.innerHTML = `
        <div class="profile-screen">
            <!-- User Profile Card -->
            <div class="profile-card">
                <div class="profile-card__avatar">
                    <i data-lucide="user"></i>
                </div>
                <div class="profile-card__info">
                    <h2 class="profile-card__name">Guest User</h2>
                    <p class="profile-card__subtitle">Tap to sign in for a personalized experience</p>
                </div>
                <button class="btn btn--primary btn--sm profile-card__action">
                    Sign In
                </button>
            </div>
            
            <!-- Quick Stats -->
            <div class="profile-stats">
                <div class="profile-stats__item">
                    <span class="profile-stats__value">${savedCount}</span>
                    <span class="profile-stats__label">Saved</span>
                </div>
                <div class="profile-stats__item">
                    <span class="profile-stats__value">0</span>
                    <span class="profile-stats__label">Attended</span>
                </div>
                <div class="profile-stats__item">
                    <span class="profile-stats__value">${state.userLocation}</span>
                    <span class="profile-stats__label">Location</span>
                </div>
            </div>
            
            <!-- Settings Sections -->
            <div class="settings-section">
                <h3 class="settings-section__title">Preferences</h3>
                <div class="menu-list menu-list--rounded">
                    <button class="menu-item" id="locationSettingBtn">
                        <div class="menu-item__icon menu-item__icon--primary">
                            <i data-lucide="map-pin"></i>
                        </div>
                        <div class="menu-item__content">
                            <span class="menu-item__label">Location</span>
                            <span class="menu-item__value">${state.userLocation}</span>
                        </div>
                        <i data-lucide="chevron-right" class="menu-item__arrow"></i>
                    </button>
                    
                    <button class="menu-item">
                        <div class="menu-item__icon menu-item__icon--warning">
                            <i data-lucide="bell"></i>
                        </div>
                        <div class="menu-item__content">
                            <span class="menu-item__label">Notifications</span>
                            <span class="menu-item__value">On</span>
                        </div>
                        <i data-lucide="chevron-right" class="menu-item__arrow"></i>
                    </button>
                    
                    <button class="menu-item">
                        <div class="menu-item__icon menu-item__icon--info">
                            <i data-lucide="globe"></i>
                        </div>
                        <div class="menu-item__content">
                            <span class="menu-item__label">Language</span>
                            <span class="menu-item__value">हिंदी</span>
                        </div>
                        <i data-lucide="chevron-right" class="menu-item__arrow"></i>
                    </button>
                </div>
            </div>
            
            <div class="settings-section">
                <h3 class="settings-section__title">Support</h3>
                <div class="menu-list menu-list--rounded">
                    <button class="menu-item">
                        <div class="menu-item__icon">
                            <i data-lucide="help-circle"></i>
                        </div>
                        <span class="menu-item__label">Help & FAQ</span>
                        <i data-lucide="chevron-right" class="menu-item__arrow"></i>
                    </button>
                    
                    <button class="menu-item">
                        <div class="menu-item__icon">
                            <i data-lucide="message-circle"></i>
                        </div>
                        <span class="menu-item__label">Contact Us</span>
                        <i data-lucide="chevron-right" class="menu-item__arrow"></i>
                    </button>
                    
                    <button class="menu-item">
                        <div class="menu-item__icon">
                            <i data-lucide="star"></i>
                        </div>
                        <span class="menu-item__label">Rate App</span>
                        <i data-lucide="chevron-right" class="menu-item__arrow"></i>
                    </button>
                </div>
            </div>
            
            <div class="settings-section">
                <h3 class="settings-section__title">About</h3>
                <div class="menu-list menu-list--rounded">
                    <button class="menu-item">
                        <div class="menu-item__icon">
                            <i data-lucide="info"></i>
                        </div>
                        <span class="menu-item__label">About Satsang</span>
                        <i data-lucide="chevron-right" class="menu-item__arrow"></i>
                    </button>
                    
                    <button class="menu-item">
                        <div class="menu-item__icon">
                            <i data-lucide="shield"></i>
                        </div>
                        <span class="menu-item__label">Privacy Policy</span>
                        <i data-lucide="chevron-right" class="menu-item__arrow"></i>
                    </button>
                </div>
            </div>
            
            <!-- App Info Footer -->
            <div class="profile-footer">
                <p class="profile-footer__version">Satsang v2.0</p>
                <p class="profile-footer__credit">Made with 🕉️ in Bharat</p>
            </div>
        </div>
    `;
}
