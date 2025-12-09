/**
 * Sanskrit Vidya - Core App Logic
 * The Guru-Shishya Digital Parampara
 */

// ===== APP STATE =====
const state = {
    // Current screen/view
    currentScreen: 'home',
    screenHistory: [],

    // User progress
    selectedPath: null,
    currentLevel: 'pravesha',

    // Varnamala state
    currentCategory: 'swaras',
    currentLetter: null,
    currentLetterIndex: 0,

    // Shlokarship state
    currentShloka: null,
    currentLineIndex: 0,
    currentScript: 'devanagari',
    currentBenefitTab: 'scientific',

    // Progress data (loaded from localStorage)
    progress: {
        streak: 0,
        lastPracticeDate: null,
        totalDays: 0,
        varnamala: {
            completed: [],
            current: null
        },
        shlokas: {
            memorized: [],
            inProgress: {}
        },
        achievements: []
    },

    // Settings
    settings: {
        audioSpeed: 'normal',
        haptics: true,
        autoPlay: false
    },

    // Phase 2: Sandhi Practice
    sandhiPractice: {
        currentIndex: 0,
        score: 0,
        answered: false
    },

    // Phase 2: AI Guru Chat
    guruChat: {
        currentScenario: 'temple',
        conversationStep: 0,
        history: []
    }
};

// ===== DOM HELPERS =====
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    renderPaths();
    renderModulesProgress();
    renderShlokaList();
    updateStreakDisplay();
    updateMandala();
    setupEventListeners();

    // Phase 2 handlers (defined at end of file)
    if (typeof setupGrammarHandlers === 'function') setupGrammarHandlers();
    if (typeof setupGuruChatHandlers === 'function') setupGuruChatHandlers();
    if (typeof setupPronunciationHandlers === 'function') setupPronunciationHandlers();
});

// ===== PROGRESS MANAGEMENT =====
function loadProgress() {
    const saved = localStorage.getItem('sanskritVidyaProgress');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state.progress = { ...state.progress, ...parsed };
            checkStreak();
        } catch (e) {
            console.error('Failed to load progress:', e);
        }
    }
}

function saveProgress() {
    localStorage.setItem('sanskritVidyaProgress', JSON.stringify(state.progress));
}

function checkStreak() {
    const today = new Date().toDateString();
    const lastPractice = state.progress.lastPracticeDate;

    if (lastPractice) {
        const lastDate = new Date(lastPractice);
        const diffDays = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
            // Streak broken
            state.progress.streak = 0;
        }
    }
}

function recordPractice() {
    const today = new Date().toDateString();
    const lastPractice = state.progress.lastPracticeDate;

    if (lastPractice !== today) {
        if (lastPractice) {
            const lastDate = new Date(lastPractice);
            const diffDays = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                state.progress.streak++;
            } else if (diffDays > 1) {
                state.progress.streak = 1;
            }
        } else {
            state.progress.streak = 1;
        }

        state.progress.lastPracticeDate = today;
        state.progress.totalDays++;
        saveProgress();
        updateStreakDisplay();
        checkAchievements();
    }
}

// ===== SCREEN NAVIGATION =====
function showScreen(screenId, addToHistory = true) {
    const currentScreen = $(`.screen.active`);
    const targetScreen = $(`#${screenId}`);

    if (!targetScreen) return;

    if (addToHistory && state.currentScreen !== screenId) {
        state.screenHistory.push(state.currentScreen);
    }

    if (currentScreen) {
        currentScreen.classList.remove('active');
        currentScreen.classList.add('slide-left');
        setTimeout(() => currentScreen.classList.remove('slide-left'), 300);
    }

    targetScreen.classList.add('active');
    state.currentScreen = screenId;

    // Refresh Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function goBack() {
    if (state.screenHistory.length > 0) {
        const prevScreen = state.screenHistory.pop();
        showScreen(prevScreen, false);
    } else {
        showScreen('homeScreen', false);
    }
}

// ===== RENDER FUNCTIONS =====
function renderPaths() {
    const grid = $('#pathsGrid');
    if (!grid) return;

    const { PATHS } = window.SanskritData;

    grid.innerHTML = Object.values(PATHS).map(path => `
        <div class="path-card ${state.selectedPath === path.id ? 'selected' : ''}" 
             data-path="${path.id}">
            <span class="path-icon">${path.icon}</span>
            <span class="path-name">${path.name}</span>
            <span class="path-english">${path.english}</span>
        </div>
    `).join('');

    // Add click handlers
    grid.querySelectorAll('.path-card').forEach(card => {
        card.addEventListener('click', () => {
            const pathId = card.dataset.path;
            selectPath(pathId);
        });
    });
}

function selectPath(pathId) {
    state.selectedPath = pathId;

    // Update UI
    $$('.path-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.path === pathId);
    });

    // Could filter content by path in the future
    playHaptic();
}

function renderModulesProgress() {
    const varnamalaProgress = calculateVarnamalaProgress();
    const shlokaProgress = calculateShlokaProgress();

    updateProgressRing('varnamalaProgress', varnamalaProgress);
    updateProgressRing('shlokaProgress', shlokaProgress);
}

function updateProgressRing(id, percentage) {
    const ring = $(`#${id}`);
    if (!ring) return;

    const circumference = 100;
    const dashArray = `${percentage}, ${circumference - percentage}`;
    ring.setAttribute('stroke-dasharray', dashArray);

    const textEl = ring.closest('.progress-ring')?.querySelector('.progress-text');
    if (textEl) {
        textEl.textContent = `${Math.round(percentage)}%`;
    }
}

