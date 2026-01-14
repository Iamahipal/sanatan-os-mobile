/**
 * Sadhana Guru - Drishti (View) Screen Handler
 * Weekly patterns and insights
 */

const DrishtiScreen = {
    currentWeekStart: null,

    /**
     * Initialize drishti screen
     */
    init() {
        this.currentWeekStart = Time.getWeekStart();
        this._render();
        this._bindEvents();
    },

    /**
     * Render the entire screen
     */
    _render() {
        this._renderWeekNav();
        this._renderWeeklyGrid();
        this._renderSummary();
        this._renderDistribution();
    },

    /**
     * Render week navigation
     */
    _renderWeekNav() {
        const displayEl = document.getElementById('weekDisplay');
        if (!displayEl) return;

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
     * Render weekly grid with dots
     */
    _renderWeeklyGrid() {
        const gridEl = document.getElementById('weeklyGrid');
        if (!gridEl) return;

        const weekData = State.getWeekData(this.currentWeekStart);
        const practices = State.getProperty('practices');
        const today = new Date();

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
     * Render weekly summary
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

        // Generate summary text
        let summaryText = '';

        if (daysWithEntries === 0) {
            summaryText = 'No entries recorded this week yet. Start your practice today.';
        } else {
            summaryText = `${daysWithEntries} day${daysWithEntries > 1 ? 's' : ''} of practice recorded. `;

            if (focusedCount > mechanicalCount && focusedCount > distractedCount) {
                summaryText += 'Quality has been good with mostly focused sessions.';
            } else if (mechanicalCount > focusedCount && mechanicalCount > distractedCount) {
                summaryText += 'Practice feels mechanical. Try bringing more awareness.';
            } else if (distractedCount > 0) {
                summaryText += 'Some distraction noted. Consider adjusting your environment.';
            }

            if (totalMissed > totalDone) {
                summaryText += ' More practices missed than completed - reflect on obstacles.';
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
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
            this._render();
        });

        nextBtn?.addEventListener('click', () => {
            const currentWeekStart = Time.getWeekStart();
            if (this.currentWeekStart.getTime() < currentWeekStart.getTime()) {
                this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
                this._render();
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
