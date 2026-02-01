/**
 * Satsang App v3 - Library Screen Renderer
 * Video recordings and bhajan collections
 */

import { store } from '../store.js';
import { recordings, bhajans, contentCategories } from '../data/content.js';
import { openYouTubePlayer } from '../components/youtube-player.js';

/**
 * Render Library Screen
 * @param {Object} state - App state
 */
export function renderLibrary(state) {
    const container = document.getElementById('libraryContainer');
    if (!container) return;

    const activeTab = state.libraryTab || 'videos';
    const activeCategory = state.libraryCategory || 'all';

    container.innerHTML = `
        <div class="library-screen">
            <!-- Header -->
            <div class="library-header">
                <h1 class="library-header__title">Library</h1>
                <p class="library-header__subtitle">Past recordings & bhajans</p>
            </div>
            
            <!-- Tab Switcher -->
            <div class="library-tabs">
                <button class="library-tab ${activeTab === 'videos' ? 'active' : ''}" data-tab="videos">
                    <i data-lucide="video"></i>
                    Videos
                </button>
                <button class="library-tab ${activeTab === 'bhajans' ? 'active' : ''}" data-tab="bhajans">
                    <i data-lucide="music"></i>
                    Bhajans
                </button>
            </div>
            
            <!-- Category Filter -->
            <div class="library-categories">
                ${contentCategories.map(cat => `
                    <button class="category-chip ${cat.id === activeCategory ? 'active' : ''}" 
                            data-library-category="${cat.id}">
                        <i data-lucide="${cat.icon}"></i>
                        ${cat.labelHi}
                    </button>
                `).join('')}
            </div>
            
            <!-- Content Grid -->
            <div class="library-content">
                ${activeTab === 'videos' ? renderVideoGrid(activeCategory) : renderBhajanList(activeCategory)}
            </div>
        </div>
    `;

    // Tab click handlers
    container.querySelectorAll('.library-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            store.setState({ libraryTab: tab.dataset.tab, libraryCategory: 'all' });
            renderLibrary(store.getState());
            if (window.lucide) lucide.createIcons();
        });
    });

    // Category click handlers
    container.querySelectorAll('[data-library-category]').forEach(chip => {
        chip.addEventListener('click', () => {
            store.setState({ libraryCategory: chip.dataset.libraryCategory });
            renderLibrary(store.getState());
            if (window.lucide) lucide.createIcons();
        });
    });

    // Video card click handlers
    container.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.dataset.youtubeId;
            const title = card.dataset.title;
            if (videoId) {
                openYouTubePlayer(videoId, title, false);
            }
        });
    });

    // Bhajan card click handlers
    container.querySelectorAll('.bhajan-card').forEach(card => {
        card.addEventListener('click', () => {
            const youtubeId = card.dataset.youtubeId;
            const title = card.dataset.title;
            if (youtubeId) {
                openYouTubePlayer(youtubeId, title, false);
            }
        });
    });
}

/**
 * Render Video Grid
 */
function renderVideoGrid(category) {
    const filteredRecordings = category === 'all'
        ? recordings
        : recordings.filter(r => r.category === category);

    if (filteredRecordings.length === 0) {
        return `
            <div class="library-empty">
                <i data-lucide="video-off"></i>
                <p>No videos in this category</p>
            </div>
        `;
    }

    return `
        <div class="video-grid">
            ${filteredRecordings.map(rec => {
        const vachak = store.getVachak(rec.vachakId);
        const thumbnailUrl = rec.youtubeId
            ? `https://img.youtube.com/vi/${rec.youtubeId}/hqdefault.jpg`
            : null;
        return `
                    <div class="video-card" 
                         data-youtube-id="${rec.youtubeId}" 
                         data-title="${rec.title}">
                        <div class="video-card__thumb">
                            ${thumbnailUrl ? `
                                <img src="${thumbnailUrl}" alt="${rec.title}" class="video-card__thumb-img" loading="lazy">
                            ` : `
                                <div class="video-card__thumb-placeholder">
                                    <i data-lucide="play-circle"></i>
                                </div>
                            `}
                            <span class="video-card__duration">${rec.duration}</span>
                        </div>
                        <div class="video-card__info">
                            <h4 class="video-card__title">${rec.title}</h4>
                            <p class="video-card__meta">
                                ${vachak?.shortName || 'Unknown'} • ${rec.views} views
                            </p>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

/**
 * Render Bhajan List
 */
function renderBhajanList(category) {
    const filteredBhajans = category === 'all'
        ? bhajans
        : bhajans.filter(b => b.category === category);

    if (filteredBhajans.length === 0) {
        return `
            <div class="library-empty">
                <i data-lucide="music"></i>
                <p>No bhajans in this category</p>
            </div>
        `;
    }

    return `
        <div class="bhajan-list">
            ${filteredBhajans.map((bhajan, idx) => `
                <div class="bhajan-card" 
                     data-youtube-id="${bhajan.youtubeId}"
                     data-title="${bhajan.title}">
                    <div class="bhajan-card__number">${idx + 1}</div>
                    <div class="bhajan-card__info">
                        <h4 class="bhajan-card__title">${bhajan.title}</h4>
                        <p class="bhajan-card__meta">${bhajan.artist} • ${bhajan.duration}</p>
                    </div>
                    <button class="bhajan-card__play">
                        <i data-lucide="play"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}
