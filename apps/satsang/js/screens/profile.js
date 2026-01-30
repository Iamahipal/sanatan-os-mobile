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
        <div class="user-profile">
            <!-- User Header -->
            <div class="user-header">
                <div class="avatar avatar--xl user-header__avatar" style="background: var(--color-primary-container); color: var(--color-primary);">
                    <i data-lucide="user" style="width: 40px; height: 40px;"></i>
                </div>
                <h2 class="user-header__name">Guest User</h2>
                <p class="user-header__email">Tap to sign in</p>
            </div>
            
            <!-- Menu List -->
            <div class="menu-list">
                <button class="menu-item">
                    <div class="menu-item__icon">
                        <i data-lucide="heart"></i>
                    </div>
                    <span class="menu-item__label">Saved Events</span>
                    <span style="color: var(--color-on-surface-variant); font-size: var(--text-sm);">${savedCount}</span>
                    <div class="menu-item__arrow">
                        <i data-lucide="chevron-right"></i>
                    </div>
                </button>
                
                <button class="menu-item">
                    <div class="menu-item__icon">
                        <i data-lucide="map-pin"></i>
                    </div>
                    <span class="menu-item__label">Location</span>
                    <span style="color: var(--color-on-surface-variant); font-size: var(--text-sm);">${state.userLocation}</span>
                    <div class="menu-item__arrow">
                        <i data-lucide="chevron-right"></i>
                    </div>
                </button>
                
                <button class="menu-item">
                    <div class="menu-item__icon">
                        <i data-lucide="bell"></i>
                    </div>
                    <span class="menu-item__label">Notifications</span>
                    <div class="menu-item__arrow">
                        <i data-lucide="chevron-right"></i>
                    </div>
                </button>
                
                <button class="menu-item">
                    <div class="menu-item__icon">
                        <i data-lucide="settings"></i>
                    </div>
                    <span class="menu-item__label">Settings</span>
                    <div class="menu-item__arrow">
                        <i data-lucide="chevron-right"></i>
                    </div>
                </button>
            </div>
            
            <!-- Secondary Menu -->
            <div class="menu-list" style="margin-top: var(--space-4);">
                <button class="menu-item">
                    <div class="menu-item__icon">
                        <i data-lucide="help-circle"></i>
                    </div>
                    <span class="menu-item__label">Help & Support</span>
                    <div class="menu-item__arrow">
                        <i data-lucide="chevron-right"></i>
                    </div>
                </button>
                
                <button class="menu-item">
                    <div class="menu-item__icon">
                        <i data-lucide="info"></i>
                    </div>
                    <span class="menu-item__label">About</span>
                    <div class="menu-item__arrow">
                        <i data-lucide="chevron-right"></i>
                    </div>
                </button>
            </div>
            
            <!-- Version -->
            <p style="text-align: center; margin-top: var(--space-6); font-size: var(--text-xs); color: var(--color-on-surface-variant);">
                Satsang v2.0 • Made with 🕉️
            </p>
        </div>
    `;
}
