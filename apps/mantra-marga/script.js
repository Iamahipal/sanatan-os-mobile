/**
 * MantraMarga - App Logic
 * Sacred Sound Science Application
 */

// ===== STATE =====
const state = {
    currentMantra: null,
    currentScreen: 'home',
    currentTrack: 'all',
    currentScript: 'devanagari',
    benefitTab: 'scientific',
    count: 0,
    targetCount: 108,
    sessionStart: null,
    soundEnabled: true,
    vibrationEnabled: true,
    favorites: JSON.parse(localStorage.getItem('mantraMarga_favorites') || '[]'),
    stats: JSON.parse(localStorage.getItem('mantraMarga_stats') || '{"totalSessions":0,"totalCount":0}')
};

// ===== DOM ELEMENTS =====
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderMantras();
    setupEventListeners();
    setFeaturedMantra();
});

// ===== RENDER FUNCTIONS =====
function renderCategories() {
    const grid = $('categoriesGrid');
    grid.innerHTML = MANTRA_CATEGORIES.map(cat => {
        const count = getMantrasByCategory(cat.id).length;
        return `
            <div class="category-card" data-category="${cat.id}" style="border-color: ${cat.color}20">
                <span class="icon">${cat.icon}</span>
                <span class="name">${cat.nameHi}</span>
                <span class="count">${count} mantras</span>
            </div>
        `;
    }).join('');
}

function renderMantras(category = null, searchQuery = null) {
    let mantras = MANTRA_DATABASE;

    if (category) {
        mantras = getMantrasByCategory(category);
    }

    if (searchQuery) {
        mantras = searchMantras(searchQuery);
    }

    const list = $('mantrasList');
    $('mantraCount').textContent = mantras.length;

    list.innerHTML = mantras.map(m => {
        const cat = MANTRA_CATEGORIES.find(c => c.id === m.category);
        const isFav = state.favorites.includes(m.id);
        return `
            <div class="mantra-card" data-id="${m.id}">
                <div class="mantra-icon" style="background: ${cat.color}20; color: ${cat.color}">
                    ${m.name.sanskrit.charAt(0)}
                </div>
                <div class="mantra-info">
                    <div class="mantra-name">${m.name.sanskrit}</div>
                    <div class="mantra-subtitle">${m.name.english} • ${m.deity}</div>
                </div>
                <span class="difficulty-badge ${m.difficulty}">${m.difficulty}</span>
                <svg class="chevron"><use href="#chevron-right"/></svg>
            </div>
        `;
    }).join('');

    // Reinitialize icons
    lucide.createIcons();
}

function setFeaturedMantra() {
    const featured = getFeaturedMantras();
    const mantra = featured[Math.floor(Math.random() * featured.length)] || MANTRA_DATABASE[0];

    const card = $('featuredMantra');
    card.innerHTML = `
        <div class="featured-glow"></div>
        <span class="featured-label">Featured Mantra</span>
        <div class="featured-content">
            <span class="featured-sanskrit">${mantra.name.sanskrit}</span>
            <span class="featured-name">${mantra.name.transliteration} - ${mantra.name.english}</span>
            <span class="featured-benefit">${mantra.benefits.scientific[0]}</span>
        </div>
        <button class="featured-btn">
            <i data-lucide="play"></i>
            Begin Practice
        </button>
    `;
    card.dataset.id = mantra.id;
    lucide.createIcons();
}

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(screenId).classList.add('active');
    state.currentScreen = screenId;
}

function showMantraDetail(mantraId) {
    const mantra = getMantraById(mantraId);
    if (!mantra) return;

    state.currentMantra = mantra;

    // Update header
    $('detailTitle').textContent = mantra.name.sanskrit;
    $('detailSubtitle').textContent = mantra.name.transliteration;

    // Update favorite button
    updateFavoriteBtn();

    // Update mantra text
    updateMantraText();

    // Update meaning
    $('meaningText').textContent = mantra.fullText.meaning;

    // Update benefits
    updateBenefits();

    // Update practice grid
    const practice = mantra.practice;
    $('practiceGrid').innerHTML = `
        <div class="practice-item">
            <span class="label">Repetitions</span>
            <span class="value">${practice.repetitions.join(', ')}</span>
        </div>
        <div class="practice-item">
            <span class="label">Best Time</span>
            <span class="value">${practice.bestTime}</span>
        </div>
        <div class="practice-item">
            <span class="label">Direction</span>
            <span class="value">${practice.direction}</span>
        </div>
        <div class="practice-item">
            <span class="label">Duration</span>
            <span class="value">${practice.duration}</span>
        </div>
    `;

    // Update source info
    $('sourceInfo').innerHTML = `
        <div class="source-item">
            <span class="label">Source</span>
            <span class="value">${mantra.source.text}</span>
        </div>
        <div class="source-item">
            <span class="label">Rishi</span>
            <span class="value">${mantra.rishi}</span>
        </div>
        <div class="source-item">
            <span class="label">Chandas</span>
            <span class="value">${mantra.chandas}</span>
        </div>
    `;

    showScreen('detailScreen');
}

