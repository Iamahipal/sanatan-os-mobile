/**
 * Sadhana Guru - Sakshi (Witness) Pattern Analyzer
 * Observes patterns without judgment
 */

const Sakshi = {
    /**
     * Generate patterns from user's practice history
     * Returns non-judgmental observations
     */
    analyzePatterns() {
        const patterns = [];
        const history = State.getProperty('history') || {};
        const practices = State.getProperty('practices') || [];
        const tapasya = State.getProperty('tapasya') || {};

        const historyDates = Object.keys(history).sort().reverse();
        if (historyDates.length < 3) {
            patterns.push({
                text: "Your journey has just begun. Patterns will emerge with time.",
                meta: "Early days"
            });
            return patterns;
        }

        // Analyze last 14 days
        const recentDays = this._getRecentDays(14);

        // 1. Time patterns
        const timePattern = this._analyzeTimePatterns(recentDays);
        if (timePattern) patterns.push(timePattern);

        // 2. Quality patterns
        const qualityPattern = this._analyzeQualityPatterns(recentDays);
        if (qualityPattern) patterns.push(qualityPattern);

        // 3. Practice-specific patterns
        const practicePattern = this._analyzePracticePatterns(recentDays, practices);
        if (practicePattern) patterns.push(practicePattern);

        // 4. Consistency patterns
        const consistencyPattern = this._analyzeConsistency(recentDays, practices);
        if (consistencyPattern) patterns.push(consistencyPattern);

        // 5. Tapasya progress
        const tapasyaPattern = this._analyzeTapasya(tapasya, practices);
        if (tapasyaPattern) patterns.push(tapasyaPattern);

        return patterns.slice(0, 4); // Max 4 patterns
    },

    _getRecentDays(count) {
        const history = State.getProperty('history') || {};
        const days = [];
        const today = new Date();

        for (let i = 0; i < count; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

            days.push({
                date: dateStr,
                dayName: dayName,
                data: history[dateStr] || null
            });
        }
        return days;
    },

    _analyzeTimePatterns(days) {
        let morningCount = 0;
        let eveningCount = 0;

        // This would need timestamp data - using placeholder logic
        const weekdays = days.filter(d => {
            const day = new Date(d.date).getDay();
            return day !== 0 && day !== 6 && d.data;
        }).length;

        const weekends = days.filter(d => {
            const day = new Date(d.date).getDay();
            return (day === 0 || day === 6) && d.data;
        }).length;

        if (weekdays > weekends * 2) {
            return {
                text: "Practice is more consistent on weekdays than weekends.",
                meta: `${weekdays} weekday sessions vs ${weekends} weekend sessions`
            };
        }

        return null;
    },

    _analyzeQualityPatterns(days) {
        let focused = 0, mechanical = 0, distracted = 0;

        days.forEach(day => {
            if (!day.data || !day.data.entries) return;
            Object.values(day.data.entries).forEach(entry => {
                if (entry.quality === 'focused') focused++;
                else if (entry.quality === 'mechanical') mechanical++;
                else if (entry.quality === 'distracted') distracted++;
            });
        });

        const total = focused + mechanical + distracted;
        if (total < 5) return null;

        if (mechanical > focused && mechanical > distracted) {
            const pct = Math.round((mechanical / total) * 100);
            return {
                text: `${pct}% of practices were marked as "mechanical."`,
                meta: "Consider: What would make practice feel more alive?"
            };
        }

        if (focused > mechanical && focused > distracted) {
            const pct = Math.round((focused / total) * 100);
            return {
                text: `${pct}% of practices were marked as "focused."`,
                meta: "The quality of attention is strong"
            };
        }

        if (distracted >= focused) {
            const pct = Math.round((distracted / total) * 100);
            return {
                text: `${pct}% of practices were marked as "distracted."`,
                meta: "What circumstances surrounded these sessions?"
            };
        }

        return null;
    },

    _analyzePracticePatterns(days, practices) {
        const practiceStats = {};
        practices.forEach(p => practiceStats[p.id] = { done: 0, missed: 0 });

        days.forEach(day => {
            if (!day.data || !day.data.entries) return;
            Object.entries(day.data.entries).forEach(([id, entry]) => {
                if (practiceStats[id]) {
                    if (entry.done) practiceStats[id].done++;
                    else practiceStats[id].missed++;
                }
            });
        });

        // Find strongest and weakest
        let strongest = null, weakest = null;
        let maxRate = 0, minRate = 1;

        Object.entries(practiceStats).forEach(([id, stats]) => {
            const total = stats.done + stats.missed;
            if (total < 3) return;
            const rate = stats.done / total;
            if (rate > maxRate) { maxRate = rate; strongest = id; }
            if (rate < minRate) { minRate = rate; weakest = id; }
        });

        if (strongest && weakest && strongest !== weakest) {
            const strongPractice = practices.find(p => p.id === strongest);
            const weakPractice = practices.find(p => p.id === weakest);
            return {
                text: `${strongPractice?.name || 'One practice'} is most consistent. ${weakPractice?.name || 'Another'} has more missed days.`,
                meta: "Neither is good or bad — just observed"
            };
        }

        return null;
    },

    _analyzeConsistency(days, practices) {
        let streak = 0;
        for (const day of days) {
            if (!day.data || !day.data.entries) break;
            const entries = Object.values(day.data.entries);
            const doneCount = entries.filter(e => e.done).length;
            if (doneCount >= practices.length / 2) streak++;
            else break;
        }

        if (streak >= 7) {
            return {
                text: `${streak} consecutive days with practice.`,
                meta: "Momentum is building"
            };
        }

        return null;
    },

    _analyzeTapasya(tapasya, practices) {
        const active = Object.entries(tapasya).filter(([id, t]) => t.currentDay <= 66);
        if (active.length === 0) return null;

        const [id, t] = active[0];
        const practice = practices.find(p => p.id === id);

        return {
            text: `${practice?.name || 'A practice'} is on day ${t.currentDay} of 66-day tapasya.`,
            meta: `${Math.round((t.currentDay / 66) * 100)}% complete`
        };
    },

    /**
     * Get Kshana (micro-moment) options for a practice
     */
    getKshanaOptions(practiceId) {
        const microMoments = {
            'brahma': [
                { icon: '🌅', text: 'Open eyes and acknowledge the early hour (5 seconds)' },
                { icon: '🙏', text: 'One conscious breath before rising' },
                { icon: '💭', text: 'Set one intention for the day' }
            ],
            'surya': [
                { icon: '🙏', text: 'One Surya Namaskar (2 minutes)' },
                { icon: '🧘', text: '5 slow stretches with breath' },
                { icon: '☀️', text: 'Face the sun and take 3 breaths' }
            ],
            'dhyana': [
                { icon: '🧘', text: '1 minute of silent sitting' },
                { icon: '👁️', text: '10 conscious breaths' },
                { icon: '🔔', text: 'One "OM" with full attention' }
            ],
            'japa': [
                { icon: '📿', text: '11 mantra repetitions' },
                { icon: '🕉️', text: 'One mala round with attention' },
                { icon: '🙏', text: 'Touch mala and say one mantra' }
            ],
            'digital': [
                { icon: '📵', text: 'First 30 minutes phone-free' },
                { icon: '🔕', text: 'Delay first check by 10 minutes' },
                { icon: '👁️', text: 'Notice the urge without acting' }
            ]
        };

        return microMoments[practiceId] || [
            { icon: '🌸', text: 'One conscious breath' },
            { icon: '🙏', text: 'Acknowledge the practice mentally' },
            { icon: '💭', text: 'Set intention for later' }
        ];
    }
};

// Make globally available
window.Sakshi = Sakshi;
