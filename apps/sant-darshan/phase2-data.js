// Sant Darshan Phase 2 - Enhanced Data
// Stories, Connections, Quiz Questions, and Achievements

// ========== SAINT STORIES ==========
const SAINT_STORIES = {
    'kabir': [
        {
            id: 'kabir_birth',
            title: 'The Child on the Lotus',
            titleHi: 'कमल पर शिशु',
            type: 'origin',
            content: `In the ancient city of Varanasi, a Muslim weaver named Neeru and his wife Neema lived by the Lahartara pond. One morning, they found a newborn baby floating on a lotus leaf in the pond. Despite being childless and poor, they took the divine child home and named him Kabir. The mysterious origins of Kabir would later become a symbol of his message - that God belongs to no single religion.`,
            lesson: 'Divine beings transcend the boundaries of religion and caste.'
        },
        {
            id: 'kabir_ramananda',
            title: 'Becoming Ramananda\'s Disciple',
            titleHi: 'रामानंद के शिष्य',
            type: 'teaching',
            content: `Kabir wished to become a disciple of the great saint Ramananda, but as a Muslim weaver, he feared rejection. One morning, he lay down on the steps of the Ganga where Ramananda bathed before dawn. In the darkness, Ramananda accidentally stepped on Kabir and exclaimed "Ram! Ram!" - the divine name. Kabir claimed this as his mantra initiation, and Ramananda, seeing his devotion, accepted him as a disciple.`,
            lesson: 'True devotion finds a way; God accepts all who seek Him sincerely.'
        },
        {
            id: 'kabir_death',
            title: 'The Final Journey to Maghar',
            titleHi: 'मगहर की अंतिम यात्रा',
            type: 'death',
            content: `When Kabir sensed his time was near, he deliberately traveled to Maghar - a place believed to send souls to hell. He wanted to show that liberation depends on devotion, not location. After his death, both Hindus and Muslims claimed his body. When they lifted the shroud, they found only flowers - half became Hindu offerings, half went to Muslim burial. In death, as in life, Kabir united the divided.`,
            lesson: 'No place is unholy for one who remembers God. In the end, love transcends all differences.'
        }
    ],
    'mirabai': [
        {
            id: 'meera_childhood',
            title: 'The Child Bride of Krishna',
            titleHi: 'कृष्ण की बाल वधू',
            type: 'origin',
            content: `Young Meera once saw a wedding procession and asked her mother, "Who is my bridegroom?" Her mother jokingly pointed to a Krishna idol and said, "He is your bridegroom." From that day, Meera considered Krishna her true husband. She carried that idol everywhere and spoke to it as her beloved.`,
            lesson: 'Innocent love becomes the seed of lifelong devotion.'
        },
        {
            id: 'meera_poison',
            title: 'The Poison Becomes Nectar',
            titleHi: 'विष अमृत बना',
            type: 'miracle',
            content: `Meera's in-laws, angered by her devotion to Krishna instead of her royal duties, sent her a cup of poison disguised as sacred water. Meera drank it while singing to Krishna. The poison had no effect - some say it transformed into nectar. When they sent a basket with a snake, she found a garland of flowers and a shaligrama (sacred stone).`,
            lesson: 'For those absorbed in divine love, even poison cannot harm.'
        }
    ],
    'tukaram': [
        {
            id: 'tukaram_manuscripts',
            title: 'The Floating Manuscripts',
            titleHi: 'तैरती पोथियाँ',
            type: 'miracle',
            content: `The Brahmin priests of Dehu, jealous of Tukaram's growing influence, demanded he throw his manuscripts into the Indrayani river - how could a Shudra write about God? Tukaram fasted and prayed for thirteen days by the river. On the fourteenth day, the manuscripts floated up, completely dry and undamaged. Even the priests had to acknowledge the divine approval.`,
            lesson: 'Truth cannot be drowned. God protects the words of His devotees.'
        }
    ],
    'gurunanak': [
        {
            id: 'nanak_disappearance',
            title: 'Three Days in the Divine Court',
            titleHi: 'दिव्य दरबार में तीन दिन',
            type: 'origin',
            content: `At age 30, Nanak went to bathe in the Beas river and did not return. For three days, people searched. On the third day, he emerged from the water, radiant but silent. After a day of silence, his first words were: "There is no Hindu, there is no Muslim." He had been in the divine court, receiving his mission to teach humanity the path of truth.`,
            lesson: 'Sometimes one must disappear from the world to truly see it.'
        },
        {
            id: 'nanak_mecca',
            title: 'Feet Toward Mecca',
            titleHi: 'मक्का की तरफ पैर',
            type: 'teaching',
            content: `During his travels, Nanak reached Mecca and fell asleep with his feet pointing toward the Kaaba. Outraged, a mullah demanded he turn his feet away from God's house. Nanak replied, "Then turn my feet toward where God is not." When the mullah tried to move his feet, the Kaaba appeared wherever his feet pointed.`,
            lesson: 'God is omnipresent. Every direction leads to the Divine.'
        }
    ],
    'dnyaneshwar': [
        {
            id: 'dnyaneshwar_buffalo',
            title: 'The Buffalo Recites Vedas',
            titleHi: 'भैंस ने वेद पढ़े',
            type: 'miracle',
            content: `The orthodox Brahmins refused to accept Dnyaneshwar and his siblings because their father had returned from sannyasa to family life. To prove their worthiness, the priests mockingly said, "If you are pure, make this buffalo recite the Vedas." Young Dnyaneshwar touched the buffalo, and it began chanting Vedic hymns. The priests had to accept the children.`,
            lesson: 'True knowledge awakens divinity even in the humble.'
        }
    ],
    'ramakrishna': [
        {
            id: 'ramakrishna_all_paths',
            title: 'Practicing All Religions',
            titleHi: 'सभी धर्मों की साधना',
            type: 'teaching',
            content: `Sri Ramakrishna was unique in personally practicing multiple spiritual paths. He practiced Islam under a Sufi teacher, Christianity with deep devotion to Christ, and various Hindu paths. Each time, he attained the same divine experience. He concluded: "As many faiths, so many paths" - all rivers lead to the same ocean.`,
            lesson: 'All religions are paths to the same destination.'
        }
    ],
    'mahavira': [
        {
            id: 'mahavira_chandkaushik',
            title: 'Taming the Deadly Serpent',
            titleHi: 'भयंकर सर्प को वश में करना',
            type: 'teaching',
            content: `The deadly serpent Chandkaushik terrorized a village; one glance from him could kill. Mahavira walked into his territory. The serpent struck him repeatedly, but Mahavira remained in meditation, radiating compassion. Finally, he spoke gently: "Rise Chandkaushik, you too have a soul seeking liberation." The serpent stopped, wept, and became a devotee.`,
            lesson: 'Non-violence and compassion can transform even the most violent beings.'
        }
    ],
    'chaitanya': [
        {
            id: 'chaitanya_ecstasy',
            title: 'The Divine Madness',
            titleHi: 'दिव्य उन्माद',
            type: 'origin',
            content: `After returning from Gaya where he received initiation, Nimai (Chaitanya's childhood name) was transformed. He would chant "Hare Krishna" and fall unconscious in ecstasy. He would laugh, cry, and dance without control. His scholarly students thought he had gone mad, but this was the dawn of the sankirtan movement that would sweep across Bengal.`,
            lesson: 'Divine love often appears as madness to the worldly mind.'
        }
    ],
    'nammalvar': [
        {
            id: 'nammalvar_silence',
            title: 'Sixteen Years of Sacred Silence',
            titleHi: 'सोलह वर्ष का पवित्र मौन',
            type: 'origin',
            content: `From birth, Nammalvar neither cried, nor opened his eyes, nor took his mother's milk. His worried parents left him under a tamarind tree at the Adinatha temple. For sixteen years, he sat in meditation, taking no food or water. When the sage Madhurakavi found him and asked "If the subtle takes birth in the gross, what does it eat and where does it stay?" Nammalvar broke his silence to reply with divine wisdom.`,
            lesson: 'In silence, the deepest truths are born.'
        }
    ],
    'andal': [
        {
            id: 'andal_garland',
            title: 'The Worn Garland',
            titleHi: 'पहनी हुई माला',
            type: 'origin',
            content: `Andal would secretly wear the garlands her father Periyalvar made for Lord Ranganatha, admiring herself as Krishna's bride before sending them to the temple. When Periyalvar discovered this "pollution," he was horrified. But that night, the Lord appeared in his dream saying, "I only want the garlands touched by Andal. Her love makes them fragrant."`,
            lesson: 'God treasures devotion over ritualistic purity.'
        }
    ]
};

