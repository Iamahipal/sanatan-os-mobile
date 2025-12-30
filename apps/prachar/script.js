/**
 * PRACHAR - The Dharma Ripple
 * Transform sharing into a sacred act of Dharmadana
 */

// ============================================
// WISDOM DATA
// ============================================
const gitaQuotes = [
    {
        sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
        english: "You have the right to work, but never to the fruits of work.",
        ref: "Bhagavad Gita 2.47"
    },
    {
        sanskrit: "योगः कर्मसु कौशलम्",
        english: "Yoga is skill in action.",
        ref: "Bhagavad Gita 2.50"
    },
    {
        sanskrit: "मन एव मनुष्याणां कारणं बन्धमोक्षयोः",
        english: "The mind is the cause of both bondage and liberation.",
        ref: "Amritabindu Upanishad"
    },
    {
        sanskrit: "सर्वे भवन्तु सुखिनः",
        english: "May all beings be happy.",
        ref: "Brihadaranyaka Upanishad"
    },
    {
        sanskrit: "अहिंसा परमो धर्मः",
        english: "Non-violence is the highest duty.",
        ref: "Mahabharata"
    },
    {
        sanskrit: "सत्यमेव जयते",
        english: "Truth alone triumphs.",
        ref: "Mundaka Upanishad"
    },
    {
        sanskrit: "वसुधैव कुटुम्बकम्",
        english: "The world is one family.",
        ref: "Maha Upanishad"
    },
    {
        sanskrit: "आत्मनो मोक्षार्थं जगद्धिताय च",
        english: "For the liberation of the self and the welfare of the world.",
        ref: "Jain Proverb"
    }
];

const suprabhatMessages = [
    "May this morning bring you clarity and peace.",
    "Rise with gratitude, walk with purpose.",
    "Each sunrise is a new chance to grow.",
    "May today bring you closer to your truth.",
    "Begin with stillness, move with intention."
];

const milestones = {
    sadhak: { name: "साधक", english: "Seeker", icon: "🌱", desc: "The journey has begun" },
    tapasvi: { name: "तपस्वी", english: "Devoted", icon: "🔥", desc: "21 days of dedicated practice" },
    vrati: { name: "व्रती", english: "Committed", icon: "⭐", desc: "40 days of unwavering resolve" },
    siddha: { name: "सिद्ध", english: "Accomplished", icon: "🪷", desc: "108 days of transformation" }
};

// ============================================
// STATE
// ============================================
let currentCardType = 'sadhana';
let currentSankalpa = 'peace';
let currentBg = 'cosmic';
let karmaData = {};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadKarmaData();
    updatePreviewStats();
    setupEventListeners();
    loadRippleCount();
});

function loadKarmaData() {
    // Aggregate data from all apps
    karmaData = {
        japaTotal: parseInt(localStorage.getItem('japaCount') || localStorage.getItem('totalJapa') || '0'),
        habitStreak: parseInt(localStorage.getItem('currentStreak') || localStorage.getItem('habitStreak') || '0'),
        satyaScore: parseInt(localStorage.getItem('truthScore') || '100'),
        totalShares: parseInt(localStorage.getItem('pracharShares') || '0')
    };

    // Determine milestone based on practice
    const totalDays = Math.max(karmaData.habitStreak, Math.floor(karmaData.japaTotal / 108));
    if (totalDays >= 108) {
        karmaData.milestone = 'siddha';
    } else if (totalDays >= 40) {
        karmaData.milestone = 'vrati';
    } else if (totalDays >= 21) {
        karmaData.milestone = 'tapasvi';
    } else {
        karmaData.milestone = 'sadhak';
    }
}

function updatePreviewStats() {
    const previewJapa = document.getElementById('preview-japa');
    if (previewJapa) {
        previewJapa.textContent = formatNumber(karmaData.japaTotal);
    }
}

function loadRippleCount() {
    const totalShares = document.getElementById('total-shares');
    if (totalShares) {
        totalShares.textContent = karmaData.totalShares;
    }
}

