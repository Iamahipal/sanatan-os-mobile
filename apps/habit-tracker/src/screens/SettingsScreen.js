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
        const isDark = ThemeService.isDark();
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
                    
                    <!-- Appearance -->
                    <div class="form-section">
                        <div class="form-section-title">Appearance</div>
                        <div class="card">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-3">
                                    <div class="settings-icon-modern">
                                        <i data-lucide="${isDark ? 'moon' : 'sun'}"></i>
                                    </div>
                                    <span>Dark Mode</span>
                                </div>
                                <button id="theme-toggle" 
                                        class="toggle ${isDark ? 'active' : ''}"
                                        role="switch"
                                        aria-checked="${isDark}"
                                        aria-label="Toggle dark mode">
                                </button>
                            </div>
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
                <button id="signin-btn" class="btn btn-primary" style="width: 100%;">
                    <i data-lucide="user"></i>
                    Sign in with Google
                </button>
            </div>
        `;
    }

    afterRender() {
        // Back button
        this.on('#back-btn', 'click', () => Router.back());

        // Theme toggle
        this.on('#theme-toggle', 'click', (e) => {
            ThemeService.toggle();
            e.target.classList.toggle('active', ThemeService.isDark());
            e.target.setAttribute('aria-checked', ThemeService.isDark());
        });

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

        // Init icons
        if (window.lucide) {
            lucide.createIcons();
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