// ========== SPIRITUAL CONNECTIONS ==========
const SAINT_CONNECTIONS = {
    // Alvars
    'nammalvar': { guru: null, shishyas: ['madhurakavi'], contemporaries: ['thirumangai'], influenced: ['ramanuja'], tradition: 'alvar' },
    'madhurakavi': { guru: 'nammalvar', shishyas: [], contemporaries: [], influenced: [], tradition: 'alvar' },
    'andal': { guru: 'periyalvar', shishyas: [], contemporaries: [], influenced: [], tradition: 'alvar' },
    'periyalvar': { guru: null, shishyas: ['andal'], contemporaries: [], influenced: [], tradition: 'alvar' },

    // Nayanars  
    'appar': { guru: null, shishyas: [], contemporaries: ['sambandar', 'sundarar'], influenced: [], tradition: 'nayanar' },
    'sambandar': { guru: null, shishyas: [], contemporaries: ['appar'], influenced: [], tradition: 'nayanar' },
    'sundarar': { guru: null, shishyas: [], contemporaries: ['appar'], influenced: [], tradition: 'nayanar' },
    'manikkavacakar': { guru: null, shishyas: [], contemporaries: [], influenced: [], tradition: 'nayanar' },

    // Varkari
    'dnyaneshwar': { guru: 'nivrittinath', shishyas: [], contemporaries: ['namdev'], influenced: ['eknath', 'tukaram'], tradition: 'varkari' },
    'namdev': { guru: null, shishyas: ['janabai'], contemporaries: ['dnyaneshwar'], influenced: [], tradition: 'varkari' },
    'eknath': { guru: 'janardan_swami', shishyas: [], contemporaries: [], influenced: ['tukaram'], tradition: 'varkari' },
    'tukaram': { guru: null, shishyas: [], contemporaries: ['samarth'], influenced: [], tradition: 'varkari' },
    'janabai': { guru: 'namdev', shishyas: [], contemporaries: [], influenced: [], tradition: 'varkari' },
    'chokhamela': { guru: null, shishyas: [], contemporaries: ['namdev'], influenced: [], tradition: 'varkari' },

    // Nirguna Sant
    'kabir': { guru: 'ramananda', shishyas: ['dharam_das'], contemporaries: ['ravidas'], influenced: ['gurunanak'], tradition: 'nirguna' },
    'ramananda': { guru: 'raghavendra_swami', shishyas: ['kabir', 'ravidas', 'pipa', 'sena'], contemporaries: [], influenced: [], tradition: 'nirguna' },
    'ravidas': { guru: 'ramananda', shishyas: [], contemporaries: ['kabir'], influenced: [], tradition: 'nirguna' },

    // Saguna Bhakti
    'mirabai': { guru: 'ravidas', shishyas: [], contemporaries: ['tulsidas'], influenced: [], tradition: 'krishna_bhakti' },
    'tulsidas': { guru: 'naraharidas', shishyas: [], contemporaries: ['mirabai'], influenced: [], tradition: 'rama_bhakti' },
    'surdas': { guru: 'vallabhacharya', shishyas: [], contemporaries: [], influenced: [], tradition: 'pushtimarga' },
    'chaitanya': { guru: 'ishwar_puri', shishyas: ['nityananda', 'advaita_acharya'], contemporaries: [], influenced: [], tradition: 'gaudiya' },

    // Sikh Gurus - lineage
    'gurunanak': { guru: null, shishyas: ['guruangad'], contemporaries: ['kabir'], influenced: ['all_sikh_gurus'], tradition: 'sikh' },
    'guruangad': { guru: 'gurunanak', shishyas: ['guruamardas'], contemporaries: [], influenced: [], tradition: 'sikh' },
    'guruamardas': { guru: 'guruangad', shishyas: ['gururamdas'], contemporaries: [], influenced: [], tradition: 'sikh' },
    'gururamdas': { guru: 'guruamardas', shishyas: ['guruarjan'], contemporaries: [], influenced: [], tradition: 'sikh' },
    'guruarjan': { guru: 'gururamdas', shishyas: ['guruhargobind'], contemporaries: [], influenced: [], tradition: 'sikh' },
    'gurugobindsingh': { guru: 'guruteghbahadur', shishyas: ['khalsa'], contemporaries: [], influenced: [], tradition: 'sikh' },

    // Jain
    'mahavira': { guru: null, shishyas: ['gautama_gandhara'], contemporaries: [], influenced: ['all_jain_acharyas'], tradition: 'jain' },
    'parshvanatha': { guru: null, shishyas: [], contemporaries: [], influenced: ['mahavira'], tradition: 'jain' },

    // Haridasa
    'purandaradasa': { guru: 'vyasatirtha', shishyas: [], contemporaries: ['kanakadasa'], influenced: [], tradition: 'haridasa' },
    'kanakadasa': { guru: 'vyasatirtha', shishyas: [], contemporaries: ['purandaradasa'], influenced: [], tradition: 'haridasa' },
    'vyasatirtha': { guru: null, shishyas: ['purandaradasa', 'kanakadasa'], contemporaries: [], influenced: [], tradition: 'haridasa' }
};

