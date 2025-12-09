/**
 * Sanskrit Vidya - Curriculum Database
 * The Guru-Shishya Digital Parampara
 */

// ===== LEARNING PATHS =====
const PATHS = {
    bhakti: {
        id: 'bhakti',
        name: 'भक्ति मार्ग',
        english: 'Devotional Path',
        description: 'Learn through sacred mantras, stotras, and devotional verses',
        icon: '🙏',
        color: '#FF6B6B',
        gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)'
    },
    jnana: {
        id: 'jnana',
        name: 'ज्ञान मार्ग',
        english: 'Knowledge Path',
        description: 'Explore Upanishadic wisdom and philosophical texts',
        icon: '📚',
        color: '#4ECDC4',
        gradient: 'linear-gradient(135deg, #4ECDC4 0%, #7EDAD3 100%)'
    },
    samvada: {
        id: 'samvada',
        name: 'संवाद मार्ग',
        english: 'Conversational Path',
        description: 'Practical speaking for daily life and rituals',
        icon: '💬',
        color: '#45B7D1',
        gradient: 'linear-gradient(135deg, #45B7D1 0%, #6FC8E0 100%)'
    },
    shastra: {
        id: 'shastra',
        name: 'शास्त्र मार्ग',
        english: 'Scholarly Path',
        description: 'Deep dive into grammar, literature, and classics',
        icon: '🎓',
        color: '#96CEB4',
        gradient: 'linear-gradient(135deg, #96CEB4 0%, #B5DFCC 100%)'
    }
};

// ===== LEVELS (Samskrita Bharati Framework) =====
const LEVELS = {
    pravesha: {
        id: 'pravesha',
        name: 'प्रवेश',
        english: 'Immersion',
        description: 'Master the sacred sounds - 50+ phonemes of Devanagari',
        order: 1,
        unlocked: true
    },
    parichaya: {
        id: 'parichaya',
        name: 'परिचय',
        english: 'Introduction',
        description: 'Basic conversation and vocabulary building',
        order: 2,
        unlocked: false
    },
    shiksha: {
        id: 'shiksha',
        name: 'शिक्षा',
        english: 'Structure',
        description: 'Grammar, Sandhi, and sentence construction',
        order: 3,
        unlocked: false
    },
    kovida: {
        id: 'kovida',
        name: 'कोविद',
        english: 'Mastery',
        description: 'Classical texts and advanced composition',
        order: 4,
        unlocked: false
    }
};

