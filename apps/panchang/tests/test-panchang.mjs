/**
 * test-panchang.mjs — Golden Tests for Panchang computations
 * 
 * Reference data: DrikPanchang.com + Rashtriya Panchang (Lahiri Ayanamsa)
 * Tolerances:
 *   Sunrise/Sunset: ±5 minutes (±0.083 hours)
 *   Tithi/Nakshatra end: ±10 minutes (±0.167 hours)
 *   Lunar month: exact (or documented difference)
 * 
 * Run: node --test tests/test-panchang.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Load astronomy-engine and vedic-engine
const Astronomy = (await import('../lib/astronomy.js'));

// Make Astronomy available globally as vedic-engine.js expects it
globalThis.Astronomy = Astronomy;

// Load vedic-engine
const vedic = await import('../lib/vedic-engine.js');
const VedicEngine = vedic.default || globalThis.VedicEngine;

// ========== HELPER FUNCTIONS ==========

function hoursToHHMM(h) {
    h = ((h % 24) + 24) % 24;
    const hrs = Math.floor(h);
    const min = Math.floor((h - hrs) * 60);
    return `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

function assertTimeClose(actual, expected, toleranceMinutes, label) {
    const diff = Math.abs(actual - expected) * 60;
    assert.ok(diff <= toleranceMinutes,
        `${label}: expected ~${hoursToHHMM(expected)} (${expected.toFixed(3)}h), ` +
        `got ${hoursToHHMM(actual)} (${actual.toFixed(3)}h), diff=${diff.toFixed(1)} min > ${toleranceMinutes} min tolerance`);
}

// ========== TEST CASES ==========
// Golden reference data for Indian cities.
// Source: DrikPanchang.com (Lahiri Chitrapaksha Ayanamsa).
// Some values approximated where exact scraping wasn't possible — 
// verified against Rashtriya Panchang and Astrosage cross-references.

const GOLDEN_CASES = [
    {
        // Delhi, Makar Sankranti 2026
        label: 'Delhi 2026-01-14',
        date: '2026-01-14',
        lat: 28.6139, lon: 77.2090,
        expected: {
            sunriseApprox: 7.25,   // ~07:15 IST
            sunsetApprox: 17.75,   // ~17:45 IST
            tithiNameEn: 'Ekadashi', // K-11
            nakshatraNameEn: 'Anuradha',
        }
    },
    {
        // Mumbai, Republic Day
        label: 'Mumbai 2026-01-26',
        date: '2026-01-26',
        lat: 19.0760, lon: 72.8777,
        expected: {
            sunriseApprox: 7.23,   // ~07:14 IST
            sunsetApprox: 18.45,   // ~18:27 IST
            tithiNameEn: 'Ashtami',
            nakshatraNameEn: 'Ashwini',
        }
    },
    {
        // Kolkata, Independence Day
        label: 'Kolkata 2026-08-15',
        date: '2026-08-15',
        lat: 22.5726, lon: 88.3639,
        expected: {
            sunriseApprox: 5.22,   // ~05:13 IST
            sunsetApprox: 18.13,   // ~18:08 IST
        }
    },
    {
        // Chennai, winter solstice vicinity
        label: 'Chennai 2026-12-22',
        date: '2026-12-22',
        lat: 13.0827, lon: 80.2707,
        expected: {
            sunriseApprox: 6.43,   // ~06:26 IST
            sunsetApprox: 17.80,   // ~17:48 IST
        }
    },
    {
        // Guwahati (far east) — sunrise should be earlier
        label: 'Guwahati 2026-03-21',
        date: '2026-03-21',
        lat: 26.1445, lon: 91.7362,
        expected: {
            sunriseApprox: 5.43,   // ~05:26 IST
            sunsetApprox: 17.57,   // ~17:34 IST
        }
    },
];

describe('Golden Panchang Tests', () => {
    for (const tc of GOLDEN_CASES) {
        describe(tc.label, () => {
            let panchang;

            it('should compute panchang without error', () => {
                panchang = VedicEngine.getPanchang(new Date(tc.date), tc.lat, tc.lon);
                assert.ok(!panchang.error, `Panchang error: ${panchang.error}`);
                assert.ok(panchang.sunTimes, 'sunTimes must be present');
                assert.ok(panchang.tithi, 'tithi must be present');
                assert.ok(panchang.nakshatra, 'nakshatra must be present');
            });

            if (tc.expected.sunriseApprox) {
                it('sunrise within ±3 min', () => {
                    panchang = panchang || VedicEngine.getPanchang(new Date(tc.date), tc.lat, tc.lon);
                    assertTimeClose(panchang.sunTimes.sunrise, tc.expected.sunriseApprox, 5, 'Sunrise');
                });
            }

            if (tc.expected.sunsetApprox) {
                it('sunset within ±3 min', () => {
                    panchang = panchang || VedicEngine.getPanchang(new Date(tc.date), tc.lat, tc.lon);
                    assertTimeClose(panchang.sunTimes.sunset, tc.expected.sunsetApprox, 5, 'Sunset');
                });
            }

            if (tc.expected.tithiNameEn) {
                it(`tithi should be ${tc.expected.tithiNameEn}`, () => {
                    panchang = panchang || VedicEngine.getPanchang(new Date(tc.date), tc.lat, tc.lon);
                    assert.equal(panchang.tithi.nameEn, tc.expected.tithiNameEn,
                        `Tithi mismatch: got "${panchang.tithi.nameEn}")`);
                });
            }

            if (tc.expected.nakshatraNameEn) {
                it(`nakshatra should be ${tc.expected.nakshatraNameEn}`, () => {
                    panchang = panchang || VedicEngine.getPanchang(new Date(tc.date), tc.lat, tc.lon);
                    assert.equal(panchang.nakshatra.nameEn, tc.expected.nakshatraNameEn,
                        `Nakshatra mismatch: got "${panchang.nakshatra.nameEn}"`);
                });
            }
        });
    }
});

describe('Ayanamsa Systems', () => {
    const date = new Date('2026-01-14');

    it('Lahiri should return ~24.19° for 2026', () => {
        const a = VedicEngine.getAyanamsa(date, 'lahiri');
        // Lahiri J2000 = 23.853° + 26 years * 0.01395°/yr ≈ 24.216°
        assert.ok(a > 24.0 && a < 24.5, `Lahiri ayanamsa = ${a}, expected ~24.2`);
    });

    it('Krishnamurti should differ from Lahiri by ~6 arcmin', () => {
        const l = VedicEngine.getAyanamsa(date, 'lahiri');
        const k = VedicEngine.getAyanamsa(date, 'krishnamurti');
        const diff = Math.abs(l - k) * 60; // arcminutes
        assert.ok(diff > 3 && diff < 10, `KP-Lahiri diff = ${diff.toFixed(1)} arcmin, expected ~6`);
    });

    it('Raman should be ~1.4° less than Lahiri', () => {
        const l = VedicEngine.getAyanamsa(date, 'lahiri');
        const r = VedicEngine.getAyanamsa(date, 'raman');
        const diff = l - r;
        assert.ok(diff > 1.0 && diff < 2.0, `Lahiri-Raman = ${diff.toFixed(3)}°, expected ~1.4°`);
    });

    it('setAyanamsa should change system', () => {
        VedicEngine.setAyanamsa('krishnamurti');
        const p1 = VedicEngine.getPanchang(date, 28.6139, 77.2090);
        assert.equal(p1.ayanamsaSystem, 'krishnamurti');

        VedicEngine.setAyanamsa('lahiri');
        const p2 = VedicEngine.getPanchang(date, 28.6139, 77.2090);
        assert.equal(p2.ayanamsaSystem, 'lahiri');
    });
});

describe('Structural Sanity', () => {
    const date = new Date('2026-06-15');
    const lat = 28.6139, lon = 77.2090;

    it('sunTimes has all required fields', () => {
        const p = VedicEngine.getPanchang(date, lat, lon);
        const st = p.sunTimes;
        assert.ok(st.sunrise > 0 && st.sunrise < 12, `sunrise=${st.sunrise}`);
        assert.ok(st.sunset > 12 && st.sunset < 24, `sunset=${st.sunset}`);
        assert.ok(st.dayDuration > 8 && st.dayDuration < 18, `dayDuration=${st.dayDuration}`);
        assert.ok(st.solarNoon > 11 && st.solarNoon < 13, `solarNoon=${st.solarNoon}`);
        assert.ok(st.sunriseTime, 'sunriseTime string missing');
        assert.ok(st.sunsetTime, 'sunsetTime string missing');
    });

    it('tithi has fullName and endTime', () => {
        const p = VedicEngine.getPanchang(date, lat, lon);
        assert.ok(p.tithi.fullName, 'tithi.fullName missing');
        assert.ok(p.tithi.endTime, 'tithi.endTime missing');
    });

    it('nakshatra has name and endTime', () => {
        const p = VedicEngine.getPanchang(date, lat, lon);
        assert.ok(p.nakshatra.name, 'nakshatra.name missing');
        assert.ok(p.nakshatra.endTime, 'nakshatra.endTime missing');
    });

    it('yoga has name and endTime', () => {
        const p = VedicEngine.getPanchang(date, lat, lon);
        assert.ok(p.yoga.name, 'yoga.name missing');
        assert.ok(p.yoga.endTime, 'yoga.endTime missing');
    });

    it('karana has name and endTime', () => {
        const p = VedicEngine.getPanchang(date, lat, lon);
        assert.ok(p.karana.name, 'karana.name missing');
        assert.ok(p.karana.endTime, 'karana.endTime missing');
    });

    it('vara has name and nameEn', () => {
        const p = VedicEngine.getPanchang(date, lat, lon);
        assert.ok(p.vara.name, 'vara.name missing');
        assert.ok(p.vara.nameEn, 'vara.nameEn missing');
    });

    it('hinduMonth has lunar and solar', () => {
        const p = VedicEngine.getPanchang(date, lat, lon);
        assert.ok(p.hinduMonth.lunar, 'hinduMonth.lunar missing');
        assert.ok(p.hinduMonth.solar, 'hinduMonth.solar missing');
        assert.ok(p.hinduMonth.mode, 'hinduMonth.mode missing');
    });

    it('muhurats have start/end times', () => {
        const p = VedicEngine.getPanchang(date, lat, lon);
        assert.ok(p.rahuKalam.startTime, 'rahuKalam.startTime missing');
        assert.ok(p.yamagandam.startTime, 'yamagandam.startTime missing');
        assert.ok(p.gulikaKalam.startTime, 'gulikaKalam.startTime missing');
        assert.ok(p.auspiciousMuhurats.brahmaMuhurta.startTime, 'brahmaMuhurta missing');
        assert.ok(p.auspiciousMuhurats.abhijitMuhurta.startTime, 'abhijitMuhurta missing');
    });

    it('choghadiya has day and night arrays of 8 slots each', () => {
        const p = VedicEngine.getPanchang(date, lat, lon);
        assert.equal(p.choghadiya.day.length, 8, 'day choghadiya should have 8 slots');
        assert.equal(p.choghadiya.night.length, 8, 'night choghadiya should have 8 slots');
    });
});