// ========== ACHIEVEMENTS SYSTEM ==========
const ACHIEVEMENTS = [
    { id: 'first_darshan', name: 'First Darshan', nameHi: 'प्रथम दर्शन', icon: '🙏', description: 'Visit your first saint', condition: (data) => Object.keys(data.explored || {}).length >= 1 },
    { id: 'devotee', name: 'Devoted Seeker', nameHi: 'भक्त', icon: '🪷', description: 'Explore 10 saints', condition: (data) => Object.keys(data.explored || {}).length >= 10 },
    { id: 'scholar', name: 'Spiritual Scholar', nameHi: 'विद्वान', icon: '📚', description: 'Explore 25 saints', condition: (data) => Object.keys(data.explored || {}).length >= 25 },
    { id: 'enlightened', name: 'Enlightened One', nameHi: 'प्रबुद्ध', icon: '✨', description: 'Explore all saints', condition: (data) => Object.keys(data.explored || {}).length >= SAINTS.length },
    { id: 'streak_3', name: 'Consistent Seeker', nameHi: 'नियमित साधक', icon: '🔥', description: '3-day darshan streak', condition: (data) => (data.dailyDarshan?.streak || 0) >= 3 },
    { id: 'streak_7', name: 'Week of Devotion', nameHi: 'भक्ति सप्ताह', icon: '🌟', description: '7-day darshan streak', condition: (data) => (data.dailyDarshan?.streak || 0) >= 7 },
    { id: 'streak_30', name: 'Month of Sadhana', nameHi: 'साधना मास', icon: '👑', description: '30-day darshan streak', condition: (data) => (data.dailyDarshan?.streak || 0) >= 30 },
    { id: 'collector', name: 'Heart Collector', nameHi: 'संग्राहक', icon: '❤️', description: 'Favorite 5 saints', condition: (data) => (data.favorites || []).length >= 5 },
    { id: 'reflector', name: 'Deep Reflector', nameHi: 'चिंतक', icon: '✍️', description: 'Write 5 reflections', condition: (data) => Object.values(data.notes || {}).flat().length >= 5 },
    { id: 'quiz_starter', name: 'Quiz Beginner', nameHi: 'प्रारंभी', icon: '🎯', description: 'Complete first quiz', condition: (data) => (data.quizStats?.totalCompleted || 0) >= 1 },
    { id: 'quiz_master', name: 'Quiz Master', nameHi: 'ज्ञानी', icon: '🏆', description: 'Score 100% on 5 quizzes', condition: (data) => (data.quizStats?.perfectScores || 0) >= 5 },
    { id: 'tradition_hindu', name: 'Hindu Path', nameHi: 'हिंदू मार्ग', icon: '🕉️', description: 'Explore all Hindu saints', condition: (data) => { const hinduSaints = SAINTS.filter(s => s.tradition === 'hindu').map(s => s.id); return hinduSaints.every(id => data.explored?.[id]); } },
    { id: 'tradition_sikh', name: 'Sikh Path', nameHi: 'सिख मार्ग', icon: '☬', description: 'Explore all Sikh Gurus', condition: (data) => { const sikhSaints = SAINTS.filter(s => s.tradition === 'sikh').map(s => s.id); return sikhSaints.every(id => data.explored?.[id]); } },
    { id: 'tradition_jain', name: 'Jain Path', nameHi: 'जैन मार्ग', icon: '🙌', description: 'Explore all Jain Tirthankaras', condition: (data) => { const jainSaints = SAINTS.filter(s => s.tradition === 'jain').map(s => s.id); return jainSaints.every(id => data.explored?.[id]); } }
];

