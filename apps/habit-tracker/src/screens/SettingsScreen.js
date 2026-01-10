import { Component } from '../core/Component.js';
import { Router } from '../core/Router.js';
import { store } from '../core/Store.js';
import { StorageService } from '../services/StorageService.js';
import { AuthService } from '../services/AuthService.js';

export class SettingsScreen extends Component {
    template() {
        // We'll read the store state locally or trust the component to re-render on changes
        const { theme } = store.get();
        // Simple logic for toggle state
        const isDark = theme === 'dark';

        return `
            <div class="settings-screen" style="padding: 16px;">
                <header class="app-header" style="margin-bottom: 24px; display: flex; align-items: center;">
                    <button id="back-btn" class="header-btn" style="margin-right: 16px;">
                        ←
                    </button>
                    <h1 style="font-size: 1.5rem; font-weight: 700;">Settings</h1>
                </header>

                <!-- Theme Section -->
                <div class="card">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                             <div class="btn-icon" style="background: var(--bg-level-2); margin-right: 12px;">
                                <span>🎨</span>
                             </div>
                             <span>Dark Mode</span>
                        </div>
                        <button id="theme-toggle" class="toggle-btn ${isDark ? 'active' : ''}" 
                            style="width: 50px; height: 30px; background: ${isDark ? 'var(--success)' : 'var(--bg-level-3)'}; border-radius: 99px; position: relative; transition: background 0.3s;">
                            <span style="position: absolute; top: 2px; left: ${isDark ? '22px' : '2px'}; width: 26px; height: 26px; background: white; border-radius: 50%; transition: left 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
                        </button>
                    </div>
                </div>

                <!-- Data Section -->
                <div class="card">
                    <h3 style="margin-bottom: 16px; font-size: 0.9rem; text-transform: uppercase; color: var(--text-secondary);">Data Management</h3>
                    
                    <button id="export-btn" class="settings-item flex items-center justify-between" style="width: 100%; padding: 12px 0; border-bottom: 1px solid var(--bg-level-2);">
                        <span>Export Data (JSON)</span>
                        <span>↓</span>
                    </button>
                    
                    <button id="reset-btn" class="settings-item flex items-center justify-between" style="width: 100%; padding: 12px 0; color: var(--danger);">
                        <span>Reset All Data</span>
                        <span>⚠</span>
                    </button>
                </div>

                 <!-- Auth Section -->
                <div class="card">
                     <h3 style="margin-bottom: 16px; font-size: 0.9rem; text-transform: uppercase; color: var(--text-secondary);">Account</h3>
                     <div id="auth-status">
                        <!-- Rendered in afterRender -->
                     </div>
                </div>

                <div style="text-align: center; margin-top: 32px; color: var(--text-tertiary); font-size: 0.8rem;">
                    Niyam v2.0.0
                </div>
            </div>
        `;
    }

    afterRender() {
        this.find('#back-btn').addEventListener('click', () => Router.navigate('/'));

        // Theme Toggle
        this.find('#theme-toggle').addEventListener('click', () => {
            const current = store.get().theme;
            const next = current === 'dark' ? 'light' : 'dark';
            store.set('theme', next);
            // Effect handling should ideally be in main.js or a ThemeService, 
            // but we will do a quick dirty hack here for instant feedback if store subscription isn't driving CSS yet
            document.body.className = next === 'dark' ? '' : 'theme-light';
            this.update();
        });

        // Export
        this.find('#export-btn').addEventListener('click', () => {
            const data = StorageService.load();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `niyam-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
        });

        // Reset
        this.find('#reset-btn').addEventListener('click', () => {
            if (confirm('Are you sure? This will delete ALL your habits and history.')) {
                localStorage.clear();
                window.location.reload();
            }
        });

        // Auth Status
        this.renderAuthStatus();
    }

    renderAuthStatus() {
        const user = store.get().user;
        const container = this.find('#auth-status');

        if (user) {
            container.innerHTML = `
                <div class="flex items-center" style="margin-bottom: 12px;">
                    <img src="${user.photoURL || ''}" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 10px; background: #eee;">
                    <div>${user.displayName || user.email}</div>
                </div>
                <button id="signout-btn" style="color: var(--primary);">Sign Out</button>
            `;
            container.querySelector('#signout-btn').addEventListener('click', () => {
                AuthService.signOut();
                // Auth listener in main.js will update store, and we might need to re-render
                setTimeout(() => this.renderAuthStatus(), 500);
            });
        } else {
            container.innerHTML = `
                <button id="signin-btn" class="btn-primary" style="width: 100%;">Sign in with Google</button>
            `;
            container.querySelector('#signin-btn').addEventListener('click', () => {
                AuthService.signIn();
            });
        }
    }
}