function formatNumber(num) {
    if (num >= 100000) {
        return (num / 100000).toFixed(1) + 'L';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Card type selection
    document.querySelectorAll('.card-option').forEach(option => {
        option.addEventListener('click', () => {
            currentCardType = option.dataset.type;
            showCreatorScreen();
        });
    });

    // Back button
    document.getElementById('back-to-picker')?.addEventListener('click', showPickerScreen);

    // Sankalpa selection
    document.querySelectorAll('.sankalpa-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sankalpa-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSankalpa = btn.dataset.sankalpa;
        });
    });

    // Background selection
    document.querySelectorAll('.bg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBg = btn.dataset.bg;
            updateCardBackground();
        });
    });

    // Share button
    document.getElementById('share-btn')?.addEventListener('click', showShareModal);

    // Share options
    document.getElementById('share-whatsapp')?.addEventListener('click', shareToWhatsApp);
    document.getElementById('share-native')?.addEventListener('click', shareNative);
    document.getElementById('share-download')?.addEventListener('click', downloadCard);
    document.getElementById('close-modal')?.addEventListener('click', hideShareModal);

    // Close modal on backdrop click
    document.getElementById('share-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'share-modal') {
            hideShareModal();
        }
    });
}

// ============================================
// SCREEN NAVIGATION
// ============================================
function showPickerScreen() {
    document.getElementById('picker-screen').classList.add('active');
    document.getElementById('creator-screen').classList.remove('active');
}

function showCreatorScreen() {
    document.getElementById('picker-screen').classList.remove('active');
    document.getElementById('creator-screen').classList.add('active');

    // Update title
    const titles = {
        sadhana: 'Sadhana Card',
        wisdom: 'Wisdom Card',
        suprabhat: 'Suprabhat Card',
        milestone: 'Milestone Card'
    };
    document.getElementById('creator-title').textContent = titles[currentCardType];

    // Generate card content
    generateCardContent();
    updateCardBackground();
}

// ============================================
// CARD GENERATION
// ============================================
function generateCardContent() {
    const cardMain = document.getElementById('card-main-content');

    switch (currentCardType) {
        case 'sadhana':
            cardMain.innerHTML = `
                <div class="sadhana-content">
                    <span class="stat-icon">📿</span>
                    <span class="stat-value">${formatNumber(karmaData.japaTotal)}</span>
                    <span class="stat-label">Names Chanted</span>
                    <div class="stat-badge">
                        ${milestones[karmaData.milestone].icon} ${milestones[karmaData.milestone].name}
                    </div>
                </div>
            `;
            break;

        case 'wisdom':
            const quote = gitaQuotes[Math.floor(Math.random() * gitaQuotes.length)];
            cardMain.innerHTML = `
                <div class="wisdom-content">
                    <p class="quote-sanskrit">"${quote.sanskrit}"</p>
                    <p class="quote-english">"${quote.english}"</p>
                    <span class="quote-ref">— ${quote.ref}</span>
                </div>
            `;
            break;

        case 'suprabhat':
            const message = suprabhatMessages[Math.floor(Math.random() * suprabhatMessages.length)];
            cardMain.innerHTML = `
                <div class="suprabhat-content">
                    <span class="sun-icon">🌅</span>
                    <h2 class="greeting">सुप्रभात</h2>
                    <p class="message">${message}</p>
                </div>
            `;
            break;

        case 'milestone':
            const m = milestones[karmaData.milestone];
            cardMain.innerHTML = `
                <div class="milestone-content">
                    <span class="badge-icon">${m.icon}</span>
                    <h2 class="badge-name">${m.name}</h2>
                    <span class="badge-english">${m.english}</span>
                    <p class="badge-desc">${m.desc}</p>
                </div>
            `;
            break;
    }
}

function updateCardBackground() {
    const card = document.getElementById('karma-card');
    // Remove all bg classes
    card.className = 'karma-card';
    card.classList.add(`bg-${currentBg}`);
}

// ============================================
// SHARING
// ============================================
function showShareModal() {
    document.getElementById('share-modal').classList.add('active');
}

function hideShareModal() {
    document.getElementById('share-modal').classList.remove('active');
}

