/**
 * Sadhana Guru - Drishti (View) Screen Handler
 * Weekly patterns, monthly heatmap, and insights
 */

const DrishtiScreen = {
    currentWeekStart: null,
    viewMode: 'week', // 'week' | 'month'
    currentMonth: null,

    /**
     * Initialize drishti screen
     */
    init() {
        this.currentWeekStart = Time.getWeekStart();
        this.currentMonth = new Date();
        this._render();
        this._bindEvents();
    },

    /**
     * Render the entire screen
     */
    _render() {
        this._renderViewToggle();

        if (this.viewMode === 'week') {
            this._renderWeekNav();
            this._renderWeeklyGrid();
        } else {
            this._renderMonthNav();
            this._renderMonthlyHeatmap();
        }

        this._renderSummary();
        this._renderDistribution();
        this._renderGuruVakya();
    },

    /**
     * Render view toggle (Week/Month)
     */
    _renderViewToggle() {
        const toggleEl = document.getElementById('viewToggle');
        if (!toggleEl) return;

        toggleEl.innerHTML = `
            <button class="view-toggle-btn ${this.viewMode === 'week' ? 'active' : ''}" data-view="week">Week</button>
            <button class="view-toggle-btn ${this.viewMode === 'month' ? 'active' : ''}" data-view="month">Month</button>
        `;

        toggleEl.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.viewMode = btn.dataset.view;
                this._render();
            });
        });
    },

    /**
     * Render week navigation
     */
    _renderWeekNav() {
        const displayEl = document.getElementById('weekDisplay');
        const navEl = document.getElementById('dateNav');
        if (!displayEl) return;

        if (navEl) navEl.style.display = 'flex';

        const weekEnd = new Date(this.currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const startStr = Time.formatShortDate(this.currentWeekStart);
        const endStr = Time.formatShortDate(weekEnd);

        displayEl.innerHTML = `
            <div class="week-label">Week of</div>
            <div class="week-dates">${startStr} - ${endStr}</div>
        `;

        // Disable next button if current week
        const nextBtn = document.getElementById('weekNextBtn');
        if (nextBtn) {
            const currentWeekStart = Time.getWeekStart();
            nextBtn.disabled = this.currentWeekStart.getTime() >= currentWeekStart.getTime();
        }
    },

    /**
     * Render month navigation
     */
    _renderMonthNav() {
        const displayEl = document.getElementById('weekDisplay');
        const navEl = document.getElementById('dateNav');
        if (!displayEl) return;

        if (navEl) navEl.style.display = 'flex';

        const monthName = this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        displayEl.innerHTML = `
            <div class="week-label">Monthly Darshan</div>
            <div class="week-dates">${monthName}</div>
        `;
    },

    /**
     * Render weekly grid with dots
     */
    _renderWeeklyGrid() {
        const gridEl = document.getElementById('weeklyGrid');
        const heatmapEl = document.getElementById('monthlyHeatmap');
        if (!gridEl) return;

        gridEl.style.display = 'grid';
        if (heatmapEl) heatmapEl.style.display = 'none';

        const weekData = State.getWeekData(this.currentWeekStart);
        const practices = State.getProperty('practices');

        gridEl.innerHTML = weekData.map(day => {
            const isToday = Time.isToday(day.date);
            const dayName = Time.getDayName(day.date);
            const dayNum = day.date.getDate();

            // Get dots for each practice
            const dots = practices.map(practice => {
                const entry = day.entries[practice.id];
                let dotClass = '';

                if (entry) {
                    if (entry.done) {
                        dotClass = entry.quality || 'focused';
                    } else {
                        dotClass = 'missed';
                    }
                }

                return `<div class="practice-dot ${dotClass}"></div>`;
            }).join('');

            return `
                <div class="day-column">
                    <div class="day-label">${dayName}</div>
                    <div class="day-date ${isToday ? 'today' : ''}">${dayNum}</div>
                    <div class="day-dots">
                        ${dots}
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Render monthly heatmap calendar
     */
    _renderMonthlyHeatmap() {
        const gridEl = document.getElementById('weeklyGrid');
        let heatmapEl = document.getElementById('monthlyHeatmap');

        if (gridEl) gridEl.style.display = 'none';

        // Create heatmap container if it doesn't exist
        if (!heatmapEl) {
            heatmapEl = document.createElement('div');
            heatmapEl.id = 'monthlyHeatmap';
            heatmapEl.className = 'monthly-heatmap';
            gridEl.parentNode.insertBefore(heatmapEl, gridEl.nextSibling);
        }
        heatmapEl.style.display = 'block';

        const history = State.getProperty('history') || {};
        const practices = State.getProperty('practices') || [];

        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const today = new Date();

        // Day headers
        const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
            .map(d => `<div class="heatmap-header">${d}</div>`)
            .join('');

        // Empty cells for days before first of month
        const emptyStart = Array(firstDay.getDay()).fill('<div class="heatmap-cell empty"></div>').join('');

        // Generate cells for each day
        const cells = [];
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = date.toDateString() === today.toDateString();
            const isFuture = date > today;

            const dayData = history[dateStr];
            let intensity = 0;
            let qualityClass = '';

            if (dayData && dayData.entries) {
                const entries = Object.values(dayData.entries);
                const completed = entries.filter(e => e.done).length;
                intensity = Math.round((completed / practices.length) * 4);

                // Dominant quality
                const focused = entries.filter(e => e.quality === 'focused').length;
                const mechanical = entries.filter(e => e.quality === 'mechanical').length;
                if (focused > mechanical) qualityClass = 'quality-focused';
                else if (mechanical > focused) qualityClass = 'quality-mechanical';
            }

            cells.push(`
                <div class="heatmap-cell ${isFuture ? 'future' : ''} ${isToday ? 'today' : ''} intensity-${intensity} ${qualityClass}" 
                     data-date="${dateStr}" title="${day}">
                    ${day}
                </div>
            `);
        }

        heatmapEl.innerHTML = `
            <div class="heatmap-grid">
                ${dayHeaders}
                ${emptyStart}
                ${cells.join('')}
            </div>
            <div class="heatmap-legend">
                <span class="legend-label">Less</span>
                <div class="legend-cell intensity-0"></div>
                <div class="legend-cell intensity-1"></div>
                <div class="legend-cell intensity-2"></div>
                <div class="legend-cell intensity-3"></div>
                <div class="legend-cell intensity-4"></div>
                <span class="legend-label">More</span>
            </div>
        `;
    },

    /**
     * Render Guru Vakya (contextual wisdom)
     */
    async _renderGuruVakya() {
        const wisdomEl = document.getElementById('guruVakya');
        if (!wisdomEl) return;

        // Initialize if needed
        if (!GuruVakya.wisdomData) {
            await GuruVakya.init();
        }

        const wisdom = GuruVakya.getWisdom();

        wisdomEl.innerHTML = `
            <div class="wisdom-card">
                <div class="wisdom-header">
                    <span class="wisdom-icon">🪷</span>
                    <span class="wisdom-title">Guru Vakya</span>
                    <span class="wisdom-context">${wisdom.context || ''}</span>
                </div>
                <blockquote class="wisdom-quote">"${wisdom.text}"</blockquote>
                <cite class="wisdom-source">— ${wisdom.source}</cite>
            </div>
        `;
    },

    /**
     * Render weekly summary with enhanced text
     */
    _renderSummary() {
        const summaryEl = document.getElementById('weeklySummary');
        if (!summaryEl) return;

        const weekData = State.getWeekData(this.currentWeekStart);
        const practices = State.getProperty('practices');

        // Calculate stats
        let totalDone = 0;
        let totalMissed = 0;
        let focusedCount = 0;
        let mechanicalCount = 0;
        let distractedCount = 0;
        let daysWithEntries = 0;

        weekData.forEach(day => {
            let dayHasEntries = false;

            Object.values(day.entries).forEach(entry => {
                dayHasEntries = true;
                if (entry.done) {
                    totalDone++;
                    if (entry.quality === 'focused') focusedCount++;
                    else if (entry.quality === 'mechanical') mechanicalCount++;
                    else if (entry.quality === 'distracted') distractedCount++;
                } else {
                    totalMissed++;
                }
            });

            if (dayHasEntries) daysWithEntries++;
        });

        // Generate enhanced summary
        let summaryText = '';
        const completionRate = daysWithEntries > 0 ? Math.round((totalDone / (totalDone + totalMissed)) * 100) : 0;

        if (daysWithEntries === 0) {
            summaryText = 'No entries recorded this week yet. Begin your practice today.';
        } else {
            summaryText = `<strong>${daysWithEntries} day${daysWithEntries > 1 ? 's' : ''}</strong> of practice. `;
            summaryText += `<strong>${completionRate}%</strong> completion rate. `;

            if (focusedCount > mechanicalCount && focusedCount > distractedCount) {
                summaryText += '<span class="summary-positive">Quality is excellent — mostly focused sessions.</span>';
            } else if (mechanicalCount > focusedCount) {
                summaryText += '<span class="summary-neutral">Practice feels routine. Try bringing fresh attention.</span>';
            } else if (distractedCount >= focusedCount) {
                summaryText += '<span class="summary-attention">Mind is restless. Consider shorter, deeper sessions.</span>';
            }
        }

        summaryEl.innerHTML = `
            <div class="summary-title">This Week</div>
            <p class="summary-text">${summaryText}</p>
        `;
    },

    /**
     * Render quality distribution bar
     */
    _renderDistribution() {
        const distEl = document.getElementById('qualityDistribution');
        if (!distEl) return;

        const weekData = State.getWeekData(this.currentWeekStart);

        // Count qualities
        let focused = 0, mechanical = 0, distracted = 0, missed = 0;

        weekData.forEach(day => {
            Object.values(day.entries).forEach(entry => {
                if (entry.done) {
                    if (entry.quality === 'focused') focused++;
                    else if (entry.quality === 'mechanical') mechanical++;
                    else if (entry.quality === 'distracted') distracted++;
                } else {
                    missed++;
                }
            });
        });

        const total = focused + mechanical + distracted + missed;

        if (total === 0) {
            distEl.innerHTML = `
                <div class="distribution-bar"></div>
                <div class="distribution-legend">
                    <span class="legend-item"><span class="legend-dot" style="background: var(--color-text-tertiary)"></span> No data</span>
                </div>
            `;
            return;
        }

        const focusedPct = (focused / total * 100).toFixed(0);
        const mechanicalPct = (mechanical / total * 100).toFixed(0);
        const distractedPct = (distracted / total * 100).toFixed(0);
        const missedPct = (missed / total * 100).toFixed(0);

        distEl.innerHTML = `
            <div class="distribution-bar">
                <div class="distribution-segment focused" style="width: ${focusedPct}%"></div>
                <div class="distribution-segment mechanical" style="width: ${mechanicalPct}%"></div>
                <div class="distribution-segment distracted" style="width: ${distractedPct}%"></div>
                <div class="distribution-segment missed" style="width: ${missedPct}%"></div>
            </div>
            <div class="distribution-legend">
                <span class="legend-item"><span class="legend-dot" style="background: var(--color-focused)"></span> ${focusedPct}%</span>
                <span class="legend-item"><span class="legend-dot" style="background: var(--color-mechanical)"></span> ${mechanicalPct}%</span>
                <span class="legend-item"><span class="legend-dot" style="background: var(--color-distracted)"></span> ${distractedPct}%</span>
                <span class="legend-item"><span class="legend-dot" style="background: var(--color-missed)"></span> ${missedPct}%</span>
            </div>
        `;
    },

    /**
     * Bind navigation events
     */
    _bindEvents() {
        const prevBtn = document.getElementById('weekPrevBtn');
        const nextBtn = document.getElementById('weekNextBtn');
        const backBtn = document.getElementById('drishtiBackBtn');

        prevBtn?.addEventListener('click', () => {
            if (this.viewMode === 'week') {
                this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
            } else {
                this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            }
            this._render();
        });

        nextBtn?.addEventListener('click', () => {
            if (this.viewMode === 'week') {
                const currentWeekStart = Time.getWeekStart();
                if (this.currentWeekStart.getTime() < currentWeekStart.getTime()) {
                    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
                    this._render();
                }
            } else {
                const now = new Date();
                if (this.currentMonth.getMonth() < now.getMonth() ||
                    this.currentMonth.getFullYear() < now.getFullYear()) {
                    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
                    this._render();
                }
            }
        });

        backBtn?.addEventListener('click', () => {
            App.showScreen('main');
            MainScreen.refresh();
        });
    }
};

// Make it globally available
window.DrishtiScreen = DrishtiScreen;

