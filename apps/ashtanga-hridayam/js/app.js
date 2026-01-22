// Ashtanga Hridayam - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('symptom-search');
    const resultsSection = document.getElementById('results-section');
    const resultsContainer = document.getElementById('results-container');
    const popularContainer = document.getElementById('popular-container');
    const herbsContainer = document.getElementById('herbs-container');
    const modal = document.getElementById('remedy-modal');
    const modalBody = document.getElementById('modal-body');

    // Initialize
    initTheme();
    checkOnboarding();
    renderPopularRemedies();
    renderHerbs();
    updateFavoriteBadge();

    // ===== THEME TOGGLE =====
    function initTheme() {
        const saved = localStorage.getItem('ayurveda_theme');
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    window.toggleTheme = function () {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('ayurveda_theme', newTheme);
    };

    // ===== ONBOARDING =====
    function checkOnboarding() {
        const seen = localStorage.getItem('ayurveda_onboarding_done');
        if (!seen) {
            document.getElementById('onboarding-modal').classList.remove('hidden');
        }
    }

    let currentSlide = 0;
    window.nextSlide = function () {
        const slides = document.querySelectorAll('.onboarding-slide');
        const dots = document.querySelectorAll('.dot');

        if (currentSlide < slides.length - 1) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide++;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');

            if (currentSlide === slides.length - 1) {
                document.querySelector('.onboarding-actions .btn-primary').textContent = 'Get Started';
            }
        } else {
            skipOnboarding();
        }
    };

    window.skipOnboarding = function () {
        localStorage.setItem('ayurveda_onboarding_done', 'true');
        document.getElementById('onboarding-modal').classList.add('hidden');
    };

    // ===== TAB NAVIGATION =====
    window.switchTab = function (tabId) {
        // Update tab buttons (desktop)
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        // Update bottom nav items (mobile)
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabId);
        });
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabId}`);
        });
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ===== SEARCH =====
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length >= 2) {
                searchAll(query);
            } else {
                resultsSection.classList.add('hidden');
            }
        }, 300);
    });

    function searchAll(query) {
        const remedyResults = REMEDIES.filter(r =>
            r.name.toLowerCase().includes(query) ||
            r.symptoms.some(s => s.includes(query)) ||
            r.name_sanskrit.includes(query)
        );

        const herbResults = HERBS.filter(h =>
            h.name.toLowerCase().includes(query) ||
            h.uses.toLowerCase().includes(query) ||
            h.name_sanskrit.includes(query)
        );

        if (remedyResults.length > 0 || herbResults.length > 0) {
            let html = '';
            if (remedyResults.length > 0) {
                html += '<div class="remedies-grid">' + remedyResults.map(r => createRemedyCard(r)).join('') + '</div>';
            }
            if (herbResults.length > 0) {
                html += '<h3 style="margin: 20px 0 12px; font-size: 13px; color: var(--md-on-surface-variant);">HERBS</h3>';
                html += '<div class="herbs-grid">' + herbResults.map(h => createHerbCard(h)).join('') + '</div>';
            }
            resultsContainer.innerHTML = html;
            resultsSection.classList.remove('hidden');
            attachCardListeners(resultsContainer);
            attachHerbListeners(resultsContainer);
        } else {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No results found for "${query}"</p>
                    <p style="font-size: 13px; margin-top: 8px;">Try: headache, digestion, stress, tulsi, ashwagandha</p>
                </div>
            `;
            resultsSection.classList.remove('hidden');
        }
    }

    // ===== REMEDIES =====
    function renderPopularRemedies() {
        const popular = REMEDIES.slice(0, 6);
        popularContainer.innerHTML = popular.map(r => createRemedyCard(r)).join('');
        attachCardListeners(popularContainer);
    }

    function createRemedyCard(remedy) {
        const isFav = isFavorite(remedy.id);
        return `
            <div class="remedy-card" data-id="${remedy.id}">
                <div class="card-actions">
                    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${remedy.id}')" title="Add to favorites">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                    </button>
                </div>
                <div class="emoji">${remedy.emoji}</div>
                <div class="name">${remedy.name}</div>
                <div class="sanskrit">${remedy.name_sanskrit}</div>
                <div class="symptoms">${remedy.symptoms.slice(0, 3).join(' • ')}</div>
            </div>
        `;
    }

    function attachCardListeners(container) {
        container.querySelectorAll('.remedy-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.fav-btn')) return;
                const id = card.dataset.id;
                const remedy = REMEDIES.find(r => r.id === id);
                if (remedy) openModal(remedy);
            });
        });
    }

    // ===== HERBS =====
    function renderHerbs() {
        if (!herbsContainer) return;
        herbsContainer.innerHTML = HERBS.map(h => createHerbCard(h)).join('');
        attachHerbListeners(herbsContainer);
    }

    function createHerbCard(herb) {
        return `
            <div class="herb-card" data-id="${herb.id}">
                <div class="herb-icon">${herb.image}</div>
                <div class="herb-info">
                    <div class="herb-name">${herb.name}</div>
                    <div class="herb-sanskrit">${herb.name_sanskrit}</div>
                    <div class="herb-botanical">${herb.botanical}</div>
                </div>
            </div>
        `;
    }

    function attachHerbListeners(container) {
        container.querySelectorAll('.herb-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const herb = HERBS.find(h => h.id === id);
                if (herb) openHerbModal(herb);
            });
        });
    }

    function openHerbModal(herb) {
        modalBody.innerHTML = `
            <div class="modal-header">
                <div class="emoji">${herb.image}</div>
                <h2>${herb.name}</h2>
                <div class="sanskrit">${herb.name_sanskrit}</div>
                <div style="font-size: 12px; color: var(--md-on-surface-variant); margin-top: 4px;">${herb.botanical}</div>
            </div>

            <div class="modal-section">
                <h3>⚗️ Properties (Guna)</h3>
                <div class="property-grid">
                    <div class="property"><strong>Rasa:</strong> ${herb.rasa}</div>
                    <div class="property"><strong>Virya:</strong> ${herb.virya}</div>
                    <div class="property"><strong>Vipaka:</strong> ${herb.vipaka}</div>
                </div>
            </div>

            <div class="modal-section">
                <h3>☯️ Dosha Effect</h3>
                <p>${herb.dosha}</p>
            </div>

            <div class="modal-section">
                <h3>🌿 Parts Used</h3>
                <p>${herb.parts_used}</p>
            </div>

            <div class="modal-section">
                <h3>✨ Key Properties</h3>
                <ul>
                    ${herb.properties.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h3>💊 Uses</h3>
                <p>${herb.uses}</p>
            </div>

            <div class="modal-section">
                <h3>⚠️ Contraindications</h3>
                <p style="color: var(--md-error);">${herb.contraindications}</p>
            </div>
        `;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // ===== REMEDY MODAL =====
    window.openModal = function (remedy) {
        const isFav = isFavorite(remedy.id);
        modalBody.innerHTML = `
            <div class="modal-header">
                <div class="emoji">${remedy.emoji}</div>
                <h2>${remedy.name}</h2>
                <div class="sanskrit">${remedy.name_sanskrit}</div>
            </div>

            <button class="modal-fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${remedy.id}'); this.classList.toggle('active');">
                ${isFav ? '❤️ Saved' : '🤍 Save to Favorites'}
            </button>

            <div class="modal-section">
                <h3>🎯 Helps With</h3>
                <p>${remedy.symptoms.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' • ')}</p>
            </div>

            <div class="modal-section">
                <h3>🌿 Ingredients</h3>
                <ul>
                    ${remedy.ingredients.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h3>📋 Instructions</h3>
                <p>${remedy.instructions}</p>
            </div>

            <div class="modal-section">
                <h3>✨ Benefits</h3>
                <p>${remedy.benefits}</p>
            </div>

            <div class="modal-section">
                <h3>📖 Reference</h3>
                <div class="source-tag">
                    <strong>Ashtanga Hridayam</strong> - ${remedy.source}
                </div>
            </div>
        `;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function () {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        renderPopularRemedies();
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // ===== DOSHA FILTER =====
    window.filterByDosha = function (dosha) {
        const results = REMEDIES.filter(r => r.dosha.includes(dosha));
        const doshaNames = { vata: 'Vata', pitta: 'Pitta', kapha: 'Kapha' };
        searchInput.value = `${doshaNames[dosha]} remedies`;
        resultsContainer.innerHTML = '<div class="remedies-grid">' + results.map(r => createRemedyCard(r)).join('') + '</div>';
        resultsSection.classList.remove('hidden');
        attachCardListeners(resultsContainer);
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // ===== FAVORITES =====
    function getFavorites() {
        return JSON.parse(localStorage.getItem('ayurveda_favorites') || '[]');
    }

    function saveFavorites(favs) {
        localStorage.setItem('ayurveda_favorites', JSON.stringify(favs));
        updateFavoriteBadge();
    }

    function isFavorite(id) {
        return getFavorites().includes(id);
    }

    window.toggleFavorite = function (id) {
        let favs = getFavorites();
        if (favs.includes(id)) {
            favs = favs.filter(f => f !== id);
        } else {
            favs.push(id);
        }
        saveFavorites(favs);
        renderPopularRemedies();
    };

    function updateFavoriteBadge() {
        const count = getFavorites().length;
        const badge = document.getElementById('fav-count');
        if (badge) {
            badge.textContent = count;
            badge.classList.toggle('hidden', count === 0);
        }
    }

    window.showFavorites = function () {
        const favIds = getFavorites();
        const favRemedies = REMEDIES.filter(r => favIds.includes(r.id));
        const container = document.getElementById('favorites-container');

        if (favRemedies.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--md-on-surface-variant);">No favorites yet. Tap the heart icon on any remedy to save it!</p>';
        } else {
            container.innerHTML = '<div class="remedies-grid">' + favRemedies.map(r => createRemedyCard(r)).join('') + '</div>';
            attachCardListeners(container);
        }

        document.getElementById('favorites-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    window.closeFavorites = function () {
        document.getElementById('favorites-modal').classList.add('hidden');
        document.body.style.overflow = '';
    };

    // ===== PRAKRITI QUIZ =====
    let quizIndex = 0;
    let quizScores = { vata: 0, pitta: 0, kapha: 0 };

    window.startQuiz = function () {
        quizIndex = 0;
        quizScores = { vata: 0, pitta: 0, kapha: 0 };
        document.getElementById('quiz-intro').classList.add('hidden');
        document.getElementById('quiz-container').classList.remove('hidden');
        document.getElementById('quiz-result').classList.add('hidden');
        showQuestion();
    };

    function showQuestion() {
        const q = QUIZ_QUESTIONS[quizIndex];
        document.getElementById('quiz-counter').textContent = `Question ${quizIndex + 1} of ${QUIZ_QUESTIONS.length}`;
        document.getElementById('progress-fill').style.width = `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`;
        document.getElementById('quiz-question').innerHTML = `<h3>${q.question}</h3>`;
        document.getElementById('quiz-options').innerHTML = q.options.map((opt, i) => `
            <button class="quiz-option" onclick="selectAnswer('${opt.dosha}')">${opt.text}</button>
        `).join('');
    }

    window.selectAnswer = function (dosha) {
        quizScores[dosha]++;
        quizIndex++;

        if (quizIndex < QUIZ_QUESTIONS.length) {
            showQuestion();
        } else {
            showResult();
        }
    };

    function showResult() {
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('quiz-result').classList.remove('hidden');

        const dominant = Object.entries(quizScores).sort((a, b) => b[1] - a[1])[0][0];
        const result = DOSHA_RESULTS[dominant];

        document.getElementById('result-dosha').innerHTML = `<span style="font-size: 64px;">${result.emoji}</span>`;
        document.getElementById('result-title').textContent = result.title;
        document.getElementById('result-title').style.color = result.color;
        document.getElementById('result-description').textContent = result.description;
        document.getElementById('result-tips').innerHTML = `
            <h4>Tips for Balancing ${result.title.split(' ')[0]}:</h4>
            <ul>${result.tips.map(t => `<li>${t}</li>`).join('')}</ul>
        `;
    }

    window.resetQuiz = function () {
        document.getElementById('quiz-result').classList.add('hidden');
        document.getElementById('quiz-intro').classList.remove('hidden');
    };

    // ===== KEYBOARD =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeFavorites();
        }
    });

    // ===== TOAST NOTIFICATIONS =====
    window.showToast = function (message, type = 'default') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = message;
        container.appendChild(toast);

        // Remove after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    // ===== SHARE REMEDY =====
    window.shareRemedy = async function (remedyId) {
        const remedy = REMEDIES.find(r => r.id === remedyId);
        if (!remedy) return;

        const shareData = {
            title: `${remedy.name} - Ayurvedic Remedy`,
            text: `${remedy.name} (${remedy.name_sanskrit})\n\nHelps with: ${remedy.symptoms.join(', ')}\n\nIngredients: ${remedy.ingredients.join(', ')}\n\nFrom: Ashtanga Hridayam`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showToast('✓ Shared successfully', 'success');
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(shareData.text);
                showToast('📋 Copied to clipboard', 'success');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                showToast('Could not share', 'error');
            }
        }
    };

    // ===== CONFETTI CELEBRATION =====
    window.showConfetti = function () {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#81C784', '#4CAF50', '#FFD700', '#FF6B6B', '#64B5F6'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(confetti);
        }

        setTimeout(() => container.remove(), 5000);
    };

    // Show confetti when quiz is completed
    const originalShowResult = showResult;
    showResult = function () {
        originalShowResult();
        showConfetti();
    };
});

