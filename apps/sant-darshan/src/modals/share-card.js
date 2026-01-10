/**
 * Sant Darshan App - Share Card Modal
 * Generate shareable saint cards
 */

import { escapeHtml } from '../utils/sanitize.js';
import { getSaint } from '../services/saints.js';
import { TRADITIONS } from '../data/traditions.js';
import { closeModal } from '../core/router.js';
import { showToast } from '../components/toast.js';

/**
 * Share Card Modal Renderer
 */
const ShareCardModal = {
    container: null,
    cleanupFns: [],
    saint: null,
    selectedStyle: 'classic',

    /**
     * Render the share card modal
     * @param {HTMLElement} container
     * @param {Object} data
     * @returns {Function} Cleanup function
     */
    render(container, data = {}) {
        this.container = container;
        this.cleanupFns = [];
        this.saint = data.saintId ? getSaint(data.saintId) : null;
        this.selectedStyle = 'classic';

        if (!this.saint) {
            container.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-container">
                    <div class="modal-body">
                        <p class="text-center">Saint not found</p>
                    </div>
                </div>
            `;
            return () => {};
        }

        this.buildModal();

        return () => this.cleanup();
    },

    /**
     * Build modal structure
     */
    buildModal() {
        this.container.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-title-group">
                        <h2 class="modal-title">Share Card</h2>
                        <p class="modal-title-hi" lang="hi">साझा कार्ड</p>
                    </div>
                    <button class="modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Style Selector -->
                    <div class="style-selector">
                        <label class="form-label">Card Style</label>
                        <div class="style-options">
                            ${['classic', 'minimal', 'quote', 'gradient'].map(style => `
                                <button class="style-btn ${style === this.selectedStyle ? 'selected' : ''}"
                                        data-style="${style}">
                                    ${this.getStyleLabel(style)}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Card Preview -->
                    <div class="card-preview-container">
                        <div id="share-card-preview" class="share-card-preview">
                            ${this.renderCard()}
                        </div>
                    </div>

                    <!-- Share Options -->
                    <div class="share-options">
                        <button class="btn btn-primary share-btn" id="copy-btn">
                            <i class="fas fa-copy"></i> Copy Text
                        </button>
                        <button class="btn btn-secondary share-btn" id="native-share-btn">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Setup close button
        const closeBtn = this.container.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal());
        }

        // Backdrop click
        const backdrop = this.container.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => closeModal());
        }

        // Style selector
        this.container.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.style-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedStyle = btn.dataset.style;
                this.updatePreview();
            });
        });

        // Copy button
        const copyBtn = this.container.querySelector('#copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyText());
        }

        // Native share button
        const shareBtn = this.container.querySelector('#native-share-btn');
        if (shareBtn) {
            if (navigator.share) {
                shareBtn.addEventListener('click', () => this.nativeShare());
            } else {
                shareBtn.style.display = 'none';
            }
        }
    },

    /**
     * Get style label
     */
    getStyleLabel(style) {
        const labels = {
            classic: '🏛️ Classic',
            minimal: '✨ Minimal',
            quote: '💬 Quote',
            gradient: '🎨 Gradient'
        };
        return labels[style] || style;
    },

    /**
     * Render card based on style
     */
    renderCard() {
        switch (this.selectedStyle) {
            case 'classic':
                return this.renderClassicCard();
            case 'minimal':
                return this.renderMinimalCard();
            case 'quote':
                return this.renderQuoteCard();
            case 'gradient':
                return this.renderGradientCard();
            default:
                return this.renderClassicCard();
        }
    },

    /**
     * Render classic style card
     */
    renderClassicCard() {
        const tradition = TRADITIONS[this.saint.tradition];
        const initials = this.getInitials(this.saint.name);

        return `
            <div class="share-card share-card-classic">
                <div class="share-card-header" style="background: ${tradition?.gradient || 'var(--primary-gradient)'}">
                    <div class="share-card-avatar">${initials}</div>
                    <h3 class="share-card-name">${escapeHtml(this.saint.name)}</h3>
                    ${this.saint.nameHi ? `<p class="share-card-name-hi" lang="hi">${escapeHtml(this.saint.nameHi)}</p>` : ''}
                </div>
                <div class="share-card-body">
                    ${this.saint.quote ? `
                        <blockquote class="share-card-quote">
                            "${escapeHtml(this.saint.quote)}"
                        </blockquote>
                    ` : ''}
                    <div class="share-card-meta">
                        <span class="share-card-tradition">${escapeHtml(tradition?.name || this.saint.tradition)}</span>
                        ${this.saint.period ? `<span class="share-card-period">${escapeHtml(this.saint.period)}</span>` : ''}
                    </div>
                </div>
                <div class="share-card-footer">
                    <span class="share-card-branding">Sant Darshan</span>
                </div>
            </div>
        `;
    },

    /**
     * Render minimal style card
     */
    renderMinimalCard() {
        return `
            <div class="share-card share-card-minimal">
                <h3 class="share-card-name">${escapeHtml(this.saint.name)}</h3>
                ${this.saint.nameHi ? `<p class="share-card-name-hi" lang="hi">${escapeHtml(this.saint.nameHi)}</p>` : ''}
                ${this.saint.quote ? `
                    <blockquote class="share-card-quote">
                        "${escapeHtml(this.saint.quote)}"
                    </blockquote>
                ` : ''}
                <span class="share-card-branding">— Sant Darshan</span>
            </div>
        `;
    },

    /**
     * Render quote style card
     */
    renderQuoteCard() {
        const quote = this.saint.quote || this.saint.quotes?.[0] || 'A great saint of India';

        return `
            <div class="share-card share-card-quote-style">
                <i class="fas fa-quote-left share-card-quote-icon"></i>
                <blockquote class="share-card-quote-large">
                    ${escapeHtml(quote)}
                </blockquote>
                <div class="share-card-attribution">
                    <span class="share-card-name">— ${escapeHtml(this.saint.name)}</span>
                    ${this.saint.nameHi ? `<span class="share-card-name-hi" lang="hi">${escapeHtml(this.saint.nameHi)}</span>` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Render gradient style card
     */
    renderGradientCard() {
        const tradition = TRADITIONS[this.saint.tradition];
        const initials = this.getInitials(this.saint.name);

        return `
            <div class="share-card share-card-gradient" style="background: ${tradition?.gradient || 'var(--primary-gradient)'}">
                <div class="share-card-avatar-large">${initials}</div>
                <h3 class="share-card-name-large">${escapeHtml(this.saint.name)}</h3>
                ${this.saint.nameHi ? `<p class="share-card-name-hi-large" lang="hi">${escapeHtml(this.saint.nameHi)}</p>` : ''}
                ${this.saint.quote ? `
                    <blockquote class="share-card-quote">
                        "${escapeHtml(this.saint.quote.substring(0, 100))}${this.saint.quote.length > 100 ? '...' : ''}"
                    </blockquote>
                ` : ''}
                <span class="share-card-branding-light">Sant Darshan</span>
            </div>
        `;
    },

    /**
     * Update preview
     */
    updatePreview() {
        const preview = this.container.querySelector('#share-card-preview');
        if (preview) {
            preview.innerHTML = this.renderCard();
        }
    },

    /**
     * Get initials
     */
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    },

    /**
     * Generate share text
     */
    getShareText() {
        const tradition = TRADITIONS[this.saint.tradition];
        let text = `${this.saint.name}`;

        if (this.saint.nameHi) {
            text += ` (${this.saint.nameHi})`;
        }

        text += '\n';

        if (tradition) {
            text += `${tradition.name} tradition`;
        }

        if (this.saint.period) {
            text += ` • ${this.saint.period}`;
        }

        text += '\n\n';

        if (this.saint.quote) {
            text += `"${this.saint.quote}"\n\n`;
        }

        text += '— Sant Darshan App';

        return text;
    },

    /**
     * Copy text to clipboard
     */
    async copyText() {
        const text = this.getShareText();

        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!', 'success');
        } catch (err) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Copied to clipboard!', 'success');
        }
    },

    /**
     * Native share
     */
    async nativeShare() {
        const text = this.getShareText();

        try {
            await navigator.share({
                title: this.saint.name,
                text: text
            });
        } catch (err) {
            if (err.name !== 'AbortError') {
                showToast('Share failed', 'error');
            }
        }
    },

    /**
     * Cleanup
     */
    cleanup() {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }
};

export default ShareCardModal;