function calculateVarnamalaProgress() {
    const { VARNAMALA } = window.SanskritData;
    let total = 0;
    Object.values(VARNAMALA).forEach(cat => {
        total += cat.sounds.length;
    });

    const completed = state.progress.varnamala.completed.length;
    return total > 0 ? (completed / total) * 100 : 0;
}

function calculateShlokaProgress() {
    const { SHLOKAS } = window.SanskritData;
    const total = SHLOKAS.length;
    const memorized = state.progress.shlokas.memorized.length;
    return total > 0 ? (memorized / total) * 100 : 0;
}

function updateStreakDisplay() {
    const streakCount = $('#streakCount');
    if (streakCount) {
        streakCount.textContent = state.progress.streak;
    }
}

function updateMandala() {
    const petalsGroup = $('#mandalaPetals');
    if (!petalsGroup) return;

    // Create 12 petal positions
    const petalCount = 12;
    const completedCount = Math.min(
        state.progress.varnamala.completed.length +
        state.progress.shlokas.memorized.length,
        petalCount
    );

    let petalsHtml = '';
    for (let i = 0; i < petalCount; i++) {
        const angle = (i * 30) - 90;
        const isComplete = i < completedCount;
        const rad = angle * (Math.PI / 180);
        const cx = 100 + Math.cos(rad) * 60;
        const cy = 100 + Math.sin(rad) * 60;

        petalsHtml += `
            <circle cx="${cx}" cy="${cy}" r="8" 
                    class="${isComplete ? 'complete' : ''}"
                    fill="${isComplete ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255,255,255,0.05)'}"
                    stroke="${isComplete ? '#FFD700' : 'rgba(255,255,255,0.1)'}"
                    stroke-width="1"/>
        `;
    }

    petalsGroup.innerHTML = petalsHtml;
}

// ===== VARNAMALA SCREEN =====
function renderVarnamala() {
    const { VARNAMALA } = window.SanskritData;
    const category = VARNAMALA[state.currentCategory];

    if (!category) return;

    // Update category info
    const infoEl = $('#categoryInfo');
    if (infoEl) {
        infoEl.querySelector('.category-name').textContent =
            `${category.name} (${category.english})`;
        infoEl.querySelector('.category-desc').textContent =
            category.description || '';
    }

    // Render letters grid
    const grid = $('#lettersGrid');
    if (grid) {
        grid.innerHTML = category.sounds.map((sound, index) => `
            <div class="letter-item ${state.progress.varnamala.completed.includes(sound.id) ? 'completed' : ''}"
                 data-id="${sound.id}" data-index="${index}">
                <span class="devanagari">${sound.devanagari}</span>
                <span class="iast">${sound.iast}</span>
            </div>
        `).join('');

        // Add click handlers
        grid.querySelectorAll('.letter-item').forEach(item => {
            item.addEventListener('click', () => {
                openLetterDetail(item.dataset.id, parseInt(item.dataset.index));
            });
        });
    }
}

function openLetterDetail(letterId, index) {
    const { VARNAMALA, STHANA_INFO } = window.SanskritData;
    const category = VARNAMALA[state.currentCategory];
    const letter = category.sounds.find(s => s.id === letterId);

    if (!letter) return;

    state.currentLetter = letter;
    state.currentLetterIndex = index;

    // Update letter display
    $('#letterTitle').textContent = letter.devanagari;
    $('#letterIast').textContent = letter.iast;
    $('#bigLetter').textContent = letter.devanagari;
    $('#letterRomanized').textContent = letter.iast;

    // Update articulation info
    const sthana = letter.sthana || category.sthana;
    const sthanaInfo = STHANA_INFO[sthana] || {};

    $('#sthanaName').textContent = `${sthanaInfo.name || sthana} (${sthanaInfo.english || ''})`;
    $('#sthanaInstruction').textContent = category.instruction || sthanaInfo.description || '';

    // Update articulation point position
    updateArticulationPoint(sthana);

    // Update navigation buttons
    const sounds = category.sounds;
    $('#prevLetterBtn').disabled = index === 0;
    $('#nextLetterBtn').disabled = index === sounds.length - 1;

    // Update complete button
    const isCompleted = state.progress.varnamala.completed.includes(letterId);
    const completeBtn = $('#letterCompleteBtn');
    if (completeBtn) {
        completeBtn.innerHTML = isCompleted ?
            '<i data-lucide="check-circle-2"></i>' :
            '<i data-lucide="circle"></i>';
    }

    showScreen('letterScreen');
    recordPractice();
}

