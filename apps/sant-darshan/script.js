// Sant Darshan - Application Logic
// Navigate spiritually through the saints of Sanatan Dharma
// Phase 1: Favorites, Progress Tracking, Daily Darshan, Notes

(function () {
    'use strict';

    // ========== STORAGE API ==========
    const STORAGE_KEY = 'santDarshanData';

    function getStorageData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {
                favorites: [],
                explored: {},
                notes: {},
                dailyDarshan: {
                    lastShown: null,
                    streak: 0,
                    lastStreakDate: null
                }
            };
        } catch (e) {
            console.error('Storage read error:', e);
            return { favorites: [], explored: {}, notes: {}, dailyDarshan: { lastShown: null, streak: 0 } };
        }
    }

    function saveStorageData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Storage write error:', e);
        }
    }

    // ========== FAVORITES FUNCTIONS ==========
    function getFavorites() {
        return getStorageData().favorites || [];
    }

    function addFavorite(saintId) {
        const data = getStorageData();
        if (!data.favorites.includes(saintId)) {
            data.favorites.push(saintId);
            saveStorageData(data);
        }
        renderFavoritesSection();
    }

    function removeFavorite(saintId) {
        const data = getStorageData();
        data.favorites = data.favorites.filter(id => id !== saintId);
        saveStorageData(data);
        renderFavoritesSection();
    }

    function isFavorite(saintId) {
        return getFavorites().includes(saintId);
    }

    function toggleFavorite(saintId) {
        if (isFavorite(saintId)) {
            removeFavorite(saintId);
            return false;
        } else {
            addFavorite(saintId);
            return true;
        }
    }

    // ========== PROGRESS TRACKING ==========
    function markAsExplored(saintId) {
        const data = getStorageData();
        if (!data.explored[saintId]) {
            data.explored[saintId] = {
                visitedAt: Date.now(),
                timeSpent: 0
            };
            saveStorageData(data);
            updateProgressUI();
        }
    }

    function getExploredCount() {
        return Object.keys(getStorageData().explored).length;
    }

    function isExplored(saintId) {
        return !!getStorageData().explored[saintId];
    }

    function updateProgressUI() {
        const explored = getExploredCount();
        const total = SAINTS.length;
        const percent = (explored / total) * 100;

        const progressText = document.getElementById('progress-text');
        if (progressText) progressText.textContent = `${explored}/${total}`;

        const progressDesc = document.getElementById('progress-description');
        if (progressDesc) {
            if (explored === 0) progressDesc.textContent = 'Begin exploring the saints';
            else if (explored < 5) progressDesc.textContent = 'Great start on your journey!';
            else if (explored < 15) progressDesc.textContent = "You're making wonderful progress!";
            else if (explored < 30) progressDesc.textContent = 'A true spiritual seeker!';
            else progressDesc.textContent = "You've met many enlightened souls!";
        }

        const progressCircle = document.getElementById('progress-circle');
        if (progressCircle) {
            const circumference = 97.5;
            const offset = circumference - (percent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }

        const progressBanner = document.getElementById('progress-banner');
        if (progressBanner) {
            const bar = progressBanner.querySelector('.progress-bar');
            if (bar) bar.style.setProperty('--progress', `${percent}%`);
        }

        const exploredCount = document.getElementById('explored-count');
        if (exploredCount) exploredCount.textContent = explored;
    }

    // ========== DAILY DARSHAN ==========
    const REFLECTION_PROMPTS = [
        'How can you apply this teaching in your daily life today?',
        'What quality of this saint inspires you the most?',
        "How does this wisdom relate to a challenge you're facing?",
        'What would you ask this saint if you could meet them?',
        'How can you embody the spirit of devotion today?',
        'What small step can you take toward spiritual growth?',
        'How does this quote change your perspective?',
        'What habit can you cultivate inspired by this saint?'
    ];

    function getTodayDateString() {
        return new Date().toISOString().split('T')[0];
    }

    function shouldShowDailyDarshan() {
        const data = getStorageData();
        const today = getTodayDateString();
        return data.dailyDarshan.lastShown !== today;
    }

    function updateDarshanStreak() {
        const data = getStorageData();
        const today = getTodayDateString();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (data.dailyDarshan.lastStreakDate === yesterday) {
            data.dailyDarshan.streak++;
        } else if (data.dailyDarshan.lastStreakDate !== today) {
            data.dailyDarshan.streak = 1;
        }

        data.dailyDarshan.lastStreakDate = today;
        data.dailyDarshan.lastShown = today;
        saveStorageData(data);

        return data.dailyDarshan.streak;
    }

    function showDailyDarshan() {
        if (!shouldShowDailyDarshan()) return;

        const saint = getTodaysSaint();
        const tradition = TRADITIONS[saint.tradition];
        const quote = saint.quotes && saint.quotes.length > 0 ? saint.quotes[0] : '"Seek the divine within."';
        const prompt = REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];

        const streak = updateDarshanStreak();

        document.getElementById('darshan-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        document.getElementById('darshan-name').textContent = saint.name;
        document.getElementById('darshan-period').textContent = `${saint.sampradaya} • ${saint.period}`;
        document.getElementById('darshan-quote').textContent = quote.replace(/"/g, '');
        document.getElementById('darshan-reflection').textContent = prompt;
        document.getElementById('streak-count').textContent = streak;

        const avatar = document.getElementById('darshan-avatar');
        if (avatar) {
            avatar.textContent = getInitials(saint.name);
            avatar.style.background = `linear-gradient(135deg, ${tradition.color} 0%, ${tradition.color}99 100%)`;
        }

        const streakDisplay = document.getElementById('streak-display');
        if (streakDisplay) {
            streakDisplay.style.display = streak > 1 ? 'block' : 'none';
        }

        const modal = document.getElementById('daily-darshan-modal');
        if (modal) {
            modal.classList.add('active');

            document.getElementById('darshan-learn-btn').onclick = () => {
                modal.classList.remove('active');
                currentTradition = tradition;
                navigationStack.length = 0;
                navigationStack.push('home');
                showSaintDetail(saint.id);
            };

            document.getElementById('darshan-close-btn').onclick = () => {
                modal.classList.remove('active');
            };
        }
    }

    // ========== NOTES FUNCTIONS ==========
    function getNotes(saintId) {
        const data = getStorageData();
        return data.notes[saintId] || [];
    }

    function addNote(saintId, text) {
        if (!text.trim()) return;
        const data = getStorageData();
        if (!data.notes[saintId]) data.notes[saintId] = [];
        data.notes[saintId].unshift({
            id: `note_${Date.now()}`,
            text: text.trim(),
            createdAt: Date.now()
        });
        saveStorageData(data);
    }

    function deleteNote(saintId, noteId) {
        const data = getStorageData();
        if (data.notes[saintId]) {
            data.notes[saintId] = data.notes[saintId].filter(n => n.id !== noteId);
            saveStorageData(data);
        }
    }

    // ========== FUZZY SEARCH ==========
    function fuzzyMatch(text, query) {
        if (!text || !query) return { score: 0, matched: false };
        text = text.toLowerCase();
        query = query.toLowerCase();
        if (text.includes(query)) return { score: 100, matched: true };
        const distance = levenshtein(text, query);
        const maxLen = Math.max(text.length, query.length);
        const similarity = ((maxLen - distance) / maxLen) * 100;
        if (similarity > 60) return { score: similarity, matched: true };
        const queryWords = query.split(/\s+/);
        const textWords = text.split(/\s+/);
        let matchedWords = 0;
        for (const qWord of queryWords) {
            for (const tWord of textWords) {
                if (tWord.includes(qWord) || qWord.includes(tWord)) {
                    matchedWords++;
                    break;
                }
            }
        }
        if (matchedWords > 0) return { score: (matchedWords / queryWords.length) * 70, matched: true };
        return { score: 0, matched: false };
    }

    function levenshtein(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
                }
            }
        }
        return matrix[b.length][a.length];
    }

    function getTodaysSaint() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        const saintIndex = dayOfYear % SAINTS.length;
        return SAINTS[saintIndex];
    }

    // ========== STATE ==========
    let currentScreen = 'home';
    let currentTradition = null;
    let currentSaint = null;
    let currentFilter = 'all';
    const navigationStack = [];

    // ========== DOM ELEMENTS ==========
    const elements = {
        backBtn: document.getElementById('back-btn'),
        pageTitle: document.getElementById('page-title'),
        pageSubtitle: document.getElementById('page-subtitle'),
        searchBtn: document.getElementById('search-btn'),
        searchOverlay: document.getElementById('search-overlay'),
        searchInput: document.getElementById('search-input'),
        closeSearch: document.getElementById('close-search'),
        searchResults: document.getElementById('search-results'),
        mainContent: document.getElementById('main-content'),
        homeScreen: document.getElementById('home-screen'),
        saintsListScreen: document.getElementById('saints-list-screen'),
        saintDetailScreen: document.getElementById('saint-detail-screen'),
        traditionsGrid: document.getElementById('traditions-grid'),
        traditionHeader: document.getElementById('tradition-header'),
        sampradayaFilter: document.getElementById('sampradaya-filter'),
        saintsList: document.getElementById('saints-list'),
        saintDetailContent: document.getElementById('saint-detail-content'),
        totalSaints: document.getElementById('total-saints'),
        todaySaintCard: document.getElementById('today-saint-card'),
        wisdomQuote: document.getElementById('wisdom-quote'),
        favoritesSection: document.getElementById('favorites-section'),
        favoritesCarousel: document.getElementById('favorites-carousel')
    };

    // ========== RENDER FUNCTIONS ==========
    function renderFavoritesSection() {
        const favorites = getFavorites();
        if (favorites.length === 0) {
            if (elements.favoritesSection) elements.favoritesSection.style.display = 'none';
            return;
        }
        if (elements.favoritesSection) elements.favoritesSection.style.display = 'block';
        const favoriteSaints = favorites.map(id => SAINTS.find(s => s.id === id)).filter(Boolean);
        if (elements.favoritesCarousel) {
            elements.favoritesCarousel.innerHTML = favoriteSaints.map(saint => {
                const tradition = TRADITIONS[saint.tradition];
                return `<div class="favorite-saint-card" data-saint="${saint.id}">
                    <div class="avatar" style="background: linear-gradient(135deg, ${tradition.color} 0%, ${tradition.color}99 100%)">${getInitials(saint.name)}</div>
                    <div class="name">${saint.name.split(' ')[0]}</div>
                </div>`;
            }).join('');
            elements.favoritesCarousel.querySelectorAll('.favorite-saint-card').forEach(card => {
                card.addEventListener('click', () => {
                    const saintId = card.dataset.saint;
                    const saint = SAINTS.find(s => s.id === saintId);
                    if (saint) {
                        currentTradition = TRADITIONS[saint.tradition];
                        navigationStack.length = 0;
                        navigationStack.push('home');
                        showSaintDetail(saintId);
                    }
                });
            });
        }
    }

    function getRandomWisdomQuote() {
        const allQuotes = [];
        SAINTS.forEach(saint => {
            if (saint.quotes && saint.quotes.length > 0) {
                saint.quotes.forEach(quote => {
                    allQuotes.push({ quote, saint: saint.name, tradition: saint.tradition });
                });
            }
        });
        return allQuotes[Math.floor(Math.random() * allQuotes.length)];
    }

    function renderWisdomQuote() {
        const quoteData = getRandomWisdomQuote();
        if (elements.wisdomQuote && quoteData) {
            const tradition = TRADITIONS[quoteData.tradition];
            elements.wisdomQuote.innerHTML = `
                <div class="wisdom-quote-icon" style="color: ${tradition.color}"><i class="fa-solid fa-om"></i></div>
                <div class="wisdom-quote-text">${quoteData.quote}</div>
                <div class="wisdom-quote-source">— ${quoteData.saint}</div>
            `;
        }
    }

    async function shareSaint(saint) {
        const shareData = {
            title: `${saint.name} - Sant Darshan`,
            text: `${saint.name} (${saint.nameHi || saint.nameLocal})\n${saint.sampradaya} • ${saint.period}\n\n"${saint.quotes?.[0] || 'Discover the wisdom of this great saint.'}"\n\n🙏 Bharat Sant Darshan`,
            url: window.location.href
        };
        try {
            if (navigator.share) await navigator.share(shareData);
            else {
                await navigator.clipboard.writeText(shareData.text);
                showToast('Copied to clipboard!');
            }
        } catch (err) { console.log('Share cancelled'); }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function init() {
        renderTraditions();
        renderTodaysSaint();
        renderWisdomQuote();
        renderFavoritesSection();
        updateProgressUI();
        elements.totalSaints.textContent = SAINTS.length;
        setupEventListeners();
        setTimeout(showDailyDarshan, 500);
    }

    function renderTodaysSaint() {
        const saint = getTodaysSaint();
        const tradition = TRADITIONS[saint.tradition];
        if (elements.todaySaintCard) {
            elements.todaySaintCard.innerHTML = `
                <div class="today-saint-header"><i class="fa-solid fa-sun"></i><span>आज का संत • Today's Saint</span></div>
                <div class="today-saint-content" data-saint="${saint.id}">
                    <div class="today-saint-avatar" style="background: linear-gradient(135deg, ${tradition.color} 0%, ${tradition.color}99 100%)">${getInitials(saint.name)}</div>
                    <div class="today-saint-info">
                        <div class="today-saint-name">${saint.name}</div>
                        <div class="today-saint-name-local">${saint.nameHi || saint.nameLocal}</div>
                        <div class="today-saint-tradition">${tradition.name} • ${saint.sampradaya}</div>
                    </div>
                    <i class="fa-solid fa-chevron-right today-saint-arrow"></i>
                </div>
            `;
            elements.todaySaintCard.querySelector('.today-saint-content').addEventListener('click', () => {
                currentTradition = tradition;
                navigationStack.length = 0;
                navigationStack.push('home');
                showSaintDetail(saint.id);
            });
        }
    }

    function setupEventListeners() {
        elements.backBtn.addEventListener('click', navigateBack);
        elements.searchBtn.addEventListener('click', openSearch);
        elements.closeSearch.addEventListener('click', closeSearch);
        elements.searchInput.addEventListener('input', handleSearch);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !elements.searchOverlay.classList.contains('hidden')) closeSearch();
        });
    }

    function renderTraditions() {
        const traditionsHtml = Object.values(TRADITIONS).map((tradition, index) => {
            const count = SAINTS.filter(s => s.tradition === tradition.id).length;
            const isLast = index === Object.values(TRADITIONS).length - 1 && Object.values(TRADITIONS).length % 2 !== 0;
            return `<div class="tradition-card ${isLast ? 'full-width' : ''}" style="--tradition-color: ${tradition.color}" data-tradition="${tradition.id}">
                <i class="fa-solid ${tradition.icon} tradition-icon"></i>
                <div class="tradition-name">${tradition.name}</div>
                <div class="tradition-name-hi">${tradition.nameHi}</div>
                <span class="tradition-count">${count} Saints</span>
            </div>`;
        }).join('');
        elements.traditionsGrid.innerHTML = traditionsHtml;
        elements.traditionsGrid.querySelectorAll('.tradition-card').forEach(card => {
            card.addEventListener('click', () => showTradition(card.dataset.tradition));
        });
    }

    function showTradition(traditionId) {
        currentTradition = TRADITIONS[traditionId];
        currentFilter = 'all';
        navigationStack.push('home');
        elements.pageTitle.textContent = currentTradition.nameHi;
        elements.pageSubtitle.textContent = currentTradition.name;
        elements.backBtn.style.visibility = 'visible';
        elements.traditionHeader.innerHTML = `
            <div class="tradition-header-icon" style="background: ${currentTradition.color}20; color: ${currentTradition.color}"><i class="fa-solid ${currentTradition.icon}"></i></div>
            <div class="tradition-header-text"><h2>${currentTradition.name}</h2><p>${currentTradition.description}</p></div>
        `;
        renderSampradayaFilters(traditionId);
        renderSaintsList(traditionId);
        switchScreen('saints-list');
    }

    function renderSampradayaFilters(traditionId) {
        const saints = SAINTS.filter(s => s.tradition === traditionId);
        const sampradayas = [...new Set(saints.map(s => s.sampradaya))];
        let filtersHtml = `<div class="filter-chip active" data-filter="all" style="--tradition-color: ${currentTradition.color}">All</div>`;
        sampradayas.forEach(s => filtersHtml += `<div class="filter-chip" data-filter="${s}" style="--tradition-color: ${currentTradition.color}">${s}</div>`);
        elements.sampradayaFilter.innerHTML = filtersHtml;
        elements.sampradayaFilter.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                elements.sampradayaFilter.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentFilter = chip.dataset.filter;
                renderSaintsList(traditionId);
            });
        });
    }

    function renderSaintsList(traditionId) {
        let saints = SAINTS.filter(s => s.tradition === traditionId);
        if (currentFilter !== 'all') saints = saints.filter(s => s.sampradaya === currentFilter);
        const saintsHtml = saints.map(saint => {
            const explored = isExplored(saint.id);
            return `<div class="saint-card ${explored ? 'explored' : ''}" data-saint="${saint.id}">
                <div class="saint-avatar" style="background: linear-gradient(135deg, ${currentTradition.color} 0%, ${currentTradition.color}99 100%)">${getInitials(saint.name)}</div>
                <div class="saint-info">
                    <div class="saint-name">${saint.name}</div>
                    <div class="saint-name-local">${saint.nameHi || saint.nameLocal}</div>
                    <div class="saint-meta">${saint.period} • ${saint.sampradaya}</div>
                </div>
                ${explored ? '<span class="explored-badge">✓ Explored</span>' : '<span class="new-badge">New</span>'}
                <i class="fa-solid fa-chevron-right saint-arrow"></i>
            </div>`;
        }).join('');
        elements.saintsList.innerHTML = saintsHtml || '<p style="text-align:center; color: var(--text-muted);">No saints found</p>';
        elements.saintsList.querySelectorAll('.saint-card').forEach(card => {
            card.addEventListener('click', () => showSaintDetail(card.dataset.saint));
        });
    }

    function showSaintDetail(saintId) {
        currentSaint = SAINTS.find(s => s.id === saintId);
        if (!currentSaint) return;
        markAsExplored(saintId);
        navigationStack.push('saints-list');
        const tradition = TRADITIONS[currentSaint.tradition];
        const isFav = isFavorite(saintId);
        const notes = getNotes(saintId);
        elements.pageTitle.textContent = currentSaint.nameHi || currentSaint.nameLocal;
        elements.pageSubtitle.textContent = currentSaint.name;
        elements.backBtn.style.visibility = 'visible';
        elements.saintDetailContent.innerHTML = `
            <div class="saint-hero" style="--tradition-color: ${tradition.color}">
                <button id="favorite-btn" class="favorite-btn ${isFav ? 'active' : ''}" aria-label="Add to favorites">
                    <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <div class="saint-avatar-large" style="background: linear-gradient(135deg, ${tradition.color} 0%, ${tradition.color}99 100%)">${getInitials(currentSaint.name)}</div>
                <h1 class="saint-detail-name">${currentSaint.name}</h1>
                <div class="saint-detail-name-local">${currentSaint.nameHi || currentSaint.nameLocal}</div>
                <div class="saint-tags">
                    <span class="saint-tag">${currentSaint.period}</span>
                    <span class="saint-tag">${currentSaint.sampradaya}</span>
                    <span class="saint-tag">${currentSaint.birthPlace}</span>
                </div>
            </div>
            ${currentSaint.quotes?.length > 0 ? `<div class="quote-block"><div class="quote-text">${currentSaint.quotes[0]}</div><div class="quote-source">— ${currentSaint.name}</div></div>` : ''}
            <div class="detail-section">
                <h3 class="detail-section-title"><i class="fa-solid fa-scroll"></i> Biography</h3>
                <div class="detail-section-content">${currentSaint.biography}</div>
            </div>
            ${currentSaint.teachings?.length > 0 ? `<div class="detail-section"><h3 class="detail-section-title"><i class="fa-solid fa-lightbulb"></i> Core Teachings</h3><div class="tags-grid">${currentSaint.teachings.map(t => `<span class="teaching-tag">${t}</span>`).join('')}</div></div>` : ''}
            ${currentSaint.works?.length > 0 ? `<div class="detail-section"><h3 class="detail-section-title"><i class="fa-solid fa-book"></i> Major Works</h3><ul class="detail-list">${currentSaint.works.map(w => `<li>${w}</li>`).join('')}</ul></div>` : ''}
            ${currentSaint.quotes?.length > 1 ? `<div class="detail-section"><h3 class="detail-section-title"><i class="fa-solid fa-quote-left"></i> More Quotes</h3>${currentSaint.quotes.slice(1).map(q => `<div class="quote-block"><div class="quote-text">${q}</div></div>`).join('')}</div>` : ''}
            <div class="notes-section">
                <h3><i class="fa-solid fa-pencil"></i> My Reflections</h3>
                <div class="add-note">
                    <textarea id="new-note-input" placeholder="Write your reflection on ${currentSaint.name}'s teachings..."></textarea>
                    <button class="save-note-btn" id="save-note-btn">Save Reflection</button>
                </div>
                <div id="notes-list" class="notes-list">
                    ${notes.length > 0 ? notes.map(note => `<div class="note-card" data-note-id="${note.id}"><p class="note-text">${note.text}</p><div class="note-meta"><span class="note-date">${new Date(note.createdAt).toLocaleDateString()}</span><button class="delete-note" data-note-id="${note.id}">🗑️</button></div></div>`).join('') : '<p class="notes-empty">No reflections yet. Share your thoughts above.</p>'}
                </div>
            </div>
            <div class="saint-actions">
                <button class="action-btn share-btn" id="share-saint-btn" aria-label="Share this saint"><i class="fa-solid fa-share-nodes"></i><span>Share</span></button>
            </div>
        `;
        const favBtn = document.getElementById('favorite-btn');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                const isNowFav = toggleFavorite(saintId);
                favBtn.classList.toggle('active', isNowFav);
                favBtn.querySelector('i').className = `fa-${isNowFav ? 'solid' : 'regular'} fa-heart`;
                showToast(isNowFav ? 'Added to favorites ❤️' : 'Removed from favorites');
            });
        }
        const saveNoteBtn = document.getElementById('save-note-btn');
        const noteInput = document.getElementById('new-note-input');
        if (saveNoteBtn && noteInput) {
            saveNoteBtn.addEventListener('click', () => {
                const text = noteInput.value.trim();
                if (text) {
                    addNote(saintId, text);
                    noteInput.value = '';
                    showSaintDetail(saintId);
                    showToast('Reflection saved! 📝');
                }
            });
        }
        document.querySelectorAll('.delete-note').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteNote(saintId, btn.dataset.noteId);
                showSaintDetail(saintId);
                showToast('Reflection deleted');
            });
        });
        const shareBtn = elements.saintDetailContent.querySelector('#share-saint-btn');
        if (shareBtn) shareBtn.addEventListener('click', () => shareSaint(currentSaint));
        switchScreen('saint-detail');
        elements.saintDetailContent.scrollIntoView({ behavior: 'smooth' });
    }

    function switchScreen(screenName) {
        currentScreen = screenName;
        elements.homeScreen.classList.remove('active');
        elements.saintsListScreen.classList.remove('active');
        elements.saintDetailScreen.classList.remove('active');
        switch (screenName) {
            case 'home':
                elements.homeScreen.classList.add('active');
                renderFavoritesSection();
                updateProgressUI();
                break;
            case 'saints-list':
                elements.saintsListScreen.classList.add('active');
                break;
            case 'saint-detail':
                elements.saintDetailScreen.classList.add('active');
                break;
        }
    }

    function navigateBack() {
        const previousScreen = navigationStack.pop();
        if (previousScreen === 'home' || !previousScreen) {
            elements.pageTitle.textContent = 'संत दर्शन';
            elements.pageSubtitle.textContent = 'Bharat Sant Darshan';
            elements.backBtn.style.visibility = 'hidden';
            currentTradition = null;
            currentSaint = null;
            switchScreen('home');
        } else if (previousScreen === 'saints-list') {
            elements.pageTitle.textContent = currentTradition.nameHi;
            elements.pageSubtitle.textContent = currentTradition.name;
            currentSaint = null;
            switchScreen('saints-list');
        }
    }

    function openSearch() {
        elements.searchOverlay.classList.remove('hidden');
        elements.searchInput.focus();
    }

    function closeSearch() {
        elements.searchOverlay.classList.add('hidden');
        elements.searchInput.value = '';
        elements.searchResults.innerHTML = '';
    }

    function handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            elements.searchResults.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 40px;">Type at least 2 characters to search</p>';
            return;
        }
        const results = SAINTS.map(saint => {
            const fields = [saint.name, saint.nameHi || '', saint.nameLocal || '', saint.sampradaya, saint.birthPlace, saint.period];
            let maxScore = 0;
            for (const field of fields) {
                const match = fuzzyMatch(field, query);
                if (match.matched && match.score > maxScore) maxScore = match.score;
            }
            return { saint, score: maxScore };
        }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).map(r => r.saint);
        if (results.length === 0) {
            elements.searchResults.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 40px;">No saints found matching your search</p>';
            return;
        }
        elements.searchResults.innerHTML = results.map(saint => {
            const tradition = TRADITIONS[saint.tradition];
            const explored = isExplored(saint.id);
            return `<div class="saint-card ${explored ? 'explored' : ''}" data-saint="${saint.id}" style="margin-bottom: 12px;">
                <div class="saint-avatar" style="background: linear-gradient(135deg, ${tradition.color} 0%, ${tradition.color}99 100%)">${getInitials(saint.name)}</div>
                <div class="saint-info">
                    <div class="saint-name">${saint.name}</div>
                    <div class="saint-name-local">${saint.nameHi || saint.nameLocal}</div>
                    <div class="saint-meta">${tradition.name} • ${saint.sampradaya}</div>
                </div>
                ${explored ? '<span class="explored-badge">✓</span>' : ''}
                <i class="fa-solid fa-chevron-right saint-arrow"></i>
            </div>`;
        }).join('');
        elements.searchResults.querySelectorAll('.saint-card').forEach(card => {
            card.addEventListener('click', () => {
                const saintId = card.dataset.saint;
                closeSearch();
                const saint = SAINTS.find(s => s.id === saintId);
                if (saint) {
                    currentTradition = TRADITIONS[saint.tradition];
                    navigationStack.length = 0;
                    navigationStack.push('home');
                    showSaintDetail(saintId);
                }
            });
        });
    }

    function getInitials(name) {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
