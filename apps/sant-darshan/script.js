// Sant Darshan - Application Logic
// Navigate spiritually through the saints of Sanatan Dharma

(function () {
    'use strict';

    // State
    let currentScreen = 'home';
    let currentTradition = null;
    let currentSaint = null;
    let currentFilter = 'all';
    const navigationStack = [];

    // ========== FUZZY SEARCH ALGORITHM ==========
    function fuzzyMatch(text, query) {
        if (!text || !query) return { score: 0, matched: false };

        text = text.toLowerCase();
        query = query.toLowerCase();

        // Direct match gets highest score
        if (text.includes(query)) {
            return { score: 100, matched: true };
        }

        // Levenshtein distance for typo tolerance
        const distance = levenshtein(text, query);
        const maxLen = Math.max(text.length, query.length);
        const similarity = ((maxLen - distance) / maxLen) * 100;

        // Consider it a match if similarity is above 60%
        if (similarity > 60) {
            return { score: similarity, matched: true };
        }

        // Check if query words exist in text (partial word matching)
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

        if (matchedWords > 0) {
            return { score: (matchedWords / queryWords.length) * 70, matched: true };
        }

        return { score: 0, matched: false };
    }

    // Levenshtein distance for typo tolerance
    function levenshtein(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    // ========== TODAY'S SAINT FEATURE ==========
    function getTodaysSaint() {
        // Use date to get a consistent "saint of the day"
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        const saintIndex = dayOfYear % SAINTS.length;
        return SAINTS[saintIndex];
    }

    // DOM Elements
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
        wisdomQuote: document.getElementById('wisdom-quote')
    };

    // ========== WISDOM QUOTES FEATURE ==========
    function getRandomWisdomQuote() {
        // Collect all quotes from all saints
        const allQuotes = [];
        SAINTS.forEach(saint => {
            if (saint.quotes && saint.quotes.length > 0) {
                saint.quotes.forEach(quote => {
                    allQuotes.push({ quote, saint: saint.name, tradition: saint.tradition });
                });
            }
        });

        // Return a random quote
        const randomIndex = Math.floor(Math.random() * allQuotes.length);
        return allQuotes[randomIndex];
    }

    function renderWisdomQuote() {
        const quoteData = getRandomWisdomQuote();
        if (elements.wisdomQuote && quoteData) {
            const tradition = TRADITIONS[quoteData.tradition];
            elements.wisdomQuote.innerHTML = `
                <div class="wisdom-quote-icon" style="color: ${tradition.color}">
                    <i class="fa-solid fa-om"></i>
                </div>
                <div class="wisdom-quote-text">${quoteData.quote}</div>
                <div class="wisdom-quote-source">— ${quoteData.saint}</div>
            `;
        }
    }

    // ========== SHARE FEATURE ==========
    async function shareSaint(saint) {
        const tradition = TRADITIONS[saint.tradition];
        const shareData = {
            title: `${saint.name} - Sant Darshan`,
            text: `${saint.name} (${saint.nameHi || saint.nameLocal})\n${saint.sampradaya} • ${saint.period}\n\n"${saint.quotes?.[0] || 'Discover the wisdom of this great saint.'}"\n\n🙏 Bharat Sant Darshan`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(shareData.text);
                showToast('Copied to clipboard!');
            }
        } catch (err) {
            console.log('Share cancelled');
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // Initialize
    function init() {
        renderTraditions();
        renderTodaysSaint();
        renderWisdomQuote();
        elements.totalSaints.textContent = SAINTS.length;
        setupEventListeners();
    }

    // Render Today's Saint
    function renderTodaysSaint() {
        const saint = getTodaysSaint();
        const tradition = TRADITIONS[saint.tradition];

        if (elements.todaySaintCard) {
            elements.todaySaintCard.innerHTML = `
                <div class="today-saint-header">
                    <i class="fa-solid fa-sun"></i>
                    <span>आज का संत • Today's Saint</span>
                </div>
                <div class="today-saint-content" data-saint="${saint.id}">
                    <div class="today-saint-avatar" style="background: linear-gradient(135deg, ${tradition.color} 0%, ${tradition.color}99 100%)">
                        ${getInitials(saint.name)}
                    </div>
                    <div class="today-saint-info">
                        <div class="today-saint-name">${saint.name}</div>
                        <div class="today-saint-name-local">${saint.nameHi || saint.nameLocal}</div>
                        <div class="today-saint-tradition">${tradition.name} • ${saint.sampradaya}</div>
                    </div>
                    <i class="fa-solid fa-chevron-right today-saint-arrow"></i>
                </div>
            `;

            // Add click handler
            elements.todaySaintCard.querySelector('.today-saint-content').addEventListener('click', () => {
                currentTradition = tradition;
                navigationStack.length = 0;
                navigationStack.push('home');
                showSaintDetail(saint.id);
            });
        }
    }

    // Event Listeners
    function setupEventListeners() {
        elements.backBtn.addEventListener('click', navigateBack);
        elements.searchBtn.addEventListener('click', openSearch);
        elements.closeSearch.addEventListener('click', closeSearch);
        elements.searchInput.addEventListener('input', handleSearch);

        // Close search on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !elements.searchOverlay.classList.contains('hidden')) {
                closeSearch();
            }
        });
    }

    // Render Traditions Grid
    function renderTraditions() {
        const traditionsHtml = Object.values(TRADITIONS).map((tradition, index) => {
            const count = SAINTS.filter(s => s.tradition === tradition.id).length;
            const isLast = index === Object.values(TRADITIONS).length - 1 && Object.values(TRADITIONS).length % 2 !== 0;

            return `
                <div class="tradition-card ${isLast ? 'full-width' : ''}" 
                     style="--tradition-color: ${tradition.color}"
                     data-tradition="${tradition.id}">
                    <i class="fa-solid ${tradition.icon} tradition-icon"></i>
                    <div class="tradition-name">${tradition.name}</div>
                    <div class="tradition-name-hi">${tradition.nameHi}</div>
                    <span class="tradition-count">${count} Saints</span>
                </div>
            `;
        }).join('');

        elements.traditionsGrid.innerHTML = traditionsHtml;

        // Add click handlers
        elements.traditionsGrid.querySelectorAll('.tradition-card').forEach(card => {
            card.addEventListener('click', () => {
                const traditionId = card.dataset.tradition;
                showTradition(traditionId);
            });
        });
    }

    // Show Tradition (Saints List)
    function showTradition(traditionId) {
        currentTradition = TRADITIONS[traditionId];
        currentFilter = 'all';
        navigationStack.push('home');

        // Update header
        elements.pageTitle.textContent = currentTradition.nameHi;
        elements.pageSubtitle.textContent = currentTradition.name;
        elements.backBtn.style.visibility = 'visible';

        // Render tradition header
        elements.traditionHeader.innerHTML = `
            <div class="tradition-header-icon" style="background: ${currentTradition.color}20; color: ${currentTradition.color}">
                <i class="fa-solid ${currentTradition.icon}"></i>
            </div>
            <div class="tradition-header-text">
                <h2>${currentTradition.name}</h2>
                <p>${currentTradition.description}</p>
            </div>
        `;

        // Render sampradaya filters
        renderSampradayaFilters(traditionId);

        // Render saints list
        renderSaintsList(traditionId);

        // Switch screen
        switchScreen('saints-list');
    }

    // Render Sampradaya Filters
    function renderSampradayaFilters(traditionId) {
        const saints = SAINTS.filter(s => s.tradition === traditionId);
        const sampradayas = [...new Set(saints.map(s => s.sampradaya))];

        let filtersHtml = `<div class="filter-chip active" data-filter="all" style="--tradition-color: ${currentTradition.color}">All</div>`;

        sampradayas.forEach(sampradaya => {
            filtersHtml += `<div class="filter-chip" data-filter="${sampradaya}" style="--tradition-color: ${currentTradition.color}">${sampradaya}</div>`;
        });

        elements.sampradayaFilter.innerHTML = filtersHtml;

        // Add click handlers
        elements.sampradayaFilter.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                elements.sampradayaFilter.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentFilter = chip.dataset.filter;
                renderSaintsList(traditionId);
            });
        });
    }

    // Render Saints List
    function renderSaintsList(traditionId) {
        let saints = SAINTS.filter(s => s.tradition === traditionId);

        if (currentFilter !== 'all') {
            saints = saints.filter(s => s.sampradaya === currentFilter);
        }

        const saintsHtml = saints.map(saint => `
            <div class="saint-card" data-saint="${saint.id}">
                <div class="saint-avatar" style="background: linear-gradient(135deg, ${currentTradition.color} 0%, ${currentTradition.color}99 100%)">
                    ${getInitials(saint.name)}
                </div>
                <div class="saint-info">
                    <div class="saint-name">${saint.name}</div>
                    <div class="saint-name-local">${saint.nameHi || saint.nameLocal}</div>
                    <div class="saint-meta">${saint.period} • ${saint.sampradaya}</div>
                </div>
                <i class="fa-solid fa-chevron-right saint-arrow"></i>
            </div>
        `).join('');

        elements.saintsList.innerHTML = saintsHtml || '<p style="text-align:center; color: var(--text-muted);">No saints found</p>';

        // Add click handlers
        elements.saintsList.querySelectorAll('.saint-card').forEach(card => {
            card.addEventListener('click', () => {
                const saintId = card.dataset.saint;
                showSaintDetail(saintId);
            });
        });
    }

    // Show Saint Detail
    function showSaintDetail(saintId) {
        currentSaint = SAINTS.find(s => s.id === saintId);
        if (!currentSaint) return;

        navigationStack.push('saints-list');

        const tradition = TRADITIONS[currentSaint.tradition];

        // Update header
        elements.pageTitle.textContent = currentSaint.nameHi || currentSaint.nameLocal;
        elements.pageSubtitle.textContent = currentSaint.name;
        elements.backBtn.style.visibility = 'visible';

        // Render detail content
        elements.saintDetailContent.innerHTML = `
            <div class="saint-hero" style="--tradition-color: ${tradition.color}">
                <div class="saint-avatar-large" style="background: linear-gradient(135deg, ${tradition.color} 0%, ${tradition.color}99 100%)">
                    ${getInitials(currentSaint.name)}
                </div>
                <h1 class="saint-detail-name">${currentSaint.name}</h1>
                <div class="saint-detail-name-local">${currentSaint.nameHi || currentSaint.nameLocal}</div>
                <div class="saint-tags">
                    <span class="saint-tag">${currentSaint.period}</span>
                    <span class="saint-tag">${currentSaint.sampradaya}</span>
                    <span class="saint-tag">${currentSaint.birthPlace}</span>
                </div>
            </div>
            
            ${currentSaint.quotes && currentSaint.quotes.length > 0 ? `
                <div class="quote-block">
                    <div class="quote-text">${currentSaint.quotes[0]}</div>
                    <div class="quote-source">— ${currentSaint.name}</div>
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h3 class="detail-section-title">
                    <i class="fa-solid fa-scroll"></i>
                    Biography
                </h3>
                <div class="detail-section-content">
                    ${currentSaint.biography}
                </div>
            </div>
            
            ${currentSaint.teachings && currentSaint.teachings.length > 0 ? `
                <div class="detail-section">
                    <h3 class="detail-section-title">
                        <i class="fa-solid fa-lightbulb"></i>
                        Core Teachings
                    </h3>
                    <div class="tags-grid">
                        ${currentSaint.teachings.map(t => `<span class="teaching-tag">${t}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${currentSaint.works && currentSaint.works.length > 0 ? `
                <div class="detail-section">
                    <h3 class="detail-section-title">
                        <i class="fa-solid fa-book"></i>
                        Major Works
                    </h3>
                    <ul class="detail-list">
                        ${currentSaint.works.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${currentSaint.quotes && currentSaint.quotes.length > 1 ? `
                <div class="detail-section">
                    <h3 class="detail-section-title">
                        <i class="fa-solid fa-quote-left"></i>
                        More Quotes
                    </h3>
                    ${currentSaint.quotes.slice(1).map(q => `
                        <div class="quote-block">
                            <div class="quote-text">${q}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <!-- Share & Actions -->
            <div class="saint-actions">
                <button class="action-btn share-btn" id="share-saint-btn" aria-label="Share this saint">
                    <i class="fa-solid fa-share-nodes"></i>
                    <span>Share</span>
                </button>
            </div>
        `;

        // Add share button handler
        const shareBtn = elements.saintDetailContent.querySelector('#share-saint-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => shareSaint(currentSaint));
        }

        // Switch screen
        switchScreen('saint-detail');

        // Scroll to top
        elements.saintDetailContent.scrollIntoView({ behavior: 'smooth' });
    }

    // Screen Navigation
    function switchScreen(screenName) {
        currentScreen = screenName;

        elements.homeScreen.classList.remove('active');
        elements.saintsListScreen.classList.remove('active');
        elements.saintDetailScreen.classList.remove('active');

        switch (screenName) {
            case 'home':
                elements.homeScreen.classList.add('active');
                break;
            case 'saints-list':
                elements.saintsListScreen.classList.add('active');
                break;
            case 'saint-detail':
                elements.saintDetailScreen.classList.add('active');
                break;
        }
    }

    // Navigate Back
    function navigateBack() {
        const previousScreen = navigationStack.pop();

        if (previousScreen === 'home' || !previousScreen) {
            // Go to home
            elements.pageTitle.textContent = 'संत दर्शन';
            elements.pageSubtitle.textContent = 'Bharat Sant Darshan';
            elements.backBtn.style.visibility = 'hidden';
            currentTradition = null;
            currentSaint = null;
            switchScreen('home');
        } else if (previousScreen === 'saints-list') {
            // Go back to saints list
            elements.pageTitle.textContent = currentTradition.nameHi;
            elements.pageSubtitle.textContent = currentTradition.name;
            currentSaint = null;
            switchScreen('saints-list');
        }
    }

    // Search Functions
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

        // Fuzzy search across all searchable fields
        const results = SAINTS.map(saint => {
            const fields = [
                saint.name,
                saint.nameHi || '',
                saint.nameLocal || '',
                saint.sampradaya,
                saint.birthPlace,
                saint.period
            ];

            let maxScore = 0;
            for (const field of fields) {
                const match = fuzzyMatch(field, query);
                if (match.matched && match.score > maxScore) {
                    maxScore = match.score;
                }
            }

            return { saint, score: maxScore };
        }).filter(r => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(r => r.saint);

        if (results.length === 0) {
            elements.searchResults.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 40px;">No saints found matching your search</p>';
            return;
        }

        elements.searchResults.innerHTML = results.map(saint => {
            const tradition = TRADITIONS[saint.tradition];
            return `
                <div class="saint-card" data-saint="${saint.id}" style="margin-bottom: 12px;">
                    <div class="saint-avatar" style="background: linear-gradient(135deg, ${tradition.color} 0%, ${tradition.color}99 100%)">
                        ${getInitials(saint.name)}
                    </div>
                    <div class="saint-info">
                        <div class="saint-name">${saint.name}</div>
                        <div class="saint-name-local">${saint.nameHi || saint.nameLocal}</div>
                        <div class="saint-meta">${tradition.name} • ${saint.sampradaya}</div>
                    </div>
                    <i class="fa-solid fa-chevron-right saint-arrow"></i>
                </div>
            `;
        }).join('');

        // Add click handlers to search results
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

    // Utility Functions
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