// ========== QUIZ QUESTION GENERATORS ==========
const QUIZ_TYPES = [
    {
        type: 'quote_attribution',
        generate: (saints) => {
            const saintsWithQuotes = saints.filter(s => s.quotes && s.quotes.length > 0);
            const correct = saintsWithQuotes[Math.floor(Math.random() * saintsWithQuotes.length)];
            const quote = correct.quotes[Math.floor(Math.random() * correct.quotes.length)];
            const options = [correct];
            while (options.length < 4) {
                const random = saintsWithQuotes[Math.floor(Math.random() * saintsWithQuotes.length)];
                if (!options.find(o => o.id === random.id)) options.push(random);
            }
            return {
                question: `Who said: ${quote}`,
                questionHi: `यह किसने कहा?`,
                options: shuffleArray(options.map(s => ({ id: s.id, text: s.name }))),
                correctId: correct.id,
                type: 'quote'
            };
        }
    },
    {
        type: 'tradition',
        generate: (saints) => {
            const saint = saints[Math.floor(Math.random() * saints.length)];
            const traditions = Object.values(TRADITIONS);
            return {
                question: `Which tradition does ${saint.name} belong to?`,
                questionHi: `${saint.nameHi || saint.name} किस परंपरा से हैं?`,
                options: traditions.map(t => ({ id: t.id, text: t.name })),
                correctId: saint.tradition,
                type: 'tradition'
            };
        }
    },
    {
        type: 'birthplace',
        generate: (saints) => {
            const saintsWithPlace = saints.filter(s => s.birthPlace && s.birthPlace.length > 5);
            const correct = saintsWithPlace[Math.floor(Math.random() * saintsWithPlace.length)];
            const options = [{ id: correct.id, text: correct.birthPlace }];
            while (options.length < 4) {
                const random = saintsWithPlace[Math.floor(Math.random() * saintsWithPlace.length)];
                if (!options.find(o => o.text === random.birthPlace)) {
                    options.push({ id: random.id, text: random.birthPlace });
                }
            }
            return {
                question: `Where was ${correct.name} born?`,
                questionHi: `${correct.nameHi || correct.name} कहाँ पैदा हुए?`,
                options: shuffleArray(options),
                correctId: correct.id,
                type: 'birthplace'
            };
        }
    },
    {
        type: 'sampradaya',
        generate: (saints) => {
            const saint = saints[Math.floor(Math.random() * saints.length)];
            const allSampradayas = [...new Set(saints.map(s => s.sampradaya))];
            const options = [{ id: saint.sampradaya, text: saint.sampradaya }];
            while (options.length < 4) {
                const random = allSampradayas[Math.floor(Math.random() * allSampradayas.length)];
                if (!options.find(o => o.text === random)) {
                    options.push({ id: random, text: random });
                }
            }
            return {
                question: `${saint.name} belonged to which sampradaya/movement?`,
                questionHi: `${saint.nameHi || saint.name} किस संप्रदाय से थे?`,
                options: shuffleArray(options),
                correctId: saint.sampradaya,
                type: 'sampradaya'
            };
        }
    },
    {
        type: 'period',
        generate: (saints) => {
            const saintsWithPeriod = saints.filter(s => s.period && !s.period.includes('Mythological'));
            const correct = saintsWithPeriod[Math.floor(Math.random() * saintsWithPeriod.length)];
            const options = [{ id: correct.id, text: correct.period }];
            while (options.length < 4) {
                const random = saintsWithPeriod[Math.floor(Math.random() * saintsWithPeriod.length)];
                if (!options.find(o => o.text === random.period)) {
                    options.push({ id: random.id, text: random.period });
                }
            }
            return {
                question: `When did ${correct.name} live?`,
                questionHi: `${correct.nameHi || correct.name} का काल क्या था?`,
                options: shuffleArray(options),
                correctId: correct.id,
                type: 'period'
            };
        }
    }
];

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateQuizQuestions(count = 5) {
    const questions = [];
    for (let i = 0; i < count; i++) {
        const typeIndex = Math.floor(Math.random() * QUIZ_TYPES.length);
        const question = QUIZ_TYPES[typeIndex].generate(SAINTS);
        questions.push(question);
    }
    return questions;
}

