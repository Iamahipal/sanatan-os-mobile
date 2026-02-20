/**
 * test-muhurtas.mjs — Tests for Rahu Kalam, Yamaganda, Gulika, Abhijit, Brahma Muhurta
 * 
 * Verifies:
 * - Rahu Kalam slot sequence [8,2,7,5,6,4,3] for Sun-Sat
 * - Yamaganda slot sequence [5,4,3,2,1,7,6]
 * - Gulika slot sequence [6,5,4,3,2,1,7]
 * - Abhijit Muhurta centered at solar noon with Wednesday exception
 * - Brahma Muhurta = 2 night-muhurtas before sunrise (scaled)
 * - hoursToTime wrapping for > 24h
 * 
 * Run: node --test tests/test-muhurtas.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const Astronomy = (await import('../lib/astronomy.js'));
globalThis.Astronomy = Astronomy;
const vedic = await import('../lib/vedic-engine.js');
const VedicEngine = vedic.default || globalThis.VedicEngine;

describe('hoursToTime wrapping', () => {
    it('should handle normal hours', () => {
        assert.equal(VedicEngine.hoursToTime(6.5), '06:30');
        assert.equal(VedicEngine.hoursToTime(18.75), '18:45');
    });

    it('should wrap hours > 24', () => {
        assert.equal(VedicEngine.hoursToTime(25.5), '01:30');
        assert.equal(VedicEngine.hoursToTime(30.0), '06:00');
    });

    it('should wrap negative hours', () => {
        assert.equal(VedicEngine.hoursToTime(-1.5), '22:30');
        assert.equal(VedicEngine.hoursToTime(-4.0), '20:00');
    });

    it('should handle exact 0 and 24', () => {
        assert.equal(VedicEngine.hoursToTime(0), '00:00');
        assert.equal(VedicEngine.hoursToTime(24), '00:00');
    });
});

describe('Rahu Kalam Slots', () => {
    // Standard Rahu Kalam slots: Sun=8, Mon=2, Tue=7, Wed=5, Thu=6, Fri=4, Sat=3
    const expectedSlots = [8, 2, 7, 5, 6, 4, 3];
    const lat = 28.6139, lon = 77.2090; // Delhi

    // 2026-01-11 is Sunday (getDay()=0), 12=Mon, 13=Tue, 14=Wed, 15=Thu, 16=Fri, 17=Sat
    for (let dow = 0; dow < 7; dow++) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        it(`${dayNames[dow]}: slot ${expectedSlots[dow]}`, () => {
            const d = new Date('2026-01-11');
            d.setDate(d.getDate() + dow);
            const p = VedicEngine.getPanchang(d, lat, lon);
            assert.ok(!p.error, p.error);
            assert.equal(p.rahuKalam.slot, expectedSlots[dow],
                `Rahu Kalam slot on ${dayNames[dow]}: expected ${expectedSlots[dow]}, got ${p.rahuKalam.slot}`);
        });
    }
});

describe('Yamaganda Slots', () => {
    // Standard: Sun=5, Mon=4, Tue=3, Wed=2, Thu=1, Fri=7, Sat=6
    const expectedSlots = [5, 4, 3, 2, 1, 7, 6];
    const lat = 28.6139, lon = 77.2090;

    for (let dow = 0; dow < 7; dow++) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        it(`${dayNames[dow]}: slot ${expectedSlots[dow]}`, () => {
            const d = new Date('2026-01-11');
            d.setDate(d.getDate() + dow);
            const p = VedicEngine.getPanchang(d, lat, lon);
            assert.equal(p.yamagandam.slot, expectedSlots[dow]);
        });
    }
});

describe('Gulika Kalam Slots', () => {
    // Standard: Sun=6, Mon=5, Tue=4, Wed=3, Thu=2, Fri=1, Sat=7
    const expectedSlots = [6, 5, 4, 3, 2, 1, 7];
    const lat = 28.6139, lon = 77.2090;

    for (let dow = 0; dow < 7; dow++) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        it(`${dayNames[dow]}: slot ${expectedSlots[dow]}`, () => {
            const d = new Date('2026-01-11');
            d.setDate(d.getDate() + dow);
            const p = VedicEngine.getPanchang(d, lat, lon);
            assert.equal(p.gulikaKalam.slot, expectedSlots[dow]);
        });
    }
});

describe('Abhijit Muhurta', () => {
    const lat = 28.6139, lon = 77.2090;

    it('should be centered at solar noon', () => {
        const d = new Date('2026-01-14'); // Wednesday
        const p = VedicEngine.getPanchang(d, lat, lon);
        const abhijit = p.auspiciousMuhurats.abhijitMuhurta;
        const mid = (abhijit.start + abhijit.end) / 2;
        const diff = Math.abs(mid - p.sunTimes.solarNoon) * 60; // in minutes
        assert.ok(diff < 1, `Abhijit center ${mid.toFixed(3)} != solar noon ${p.sunTimes.solarNoon.toFixed(3)}, diff=${diff.toFixed(1)} min`);
    });

    it('should be notObserved on Wednesday', () => {
        const wed = new Date('2026-01-14'); // Wednesday
        assert.equal(wed.getDay(), 3, 'sanity: should be Wednesday');
        const p = VedicEngine.getPanchang(wed, lat, lon);
        assert.equal(p.auspiciousMuhurats.abhijitMuhurta.notObserved, true);
    });

    it('should be observed on non-Wednesday', () => {
        const thu = new Date('2026-01-15'); // Thursday
        assert.equal(thu.getDay(), 4, 'sanity: should be Thursday');
        const p = VedicEngine.getPanchang(thu, lat, lon);
        assert.equal(p.auspiciousMuhurats.abhijitMuhurta.notObserved, false);
    });

    it('duration should scale with day length', () => {
        // Summer day is longer — muhurta should be longer
        const winter = new Date('2026-01-14');
        const summer = new Date('2026-06-15');
        const pw = VedicEngine.getPanchang(winter, lat, lon);
        const ps = VedicEngine.getPanchang(summer, lat, lon);
        const winterDur = pw.auspiciousMuhurats.abhijitMuhurta.end - pw.auspiciousMuhurats.abhijitMuhurta.start;
        const summerDur = ps.auspiciousMuhurats.abhijitMuhurta.end - ps.auspiciousMuhurats.abhijitMuhurta.start;
        assert.ok(summerDur > winterDur,
            `Summer abhijit (${(summerDur * 60).toFixed(1)} min) should be longer than winter (${(winterDur * 60).toFixed(1)} min)`);
    });
});

describe('Brahma Muhurta', () => {
    const cases = [
        { label: 'Delhi winter', date: '2026-01-14', lat: 28.6139, lon: 77.2090 },
        { label: 'Mumbai summer', date: '2026-06-15', lat: 19.0760, lon: 72.8777 },
        { label: 'Kolkata equinox', date: '2026-03-21', lat: 22.5726, lon: 88.3639 },
    ];

    for (const tc of cases) {
        it(`${tc.label}: Brahma Muhurta ends 1 night-muhurta before sunrise`, () => {
            const p = VedicEngine.getPanchang(new Date(tc.date), tc.lat, tc.lon);
            const brahma = p.auspiciousMuhurats.brahmaMuhurta;
            const nightMuhurta = p.auspiciousMuhurats.nightMuhurtaDuration;

            // End should be exactly 1 night-muhurta before sunrise
            const expectedEnd = p.sunTimes.sunrise - nightMuhurta;
            const diff = Math.abs(brahma.end - expectedEnd) * 60;
            assert.ok(diff < 0.1, `${tc.label}: Brahma end diff = ${diff.toFixed(2)} min`);

            // Duration should be 1 night-muhurta
            const duration = brahma.end - brahma.start;
            const durDiff = Math.abs(duration - nightMuhurta) * 60;
            assert.ok(durDiff < 0.1, `${tc.label}: Brahma duration diff = ${durDiff.toFixed(2)} min`);
        });
    }

    it('Brahma Muhurta should scale: longer winter nights → longer muhurta', () => {
        const lat = 28.6139, lon = 77.2090;
        const pw = VedicEngine.getPanchang(new Date('2026-01-14'), lat, lon);
        const ps = VedicEngine.getPanchang(new Date('2026-06-15'), lat, lon);
        const winterDur = pw.auspiciousMuhurats.brahmaMuhurta.end - pw.auspiciousMuhurats.brahmaMuhurta.start;
        const summerDur = ps.auspiciousMuhurats.brahmaMuhurta.end - ps.auspiciousMuhurats.brahmaMuhurta.start;
        assert.ok(winterDur > summerDur,
            `Winter brahma (${(winterDur * 60).toFixed(1)} min) should be longer than summer (${(summerDur * 60).toFixed(1)} min)`);
    });
});

describe('Muhurats within valid time ranges', () => {
    const lat = 28.6139, lon = 77.2090;
    const date = new Date('2026-01-14');

    it('all inauspicious periods should be within daylight hours', () => {
        const p = VedicEngine.getPanchang(date, lat, lon);
        const { sunrise, sunset } = p.sunTimes;

        // Rahu Kalam
        assert.ok(p.rahuKalam.start >= sunrise && p.rahuKalam.end <= sunset,
            `Rahu Kalam ${p.rahuKalam.startTime}-${p.rahuKalam.endTime} outside daylight`);

        // Yamaganda
        assert.ok(p.yamagandam.start >= sunrise && p.yamagandam.end <= sunset,
            `Yamaganda ${p.yamagandam.startTime}-${p.yamagandam.endTime} outside daylight`);

        // Gulika Kalam
        assert.ok(p.gulikaKalam.start >= sunrise && p.gulikaKalam.end <= sunset,
            `Gulika ${p.gulikaKalam.startTime}-${p.gulikaKalam.endTime} outside daylight`);
    });
});