function updateArticulationPoint(sthana) {
    const point = $('#articulationPoint');
    const tongue = $('#tonguePath');

    if (!point || !tongue) return;

    // Position mapping for the simple mouth diagram
    const positions = {
        'kantha': { x: 50, y: 15, tongue: 'M20 60 Q30 55 50 58 Q70 55 80 60 Q70 65 50 65 Q30 65 20 60' },
        'throat': { x: 50, y: 15, tongue: 'M20 60 Q30 55 50 58 Q70 55 80 60 Q70 65 50 65 Q30 65 20 60' },
        'talu': { x: 50, y: 25, tongue: 'M20 60 Q30 45 50 40 Q70 45 80 60 Q70 65 50 65 Q30 65 20 60' },
        'palate': { x: 50, y: 25, tongue: 'M20 60 Q30 45 50 40 Q70 45 80 60 Q70 65 50 65 Q30 65 20 60' },
        'murdha': { x: 50, y: 20, tongue: 'M20 60 Q25 50 40 35 Q50 30 60 40 Q75 55 80 60 Q70 65 50 65 Q30 65 20 60' },
        'roof': { x: 50, y: 20, tongue: 'M20 60 Q25 50 40 35 Q50 30 60 40 Q75 55 80 60 Q70 65 50 65 Q30 65 20 60' },
        'danta': { x: 50, y: 40, tongue: 'M20 60 Q30 50 50 45 Q70 50 80 60 Q70 65 50 65 Q30 65 20 60' },
        'teeth': { x: 50, y: 40, tongue: 'M20 60 Q30 50 50 45 Q70 50 80 60 Q70 65 50 65 Q30 65 20 60' },
        'oshtha': { x: 50, y: 55, tongue: 'M20 60 Q30 55 50 55 Q70 55 80 60 Q70 65 50 65 Q30 65 20 60' },
        'lips': { x: 50, y: 55, tongue: 'M20 60 Q30 55 50 55 Q70 55 80 60 Q70 65 50 65 Q30 65 20 60' },
        'nasika': { x: 30, y: 15, tongue: 'M20 60 Q30 55 50 58 Q70 55 80 60 Q70 65 50 65 Q30 65 20 60' }
    };

    const pos = positions[sthana] || positions.kantha;
    point.setAttribute('cx', pos.x);
    point.setAttribute('cy', pos.y);
    tongue.setAttribute('d', pos.tongue);
}

function markLetterComplete() {
    if (!state.currentLetter) return;

    const letterId = state.currentLetter.id;
    const completed = state.progress.varnamala.completed;

    if (!completed.includes(letterId)) {
        completed.push(letterId);
        saveProgress();
        renderVarnamala();
        renderModulesProgress();
        updateMandala();
        checkAchievements();

        playHaptic();
        showCompletion('Letter Learned!', '+5 XP');
    }
}

function navigateLetter(direction) {
    const { VARNAMALA } = window.SanskritData;
    const category = VARNAMALA[state.currentCategory];

    if (!category) return;

    const newIndex = state.currentLetterIndex + direction;

    if (newIndex >= 0 && newIndex < category.sounds.length) {
        const newLetter = category.sounds[newIndex];
        openLetterDetail(newLetter.id, newIndex);
    }
}

// ===== SHLOKARSHIP SCREEN =====
function renderShlokaList() {
    const { SHLOKAS } = window.SanskritData;
    const list = $('#shlokaList');

    if (!list) return;

    list.innerHTML = SHLOKAS.map(shloka => {
        const isMemorized = state.progress.shlokas.memorized.includes(shloka.id);
        const progress = state.progress.shlokas.inProgress[shloka.id];

        let badge = 'Learn';
        if (isMemorized) badge = 'Complete';
        else if (progress) badge = `${progress.lineIndex + 1}/${shloka.lines.length}`;

        return `
            <div class="shloka-card ${isMemorized ? 'completed' : ''}" 
                 data-id="${shloka.id}">
                <div class="shloka-header">
                    <div>
                        <span class="shloka-name">${shloka.name}</span>
                        <span class="shloka-english">${shloka.english}</span>
                    </div>
                    <span class="shloka-badge">${badge}</span>
                </div>
                <p class="shloka-preview">${shloka.lines[0]?.sanskrit || ''}</p>
                <div class="shloka-meta">
                    <span>📚 ${shloka.source}</span>
                    <span>⭐ Level ${shloka.difficulty}</span>
                </div>
            </div>
        `;
    }).join('');

    // Add click handlers
    list.querySelectorAll('.shloka-card').forEach(card => {
        card.addEventListener('click', () => {
            openShlokaDetail(card.dataset.id);
        });
    });
}

function openShlokaDetail(shlokaId) {
    const { SHLOKAS } = window.SanskritData;
    const shloka = SHLOKAS.find(s => s.id === shlokaId);

    if (!shloka) return;

    state.currentShloka = shloka;
    state.currentScript = 'devanagari';
    state.currentBenefitTab = 'scientific';

    // Update detail screen
    $('#shlokaDetailTitle').textContent = shloka.name.split(' ')[0];
    $('#shlokaDetailSubtitle').textContent = shloka.english;
    updateShlokaText();
    $('#shlokaMeaning').textContent = shloka.meaning;
    $('#shlokaSource').textContent = shloka.source;
    $('#shlokaDeity').textContent = `Deity: ${shloka.deity}`;
    updateBenefits();

    showScreen('shlokaDetailScreen');
}

function updateShlokaText() {
    const shloka = state.currentShloka;
    if (!shloka) return;

    const textEl = $('#shlokaFullText');
    if (textEl) {
        if (state.currentScript === 'devanagari') {
            textEl.textContent = shloka.fullText;
        } else {
            textEl.textContent = shloka.lines.map(l => l.iast).join(' ');
        }
    }

    // Update script toggle
    $$('.script-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.script === state.currentScript);
    });
}

