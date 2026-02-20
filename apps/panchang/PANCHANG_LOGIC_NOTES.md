# Panchang Logic Notes

## Architecture Overview

The Panchang app consists of three computation layers:

| Layer | File | Role |
|-------|------|------|
| Astronomy Engine | `lib/astronomy.js` | High-precision Sun/Moon positions (Don Cross, NASA/JPL-grade) |
| Vedic Engine | `lib/vedic-engine.js` | Panchang computations (Tithi, Nakshatra, Yoga, Karana, Muhurats) |
| UI Layer | `script.js` | Display, interaction, and formatting |

### Dead Code Removed
`ephemeris.js` was identified as dead code (duplicated by vedic-engine) and deleted.

---

## Ayanamsa

The app supports 4 ayanamsa systems:

| System | J2000 Value | Rate (°/yr) | Notes |
|--------|------------|-------------|-------|
| **Lahiri** (default) | 23.853° | 0.01395 | Chitrapaksha; used by Rashtriya Panchang |
| Krishnamurti (KP) | 23.753° | 0.01395 | ~6 arcmin less than Lahiri |
| Raman | 22.465° | 0.01395 | ~1.4° less than Lahiri |
| Yukteshwar | 22.483° | 0.01395 | Yoga Vasistha based |

**Formula:** `ayanamsa = J2000_VALUE + (julianCenturies * 36525 * RATE / 365.25)`

**API:** `VedicEngine.setAyanamsa('lahiri'|'krishnamurti'|'raman'|'yukteshwar')`

---

## Core Panchang Elements

### Tithi (Lunar Day)
- **Formula:** `tithiIndex = floor(elongation / 12)` where elongation = siderealMoon − siderealSun
- **Paksha:** Indices 0-14 = Shukla (waxing), 15-29 = Krishna (waning)
- **End Time:** Binary search finds when elongation crosses the next 12° boundary
- **Wrapping:** Handles 360°→0° boundary correctly

### Nakshatra (Lunar Mansion)
- **Formula:** `nakshatraIndex = floor(siderealMoonLong / (360/27))`
- 27 nakshatras, each spanning 13°20'
- **End Time:** Binary search for next segment boundary

### Yoga (Sun-Moon Sum)
- **Formula:** `yogaIndex = floor((siderealSun + siderealMoon) / (360/27))`
- 27 yogas from Vishkambha to Vaidhriti
- **End Time:** Binary search for next segment boundary

### Karana (Half-Tithi)
- **Formula:** `karanaIndex` derived from tithi elongation at half-tithi granularity
- 11 karanas: 4 fixed + 7 rotating
- Vishti (Bhadra) = inauspicious, triggers warnings

---

## Sunrise/Sunset

Uses `Astronomy.SearchRiseSet()` from astronomy-engine:
- Searches from local midnight for next rise/set events
- Returns JS Date objects in UTC; `.getHours()` provides local time
- **Day Duration** = sunset − sunrise (in decimal hours)
- **Solar Noon** = midpoint of sunrise and sunset

> [!NOTE]
> Sunrise/sunset values depend on the machine's local timezone. For Indian cities with the browser in IST, this works correctly. A timezone-explicit solution would require additional library support.

---

## Muhurat System

### Rahu Kalam / Yamaganda / Gulika Kalam

All three divide the day into 8 equal slots (dayDuration/8):

| Day | Rahu Slot | Yama Slot | Gulika Slot |
|-----|-----------|-----------|-------------|
| Sun | 8 | 5 | 6 |
| Mon | 2 | 4 | 5 |
| Tue | 7 | 3 | 4 |
| Wed | 5 | 2 | 3 |
| Thu | 6 | 1 | 2 |
| Fri | 4 | 7 | 1 |
| Sat | 3 | 6 | 7 |

**Memory aids:** Rahu = "Mother Saw Father Wearing The Turban Sari" (7,1,6,4,5,3,2 → slot order for Mon-Sun)

### Abhijit Muhurta
- **Center:** Solar noon
- **Duration:** 1 day-muhurta = dayDuration / 30
- **Wednesday Exception:** `notObserved: true` on Wednesdays (traditional rule)
- **Scaling:** Longer summer days → longer Abhijit

### Brahma Muhurta
- **End:** 1 night-muhurta before sunrise
- **Duration:** 1 night-muhurta = nightDuration / 30
- **Scaling:** Longer winter nights → longer Brahma Muhurta

---

## Hora (Planetary Hour)

Uses **Chaldean order:** Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon

| Day | First Hour Lord |
|-----|----------------|
| Sun | Sun |
| Mon | Moon |
| Tue | Mars |
| Wed | Mercury |
| Thu | Jupiter |
| Fri | Venus |
| Sat | Saturn |

- **Day Hora:** dayDuration / 12 per hora
- **Night Hora:** nightDuration / 12 per hora
- Night horas start at hora index 12 (from day lord offset)

---

## Hindu Month (Amanta)

**Algorithm:**
1. Get sidereal Sun longitude at sunrise → determine solar rashi
2. Search backward (up to 32 days) for last Amavasya (elongation ≈ 0°)
3. Get solar rashi at Amavasya → name the lunar month
4. If Purnimanta mode: shift by +1

**Month Names (Chandra):** Chaitra, Vaishakha, Jyeshtha, Ashadha, Shravana, Bhadrapada, Ashwin, Kartik, Margashirsha, Pausha, Magha, Phalguna

---

## Choghadiya

8 slots per day and night, cycled by weekday:

| Choghadiya | Quality |
|------------|---------|
| Amrit | ✅ Auspicious |
| Shubh | ✅ Auspicious |
| Labh | ✅ Auspicious |
| Char | ⚠️ Neutral (travel ok) |
| Rog | ❌ Inauspicious |
| Kaal | ❌ Inauspicious |
| Udveg | ❌ Inauspicious |

---

## Known Limitations

1. **Timezone dependency:** Sunrise/sunset use local machine timezone. Indian cities with browser in IST are correct.
2. **Ayanamsa precision:** Linear model; does not account for nutation or higher-order precession terms (error < 0.001° over decades)
3. **Dik-Amsha:** Only Sun/Moon positions shown in Graha Sthiti; 5 visible planets not computed
4. **Adhik Masa:** Intercalary month detection not implemented
5. **Nakshatrapada:** Sub-division of nakshatras into 4 padas not exposed
