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
}