function updateBenefits() {
    const shloka = state.currentShloka;
    if (!shloka) return;

    const list = $('#shlokaBenefits');
    const benefits = shloka.benefits[state.currentBenefitTab] || [];

    list.innerHTML = benefits.map(b => `<li>${b}</li>`).join('');

    // Update tabs
    $$('.benefit-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === state.currentBenefitTab);
    });
}

// ===== SHLOKA PRACTICE =====
function startShlokaPractice() {
    const shloka = state.currentShloka;
    if (!shloka) return;

    // Load progress or start fresh
    const savedProgress = state.progress.shlokas.inProgress[shloka.id];
    state.currentLineIndex = savedProgress?.lineIndex || 0;

    updatePracticeScreen();
    showScreen('shlokaPracticeScreen');
    recordPractice();
}

function updatePracticeScreen() {
    const shloka = state.currentShloka;
    if (!shloka) return;

    const line = shloka.lines[state.currentLineIndex];
    const totalLines = shloka.lines.length;

    // Update header
    $('#practiceShlokaTitle').textContent = shloka.english;
    $('#practiceStepLabel').textContent = `Line ${state.currentLineIndex + 1} of ${totalLines}`;

    // Update progress bar
    const progress = ((state.currentLineIndex + 1) / totalLines) * 100;
    $('#practiceProgressFill').style.width = `${progress}%`;

    // Update current line
    $('#practiceLineSanskrit').textContent = line.sanskrit;
    $('#practiceLineIast').textContent = line.iast;
    $('#practiceLineMeaning').textContent = line.meaning;

    // Update remaining lines
    const remainingEl = $('#remainingLines');
    remainingEl.innerHTML = shloka.lines.slice(state.currentLineIndex + 1).map((l, i) => `
        <div class="remaining-line ${i === 0 ? '' : ''}">${l.sanskrit}</div>
    `).join('');

    // Update navigation
    $('#practicePrevBtn').disabled = state.currentLineIndex === 0;
    $('#practiceNextBtn').innerHTML = state.currentLineIndex === totalLines - 1 ?
        '<i data-lucide="check"></i>' : '<i data-lucide="chevron-right"></i>';

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function navigatePracticeLine(direction) {
    const shloka = state.currentShloka;
    if (!shloka) return;

    const totalLines = shloka.lines.length;

    if (direction === 1 && state.currentLineIndex === totalLines - 1) {
        // Complete the shloka
        completeShloka();
        return;
    }

    state.currentLineIndex = Math.max(0, Math.min(totalLines - 1, state.currentLineIndex + direction));

    // Save progress
    state.progress.shlokas.inProgress[shloka.id] = {
        lineIndex: state.currentLineIndex,
        lastPracticed: new Date().toISOString()
    };
    saveProgress();

    updatePracticeScreen();
    playHaptic();
}

function completeShloka() {
    const shloka = state.currentShloka;
    if (!shloka) return;

    // Mark as memorized
    if (!state.progress.shlokas.memorized.includes(shloka.id)) {
        state.progress.shlokas.memorized.push(shloka.id);
    }

    // Remove from in-progress
    delete state.progress.shlokas.inProgress[shloka.id];

    saveProgress();
    renderShlokaList();
    renderModulesProgress();
    updateMandala();
    checkAchievements();

    showCompletion(`${shloka.english} Memorized!`, '+20 XP');

    // Go back to shloka list after a delay
    setTimeout(() => {
        showScreen('shlokarshipScreen');
    }, 2000);
}

// ===== ACHIEVEMENTS =====
function checkAchievements() {
    const { ACHIEVEMENTS } = window.SanskritData;
    const progress = state.progress;

    Object.values(ACHIEVEMENTS).forEach(achievement => {
        if (progress.achievements.includes(achievement.id)) return;

        let unlocked = false;
        const criteria = achievement.criteria;

        if (criteria.streak && progress.streak >= criteria.streak) {
            unlocked = true;
        }
        if (criteria.shlokasMemorized &&
            progress.shlokas.memorized.length >= criteria.shlokasMemorized) {
            unlocked = true;
        }
        if (criteria.totalDays && progress.totalDays >= criteria.totalDays) {
            unlocked = true;
        }
        if (criteria.varnamalaComplete) {
            const totalLetters = Object.values(window.SanskritData.VARNAMALA)
                .reduce((sum, cat) => sum + cat.sounds.length, 0);
            if (progress.varnamala.completed.length >= totalLetters) {
                unlocked = true;
            }
        }

        if (unlocked) {
            progress.achievements.push(achievement.id);
            saveProgress();
            showAchievementUnlock(achievement);
        }
    });
}

function showAchievementUnlock(achievement) {
    // Could show a special modal for achievement
    showCompletion(`Achievement: ${achievement.name}!`, achievement.english);
}

function renderAchievements() {
    const { ACHIEVEMENTS } = window.SanskritData;
    const grid = $('#achievementsGrid');

    if (!grid) return;

    grid.innerHTML = Object.values(ACHIEVEMENTS).map(a => {
        const unlocked = state.progress.achievements.includes(a.id);
        return `
            <div class="achievement-item ${unlocked ? 'unlocked' : ''}">
                <span class="achievement-icon">${a.icon}</span>
                <span class="achievement-name">${a.name}</span>
            </div>
        `;
    }).join('');
}

// ===== MODALS =====
function showCompletion(title, xp) {
    const modal = $('#completionModal');
    const titleEl = modal?.querySelector('.completion-title');
    const xpEl = modal?.querySelector('.xp-value');

    if (titleEl) titleEl.textContent = title;
    if (xpEl) xpEl.textContent = xp;

    modal?.classList.add('active');
    playSound('success');
}

function hideCompletion() {
    $('#completionModal')?.classList.remove('active');
}

function showProfile() {
    const modal = $('#profileModal');

    if (modal) {
        $('#totalDays').textContent = state.progress.totalDays;
        $('#lettersLearned').textContent = state.progress.varnamala.completed.length;
        $('#shlokasMemorized').textContent = state.progress.shlokas.memorized.length;

        renderAchievements();
        modal.classList.add('active');
    }
}

function hideProfile() {
    $('#profileModal')?.classList.remove('active');
}

// ===== AUDIO =====
function playSound(type) {
    const sounds = {
        bell: 'bellSound',
        success: 'successSound'
    };

    const audio = $(`#${sounds[type]}`);
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.3;
        audio.play().catch(() => { });
    }
}