// ===== VARNAMALA (Alphabet) - Organized by Articulation Point =====
const VARNAMALA = {
    swaras: {
        name: 'स्वर',
        english: 'Vowels',
        description: 'Self-sounding letters',
        sounds: [
            { id: 'a', devanagari: 'अ', iast: 'a', type: 'hrasva', sthana: 'kantha', audio: null },
            { id: 'aa', devanagari: 'आ', iast: 'ā', type: 'dirgha', sthana: 'kantha', audio: null },
            { id: 'i', devanagari: 'इ', iast: 'i', type: 'hrasva', sthana: 'talu', audio: null },
            { id: 'ii', devanagari: 'ई', iast: 'ī', type: 'dirgha', sthana: 'talu', audio: null },
            { id: 'u', devanagari: 'उ', iast: 'u', type: 'hrasva', sthana: 'oshtha', audio: null },
            { id: 'uu', devanagari: 'ऊ', iast: 'ū', type: 'dirgha', sthana: 'oshtha', audio: null },
            { id: 'ri', devanagari: 'ऋ', iast: 'ṛ', type: 'hrasva', sthana: 'murdha', audio: null },
            { id: 'rii', devanagari: 'ॠ', iast: 'ṝ', type: 'dirgha', sthana: 'murdha', audio: null },
            { id: 'e', devanagari: 'ए', iast: 'e', type: 'dirgha', sthana: 'kantha-talu', audio: null },
            { id: 'ai', devanagari: 'ऐ', iast: 'ai', type: 'dirgha', sthana: 'kantha-talu', audio: null },
            { id: 'o', devanagari: 'ओ', iast: 'o', type: 'dirgha', sthana: 'kantha-oshtha', audio: null },
            { id: 'au', devanagari: 'औ', iast: 'au', type: 'dirgha', sthana: 'kantha-oshtha', audio: null },
            { id: 'am', devanagari: 'अं', iast: 'ṃ', type: 'anusvara', sthana: 'nasika', audio: null },
            { id: 'ah', devanagari: 'अः', iast: 'ḥ', type: 'visarga', sthana: 'kantha', audio: null }
        ]
    },
    kanthya: {
        name: 'कण्ठ्य',
        english: 'Gutturals',
        description: 'Sounds from the throat (कण्ठ)',
        sthana: 'throat',
        instruction: 'Produced at the back of the throat. Feel the vibration in your throat.',
        sounds: [
            { id: 'ka', devanagari: 'क', iast: 'ka', type: 'sparsha', voice: 'aghosh', aspiration: 'alpaprana' },
            { id: 'kha', devanagari: 'ख', iast: 'kha', type: 'sparsha', voice: 'aghosh', aspiration: 'mahaprana' },
            { id: 'ga', devanagari: 'ग', iast: 'ga', type: 'sparsha', voice: 'ghosh', aspiration: 'alpaprana' },
            { id: 'gha', devanagari: 'घ', iast: 'gha', type: 'sparsha', voice: 'ghosh', aspiration: 'mahaprana' },
            { id: 'nga', devanagari: 'ङ', iast: 'ṅa', type: 'anunasika', voice: 'ghosh', aspiration: 'alpaprana' }
        ]
    },
    talavya: {
        name: 'तालव्य',
        english: 'Palatals',
        description: 'Sounds from the hard palate (तालु)',
        sthana: 'palate',
        instruction: 'Touch your tongue to the hard palate (roof of mouth, just behind the alveolar ridge).',
        sounds: [
            { id: 'cha', devanagari: 'च', iast: 'ca', type: 'sparsha', voice: 'aghosh', aspiration: 'alpaprana' },
            { id: 'chha', devanagari: 'छ', iast: 'cha', type: 'sparsha', voice: 'aghosh', aspiration: 'mahaprana' },
            { id: 'ja', devanagari: 'ज', iast: 'ja', type: 'sparsha', voice: 'ghosh', aspiration: 'alpaprana' },
            { id: 'jha', devanagari: 'झ', iast: 'jha', type: 'sparsha', voice: 'ghosh', aspiration: 'mahaprana' },
            { id: 'nya', devanagari: 'ञ', iast: 'ña', type: 'anunasika', voice: 'ghosh', aspiration: 'alpaprana' }
        ]
    },
    murdhanya: {
        name: 'मूर्धन्य',
        english: 'Retroflexes',
        description: 'Sounds with tongue curled back to the roof (मूर्धा)',
        sthana: 'roof',
        instruction: 'Curl your tongue back so the underside touches the roof of the mouth. This is unique to Sanskrit!',
        sounds: [
            { id: 'Ta', devanagari: 'ट', iast: 'ṭa', type: 'sparsha', voice: 'aghosh', aspiration: 'alpaprana' },
            { id: 'Tha', devanagari: 'ठ', iast: 'ṭha', type: 'sparsha', voice: 'aghosh', aspiration: 'mahaprana' },
            { id: 'Da', devanagari: 'ड', iast: 'ḍa', type: 'sparsha', voice: 'ghosh', aspiration: 'alpaprana' },
            { id: 'Dha', devanagari: 'ढ', iast: 'ḍha', type: 'sparsha', voice: 'ghosh', aspiration: 'mahaprana' },
            { id: 'Na', devanagari: 'ण', iast: 'ṇa', type: 'anunasika', voice: 'ghosh', aspiration: 'alpaprana' }
        ]
    },
    dantya: {
        name: 'दन्त्य',
        english: 'Dentals',
        description: 'Sounds with tongue touching teeth (दन्त)',
        sthana: 'teeth',
        instruction: 'Touch the tip of your tongue to the back of your upper front teeth.',
        sounds: [
            { id: 'ta', devanagari: 'त', iast: 'ta', type: 'sparsha', voice: 'aghosh', aspiration: 'alpaprana' },
            { id: 'tha', devanagari: 'थ', iast: 'tha', type: 'sparsha', voice: 'aghosh', aspiration: 'mahaprana' },
            { id: 'da', devanagari: 'द', iast: 'da', type: 'sparsha', voice: 'ghosh', aspiration: 'alpaprana' },
            { id: 'dha', devanagari: 'ध', iast: 'dha', type: 'sparsha', voice: 'ghosh', aspiration: 'mahaprana' },
            { id: 'na', devanagari: 'न', iast: 'na', type: 'anunasika', voice: 'ghosh', aspiration: 'alpaprana' }
        ]
    },
    oshthya: {
        name: 'ओष्ठ्य',
        english: 'Labials',
        description: 'Sounds using both lips (ओष्ठ)',
        sthana: 'lips',
        instruction: 'Press both lips together, then release with the sound.',
        sounds: [
            { id: 'pa', devanagari: 'प', iast: 'pa', type: 'sparsha', voice: 'aghosh', aspiration: 'alpaprana' },
            { id: 'pha', devanagari: 'फ', iast: 'pha', type: 'sparsha', voice: 'aghosh', aspiration: 'mahaprana' },
            { id: 'ba', devanagari: 'ब', iast: 'ba', type: 'sparsha', voice: 'ghosh', aspiration: 'alpaprana' },
            { id: 'bha', devanagari: 'भ', iast: 'bha', type: 'sparsha', voice: 'ghosh', aspiration: 'mahaprana' },
            { id: 'ma', devanagari: 'म', iast: 'ma', type: 'anunasika', voice: 'ghosh', aspiration: 'alpaprana' }
        ]
    },
    antahstha: {
        name: 'अन्तःस्थ',
        english: 'Semi-vowels',
        description: 'Between vowels and consonants',
        sounds: [
            { id: 'ya', devanagari: 'य', iast: 'ya', sthana: 'talu' },
            { id: 'ra', devanagari: 'र', iast: 'ra', sthana: 'murdha' },
            { id: 'la', devanagari: 'ल', iast: 'la', sthana: 'danta' },
            { id: 'va', devanagari: 'व', iast: 'va', sthana: 'danta-oshtha' }
        ]
    },
    ushman: {
        name: 'ऊष्मन्',
        english: 'Sibilants',
        description: 'Fricative sounds with breath',
        sounds: [
            { id: 'sha', devanagari: 'श', iast: 'śa', sthana: 'talu' },
            { id: 'Sha', devanagari: 'ष', iast: 'ṣa', sthana: 'murdha' },
            { id: 'sa', devanagari: 'स', iast: 'sa', sthana: 'danta' },
            { id: 'ha', devanagari: 'ह', iast: 'ha', sthana: 'kantha' }
        ]
    }
};