function updateMantraText() {
    const mantra = state.currentMantra;
    const text = state.currentScript === 'devanagari'
        ? mantra.fullText.devanagari
        : mantra.fullText.iast;
    $('mantraText').textContent = text;

    // Update active script button
    $$('.script-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.script === state.currentScript);
    });
}

function updateBenefits() {
    const mantra = state.currentMantra;
    const benefits = state.benefitTab === 'scientific'
        ? mantra.benefits.scientific
        : mantra.benefits.spiritual;

    $('benefitsList').innerHTML = benefits.map(b => `<li>${b}</li>`).join('');

    $$('.benefit-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === state.benefitTab);
    });
}

function updateFavoriteBtn() {
    const isFav = state.favorites.includes(state.currentMantra.id);
    const btn = $('favoriteBtn');
    btn.innerHTML = isFav
        ? '<i data-lucide="heart" style="fill: #ff6b6b; color: #ff6b6b;"></i>'
        : '<i data-lucide="heart"></i>';
    lucide.createIcons();
}

// ===== PRACTICE MODE =====
function startPractice() {
    const mantra = state.currentMantra;
    if (!mantra) return;

    state.count = 0;
    state.sessionStart = Date.now();

    $('practiceTitle').textContent = mantra.name.transliteration;
    $('practiceSanskrit').textContent = mantra.name.sanskrit;
    $('currentCount').textContent = '0';
    $('targetCount').textContent = state.targetCount;
    updateProgress();

    showScreen('practiceScreen');
}

function incrementCount() {
    state.count++;
    $('currentCount').textContent = state.count;
    updateProgress();

    // Haptic feedback
    if (state.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(30);
    }

    // Sound feedback
    if (state.soundEnabled) {
        const bell = $('bellSound');
        bell.currentTime = 0;
        bell.volume = 0.3;
        bell.play().catch(() => { });
    }

    // Pulse animation
    const sanskrit = $('practiceSanskrit');
    sanskrit.style.transform = 'scale(1.1)';
    setTimeout(() => sanskrit.style.transform = 'scale(1)', 150);

    // Check completion
    if (state.count >= state.targetCount) {
        completeSession();
    }
}

function updateProgress() {
    const percent = Math.min((state.count / state.targetCount) * 100, 100);
    $('progressFill').style.width = `${percent}%`;
    $('ringProgress').style.background = `conic-gradient(var(--saffron) ${percent}%, transparent ${percent}%)`;
}

function completeSession() {
    // Play completion sound
    const complete = $('completeSound');
    complete.play().catch(() => { });

    // Update stats
    state.stats.totalSessions++;
    state.stats.totalCount += state.count;
    localStorage.setItem('mantraMarga_stats', JSON.stringify(state.stats));

    // Calculate duration
    const duration = Math.floor((Date.now() - state.sessionStart) / 1000);
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;

    // Show modal
    $('completionText').textContent = `You completed ${state.count} repetitions of ${state.currentMantra.name.transliteration}`;
    $('sessionTime').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    $('totalSessions').textContent = state.stats.totalSessions;
    $('completionModal').classList.add('active');
}

function resetCount() {
    state.count = 0;
    $('currentCount').textContent = '0';
    updateProgress();
}

// ===== SEARCH =====
function openSearch() {
    $('searchOverlay').classList.add('active');
    $('searchInput').focus();
}

function closeSearch() {
    $('searchOverlay').classList.remove('active');
    $('searchInput').value = '';
    $('searchResults').innerHTML = '';
}