function playHaptic() {
    if (state.settings.haptics && navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// Placeholder for actual audio playback
function playLetterAudio() {
    // Would play the actual letter pronunciation
    // For now, just play a bell sound as placeholder
    playSound('bell');
}

function playShlokaAudio() {
    // Would play the actual shloka pronunciation
    playSound('bell');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Home screen - Module cards
    $$('.module-card').forEach(card => {
        card.addEventListener('click', () => {
            const module = card.dataset.module;
            if (module === 'varnamala') {
                renderVarnamala();
                showScreen('varnamalaScreen');
            } else if (module === 'shlokarship') {
                showScreen('shlokarshipScreen');
            } else if (module === 'vyakarana') {
                showScreen('vyakaranaScreen');
            } else if (module === 'guru-chat') {
                initGuruChat();
                showScreen('guruChatScreen');
            }
        });
    });

    // Profile button
    $('#profileBtn')?.addEventListener('click', showProfile);
    $('#profileCloseBtn')?.addEventListener('click', hideProfile);

    // Varnamala - Back button
    $('#varnamalaBackBtn')?.addEventListener('click', goBack);

    // Varnamala - Category tabs
    $$('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.currentCategory = tab.dataset.category;
            renderVarnamala();
        });
    });

    // Letter screen
    $('#letterBackBtn')?.addEventListener('click', goBack);
    $('#letterCompleteBtn')?.addEventListener('click', markLetterComplete);
    $('#listenGuruBtn')?.addEventListener('click', playLetterAudio);
    $('#prevLetterBtn')?.addEventListener('click', () => navigateLetter(-1));
    $('#nextLetterBtn')?.addEventListener('click', () => navigateLetter(1));

    // Speed selector
    $$('.speed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.speed-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.settings.audioSpeed = btn.dataset.speed;
        });
    });

    // Record button
    $('#recordBtn')?.addEventListener('click', toggleRecording);

    // Shlokarship screen
    $('#shlokarshipBackBtn')?.addEventListener('click', goBack);

    // Shloka detail screen
    $('#shlokaDetailBackBtn')?.addEventListener('click', goBack);
    $('#listenFullBtn')?.addEventListener('click', playShlokaAudio);
    $('#startShlokaPractice')?.addEventListener('click', startShlokaPractice);

    // Script toggle
    $$('.script-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.currentScript = btn.dataset.script;
            updateShlokaText();
        });
    });

    // Benefit tabs
    $$('.benefit-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            state.currentBenefitTab = tab.dataset.tab;
            updateBenefits();
        });
    });

    // Shloka practice screen
    $('#shlokaPracticeBackBtn')?.addEventListener('click', () => {
        // Save progress before going back
        if (state.currentShloka) {
            state.progress.shlokas.inProgress[state.currentShloka.id] = {
                lineIndex: state.currentLineIndex,
                lastPracticed: new Date().toISOString()
            };
            saveProgress();
        }
        goBack();
    });

    $('#practiceListenBtn')?.addEventListener('click', playShlokaAudio);
    $('#practicePrevBtn')?.addEventListener('click', () => navigatePracticeLine(-1));
    $('#practiceNextBtn')?.addEventListener('click', () => navigatePracticeLine(1));

    // Completion modal
    $('#completionCloseBtn')?.addEventListener('click', hideCompletion);

    // Close modals on overlay click
    $$('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
}

// ===== RECORDING (Placeholder) =====
let isRecording = false;
let mediaRecorder = null;

function toggleRecording() {
    const btn = $('#recordBtn');

    if (!isRecording) {
        startRecording();
        btn.classList.add('recording');
        btn.querySelector('span').textContent = 'Recording...';
    } else {
        stopRecording();
        btn.classList.remove('recording');
        btn.querySelector('span').textContent = 'Tap to Record';
    }

    isRecording = !isRecording;
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            // Could analyze recording here
            console.log('Recording complete:', blob);
        };

        mediaRecorder.start();
        playHaptic();
    } catch (err) {
        console.error('Recording failed:', err);
        alert('Microphone access is required for recording.');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }

    playHaptic();
}