// ========== PHASE 3: LEARNING PATHS ==========
const LEARNING_PATHS = [
    {
        id: 'alvars-journey',
        title: '12 Alvars Journey',
        titleHi: 'द्वादश आळ्वार यात्रा',
        description: 'Follow the spiritual journey of the 12 Vaishnavite poet-saints of Tamil Nadu',
        icon: '🙏',
        color: '#FF9933',
        duration: '12 days',
        saints: ['nammalvar', 'andal', 'periyalvar', 'kulasekhara', 'thirumangai'],
        rewards: {
            badge: 'alvar_devotee',
            badgeName: 'Alvar Devotee',
            badgeIcon: '🪷'
        }
    },
    {
        id: 'bhakti-masters',
        title: 'Bhakti Movement Masters',
        titleHi: 'भक्ति आंदोलन के गुरु',
        description: 'Explore the revolutionary saints who spread devotion across India',
        icon: '❤️',
        color: '#E91E63',
        duration: '10 days',
        saints: ['kabir', 'mirabai', 'tulsidas', 'surdas', 'chaitanya', 'tukaram', 'dnyaneshwar', 'namdev'],
        rewards: {
            badge: 'bhakti_master',
            badgeName: 'Bhakti Master',
            badgeIcon: '💖'
        }
    },
    {
        id: 'sikh-gurus',
        title: 'Sikh Gurus Path',
        titleHi: 'सिख गुरु मार्ग',
        description: 'Walk the path of the Ten Sikh Gurus from Nanak to Gobind Singh',
        icon: '☬',
        color: '#1E90FF',
        duration: '10 days',
        saints: ['gurunanak', 'guruangad', 'guruamardas', 'gururamdas', 'guruarjan', 'gurugobindsingh'],
        rewards: {
            badge: 'sikh_devotee',
            badgeName: 'Waheguru Devotee',
            badgeIcon: '🙏'
        }
    },
    {
        id: 'varkari-pilgrimage',
        title: 'Varkari Pilgrimage',
        titleHi: 'वारकरी तीर्थयात्रा',
        description: 'Join the spiritual footsteps of Maharashtra\'s beloved saints',
        icon: '🚶',
        color: '#FF5722',
        duration: '7 days',
        saints: ['dnyaneshwar', 'namdev', 'eknath', 'tukaram', 'janabai', 'chokhamela'],
        rewards: {
            badge: 'varkari',
            badgeName: 'Varkari Pilgrim',
            badgeIcon: '🏃'
        }
    },
    {
        id: 'jain-tirthankaras',
        title: 'Jain Tirthankaras',
        titleHi: 'जैन तीर्थंकर',
        description: 'Learn from the great teachers of non-violence and liberation',
        icon: '🙌',
        color: '#FFD700',
        duration: '5 days',
        saints: ['mahavira', 'parshvanatha'],
        rewards: {
            badge: 'jain_seeker',
            badgeName: 'Ahimsa Seeker',
            badgeIcon: '☮️'
        }
    }
];