function handleSearch(query) {
    if (!query.trim()) {
        $('searchResults').innerHTML = '';
        return;
    }

    const results = searchMantras(query);
    $('searchResults').innerHTML = results.map(m => `
        <div class="mantra-card" data-id="${m.id}">
            <div class="mantra-icon" style="background: rgba(255,153,51,0.2); color: #FF9933">
                ${m.name.sanskrit.charAt(0)}
            </div>
            <div class="mantra-info">
                <div class="mantra-name">${m.name.sanskrit}</div>
                <div class="mantra-subtitle">${m.name.english}</div>
            </div>
        </div>
    `).join('');

    // Add click listeners to search results
    $('searchResults').querySelectorAll('.mantra-card').forEach(card => {
        card.addEventListener('click', () => {
            closeSearch();
            showMantraDetail(card.dataset.id);
        });
    });
}

// ===== FAVORITES =====
function toggleFavorite() {
    const id = state.currentMantra.id;
    const idx = state.favorites.indexOf(id);

    if (idx > -1) {
        state.favorites.splice(idx, 1);
    } else {
        state.favorites.push(id);
    }

    localStorage.setItem('mantraMarga_favorites', JSON.stringify(state.favorites));
    updateFavoriteBtn();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Category cards
    $('categoriesGrid').addEventListener('click', e => {
        const card = e.target.closest('.category-card');
        if (card) {
            renderMantras(card.dataset.category);
        }
    });

    // Mantra cards
    $('mantrasList').addEventListener('click', e => {
        const card = e.target.closest('.mantra-card');
        if (card) {
            showMantraDetail(card.dataset.id);
        }
    });

    // Featured card
    $('featuredMantra').addEventListener('click', e => {
        const card = e.target.closest('.featured-card');
        if (card && card.dataset.id) {
            showMantraDetail(card.dataset.id);
        }
    });

    // Track toggle
    $$('.track-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.track-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentTrack = btn.dataset.track;
        });
    });

    // Search
    $('searchBtn').addEventListener('click', openSearch);
    $('searchClose').addEventListener('click', closeSearch);
    $('searchInput').addEventListener('input', e => handleSearch(e.target.value));

    // Detail screen
    $('detailBackBtn').addEventListener('click', () => showScreen('homeScreen'));
    $('favoriteBtn').addEventListener('click', toggleFavorite);

    // Script toggle
    $$('.script-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.currentScript = btn.dataset.script;
            updateMantraText();
        });
    });

    // Benefit tabs
    $$('.benefit-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            state.benefitTab = tab.dataset.tab;
            updateBenefits();
        });
    });

    // Start practice
    $('startPracticeBtn').addEventListener('click', startPractice);

    // Practice screen
    $('practiceBackBtn').addEventListener('click', () => showScreen('detailScreen'));
    $('tapBtn').addEventListener('click', incrementCount);
    $('resetBtn').addEventListener('click', resetCount);

    // Target selection
    $$('.target-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.target-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.targetCount = parseInt(btn.dataset.count);
            $('targetCount').textContent = state.targetCount;
            updateProgress();
        });
    });

    // Audio toggle
    $('audioToggleBtn').addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        $('audioToggleBtn').innerHTML = state.soundEnabled
            ? '<i data-lucide="volume-2"></i>'
            : '<i data-lucide="volume-x"></i>';
        lucide.createIcons();
    });

    // Settings
    $('practiceSettingsBtn').addEventListener('click', () => {
        $('settingsModal').classList.add('active');
    });
    $('settingsCloseBtn').addEventListener('click', () => {
        $('settingsModal').classList.remove('active');
    });

    // Toggles in settings
    $('soundToggle').addEventListener('click', function () {
        this.classList.toggle('active');
        state.soundEnabled = this.classList.contains('active');
    });
    $('vibrationToggle').addEventListener('click', function () {
        this.classList.toggle('active');
        state.vibrationEnabled = this.classList.contains('active');
    });

    // Completion modal
    $('completionCloseBtn').addEventListener('click', () => {
        $('completionModal').classList.remove('active');
        showScreen('detailScreen');
    });

    // Listen button (placeholder - would need actual audio files)
    $('listenBtn').addEventListener('click', () => {
        // For now, use text-to-speech as fallback
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(state.currentMantra.fullText.devanagari);
            utterance.lang = 'hi-IN';
            utterance.rate = 0.7;
            speechSynthesis.speak(utterance);
        }
    });

    // Keyboard support
    document.addEventListener('keydown', e => {
        if (state.currentScreen === 'practiceScreen' && e.code === 'Space') {
            e.preventDefault();
            incrementCount();
        }
        if (e.code === 'Escape') {
            closeSearch();
            $('settingsModal').classList.remove('active');
            $('completionModal').classList.remove('active');
        }
    });
}