// ===== SHLOKAS DATABASE =====
const SHLOKAS = [
    {
        id: 'gayatri',
        name: 'गायत्री मन्त्र',
        english: 'Gayatri Mantra',
        category: 'bhakti',
        difficulty: 1,
        source: 'Rigveda 3.62.10',
        deity: 'Savitri (Sun)',
        lines: [
            { sanskrit: 'ॐ भूर्भुवः स्वः', iast: 'oṃ bhūr bhuvaḥ svaḥ', meaning: 'Om, the earthly, atmospheric, and celestial realms' },
            { sanskrit: 'तत्सवितुर्वरेण्यं', iast: 'tat savitur vareṇyaṃ', meaning: 'That excellent glory of Savitar (the Sun)' },
            { sanskrit: 'भर्गो देवस्य धीमहि', iast: 'bhargo devasya dhīmahi', meaning: 'The divine radiance we meditate upon' },
            { sanskrit: 'धियो यो नः प्रचोदयात्', iast: 'dhiyo yo naḥ pracodayāt', meaning: 'May He inspire our intellect' }
        ],
        fullText: 'ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं । भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥',
        meaning: 'We meditate on the excellent glory of the divine Sun. May He illuminate our intellect.',
        benefits: {
            scientific: [
                'Activates prefrontal cortex',
                'Reduces stress hormones (cortisol)',
                'Improves focus and concentration',
                'Enhances verbal memory'
            ],
            spiritual: [
                'Purifies the mind',
                'Awakens inner wisdom',
                'Connects to cosmic consciousness',
                'Removes ignorance'
            ]
        }
    },
    {
        id: 'mahamrityunjaya',
        name: 'महामृत्युञ्जय मन्त्र',
        english: 'Mahamrityunjaya Mantra',
        category: 'bhakti',
        difficulty: 2,
        source: 'Rigveda 7.59.12',
        deity: 'Shiva (Tryambaka)',
        lines: [
            { sanskrit: 'ॐ त्र्यम्बकं यजामहे', iast: 'oṃ tryambakaṃ yajāmahe', meaning: 'We worship the three-eyed One' },
            { sanskrit: 'सुगन्धिं पुष्टिवर्धनम्', iast: 'sugandhiṃ puṣṭivardhanam', meaning: 'Who is fragrant and nourishes all' },
            { sanskrit: 'उर्वारुकमिव बन्धनात्', iast: 'urvārukam iva bandhanāt', meaning: 'Like a cucumber from its stem' },
            { sanskrit: 'मृत्योर्मुक्षीय माऽमृतात्', iast: 'mṛtyor mukṣīya māmṛtāt', meaning: 'May we be liberated from death, not from immortality' }
        ],
        fullText: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनात् मृत्योर्मुक्षीय माऽमृतात् ॥',
        meaning: 'We worship the three-eyed Lord Shiva, who nourishes all beings. May He liberate us from the bondage of death.',
        benefits: {
            scientific: [
                'Reduces anxiety and fear',
                'Promotes healing and recovery',
                'Balances nervous system',
                'Improves sleep quality'
            ],
            spiritual: [
                'Protection from untimely death',
                'Grants moksha (liberation)',
                'Removes fear of death',
                'Promotes longevity'
            ]
        }
    },
    {
        id: 'shanti',
        name: 'शान्ति मन्त्र',
        english: 'Shanti Mantra',
        category: 'bhakti',
        difficulty: 1,
        source: 'Brihadaranyaka Upanishad',
        deity: 'Universal Peace',
        lines: [
            { sanskrit: 'ॐ सर्वे भवन्तु सुखिनः', iast: 'oṃ sarve bhavantu sukhinaḥ', meaning: 'May all be happy' },
            { sanskrit: 'सर्वे सन्तु निरामयाः', iast: 'sarve santu nirāmayāḥ', meaning: 'May all be free from illness' },
            { sanskrit: 'सर्वे भद्राणि पश्यन्तु', iast: 'sarve bhadrāṇi paśyantu', meaning: 'May all see auspiciousness' },
            { sanskrit: 'मा कश्चिद्दुःखभाग्भवेत्', iast: 'mā kaścid duḥkha bhāg bhavet', meaning: 'May no one suffer sorrow' },
            { sanskrit: 'ॐ शान्तिः शान्तिः शान्तिः', iast: 'oṃ śāntiḥ śāntiḥ śāntiḥ', meaning: 'Om peace, peace, peace' }
        ],
        fullText: 'ॐ सर्वे भवन्तु सुखिनः । सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु । मा कश्चिद्दुःखभाग्भवेत् । ॐ शान्तिः शान्तिः शान्तिः ॥',
        meaning: 'May all beings be happy, healthy, and see goodness. May no one suffer.',
        benefits: {
            scientific: [
                'Promotes relaxation response',
                'Lowers blood pressure',
                'Reduces inflammatory markers',
                'Enhances emotional well-being'
            ],
            spiritual: [
                'Cultivates universal compassion',
                'Creates positive vibrations',
                'Removes negative energy',
                'Establishes inner peace'
            ]
        }
    },
    {
        id: 'asato-ma',
        name: 'असतो मा सद्गमय',
        english: 'Asato Ma Prayer',
        category: 'jnana',
        difficulty: 1,
        source: 'Brihadaranyaka Upanishad 1.3.28',
        deity: 'Supreme Truth',
        lines: [
            { sanskrit: 'ॐ असतो मा सद्गमय', iast: 'oṃ asato mā sadgamaya', meaning: 'Lead me from unreal to Real' },
            { sanskrit: 'तमसो मा ज्योतिर्गमय', iast: 'tamaso mā jyotir gamaya', meaning: 'Lead me from darkness to Light' },
            { sanskrit: 'मृत्योर्मा अमृतं गमय', iast: 'mṛtyor mā amṛtaṃ gamaya', meaning: 'Lead me from death to Immortality' },
            { sanskrit: 'ॐ शान्तिः शान्तिः शान्तिः', iast: 'oṃ śāntiḥ śāntiḥ śāntiḥ', meaning: 'Om peace, peace, peace' }
        ],
        fullText: 'ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय । ॐ शान्तिः शान्तिः शान्तिः ॥',
        meaning: 'Lead me from the unreal to the Real, from darkness to Light, from death to Immortality.',
        benefits: {
            scientific: [
                'Enhances cognitive clarity',
                'Promotes positive thinking',
                'Reduces existential anxiety',
                'Improves mental resilience'
            ],
            spiritual: [
                'Awakens discrimination (viveka)',
                'Removes spiritual ignorance',
                'Guides to self-realization',
                'Connects to eternal truth'
            ]
        }
    },
    {
        id: 'vakratunda',
        name: 'वक्रतुण्ड महाकाय',
        english: 'Ganesha Shloka',
        category: 'bhakti',
        difficulty: 1,
        source: 'Traditional',
        deity: 'Ganesha',
        lines: [
            { sanskrit: 'वक्रतुण्ड महाकाय', iast: 'vakratuṇḍa mahākāya', meaning: 'O curved trunk, large body' },
            { sanskrit: 'सूर्यकोटि समप्रभ', iast: 'sūryakoṭi samaprabha', meaning: 'Radiant as a million suns' },
            { sanskrit: 'निर्विघ्नं कुरु मे देव', iast: 'nirvighnaṃ kuru me deva', meaning: 'O Lord, remove all obstacles' },
            { sanskrit: 'सर्वकार्येषु सर्वदा', iast: 'sarvakāryeṣu sarvadā', meaning: 'In all my tasks, always' }
        ],
        fullText: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
        meaning: 'O Lord Ganesha of the curved trunk and massive body, brilliant as a million suns, please remove all obstacles in all my endeavors, always.',
        benefits: {
            scientific: [
                'Reduces performance anxiety',
                'Improves task initiation',
                'Enhances problem-solving',
                'Boosts confidence'
            ],
            spiritual: [
                'Removes obstacles (Vighnaharta)',
                'Grants auspicious beginnings',
                'Bestows wisdom',
                'Provides protection'
            ]
        }
    }
];