// ========== PHASE 3: JOURNAL PROMPTS ==========
const JOURNAL_PROMPTS = [
    "How can you apply today's saint's teachings in your daily life?",
    "What aspect of this saint's life inspires you the most?",
    "If you could ask this saint one question, what would it be?",
    "How does this saint's message resonate with your current life situation?",
    "What obstacles in your spiritual journey can this saint's story help you overcome?",
    "Write about a time when you experienced something similar to this saint's teaching.",
    "How would your life change if you fully embraced this saint's philosophy?",
    "What small step can you take today inspired by this saint?",
    "Reflect on how this saint's devotion compares to your own spiritual practice.",
    "What wisdom from this saint would you share with someone struggling?"
];

// ========== PHASE 3: QUOTE CARD STYLES ==========
const CARD_STYLES = {
    minimal: {
        id: 'minimal',
        name: 'Minimal',
        nameHi: 'सरल',
        background: '#FFFBF0',
        textColor: '#2D2D2D',
        accentColor: '#FF9933',
        fontStyle: 'clean'
    },
    ornate: {
        id: 'ornate',
        name: 'Ornate',
        nameHi: 'अलंकृत',
        background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)',
        textColor: '#5D4037',
        accentColor: '#C9A227',
        fontStyle: 'decorative',
        pattern: true
    },
    dark: {
        id: 'dark',
        name: 'Dark',
        nameHi: 'गहरा',
        background: 'linear-gradient(135deg, #1a1a3e 0%, #2a2a4e 100%)',
        textColor: '#FFFFFF',
        accentColor: '#FF9933',
        fontStyle: 'modern'
    }
};

