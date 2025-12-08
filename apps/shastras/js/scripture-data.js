/**
 * Scripture Data for Shastras App
 * Contains structure and sample content
 */

const scriptureData = {
    gita: {
        id: 'gita',
        title: 'श्रीमद्भगवद्गीता',
        englishTitle: 'Bhagavad Gita',
        icon: '🪷',
        chapters: 18,
        verses: 700,
        description: 'The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata. It contains a conversation between prince Arjuna and his guide Krishna on a variety of philosophical issues.',
        chapterList: [
            { num: 1, name: 'Arjuna Vishada Yoga', sanskrit: 'अर्जुनविषादयोग', verses: 47, desc: 'The Yoga of Arjuna\'s Dejection' },
            { num: 2, name: 'Sankhya Yoga', sanskrit: 'सांख्ययोग', verses: 72, desc: 'The Yoga of Knowledge' },
            { num: 3, name: 'Karma Yoga', sanskrit: 'कर्मयोग', verses: 43, desc: 'The Yoga of Action' },
            { num: 4, name: 'Jnana Karma Sanyasa Yoga', sanskrit: 'ज्ञानकर्मसंन्यासयोग', verses: 42, desc: 'The Yoga of Renunciation of Action in Knowledge' },
            { num: 5, name: 'Karma Sanyasa Yoga', sanskrit: 'कर्मसंन्यासयोग', verses: 29, desc: 'The Yoga of Renunciation of Action' },
            { num: 6, name: 'Dhyana Yoga', sanskrit: 'ध्यानयोग', verses: 47, desc: 'The Yoga of Meditation' },
            { num: 7, name: 'Jnana Vijnana Yoga', sanskrit: 'ज्ञानविज्ञानयोग', verses: 30, desc: 'The Yoga of Knowledge and Wisdom' },
            { num: 8, name: 'Akshara Brahma Yoga', sanskrit: 'अक्षरब्रह्मयोग', verses: 28, desc: 'The Yoga of the Imperishable Brahman' },
            { num: 9, name: 'Raja Vidya Raja Guhya Yoga', sanskrit: 'राजविद्याराजगुह्ययोग', verses: 34, desc: 'The Yoga of Royal Knowledge and Royal Secret' },
            { num: 10, name: 'Vibhuti Yoga', sanskrit: 'विभूतियोग', verses: 42, desc: 'The Yoga of Divine Glories' },
            { num: 11, name: 'Vishwarupa Darshana Yoga', sanskrit: 'विश्वरूपदर्शनयोग', verses: 55, desc: 'The Yoga of the Vision of the Universal Form' },
            { num: 12, name: 'Bhakti Yoga', sanskrit: 'भक्तियोग', verses: 20, desc: 'The Yoga of Devotion' },
            { num: 13, name: 'Kshetra Kshetrajna Vibhaga Yoga', sanskrit: 'क्षेत्रक्षेत्रज्ञविभागयोग', verses: 35, desc: 'The Yoga of the Field and the Knower of the Field' },
            { num: 14, name: 'Gunatraya Vibhaga Yoga', sanskrit: 'गुणत्रयविभागयोग', verses: 27, desc: 'The Yoga of the Division of Three Gunas' },
            { num: 15, name: 'Purushottama Yoga', sanskrit: 'पुरुषोत्तमयोग', verses: 20, desc: 'The Yoga of the Supreme Person' },
            { num: 16, name: 'Daivasura Sampad Vibhaga Yoga', sanskrit: 'दैवासुरसंपद्विभागयोग', verses: 24, desc: 'The Yoga of the Division Between Divine and Demoniac' },
            { num: 17, name: 'Shraddhatraya Vibhaga Yoga', sanskrit: 'श्रद्धात्रयविभागयोग', verses: 28, desc: 'The Yoga of the Division of Threefold Faith' },
            { num: 18, name: 'Moksha Sanyasa Yoga', sanskrit: 'मोक्षसंन्यासयोग', verses: 78, desc: 'The Yoga of Liberation through Renunciation' }
        ],
        sampleVerses: {
            1: [
                {
                    num: 1,
                    sanskrit: 'धृतराष्ट्र उवाच |\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः |\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||१||',
                    transliteration: 'dhṛtarāṣṭra uvāca | dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ | māmakāḥ pāṇḍavāś caiva kim akurvata sañjaya ||1||',
                    translation: 'Dhritarashtra said: O Sanjaya, what did my sons and the sons of Pandu do when they assembled on the sacred field of Kurukshetra, eager to fight?',
                    commentary: 'The Bhagavad Gita opens with this question from the blind king Dhritarashtra. The word "dharma-kshetra" (field of dharma) is significant - it suggests that this battle is not merely physical but also moral and spiritual.'
                },
                {
                    num: 2,
                    sanskrit: 'सञ्जय उवाच |\nदृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा |\nआचार्यमुपसङ्गम्य राजा वचनमब्रवीत् ||२||',
                    transliteration: 'sañjaya uvāca | dṛṣṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanas tadā | ācāryam upasaṅgamya rājā vacanam abravīt ||2||',
                    translation: 'Sanjaya said: At that time, having seen the Pandava army arrayed in military formation, King Duryodhana approached his teacher Drona and spoke these words.',
                    commentary: 'Duryodhana, seeing the powerful Pandava army, immediately goes to Drona rather than his father Bhishma, the commander. This reveals his insecurity and political maneuvering.'
                }
            ],
            2: [
                {
                    num: 47,
                    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||४७||',
                    transliteration: 'karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi ||47||',
                    translation: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
                    commentary: 'This is one of the most famous verses of the Gita. Krishna teaches the principle of Nishkama Karma - action without attachment to results. This doesn\'t mean indifference to outcomes, but freedom from the anxiety of results.'
                }
            ]
        }
    },
    upanishads: {
        id: 'upanishads',
        title: 'उपनिषद्',
        englishTitle: 'Upanishads',
        icon: '🕯️',
        chapters: 10,
        verses: 500,
        description: 'The Upanishads are late Vedic Sanskrit texts that contain the core philosophical concepts of Hinduism. They are considered the end portion (Vedanta) of the Vedas.',
        chapterList: [
            { num: 1, name: 'Isha Upanishad', sanskrit: 'ईशोपनिषद्', verses: 18, desc: 'The Lord dwells in all' },
            { num: 2, name: 'Kena Upanishad', sanskrit: 'केनोपनिषद्', verses: 35, desc: 'By whom?' },
            { num: 3, name: 'Katha Upanishad', sanskrit: 'कठोपनिषद्', verses: 119, desc: 'Death as teacher' },
            { num: 4, name: 'Prashna Upanishad', sanskrit: 'प्रश्नोपनिषद्', verses: 67, desc: 'Six questions' },
            { num: 5, name: 'Mundaka Upanishad', sanskrit: 'मुण्डकोपनिषद्', verses: 64, desc: 'Higher knowledge' },
            { num: 6, name: 'Mandukya Upanishad', sanskrit: 'माण्डूक्योपनिषद्', verses: 12, desc: 'The syllable Om' },
            { num: 7, name: 'Taittiriya Upanishad', sanskrit: 'तैत्तिरीयोपनिषद्', verses: 31, desc: 'Five sheaths' },
            { num: 8, name: 'Aitareya Upanishad', sanskrit: 'ऐतरेयोपनिषद्', verses: 33, desc: 'Creation' },
            { num: 9, name: 'Chandogya Upanishad', sanskrit: 'छान्दोग्योपनिषद्', verses: 154, desc: 'Tat tvam asi' },
            { num: 10, name: 'Brihadaranyaka Upanishad', sanskrit: 'बृहदारण्यकोपनिषद्', verses: 435, desc: 'The great forest teaching' }
        ]
    },
    vedas: {
        id: 'vedas',
        title: 'वेद',
        englishTitle: 'Vedas',
        icon: '🔱',
        chapters: 4,
        verses: 20000,
        description: 'The Vedas are a large body of religious texts originating in ancient India. They are the oldest scriptures of Hinduism, composed in Vedic Sanskrit.',
        chapterList: [
            { num: 1, name: 'Rigveda', sanskrit: 'ऋग्वेद', verses: 10552, desc: 'Hymns of praise' },
            { num: 2, name: 'Yajurveda', sanskrit: 'यजुर्वेद', verses: 1975, desc: 'Formulas for rituals' },
            { num: 3, name: 'Samaveda', sanskrit: 'सामवेद', verses: 1875, desc: 'Melodies and chants' },
            { num: 4, name: 'Atharvaveda', sanskrit: 'अथर्ववेद', verses: 5977, desc: 'Incantations and spells' }
        ]
    },
    ramayana: {
        id: 'ramayana',
        title: 'रामायण',
        englishTitle: 'Ramayana',
        icon: '🏹',
        chapters: 7,
        verses: 24000,
        description: 'The Ramayana is one of the two major Sanskrit epics of ancient India, attributed to the sage Valmiki. It depicts the journey of Rama, prince of Ayodhya.',
        chapterList: [
            { num: 1, name: 'Bala Kanda', sanskrit: 'बालकाण्ड', verses: 2301, desc: 'Book of Youth' },
            { num: 2, name: 'Ayodhya Kanda', sanskrit: 'अयोध्याकाण्ड', verses: 4183, desc: 'Book of Ayodhya' },
            { num: 3, name: 'Aranya Kanda', sanskrit: 'अरण्यकाण्ड', verses: 2500, desc: 'Book of the Forest' },
            { num: 4, name: 'Kishkindha Kanda', sanskrit: 'किष्किन्धाकाण्ड', verses: 2500, desc: 'Book of Kishkindha' },
            { num: 5, name: 'Sundara Kanda', sanskrit: 'सुन्दरकाण्ड', verses: 2827, desc: 'Book of Beauty' },
            { num: 6, name: 'Yuddha Kanda', sanskrit: 'युद्धकाण्ड', verses: 5692, desc: 'Book of War' },
            { num: 7, name: 'Uttara Kanda', sanskrit: 'उत्तरकाण्ड', verses: 3000, desc: 'Last Book' }
        ]
    },
    mahabharata: {
        id: 'mahabharata',
        title: 'महाभारत',
        englishTitle: 'Mahabharata',
        icon: '⚔️',
        chapters: 18,
        verses: 100000,
        description: 'The Mahabharata is the longest epic poem in the world. It narrates the great war between the Pandavas and Kauravas, containing profound philosophical teachings.',
        chapterList: [
            { num: 1, name: 'Adi Parva', sanskrit: 'आदिपर्व', verses: 7189, desc: 'Book of the Beginning' },
            { num: 2, name: 'Sabha Parva', sanskrit: 'सभापर्व', verses: 2507, desc: 'Book of the Assembly Hall' },
            { num: 3, name: 'Vana Parva', sanskrit: 'वनपर्व', verses: 11664, desc: 'Book of the Forest' },
            { num: 4, name: 'Virata Parva', sanskrit: 'विराटपर्व', verses: 2050, desc: 'Book of Virata' },
            { num: 5, name: 'Udyoga Parva', sanskrit: 'उद्योगपर्व', verses: 6698, desc: 'Book of Effort' },
            { num: 6, name: 'Bhishma Parva', sanskrit: 'भीष्मपर्व', verses: 5884, desc: 'Book of Bhishma' },
            { num: 7, name: 'Drona Parva', sanskrit: 'द्रोणपर्व', verses: 8909, desc: 'Book of Drona' },
            { num: 8, name: 'Karna Parva', sanskrit: 'कर्णपर्व', verses: 4964, desc: 'Book of Karna' },
            { num: 9, name: 'Shalya Parva', sanskrit: 'शल्यपर्व', verses: 3220, desc: 'Book of Shalya' },
            { num: 10, name: 'Sauptika Parva', sanskrit: 'सौप्तिकपर्व', verses: 870, desc: 'Book of the Sleeping Warriors' },
            { num: 11, name: 'Stri Parva', sanskrit: 'स्त्रीपर्व', verses: 775, desc: 'Book of the Women' },
            { num: 12, name: 'Shanti Parva', sanskrit: 'शान्तिपर्व', verses: 14732, desc: 'Book of Peace' },
            { num: 13, name: 'Anushasana Parva', sanskrit: 'अनुशासनपर्व', verses: 8047, desc: 'Book of Instructions' },
            { num: 14, name: 'Ashvamedhika Parva', sanskrit: 'अश्वमेधिकपर्व', verses: 3320, desc: 'Book of the Horse Sacrifice' },
            { num: 15, name: 'Ashramavasika Parva', sanskrit: 'आश्रमवासिकपर्व', verses: 1506, desc: 'Book of the Hermitage' },
            { num: 16, name: 'Mausala Parva', sanskrit: 'मौसलपर्व', verses: 320, desc: 'Book of the Clubs' },
            { num: 17, name: 'Mahaprasthanika Parva', sanskrit: 'महाप्रस्थानिकपर्व', verses: 120, desc: 'Book of the Great Journey' },
            { num: 18, name: 'Svargarohanika Parva', sanskrit: 'स्वर्गारोहणिकपर्व', verses: 209, desc: 'Book of the Ascent to Heaven' }
        ]
    },
    'yoga-sutras': {
        id: 'yoga-sutras',
        title: 'योग सूत्र',
        englishTitle: 'Yoga Sutras',
        icon: '🧘',
        chapters: 4,
        verses: 196,
        description: 'The Yoga Sutras of Patanjali is a collection of Sanskrit sutras on the theory and practice of yoga. It is the foundational text of Raja Yoga.',
        chapterList: [
            { num: 1, name: 'Samadhi Pada', sanskrit: 'समाधिपाद', verses: 51, desc: 'On Contemplation' },
            { num: 2, name: 'Sadhana Pada', sanskrit: 'साधनापाद', verses: 55, desc: 'On Practice' },
            { num: 3, name: 'Vibhuti Pada', sanskrit: 'विभूतिपाद', verses: 56, desc: 'On Powers' },
            { num: 4, name: 'Kaivalya Pada', sanskrit: 'कैवल्यपाद', verses: 34, desc: 'On Liberation' }
        ]
    },
    puranas: {
        id: 'puranas',
        title: 'पुराण',
        englishTitle: 'Puranas',
        icon: '📚',
        chapters: 18,
        verses: 400000,
        description: 'The Puranas are ancient Hindu texts eulogizing various deities, containing cosmogony, mythology, and history. There are 18 Mahapuranas (great puranas).',
        chapterList: [
            { num: 1, name: 'Brahma Purana', sanskrit: 'ब्रह्मपुराण', verses: 10000, desc: 'Creation narratives' },
            { num: 2, name: 'Padma Purana', sanskrit: 'पद्मपुराण', verses: 55000, desc: 'Lotus Purana' },
            { num: 3, name: 'Vishnu Purana', sanskrit: 'विष्णुपुराण', verses: 23000, desc: 'Glory of Vishnu' },
            { num: 4, name: 'Shiva Purana', sanskrit: 'शिवपुराण', verses: 24000, desc: 'Glory of Shiva' },
            { num: 5, name: 'Bhagavata Purana', sanskrit: 'भागवतपुराण', verses: 18000, desc: 'Life of Krishna' },
            { num: 6, name: 'Narada Purana', sanskrit: 'नारदपुराण', verses: 25000, desc: 'Teachings of Narada' },
            { num: 7, name: 'Markandeya Purana', sanskrit: 'मार्कण्डेयपुराण', verses: 9000, desc: 'Contains Devi Mahatmya' },
            { num: 8, name: 'Agni Purana', sanskrit: 'अग्निपुराण', verses: 15400, desc: 'Encyclopedia of knowledge' },
            { num: 9, name: 'Bhavishya Purana', sanskrit: 'भविष्यपुराण', verses: 14500, desc: 'Future prophecies' },
            { num: 10, name: 'Brahmavaivarta Purana', sanskrit: 'ब्रह्मवैवर्तपुराण', verses: 18000, desc: 'Krishna and Radha' }
        ]
    },
    'brahma-sutras': {
        id: 'brahma-sutras',
        title: 'ब्रह्म सूत्र',
        englishTitle: 'Brahma Sutras',
        icon: '🌟',
        chapters: 4,
        verses: 555,
        description: 'The Brahma Sutras synthesize and systematize the philosophical and spiritual ideas in the Upanishads. It is one of the foundational texts of Vedanta.',
        chapterList: [
            { num: 1, name: 'Samanvaya', sanskrit: 'समन्वय', verses: 134, desc: 'Harmony of teachings' },
            { num: 2, name: 'Avirodha', sanskrit: 'अविरोध', verses: 157, desc: 'Non-contradiction' },
            { num: 3, name: 'Sadhana', sanskrit: 'साधन', verses: 185, desc: 'Spiritual practice' },
            { num: 4, name: 'Phala', sanskrit: 'फल', verses: 79, desc: 'Fruits of practice' }
        ]
    }
};