// ===== PHASE 2: VYAKARANA (GRAMMAR) =====
function setupGrammarHandlers() {
    // Grammar topic cards
    $$('.grammar-card').forEach(card => {
        card.addEventListener('click', () => {
            const topic = card.dataset.topic;
            if (topic === 'sandhi') {
                renderSandhiLesson();
                showScreen('sandhiScreen');
            }
            // Future: vibhakti, dhatu screens
        });
    });

    // Vyakarana back button
    $('#vyakaranaBackBtn')?.addEventListener('click', goBack);

    // Sandhi screen back button
    $('#sandhiBackBtn')?.addEventListener('click', goBack);

    // Practice Sandhi button
    $('#practiceSandhiBtn')?.addEventListener('click', () => {
        startSandhiPractice();
        showScreen('sandhiPracticeScreen');
    });

    // Sandhi practice back button
    $('#sandhiPracticeBackBtn')?.addEventListener('click', goBack);
}

function renderSandhiLesson() {
    const { SANDHI_RULES } = window.SanskritData;
    const rulesList = $('#sandhiRulesList');

    if (!rulesList || !SANDHI_RULES) return;

    const allRules = [
        ...SANDHI_RULES.vowelSandhi.rules,
        ...SANDHI_RULES.consonantSandhi.rules
    ];

    rulesList.innerHTML = allRules.map(rule => `
        <div class="rule-item" data-rule="${rule.id}">
            <span class="rule-formula">${rule.formula}</span>
            <div class="rule-info">
                <span class="rule-name">${rule.name} (${rule.english})</span>
                <span class="rule-example">${rule.examples[0]?.word1} + ${rule.examples[0]?.word2} = ${rule.examples[0]?.result}</span>
            </div>
        </div>
    `).join('');

    // Add click handlers for interactive examples
    rulesList.querySelectorAll('.rule-item').forEach(item => {
        item.addEventListener('click', () => {
            const ruleId = item.dataset.rule;
            showSandhiExample(ruleId);
        });
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function showSandhiExample(ruleId) {
    const { SANDHI_RULES } = window.SanskritData;

    // Find the rule
    let rule = SANDHI_RULES.vowelSandhi.rules.find(r => r.id === ruleId);
    if (!rule) {
        rule = SANDHI_RULES.consonantSandhi.rules.find(r => r.id === ruleId);
    }

    if (!rule || !rule.examples.length) return;

    const example = rule.examples[0];

    // Update the interactive example card
    $('#sandhiWord1').textContent = example.word1;
    $('#sandhiWord2').textContent = example.word2;
    $('#sandhiResult').textContent = example.result;
    $('#sandhiExplanation').innerHTML = `
        <p><strong>${example.explanation}</strong></p>
        <p>${rule.name} - ${rule.english}</p>
    `;

    playHaptic();
}

// ===== PHASE 2: SANDHI PRACTICE =====
function startSandhiPractice() {
    state.sandhiPractice = {
        currentIndex: 0,
        score: 0,
        answered: false
    };
    renderSandhiQuestion();
    recordPractice();
}

function renderSandhiQuestion() {
    const { SANDHI_EXERCISES } = window.SanskritData;
    const exercise = SANDHI_EXERCISES[state.sandhiPractice.currentIndex];

    if (!exercise) {
        // Practice complete
        completeSandhiPractice();
        return;
    }

    // Update progress
    $('#sandhiPracticeProgress').textContent = `${state.sandhiPractice.currentIndex + 1} of ${SANDHI_EXERCISES.length}`;

    // Update question
    $('#puzzleWord1').textContent = exercise.word1;
    $('#puzzleWord2').textContent = exercise.word2;
    $('#puzzleAnswer').textContent = '?';

    // Shuffle and render options
    const shuffledOptions = [...exercise.options].sort(() => Math.random() - 0.5);
    const optionsEl = $('#answerOptions');
    optionsEl.innerHTML = shuffledOptions.map(opt => `
        <button class="answer-option" data-answer="${opt}">
            <span class="devanagari">${opt}</span>
        </button>
    `).join('');

    // Add click handlers
    optionsEl.querySelectorAll('.answer-option').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!state.sandhiPractice.answered) {
                checkSandhiAnswer(btn.dataset.answer);
            }
        });
    });

    // Hide feedback
    $('#feedbackArea').style.display = 'none';
    state.sandhiPractice.answered = false;
}

