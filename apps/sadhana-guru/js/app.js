/**
 * Sadhana Guru - Digital Accountability App
 * Main Application Logic
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initApp();
});

// ===== STATE MANAGEMENT =====
const state = {
    hasVow: false,
    signature: null,
    vowDate: null,
    dayCount: 1,
    truthScore: 100,
    streakDays: 0,
    completedTasks: 0,
    todaysSadhana: {},
    pendingVerification: null
};

// ===== INITIALIZATION =====
function initApp() {
    loadState();

    if (state.hasVow) {
        showScreen('dashboardScreen');
        updateDashboard();
    } else {
        showScreen('invocationScreen');
    }

    // Event Listeners
    initInvocationScreen();
    initSankalpaScreen();
    initDashboardScreen();
    initConfessionModal();

    // Set current date
    updateDateDisplay();
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    lucide.createIcons();
}

// ===== INVOCATION SCREEN =====
function initInvocationScreen() {
    const proceedBtn = document.getElementById('proceedToSankalpa');
    proceedBtn?.addEventListener('click', () => {
        showScreen('sankalpaScreen');
        initSignaturePad();
    });
}

// ===== SANKALPA (VOW) SCREEN =====
let signaturePad = null;

function initSankalpaScreen() {
    const backBtn = document.getElementById('backToInvocation');
    backBtn?.addEventListener('click', () => showScreen('invocationScreen'));

    const takeVowBtn = document.getElementById('takeVowBtn');
    takeVowBtn?.addEventListener('click', sealVow);

    const clearBtn = document.getElementById('clearSignature');
    clearBtn?.addEventListener('click', () => {
        if (signaturePad) {
            signaturePad.clear();
            document.getElementById('takeVowBtn').disabled = true;
        }
    });
}

function initSignaturePad() {
    const canvas = document.getElementById('signaturePad');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Style
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function startDrawing(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();

        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        lastX = pos.x;
        lastY = pos.y;

        // Enable vow button when signature has content
        document.getElementById('takeVowBtn').disabled = false;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    signaturePad = {
        canvas,
        ctx,
        clear: () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },
        isEmpty: () => {
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            return !data.some((channel, i) => i % 4 === 3 && channel !== 0);
        },
        toDataURL: () => canvas.toDataURL()
    };
}

function sealVow() {
    if (signaturePad && signaturePad.isEmpty()) {
        alert('Please sign your name to seal the vow.');
        return;
    }

    // Save vow state
    state.hasVow = true;
    state.signature = signaturePad ? signaturePad.toDataURL() : null;
    state.vowDate = new Date().toISOString();
    state.dayCount = 1;
    state.truthScore = 100;
    state.streakDays = 0;

    saveState();

    // Animate transition
    const agniFlame = document.getElementById('agniFlame');
    agniFlame?.classList.add('sealing');

    setTimeout(() => {
        showScreen('dashboardScreen');
        updateDashboard();
        showToast('🔥 Your sacred vow has been sealed!', 'success');
    }, 1500);
}

// ===== DASHBOARD SCREEN =====
function initDashboardScreen() {
    // Sadhana item clicks
    document.querySelectorAll('.verify-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.sadhana-item');
            const id = item.dataset.id;
            completeSadhana(id, item);
        });
    });

    // Truth buttons
    document.getElementById('truthYes')?.addEventListener('click', () => {
        confirmTruth(true);
    });

    document.getElementById('truthNo')?.addEventListener('click', () => {
        confirmTruth(false);
    });

    // Bottom navigation
    initBottomNav();

    // Settings button
    document.getElementById('settingsBtn')?.addEventListener('click', showSettingsModal);
}

// ===== BOTTOM NAVIGATION =====
function initBottomNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            switchTab(tab);

            // Update active state
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function switchTab(tab) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

    // Show selected tab
    const tabContent = document.getElementById(`tab-${tab}`);
    if (tabContent) {
        tabContent.classList.add('active');
    } else {
        // If tab content doesn't exist, show toast
        const tabNames = {
            home: 'Today',
            history: 'History',
            tree: 'My Tree',
            vow: 'My Vow'
        };

        if (tab === 'home') {
            // Just scroll to top for home
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (tab === 'tree') {
            // Scroll to tree section
            document.querySelector('.tree-section')?.scrollIntoView({ behavior: 'smooth' });
        } else if (tab === 'vow') {
            // Show vow modal
            showVowModal();
        } else if (tab === 'history') {
            // Show history modal
            showHistoryModal();
        }
    }
}

// ===== SETTINGS MODAL =====
function showSettingsModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('settingsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'settingsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="confession-header">
                    <span class="confession-icon">⚙️</span>
                    <h3>Settings</h3>
                </div>
                
                <div class="settings-list">
                    <div class="setting-item">
                        <span>Notifications</span>
                        <label class="toggle">
                            <input type="checkbox" id="notifToggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <span>Brahma Muhurta Reminder</span>
                        <label class="toggle">
                            <input type="checkbox" id="brahmaToggle" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item danger" id="resetVowBtn">
                        <span>🔥 Reset My Vow</span>
                        <i data-lucide="chevron-right"></i>
                    </div>
                </div>
                
                <button class="accept-penalty-btn" style="background: #666; margin-top: 20px;" id="closeSettings">
                    Close
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.classList.remove('active'));
        modal.querySelector('#closeSettings').addEventListener('click', () => modal.classList.remove('active'));
        modal.querySelector('#resetVowBtn').addEventListener('click', resetVow);

        lucide.createIcons();
    }

    modal.classList.add('active');
}

function resetVow() {
    if (confirm('Are you sure? This will reset all your progress and require a new Sankalpa Patra.')) {
        localStorage.removeItem('sadhanaGuru');
        localStorage.removeItem('sadhanaGuruLastDate');
        location.reload();
    }
}

// ===== VOW MODAL =====
function showVowModal() {
    let modal = document.getElementById('vowModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'vowModal';
        modal.className = 'modal';

        const vowDate = state.vowDate ? new Date(state.vowDate).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        }) : 'Unknown';

        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="confession-header">
                    <span class="confession-icon">📜</span>
                    <h3>My Sacred Vow</h3>
                </div>
                
                <div class="vow-display">
                    <p class="vow-date">Sealed on: ${vowDate}</p>
                    ${state.signature ? `<img src="${state.signature}" class="vow-signature" alt="My Signature"/>` : ''}
                    <div class="vow-stats">
                        <div><strong>${state.dayCount}</strong> Days on Path</div>
                        <div><strong>${state.truthScore}%</strong> Truth Score</div>
                    </div>
                </div>
                
                <button class="accept-penalty-btn" style="background: #FF9800; margin-top: 20px;" id="closeVow">
                    Close
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.classList.remove('active'));
        modal.querySelector('#closeVow').addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.classList.add('active');
}

// ===== HISTORY MODAL =====
function showHistoryModal() {
    let modal = document.getElementById('historyModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'historyModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="confession-header">
                    <span class="confession-icon">📅</span>
                    <h3>History</h3>
                </div>
                
                <div class="history-content">
                    <p style="color: var(--text-secondary); text-align: center; padding: 20px 0;">
                        🚧 Full history tracking coming soon!<br><br>
                        Current Stats:<br>
                        <strong style="color: var(--fire-orange);">${state.completedTasks}</strong> tasks completed<br>
                        <strong style="color: var(--fire-orange);">${state.streakDays}</strong> day streak
                    </p>
                </div>
                
                <button class="accept-penalty-btn" style="background: #666; margin-top: 20px;" id="closeHistory">
                    Close
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.classList.remove('active'));
        modal.querySelector('#closeHistory').addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.classList.add('active');
}

function updateDashboard() {
    // Update day count
    if (state.vowDate) {
        const vowDate = new Date(state.vowDate);
        const today = new Date();
        const diffTime = Math.abs(today - vowDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        state.dayCount = diffDays;
    }

    document.getElementById('dayCount').textContent = state.dayCount;
    document.getElementById('truthScore').textContent = state.truthScore;
    document.getElementById('streakDays').textContent = state.streakDays;
    document.getElementById('completedTasks').textContent = state.completedTasks;

    // Update tree health
    updateTreeHealth();

    // Restore completed items
    Object.keys(state.todaysSadhana).forEach(id => {
        if (state.todaysSadhana[id]) {
            const item = document.querySelector(`.sadhana-item[data-id="${id}"]`);
            if (item) item.classList.add('completed');
        }
    });

    // Set daily quote
    setDailyQuote();
}

function completeSadhana(id, itemElement) {
    if (itemElement.classList.contains('completed')) return;

    // Mark as pending verification
    state.pendingVerification = id;

    // Show Antaryami question
    const questions = {
        brahma: 'When you marked Brahma Muhurta complete, were you truly awake before 5:30 AM?',
        surya: 'Did you complete all 12 rounds of Surya Namaskar with proper form and attention?',
        dhyana: 'During your meditation, did you maintain focus for the full 20 minutes?',
        japa: 'Did you complete 108 mantra repetitions with full awareness?',
        digital: 'Did you truly avoid all social media before 10 AM today?'
    };

    document.getElementById('antaryamiQuestion').textContent =
        questions[id] || 'Did you complete this practice truthfully and with full attention?';

    document.getElementById('antaryamiSection').classList.add('active');

    // Scroll to question
    document.getElementById('antaryamiSection').scrollIntoView({ behavior: 'smooth' });
}

function confirmTruth(isTrue) {
    const id = state.pendingVerification;
    if (!id) return;

    // Hide question
    document.getElementById('antaryamiSection').classList.remove('active');

    if (isTrue) {
        // Complete the task
        state.todaysSadhana[id] = true;
        state.completedTasks++;
        state.streakDays = Math.min(state.streakDays + 1, state.completedTasks);

        const item = document.querySelector(`.sadhana-item[data-id="${id}"]`);
        if (item) {
            item.classList.add('completed');
            // Add leaf to tree
            addLeafToTree();
        }

        showToast('✅ Sadhana recorded. Your tree grows!', 'success');
    } else {
        // Show confession modal
        showConfessionModal(id);
    }

    state.pendingVerification = null;
    saveState();
    updateDashboard();
}

// ===== TREE VISUALIZATION =====
function updateTreeHealth() {
    const leafCluster = document.getElementById('leafCluster');
    if (!leafCluster) return;

    // Calculate opacity based on truth score
    const health = state.truthScore / 100;
    leafCluster.style.opacity = Math.max(0.2, health);

    // Change color if withering
    if (health < 0.5) {
        leafCluster.style.background = `radial-gradient(ellipse, #9E9D24, transparent 70%)`;
    } else if (health < 0.75) {
        leafCluster.style.background = `radial-gradient(ellipse, #8BC34A, transparent 70%)`;
    } else {
        leafCluster.style.background = `radial-gradient(ellipse, #4CAF50, transparent 70%)`;
    }
}

function addLeafToTree() {
    const cluster = document.getElementById('leafCluster');
    if (!cluster) return;

    // Create a pulse animation effect
    cluster.style.animation = 'none';
    cluster.offsetHeight; // Trigger reflow
    cluster.style.animation = 'growPulse 0.5s ease';
}

// ===== CONFESSION MODAL =====
function initConfessionModal() {
    const confessionText = document.getElementById('confessionText');
    const charCount = document.getElementById('charCount');
    const acceptBtn = document.getElementById('acceptPenalty');

    confessionText?.addEventListener('input', () => {
        const count = confessionText.value.length;
        charCount.textContent = count;
        acceptBtn.disabled = count < 50;
    });

    acceptBtn?.addEventListener('click', acceptPenalty);

    // Close on backdrop click
    document.querySelector('.modal-backdrop')?.addEventListener('click', () => {
        document.getElementById('confessionModal').classList.remove('active');
    });
}

function showConfessionModal(id) {
    document.getElementById('confessionModal').classList.add('active');
    document.getElementById('confessionText').value = '';
    document.getElementById('charCount').textContent = '0';
    document.getElementById('acceptPenalty').disabled = true;
}

function acceptPenalty() {
    const confession = document.getElementById('confessionText').value;

    if (confession.length < 50) {
        alert('Please write at least 50 characters of confession.');
        return;
    }

    // Apply penalty
    state.truthScore = Math.max(0, state.truthScore - 10);
    state.streakDays = 0;

    // Close modal
    document.getElementById('confessionModal').classList.remove('active');

    // Update tree
    updateTreeHealth();
    updateDashboard();
    saveState();

    showToast('🔥 Prayaschita accepted. Your path to truth continues.', 'info');
}

// ===== DATE & TIME =====
function updateDateDisplay() {
    const now = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-IN', options);

    const currentDate = document.getElementById('currentDate');
    if (currentDate) currentDate.textContent = dateStr;

    // Calculate approximate muhurta (simplified)
    const hour = now.getHours();
    let muhurta = 'Divya';
    if (hour >= 4 && hour < 6) muhurta = 'Brahma';
    else if (hour >= 6 && hour < 8) muhurta = 'Pratha';
    else if (hour >= 8 && hour < 10) muhurta = 'Sangava';
    else if (hour >= 10 && hour < 12) muhurta = 'Madhyahna';
    else if (hour >= 12 && hour < 14) muhurta = 'Aparahna';
    else if (hour >= 14 && hour < 16) muhurta = 'Sayahna';
    else if (hour >= 16 && hour < 18) muhurta = 'Pradosha';
    else if (hour >= 18 && hour < 20) muhurta = 'Nishita';
    else muhurta = 'Ratri';

    const currentMuhurta = document.getElementById('currentMuhurta');
    if (currentMuhurta) currentMuhurta.textContent = muhurta + ' Muhurta';
}

// ===== DAILY QUOTES =====
const quotes = [
    { text: '"When your mind dwells on the senses, attachment arises. From attachment comes desire."', source: 'Bhagavad Gita 2.62' },
    { text: '"You have the right to work, but for the work\'s sake only."', source: 'Bhagavad Gita 2.47' },
    { text: '"The soul is neither born, nor does it ever die."', source: 'Bhagavad Gita 2.20' },
    { text: '"Yoga is the journey of the self, through the self, to the self."', source: 'Bhagavad Gita 6.5' },
    { text: '"A person can rise through the efforts of their own mind."', source: 'Bhagavad Gita 6.5' },
    { text: '"There is nothing lost or wasted in this life."', source: 'Bhagavad Gita 2.40' },
    { text: '"Set thy heart upon thy work, but never on its reward."', source: 'Bhagavad Gita 2.47' }
];

function setDailyQuote() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const quote = quotes[dayOfYear % quotes.length];

    const quoteText = document.getElementById('dailyQuote');
    const quoteSource = document.querySelector('.quote-source');

    if (quoteText) quoteText.textContent = quote.text;
    if (quoteSource) quoteSource.textContent = '— ' + quote.source;
}

// ===== PERSISTENCE =====
function saveState() {
    localStorage.setItem('sadhanaGuru', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('sadhanaGuru');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);

        // Reset today's sadhana if new day
        const today = new Date().toDateString();
        const lastDate = localStorage.getItem('sadhanaGuruLastDate');
        if (lastDate !== today) {
            state.todaysSadhana = {};
            localStorage.setItem('sadhanaGuruLastDate', today);
        }
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: ${type === 'success' ? '#388E3C' : type === 'error' ? '#D32F2F' : '#FF9800'};
        color: white;
        border-radius: 12px;
        font-size: 0.9rem;
        z-index: 9999;
        max-width: 90%;
        text-align: center;
        animation: slideUp 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add grow pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes growPulse {
        0% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.2); }
        100% { transform: translateX(-50%) scale(1); }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
