/**
 * OnboardingScreen - Welcome Flow
 * Introduces users to Niyam
 */

import { Component } from '../core/Component.js';
import { Store } from '../core/Store.js';
import { navigate } from '../core/Router.js';
import { StorageService } from '../services/StorageService.js';

export class OnboardingScreen extends Component {
    constructor() {
        super();
        this.currentSlide = 0;
        this.slides = [
            {
                icon: 'heart-handshake',
                title: 'Welcome to Niyam',
                description: 'Build a better you with beautiful streaks, powerful insights, and daily rituals that stick.'
            },
            {
                icon: 'check-circle-2',
                title: 'Track Every Day',
                description: 'One tap to mark done. Watch your streaks grow and never break the chain.'
            },
            {
                icon: 'trending-up',
                title: 'See Your Growth',
                description: 'Beautiful grids reveal your progress over weeks, months, and years.'
            }
        ];
    }

    template() {
        return `
            <div class="screen onboarding-screen active">
                <div class="onboarding-slides">
                    ${this.slides.map((slide, i) => `
                        <div class="onboarding-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
                            <div class="slide-content">
                                <div class="slide-icon">
                                    <i data-lucide="${slide.icon}"></i>
                                </div>
                                <h1>${slide.title}</h1>
                                <p>${slide.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="onboarding-nav">
                    <button class="skip-btn" id="skip-btn" aria-label="Skip onboarding">
                        Skip
                    </button>
                    
                    <div class="onboarding-dots">
                        ${this.slides.map((_, i) => `
                            <div class="dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></div>
                        `).join('')}
                    </div>
                    
                    <button class="next-btn" id="next-btn" aria-label="Next slide">
                        <i data-lucide="arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Skip button
        this.on('#skip-btn', 'click', () => this.complete());

        // Next button
        this.on('#next-btn', 'click', () => this.next());

        // Dot navigation
        this.delegate('click', '.dot', (e, dot) => {
            const index = parseInt(dot.dataset.dot);
            this.goToSlide(index);
        });

        // Swipe support
        this.setupSwipe();

        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    setupSwipe() {
        let startX = 0;
        let endX = 0;

        this.element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.element.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });
    }

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        // Update slides
        this.findAll('.onboarding-slide').forEach((slide, i) => {
            slide.classList.remove('active', 'exit');
            if (i === index) {
                slide.classList.add('active');
            } else if (i < index) {
                slide.classList.add('exit');
            }
        });

        // Update dots
        this.findAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update button
        const nextBtn = this.find('#next-btn');
        if (index === this.slides.length - 1) {
            nextBtn.innerHTML = '<i data-lucide="check"></i>';
            nextBtn.setAttribute('aria-label', 'Complete onboarding');
        } else {
            nextBtn.innerHTML = '<i data-lucide="arrow-right"></i>';
            nextBtn.setAttribute('aria-label', 'Next slide');
        }

        // Re-initialize icons
        if (window.lucide) {
            lucide.createIcons();
        }

        this.currentSlide = index;
    }

    next() {
        if (this.currentSlide < this.slides.length - 1) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            this.complete();
        }
    }

    prev() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    complete() {
        Store.set('onboardingComplete', true);
        StorageService.save(Store.getPersistedState());
        navigate('/');
    }
}