// Daily verses for rotation
const dailyVerses = [
    {
        sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
        translation: 'You have the right to work only, but never to its fruits.',
        source: 'Bhagavad Gita 2.47'
    },
    {
        sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।',
        translation: 'Perform your duty steadfastly, O Arjuna, abandoning all attachment to success or failure.',
        source: 'Bhagavad Gita 2.48'
    },
    {
        sanskrit: 'असतो मा सद्गमय। तमसो मा ज्योतिर्गमय।',
        translation: 'Lead me from the unreal to the real. Lead me from darkness to light.',
        source: 'Brihadaranyaka Upanishad 1.3.28'
    },
    {
        sanskrit: 'ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।',
        translation: 'All this, whatsoever moves in this moving world, is enveloped by the Lord.',
        source: 'Isha Upanishad 1'
    },
    {
        sanskrit: 'सत्यमेव जयते नानृतम्।',
        translation: 'Truth alone triumphs, not falsehood.',
        source: 'Mundaka Upanishad 3.1.6'
    },
    {
        sanskrit: 'अहं ब्रह्मास्मि।',
        translation: 'I am Brahman (the Absolute).',
        source: 'Brihadaranyaka Upanishad 1.4.10'
    },
    {
        sanskrit: 'तत्त्वमसि।',
        translation: 'That thou art.',
        source: 'Chandogya Upanishad 6.8.7'
    }
];

// Export for use
window.scriptureData = scriptureData;
window.dailyVerses = dailyVerses;
