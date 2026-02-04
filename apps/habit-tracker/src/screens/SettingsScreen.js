/**
 * SettingsScreen - App Settings
 * Theme, data management, and account
 */

import { Component } from '../core/Component.js';
import { Store } from '../core/Store.js';
import { Router, navigate } from '../core/Router.js';
import { StorageService } from '../services/StorageService.js';
import { ThemeService } from '../services/ThemeService.js';
import { EventBus, Events } from '../core/EventBus.js';

export class SettingsScreen extends Component {
    template() {

        const user = Store.getProperty('user');

        return `
            <div class="screen settings-screen active">
                <header class="app-header">
                    <button id="back-btn" class="header-btn" aria-label="Go back">
                        <i data-lucide="chevron-left"></i>
                    </button>
                    <h1 class="header-title">Settings</h1>
                    <div style="width: 40px;"></div>
                </header>
                
                <main class="screen-content">
                    <!-- Account (now at top) -->
                    <div class="form-section">
                        <div class="form-section-title">Account</div>
                        <div class="card" id="account-section">
                            ${user ? this.renderSignedIn(user) : this.renderSignedOut()}
                        </div>
                    </div>
                    

                    
                    <!-- Data Management -->
                    <div class="form-section">
                        <div class="form-section-title">Data Management</div>
                        <div class="settings-list">
                            <button id="export-btn" class="settings-item">
                                <div class="settings-item-left">
                                    <div class="settings-icon-modern export">
                                        <i data-lucide="download"></i>
                                    </div>
                                    <span>Export Data</span>
                                </div>
                                <i data-lucide="chevron-right"></i>
                            </button>
                            
                            <button id="import-btn" class="settings-item">
                                <div class="settings-item-left">
                                    <div class="settings-icon-modern import">
                                        <i data-lucide="upload"></i>
                                    </div>
                                    <span>Import Data</span>
                                </div>
                                <i data-lucide="chevron-right"></i>
                            </button>
                            
                            <button id="reset-btn" class="settings-item settings-danger">
                                <div class="settings-item-left">
                                    <div class="settings-icon-modern danger">
                                        <i data-lucide="trash-2"></i>
                                    </div>
                                    <span style="color: var(--danger);">Reset All Data</span>
                                </div>
                                <i data-lucide="chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- About -->
                    <div class="form-section">
                        <div class="form-section-title">About</div>
                        <div class="settings-list">
                            <a href="https://sanatan.app" target="_blank" class="settings-item">
                                <div class="settings-item-left">
                                    <div class="settings-icon-modern about">
                                        <i data-lucide="globe"></i>
                                    </div>
                                    <span>Sanatan OS</span>
                                </div>
                                <i data-lucide="external-link"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div class="app-version">
                        Niyam v2.1.0<br>
                        Made with 🙏 for Sanatan OS
                    </div>
                </main>
                
                <!-- Hidden file input for import -->
                <input type="file" id="import-input" accept=".json" style="display: none;">
            </div>
        `;
    }

    renderSignedIn(user) {
        return `
            <div class="flex items-center gap-3" style="margin-bottom: 16px;">
                <img src="${user.photoURL || ''}" 
                     alt="Profile"
                     style="width: 40px; height: 40px; border-radius: 50%; background: var(--bg-level-2);">
                <div>
                    <div style="font-weight: 600;">${user.displayName || 'User'}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${user.email}</div>
                </div>
            </div>
            <button id="signout-btn" class="btn btn-secondary" style="width: 100%;">
                Sign Out
            </button>
        `;
    }

    renderSignedOut() {
        return `
            <div style="text-align: center; padding: 16px 0;">
                <p style="color: var(--text-secondary); margin-bottom: 16px;">
                    Sign in to sync your habits across devices
                </p>
                <button id="signin-btn" class="btn btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                </button>
            </div>
        `;
    }

    afterRender() {
        // Back button - always go to dashboard
        this.on('#back-btn', 'click', () => navigate('/'));



        // Export
        this.on('#export-btn', 'click', () => this.exportData());

        // Import
        this.on('#import-btn', 'click', () => {
            this.find('#import-input').click();
        });

        this.on('#import-input', 'change', (e) => this.importData(e));

        // Reset
        this.on('#reset-btn', 'click', () => this.resetData());

        // Sign in/out
        const signinBtn = this.find('#signin-btn');
        if (signinBtn) {
            signinBtn.addEventListener('click', () => this.signIn());
        }

        const signoutBtn = this.find('#signout-btn');
        if (signoutBtn) {
            signoutBtn.addEventListener('click', () => this.signOut());
        }

        // Init icons with delay for proper rendering
        if (window.lucide) {
            setTimeout(() => lucide.createIcons(), 50);
        }
    }

    exportData() {
        const json = StorageService.export();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `niyam-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();

        URL.revokeObjectURL(url);
        EventBus.emit(Events.TOAST_SHOW, { message: 'Data exported!' });
    }

    importData(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const success = StorageService.import(event.target.result);
            if (success) {
                EventBus.emit(Events.TOAST_SHOW, { message: 'Data imported! Reloading...' });
                setTimeout(() => location.reload(), 1500);
            } else {
                EventBus.emit(Events.TOAST_SHOW, { message: 'Import failed. Invalid file.' });
            }
        };
        reader.readAsText(file);

        // Reset input
        e.target.value = '';
    }

    resetData() {
        if (confirm('⚠️ This will DELETE ALL your habits and data. This cannot be undone!\n\nAre you sure?')) {
            if (confirm('Really delete everything?')) {
                StorageService.clear();
                Store.reset();
                EventBus.emit(Events.TOAST_SHOW, { message: 'All data cleared. Reloading...' });
                setTimeout(() => location.reload(), 1500);
            }
        }
    }

    signIn() {
        // Firebase auth would go here
        EventBus.emit(Events.TOAST_SHOW, { message: 'Sign in coming soon!' });
    }

    signOut() {
        Store.set('user', null);
        this.update();
        EventBus.emit(Events.TOAST_SHOW, { message: 'Signed out' });
    }
}