// ===== ACHIEVEMENTS SYSTEM =====
const ACHIEVEMENTS = {
    pravesha: {
        id: 'pravesha',
        name: 'प्रवेश',
        english: 'Beginner',
        icon: '🌱',
        description: 'Complete the Varnamala (Alphabet)',
        criteria: { varnamalaComplete: true }
    },
    abhyasi: {
        id: 'abhyasi',
        name: 'अभ्यासी',
        english: 'Practitioner',
        icon: '🔥',
        description: 'Maintain a 7-day practice streak',
        criteria: { streak: 7 }
    },
    mantra_praveena: {
        id: 'mantra_praveena',
        name: 'मन्त्र प्रवीण',
        english: 'Verse Master',
        icon: '📿',
        description: 'Memorize 5 shlokas',
        criteria: { shlokasMemorized: 5 }
    },
    tapasvi: {
        id: 'tapasvi',
        name: 'तपस्वी',
        english: 'Dedicated',
        icon: '⚡',
        description: 'Practice for 30 days total',
        criteria: { totalDays: 30 }
    },
    shastri: {
        id: 'shastri',
        name: 'शास्त्री',
        english: 'Scholar',
        icon: '📜',
        description: 'Complete Pravesha and Parichaya levels',
        criteria: { levelsComplete: ['pravesha', 'parichaya'] }
    },
    acharya: {
        id: 'acharya',
        name: 'आचार्य',
        english: 'Teacher',
        icon: '🎓',
        description: 'Complete all four levels',
        criteria: { levelsComplete: ['pravesha', 'parichaya', 'shiksha', 'kovida'] }
    }
};

