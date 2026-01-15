/**
 * Digital Yatra - Bundled Application
 * All modules combined for file:// protocol compatibility
 * 
 * Contents:
 * 1. Router class
 * 2. FactDeck component
 * 3. MediaGallery component  
 * 4. App class
 */

// ============================================
// ROUTER
// ============================================
class Router {
    constructor() {
        this.routes = {};
        this.appContainer = document.getElementById('app');
        this.scrollHandler = null; // Track for cleanup
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    addRoute(name, handler) {
        this.routes[name] = handler;
    }

    start() {
        if (!window.location.hash) {
            window.location.hash = '#home';
        } else {
            this.handleRoute();
        }
    }

    handleRoute() {
        const hash = window.location.hash.slice(1);
        const [route, param] = hash.split('/');

        if (this.routes[route]) {
            this.routes[route](param);
        } else {
            console.warn('Route not found:', route);
            this.routes['home']();
        }
    }

    swapView(viewFragment) {
        // Cleanup previous scroll handler to prevent memory leak
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(viewFragment);

        // Focus management for accessibility
        const mainContent = this.appContainer.querySelector('main, .view-container');
        if (mainContent) {
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus({ preventScroll: true });
        }

        // Scroll to top on view change
        window.scrollTo(0, 0);
    }
}

// ============================================
// FACT DECK COMPONENT
// ============================================
class FactDeck {
    constructor(factsUrl) {
        this.factsUrl = factsUrl;
        this.facts = [];
    }