// ========== PHASE 4: PILGRIMAGE PLACES ==========
const SAINT_PLACES = {
    'kabir': [
        { name: 'Kabir Chaura', type: 'birthplace', city: 'Varanasi', state: 'Uttar Pradesh', coordinates: [25.3176, 82.9739], description: 'Where Kabir was found on a lotus leaf', temple: 'Kabir Chaura Math' },
        { name: 'Maghar', type: 'samadhi', city: 'Maghar', state: 'Uttar Pradesh', coordinates: [26.7598, 83.1289], description: 'Where Kabir attained Samadhi', temple: 'Kabir Samadhi Mandir & Dargah' }
    ],
    'mirabai': [
        { name: 'Merta City', type: 'birthplace', city: 'Merta', state: 'Rajasthan', coordinates: [26.6500, 74.0333], description: 'Birthplace of Meerabai', temple: 'Meera Mandir' },
        { name: 'Chittorgarh', type: 'residence', city: 'Chittorgarh', state: 'Rajasthan', coordinates: [24.8829, 74.6461], description: 'Where Meera spent her married life', temple: 'Meera Temple in Fort' },
        { name: 'Dwarka', type: 'samadhi', city: 'Dwarka', state: 'Gujarat', coordinates: [22.2442, 68.9685], description: 'Where Meera merged with Krishna idol', temple: 'Dwarkadhish Temple' }
    ],
    'tukaram': [
        { name: 'Dehu', type: 'birthplace', city: 'Dehu', state: 'Maharashtra', coordinates: [18.7167, 73.7667], description: 'Birthplace and Samadhi of Sant Tukaram', temple: 'Tukaram Gatha Mandir' },
        { name: 'Indrayani River', type: 'miracle', city: 'Dehu', state: 'Maharashtra', coordinates: [18.7167, 73.7667], description: 'Where manuscripts floated up', temple: 'Indrayani Ghat' }
    ],
    'dnyaneshwar': [
        { name: 'Apegaon', type: 'birthplace', city: 'Paithan', state: 'Maharashtra', coordinates: [19.4833, 75.3833], description: 'Birthplace of Sant Dnyaneshwar', temple: 'Dnyaneshwar Temple' },
        { name: 'Alandi', type: 'samadhi', city: 'Alandi', state: 'Maharashtra', coordinates: [18.6786, 73.8978], description: 'Sanjeevan Samadhi of Sant Dnyaneshwar', temple: 'Dnyaneshwar Mandir' }
    ],
    'gurunanak': [
        { name: 'Nankana Sahib', type: 'birthplace', city: 'Nankana Sahib', state: 'Punjab, Pakistan', coordinates: [31.4504, 73.7061], description: 'Birthplace of Guru Nanak Dev Ji', temple: 'Gurdwara Janam Asthan' },
        { name: 'Kartarpur Sahib', type: 'samadhi', city: 'Kartarpur', state: 'Punjab, Pakistan', coordinates: [32.2533, 74.6531], description: 'Where Guru Nanak spent last years', temple: 'Gurdwara Darbar Sahib Kartarpur' }
    ],
    'ramakrishna': [
        { name: 'Kamarpukur', type: 'birthplace', city: 'Kamarpukur', state: 'West Bengal', coordinates: [22.6431, 87.6528], description: 'Birthplace of Sri Ramakrishna', temple: 'Ramakrishna Temple' },
        { name: 'Dakshineswar', type: 'sadhana', city: 'Kolkata', state: 'West Bengal', coordinates: [22.6547, 88.3578], description: 'Where Ramakrishna practiced sadhana', temple: 'Dakshineswar Kali Temple' },
        { name: 'Belur Math', type: 'samadhi', city: 'Howrah', state: 'West Bengal', coordinates: [22.6320, 88.3556], description: 'Headquarters of Ramakrishna Mission', temple: 'Belur Math Temple' }
    ],
    'nammalvar': [
        { name: 'Alvar Tirunagari', type: 'birthplace', city: 'Tirunelveli', state: 'Tamil Nadu', coordinates: [8.6144, 77.8556], description: 'Birthplace of Nammalvar under tamarind tree', temple: 'Adhinathar Temple' }
    ],
    'andal': [
        { name: 'Srivilliputhur', type: 'birthplace', city: 'Srivilliputhur', state: 'Tamil Nadu', coordinates: [9.5122, 77.6344], description: 'Birthplace of Andal', temple: 'Andal Temple' },
        { name: 'Srirangam', type: 'marriage', city: 'Tiruchirappalli', state: 'Tamil Nadu', coordinates: [10.8625, 78.6867], description: 'Where Andal merged with Ranganatha', temple: 'Sri Ranganathaswamy Temple' }
    ],
    'mahavira': [
        { name: 'Kundagrama', type: 'birthplace', city: 'Vaishali', state: 'Bihar', coordinates: [25.9900, 85.1300], description: 'Birthplace of Lord Mahavira', temple: 'Vaishali Temple Complex' },
        { name: 'Pawapuri', type: 'nirvan', city: 'Nalanda', state: 'Bihar', coordinates: [25.2700, 85.7800], description: 'Where Mahavira attained Nirvana', temple: 'Jal Mandir' }
    ],
    'chaitanya': [
        { name: 'Nabadwip', type: 'birthplace', city: 'Nadia', state: 'West Bengal', coordinates: [23.4167, 88.3667], description: 'Birthplace of Chaitanya Mahaprabhu', temple: 'ISKCON Temple Mayapur' },
        { name: 'Puri', type: 'sadhana', city: 'Puri', state: 'Odisha', coordinates: [19.8135, 85.8312], description: 'Where Chaitanya spent later years', temple: 'Gambhira' }
    ],
    'guruarjan': [
        { name: 'Goindwal', type: 'birthplace', city: 'Tarn Taran', state: 'Punjab', coordinates: [31.3733, 74.9500], description: 'Birthplace of Guru Arjan Dev Ji', temple: 'Gurdwara Chaubara Sahib' },
        { name: 'Harmandir Sahib', type: 'creation', city: 'Amritsar', state: 'Punjab', coordinates: [31.6200, 74.8765], description: 'Founded by Guru Arjan Dev Ji', temple: 'Golden Temple' }
    ],
    'appar': [
        { name: 'Thiruamur', type: 'birthplace', city: 'Cuddalore', state: 'Tamil Nadu', coordinates: [11.4500, 79.6500], description: 'Birthplace of Thirunavukkarasar', temple: 'Appar Temple' }
    ],
    'sambandar': [
        { name: 'Sirkali', type: 'birthplace', city: 'Sirkali', state: 'Tamil Nadu', coordinates: [11.2372, 79.7378], description: 'Birthplace of Thirugnana Sambandar', temple: 'Brahmapureeswarar Temple' }
    ],
    'purandaradasa': [
        { name: 'Purandaragad', type: 'birthplace', city: 'Pune', state: 'Maharashtra', coordinates: [18.2833, 73.5833], description: 'Birthplace of Purandaradasa', temple: 'Purandar Fort' },
        { name: 'Hampi', type: 'sadhana', city: 'Hampi', state: 'Karnataka', coordinates: [15.3350, 76.4600], description: 'Where Purandaradasa composed songs', temple: 'Virupaksha Temple' }
    ]
};