// ===== ARTICULATION POINTS (Sthana) INFO =====
const STHANA_INFO = {
    kantha: {
        name: 'कण्ठ',
        english: 'Throat',
        description: 'Back of the throat, near the uvula',
        image: 'throat-position.svg'
    },
    talu: {
        name: 'तालु',
        english: 'Palate',
        description: 'Hard palate, just behind the alveolar ridge',
        image: 'palate-position.svg'
    },
    murdha: {
        name: 'मूर्धा',
        english: 'Roof',
        description: 'Dome of the mouth - curl tongue back!',
        image: 'roof-position.svg'
    },
    danta: {
        name: 'दन्त',
        english: 'Teeth',
        description: 'Back of upper front teeth',
        image: 'teeth-position.svg'
    },
    oshtha: {
        name: 'ओष्ठ',
        english: 'Lips',
        description: 'Both lips pressed together',
        image: 'lips-position.svg'
    },
    nasika: {
        name: 'नासिका',
        english: 'Nose',
        description: 'Air passes through nasal cavity',
        image: 'nasal-position.svg'
    }
};

// ===== PHASE 2: SANDHI RULES =====
const SANDHI_RULES = {
    vowelSandhi: {
        name: 'स्वर सन्धि',
        english: 'Vowel Sandhi',
        description: 'When vowels meet, they combine',
        rules: [
            {
                id: 'guna',
                name: 'गुण सन्धि',
                english: 'Guna Sandhi',
                formula: 'अ/आ + इ/ई = ए',
                examples: [
                    { word1: 'न', word2: 'इति', result: 'नेति', explanation: 'अ + इ = ए' },
                    { word1: 'महा', word2: 'ईश्वर', result: 'महेश्वर', explanation: 'आ + ई = ए' },
                    { word1: 'देव', word2: 'इन्द्र', result: 'देवेन्द्र', explanation: 'अ + इ = ए' }
                ]
            },
            {
                id: 'vrddhi',
                name: 'वृद्धि सन्धि',
                english: 'Vrddhi Sandhi',
                formula: 'अ/आ + ए/ऐ = ऐ',
                examples: [
                    { word1: 'एक', word2: 'एकम्', result: 'एकैकम्', explanation: 'अ + ए = ऐ' },
                    { word1: 'मत', word2: 'ऐक्य', result: 'मतैक्य', explanation: 'अ + ऐ = ऐ' }
                ]
            },
            {
                id: 'yan',
                name: 'यण् सन्धि',
                english: 'Yan Sandhi',
                formula: 'इ/ई + अन्य स्वर = य्',
                examples: [
                    { word1: 'इति', word2: 'अपि', result: 'इत्यपि', explanation: 'इ + अ = य्अ (य)' },
                    { word1: 'अति', word2: 'उत्तम', result: 'अत्युत्तम', explanation: 'इ + उ = यु' }
                ]
            },
            {
                id: 'dirgha',
                name: 'दीर्घ सन्धि',
                english: 'Dirgha Sandhi',
                formula: 'अ/आ + अ/आ = आ',
                examples: [
                    { word1: 'हिम', word2: 'आलय', result: 'हिमालय', explanation: 'अ + आ = आ' },
                    { word1: 'विद्या', word2: 'आलय', result: 'विद्यालय', explanation: 'आ + आ = आ' }
                ]
            }
        ]
    },
    consonantSandhi: {
        name: 'व्यञ्जन सन्धि',
        english: 'Consonant Sandhi',
        description: 'When consonants meet',
        rules: [
            {
                id: 'visharga',
                name: 'विसर्ग सन्धि',
                english: 'Visarga Sandhi',
                formula: 'ः before voiced = र्/ओ',
                examples: [
                    { word1: 'नमः', word2: 'ते', result: 'नमस्ते', explanation: 'ः + त = स्त' },
                    { word1: 'रामः', word2: 'गच्छति', result: 'रामो गच्छति', explanation: 'ः + ग = ओ' }
                ]
            }
        ]
    }
};