async function generateCardImage() {
    const card = document.getElementById('karma-card');

    try {
        const canvas = await html2canvas(card, {
            scale: 2,
            backgroundColor: null,
            useCORS: true,
            logging: false
        });

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png', 1.0);
        });
    } catch (error) {
        console.error('Error generating card:', error);
        return null;
    }
}

function getSankalpaMessage() {
    const messages = {
        peace: "🙏 May this bring you peace today.",
        inspire: "💡 May this inspire your journey.",
        awaken: "🕉️ May this awaken your spirit.",
        gratitude: "🌸 Shared with gratitude."
    };
    return messages[currentSankalpa];
}

async function shareToWhatsApp() {
    hideShareModal();

    const blob = await generateCardImage();
    if (!blob) {
        alert('Could not generate card. Please try again.');
        return;
    }

    // Increment share count
    incrementShareCount();

    // Try Web Share API with file
    if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'karma-card.png', { type: 'image/png' });
        const shareData = {
            files: [file],
            title: 'Karma Card',
            text: getSankalpaMessage() + '\n\n🪷 via Sanatan OS'
        };

        if (navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        }
    }

    // Fallback: Download and open WhatsApp
    downloadBlob(blob, 'karma-card.png');
    const text = encodeURIComponent(getSankalpaMessage() + '\n\n🪷 via Sanatan OS');
    setTimeout(() => {
        window.open(`whatsapp://send?text=${text}`, '_blank');
    }, 500);
}

async function shareNative() {
    hideShareModal();

    const blob = await generateCardImage();
    if (!blob) {
        alert('Could not generate card. Please try again.');
        return;
    }

    incrementShareCount();

    if (navigator.share) {
        try {
            const file = new File([blob], 'karma-card.png', { type: 'image/png' });
            await navigator.share({
                files: [file],
                title: 'Karma Card',
                text: getSankalpaMessage()
            });
        } catch (err) {
            // Fallback if file sharing not supported
            downloadBlob(blob, 'karma-card.png');
        }
    } else {
        downloadBlob(blob, 'karma-card.png');
    }
}

