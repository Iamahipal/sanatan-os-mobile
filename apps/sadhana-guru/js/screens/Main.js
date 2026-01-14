/**
 * Sadhana Guru - Main Screen Handler
 * Manages the main dashboard with practices
 */

const MainScreen = {
    currentModal: null,
    currentPractice: null,

    /**
     * Initialize main screen
     */
    init() {
        this._renderPractices();
        this._updateHeader();
        this._updatePhaseIndicator();
        this._updateIntentionCard();
        this._updateStats();
        this._loadQuote();
        this._bindEvents();
        this._bindIntentionEvents();
        this._bindReflectionEvents();
        this._bindTapasyaEvents();
    },

    /**
     * Render practices list
     */
    _renderPractices() {
        const container = document.getElementById('practicesList');
        if (!container) return;

        const practices = State.getProperty('practices');
        const entries = State.getProperty('todayEntries');
        const tapasya = State.getProperty('tapasya') || {};

        container.innerHTML = practices.map(practice => {
            const entry = entries[practice.id];
            const isDone = entry?.done === true;
            const isMissed = entry?.done === false;
            const quality = entry?.quality || '';
            const tap = tapasya[practice.id];
            const isTapasya = tap && tap.currentDay <= 66;

            let statusClass = '';
            if (isDone) statusClass = 'completed';
            else if (isMissed) statusClass = 'missed';

            // Tapasya badge
            let tapasyaBadge = '';
            if (isTapasya) {
                const progress = Math.round((tap.currentDay / 66) * 100);
                tapasyaBadge = `<span class="tapasya-badge">🔥 Day ${tap.currentDay}/66</span>`;
            }

            return `
                <div class="practice-item ${statusClass} ${isTapasya ? 'tapasya-active' : ''}" data-id="${practice.id}">
                    <div class="practice-icon">${practice.icon}</div>
                    <div class="practice-info">
                        <div class="practice-name">${practice.name}</div>
                        <div class="practice-anchor">${practice.anchor || practice.desc}</div>
                        ${tapasyaBadge}
                        ${quality ? `<span class="quality-badge ${quality}">${quality}</span>` : ''}
                    </div>
                    <button class="practice-action" ${entry ? 'disabled' : ''}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            ${isDone ? '<polyline points="20,6 9,17 4,12"/>' : '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'}
                        </svg>
                    </button>
                </div>
            `;
        }).join('');

        // Bind click events and long press for Tapasya
        container.querySelectorAll('.practice-item').forEach(item => {
            const btn = item.querySelector('.practice-action');
            const id = item.dataset.id;
            let pressTimer = null;

            // Click on action button opens entry modal
            if (btn && !btn.disabled) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this._openEntryModal(id);
                });
            }

            // Long press on item opens Tapasya modal
            item.addEventListener('mousedown', (e) => {
                if (e.target === btn) return;
                pressTimer = setTimeout(() => {
                    this.openTapasyaModal(id);
                }, 800);
            });

            item.addEventListener('mouseup', () => clearTimeout(pressTimer));
            item.addEventListener('mouseleave', () => clearTimeout(pressTimer));

            // Touch events for mobile
            item.addEventListener('touchstart', (e) => {
                if (e.target === btn) return;
                pressTimer = setTimeout(() => {
                    this.openTapasyaModal(id);
                }, 800);
            }, { passive: true });

            item.addEventListener('touchend', () => clearTimeout(pressTimer));
            item.addEventListener('touchcancel', () => clearTimeout(pressTimer));
        });
    },

    /**
     * Update header with date and day count
     */
    _updateHeader() {
        const daysEl = document.getElementById('daysOnPath');
        if (daysEl) {
            daysEl.textContent = State.getDaysOnPath();
        }
    },

    /**
     * Update phase indicator (morning/evening)
     */
    _updatePhaseIndicator() {
        const phaseEl = document.getElementById('phaseIndicator');
        if (!phaseEl) return;

        const phase = Time.getCurrentPhase();
        const muhurta = Time.getCurrentMuhurta();

        if (phase === 'pratah') {
            phaseEl.innerHTML = `
                <div class="phase-icon">🌅</div>
                <div class="phase-info">
                    <div class="phase-name">Pratah - Morning</div>
                    <div class="phase-desc">${muhurta.name} Muhurta • Set your intentions</div>
                </div>
            `;
        } else {
            phaseEl.innerHTML = `
                <div class="phase-icon">🌆</div>
                <div class="phase-info">
                    <div class="phase-name">Sayam - Evening</div>
                    <div class="phase-desc">${muhurta.name} Muhurta • Reflect on your practice</div>
                </div>
            `;
        }
    },

    /**
     * Update stats display
     */
    _updateStats() {
        const stats = State.getTodayStats();

        const doneEl = document.getElementById('statDone');
        const focusedEl = document.getElementById('statFocused');
        const totalEl = document.getElementById('statTotal');

        if (doneEl) doneEl.textContent = stats.done;
        if (focusedEl) focusedEl.textContent = stats.focused;
        if (totalEl) totalEl.textContent = stats.total;
    },

    /**
     * Load daily quote
     */
    async _loadQuote() {
        const quoteText = document.getElementById('quoteText');
        const quoteSource = document.getElementById('quoteSource');

        if (!quoteText || !quoteSource) return;

        try {
            const response = await fetch('data/quotes.json');
            const quotes = await response.json();

            // Pick quote based on day of year
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            const quote = quotes[dayOfYear % quotes.length];

            quoteText.textContent = `"${quote.text}"`;
            quoteSource.textContent = `— ${quote.source}`;
        } catch (error) {
            console.error('Failed to load quote:', error);
            quoteText.textContent = '"The soul is neither born, nor does it ever die."';
            quoteSource.textContent = '— Bhagavad Gita 2.20';
        }
    },

    /**
     * Bind navigation events
     */
    _bindEvents() {
        // Bottom nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;

                // Update active state
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Handle tab
                if (tab === 'today') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (tab === 'drishti') {
                    App.showScreen('drishti');
                    DrishtiScreen.init();
                } else if (tab === 'vow') {
                    VowScreen.showVowModal();
                } else if (tab === 'settings') {
                    this._showSettingsModal();
                }
            });
        });

        // Settings button
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this._showSettingsModal();
        });
    },

    /**
     * Open entry modal for a practice
     */
    _openEntryModal(practiceId) {
        const practices = State.getProperty('practices');
        const practice = practices.find(p => p.id === practiceId);
        if (!practice) return;

        this.currentPractice = practiceId;

        const modal = document.getElementById('entryModal');
        if (!modal) return;

        // Update modal content
        modal.querySelector('.entry-practice-icon').textContent = practice.icon;
        modal.querySelector('.entry-practice-name').textContent = practice.name;

        // Reset selections
        modal.querySelectorAll('.quality-option').forEach(opt => opt.classList.remove('selected'));
        modal.querySelectorAll('.reason-chip').forEach(chip => chip.classList.remove('selected'));

        // Show done section by default
        modal.querySelector('.entry-done-section').style.display = 'block';
        modal.querySelector('.entry-missed-section').style.display = 'none';

        // Bind quality selection
        modal.querySelectorAll('.quality-option').forEach(opt => {
            opt.onclick = () => {
                modal.querySelectorAll('.quality-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            };
        });

        // Bind reason selection
        modal.querySelectorAll('.reason-chip').forEach(chip => {
            chip.onclick = () => {
                modal.querySelectorAll('.reason-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
            };
        });

        // Bind done/missed toggle
        modal.querySelector('#markDoneBtn')?.addEventListener('click', () => {
            modal.querySelector('.entry-done-section').style.display = 'block';
            modal.querySelector('.entry-missed-section').style.display = 'none';
            modal.querySelector('#markDoneBtn').classList.add('btn-primary');
            modal.querySelector('#markDoneBtn').classList.remove('btn-secondary');
            modal.querySelector('#markMissedBtn').classList.remove('btn-primary');
            modal.querySelector('#markMissedBtn').classList.add('btn-secondary');
        });

        modal.querySelector('#markMissedBtn')?.addEventListener('click', () => {
            modal.querySelector('.entry-done-section').style.display = 'none';
            modal.querySelector('.entry-missed-section').style.display = 'block';
            modal.querySelector('#markMissedBtn').classList.add('btn-primary');
            modal.querySelector('#markMissedBtn').classList.remove('btn-secondary');
            modal.querySelector('#markDoneBtn').classList.remove('btn-primary');
            modal.querySelector('#markDoneBtn').classList.add('btn-secondary');
        });

        // Bind save
        modal.querySelector('#saveEntryBtn').onclick = () => this._saveEntry(modal);

        // Close handlers
        modal.querySelector('.modal-backdrop').onclick = () => modal.classList.remove('active');
        modal.querySelector('.modal-close').onclick = () => modal.classList.remove('active');

        modal.classList.add('active');
    },

    /**
     * Save entry from modal
     */
    _saveEntry(modal) {
        const isDone = modal.querySelector('.entry-done-section').style.display !== 'none';

        let entry = { done: isDone };

        if (isDone) {
            const selectedQuality = modal.querySelector('.quality-option.selected');
            if (!selectedQuality) {
                App.showToast('Please select how the practice went');
                return;
            }
            entry.quality = selectedQuality.dataset.quality;
        } else {
            const selectedReason = modal.querySelector('.reason-chip.selected');
            entry.reason = selectedReason ? selectedReason.dataset.reason : 'other';
        }

        // Update state
        const entries = State.getProperty('todayEntries');
        entries[this.currentPractice] = entry;
        State.set({ todayEntries: entries });

        // Close modal and refresh
        modal.classList.remove('active');
        this._renderPractices();
        this._updateStats();

        if (isDone) {
            App.showToast(`${entry.quality === 'focused' ? '🧘' : entry.quality === 'mechanical' ? '⚙️' : '🌀'} Entry recorded`);
        } else {
            App.showToast('Entry recorded as missed');
        }
    },

    /**
     * Show settings modal
     */
    _showSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;

        modal.classList.add('active');

        // Reset vow button
        modal.querySelector('#resetVowBtn')?.addEventListener('click', () => {
            if (confirm('Are you sure? This will reset all your progress and require a new Sankalpa Patra.')) {
                Storage.clear();
                location.reload();
            }
        });

        // Close handlers
        modal.querySelector('.modal-backdrop').onclick = () => modal.classList.remove('active');
        modal.querySelector('.modal-close').onclick = () => modal.classList.remove('active');
    },

    /**
     * Refresh the screen
     */
    refresh() {
        this._renderPractices();
        this._updateHeader();
        this._updateIntentionCard();
        this._updateStats();
    },

    // ===== PHASE 1: INTENTION & REFLECTION =====

    /**
     * Update intention card display
     */
    _updateIntentionCard() {
        const card = document.getElementById('intentionCard');
        const prompt = document.getElementById('intentionPrompt');
        const display = document.getElementById('intentionDisplay');
        const word = document.getElementById('intentionWord');

        if (!card) return;

        const intention = State.getProperty('todayIntention');

        if (intention) {
            card.classList.add('has-intention');
            prompt.classList.add('hidden');
            display.classList.remove('hidden');
            word.textContent = intention;
        } else {
            card.classList.remove('has-intention');
            prompt.classList.remove('hidden');
            display.classList.add('hidden');
        }
    },

    /**
     * Bind intention card and modal events
     */
    _bindIntentionEvents() {
        const card = document.getElementById('intentionCard');
        const modal = document.getElementById('intentionModal');

        if (!card || !modal) return;

        // Open modal on card click
        card.addEventListener('click', () => this._openIntentionModal());

        // Chip selection
        modal.querySelectorAll('.intention-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                modal.querySelectorAll('.intention-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                document.getElementById('intentionInput').value = chip.dataset.word;
            });
        });

        // Custom input syncs with chips
        document.getElementById('intentionInput')?.addEventListener('input', (e) => {
            modal.querySelectorAll('.intention-chip').forEach(c => c.classList.remove('selected'));
        });

        // Save button
        document.getElementById('saveIntentionBtn')?.addEventListener('click', () => {
            this._saveIntention(modal);
        });

        // Close handlers
        modal.querySelector('.modal-backdrop').onclick = () => modal.classList.remove('active');
        modal.querySelector('.modal-close').onclick = () => modal.classList.remove('active');
    },

    /**
     * Open intention modal
     */
    _openIntentionModal() {
        const modal = document.getElementById('intentionModal');
        if (!modal) return;

        const currentIntention = State.getProperty('todayIntention');

        // Reset state
        modal.querySelectorAll('.intention-chip').forEach(c => c.classList.remove('selected'));
        document.getElementById('intentionInput').value = currentIntention || '';

        // Pre-select chip if matches
        if (currentIntention) {
            modal.querySelectorAll('.intention-chip').forEach(chip => {
                if (chip.dataset.word === currentIntention) {
                    chip.classList.add('selected');
                }
            });
        }

        modal.classList.add('active');
    },

    /**
     * Save intention from modal
     */
    _saveIntention(modal) {
        const input = document.getElementById('intentionInput');
        const selectedChip = modal.querySelector('.intention-chip.selected');

        let intention = input.value.trim() || (selectedChip ? selectedChip.dataset.word : '');

        if (!intention) {
            App.showToast('Please choose or write an intention');
            return;
        }

        // Capitalize first letter
        intention = intention.charAt(0).toUpperCase() + intention.slice(1);

        State.set({ todayIntention: intention });
        modal.classList.remove('active');
        this._updateIntentionCard();

        App.showToast(`🎯 Your sankalpa: ${intention}`);
    },

    /**
     * Bind reflection modal events
     */
    _bindReflectionEvents() {
        const modal = document.getElementById('reflectionModal');
        if (!modal) return;

        // Save button
        document.getElementById('saveReflectionBtn')?.addEventListener('click', () => {
            this._saveReflection(modal);
        });

        // Close handlers
        modal.querySelector('.modal-backdrop').onclick = () => modal.classList.remove('active');
        modal.querySelector('.modal-close').onclick = () => modal.classList.remove('active');
    },

    /**
     * Show reflection modal (called in evening)
     */
    showReflectionModal() {
        const modal = document.getElementById('reflectionModal');
        if (!modal) return;

        const intention = State.getProperty('todayIntention');
        const reflection = State.getProperty('todayReflection');

        // Show today's intention
        document.getElementById('reflectionIntentionWord').textContent = intention || '—';
        document.getElementById('reflectionInput').value = reflection || '';

        modal.classList.add('active');
    },

    /**
     * Save reflection from modal
     */
    _saveReflection(modal) {
        const input = document.getElementById('reflectionInput');
        const reflection = input.value.trim();

        State.set({ todayReflection: reflection || null });
        modal.classList.remove('active');

        App.showToast('🌙 Day complete. Rest well.');
    },

    // ===== PHASE 2: TAPASYA MODE (66-DAY COMMITMENT) =====

    currentTapasyaPractice: null,

    /**
     * Initialize Tapasya handlers
     */
    _bindTapasyaEvents() {
        const modal = document.getElementById('tapasyaModal');
        if (!modal) return;

        document.getElementById('startTapasyaBtn')?.addEventListener('click', () => {
            this._startTapasya(modal);
        });

        modal.querySelector('.modal-backdrop').onclick = () => modal.classList.remove('active');
        modal.querySelector('.modal-close').onclick = () => modal.classList.remove('active');
    },

    /**
     * Open Tapasya modal for a practice (long press or special action)
     */
    openTapasyaModal(practiceId) {
        const practices = State.getProperty('practices');
        const practice = practices.find(p => p.id === practiceId);
        const tapasya = State.getProperty('tapasya') || {};

        if (!practice) return;

        // Check if already in Tapasya
        if (tapasya[practiceId]) {
            App.showToast('Already in Tapasya for this practice');
            return;
        }

        this.currentTapasyaPractice = practiceId;

        const modal = document.getElementById('tapasyaModal');
        if (!modal) return;

        document.getElementById('tapasyaPracticeIcon').textContent = practice.icon;
        document.getElementById('tapasyaPracticeName').textContent = practice.name;

        modal.classList.add('active');
    },

    /**
     * Start Tapasya for current practice
     */
    _startTapasya(modal) {
        if (!this.currentTapasyaPractice) return;

        const tapasya = State.getProperty('tapasya') || {};

        tapasya[this.currentTapasyaPractice] = {
            startDate: new Date().toISOString(),
            currentDay: 1,
            automaticityScores: [],
            completedDays: 0,
            missedDays: 0
        };

        State.set({ tapasya });
        modal.classList.remove('active');
        this._renderPractices();

        App.showToast('🔥 Tapasya begun! 66 days to mastery.');
    },

    /**
     * Update Tapasya progress when practice is completed
     */
    updateTapasyaProgress(practiceId, completed) {
        const tapasya = State.getProperty('tapasya') || {};
        const tap = tapasya[practiceId];

        if (!tap) return;

        // Update progress
        if (completed) {
            tap.completedDays++;
        } else {
            tap.missedDays++;
        }

        // Increment day counter
        tap.currentDay++;

        // Check if complete
        if (tap.currentDay > 66) {
            App.showToast('🎉 Tapasya complete! Practice is now part of you.');
            delete tapasya[practiceId];
        }

        State.set({ tapasya });
    },

    /**
     * Get Tapasya summary for a practice
     */
    getTapasyaSummary(practiceId) {
        const tapasya = State.getProperty('tapasya') || {};
        const tap = tapasya[practiceId];

        if (!tap) return null;

        return {
            day: tap.currentDay,
            progress: Math.round((tap.currentDay / 66) * 100),
            completed: tap.completedDays,
            missed: tap.missedDays,
            isComplete: tap.currentDay > 66
        };
    }
};

// Make it globally available
window.MainScreen = MainScreen;