// ===== PHASE 2: SANDHI PRACTICE QUESTIONS =====
const SANDHI_EXERCISES = [
    { word1: 'अ', word2: 'इ', answer: 'ए', options: ['ए', 'ऐ', 'ओ', 'औ'], rule: 'guna', explanation: 'Guna Sandhi: अ + इ = ए' },
    { word1: 'आ', word2: 'इ', answer: 'ए', options: ['ए', 'ऐ', 'आइ', 'ई'], rule: 'guna', explanation: 'Guna Sandhi: आ + इ = ए' },
    { word1: 'अ', word2: 'उ', answer: 'ओ', options: ['ओ', 'औ', 'उ', 'अउ'], rule: 'guna', explanation: 'Guna Sandhi: अ + उ = ओ' },
    { word1: 'अ', word2: 'ए', answer: 'ऐ', options: ['ऐ', 'ए', 'अए', 'इ'], rule: 'vrddhi', explanation: 'Vrddhi Sandhi: अ + ए = ऐ' },
    { word1: 'अ', word2: 'ओ', answer: 'औ', options: ['औ', 'ओ', 'अओ', 'उ'], rule: 'vrddhi', explanation: 'Vrddhi Sandhi: अ + ओ = औ' },
    { word1: 'अ', word2: 'अ', answer: 'आ', options: ['आ', 'अअ', 'ए', 'ओ'], rule: 'dirgha', explanation: 'Dirgha Sandhi: अ + अ = आ' },
    { word1: 'इ', word2: 'इ', answer: 'ई', options: ['ई', 'इइ', 'ए', 'ऐ'], rule: 'dirgha', explanation: 'Dirgha Sandhi: इ + इ = ई' },
    { word1: 'उ', word2: 'उ', answer: 'ऊ', options: ['ऊ', 'उउ', 'ओ', 'औ'], rule: 'dirgha', explanation: 'Dirgha Sandhi: उ + उ = ऊ' }
];

