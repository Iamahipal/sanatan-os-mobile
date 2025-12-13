/**
 * Digital Yatra - Main App Logic
 * Transforms tourists into conscious pilgrims
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    let visitedTemples = JSON.parse(localStorage.getItem('yatra_visited') || '[]');
    let currentTemple = null;

    // DOM Elements
    const templesGrid = document.getElementById('temples-grid');
    const passportStamps = document.getElementById('passport-stamps');
    const templesVisited = document.getElementById('temples-visited');
    const modal = document.getElementById('temple-modal');
    const closeModal = document.getElementById('close-modal');
    const revealBtn = document.getElementById('reveal-btn');
    const markVisitedBtn = document.getElementById('mark-visited-btn');

    // Initialize
    renderTemples();
    renderPassport();

    // Render Temple Cards
    function renderTemples() {
        templesGrid.innerHTML = YATRA_TEMPLES.map(temple => `
            <div class="temple-card" data-id="${temple.id}">
                <div class="temple-card-image" style="background-image: url('${temple.hero_image}')"></div>
                <div class="temple-card-body">
                    <div class="temple-card-header">
                        <span class="temple-icon">${temple.icon}</span>
                        <div>
                            <h3 class="temple-name">${temple.name}</h3>
                            <p class="temple-location">${temple.location.city}, ${temple.location.state}</p>
                        </div>
                    </div>
                    <p class="temple-hook">"${temple.hidden_secret.hook}"</p>
                </div>
            </div>
        `).join('');

        // Add click listeners
        document.querySelectorAll('.temple-card').forEach(card => {
            card.addEventListener('click', () => openTempleModal(card.dataset.id));
        });
    }

    // Render Passport Stamps
    function renderPassport() {
        passportStamps.innerHTML = YATRA_TEMPLES.map(temple => {
            const isCollected = visitedTemples.includes(temple.id);
            return `<div class="stamp ${isCollected ? 'collected' : ''}" data-id="${temple.id}">${temple.icon}</div>`;
        }).join('');

        templesVisited.textContent = `${visitedTemples.length} / ${YATRA_TEMPLES.length}`;

        // Update progress bars (simplified for MVP)
        const jyotirlingaCount = YATRA_TEMPLES.filter(t =>
            t.category.includes('jyotirlinga') && visitedTemples.includes(t.id)
        ).length;
        const charDhamCount = YATRA_TEMPLES.filter(t =>
            t.category.includes('char_dham') && visitedTemples.includes(t.id)
        ).length;

        const jyotirlingaFill = document.querySelector('.path-item:nth-child(1) .path-fill');
        const charDhamFill = document.querySelector('.path-item:nth-child(2) .path-fill');

        if (jyotirlingaFill) jyotirlingaFill.style.width = `${(jyotirlingaCount / 12) * 100}%`;
        if (charDhamFill) charDhamFill.style.width = `${(charDhamCount / 4) * 100}%`;
    }

    // Open Temple Modal
    function openTempleModal(templeId) {
        currentTemple = YATRA_TEMPLES.find(t => t.id === templeId);
        if (!currentTemple) return;

        // Populate modal
        document.getElementById('modal-hero').style.backgroundImage = `url('${currentTemple.hero_image}')`;
        document.getElementById('modal-icon').textContent = currentTemple.icon;
        document.getElementById('modal-name').textContent = currentTemple.name;
        document.getElementById('modal-location').textContent = `${currentTemple.location.city}, ${currentTemple.location.state}`;

        // Secret
        document.getElementById('secret-hook').textContent = currentTemple.hidden_secret.hook;
        document.getElementById('secret-story').textContent = currentTemple.hidden_secret.full_story;
        document.getElementById('secret-source').textContent = `— ${currentTemple.hidden_secret.source}`;
        document.getElementById('secret-full').classList.add('hidden');
        revealBtn.style.display = 'flex';

        // Darshan Guide
        document.getElementById('guide-steps').innerHTML = currentTemple.darshan_guide.map(step => `
            <div class="guide-step">
                <span class="step-number">${step.step}</span>
                <div class="step-content">
                    <h4>${step.title}</h4>
                    <p>${step.instruction}</p>
                </div>
            </div>
        `).join('');

        // Vibe
        document.getElementById('vibe-smell').textContent = currentTemple.vibe.smell.slice(0, 2).join(', ');
        document.getElementById('vibe-sound').textContent = currentTemple.vibe.sound.slice(0, 2).join(', ');
        document.getElementById('vibe-feel').textContent = currentTemple.vibe.feel.slice(0, 2).join(', ');

        // Best Time
        document.getElementById('best-time').textContent = `${currentTemple.best_time.time}. Season: ${currentTemple.best_time.season}. Avoid: ${currentTemple.best_time.avoid}`;

        // Visited Button State
        const isVisited = visitedTemples.includes(templeId);
        markVisitedBtn.classList.toggle('marked', isVisited);
        markVisitedBtn.innerHTML = isVisited
            ? '<i data-lucide="check-circle"></i> Visited ✓'
            : '<i data-lucide="check-circle"></i> I\'ve Visited This Temple';

        // Re-render icons in modal
        lucide.createIcons();

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close Modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Reveal Secret
    revealBtn.addEventListener('click', () => {
        document.getElementById('secret-full').classList.remove('hidden');
        revealBtn.style.display = 'none';
    });

    // Mark as Visited
    markVisitedBtn.addEventListener('click', () => {
        if (!currentTemple) return;

        const idx = visitedTemples.indexOf(currentTemple.id);
        if (idx === -1) {
            visitedTemples.push(currentTemple.id);
            markVisitedBtn.classList.add('marked');
            markVisitedBtn.innerHTML = '<i data-lucide="check-circle"></i> Visited ✓';

            // Celebration effect
            confettiEffect();
        } else {
            visitedTemples.splice(idx, 1);
            markVisitedBtn.classList.remove('marked');
            markVisitedBtn.innerHTML = '<i data-lucide="check-circle"></i> I\'ve Visited This Temple';
        }

        localStorage.setItem('yatra_visited', JSON.stringify(visitedTemples));
        renderPassport();
        lucide.createIcons();
    });

    // Simple confetti effect
    function confettiEffect() {
        const colors = ['#D4AF37', '#FF6B35', '#F5F0E6'];
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 2000;
                animation: fall ${1 + Math.random()}s linear forwards;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 2000);
        }
    }

    // Add confetti animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
