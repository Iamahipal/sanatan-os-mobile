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
            return `<div class="tradition-card" style="--tradition-color: ${tradition.color}" data-tradition="${tradition.id}">
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

        // Scroll to top of main content area after screen switch
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // ========== PHASE 2: QUIZ SYSTEM ==========
    let quizState = {
        questions: [],
        currentIndex: 0,
        score: 0,
        answered: false
    };

    function startQuiz() {
        quizState.questions = generateQuizQuestions(5);
        quizState.currentIndex = 0;
        quizState.score = 0;
        quizState.answered = false;

        const modal = document.getElementById('quiz-modal');
        const resultDiv = document.getElementById('quiz-result');
        const bodyDiv = document.querySelector('.quiz-body');
        const footerDiv = document.querySelector('.quiz-footer');

        if (resultDiv) resultDiv.style.display = 'none';
        if (bodyDiv) bodyDiv.style.display = 'block';
        if (footerDiv) footerDiv.style.display = 'flex';

        if (modal) modal.classList.add('active');
        renderQuizQuestion();
    }

    function renderQuizQuestion() {
        const q = quizState.questions[quizState.currentIndex];
        if (!q) return;

        document.getElementById('quiz-current').textContent = quizState.currentIndex + 1;
        document.getElementById('quiz-question').textContent = q.question;
        document.getElementById('quiz-score').textContent = quizState.score;
        document.getElementById('quiz-next').style.display = 'none';
        quizState.answered = false;

        const optionsDiv = document.getElementById('quiz-options');
        optionsDiv.innerHTML = q.options.map((opt, i) => `
            <button class="quiz-option" data-id="${opt.id}" data-index="${i}">${opt.text}</button>
        `).join('');

        optionsDiv.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => handleQuizAnswer(btn, q));
        });
    }

    function handleQuizAnswer(btn, question) {
        if (quizState.answered) return;
        quizState.answered = true;

        const selectedId = btn.dataset.id;
        const isCorrect = selectedId === question.correctId;

        if (isCorrect) {
            btn.classList.add('correct');
            quizState.score++;
            document.getElementById('quiz-score').textContent = quizState.score;
        } else {
            btn.classList.add('wrong');
            // Highlight correct answer
            document.querySelectorAll('.quiz-option').forEach(opt => {
                if (opt.dataset.id === question.correctId) {
                    opt.classList.add('correct');
                }
            });
        }

        // Disable all options
        document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.add('disabled'));

        // Show next button or result
        if (quizState.currentIndex < quizState.questions.length - 1) {
            document.getElementById('quiz-next').style.display = 'block';
        } else {
            setTimeout(showQuizResult, 800);
        }
    }

    function nextQuizQuestion() {
        quizState.currentIndex++;
        renderQuizQuestion();
    }

    function showQuizResult() {
        const total = quizState.questions.length;
        const score = quizState.score;
        const percent = Math.round((score / total) * 100);

        document.querySelector('.quiz-body').style.display = 'none';
        document.querySelector('.quiz-footer').style.display = 'none';

        const resultDiv = document.getElementById('quiz-result');
        resultDiv.style.display = 'block';

        document.getElementById('result-correct').textContent = score;
        document.getElementById('result-percent').textContent = percent;

        let title, message, icon;
        if (percent === 100) {
            title = 'Perfect! 🎉';
            message = 'You are a true spiritual scholar!';
            icon = '🏆';
        } else if (percent >= 80) {
            title = 'Excellent!';
            message = 'Your devotion shines through!';
            icon = '🌟';
        } else if (percent >= 60) {
            title = 'Good Job!';
            message = 'Keep exploring the saints!';
            icon = '✨';
        } else {
            title = 'Keep Learning!';
            message = 'Every saint was once a student.';
            icon = '📚';
        }

        document.getElementById('result-title').textContent = title;
        document.getElementById('result-message').textContent = message;
        document.querySelector('.result-icon').textContent = icon;

        // Update quiz stats
        const data = getStorageData();
        if (!data.quizStats) data.quizStats = { totalCompleted: 0, perfectScores: 0 };
        data.quizStats.totalCompleted++;
        if (percent === 100) data.quizStats.perfectScores++;
        saveStorageData(data);

        checkAchievements();
    }

    function closeQuiz() {
        document.getElementById('quiz-modal').classList.remove('active');
    }

    // ========== PHASE 2: ACHIEVEMENTS SYSTEM ==========
    function getUnlockedAchievements() {
        const data = getStorageData();
        return (data.unlockedAchievements || []);
    }

    function checkAchievements() {
        const data = getStorageData();
        const unlocked = data.unlockedAchievements || [];
        let newUnlocks = [];

        ACHIEVEMENTS.forEach(ach => {
            if (!unlocked.includes(ach.id) && ach.condition(data)) {
                unlocked.push(ach.id);
                newUnlocks.push(ach);
            }
        });

        if (newUnlocks.length > 0) {
            data.unlockedAchievements = unlocked;
            saveStorageData(data);

            // Show toast for first new unlock
            showAchievementToast(newUnlocks[0]);
        }

        updateAchievementsPreview();
    }

    function showAchievementToast(achievement) {
        const toast = document.getElementById('achievement-toast');
        document.getElementById('toast-icon').textContent = achievement.icon;
        document.getElementById('toast-name').textContent = achievement.name;

        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    function updateAchievementsPreview() {
        const unlocked = getUnlockedAchievements().length;
        const preview = document.getElementById('achievements-preview');
        if (preview) preview.textContent = `${unlocked} Unlocked`;
    }

    function openAchievements() {
        renderAchievementsList();
        document.getElementById('achievements-modal').classList.add('active');
    }

    function closeAchievements() {
        document.getElementById('achievements-modal').classList.remove('active');
    }

    function renderAchievementsList() {
        const unlocked = getUnlockedAchievements();
        const listDiv = document.getElementById('achievements-list');

        document.getElementById('unlocked-count').textContent = unlocked.length;
        document.getElementById('total-badges').textContent = ACHIEVEMENTS.length;

        listDiv.innerHTML = ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon-wrapper">${ach.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${ach.name}</div>
                        <div class="achievement-name-hi">${ach.nameHi}</div>
                        <div class="achievement-desc">${ach.description}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ========== PHASE 2: STORIES RENDERING ==========
    function renderStoriesSection(saintId) {
        const stories = SAINT_STORIES[saintId];
        if (!stories || stories.length === 0) return '';

        const storyIcons = {
            origin: '🌅',
            teaching: '📖',
            miracle: '✨',
            death: '🙏'
        };

        return `
            <div class="stories-section">
                <h3><i class="fa-solid fa-book-open"></i> Life Stories</h3>
                <div class="stories-timeline">
                    ${stories.map(story => `
                        <div class="story-card" data-story="${story.id}">
                            <div class="story-header">
                                <div class="story-type-icon ${story.type}">${storyIcons[story.type] || '📜'}</div>
                                <div>
                                    <div class="story-title">${story.title}</div>
                                    ${story.titleHi ? `<div class="story-title-hi">${story.titleHi}</div>` : ''}
                                </div>
                            </div>
                            <p class="story-preview">${story.content.substring(0, 100)}...</p>
                        </div>
                        <div class="story-expanded" id="story-${story.id}" style="display:none;">
                            <div class="story-content">${story.content}</div>
                            <div class="story-lesson">
                                <div class="story-lesson-label">Lesson</div>
                                <div class="story-lesson-text">${story.lesson}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function setupStoryListeners() {
        document.querySelectorAll('.story-card').forEach(card => {
            card.addEventListener('click', () => {
                const storyId = card.dataset.story;
                const expandedDiv = document.getElementById(`story-${storyId}`);
                if (expandedDiv) {
                    const isVisible = expandedDiv.style.display !== 'none';
                    // Close all
                    document.querySelectorAll('.story-expanded').forEach(s => s.style.display = 'none');
                    // Toggle clicked
                    expandedDiv.style.display = isVisible ? 'none' : 'block';
                }
            });
        });
    }

    // ========== PHASE 2: CONNECTIONS RENDERING ==========
    function renderConnectionsSection(saintId) {
        const connections = SAINT_CONNECTIONS[saintId];
        if (!connections) return '';

        const findSaint = (id) => SAINTS.find(s => s.id === id);

        const renderConnectedSaints = (ids, label) => {
            if (!ids || ids.length === 0) return '';
            const validSaints = ids.map(findSaint).filter(Boolean);
            if (validSaints.length === 0) return '';

            return `
                <div class="connection-group">
                    <div class="connection-label">${label}</div>
                    <div class="connected-saints">
                        ${validSaints.map(saint => {
                const tradition = TRADITIONS[saint.tradition];
                return `
                                <div class="mini-saint-card" data-saint="${saint.id}">
                                    <div class="mini-saint-avatar" style="background: ${tradition.color}">${getInitials(saint.name)}</div>
                                    <span class="mini-saint-name">${saint.name}</span>
                                </div>
                            `;
            }).join('')}
                    </div>
                </div>
            `;
        };

        // Guru connection
        let guruHtml = '';
        if (connections.guru) {
            const guru = findSaint(connections.guru);
            if (guru) {
                const tradition = TRADITIONS[guru.tradition];
                guruHtml = `
                    <div class="connection-group">
                        <div class="connection-label">🙏 Guru</div>
                        <div class="connected-saints">
                            <div class="mini-saint-card" data-saint="${guru.id}">
                                <div class="mini-saint-avatar" style="background: ${tradition.color}">${getInitials(guru.name)}</div>
                                <span class="mini-saint-name">${guru.name}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        const shishyasHtml = renderConnectedSaints(connections.shishyas, '🎓 Disciples');
        const contemporariesHtml = renderConnectedSaints(connections.contemporaries, '🤝 Contemporaries');
        const influencedHtml = renderConnectedSaints(connections.influenced, '✨ Influenced');

        if (!guruHtml && !shishyasHtml && !contemporariesHtml && !influencedHtml) return '';

        return `
            <div class="connections-section">
                <h3><i class="fa-solid fa-link"></i> Spiritual Lineage</h3>
                ${guruHtml}${shishyasHtml}${contemporariesHtml}${influencedHtml}
            </div>
        `;
    }

    function setupConnectionListeners() {
        document.querySelectorAll('.mini-saint-card').forEach(card => {
            card.addEventListener('click', () => {
                const saintId = card.dataset.saint;
                const saint = SAINTS.find(s => s.id === saintId);
                if (saint) {
                    currentTradition = TRADITIONS[saint.tradition];
                    showSaintDetail(saintId);
                }
            });
        });
    }

    // ========== UPDATE showSaintDetail for Phase 2 ==========
    const originalShowSaintDetail = showSaintDetail;
    showSaintDetail = function (saintId) {
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

        // Phase 2: Add stories and connections
        const storiesHtml = renderStoriesSection(saintId);
        const connectionsHtml = renderConnectionsSection(saintId);

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
            ${storiesHtml}
            ${currentSaint.teachings?.length > 0 ? `<div class="detail-section"><h3 class="detail-section-title"><i class="fa-solid fa-lightbulb"></i> Core Teachings</h3><div class="tags-grid">${currentSaint.teachings.map(t => `<span class="teaching-tag">${t}</span>`).join('')}</div></div>` : ''}
            ${currentSaint.works?.length > 0 ? `<div class="detail-section"><h3 class="detail-section-title"><i class="fa-solid fa-book"></i> Major Works</h3><ul class="detail-list">${currentSaint.works.map(w => `<li>${w}</li>`).join('')}</ul></div>` : ''}
            ${currentSaint.quotes?.length > 1 ? `<div class="detail-section"><h3 class="detail-section-title"><i class="fa-solid fa-quote-left"></i> More Quotes</h3>${currentSaint.quotes.slice(1).map(q => `<div class="quote-block"><div class="quote-text">${q}</div></div>`).join('')}</div>` : ''}
            ${connectionsHtml}
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

        // Setup event listeners
        const favBtn = document.getElementById('favorite-btn');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                const isNowFav = toggleFavorite(saintId);
                favBtn.classList.toggle('active', isNowFav);
                favBtn.querySelector('i').className = `fa-${isNowFav ? 'solid' : 'regular'} fa-heart`;
                showToast(isNowFav ? 'Added to favorites ❤️' : 'Removed from favorites');
                checkAchievements();
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
                    checkAchievements();
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

        // Phase 2 listeners
        setupStoryListeners();
        setupConnectionListeners();

        switchScreen('saint-detail');
        elements.saintDetailContent.scrollIntoView({ behavior: 'smooth' });
        checkAchievements();
    };

    // ========== PHASE 2: Event Listeners ==========
    function setupPhase2Listeners() {
        // Quiz
        const quizBtn = document.getElementById('open-quiz-btn');
        if (quizBtn) quizBtn.addEventListener('click', startQuiz);

        const closeQuizBtn = document.getElementById('close-quiz');
        if (closeQuizBtn) closeQuizBtn.addEventListener('click', closeQuiz);

        const nextBtn = document.getElementById('quiz-next');
        if (nextBtn) nextBtn.addEventListener('click', nextQuizQuestion);

        const restartBtn = document.getElementById('quiz-restart');
        if (restartBtn) restartBtn.addEventListener('click', startQuiz);

        const closeFinalBtn = document.getElementById('quiz-close-final');
        if (closeFinalBtn) closeFinalBtn.addEventListener('click', closeQuiz);

        // Achievements
        const achievementsBtn = document.getElementById('open-achievements-btn');
        if (achievementsBtn) achievementsBtn.addEventListener('click', openAchievements);

        const closeAchievementsBtn = document.getElementById('close-achievements');
        if (closeAchievementsBtn) closeAchievementsBtn.addEventListener('click', closeAchievements);
    }

    // ========== PHASE 3: LEARNING PATHS ==========
    function getPathProgress() {
        const data = getStorageData();
        return data.pathProgress || {};
    }

    function savePathProgress(pathId, saintIndex) {
        const data = getStorageData();
        if (!data.pathProgress) data.pathProgress = {};
        if (!data.pathProgress[pathId]) data.pathProgress[pathId] = { completed: [], currentIndex: 0 };
        data.pathProgress[pathId].currentIndex = saintIndex;
        saveStorageData(data);
    }

    function markPathSaintCompleted(pathId, saintId) {
        const data = getStorageData();
        if (!data.pathProgress) data.pathProgress = {};
        if (!data.pathProgress[pathId]) data.pathProgress[pathId] = { completed: [], currentIndex: 0 };
        if (!data.pathProgress[pathId].completed.includes(saintId)) {
            data.pathProgress[pathId].completed.push(saintId);
        }
        saveStorageData(data);
        checkAchievements();
    }

    function openPaths() {
        renderPathsList();
        document.getElementById('paths-modal').classList.add('active');
    }

    function closePaths() {
        document.getElementById('paths-modal').classList.remove('active');
    }

    function renderPathsList() {
        const progress = getPathProgress();
        const listDiv = document.getElementById('paths-list');

        listDiv.innerHTML = LEARNING_PATHS.map(path => {
            const pathProgress = progress[path.id] || { completed: [], currentIndex: 0 };
            const completedCount = pathProgress.completed.length;
            const totalSaints = path.saints.length;
            const isComplete = completedCount >= totalSaints;

            const dots = path.saints.map((saintId, i) => {
                const isCompleted = pathProgress.completed.includes(saintId);
                const isCurrent = i === pathProgress.currentIndex && !isCompleted;
                return `<span class="${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">●</span>`;
            }).join('');

            return `
                <div class="path-card" data-path="${path.id}">
                    <div class="path-header">
                        <div class="path-icon" style="background: ${path.color}22">${path.icon}</div>
                        <div>
                            <div class="path-title">${path.title}</div>
                            <div class="path-title-hi">${path.titleHi}</div>
                        </div>
                    </div>
                    <p class="path-description">${path.description}</p>
                    <div class="path-meta">
                        <span class="path-duration">⏱️ ${path.duration}</span>
                        <div class="path-progress">
                            <div class="progress-dots">${dots}</div>
                            <span class="path-progress-text">${completedCount}/${totalSaints}</span>
                        </div>
                    </div>
                    <button class="start-path-btn" data-path="${path.id}">
                        ${isComplete ? '✅ Completed' : completedCount > 0 ? `Continue Day ${completedCount + 1}` : 'Start Journey'}
                    </button>
                </div>
            `;
        }).join('');

        // Add click listeners
        listDiv.querySelectorAll('.start-path-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pathId = btn.dataset.path;
                startPath(pathId);
            });
        });
    }

    function startPath(pathId) {
        const path = LEARNING_PATHS.find(p => p.id === pathId);
        if (!path) return;

        const progress = getPathProgress()[pathId] || { completed: [], currentIndex: 0 };
        let nextSaintIndex = progress.completed.length;
        if (nextSaintIndex >= path.saints.length) nextSaintIndex = 0; // Restart if complete

        const saintId = path.saints[nextSaintIndex];
        const saint = SAINTS.find(s => s.id === saintId);

        if (saint) {
            closePaths();
            currentTradition = TRADITIONS[saint.tradition];
            savePathProgress(pathId, nextSaintIndex);
            markPathSaintCompleted(pathId, saintId);
            showSaintDetail(saintId);
        }
    }

    // ========== PHASE 3: DAILY JOURNAL ==========
    function getJournalEntries() {
        const data = getStorageData();
        return data.journal || {};
    }

    function saveJournalEntry(date, text) {
        const data = getStorageData();
        if (!data.journal) data.journal = {};
        data.journal[date] = {
            text: text,
            createdAt: Date.now()
        };
        saveStorageData(data);
        checkAchievements();
    }

    function getTodaysPrompt() {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        return JOURNAL_PROMPTS[dayOfYear % JOURNAL_PROMPTS.length];
    }

    function openJournal() {
        const today = new Date().toISOString().split('T')[0];
        const entries = getJournalEntries();

        // Set date
        document.getElementById('journal-date').textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric'
        });

        // Set prompt
        document.getElementById('journal-prompt').textContent = getTodaysPrompt();

        // Load today's entry if exists
        const todayEntry = entries[today];
        document.getElementById('journal-text').value = todayEntry ? todayEntry.text : '';

        // Render calendar
        renderJournalCalendar();

        // Render past entries
        renderPastEntries();

        document.getElementById('journal-modal').classList.add('active');
    }

    function closeJournal() {
        document.getElementById('journal-modal').classList.remove('active');
    }

    function saveJournal() {
        const text = document.getElementById('journal-text').value.trim();
        if (!text) return;

        const today = new Date().toISOString().split('T')[0];
        saveJournalEntry(today, text);
        showToast('Reflection saved! 📝');
        renderJournalCalendar();
        renderPastEntries();
    }

    function renderJournalCalendar() {
        const entries = getJournalEntries();
        const today = new Date();
        const calendarGrid = document.getElementById('calendar-grid');

        // Show last 28 days
        const days = [];
        for (let i = 27; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const hasEntry = entries[dateStr];
            const isToday = i === 0;

            days.push(`
                <div class="calendar-day ${hasEntry ? 'has-entry' : ''} ${isToday ? 'today' : ''}" 
                     data-date="${dateStr}" title="${date.toLocaleDateString()}">
                    ${date.getDate()}
                </div>
            `);
        }

        calendarGrid.innerHTML = days.join('');
    }

    function renderPastEntries() {
        const entries = getJournalEntries();
        const entriesDiv = document.getElementById('past-entries');

        const sortedDates = Object.keys(entries).sort().reverse().slice(0, 5);

        if (sortedDates.length === 0) {
            entriesDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 16px;">No entries yet. Start your reflection journey today!</p>';
            return;
        }

        entriesDiv.innerHTML = sortedDates.map(date => {
            const entry = entries[date];
            return `
                <div class="past-entry">
                    <div class="past-entry-date">${new Date(date).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            })}</div>
                    <div class="past-entry-text">${entry.text.substring(0, 150)}${entry.text.length > 150 ? '...' : ''}</div>
                </div>
            `;
        }).join('');
    }

    // ========== PHASE 3: SHARE CARD ==========
    let currentCardStyle = 'minimal';
    let currentShareQuote = null;
    let currentShareSaint = null;

    function openShareCard(saint, quote) {
        currentShareSaint = saint;
        currentShareQuote = quote || (saint.quotes && saint.quotes[0]) || '"Walk the path of devotion."';
        currentCardStyle = 'minimal';

        // Reset style buttons
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.style === 'minimal');
        });

        renderQuoteCard();
        document.getElementById('share-modal').classList.add('active');
    }

    function closeShare() {
        document.getElementById('share-modal').classList.remove('active');
    }

    function renderQuoteCard() {
        const canvas = document.getElementById('quote-canvas');
        const ctx = canvas.getContext('2d');
        const style = CARD_STYLES[currentCardStyle];

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        if (style.background.includes('gradient')) {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            if (currentCardStyle === 'ornate') {
                gradient.addColorStop(0, '#FFF8E7');
                gradient.addColorStop(1, '#FFE4B5');
            } else {
                gradient.addColorStop(0, '#1a1a3e');
                gradient.addColorStop(1, '#2a2a4e');
            }
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = style.background;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw decorative border for ornate
        if (style.pattern) {
            ctx.strokeStyle = style.accentColor;
            ctx.lineWidth = 3;
            ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
            ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
        }

        // Draw accent line
        ctx.fillStyle = style.accentColor;
        ctx.fillRect(canvas.width / 2 - 40, 80, 80, 4);

        // Draw quote
        ctx.fillStyle = style.textColor;
        ctx.font = '24px "Tiro Devanagari Sanskrit", serif';
        ctx.textAlign = 'center';

        // Word wrap quote
        const words = currentShareQuote.replace(/"/g, '').split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > canvas.width - 100) {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine);

        // Draw each line
        const lineHeight = 36;
        const startY = (canvas.height - lines.length * lineHeight) / 2;
        lines.forEach((line, i) => {
            ctx.fillText(line.trim(), canvas.width / 2, startY + i * lineHeight);
        });

        // Draw saint name
        ctx.fillStyle = style.accentColor;
        ctx.font = 'bold 20px "Outfit", sans-serif';
        ctx.fillText(`— ${currentShareSaint.name}`, canvas.width / 2, canvas.height - 120);

        // Draw Hindi name
        if (currentShareSaint.nameHi) {
            ctx.font = '18px "Tiro Devanagari Sanskrit", serif';
            ctx.fillText(currentShareSaint.nameHi, canvas.width / 2, canvas.height - 90);
        }

        // Draw watermark
        ctx.fillStyle = style.textColor + '40';
        ctx.font = '12px "Outfit", sans-serif';
        ctx.fillText('Sant Darshan • भारत संत दर्शन', canvas.width / 2, canvas.height - 30);
    }

    function downloadCard() {
        const canvas = document.getElementById('quote-canvas');
        const link = document.createElement('a');
        link.download = `${currentShareSaint.name.replace(/\s+/g, '_')}_quote.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('Card downloaded! 📥');
    }

    async function shareCard() {
        const canvas = document.getElementById('quote-canvas');

        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'sant-darshan-quote.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `${currentShareSaint.name} Quote`,
                    text: currentShareQuote
                });
            } else {
                // Fallback to download
                downloadCard();
            }
        } catch (err) {
            downloadCard();
        }
    }

    // ========== PHASE 3: Event Listeners ==========
    function setupPhase3Listeners() {
        // Paths
        const pathsBtn = document.getElementById('open-paths-btn');
        if (pathsBtn) pathsBtn.addEventListener('click', openPaths);

        const closePathsBtn = document.getElementById('close-paths');
        if (closePathsBtn) closePathsBtn.addEventListener('click', closePaths);

        // Journal
        const journalBtn = document.getElementById('open-journal-btn');
        if (journalBtn) journalBtn.addEventListener('click', openJournal);

        const closeJournalBtn = document.getElementById('close-journal');
        if (closeJournalBtn) closeJournalBtn.addEventListener('click', closeJournal);

        const saveJournalBtn = document.getElementById('save-journal');
        if (saveJournalBtn) saveJournalBtn.addEventListener('click', saveJournal);

        // Share Card
        const closeShareBtn = document.getElementById('close-share');
        if (closeShareBtn) closeShareBtn.addEventListener('click', closeShare);

        const downloadBtn = document.getElementById('download-card');
        if (downloadBtn) downloadBtn.addEventListener('click', downloadCard);

        const shareBtn = document.getElementById('share-card');
        if (shareBtn) shareBtn.addEventListener('click', shareCard);

        // Style buttons
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCardStyle = btn.dataset.style;
                renderQuoteCard();
            });
        });
    }

    // Make openShareCard available for saint detail page
    window.openShareCard = openShareCard;

    // ========== PHASE 4: PILGRIMAGE MAP ==========
    function openPilgrimage() {
        renderPilgrimageList();
        document.getElementById('pilgrimage-modal').classList.add('active');
    }

    function closePilgrimage() {
        document.getElementById('pilgrimage-modal').classList.remove('active');
    }

    function renderPilgrimageList() {
        const listDiv = document.getElementById('pilgrimage-list');
        const placeTypeIcons = {
            birthplace: '🌅',
            samadhi: '🙏',
            sadhana: '🧘',
            temple: '🛕',
            residence: '🏠',
            miracle: '✨',
            creation: '🏗️',
            marriage: '💒',
            nirvan: '☸️'
        };

        let html = '';
        Object.keys(SAINT_PLACES).forEach(saintId => {
            const saint = SAINTS.find(s => s.id === saintId);
            if (!saint) return;

            const places = SAINT_PLACES[saintId];
            html += `
                <div class="place-group">
                    <div class="place-group-title">${saint.name} • ${saint.nameHi || ''}</div>
                    ${places.map(place => `
                        <div class="place-card">
                            <div class="place-header">
                                <div class="place-type-icon ${place.type}">${placeTypeIcons[place.type] || '📍'}</div>
                                <div>
                                    <div class="place-name">${place.name}</div>
                                    <div class="place-location">${place.city}, ${place.state}</div>
                                </div>
                            </div>
                            <p class="place-description">${place.description}</p>
                            ${place.temple ? `<div class="place-temple"><i class="fa-solid fa-place-of-worship"></i> ${place.temple}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        });

        listDiv.innerHTML = html;
    }

    // ========== PHASE 4: JAYANTI CALENDAR ==========
    function openJayanti() {
        renderJayantiList();
        document.getElementById('jayanti-modal').classList.add('active');
    }

    function closeJayanti() {
        document.getElementById('jayanti-modal').classList.remove('active');
    }

    function renderJayantiList() {
        const listDiv = document.getElementById('jayanti-list');
        const monthTitle = document.getElementById('jayanti-month-title');

        const upcoming = getUpcomingJayantis(365); // Get all in the next year
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        monthTitle.textContent = `Upcoming Jayantis (${upcoming.length})`;

        if (upcoming.length === 0) {
            listDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No upcoming jayantis found.</p>';
            return;
        }

        listDiv.innerHTML = upcoming.map(j => {
            const saint = SAINTS.find(s => s.id === j.saintId);
            const isToday = j.daysUntil === 0;
            const daysText = isToday ? '🎉 Today!' : j.daysUntil === 1 ? 'Tomorrow!' : `In ${j.daysUntil} days`;

            return `
                <div class="jayanti-card ${isToday ? 'today' : ''}" data-saint="${j.saintId}">
                    <div class="jayanti-date-badge">
                        <span class="day">${j.day}</span>
                        <span class="month">${months[j.month - 1]}</span>
                    </div>
                    <div class="jayanti-info">
                        <div class="jayanti-name">${j.name}</div>
                        <div class="jayanti-name-hi">${j.nameHi}</div>
                        <div class="jayanti-timing">${j.description}</div>
                        <div class="days-until">${daysText}</div>
                        <div class="jayanti-celebrations">
                            ${j.celebrations.slice(0, 2).map(c => `<span class="celebration-tag">${c}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click to navigate to saint
        listDiv.querySelectorAll('.jayanti-card').forEach(card => {
            card.addEventListener('click', () => {
                const saintId = card.dataset.saint;
                const saint = SAINTS.find(s => s.id === saintId);
                if (saint) {
                    closeJayanti();
                    currentTradition = TRADITIONS[saint.tradition];
                    navigationStack.length = 0;
                    navigationStack.push('home');
                    showSaintDetail(saintId);
                }
            });
        });
    }

    // ========== PHASE 4: Event Listeners ==========
    function setupPhase4Listeners() {
        // Pilgrimage
        const pilgrimageBtn = document.getElementById('open-pilgrimage-btn');
        if (pilgrimageBtn) pilgrimageBtn.addEventListener('click', openPilgrimage);

        const closePilgrimageBtn = document.getElementById('close-pilgrimage');
        if (closePilgrimageBtn) closePilgrimageBtn.addEventListener('click', closePilgrimage);

        // Jayanti
        const jayantiBtn = document.getElementById('open-jayanti-btn');
        if (jayantiBtn) jayantiBtn.addEventListener('click', openJayanti);

        const closeJayantiBtn = document.getElementById('close-jayanti');
        if (closeJayantiBtn) closeJayantiBtn.addEventListener('click', closeJayanti);
    }

    // ========== PHASE 3: INTERACTIONS & ALIVE FEEL ==========
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple-wave');

        const existingRipple = button.getElementsByClassName('ripple-wave')[0];
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(circle);
    }

    function setupRippleEffects() {
        const interactiveElements = document.querySelectorAll('.action-card, .btn-primary, .btn-secondary, .saint-card, .tradition-card, .header-btn, .close-modal-btn');
        interactiveElements.forEach(el => {
            el.classList.add('ripple-surface');
            el.addEventListener('click', createRipple);
        });
    }

    function setupScrollObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.tradition-card, .action-card, .today-saint-card, .stats-section, .wisdom-quote-card');
        animatedElements.forEach((el, index) => {
            el.classList.add('reveal-on-scroll');
            // Stagger animations automatically
            if (index % 3 === 0) el.classList.add('delay-100');
            if (index % 3 === 1) el.classList.add('delay-200');
            if (index % 3 === 2) el.classList.add('delay-300');
            observer.observe(el);
        });
    }

    function init() {
        renderTraditions();
        renderTodaysSaint();
        renderWisdomQuote();
        renderFavoritesSection();
        updateProgressUI();
        elements.totalSaints.textContent = SAINTS.length;
        setupEventListeners();
        setupPhase2Listeners();
        setupPhase3Listeners();
        setupPhase4Listeners();
        updateAchievementsPreview();
        checkAchievements();

        // Phase 3 Interactions
        setupRippleEffects();
        setupScrollObserver();

        setTimeout(showDailyDarshan, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