// ===== PHASE 2: VIBHAKTI (CASE ENDINGS) =====
const VIBHAKTI = {
    description: 'Sanskrit has 8 cases (विभक्ति) that indicate the role of nouns in sentences',
    cases: [
        { id: 1, name: 'प्रथमा', english: 'Nominative', role: 'कर्ता (Subject)', example: 'रामः गच्छति', translation: 'Rama goes' },
        { id: 2, name: 'द्वितीया', english: 'Accusative', role: 'कर्म (Object)', example: 'रामं पश्यामि', translation: 'I see Rama' },
        { id: 3, name: 'तृतीया', english: 'Instrumental', role: 'करण (By/With)', example: 'रामेण सह', translation: 'With Rama' },
        { id: 4, name: 'चतुर्थी', english: 'Dative', role: 'सम्प्रदान (To/For)', example: 'रामाय नमः', translation: 'Salutations to Rama' },
        { id: 5, name: 'पञ्चमी', english: 'Ablative', role: 'अपादान (From)', example: 'ग्रामात् आगच्छति', translation: 'Comes from village' },
        { id: 6, name: 'षष्ठी', english: 'Genitive', role: 'सम्बन्ध (Of)', example: 'रामस्य पुत्रः', translation: "Rama's son" },
        { id: 7, name: 'सप्तमी', english: 'Locative', role: 'अधिकरण (In/On)', example: 'गृहे तिष्ठति', translation: 'Stays in house' },
        { id: 8, name: 'सम्बोधन', english: 'Vocative', role: 'आमन्त्रण (Address)', example: 'हे राम!', translation: 'O Rama!' }
    ],
    ramaParadigm: {
        singular: ['रामः', 'रामम्', 'रामेण', 'रामाय', 'रामात्', 'रामस्य', 'रामे', 'हे राम'],
        dual: ['रामौ', 'रामौ', 'रामाभ्याम्', 'रामाभ्याम्', 'रामाभ्याम्', 'रामयोः', 'रामयोः', 'हे रामौ'],
        plural: ['रामाः', 'रामान्', 'रामैः', 'रामेभ्यः', 'रामेभ्यः', 'रामाणाम्', 'रामेषु', 'हे रामाः']
    }
};

