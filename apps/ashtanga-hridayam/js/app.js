// Ashtanga Hridayam - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('symptom-search');
    const resultsSection = document.getElementById('results-section');
    const resultsContainer = document.getElementById('results-container');
    const popularContainer = document.getElementById('popular-container');
    const modal = document.getElementById('remedy-modal');
    const modalBody = document.getElementById('modal-body');

    // Initialize - Show popular remedies
    renderPopularRemedies();

    // Search functionality
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length >= 2) {
                searchRemedies(query);
            } else {
                resultsSection.classList.add('hidden');
            }
        }, 300);
    });

    // Search remedies by symptom
    function searchRemedies(query) {
        const results = REMEDIES.filter(remedy => {
            const matchesName = remedy.name.toLowerCase().includes(query);
            const matchesSymptom = remedy.symptoms.some(s => s.includes(query));
            const matchesSanskrit = remedy.name_sanskrit.includes(query);
            return matchesName || matchesSymptom || matchesSanskrit;
        });

        if (results.length > 0) {
            renderResults(results);
            resultsSection.classList.remove('hidden');
        } else {
            resultsContainer.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                    <p>No remedies found for "${query}"</p>
                    <p style="font-size: 13px; margin-top: 8px;">Try searching for symptoms like "headache", "digestion", or "stress"</p>
                </div>
            `;
            resultsSection.classList.remove('hidden');
        }
    }

    // Render search results
    function renderResults(remedies) {
        resultsContainer.innerHTML = remedies.map(remedy => createRemedyCard(remedy)).join('');
        attachCardListeners(resultsContainer);
    }

    // Render popular remedies
    function renderPopularRemedies() {
        const popular = REMEDIES.slice(0, 6); // Show first 6
        popularContainer.innerHTML = popular.map(remedy => createRemedyCard(remedy)).join('');
        attachCardListeners(popularContainer);
    }

    // Create remedy card HTML
    function createRemedyCard(remedy) {
        return `
            <div class="remedy-card" data-id="${remedy.id}">
                <div class="emoji">${remedy.emoji}</div>
                <div class="name">${remedy.name}</div>
                <div class="sanskrit">${remedy.name_sanskrit}</div>
                <div class="symptoms">${remedy.symptoms.slice(0, 3).join(' • ')}</div>
            </div>
        `;
    }

    // Attach click listeners to cards
    function attachCardListeners(container) {
        container.querySelectorAll('.remedy-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const remedy = REMEDIES.find(r => r.id === id);
                if (remedy) openModal(remedy);
            });
        });
    }

    // Open remedy detail modal
    window.openModal = function (remedy) {
        modalBody.innerHTML = `
            <div class="modal-header">
                <div class="emoji">${remedy.emoji}</div>
                <h2>${remedy.name}</h2>
                <div class="sanskrit">${remedy.name_sanskrit}</div>
            </div>

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

    // Close modal
    window.closeModal = function () {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Filter by dosha
    window.filterByDosha = function (dosha) {
        const results = REMEDIES.filter(r => r.dosha.includes(dosha));
        const doshaNames = {
            vata: 'Vata',
            pitta: 'Pitta',
            kapha: 'Kapha'
        };

        searchInput.value = `${doshaNames[dosha]} remedies`;
        renderResults(results);
        resultsSection.classList.remove('hidden');

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});