// ========== PHASE 4: JAYANTI CALENDAR ==========
const SAINT_JAYANTIS = [
    { saintId: 'kabir', name: 'Kabir Jayanti', nameHi: 'कबीर जयंती', month: 6, day: 24, type: 'purnima', description: 'Full moon of Jyeshtha month', celebrations: ['Bhajan Sandhya', 'Satsang', 'Community meals'] },
    { saintId: 'mirabai', name: 'Meera Jayanti', nameHi: 'मीरा जयंती', month: 10, day: 5, type: 'tithi', description: 'Sharad Purnima', celebrations: ['Krishna Bhajans', 'Night vigil', 'Temple processions'] },
    { saintId: 'tukaram', name: 'Tukaram Beej', nameHi: 'तुकाराम बीज', month: 3, day: 8, type: 'tithi', description: 'Falgun Vadya Dwitiya', celebrations: ['Wari preparations', 'Abhang recitation', 'Dehu pilgrimage'] },
    { saintId: 'dnyaneshwar', name: 'Dnyaneshwar Jayanti', nameHi: 'ज्ञानेश्वर जयंती', month: 8, day: 27, type: 'tithi', description: 'Shravan Krishna Ashtami', celebrations: ['Dnyaneshwari recitation', 'Alandi pilgrimage'] },
    { saintId: 'gurunanak', name: 'Guru Nanak Gurpurab', nameHi: 'गुरु नानक गुरपुरब', month: 11, day: 15, type: 'purnima', description: 'Kartik Purnima', celebrations: ['Prabhat Pheri', 'Akhand Path', 'Langar'] },
    { saintId: 'ramakrishna', name: 'Ramakrishna Jayanti', nameHi: 'रामकृष्ण जयंती', month: 2, day: 18, type: 'tithi', description: 'Falgun Shukla Dwitiya', celebrations: ['Special Puja', 'Devotional songs', 'Lectures'] },
    { saintId: 'mahavira', name: 'Mahavir Jayanti', nameHi: 'महावीर जयंती', month: 4, day: 10, type: 'tithi', description: 'Chaitra Shukla Trayodashi', celebrations: ['Temple processions', 'Abhisheka', 'Charitable acts'] },
    { saintId: 'chaitanya', name: 'Gaura Purnima', nameHi: 'गौर पूर्णिमा', month: 3, day: 25, type: 'purnima', description: 'Falgun Purnima', celebrations: ['Sankirtan', 'Abhisheka', 'Feast'] },
    { saintId: 'nammalvar', name: 'Nammalvar Moksham', nameHi: 'नम्मालवार मोक्षम', month: 5, day: 15, type: 'nakshatra', description: 'Vaikasi Visakam', celebrations: ['Tiruvaimozhi recitation', 'Festival at Alvar Tirunagari'] },
    { saintId: 'andal', name: 'Andal Jayanti', nameHi: 'आंडाल जयंती', month: 7, day: 28, type: 'nakshatra', description: 'Adi Pooram', celebrations: ['Garland offerings', 'Tiruppavai recitation'] },
    { saintId: 'gurugobindsingh', name: 'Guru Gobind Singh Jayanti', nameHi: 'गुरु गोबिंद सिंह जयंती', month: 1, day: 5, type: 'gregorian', description: 'Birth anniversary', celebrations: ['Nagar Kirtan', 'Akhand Path', 'Gatka'] },
    { saintId: 'guruarjan', name: 'Guru Arjan Dev Martyrdom', nameHi: 'गुरु अर्जन देव शहीदी दिवस', month: 6, day: 16, type: 'gregorian', description: 'Martyrdom anniversary', celebrations: ['Shabad Kirtan', 'Chabeel distribution'] },
    { saintId: 'ravidas', name: 'Ravidas Jayanti', nameHi: 'रविदास जयंती', month: 2, day: 24, type: 'purnima', description: 'Magh Purnima', celebrations: ['Bhajan programs', 'Community service'] },
    { saintId: 'surdas', name: 'Surdas Jayanti', nameHi: 'सूरदास जयंती', month: 5, day: 10, type: 'tithi', description: 'Vaishakh Shukla Panchami', celebrations: ['Sur Sagar recitation', 'Bhajan evenings'] },
    { saintId: 'tulsidas', name: 'Tulsidas Jayanti', nameHi: 'तुलसीदास जयंती', month: 8, day: 11, type: 'tithi', description: 'Shravan Saptami', celebrations: ['Ramcharitmanas Path', 'Hanuman Chalisa'] }
];

// Helper function to get upcoming jayantis
function getUpcomingJayantis(days = 30) {
    const today = new Date();
    const upcoming = [];

    SAINT_JAYANTIS.forEach(j => {
        const jayanti = new Date(today.getFullYear(), j.month - 1, j.day);
        if (jayanti < today) {
            jayanti.setFullYear(today.getFullYear() + 1);
        }
        const daysUntil = Math.ceil((jayanti - today) / (1000 * 60 * 60 * 24));
        if (daysUntil <= days) {
            upcoming.push({ ...j, date: jayanti, daysUntil });
        }
    });

    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SAINT_STORIES, SAINT_CONNECTIONS, ACHIEVEMENTS, QUIZ_TYPES, generateQuizQuestions, LEARNING_PATHS, JOURNAL_PROMPTS, CARD_STYLES, SAINT_PLACES, SAINT_JAYANTIS, getUpcomingJayantis };
}
