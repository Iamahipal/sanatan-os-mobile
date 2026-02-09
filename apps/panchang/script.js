/**
 * Panchang App - Main Application Script
 * Uses VedicEngine for accurate astronomical calculations
 * 
 * @author SanatanOS Team
 * @version 2.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // === STATE ===
    let currentDate = new Date();
    let location = { lat: 28.6139, lon: 77.2090, city: 'New Delhi' };
    let birthNakshatra = null;
    let currentPanchang = null;
    let selectedRegion = 'all';
    let settings = {
        ayanamsa: 'lahiri',
        tradition: 'north',
        region: 'all'
    };

    // === TARA BALA DESCRIPTIONS ===
    const TARA_DESCRIPTIONS = {
        0: 'Birth star day. Take extra care with health and avoid risky activities.',
        1: 'Excellent day for financial matters, investments, and new beginnings.',
        2: 'Challenging energy today. Postpone important decisions if possible.',
        3: 'Safe and stable day. Good for routine activities and family matters.',
        4: 'Minor obstacles may arise. Practice patience and persistence.',
        5: 'Great day for achievements, learning, and spiritual practices.',
        6: 'Avoid major undertakings. Focus on rest and introspection.',
        7: 'Friendly energy supports social activities and collaborations.',
        8: 'Best day of the cycle! Ideal for all important activities.'
    };

    // === INITIALIZATION ===
    function init() {
        loadSettings();
        populateNakshatraSelect();
        setupEventListeners();
        updateDisplay();
        startAutoUpdate();
        lucide.createIcons();
    }

    // === SETTINGS MANAGEMENT ===
    function loadSettings() {
        const savedLocation = localStorage.getItem('panchang_location');
        if (savedLocation) {
            location = JSON.parse(savedLocation);
        }

        const savedNakshatra = localStorage.getItem('panchang_birth_nakshatra');
        if (savedNakshatra) {
            birthNakshatra = parseInt(savedNakshatra, 10);
        }

        const savedSettings = localStorage.getItem('panchang_settings');
        if (savedSettings) {
            settings = { ...settings, ...JSON.parse(savedSettings) };
        }

        const savedRegion = localStorage.getItem('panchang_region');
        if (savedRegion) {
            selectedRegion = savedRegion;
        }

        // Apply saved settings to UI
        const ayanamsaSelect = document.getElementById('ayanamsa-select');
        const traditionSelect = document.getElementById('tradition-select');
        const regionSelect = document.getElementById('region-select');

        if (ayanamsaSelect) ayanamsaSelect.value = settings.ayanamsa;
        if (traditionSelect) traditionSelect.value = settings.tradition;
        if (regionSelect) regionSelect.value = settings.region;
    }

    function saveSettings() {
        localStorage.setItem('panchang_settings', JSON.stringify(settings));
    }

    function saveLocation() {
        localStorage.setItem('panchang_location', JSON.stringify(location));
    }

    function saveBirthNakshatra(index) {
        birthNakshatra = index;
        localStorage.setItem('panchang_birth_nakshatra', index.toString());
    }

    // === DISPLAY UPDATE ===
    function updateDisplay() {
        try {
            // Get panchang data from engine
            currentPanchang = VedicEngine.getPanchang(currentDate, location.lat, location.lon, {
                ayanamsa: settings.ayanamsa,
                tradition: settings.tradition
            });

            if (currentPanchang.error) {
                console.error(currentPanchang.error);
                return;
            }

            updateDateDisplay();
            updateMoonDisplay();
            updateSamvatsaraDisplay();
            updatePanchangElements();
            updateTimings();
            updateMuhurats();
            updateChoghadiya('day');
            updateTaraBala();
            updateFestivals();
            updateLocationDisplay();

            lucide.createIcons();
        } catch (error) {
            console.error('Error updating display:', error);
        }
    }

    function updateDateDisplay() {
        const gregorianEl = document.getElementById('gregorian-date');
        const hinduEl = document.getElementById('hindu-date');

        if (gregorianEl) {
            gregorianEl.textContent = currentDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }

        if (hinduEl && currentPanchang.hinduMonth && currentPanchang.tithi) {
            hinduEl.textContent = `${currentPanchang.hinduMonth.lunar.name} ${currentPanchang.tithi.fullName}`;
        }
    }

    function updateMoonDisplay() {
        const { tithi, moonIllumination } = currentPanchang;

        // Update moon visual
        const moonShadow = document.getElementById('moon-shadow');
        if (moonShadow) {
            const illumination = moonIllumination.percentage;
            const isWaxing = moonIllumination.isWaxing;

            if (isWaxing) {
                moonShadow.style.width = `${100 - illumination}%`;
                moonShadow.style.right = '0';
                moonShadow.style.left = 'auto';
            } else {
                moonShadow.style.width = `${100 - illumination}%`;
                moonShadow.style.left = '0';
                moonShadow.style.right = 'auto';
            }
        }

        // Update tithi display
        const tithiDisplay = document.getElementById('tithi-display');
        const moonPercent = document.getElementById('moon-percent');
        const tithiEnd = document.getElementById('tithi-end');

        if (tithiDisplay) tithiDisplay.textContent = tithi.fullName;
        if (moonPercent) moonPercent.textContent = `${moonIllumination.percentage}% Illuminated`;
        if (tithiEnd) tithiEnd.textContent = `Till ${tithi.endTime}`;
    }

    function updateSamvatsaraDisplay() {
        const { samvatsara } = currentPanchang;

        const samvatsaraName = document.getElementById('samvatsara-name');
        const vikramSamvat = document.getElementById('vikram-samvat');
        const shakaSamvat = document.getElementById('shaka-samvat');

        if (samvatsaraName) samvatsaraName.textContent = samvatsara.name;
        if (vikramSamvat) vikramSamvat.textContent = samvatsara.vikramSamvat;
        if (shakaSamvat) shakaSamvat.textContent = samvatsara.shakaSamvat;
    }

    function updatePanchangElements() {
        const { tithi, nakshatra, yoga, karana, vara } = currentPanchang;

        // Tithi
        const tithiValue = document.getElementById('tithi-value');
        const tithiTime = document.getElementById('tithi-time');
        if (tithiValue) tithiValue.textContent = tithi.fullName;
        if (tithiTime) tithiTime.textContent = `Till ${tithi.endTime}`;

        // Nakshatra
        const nakshatraValue = document.getElementById('nakshatra-value');
        const nakshatraPada = document.getElementById('nakshatra-pada');
        const nakshatraTime = document.getElementById('nakshatra-time');
        if (nakshatraValue) nakshatraValue.textContent = nakshatra.name;
        if (nakshatraPada) nakshatraPada.textContent = `Pada ${nakshatra.pada}`;
        if (nakshatraTime) nakshatraTime.textContent = `Till ${nakshatra.endTime}`;

        // Yoga
        const yogaValue = document.getElementById('yoga-value');
        const yogaTime = document.getElementById('yoga-time');
        if (yogaValue) yogaValue.textContent = yoga.name;
        if (yogaTime) yogaTime.textContent = `Till ${yoga.endTime}`;

        // Karana
        const karanaValue = document.getElementById('karana-value');
        const karanaTime = document.getElementById('karana-time');
        if (karanaValue) karanaValue.textContent = karana.name;
        if (karanaTime) karanaTime.textContent = `Till ${karana.endTime}`;

        // Vara (Day)
        const varaValue = document.getElementById('vara-value');
        const varaDeity = document.getElementById('vara-deity');
        const dayColor = document.getElementById('day-color');
        if (varaValue) varaValue.textContent = vara.name;
        if (varaDeity) varaDeity.textContent = `Lord ${vara.nameEn.replace('day', '').trim()}`;
        if (dayColor) dayColor.style.background = vara.color;
    }

    function updateTimings() {
        const { sunTimes, moonTimes } = currentPanchang;

        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');
        const moonrise = document.getElementById('moonrise');
        const moonset = document.getElementById('moonset');

        if (sunrise) sunrise.textContent = sunTimes.sunriseTime;
        if (sunset) sunset.textContent = sunTimes.sunsetTime;
        if (moonrise) moonrise.textContent = moonTimes.moonriseTime;
        if (moonset) moonset.textContent = moonTimes.moonsetTime;
    }

    function updateMuhurats() {
        const { auspiciousMuhurats, rahuKalam, yamagandam, gulikaKalam } = currentPanchang;

        // Auspicious
        const brahmaMuhurat = document.getElementById('brahma-muhurat');
        const abhijitMuhurat = document.getElementById('abhijit-muhurat');
        const godhuliMuhurat = document.getElementById('godhuli-muhurat');

        if (brahmaMuhurat) {
            brahmaMuhurat.textContent = `${auspiciousMuhurats.brahmaMuhurta.startTime} - ${auspiciousMuhurats.brahmaMuhurta.endTime}`;
        }
        if (abhijitMuhurat) {
            abhijitMuhurat.textContent = `${auspiciousMuhurats.abhijitMuhurta.startTime} - ${auspiciousMuhurats.abhijitMuhurta.endTime}`;
        }
        if (godhuliMuhurat) {
            godhuliMuhurat.textContent = `${auspiciousMuhurats.godhuliMuhurta.startTime} - ${auspiciousMuhurats.godhuliMuhurta.endTime}`;
        }

        // Inauspicious
        const rahuKalamEl = document.getElementById('rahu-kalam');
        const yamagandamEl = document.getElementById('yamagandam');
        const gulikaKalamEl = document.getElementById('gulika-kalam');

        if (rahuKalamEl) rahuKalamEl.textContent = `${rahuKalam.startTime} - ${rahuKalam.endTime}`;
        if (yamagandamEl) yamagandamEl.textContent = `${yamagandam.startTime} - ${yamagandam.endTime}`;
        if (gulikaKalamEl) gulikaKalamEl.textContent = `${gulikaKalam.startTime} - ${gulikaKalam.endTime}`;
    }

    function updateChoghadiya(period) {
        const grid = document.getElementById('choghadiya-grid');
        if (!grid || !currentPanchang.choghadiya) return;

        const slots = currentPanchang.choghadiya[period];
        const currentHour = new Date().getHours() + new Date().getMinutes() / 60;

        grid.innerHTML = slots.map((slot, i) => {
            const isCurrent = currentHour >= slot.start && currentHour < slot.end;
            return `
                <div class="chog-card ${slot.good ? 'good' : 'bad'} ${isCurrent ? 'current' : ''}">
                    <span class="chog-name">${slot.name}</span>
                    <span class="chog-english">${slot.nameEn}</span>
                    <span class="chog-time">${slot.startTime} - ${slot.endTime}</span>
                </div>
            `;
        }).join('');

        // Update current choghadiya alert
        updateCurrentChoghadiyaAlert(slots, currentHour);
    }

    function updateCurrentChoghadiyaAlert(slots, currentHour) {
        const alertEl = document.getElementById('current-chog-alert');
        const iconEl = document.getElementById('current-chog-icon');
        const nameEl = document.getElementById('current-chog-name');
        const timeEl = document.getElementById('current-chog-time');

        if (!alertEl) return;

        const currentSlot = slots.find(slot => currentHour >= slot.start && currentHour < slot.end);

        if (currentSlot) {
            alertEl.style.display = 'flex';
            alertEl.className = `current-chog-alert ${currentSlot.good ? 'good' : 'bad'}`;
            if (iconEl) iconEl.textContent = currentSlot.good ? '✨' : '⚠️';
            if (nameEl) nameEl.textContent = `${currentSlot.name} (${currentSlot.nameEn})`;
            if (timeEl) {
                const remainingMins = Math.floor((currentSlot.end - currentHour) * 60);
                timeEl.textContent = `${remainingMins} min remaining`;
            }
        } else {
            alertEl.style.display = 'none';
        }
    }

    function updateTaraBala() {
        const taraSetup = document.getElementById('tara-setup');
        const taraResult = document.getElementById('tara-result');

        if (birthNakshatra === null) {
            if (taraSetup) taraSetup.style.display = 'block';
            if (taraResult) taraResult.style.display = 'none';
            return;
        }

        if (taraSetup) taraSetup.style.display = 'none';
        if (taraResult) taraResult.style.display = 'block';

        const taraBala = VedicEngine.calculateTaraBala(
            birthNakshatra,
            currentPanchang.nakshatra.index
        );

        const meterEl = document.getElementById('tara-meter');
        const iconEl = document.getElementById('tara-icon');
        const nameEl = document.getElementById('tara-name');
        const englishEl = document.getElementById('tara-english');
        const badgeEl = document.getElementById('tara-badge');
        const descEl = document.getElementById('tara-desc');

        if (meterEl) meterEl.className = `tara-meter ${taraBala.good ? 'good' : 'bad'}`;
        if (iconEl) iconEl.textContent = taraBala.good ? '✨' : '⚠️';
        if (nameEl) nameEl.textContent = taraBala.name;
        if (englishEl) englishEl.textContent = taraBala.result;
        if (badgeEl) {
            badgeEl.textContent = taraBala.good ? 'Good' : 'Caution';
            badgeEl.className = `tara-badge ${taraBala.good ? 'good' : 'bad'}`;
        }
        if (descEl) descEl.textContent = TARA_DESCRIPTIONS[taraBala.index];
    }

    function updateFestivals() {
        const eventsList = document.getElementById('events-list');
        if (!eventsList) return;

        try {
            const festivals = FestivalCalculator.getFestivalsForDate(
                currentDate,
                VedicEngine,
                location.lat,
                location.lon,
                selectedRegion
            );

            if (!festivals || festivals.length === 0) {
                eventsList.innerHTML = `
                    <div class="no-events">
                        कोई विशेष उत्सव नहीं | No special events today
                    </div>
                `;
                return;
            }

            eventsList.innerHTML = festivals.map(event => `
                <div class="event-card">
                    <span class="event-icon">${event.icon || '🙏'}</span>
                    <div class="event-content">
                        <div class="event-header">
                            <div>
                                <span class="event-name">${event.name}</span>
                                ${event.nameEn ? `<span class="event-name-en">${event.nameEn}</span>` : ''}
                            </div>
                            <span class="event-type">${event.type || 'Festival'}</span>
                        </div>
                        ${event.significance ? `<p class="event-desc">${event.significance}</p>` : ''}
                        ${event.naivedya ? `
                            <div class="event-naivedya">
                                <i data-lucide="utensils"></i>
                                <span>नैवेद्य: ${event.naivedya}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');

            lucide.createIcons();
        } catch (error) {
            console.error('Error loading festivals:', error);
            eventsList.innerHTML = `
                <div class="no-events">
                    कोई विशेष उत्सव नहीं | No special events today
                </div>
            `;
        }
    }

    function updateLocationDisplay() {
        const locationName = document.getElementById('location-name');
        if (locationName) locationName.textContent = location.city;
    }

    // === NAKSHATRA SELECT ===
    function populateNakshatraSelect() {
        const select = document.getElementById('birth-nakshatra');
        if (!select) return;

        VedicEngine.NAKSHATRAS.forEach((nakshatra, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${nakshatra.name} (${nakshatra.nameEn})`;
            select.appendChild(option);
        });

        if (birthNakshatra !== null) {
            select.value = birthNakshatra;
        }
    }

    // === SANKALPA GENERATOR ===
    function generateSankalpa() {
        const userName = document.getElementById('user-name')?.value || '(नाम)';
        const userGotra = document.getElementById('user-gotra')?.value || '(गोत्र)';

        const { samvatsara, ayana, ritu, hinduMonth, tithi, nakshatra, vara } = currentPanchang;

        const text = `॥ श्री गणेशाय नमः ॥

अद्य ब्रह्मणः द्वितीय परार्धे, श्वेतवराहकल्पे, वैवस्वतमन्वन्तरे, 
अष्टाविंशतितमे कलियुगे, प्रथम चरणे, 
${samvatsara.name} नाम संवत्सरे, ${ayana.name}े, ${ritu.name} ऋतौ, 
${hinduMonth.lunar.name} मासे, ${tithi.paksha} पक्षे, ${tithi.name} तिथौ, 
${vara.name} वासरे, ${nakshatra.name} नक्षत्रे,

${userGotra} गोत्रः ${userName} अहं...

[पूजा/कर्म का उद्देश्य यहाँ बोलें]`;

        const textEl = document.getElementById('sankalpa-text');
        if (textEl) textEl.textContent = text;

        document.getElementById('sankalpa-setup').style.display = 'none';
        document.getElementById('sankalpa-result').style.display = 'block';

        // Save user details
        localStorage.setItem('panchang_user_name', userName);
        localStorage.setItem('panchang_user_gotra', userGotra);

        lucide.createIcons();
    }

    function speakSankalpa() {
        const textEl = document.getElementById('sankalpa-text');
        if (!textEl) return;

        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textEl.textContent);
            utterance.lang = 'hi-IN';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    function copySankalpa() {
        const textEl = document.getElementById('sankalpa-text');
        if (!textEl) return;

        navigator.clipboard.writeText(textEl.textContent).then(() => {
            const copyBtn = document.getElementById('copy-sankalpa');
            if (copyBtn) {
                copyBtn.innerHTML = '<i data-lucide="check"></i>';
                lucide.createIcons();
                setTimeout(() => {
                    copyBtn.innerHTML = '<i data-lucide="copy"></i>';
                    lucide.createIcons();
                }, 2000);
            }
        });
    }

    // === AUTO-UPDATE ===
    function startAutoUpdate() {
        // Update choghadiya every minute
        setInterval(() => {
            const now = new Date();
            const sunrise = currentPanchang?.sunTimes?.sunrise || 6;
            const sunset = currentPanchang?.sunTimes?.sunset || 18;
            const currentHour = now.getHours() + now.getMinutes() / 60;

            const period = currentHour >= sunrise && currentHour < sunset ? 'day' : 'night';
            updateChoghadiya(period);
        }, 60000);
    }

    // === EVENT LISTENERS ===
    function setupEventListeners() {
        // Date navigation
        document.getElementById('prev-day')?.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() - 1);
            updateDisplay();
        });

        document.getElementById('next-day')?.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() + 1);
            updateDisplay();
        });

        // Date display click - go to today
        document.getElementById('date-display')?.addEventListener('click', () => {
            currentDate = new Date();
            updateDisplay();
        });

        // Settings modal
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('active');
            lucide.createIcons();
        });

        document.getElementById('close-settings')?.addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('active');
        });

        document.getElementById('settings-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') {
                document.getElementById('settings-modal').classList.remove('active');
            }
        });

        // Settings changes
        document.getElementById('ayanamsa-select')?.addEventListener('change', (e) => {
            settings.ayanamsa = e.target.value;
            saveSettings();
            updateDisplay();
        });

        document.getElementById('tradition-select')?.addEventListener('change', (e) => {
            settings.tradition = e.target.value;
            saveSettings();
            updateDisplay();
        });

        document.getElementById('region-select')?.addEventListener('change', (e) => {
            settings.region = e.target.value;
            selectedRegion = e.target.value;
            localStorage.setItem('panchang_region', selectedRegion);
            saveSettings();
            updateFestivals();
        });

        // Location modal
        document.getElementById('location-btn')?.addEventListener('click', () => {
            document.getElementById('location-modal').classList.add('active');
            lucide.createIcons();
        });

        document.getElementById('close-location')?.addEventListener('click', () => {
            document.getElementById('location-modal').classList.remove('active');
        });

        document.getElementById('location-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'location-modal') {
                document.getElementById('location-modal').classList.remove('active');
            }
        });

        // Auto location
        document.getElementById('auto-location')?.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('Geolocation not supported');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    location.lat = pos.coords.latitude;
                    location.lon = pos.coords.longitude;
                    location.city = 'Current Location';
                    saveLocation();
                    updateDisplay();
                    document.getElementById('location-modal').classList.remove('active');
                },
                (err) => {
                    alert('Could not get location. Please select a city.');
                }
            );
        });

        // City buttons
        document.querySelectorAll('.city-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                location.lat = parseFloat(btn.dataset.lat);
                location.lon = parseFloat(btn.dataset.lon);
                location.city = btn.textContent;
                saveLocation();
                updateDisplay();
                document.getElementById('location-modal').classList.remove('active');
            });
        });

        // Choghadiya tabs
        document.querySelectorAll('.chog-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.chog-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                updateChoghadiya(tab.dataset.period);
            });
        });

        // Region tabs
        document.querySelectorAll('.region-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.region-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                selectedRegion = tab.dataset.region;
                localStorage.setItem('panchang_region', selectedRegion);
                updateFestivals();
            });
        });

        // Tara Bala
        document.getElementById('save-nakshatra')?.addEventListener('click', () => {
            const select = document.getElementById('birth-nakshatra');
            if (select && select.value !== '') {
                saveBirthNakshatra(parseInt(select.value, 10));
                updateTaraBala();
            }
        });

        document.getElementById('change-nakshatra')?.addEventListener('click', () => {
            document.getElementById('tara-setup').style.display = 'block';
            document.getElementById('tara-result').style.display = 'none';
        });

        // Sankalpa
        document.getElementById('generate-sankalpa')?.addEventListener('click', generateSankalpa);
        document.getElementById('speak-sankalpa')?.addEventListener('click', speakSankalpa);
        document.getElementById('copy-sankalpa')?.addEventListener('click', copySankalpa);

        document.getElementById('edit-sankalpa')?.addEventListener('click', () => {
            document.getElementById('sankalpa-setup').style.display = 'block';
            document.getElementById('sankalpa-result').style.display = 'none';
        });

        // Load saved user details for sankalpa
        const savedName = localStorage.getItem('panchang_user_name');
        const savedGotra = localStorage.getItem('panchang_user_gotra');
        if (savedName) document.getElementById('user-name').value = savedName;
        if (savedGotra) document.getElementById('user-gotra').value = savedGotra;
    }

    // === START ===
    init();
});