async function downloadCard() {
    hideShareModal();

    const blob = await generateCardImage();
    if (!blob) {
        alert('Could not generate card. Please try again.');
        return;
    }

    incrementShareCount();
    downloadBlob(blob, 'karma-card.png');
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function incrementShareCount() {
    karmaData.totalShares++;
    localStorage.setItem('pracharShares', karmaData.totalShares.toString());

    const totalShares = document.getElementById('total-shares');
    if (totalShares) {
        totalShares.textContent = karmaData.totalShares;
    }

    // Show ripple screen after sharing
    setTimeout(() => {
        showRippleScreen();
    }, 500);
}

// ============================================
// PHASE 2: ANONYMOUS PILGRIM
// ============================================
let isAnonymous = false;

function setupPhase2Listeners() {
    // Anonymous toggle
    document.getElementById('anonymous-toggle')?.addEventListener('change', (e) => {
        isAnonymous = e.target.checked;
    });

    // Ripple screen navigation
    document.getElementById('back-from-ripple')?.addEventListener('click', showPickerScreen);
    document.getElementById('back-to-create')?.addEventListener('click', showPickerScreen);

    // Unwrap button
    document.getElementById('unwrap-btn')?.addEventListener('click', unwrapCard);

    // Click on ripple stats to see ripple screen
    document.querySelector('.ripple-stats')?.addEventListener('click', () => {
        if (karmaData.totalShares > 0) {
            showRippleScreen();
        }
    });
}

// Initialize Phase 2 listeners
document.addEventListener('DOMContentLoaded', () => {
    setupPhase2Listeners();
});

function getSenderName() {
    if (isAnonymous) {
        return "An Anonymous Pilgrim";
    }
    return "A Seeker on the Path";
}

// ============================================
// PHASE 2: RIPPLE MAP
// ============================================
function showRippleScreen() {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('ripple-screen').classList.add('active');

    // Update stats
    updateRippleMapStats();

    // Generate soul nodes
    generateSoulNodes();
}

function updateRippleMapStats() {
    const souls = karmaData.totalShares;
    const depth = Math.min(3, Math.ceil(souls / 3)); // Simulate generations
    const merit = souls * 108; // Each share = 108 merit points

    document.getElementById('map-souls').textContent = souls;
    document.getElementById('map-depth').textContent = depth;
    document.getElementById('map-merit').textContent = formatNumber(merit);
}

function generateSoulNodes() {
    const container = document.getElementById('soul-nodes');
    if (!container) return;

    container.innerHTML = '';

    const souls = Math.min(karmaData.totalShares, 12); // Max 12 visible nodes
    const centerX = 140;
    const centerY = 140;

    for (let i = 0; i < souls; i++) {
        const node = document.createElement('div');
        node.className = 'soul-node';
        node.textContent = '🙏';

        // Calculate position on rings
        const ring = Math.floor(i / 4) + 1; // Which ring (1, 2, or 3)
        const angleOffset = (i % 4) * 90 + (ring * 30); // Offset angle
        const angle = (angleOffset * Math.PI) / 180;
        const distance = ring * 50;

        const x = centerX + Math.cos(angle) * distance - 12;
        const y = centerY + Math.sin(angle) * distance - 12;

        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.animationDelay = `${i * 0.1}s`;

        container.appendChild(node);
    }
}

// ============================================
// PHASE 2: UNWRAP ANIMATION
// ============================================
function showUnwrapScreen(sankalpa, senderName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('unwrap-screen').classList.add('active');

    // Reset unwrap state
    const unwrapCard = document.getElementById('unwrap-card');
    unwrapCard.classList.remove('unwrapped');

    // Set content
    const sankalpaMessages = {
        peace: "May this bring you peace today 🙏",
        inspire: "May this inspire your journey 💡",
        awaken: "May this awaken your spirit 🕉️",
        gratitude: "Shared with gratitude 🌸"
    };

    document.getElementById('unwrap-sankalpa').textContent =
        sankalpaMessages[sankalpa] || sankalpaMessages.peace;
    document.getElementById('unwrap-sender').textContent =
        `From ${senderName || 'a Seeker on the Path'}`;
}

function unwrapCard() {
    const card = document.getElementById('unwrap-card');
    card.classList.add('unwrapped');

    // Create particle burst effect
    createParticleBurst();

    // Haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function createParticleBurst() {
    const container = document.querySelector('.unwrap-container');
    const colors = ['#ffd700', '#ff9933', '#e91e63', '#9c27b0', '#fff'];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = '50%';
        particle.style.top = '50%';

        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.animation = `particle-burst 0.8s ease-out forwards`;
        particle.style.animationDelay = `${Math.random() * 0.2}s`;

        container.appendChild(particle);

        // Remove after animation
        setTimeout(() => particle.remove(), 1000);
    }
}

// ============================================
// PHASE 2: ENHANCED SHARING WITH ANONYMOUS
// ============================================
function getShareMessage() {
    const sankalpaMsg = getSankalpaMessage();
    const senderLine = isAnonymous
        ? "\n— An Anonymous Pilgrim"
        : "\n— A Seeker on the Path";

    return sankalpaMsg + senderLine + "\n\n🪷 via Sanatan OS";
}

// Override share functions to use anonymous setting
const originalShareToWhatsApp = shareToWhatsApp;
shareToWhatsApp = async function () {
    hideShareModal();

    const blob = await generateCardImage();
    if (!blob) {
        alert('Could not generate card. Please try again.');
        return;
    }

    // Increment share count
    incrementShareCount();

    // Try Web Share API with file
    if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'karma-card.png', { type: 'image/png' });
        const shareData = {
            files: [file],
            title: 'A Gift of Wisdom',
            text: getShareMessage()
        };

        if (navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        }
    }

    // Fallback: Download and open WhatsApp
    downloadBlob(blob, 'karma-card.png');
    const text = encodeURIComponent(getShareMessage());
    setTimeout(() => {
        window.open(`whatsapp://send?text=${text}`, '_blank');
    }, 500);
};

// Demo function to test unwrap (can be called from console)
window.demoUnwrap = function () {
    showUnwrapScreen('peace', 'A Fellow Traveler');
};
