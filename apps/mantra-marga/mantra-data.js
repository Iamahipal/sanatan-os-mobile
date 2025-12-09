/**
 * MantraMarga - Vedic Mantra Database
 * Comprehensive collection of 20 essential mantras
 */

const MANTRA_CATEGORIES = [
    { id: 'universal', name: 'Universal', nameHi: 'सार्वभौमिक', icon: '🕉️', color: '#FF9933' },
    { id: 'vedic', name: 'Vedic', nameHi: 'वैदिक', icon: '📜', color: '#FFD700' },
    { id: 'deity', name: 'Deity', nameHi: 'देवता', icon: '🙏', color: '#6A0572' },
    { id: 'chakra', name: 'Chakra', nameHi: 'चक्र', icon: '🔮', color: '#00A896' },
    { id: 'healing', name: 'Healing', nameHi: 'उपचार', icon: '💚', color: '#4CAF50' },
    { id: 'peace', name: 'Peace', nameHi: 'शान्ति', icon: '☮️', color: '#2196F3' }
];

const MANTRA_DATABASE = [
    // 1. OM - The Primordial Sound
    {
        id: 'om',
        name: { sanskrit: 'ॐ', transliteration: 'Om', english: 'Om / Aum' },
        category: 'universal',
        deity: 'Brahman (Universal Consciousness)',
        source: { text: 'Mandukya Upanishad', reference: 'All Vedas' },
        rishi: 'Brahma',
        chandas: 'Gayatri',
        fullText: {
            devanagari: 'ॐ',
            iast: 'Oṃ',
            meaning: 'The primordial sound of the universe, representing creation, preservation, and dissolution.'
        },
        benefits: {
            spiritual: ['Connects to universal consciousness', 'Opens third eye chakra', 'Leads to self-realization'],
            scientific: ['Reduces limbic activity (fMRI study, IIT Delhi)', 'Increases alpha brain waves', 'Stimulates vagus nerve through vibration']
        },
        practice: {
            repetitions: [3, 21, 108],
            bestTime: 'Brahma Muhurta (4-6 AM), Sunrise, Sunset',
            direction: 'East or North',
            posture: 'Padmasana, Sukhasana',
            duration: '5-15 minutes'
        },
        difficulty: 'beginner',
        featured: true
    },

    // 2. SO HUM - The Breath Mantra
    {
        id: 'soham',
        name: { sanskrit: 'सो हं', transliteration: 'So Hum', english: 'I Am That' },
        category: 'universal',
        deity: 'Atman (Self)',
        source: { text: 'Isha Upanishad', reference: 'Vedanta' },
        rishi: 'Various',
        chandas: 'Anushtup',
        fullText: {
            devanagari: 'सो हं',
            iast: 'So Haṃ',
            meaning: '"So" on inhale (That), "Hum" on exhale (I Am) - identifying the individual self with the universal.'
        },
        benefits: {
            spiritual: ['Dissolves ego boundaries', 'Awakens self-awareness', 'Natural meditation'],
            scientific: ['Balances autonomic nervous system', 'Synchronizes breath and heart rate', 'Reduces anxiety']
        },
        practice: {
            repetitions: [108, 216],
            bestTime: 'Any time, especially morning',
            direction: 'Any',
            posture: 'Any comfortable seated position',
            duration: '10-20 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },

    // 3. GAYATRI MANTRA - The Illuminator
    {
        id: 'gayatri',
        name: { sanskrit: 'गायत्री मंत्र', transliteration: 'Gayatri Mantra', english: 'The Illuminator' },
        category: 'vedic',
        deity: 'Savitar (Sun God)',
        source: { text: 'Rigveda', reference: '3.62.10' },
        rishi: 'Vishvamitra',
        chandas: 'Gayatri (24 syllables)',
        fullText: {
            devanagari: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
            iast: 'Oṃ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt',
            meaning: 'We meditate on the adorable glory of the radiant sun; may He inspire our intelligence.'
        },
        wordByWord: [
            { word: 'ॐ', meaning: 'Sacred syllable' },
            { word: 'भूः', meaning: 'Earth plane' },
            { word: 'भुवः', meaning: 'Atmospheric plane' },
            { word: 'स्वः', meaning: 'Celestial plane' },
            { word: 'तत्', meaning: 'That' },
            { word: 'सवितुः', meaning: 'Of Savitar (Sun)' },
            { word: 'वरेण्यं', meaning: 'Most excellent' },
            { word: 'भर्गः', meaning: 'Effulgence/Light' },
            { word: 'देवस्य', meaning: 'Of the divine' },
            { word: 'धीमहि', meaning: 'We meditate' },
            { word: 'धियः', meaning: 'Intellect' },
            { word: 'यः', meaning: 'Who' },
            { word: 'नः', meaning: 'Our' },
            { word: 'प्रचोदयात्', meaning: 'May inspire' }
        ],
        benefits: {
            spiritual: ['Illuminates intellect', 'Removes ignorance', 'Purifies mind'],
            scientific: ['Improves working memory', 'Enhances spatial orientation', 'Stimulates prefrontal cortex']
        },
        practice: {
            repetitions: [3, 11, 108, 1008],
            bestTime: 'Sandhya Vandana (Dawn, Noon, Dusk)',
            direction: 'East (morning), West (evening)',
            posture: 'Padmasana with Gayatri Mudra',
            duration: '15-30 minutes'
        },
        difficulty: 'intermediate',
        featured: true
    },

    // 4. MAHAMRITYUNJAYA - The Great Healing Mantra
    {
        id: 'mahamrityunjaya',
        name: { sanskrit: 'महामृत्युंजय मंत्र', transliteration: 'Mahamrityunjaya', english: 'The Death Conqueror' },
        category: 'healing',
        deity: 'Shiva (Tryambaka)',
        source: { text: 'Rigveda', reference: '7.59.12' },
        rishi: 'Markandeya',
        chandas: 'Anushtup',
        fullText: {
            devanagari: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्',
            iast: 'Oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭi-vardhanam urvārukam iva bandhanān mṛtyor mukṣīya māmṛtāt',
            meaning: 'We worship the three-eyed One (Shiva) who is fragrant and nourishes all beings. May He liberate us from death for the sake of immortality.'
        },
        benefits: {
            spiritual: ['Protection from untimely death', 'Liberation from cycle of rebirth', 'Divine grace'],
            scientific: ['Significant cortisol reduction', 'Reduced anxiety scores', 'Improved immune response']
        },
        practice: {
            repetitions: [11, 108, 1008],
            bestTime: 'Any time, especially during health crises',
            direction: 'North',
            posture: 'Any comfortable position',
            duration: '20-45 minutes'
        },
        difficulty: 'intermediate',
        featured: true
    },

    // 5. GANESHA MANTRA
    {
        id: 'ganesha',
        name: { sanskrit: 'ॐ गं गणपतये नमः', transliteration: 'Om Gam Ganapataye Namah', english: 'Ganesha Beej Mantra' },
        category: 'deity',
        deity: 'Ganesha',
        source: { text: 'Ganapati Atharvashirsha', reference: 'Purana' },
        rishi: 'Ganaka',
        chandas: 'Gayatri',
        fullText: {
            devanagari: 'ॐ गं गणपतये नमः',
            iast: 'Oṃ gaṃ gaṇapataye namaḥ',
            meaning: 'Salutations to Lord Ganesha, the remover of obstacles.'
        },
        benefits: {
            spiritual: ['Removes obstacles', 'Bestows wisdom', 'New beginnings'],
            scientific: ['Grounding effect on anxiety', 'Heart rate stabilization', 'Focus enhancement']
        },
        practice: {
            repetitions: [21, 108],
            bestTime: 'Before any new venture, Chaturthi',
            direction: 'North-East',
            posture: 'Sukhasana',
            duration: '10-15 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },

    // 6. SHIVA PANCHAKSHARI
    {
        id: 'shiva',
        name: { sanskrit: 'ॐ नमः शिवाय', transliteration: 'Om Namah Shivaya', english: 'The Five-Syllable Mantra' },
        category: 'deity',
        deity: 'Shiva',
        source: { text: 'Shri Rudram', reference: 'Yajurveda' },
        rishi: 'Various',
        chandas: 'Anushtup',
        fullText: {
            devanagari: 'ॐ नमः शिवाय',
            iast: 'Oṃ namaḥ śivāya',
            meaning: 'I bow to Shiva, the auspicious one, the transformer.'
        },
        benefits: {
            spiritual: ['Purification of five elements', 'Inner transformation', 'Liberation'],
            scientific: ['Deep relaxation response', 'Theta brainwave induction', 'Stress reduction']
        },
        practice: {
            repetitions: [108, 1008],
            bestTime: 'Pradosh Kaal, Shivaratri',
            direction: 'North',
            posture: 'Any',
            duration: '15-30 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },

    // 7. VISHNU DVADASAKSHARA
    {
        id: 'vishnu',
        name: { sanskrit: 'ॐ नमो भगवते वासुदेवाय', transliteration: 'Om Namo Bhagavate Vasudevaya', english: 'The Twelve-Syllable Mantra' },
        category: 'deity',
        deity: 'Vishnu/Krishna',
        source: { text: 'Srimad Bhagavatam', reference: 'Purana' },
        rishi: 'Narada',
        chandas: 'Anushtup',
        fullText: {
            devanagari: 'ॐ नमो भगवते वासुदेवाय',
            iast: 'Oṃ namo bhagavate vāsudevāya',
            meaning: 'I bow to Lord Vasudeva (Krishna), the divine one.'
        },
        benefits: {
            spiritual: ['Moksha (liberation)', 'Surrender', 'Divine protection'],
            scientific: ['Parasympathetic activation', 'Emotional regulation', 'Peace induction']
        },
        practice: {
            repetitions: [12, 108, 1008],
            bestTime: 'Ekadashi, Brahma Muhurta',
            direction: 'East',
            posture: 'Padmasana',
            duration: '20-30 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },

    // 8. HARE KRISHNA MAHAMANTRA
    {
        id: 'harekrishna',
        name: { sanskrit: 'हरे कृष्ण महामंत्र', transliteration: 'Hare Krishna Mahamantra', english: 'The Great Chant' },
        category: 'deity',
        deity: 'Krishna/Radha',
        source: { text: 'Kali Santarana Upanishad', reference: 'Vaishnava' },
        rishi: 'Chaitanya Mahaprabhu',
        chandas: 'Free',
        fullText: {
            devanagari: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे',
            iast: 'Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare Hare Rāma Hare Rāma Rāma Rāma Hare Hare',
            meaning: 'O divine energy (Hare), O all-attractive one (Krishna), O source of pleasure (Rama).'
        },
        benefits: {
            spiritual: ['Ecstatic devotion', 'Divine love awakening', 'Liberation'],
            scientific: ['Reduces depression', 'Increases social connectedness', 'Flow state induction']
        },
        practice: {
            repetitions: [108, 1728],
            bestTime: 'Any time',
            direction: 'Any',
            posture: 'Any (can be sung/kirtan)',
            duration: '16 rounds = ~2 hours'
        },
        difficulty: 'beginner',
        featured: false
    },

    // 9. LAKSHMI MANTRA
    {
        id: 'lakshmi',
        name: { sanskrit: 'ॐ श्रीं महालक्ष्म्यै नमः', transliteration: 'Om Shreem Mahalakshmyai Namah', english: 'Lakshmi Beej Mantra' },
        category: 'deity',
        deity: 'Lakshmi',
        source: { text: 'Sri Suktam', reference: 'Rigveda' },
        rishi: 'Ananda',
        chandas: 'Anushtup',
        fullText: {
            devanagari: 'ॐ श्रीं महालक्ष्म्यै नमः',
            iast: 'Oṃ śrīṃ mahālakṣmyai namaḥ',
            meaning: 'Salutations to the great goddess Lakshmi, bestower of prosperity.'
        },
        benefits: {
            spiritual: ['Abundance consciousness', 'Material and spiritual wealth', 'Grace'],
            scientific: ['Positive mindset cultivation', 'Gratitude neural pathways', 'Stress reduction']
        },
        practice: {
            repetitions: [21, 108],
            bestTime: 'Friday, Diwali, Full Moon',
            direction: 'North-East',
            posture: 'Sukhasana',
            duration: '15-20 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },

    // 10. SARASWATI MANTRA
    {
        id: 'saraswati',
        name: { sanskrit: 'ॐ ऐं सरस्वत्यै नमः', transliteration: 'Om Aim Saraswatyai Namah', english: 'Saraswati Beej Mantra' },
        category: 'deity',
        deity: 'Saraswati',
        source: { text: 'Saraswati Stotram', reference: 'Purana' },
        rishi: 'Yajnavalkya',
        chandas: 'Anushtup',
        fullText: {
            devanagari: 'ॐ ऐं सरस्वत्यै नमः',
            iast: 'Oṃ aiṃ sarasvatyai namaḥ',
            meaning: 'Salutations to goddess Saraswati, bestower of knowledge and arts.'
        },
        benefits: {
            spiritual: ['Wisdom', 'Artistic flow', 'Memory enhancement'],
            scientific: ['Learning facilitation', 'Creative neural activation', 'Focus improvement']
        },
        practice: {
            repetitions: [21, 108],
            bestTime: 'Morning, Vasant Panchami',
            direction: 'East',
            posture: 'Sukhasana',
            duration: '10-15 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },

    // 11. DURGA MANTRA
    {
        id: 'durga',
        name: { sanskrit: 'ॐ दुं दुर्गायै नमः', transliteration: 'Om Dum Durgaye Namah', english: 'Durga Beej Mantra' },
        category: 'deity',
        deity: 'Durga',
        source: { text: 'Durga Saptashati', reference: 'Markandeya Purana' },
        rishi: 'Markandeya',
        chandas: 'Anushtup',
        fullText: {
            devanagari: 'ॐ दुं दुर्गायै नमः',
            iast: 'Oṃ duṃ durgāyai namaḥ',
            meaning: 'Salutations to goddess Durga, the invincible one.'
        },
        benefits: {
            spiritual: ['Protection', 'Inner strength', 'Courage'],
            scientific: ['Confidence building', 'Fear reduction', 'Empowerment']
        },
        practice: {
            repetitions: [9, 108],
            bestTime: 'Navratri, Tuesday',
            direction: 'East',
            posture: 'Sukhasana',
            duration: '15-20 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },

    // 12. NAVARNA MANTRA
    {
        id: 'navarna',
        name: { sanskrit: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे', transliteration: 'Om Aim Hreem Kleem', english: 'Nine-Syllable Devi Mantra' },
        category: 'deity',
        deity: 'Chamunda/Devi',
        source: { text: 'Durga Saptashati', reference: 'Tantra' },
        rishi: 'Markandeya',
        chandas: 'Gayatri',
        fullText: {
            devanagari: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
            iast: 'Oṃ aiṃ hrīṃ klīṃ cāmuṇḍāyai vicce',
            meaning: 'Sacred syllables invoking the fierce goddess Chamunda.'
        },
        benefits: {
            spiritual: ['Shakti awakening', 'Protection from negativity', 'Transformation'],
            scientific: ['Energy activation', 'Mental clarity', 'Emotional release']
        },
        practice: {
            repetitions: [9, 108],
            bestTime: 'Navratri, Amavasya',
            direction: 'East',
            posture: 'Padmasana',
            duration: '20-30 minutes'
        },
        difficulty: 'intermediate',
        featured: false
    },

    // 13. SURYA MANTRA
    {
        id: 'surya',
        name: { sanskrit: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', transliteration: 'Om Hraam Hreem Hroum Sah Suryaya Namah', english: 'Surya Beej Mantra' },
        category: 'vedic',
        deity: 'Surya (Sun)',
        source: { text: 'Surya Upanishad', reference: 'Vedic' },
        rishi: 'Surya',
        chandas: 'Gayatri',
        fullText: {
            devanagari: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
            iast: 'Oṃ hrāṃ hrīṃ hrauṃ saḥ sūryāya namaḥ',
            meaning: 'Salutations to the Sun god with sacred seed syllables.'
        },
        benefits: {
            spiritual: ['Vitality', 'Leadership', 'Clarity'],
            scientific: ['Energy boost', 'Vitamin D activation mindset', 'Morning alertness']
        },
        practice: {
            repetitions: [7, 21, 108],
            bestTime: 'Sunrise, Sunday',
            direction: 'East',
            posture: 'Standing or Sukhasana',
            duration: '10-15 minutes'
        },
        difficulty: 'intermediate',
        featured: false
    },

    // 14-19. CHAKRA BEEJ MANTRAS
    {
        id: 'lam',
        name: { sanskrit: 'लं', transliteration: 'Lam', english: 'Root Chakra Seed' },
        category: 'chakra',
        deity: 'Ganesha/Earth Element',
        source: { text: 'Tantra Shastra', reference: 'Chakra System' },
        rishi: 'Various Tantric',
        chandas: 'Beej',
        fullText: {
            devanagari: 'लं',
            iast: 'Laṃ',
            meaning: 'Seed sound for Muladhara (Root) Chakra - grounding and stability.'
        },
        chakra: { name: 'Muladhara', location: 'Base of spine', color: '#FF0000', element: 'Earth' },
        benefits: {
            spiritual: ['Grounding', 'Security', 'Foundation'],
            scientific: ['Reduces anxiety', 'Stabilizes nervous system', 'Body awareness']
        },
        practice: {
            repetitions: [21, 108],
            bestTime: 'Morning',
            direction: 'North',
            posture: 'Sukhasana',
            duration: '5-10 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },
    {
        id: 'vam',
        name: { sanskrit: 'वं', transliteration: 'Vam', english: 'Sacral Chakra Seed' },
        category: 'chakra',
        deity: 'Varuna/Water Element',
        source: { text: 'Tantra Shastra', reference: 'Chakra System' },
        rishi: 'Various Tantric',
        chandas: 'Beej',
        fullText: {
            devanagari: 'वं',
            iast: 'Vaṃ',
            meaning: 'Seed sound for Svadhisthana (Sacral) Chakra - creativity and fluidity.'
        },
        chakra: { name: 'Svadhisthana', location: 'Below navel', color: '#FF7F00', element: 'Water' },
        benefits: {
            spiritual: ['Creativity', 'Emotional flow', 'Pleasure'],
            scientific: ['Emotional release', 'Creative activation', 'Hormonal balance']
        },
        practice: {
            repetitions: [21, 108],
            bestTime: 'Evening',
            direction: 'West',
            posture: 'Sukhasana',
            duration: '5-10 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },
    {
        id: 'ram',
        name: { sanskrit: 'रं', transliteration: 'Ram', english: 'Solar Plexus Seed' },
        category: 'chakra',
        deity: 'Agni/Fire Element',
        source: { text: 'Tantra Shastra', reference: 'Chakra System' },
        rishi: 'Various Tantric',
        chandas: 'Beej',
        fullText: {
            devanagari: 'रं',
            iast: 'Raṃ',
            meaning: 'Seed sound for Manipura (Solar Plexus) Chakra - willpower and transformation.'
        },
        chakra: { name: 'Manipura', location: 'Solar Plexus', color: '#FFFF00', element: 'Fire' },
        benefits: {
            spiritual: ['Willpower', 'Confidence', 'Transformation'],
            scientific: ['Digestive improvement', 'Core strength', 'Self-esteem']
        },
        practice: {
            repetitions: [21, 108],
            bestTime: 'Noon',
            direction: 'South',
            posture: 'Sukhasana',
            duration: '5-10 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },
    {
        id: 'yam',
        name: { sanskrit: 'यं', transliteration: 'Yam', english: 'Heart Chakra Seed' },
        category: 'chakra',
        deity: 'Vayu/Air Element',
        source: { text: 'Tantra Shastra', reference: 'Chakra System' },
        rishi: 'Various Tantric',
        chandas: 'Beej',
        fullText: {
            devanagari: 'यं',
            iast: 'Yaṃ',
            meaning: 'Seed sound for Anahata (Heart) Chakra - love and compassion.'
        },
        chakra: { name: 'Anahata', location: 'Heart center', color: '#00FF00', element: 'Air' },
        benefits: {
            spiritual: ['Unconditional love', 'Compassion', 'Forgiveness'],
            scientific: ['Heart coherence', 'Immune boost', 'Emotional healing']
        },
        practice: {
            repetitions: [21, 108],
            bestTime: 'Any time',
            direction: 'East',
            posture: 'Sukhasana',
            duration: '5-10 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },
    {
        id: 'ham',
        name: { sanskrit: 'हं', transliteration: 'Ham', english: 'Throat Chakra Seed' },
        category: 'chakra',
        deity: 'Akasha/Ether Element',
        source: { text: 'Tantra Shastra', reference: 'Chakra System' },
        rishi: 'Various Tantric',
        chandas: 'Beej',
        fullText: {
            devanagari: 'हं',
            iast: 'Haṃ',
            meaning: 'Seed sound for Vishuddha (Throat) Chakra - expression and truth.'
        },
        chakra: { name: 'Vishuddha', location: 'Throat', color: '#00BFFF', element: 'Ether' },
        benefits: {
            spiritual: ['Authentic expression', 'Truth', 'Communication'],
            scientific: ['Thyroid stimulation', 'Voice clarity', 'Self-expression']
        },
        practice: {
            repetitions: [21, 108],
            bestTime: 'Morning',
            direction: 'Any',
            posture: 'Sukhasana',
            duration: '5-10 minutes'
        },
        difficulty: 'beginner',
        featured: false
    },

    // 20. SHANTI MANTRA
    {
        id: 'sahana',
        name: { sanskrit: 'सहनाववतु', transliteration: 'Sahana Vavatu', english: 'Peace Invocation' },
        category: 'peace',
        deity: 'Universal',
        source: { text: 'Taittiriya Upanishad', reference: 'Krishna Yajurveda' },
        rishi: 'Yajnavalkya',
        chandas: 'Anushtup',
        fullText: {
            devanagari: 'ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै । तेजस्वि नावधीतमस्तु मा विद्विषावहै । ॐ शान्तिः शान्तिः शान्तिः',
            iast: 'Oṃ saha nāvavatu saha nau bhunaktu saha vīryaṃ karavāvahai tejasvi nāvadhītam astu mā vidviṣāvahai oṃ śāntiḥ śāntiḥ śāntiḥ',
            meaning: 'May we be protected together. May we be nourished together. May we work together with great energy. May our study be enlightening. May we not hate each other. Om Peace, Peace, Peace.'
        },
        benefits: {
            spiritual: ['Harmony', 'Unity', 'Peace'],
            scientific: ['Reduces interpersonal conflict', 'Team cohesion', 'Calm mindset']
        },
        practice: {
            repetitions: [1, 3, 11],
            bestTime: 'Beginning of study or work',
            direction: 'Any',
            posture: 'Any',
            duration: '2-5 minutes'
        },
        difficulty: 'beginner',
        featured: false
    }
];

// Helper functions
function getMantrasByCategory(categoryId) {
    return MANTRA_DATABASE.filter(m => m.category === categoryId);
}

function getFeaturedMantras() {
    return MANTRA_DATABASE.filter(m => m.featured);
}

function getMantraById(id) {
    return MANTRA_DATABASE.find(m => m.id === id);
}

function searchMantras(query) {
    const q = query.toLowerCase();
    return MANTRA_DATABASE.filter(m =>
        m.name.sanskrit.includes(query) ||
        m.name.transliteration.toLowerCase().includes(q) ||
        m.name.english.toLowerCase().includes(q) ||
        m.deity.toLowerCase().includes(q)
    );
}