// ===== PHASE 2: AI GURU CONVERSATION SCENARIOS =====
const GURU_SCENARIOS = {
    temple: {
        id: 'temple',
        name: 'Temple Visit',
        icon: '🛕',
        description: 'Practice greetings and offerings at a temple',
        conversations: [
            {
                guru: { sanskrit: 'नमस्ते शिष्य! मन्दिरं प्रति स्वागतम्।', iast: 'namaste śiṣya! mandiram prati svāgatam', english: 'Namaste student! Welcome to the temple.' },
                options: [
                    { id: 'a', sanskrit: 'नमस्ते गुरुजी', english: 'Hello Guruji', nextStep: 1 },
                    { id: 'b', sanskrit: 'प्रणाम गुरुजी', english: 'I bow to you, Guruji', nextStep: 1 },
                    { id: 'c', sanskrit: 'धन्यवादः गुरुजी', english: 'Thank you, Guruji', nextStep: 1 }
                ]
            },
            {
                guru: { sanskrit: 'शुभम्! किं त्वं दर्शनार्थम् आगतः/आगता?', iast: 'śubham! kiṃ tvaṃ darśanārtham āgataḥ/āgatā?', english: 'Good! Have you come for darshan?' },
                options: [
                    { id: 'a', sanskrit: 'आम्, दर्शनार्थम् आगतः अस्मि', english: 'Yes, I have come for darshan', nextStep: 2 },
                    { id: 'b', sanskrit: 'पूजार्थम् आगतः अस्मि', english: 'I have come for worship', nextStep: 2 }
                ]
            },
            {
                guru: { sanskrit: 'साधु! देवस्य आशीर्वादः तव अस्तु।', iast: 'sādhu! devasya āśīrvādaḥ tava astu', english: 'Excellent! May the blessing of the deity be upon you.' },
                options: [
                    { id: 'a', sanskrit: 'धन्यवादः', english: 'Thank you', nextStep: 'end' }
                ]
            }
        ]
    },
    market: {
        id: 'market',
        name: 'At the Market',
        icon: '🏪',
        description: 'Practice numbers, prices, and basic transactions',
        conversations: [
            {
                guru: { sanskrit: 'स्वागतम्! किम् इच्छसि?', iast: 'svāgatam! kim icchasi?', english: 'Welcome! What do you want?' },
                options: [
                    { id: 'a', sanskrit: 'फलानि इच्छामि', english: 'I want fruits', nextStep: 1 },
                    { id: 'b', sanskrit: 'पुस्तकम् इच्छामि', english: 'I want a book', nextStep: 1 }
                ]
            },
            {
                guru: { sanskrit: 'इदं पञ्च रूप्यकाणि। भवतु?', iast: 'idaṃ pañca rūpyakāṇi. bhavatu?', english: 'This is five rupees. Is it fine?' },
                options: [
                    { id: 'a', sanskrit: 'भवतु, इदम् ददामि', english: 'Yes, I give this', nextStep: 'end' },
                    { id: 'b', sanskrit: 'चत्वारि रूप्यकाणि?', english: 'Four rupees?', nextStep: 'end' }
                ]
            }
        ]
    },
    family: {
        id: 'family',
        name: 'Family Conversation',
        icon: '👨‍👩‍👧',
        description: 'Practice daily life and family-related vocabulary',
        conversations: [
            {
                guru: { sanskrit: 'सुप्रभातम्! कथम् अस्ति तव परिवारः?', iast: 'suprabhātam! katham asti tava parivāraḥ?', english: 'Good morning! How is your family?' },
                options: [
                    { id: 'a', sanskrit: 'सर्वे कुशलिनः', english: 'Everyone is well', nextStep: 1 },
                    { id: 'b', sanskrit: 'परिवारः स्वस्थः अस्ति', english: 'The family is healthy', nextStep: 1 }
                ]
            },
            {
                guru: { sanskrit: 'शुभम्! माता पिता कुशलिनौ?', iast: 'śubham! mātā pitā kuśalinau?', english: 'Good! Are mother and father well?' },
                options: [
                    { id: 'a', sanskrit: 'आम्, कुशलिनौ स्तः', english: 'Yes, they are well', nextStep: 'end' }
                ]
            }
        ]
    },
    ashram: {
        id: 'ashram',
        name: 'At the Ashram',
        icon: '🏛️',
        description: 'Practice spiritual discussions and philosophical questions',
        conversations: [
            {
                guru: { sanskrit: 'नमस्ते जिज्ञासो! किं प्रश्नः अस्ति?', iast: 'namaste jijñāso! kiṃ praśnaḥ asti?', english: 'Namaste seeker! What is your question?' },
                options: [
                    { id: 'a', sanskrit: 'आत्मा किम्?', english: 'What is the self?', nextStep: 1 },
                    { id: 'b', sanskrit: 'धर्मः किम्?', english: 'What is dharma?', nextStep: 1 },
                    { id: 'c', sanskrit: 'मोक्षः कथं प्राप्यते?', english: 'How is liberation attained?', nextStep: 1 }
                ]
            },
            {
                guru: { sanskrit: 'सत्यं ज्ञानम् अनन्तं ब्रह्म। तत् त्वम् असि।', iast: 'satyaṃ jñānam anantaṃ brahma. tat tvam asi.', english: 'Truth, knowledge, infinity is Brahman. You are That.' },
                options: [
                    { id: 'a', sanskrit: 'अद्भुतम्! धन्यवादः गुरुजी', english: 'Wonderful! Thank you Guruji', nextStep: 'end' }
                ]
            }
        ]
    }
};

// ===== PHASE 2: COMMON PHRASES =====
const COMMON_PHRASES = [
    { sanskrit: 'नमस्ते', iast: 'namaste', english: 'Hello / Greetings' },
    { sanskrit: 'धन्यवादः', iast: 'dhanyavādaḥ', english: 'Thank you' },
    { sanskrit: 'क्षम्यताम्', iast: 'kṣamyatām', english: 'Please forgive / Excuse me' },
    { sanskrit: 'कथम् अस्ति भवान्?', iast: 'katham asti bhavān?', english: 'How are you? (formal, male)' },
    { sanskrit: 'कथम् असि त्वम्?', iast: 'katham asi tvam?', english: 'How are you? (informal)' },
    { sanskrit: 'अहं कुशली/कुशलिनी', iast: 'ahaṃ kuśalī/kuśalinī', english: 'I am well (m/f)' },
    { sanskrit: 'मम नाम...', iast: 'mama nāma...', english: 'My name is...' },
    { sanskrit: 'भवतः नाम किम्?', iast: 'bhavataḥ nāma kim?', english: 'What is your name?' },
    { sanskrit: 'आम्', iast: 'ām', english: 'Yes' },
    { sanskrit: 'न', iast: 'na', english: 'No' }
];

// Export for use in script.js
if (typeof window !== 'undefined') {
    window.SanskritData = {
        PATHS,
        LEVELS,
        VARNAMALA,
        SHLOKAS,
        ACHIEVEMENTS,
        STHANA_INFO,
        // Phase 2 additions
        SANDHI_RULES,
        SANDHI_EXERCISES,
        VIBHAKTI,
        GURU_SCENARIOS,
        COMMON_PHRASES
    };
}