function checkSandhiAnswer(selectedAnswer) {
    const { SANDHI_EXERCISES } = window.SanskritData;
    const exercise = SANDHI_EXERCISES[state.sandhiPractice.currentIndex];
    const isCorrect = selectedAnswer === exercise.answer;

    state.sandhiPractice.answered = true;

    // Highlight selected answer
    $$('.answer-option').forEach(btn => {
        if (btn.dataset.answer === selectedAnswer) {
            btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        if (btn.dataset.answer === exercise.answer) {
            btn.classList.add('correct');
        }
    });

    // Update puzzle answer
    $('#puzzleAnswer').textContent = exercise.answer;

    // Show feedback
    const feedbackArea = $('#feedbackArea');
    const feedbackContent = $('#feedbackContent');
    feedbackArea.style.display = 'block';
    feedbackContent.className = 'feedback-content ' + (isCorrect ? 'correct' : 'incorrect');
    feedbackContent.innerHTML = isCorrect ?
        `<h4>✓ Correct!</h4><p>${exercise.explanation}</p>` :
        `<h4>✗ Not quite</h4><p>${exercise.explanation}</p>`;

    if (isCorrect) {
        state.sandhiPractice.score++;
        playSound('success');
    }
    playHaptic();

    // Auto-advance after delay
    setTimeout(() => {
        state.sandhiPractice.currentIndex++;
        renderSandhiQuestion();
    }, 2000);
}

function completeSandhiPractice() {
    const { SANDHI_EXERCISES } = window.SanskritData;
    const total = SANDHI_EXERCISES.length;
    const score = state.sandhiPractice.score;
    const percentage = Math.round((score / total) * 100);

    showCompletion(`Sandhi Practice Complete!`, `${score}/${total} (${percentage}%)`);

    // If good score, check achievements
    if (percentage >= 80) {
        checkAchievements();
    }

    setTimeout(() => {
        goBack();
    }, 2500);
}

// ===== PHASE 2: AI GURU CHAT =====
function setupGuruChatHandlers() {
    // Guru chat back button
    $('#guruChatBackBtn')?.addEventListener('click', goBack);

    // Scenario buttons
    $('#changeScenarioBtn')?.addEventListener('click', showScenarioModal);
    $('#scenarioSelectBtn')?.addEventListener('click', showScenarioModal);
    $('#scenarioCloseBtn')?.addEventListener('click', hideScenarioModal);

    // Scenario items
    $$('.scenario-item').forEach(item => {
        item.addEventListener('click', () => {
            const scenario = item.dataset.scenario;
            selectScenario(scenario);
            hideScenarioModal();
        });
    });

    // Chat record button
    $('#chatRecordBtn')?.addEventListener('click', toggleRecording);
}

function initGuruChat() {
    state.guruChat.conversationStep = 0;
    state.guruChat.history = [];
    renderGuruConversation();
}

function renderGuruConversation() {
    const { GURU_SCENARIOS } = window.SanskritData;
    const scenario = GURU_SCENARIOS[state.guruChat.currentScenario];

    if (!scenario) return;

    const step = state.guruChat.conversationStep;
    const conversation = scenario.conversations[step];

    if (!conversation) {
        // Conversation complete
        showCompletion('Conversation Complete!', '+15 XP');
        return;
    }

    // Update scenario name
    $('#currentScenario').textContent = scenario.name;

    // Render chat messages
    const messagesEl = $('#chatMessages');

    // Add guru message if not already shown
    if (state.guruChat.history.length === step * 2) {
        const guruMessage = document.createElement('div');
        guruMessage.className = 'chat-message guru-message';
        guruMessage.innerHTML = `
            <div class="message-avatar">🧘</div>
            <div class="message-content">
                <span class="message-sender">गुरुजी</span>
                <p class="message-text">${conversation.guru.sanskrit}</p>
                <p class="message-translation">${conversation.guru.english}</p>
            </div>
        `;
        messagesEl.appendChild(guruMessage);
        state.guruChat.history.push(conversation.guru);

        // Scroll to bottom
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Render response options
    const responseOptions = $('#responseOptions');
    responseOptions.innerHTML = conversation.options.map(opt => `
        <button class="response-btn" data-response="${opt.id}" data-next="${opt.nextStep}">
            <span class="response-sanskrit">${opt.sanskrit}</span>
            <span class="response-english">${opt.english}</span>
        </button>
    `).join('');

    // Add click handlers
    responseOptions.querySelectorAll('.response-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectResponse(btn, conversation.options.find(o => o.id === btn.dataset.response));
        });
    });
}

function selectResponse(btn, option) {
    const messagesEl = $('#chatMessages');

    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    userMessage.innerHTML = `
        <div class="message-avatar">🙏</div>
        <div class="message-content">
            <span class="message-sender">शिष्य</span>
            <p class="message-text">${option.sanskrit}</p>
            <p class="message-translation">${option.english}</p>
        </div>
    `;
    messagesEl.appendChild(userMessage);
    state.guruChat.history.push(option);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    playHaptic();
    recordPractice();

    // Move to next step
    if (option.nextStep === 'end') {
        setTimeout(() => {
            showCompletion('Conversation Complete!', '+15 XP');
        }, 1000);
    } else {
        state.guruChat.conversationStep = option.nextStep;
        setTimeout(() => {
            renderGuruConversation();
        }, 1000);
    }
}

function selectScenario(scenarioId) {
    state.guruChat.currentScenario = scenarioId;

    // Update UI
    $$('.scenario-item').forEach(item => {
        item.classList.toggle('active', item.dataset.scenario === scenarioId);
    });

    // Reinitialize chat
    initGuruChat();
    playHaptic();
}

function showScenarioModal() {
    $('#scenarioModal')?.classList.add('active');
}

function hideScenarioModal() {
    $('#scenarioModal')?.classList.remove('active');
}

// ===== PHASE 2: PRONUNCIATION MODAL =====
function setupPronunciationHandlers() {
    $('#pronunciationCloseBtn')?.addEventListener('click', () => {
        $('#pronunciationModal')?.classList.remove('active');
    });

    $('#tryAgainBtn')?.addEventListener('click', () => {
        $('#pronunciationModal')?.classList.remove('active');
    });
}

