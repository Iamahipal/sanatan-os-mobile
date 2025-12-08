/**
 * Shastras - Sacred Scriptures App
 * Main Application Logic
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initApp();
});

// ===== STATE =====
const state = {
    currentScripture: null,
    currentChapter: null,
    bookmarks: [],
    history: [],
    fontSize: 'medium'
};

// ===== INITIALIZATION =====
function initApp() {
    loadState();
    setDailyVerse();
    initLibraryScreen();
    initScriptureScreen();
    initReadingScreen();
    initSearch();
    initBottomNav();
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    lucide.createIcons();
}

// ===== LIBRARY SCREEN =====
function initLibraryScreen() {
    // Featured card click
    document.querySelector('.featured-card')?.addEventListener('click', () => {
        openScripture('gita');
    });

    // Read button
    document.querySelector('.read-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openScripture('gita');
    });

    // Scripture cards
    document.querySelectorAll('.scripture-card').forEach(card => {
        card.addEventListener('click', () => {
            const scriptureId = card.dataset.scripture;
            openScripture(scriptureId);
        });
    });

    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            showCategoryScriptures(category);
        });
    });
}

function showCategoryScriptures(category) {
    const categoryMappings = {
        shruti: ['vedas', 'upanishads'],
        smriti: ['ramayana', 'mahabharata', 'puranas'],
        darshan: ['gita', 'yoga-sutras', 'brahma-sutras'],
        tantra: []
    };

    const scriptures = categoryMappings[category] || [];
    if (scriptures.length > 0) {
        showToast(`${scriptures.length} scriptures in this category`);
        // Could filter/highlight the scriptures
    } else {
        showToast('Coming soon!');
    }
}

// ===== SCRIPTURE SCREEN =====
function initScriptureScreen() {
    // Back button
    document.getElementById('backToLibrary')?.addEventListener('click', () => {
        showScreen('libraryScreen');
    });

    // Bookmark button
    document.getElementById('bookmarkScripture')?.addEventListener('click', () => {
        toggleBookmark(state.currentScripture);
    });
}

function openScripture(scriptureId) {
    const scripture = window.scriptureData[scriptureId];
    if (!scripture) {
        showToast('Scripture not found');
        return;
    }

    state.currentScripture = scriptureId;
    addToHistory(scriptureId);

    // Update UI
    document.getElementById('scriptureTitle').textContent = scripture.title;
    document.getElementById('scriptureSubtitle').textContent = scripture.englishTitle;
    document.getElementById('heroIcon').textContent = scripture.icon;
    document.getElementById('chapterCount').textContent = scripture.chapters;
    document.getElementById('verseCount').textContent = scripture.verses.toLocaleString();
    document.getElementById('scriptureDesc').textContent = scripture.description;

    // Load chapters
    loadChapters(scripture);

    showScreen('scriptureScreen');
}

function loadChapters(scripture) {
    const container = document.getElementById('chapterList');
    container.innerHTML = '';

    scripture.chapterList.forEach(chapter => {
        const card = document.createElement('div');
        card.className = 'chapter-card';
        card.innerHTML = `
            <span class="chapter-number">${chapter.num}</span>
            <div class="chapter-info">
                <h4>${chapter.name}</h4>
                <p>${chapter.sanskrit} • ${chapter.verses} verses</p>
            </div>
            <i data-lucide="chevron-right" class="chevron"></i>
        `;
        card.addEventListener('click', () => openChapter(chapter.num));
        container.appendChild(card);
    });

    lucide.createIcons();
}

// ===== READING SCREEN =====
function initReadingScreen() {
    // Back button
    document.getElementById('backToScripture')?.addEventListener('click', () => {
        showScreen('scriptureScreen');
    });

    // Font size button
    document.getElementById('fontSizeBtn')?.addEventListener('click', toggleFontSize);

    // Navigation
    document.getElementById('prevChapter')?.addEventListener('click', () => navigateChapter(-1));
    document.getElementById('nextChapter')?.addEventListener('click', () => navigateChapter(1));
}

function openChapter(chapterNum) {
    const scripture = window.scriptureData[state.currentScripture];
    if (!scripture) return;

    const chapter = scripture.chapterList.find(c => c.num === chapterNum);
    if (!chapter) return;

    state.currentChapter = chapterNum;

    // Update header
    document.getElementById('chapterTitle').textContent = `Chapter ${chapterNum}`;
    document.getElementById('chapterName').textContent = chapter.name;
    document.getElementById('totalVerses').textContent = chapter.verses;

    // Load verses
    loadVerses(scripture, chapterNum);

    showScreen('readingScreen');
}

function loadVerses(scripture, chapterNum) {
    const container = document.getElementById('readingMain');
    container.innerHTML = '';

    // Check if we have sample verses
    const verses = scripture.sampleVerses?.[chapterNum] || [];

    if (verses.length > 0) {
        verses.forEach(verse => {
            const verseEl = createVerseElement(verse);
            container.appendChild(verseEl);
        });
    } else {
        // Show placeholder for chapters without content
        const chapter = scripture.chapterList.find(c => c.num === chapterNum);
        container.innerHTML = `
            <div class="coming-soon">
                <span class="cs-icon">📖</span>
                <h3>${chapter.sanskrit}</h3>
                <p>${chapter.name}</p>
                <p class="cs-desc">${chapter.desc}</p>
                <p class="cs-note">Full content coming soon!</p>
                <p class="cs-verses">${chapter.verses} verses in this chapter</p>
            </div>
        `;
    }

    // Update verse counter
    document.getElementById('currentVerse').textContent = '1';
}

function createVerseElement(verse) {
    const el = document.createElement('div');
    el.className = 'verse-container';
    el.innerHTML = `
        <span class="verse-number">Verse ${verse.num}</span>
        <div class="verse-text-sanskrit">${verse.sanskrit}</div>
        <p class="verse-transliteration">${verse.transliteration}</p>
        <p class="verse-translation-text">${verse.translation}</p>
        ${verse.commentary ? `
            <div class="verse-commentary">
                <h5>Commentary</h5>
                <p>${verse.commentary}</p>
            </div>
        ` : ''}
    `;
    return el;
}

function navigateChapter(direction) {
    const scripture = window.scriptureData[state.currentScripture];
    if (!scripture) return;

    const newChapter = state.currentChapter + direction;
    if (newChapter >= 1 && newChapter <= scripture.chapters) {
        openChapter(newChapter);
    } else {
        showToast(direction < 0 ? 'First chapter' : 'Last chapter');
    }
}

function toggleFontSize() {
    const sizes = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(state.fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    state.fontSize = sizes[nextIndex];

    document.getElementById('readingMain').style.fontSize =
        state.fontSize === 'small' ? '0.9rem' :
            state.fontSize === 'large' ? '1.2rem' : '1rem';

    showToast(`Font: ${state.fontSize}`);
    saveState();
}

// ===== SEARCH =====
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');

    searchBtn?.addEventListener('click', () => {
        searchModal.classList.add('active');
        searchInput.focus();
    });

    closeSearch?.addEventListener('click', () => {
        searchModal.classList.remove('active');
    });

    document.querySelector('.modal-backdrop')?.addEventListener('click', () => {
        searchModal.classList.remove('active');
    });

    searchInput?.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
}

function performSearch(query) {
    const resultsContainer = document.getElementById('searchResults');

    if (query.length < 2) {
        resultsContainer.innerHTML = '<p class="search-hint">Search for verses, chapters, or concepts...</p>';
        return;
    }

    const results = [];
    const q = query.toLowerCase();

    // Search scriptures
    Object.values(window.scriptureData).forEach(scripture => {
        if (scripture.englishTitle.toLowerCase().includes(q) ||
            scripture.title.includes(query)) {
            results.push({
                type: 'scripture',
                title: scripture.englishTitle,
                subtitle: scripture.title,
                id: scripture.id
            });
        }

        // Search chapters
        scripture.chapterList.forEach(chapter => {
            if (chapter.name.toLowerCase().includes(q) ||
                chapter.sanskrit.includes(query)) {
                results.push({
                    type: 'chapter',
                    title: chapter.name,
                    subtitle: `${scripture.englishTitle} - Chapter ${chapter.num}`,
                    scriptureId: scripture.id,
                    chapterNum: chapter.num
                });
            }
        });
    });

    // Search daily verses
    window.dailyVerses.forEach((verse, i) => {
        if (verse.translation.toLowerCase().includes(q) ||
            verse.sanskrit.includes(query)) {
            results.push({
                type: 'verse',
                title: verse.source,
                subtitle: verse.translation.substring(0, 50) + '...',
                idx: i
            });
        }
    });

    // Render results
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="search-hint">No results found</p>';
    } else {
        resultsContainer.innerHTML = results.slice(0, 10).map(r => `
            <div class="search-result-item" data-type="${r.type}" data-id="${r.id || r.scriptureId || ''}" data-chapter="${r.chapterNum || ''}">
                <h4>${r.title}</h4>
                <p>${r.subtitle}</p>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const id = item.dataset.id;
                const chapter = item.dataset.chapter;

                document.getElementById('searchModal').classList.remove('active');

                if (type === 'scripture') {
                    openScripture(id);
                } else if (type === 'chapter') {
                    openScripture(id);
                    setTimeout(() => openChapter(parseInt(chapter)), 100);
                }
            });
        });
    }
}

// ===== BOTTOM NAV =====
function initBottomNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;

            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            handleNavTab(tab);
        });
    });
}

function handleNavTab(tab) {
    switch (tab) {
        case 'library':
            showScreen('libraryScreen');
            break;
        case 'bookmarks':
            showBookmarks();
            break;
        case 'history':
            showHistory();
            break;
        case 'settings':
            showSettings();
            break;
    }
}

function showBookmarks() {
    if (state.bookmarks.length === 0) {
        showToast('No bookmarks yet. Tap ❤️ to save!');
    } else {
        showToast(`${state.bookmarks.length} bookmarks saved`);
    }
}

function showHistory() {
    if (state.history.length === 0) {
        showToast('No reading history yet');
    } else {
        const last = window.scriptureData[state.history[0]];
        showToast(`Last read: ${last?.englishTitle || 'Unknown'}`);
    }
}

function showSettings() {
    showToast('Settings coming soon!');
}

// ===== BOOKMARKS & HISTORY =====
function toggleBookmark(scriptureId) {
    const idx = state.bookmarks.indexOf(scriptureId);
    if (idx === -1) {
        state.bookmarks.push(scriptureId);
        showToast('Bookmarked!');
    } else {
        state.bookmarks.splice(idx, 1);
        showToast('Bookmark removed');
    }
    saveState();
}

function addToHistory(scriptureId) {
    // Remove if exists
    const idx = state.history.indexOf(scriptureId);
    if (idx !== -1) state.history.splice(idx, 1);

    // Add to front
    state.history.unshift(scriptureId);

    // Keep only last 10
    if (state.history.length > 10) state.history = state.history.slice(0, 10);

    saveState();
}

// ===== DAILY VERSE =====
function setDailyVerse() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const verse = window.dailyVerses[dayOfYear % window.dailyVerses.length];

    document.getElementById('dailySanskrit').textContent = verse.sanskrit;
    document.getElementById('dailyTranslation').textContent = verse.translation;
    document.getElementById('dailySource').textContent = '— ' + verse.source;
}

// ===== PERSISTENCE =====
function saveState() {
    localStorage.setItem('shastrasState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('shastrasState');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
    }
}

// ===== TOAST =====
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: #FF9933;
        color: #000;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
        z-index: 9999;
        animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Add coming soon styles
const style = document.createElement('style');
style.textContent = `
    .coming-soon {
        text-align: center;
        padding: 60px 20px;
    }
    .cs-icon { font-size: 4rem; display: block; margin-bottom: 20px; }
    .coming-soon h3 {
        font-family: 'Tiro Devanagari Sanskrit', serif;
        font-size: 1.5rem;
        color: var(--gold);
        margin-bottom: 8px;
    }
    .coming-soon p { color: var(--text-secondary); margin-bottom: 8px; }
    .cs-desc { font-style: italic; }
    .cs-note { color: var(--saffron) !important; margin-top: 20px; }
    .cs-verses { font-size: 0.8rem; color: var(--text-muted) !important; }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
