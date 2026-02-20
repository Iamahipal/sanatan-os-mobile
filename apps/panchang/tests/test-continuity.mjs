/**
 * test-continuity.mjs — Continuity tests: no gaps/overlaps in tithis across 30 days
 * 
 * Verifies that tithi indices progress monotonically (mod 30) across
 * consecutive days, with no missing tithis or duplicate indices.
 * 
 * Run: node --test tests/test-continuity.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const Astronomy = (await import('../lib/astronomy.js'));
globalThis.Astronomy = Astronomy;
const vedic = await import('../lib/vedic-engine.js');
const VedicEngine = vedic.default || globalThis.VedicEngine;

describe('Tithi Continuity — 30-day window', () => {
    const lat = 28.6139, lon = 77.2090; // Delhi
    const startDate = new Date('2026-01-01');

    it('tithi index should progress without gaps across 30 days', () => {
        const tithis = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const p = VedicEngine.getPanchang(d, lat, lon);
            assert.ok(!p.error, `Day ${i}: ${p.error}`);
            tithis.push({
                day: i,
                date: d.toISOString().slice(0, 10),
                tithiIndex: p.tithi.index,
                tithiName: p.tithi.fullName
            });
        }

        // Verify: consecutive days should have tithiIndex differ by 0 or 1 (mod 30)
        // (Same tithi can span two consecutive sunrises, or advance by 1)
        for (let i = 1; i < tithis.length; i++) {
            const prev = tithis[i - 1].tithiIndex;
            const curr = tithis[i].tithiIndex;
            const diff = ((curr - prev) % 30 + 30) % 30;
            assert.ok(diff <= 2,
                `Tithi jump at day ${i} (${tithis[i].date}): ` +
                `${tithis[i - 1].tithiName} (${prev}) → ${tithis[i].tithiName} (${curr}), ` +
                `diff=${diff} > 2 (should be 0 or 1, rarely 2 for short tithis)`);
        }
    });

    it('nakshatra index should progress without gaps across 30 days', () => {
        const naks = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const p = VedicEngine.getPanchang(d, lat, lon);
            naks.push({
                day: i,
                nakIndex: p.nakshatra.index,
                nakName: p.nakshatra.name
            });
        }

        for (let i = 1; i < naks.length; i++) {
            const prev = naks[i - 1].nakIndex;
            const curr = naks[i].nakIndex;
            const diff = ((curr - prev) % 27 + 27) % 27;
            assert.ok(diff <= 2,
                `Nakshatra jump at day ${i}: ` +
                `${naks[i - 1].nakName} (${prev}) → ${naks[i].nakName} (${curr}), diff=${diff}`);
        }
    });
});

describe('Yoga Continuity — 30-day window', () => {
    const lat = 19.0760, lon = 72.8777; // Mumbai
    const startDate = new Date('2026-06-01');

    it('yoga index should progress monotonically across 30 days', () => {
        const yogas = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const p = VedicEngine.getPanchang(d, lat, lon);
            yogas.push({
                day: i,
                yogaIndex: p.yoga.index,
                yogaName: p.yoga.name
            });
        }

        for (let i = 1; i < yogas.length; i++) {
            const prev = yogas[i - 1].yogaIndex;
            const curr = yogas[i].yogaIndex;
            const diff = ((curr - prev) % 27 + 27) % 27;
            assert.ok(diff <= 2,
                `Yoga jump at day ${i}: ` +
                `${yogas[i - 1].yogaName} (${prev}) → ${yogas[i].yogaName} (${curr}), diff=${diff}`);
        }
    });
});
