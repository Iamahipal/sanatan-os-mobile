/**
 * Festival Loading Tests
 * Tests that FestivalCalculator works end-to-end with VedicEngine
 */
import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Simulate browser-like global environment
globalThis.Astronomy = require('../lib/astronomy.js');
globalThis.VedicEngine = require('../lib/vedic-engine.js');
globalThis.FestivalCalculator = require('../lib/festival-calculator.js');

describe('FestivalCalculator Loads', () => {
    it('FestivalCalculator is an object (not undefined)', () => {
        assert.equal(typeof FestivalCalculator, 'object');
        assert.notEqual(FestivalCalculator, null);
    });

    it('exposes required API methods', () => {
        assert.equal(typeof FestivalCalculator.getFestivalsForDate, 'function');
        assert.equal(typeof FestivalCalculator.getFestivalsForMonth, 'function');
        assert.equal(typeof FestivalCalculator.findTithiDate, 'function');
        assert.equal(typeof FestivalCalculator.FESTIVALS, 'object');
    });
});

describe('getFestivalsForMonth — Known Dates', () => {
    const LAT = 18.5204; // Pune
    const LON = 73.8567;

    it('returns non-empty for Feb 2026 (Pune)', (t) => {
        const result = FestivalCalculator.getFestivalsForMonth(2026, 1, VedicEngine, LAT, LON);
        assert.ok(Array.isArray(result), 'result should be an array');
        assert.ok(result.length > 0, `expected festivals but got ${result.length}`);
        // Should have at least a Purnima or Amavasya
        const hasPurnimaOrAmavasya = result.some(f =>
            f.id === 'purnima' || f.id === 'amavasya'
        );
        assert.ok(hasPurnimaOrAmavasya, 'should include Purnima or Amavasya');
    });

    it('returns non-empty for Jan 2026 (Delhi)', () => {
        const result = FestivalCalculator.getFestivalsForMonth(2026, 0, VedicEngine, 28.6139, 77.2090);
        assert.ok(result.length > 0, `expected festivals but got ${result.length}`);
    });

    it('returns non-empty for Oct 2026 (Mumbai — festival-rich month)', () => {
        const result = FestivalCalculator.getFestivalsForMonth(2026, 9, VedicEngine, 19.0760, 72.8777);
        assert.ok(result.length > 0, `expected festivals but got ${result.length}`);
    });

    it('every festival has required fields', () => {
        const result = FestivalCalculator.getFestivalsForMonth(2026, 1, VedicEngine, LAT, LON);
        for (const f of result) {
            assert.ok(f.gregorianDate instanceof Date, `gregorianDate must be Date, got ${typeof f.gregorianDate}`);
            assert.ok(typeof f.dateString === 'string', `dateString must be string`);
            assert.ok(typeof f.id === 'string', `id must be string`);
        }
    });
});

describe('6-Month Scan (getNextFestivals equivalent)', () => {
    const LAT = 18.5204;
    const LON = 73.8567;

    it('returns ≥ 5 festivals over 6 months from Feb 2026', () => {
        const startDate = new Date(2026, 1, 19);
        let all = [];
        let month = startDate.getMonth();
        let year = startDate.getFullYear();

        for (let i = 0; i < 6; i++) {
            const r = FestivalCalculator.getFestivalsForMonth(year, month, VedicEngine, LAT, LON);
            all.push(...r);
            month++;
            if (month > 11) { month = 0; year++; }
        }

        const today = new Date(startDate);
        today.setHours(0, 0, 0, 0);
        const future = all
            .filter(f => f.gregorianDate >= today)
            .sort((a, b) => a.gregorianDate - b.gregorianDate);

        assert.ok(future.length >= 5,
            `expected ≥ 5 future festivals, got ${future.length}`
        );
    });

    it('never hangs — completes within 15 seconds', async () => {
        const timer = setTimeout(() => {
            assert.fail('Festival scan timed out after 15s');
        }, 15000);

        const startDate = new Date(2026, 1, 19);
        let month = startDate.getMonth();
        let year = startDate.getFullYear();

        for (let i = 0; i < 6; i++) {
            FestivalCalculator.getFestivalsForMonth(year, month, VedicEngine, 18.5204, 73.8567);
            month++;
            if (month > 11) { month = 0; year++; }
        }

        clearTimeout(timer);
    });
});

describe('Festival Dates Are Valid', () => {
    it('all gregorianDate values are in the queried month', () => {
        const year = 2026, month = 3; // April
        const result = FestivalCalculator.getFestivalsForMonth(year, month, VedicEngine, 18.5204, 73.8567);

        for (const f of result) {
            assert.equal(f.gregorianDate.getFullYear(), year);
            assert.equal(f.gregorianDate.getMonth(), month);
        }
    });

    it('festivals are sorted by date', () => {
        const result = FestivalCalculator.getFestivalsForMonth(2026, 1, VedicEngine, 18.5204, 73.8567);
        for (let i = 1; i < result.length; i++) {
            assert.ok(
                result[i].gregorianDate >= result[i - 1].gregorianDate,
                `festivals not sorted at index ${i}`
            );
        }
    });
});