    async load() {
        try {
            const res = await fetch(this.factsUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            this.facts = await res.json();
            return this.render();
        } catch (e) {
            console.warn("Failed to load facts:", e);
            return `<div class="empty-state">
                <span class="empty-icon">🔮</span>
                <p>No secrets revealed yet.</p>
            </div>`;
        }
    }

    render() {
        if (!this.facts || this.facts.length === 0) return '';

        const cardsHtml = this.facts.map(fact => {
            const description = this.escapeHtml(fact.full_story || fact.description || '');
            const tag = this.escapeHtml(fact.category || fact.tag || 'Secret');
            const hook = this.escapeHtml(fact.hook || '');
            const title = this.escapeHtml(fact.title || '');
            const source = fact.source ? this.escapeHtml(fact.source) : '';

            return `
                <div class="fact-card">
                    <div class="fact-image" style="background-image: url('${fact.image}')"></div>
                    <div class="fact-content">
                        <span class="fact-tag">${tag}</span>
                        <h3 class="fact-title">${title}</h3>
                        ${hook ? `<p class="fact-hook">${hook}</p>` : ''}
                        <p class="fact-desc">${description}</p>
                        ${source ? `<p class="fact-source">— ${source}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        return `<div class="fact-deck">${cardsHtml}</div>`;
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// ============================================
// MEDIA GALLERY COMPONENT
// ============================================
class MediaGallery {
    constructor(mediaUrl) {
        this.mediaUrl = mediaUrl;
        this.media = [];
    }

    async load() {
        try {
            const res = await fetch(this.mediaUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            this.media = await res.json();
            return this.render();
        } catch (e) {
            console.warn("Failed to load media:", e);
            return `<div class="empty-state">
                <span class="empty-icon">📷</span>
                <p>Darshan visuals coming soon.</p>
            </div>`;
        }
    }

    render() {
        if (!this.media || this.media.length === 0) return '';

        const itemsHtml = this.media.map(item => {
            const isVideo = item.type === 'video';
            const icon = isVideo ? '<div class="play-icon"><i data-lucide="play-circle"></i></div>' : '';
            const caption = this.escapeHtml(item.caption || '');

            return `
            <div class="media-item" 
                 role="button" 
                 tabindex="0"
                 aria-label="${isVideo ? 'Play video' : 'View image'}: ${caption}"
                 onclick="app.openLightbox('${item.url}', '${item.type}')"
                 onkeypress="if(event.key==='Enter') app.openLightbox('${item.url}', '${item.type}')">
                <img src="${item.url}" loading="lazy" alt="${caption}">
                ${icon}
            </div>
            `;
        }).join('');

        return `
            <div class="media-grid">${itemsHtml}</div>
            <p class="media-hint">Tap on any image for full darshan.</p>
        `;
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// ============================================
// CONSTANTS
// ============================================
const SPLASH_DISPLAY_MS = 1000;
const SPLASH_FADE_MS = 500;
const TAB_ANIMATION_DELAY_MS = 10;

// ============================================
// MAIN APP
// ============================================
class App {
    constructor() {
        this.router = new Router();
        this.templesIndex = [];
        this.lightboxOpen = false;
        this.init();
    }

    async init() {
        // 1. Load Data Index
        await this.loadIndex();

        // 2. Setup Routes
        this.router.addRoute('home', () => this.renderHome());
        this.router.addRoute('temple', (id) => this.renderTemple(id));

        // 3. Start Router
        this.router.start();

        // 4. Remove Splash
        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            if (splash) {
                splash.style.opacity = '0';
                setTimeout(() => splash.remove(), SPLASH_FADE_MS);
            }
        }, SPLASH_DISPLAY_MS);
    }

    async loadIndex() {
        try {
            const response = await fetch('data/index.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.templesIndex = await response.json();
        } catch (e) {
            console.error("Failed to load temple index:", e);
            this.templesIndex = [];
        }
    }

    // --- RENDERERS ---

    renderHome() {
        const template = document.getElementById('view-home');
        const view = template.content.cloneNode(true);
        const listContainer = view.getElementById('temple-list');
        const countEl = view.getElementById('temple-count');

        // Update temple count dynamically
        const count = this.templesIndex.length;
        if (countEl) {
            countEl.textContent = `${count} temple${count !== 1 ? 's' : ''}`;
        }

        // Render Cards
        this.templesIndex.forEach(temple => {
            const card = document.createElement('div');
            card.className = 'temple-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Visit ${temple.name} temple in ${temple.location}`);

            const navigateToTemple = () => {
                window.location.hash = `#temple/${temple.id}`;
            };

            card.onclick = navigateToTemple;
            card.onkeypress = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigateToTemple();
                }
            };

            card.innerHTML = `
                <div class="card-bg" style="background-image: url('${temple.thumbnail}')"></div>
                <div class="card-gradient"></div>
                <div class="card-content">
                    <div class="card-location"><i data-lucide="map-pin" style="width:12px"></i> ${this.escapeHtml(temple.location)}</div>
                    <h2 class="card-title">${this.escapeHtml(temple.name)}</h2>
                    <p class="card-subtitle">${this.escapeHtml(temple.short_desc)}</p>
                </div>
            `;
            listContainer.appendChild(card);
        });

        this.router.swapView(view);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    async renderTemple(id) {
        // Show Portal Template
        const template = document.getElementById('view-portal');
        const view = template.content.cloneNode(true);
        const container = view.getElementById('portal-content');

        // Loading State with spinner
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Opening Portal...</p>
            </div>
        `;
        this.router.swapView(view);

        // Fetch Detail Data
        try {
            const manifestRes = await fetch(`data/temples/${id}/manifest.json`);
            if (!manifestRes.ok) throw new Error("Temple not found");
            const data = await manifestRes.json();

            // Try to load deity and why_visit data (optional)
            let deity = null;
            let whyVisit = null;
            try {
                const deityRes = await fetch(`data/temples/${id}/deity.json`);
                if (deityRes.ok) deity = await deityRes.json();
            } catch (e) {
                console.warn(`Deity data not available for ${id}:`, e);
            }
            try {
                const whyRes = await fetch(`data/temples/${id}/why_visit.json`);
                if (whyRes.ok) whyVisit = await whyRes.json();
            } catch (e) {
                console.warn(`Why visit data not available for ${id}:`, e);
            }

            // Get stats from manifest
            const stats = data.stats || {};
            const ageYears = stats.age_years || '1000+';
            const dailyVisitors = stats.daily_visitors || '10K';
            const significance = data.significance?.type?.[0] || 'Sacred Site';

            // Get deity info
            const deityName = typeof data.deity === 'object' ? data.deity.primary : data.deity;
            const deityForm = data.deity?.form || '';
            const mantra = deity?.worship?.primary_mantra?.sanskrit || 'ॐ नमः शिवाय';

            // Render Structure
            const portalContent = document.getElementById('portal-content');
            portalContent.innerHTML = `
                <!-- 1. Hero Header -->
                <div class="portal-hero">
                    <img src="${data.hero_image}" class="hero-media" alt="${this.escapeHtml(data.name)} temple">
                    <div class="hero-overlay">
                        <div class="hero-title-group">
                            <span class="hero-super">${this.escapeHtml(data.location.city)} • ${this.escapeHtml(data.location.state)}</span>
                            <h1 class="hero-h1">${this.escapeHtml(data.name)}</h1>
                            ${data.name_local ? `<span class="hero-local">${this.escapeHtml(data.name_local)}</span>` : ''}
                        </div>
                    </div>
                </div>

                <!-- 2. Content Sheet -->
                <div class="portal-sheet">
                    <!-- Deity Badge -->
                    <div class="deity-badge">
                        <span class="deity-icon">🙏</span>
                        <div class="deity-info">
                            <span class="deity-name">${this.escapeHtml(deityName)}</span>
                            ${deityForm ? `<span class="deity-form">${this.escapeHtml(deityForm)}</span>` : ''}
                        </div>
                        <span class="significance-tag">${this.escapeHtml(significance)}</span>
                    </div>

                    <!-- Segmented Control (Tabs) -->
                    <div class="segmented-control" role="tablist" aria-label="Temple information sections">
                        <button class="segment-btn active" role="tab" aria-selected="true" data-tab="overview" onclick="app.switchTab('overview')">Overview</button>
                        <button class="segment-btn" role="tab" aria-selected="false" data-tab="secrets" onclick="app.switchTab('secrets')">Secrets</button>
                        <button class="segment-btn" role="tab" aria-selected="false" data-tab="darshan" onclick="app.switchTab('darshan')">Darshan</button>
                        <button class="segment-btn" role="tab" aria-selected="false" data-tab="guide" onclick="app.switchTab('guide')">Guide</button>
                    </div>

                    <!-- MODULE: Overview -->
                    <div id="mod-overview" class="module-container active" role="tabpanel" aria-labelledby="tab-overview">
                        <div class="stat-row">
                            <div class="stat-item">
                                <span class="stat-val">${ageYears}+</span>
                                <span class="stat-label">Years Old</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-val">${typeof dailyVisitors === 'string' ? dailyVisitors : dailyVisitors.toLocaleString()}</span>
                                <span class="stat-label">Daily Visitors</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-val">#${data.significance?.jyotirlinga_number || '—'}</span>
                                <span class="stat-label">Jyotirlinga</span>
                            </div>
                        </div>
                        
                        <div class="overview-text">
                            <p>${this.escapeHtml(data.description)}</p>
                            <p class="secret-hook">${this.escapeHtml(data.secret_hook)}</p>
                        </div>

                        ${deity ? `
                        <div class="mantra-card">
                            <span class="mantra-label">Primary Mantra</span>
                            <span class="mantra-text">${this.escapeHtml(mantra)}</span>
                            <span class="mantra-meaning">${this.escapeHtml(deity.worship?.primary_mantra?.translation || '')}</span>
                        </div>
                        ` : ''}

                        ${data.significance?.philosophy ? `
                        <div class="philosophy-block">
                            <h4>Spiritual Significance</h4>
                            <p>${this.escapeHtml(data.significance.philosophy)}</p>
                        </div>
                        ` : ''}
                    </div>

                    <!-- MODULE: Secrets (Fact Deck) -->
                    <div id="mod-secrets" class="module-container" role="tabpanel" aria-labelledby="tab-secrets">
                        <div id="facts-mount" class="loading-container">
                            <div class="spinner"></div>
                        </div>
                    </div>

                    <!-- MODULE: Darshan -->
                    <div id="mod-darshan" class="module-container" role="tabpanel" aria-labelledby="tab-darshan">
                        <div id="media-mount" class="loading-container">
                            <div class="spinner"></div>
                        </div>
                    </div>

                    <!-- MODULE: Guide (Why Visit) -->
                    <div id="mod-guide" class="module-container" role="tabpanel" aria-labelledby="tab-guide">
                        <div id="guide-mount">
                            ${whyVisit ? this.renderGuide(whyVisit) : '<div class="empty-state"><span class="empty-icon">📝</span><p>Practical guide coming soon...</p></div>'}
                        </div>
                    </div>
                </div>
            `;

            // Load Component Data
            const factDeck = new FactDeck(`data/temples/${id}/facts.json`);
            document.getElementById('facts-mount').innerHTML = await factDeck.load();

            const mediaGallery = new MediaGallery(`data/temples/${id}/media.json`);
            document.getElementById('media-mount').innerHTML = await mediaGallery.load();

            if (typeof lucide !== 'undefined') lucide.createIcons();

        } catch (e) {
            console.error(e);
            const portalContent = document.getElementById('portal-content');
            portalContent.innerHTML = `
                <div class="error-state">
                    <span class="error-icon">🛕</span>
                    <h2>Temple Portal Unavailable</h2>
                    <p>Unable to load this temple's information. Please try again.</p>
                    <button class="retry-btn" onclick="window.location.reload()">
                        <i data-lucide="refresh-cw"></i> Retry
                    </button>
                    <button class="back-btn-error" onclick="window.history.back()">
                        <i data-lucide="arrow-left"></i> Go Back
                    </button>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    // Render the Why Visit / Guide section
    renderGuide(data) {
        let html = '';

        // Spiritual Invitation at top (replaces warning)
        if (data.spiritual_invitation) {
            html += `
                <div class="guide-invitation">
                    <h4>🙏 Divine Welcome</h4>
                    <p>${this.escapeHtml(data.spiritual_invitation)}</p>
                </div>
            `;
        }

        // Spiritual Blessings (new positive format)
        if (data.spiritual_benefits?.length) {
            html += '<div class="guide-section"><h4>✨ Sacred Blessings</h4>';
            data.spiritual_benefits.forEach(benefit => {
                const title = benefit.blessing || benefit.claim || 'Sacred Blessing';
                const desc = benefit.significance || benefit.reality || '';
                const tip = benefit.experience || benefit.tip || '';
                html += `
                    <div class="benefit-card">
                        <div class="benefit-title">${this.escapeHtml(title)}</div>
                        <div class="benefit-desc">${this.escapeHtml(desc)}</div>
                        ${tip ? `<div class="benefit-experience">🪷 ${this.escapeHtml(tip)}</div>` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }

        // Practical Guide
        if (data.practical_guide) {
            const pg = data.practical_guide;
            html += '<div class="guide-section"><h4>📿 Pilgrimage Guide</h4>';

            if (pg.best_time) {
                html += `<div class="guide-subsection">
                    <h5>🕐 Auspicious Times</h5>
                    <p><strong>Season:</strong> ${this.escapeHtml(pg.best_time.season || pg.best_time)}</p>
                    ${pg.best_time.auspicious_days ? `<p><strong>Sacred Days:</strong> ${this.escapeHtml(pg.best_time.auspicious_days)}</p>` : ''}
                    ${pg.best_time.day ? `<p><strong>Day:</strong> ${this.escapeHtml(pg.best_time.day)}</p>` : ''}
                    ${pg.best_time.sacred_hour || pg.best_time.hour ? `<p><strong>Sacred Hour:</strong> ${this.escapeHtml(pg.best_time.sacred_hour || pg.best_time.hour)}</p>` : ''}
                </div>`;
            }

            if (pg.sacred_rituals?.length || pg.rituals_worth_doing?.length) {
                const rituals = pg.sacred_rituals || pg.rituals_worth_doing;
                html += `<div class="guide-subsection">
                    <h5>🪔 Sacred Rituals</h5>
                    <ul>${rituals.map(r => `<li>🙏 ${this.escapeHtml(r)}</li>`).join('')}</ul>
                </div>`;
            }

            if (pg.darshan_options) {
                html += `<div class="guide-subsection">
                    <h5>🛕 Darshan Options</h5>
                    <div class="budget-grid">
                        ${Object.entries(pg.darshan_options).map(([k, v]) => `
                            <div class="budget-item">
                                <span>${k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' ')}</span>
                                <span>${this.escapeHtml(v)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }

            if (pg.preparation) {
                html += `<div class="guide-subsection">
                    <h5>🎋 Preparation</h5>
                    ${Object.entries(pg.preparation).map(([k, v]) => `<p><strong>${k.charAt(0).toUpperCase() + k.slice(1)}:</strong> ${this.escapeHtml(v)}</p>`).join('')}
                </div>`;
            }

            html += '</div>';
        }

        // Who Will Be Blessed
        if (data.who_will_be_blessed?.length || data.who_should_visit?.length) {
            const blessed = data.who_will_be_blessed || data.who_should_visit;
            html += `<div class="guide-section">
                <h4>💫 This Pilgrimage Awaits</h4>
                <ul>${blessed.map(w => `<li>✨ ${this.escapeHtml(w)}</li>`).join('')}</ul>
            </div>`;
        }

        // Pilgrimage Blessing (closing message)
        if (data.pilgrimage_blessing) {
            html += `
                <div class="guide-blessing">
                    <p>${this.escapeHtml(data.pilgrimage_blessing)}</p>
                </div>
            `;
        }

        return html;
    }

    // Lightbox implementation
    openLightbox(url, type) {
        if (this.lightboxOpen) return;
        this.lightboxOpen = true;

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', type === 'video' ? 'Video player' : 'Image viewer');

        // Escape handler - stored for cleanup
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        };

        const closeLightbox = () => {
            // Remove escape listener
            document.removeEventListener('keydown', escHandler);

            lightbox.classList.add('closing');
            setTimeout(() => {
                lightbox.remove();
                this.lightboxOpen = false;
            }, 300);
        };

        // Add escape listener
        document.addEventListener('keydown', escHandler);

        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };

        // Sanitize URL for security
        const safeUrl = encodeURI(url);

        if (type === 'video') {
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close" onclick="this.closest('.lightbox').click()">
                        <i data-lucide="x"></i>
                    </button>
                    <video src="${safeUrl}" controls autoplay class="lightbox-video"></video>
                </div>
            `;
        } else {
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close" onclick="this.closest('.lightbox').click()">
                        <i data-lucide="x"></i>
                    </button>
                    <img src="${safeUrl}" class="lightbox-image" alt="Temple darshan">
                </div>
            `;
        }

        document.body.appendChild(lightbox);
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Focus trap
        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.focus();
    }

    // Helper for tabs
    switchTab(tabName) {
        // Update Buttons using data attribute
        document.querySelectorAll('.segment-btn').forEach(btn => {
            const isActive = btn.dataset.tab === tabName;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Update Modules
        const modules = ['overview', 'secrets', 'darshan', 'guide'];
        modules.forEach(mod => {
            const el = document.getElementById(`mod-${mod}`);
            if (el) {
                if (mod === tabName) {
                    el.style.display = 'block';
                    setTimeout(() => el.classList.add('active'), TAB_ANIMATION_DELAY_MS);
                } else {
                    el.style.display = 'none';
                    el.classList.remove('active');
                }
            }
        });
    }

    // XSS protection helper
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Initialize
window.app = new App();
