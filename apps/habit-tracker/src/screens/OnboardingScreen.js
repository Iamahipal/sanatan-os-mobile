import { Component } from '../core/Component.js';
import { Router } from '../core/Router.js';
import { store } from '../core/Store.js';
import { StorageService } from '../services/StorageService.js';

export class OnboardingScreen extends Component {
    template() {
        return `
            <div class="onboarding-screen" style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 32px; background: linear-gradient(135deg, #0f0c29 0%, #302b63 100%); color: white;">
                <div style="font-size: 80px; margin-bottom: 24px;">✨</div>
                <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 16px;">Welcome to Niyam</h1>
                <p style="font-size: 1.2rem; opacity: 0.8; margin-bottom: 48px; max-width: 300px;">
                    Master your habits, master your life. Simple, beautiful, effective.
                </p>
                <button id="start-btn" style="background: white; color: #302b63; padding: 16px 48px; border-radius: 99px; font-weight: 700; font-size: 1.1rem; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
                    Get Started
                </button>
            </div>
        `;
    }

    afterRender() {
        this.find('#start-btn').addEventListener('click', () => {
            store.set('onboardingComplete', true);
            StorageService.save(store.get()); // Persist immediately
            Router.navigate('/');
        });
    }
}