// Draw placeholder waveform
function drawWaveform(canvasId, data = null) {
    const canvas = $(`#${canvasId}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.strokeStyle = '#6C63FF';
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Draw sine wave as placeholder
    for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.05) * (height / 3) * Math.random();
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}

// ===== INITIALIZE PHASE 2 HANDLERS =====
// Add Phase 2 setup to the initialization
const originalSetupEventListeners = setupEventListeners;
setupEventListeners = function () {
    originalSetupEventListeners();
    setupGrammarHandlers();
    setupGuruChatHandlers();
    setupPronunciationHandlers();
};

// ===== PHASE 3: SANGHA (COMMUNITY) =====
function setupSanghaHandlers() {
    // Sangha module card click
    $$('.module-card[data-module="sangha"]').forEach(card => {
        card.addEventListener('click', () => {
            showScreen('sanghaScreen');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

    // Sangha back button
    $('#sanghaBackBtn')?.addEventListener('click', goBack);

    // Leaderboard button
    $('#leaderboardBtn')?.addEventListener('click', () => {
        showScreen('leaderboardScreen');
    });

    // Join room buttons
    $$('.join-room-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const room = btn.closest('.room-card');
            if (room.classList.contains('scheduled')) {
                showNotification('🔔 Reminder set for this session!');
                btn.textContent = 'Reminder Set';
                btn.disabled = true;
            } else {
                joinChantingRoom(room.dataset.room);
            }
            playHaptic();
        });
    });

    // Dana button
    $('#openDanaBtn')?.addEventListener('click', showDanaModal);

    // Challenge contribute button
    $('.challenge-contribute-btn')?.addEventListener('click', () => {
        showNotification('📿 Opening practice mode for challenge contribution...');
        playHaptic();
    });

    // Group action button
    $('.group-action-btn')?.addEventListener('click', () => {
        showNotification('👥 Study group feature coming soon!');
        playHaptic();
    });
}

function joinChantingRoom(roomId) {
    // Simulate joining a chanting room
    showNotification(`🙏 Joining ${roomId} chanting session...`);

    // In a real app, this would connect to a WebRTC or audio streaming service
    setTimeout(() => {
        showNotification(`🎵 You have joined the live chanting!`);
    }, 1500);
}

function showNotification(message) {
    // Create a toast notification
    let toast = document.getElementById('toastNotification');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotification';
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 0.875rem;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2500);
}

// ===== PHASE 3: LEADERBOARD =====
function setupLeaderboardHandlers() {
    // Leaderboard back button
    $('#leaderboardBackBtn')?.addEventListener('click', goBack);

    // Leaderboard tabs
    $$('.lb-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.lb-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // In a real app, this would fetch data for the selected period
            playHaptic();
        });
    });
}

// ===== PHASE 3: DANA (DONATION) MODAL =====
function setupDanaHandlers() {
    // Close button
    $('#danaCloseBtn')?.addEventListener('click', hideDanaModal);

    // Amount buttons
    $$('.dana-amount').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.dana-amount').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            updateDonateButton(btn.dataset.amount);
            // Clear custom input
            $('#customDanaAmount').value = '';
            playHaptic();
        });
    });

    // Custom amount input
    $('#customDanaAmount')?.addEventListener('input', (e) => {
        const amount = e.target.value;
        if (amount) {
            $$('.dana-amount').forEach(b => b.classList.remove('selected'));
            updateDonateButton(amount);
        }
    });

    // Donate button
    $('#donateBtn')?.addEventListener('click', processDonation);

    // Close on backdrop click
    $('#danaModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'danaModal') {
            hideDanaModal();
        }
    });
}

function showDanaModal() {
    $('#danaModal')?.classList.add('active');
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function hideDanaModal() {
    $('#danaModal')?.classList.remove('active');
}

function updateDonateButton(amount) {
    const btn = $('#donateBtn');
    if (btn) {
        btn.innerHTML = `<i data-lucide="heart"></i> Donate ₹${amount}`;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function processDonation() {
    const selectedBtn = $('.dana-amount.selected');
    const customAmount = $('#customDanaAmount')?.value;
    const amount = customAmount || selectedBtn?.dataset.amount || 108;

    // Simulate donation processing
    showNotification('🙏 Processing your dana...');

    setTimeout(() => {
        hideDanaModal();
        showCompletion('धन्यवादः!', `Your donation of ₹${amount} is deeply appreciated.`);

        // In a real app, this would integrate with a payment gateway
        console.log('Donation amount:', amount);
    }, 1500);
}

// ===== PHASE 3: ENHANCED ACHIEVEMENTS =====
// Add new achievement criteria for Phase 3
const PHASE3_ACHIEVEMENTS = {
    sangha_praveshi: {
        id: 'sangha_praveshi',
        name: 'संघ प्रवेशी',
        english: 'Community Member',
        icon: '🤝',
        description: 'Join your first group chanting session',
        criteria: { joinedChanting: true }
    },
    dhana_vira: {
        id: 'dhana_vira',
        name: 'दान वीर',
        english: 'Generous Donor',
        icon: '💝',
        description: 'Support Sanskrit Vidya through dana',
        criteria: { donated: true }
    },
    leaderboard_climber: {
        id: 'leaderboard_climber',
        name: 'प्रतिष्ठा प्राप्त',
        english: 'Rising Star',
        icon: '⭐',
        description: 'Reach top 50 on the weekly leaderboard',
        criteria: { weeklyRank: 50 }
    }
};

// ===== INITIALIZE PHASE 3 HANDLERS =====
// Update the initialization to include Phase 3
const originalSetupEventListenersPhase2 = setupEventListeners;
setupEventListeners = function () {
    originalSetupEventListenersPhase2();
    setupSanghaHandlers();
    setupLeaderboardHandlers();
    setupDanaHandlers();
};
