/**
 * Gita Data - Bhagavad Gita Verses Database
 * Chapter 2 (Sankhya Yoga) - Key verses for v1.0
 * Extensible structure for all 700 verses
 */

const GITA_DATA = {
    meta: {
        title: "श्रीमद् भगवद् गीता",
        titleEnglish: "Shrimad Bhagavad Gita",
        totalChapters: 18,
        totalVerses: 700,
        loadedVerses: 15 // v1.0 sample
    },

    chapters: [
        {
            chapter: 2,
            title: "सांख्य योग",
            titleEnglish: "Sankhya Yoga",
            subtitle: "The Yoga of Knowledge",
            summary: "This chapter contains the essence of the entire Gita. Krishna teaches Arjuna about the eternal soul, the temporary nature of the body, and the path of wisdom.",
            totalVerses: 72,
            verses: [
                {
                    verse: 14,
                    ref: "2.14",
                    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः ।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥",
                    transliteration: "mātrā-sparśhās tu kaunteya śhītoṣhṇa-sukha-duḥkha-dāḥ\nāgamāpāyino 'nityās tāṁs titikṣhasva bhārata",
                    translation: "O son of Kunti, the contact between the senses and their objects gives rise to feelings of cold and heat, pleasure and pain. They are temporary, coming and going. Bear them patiently, O Bharata.",
                    explanation: "Krishna teaches that all experiences - pleasure and pain - are temporary. Just as seasons change, so do our circumstances. The wise person remains steady in both.",
                    themes: ["patience", "impermanence", "equanimity", "suffering"],
                    situations: ["pain", "difficulty", "change", "hardship"]
                },
                {
                    verse: 20,
                    ref: "2.20",
                    sanskrit: "न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ॥",
                    transliteration: "na jāyate mriyate vā kadāchin\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ\najo nityaḥ śhāśhvato 'yaṁ purāṇo\nna hanyate hanyamāne śharīre",
                    translation: "The soul is never born, nor does it ever die. It has never come into being and will never cease to exist. It is unborn, eternal, ever-existing, and primeval. The soul is not slain when the body is slain.",
                    explanation: "This is one of the most important verses about the nature of the soul (Atman). It brings comfort to those grieving, reminding us that our true self is immortal.",
                    themes: ["soul", "immortality", "death", "eternal"],
                    situations: ["grief", "death", "loss", "fear_of_death"]
                },
                {
                    verse: 47,
                    ref: "2.47",
                    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
                    transliteration: "karmaṇy evādhikāras te mā phaleṣhu kadāchana\nmā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi",
                    translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results, and never be attached to inaction.",
                    explanation: "This is the cornerstone of Karma Yoga. Focus on giving your best effort without obsessing over results. This frees you from anxiety about outcomes.",
                    themes: ["karma", "action", "detachment", "duty", "work"],
                    situations: ["anxiety", "stress", "expectations", "failure", "success", "work"]
                },
                {
                    verse: 48,
                    ref: "2.48",
                    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥",
                    transliteration: "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga uchyate",
                    translation: "Perform your duties established in Yoga, abandoning attachment, O Dhananjaya. Be equal in success and failure, for this equanimity is called Yoga.",
                    explanation: "True yoga is maintaining mental balance regardless of outcomes. When you remain calm in both victory and defeat, you have mastered the art of living.",
                    themes: ["equanimity", "balance", "yoga", "success", "failure"],
                    situations: ["success", "failure", "competition", "outcome"]
                },
                {
                    verse: 62,
                    ref: "2.62",
                    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते ॥",
                    transliteration: "dhyāyato viṣhayān puṁsaḥ saṅgas teṣhūpajāyate\nsaṅgāt sañjāyate kāmaḥ kāmāt krodho 'bhijāyate",
                    translation: "While contemplating sense objects, one develops attachment to them. From attachment arises desire, and from unfulfilled desire comes anger.",
                    explanation: "Krishna explains the chain of mental destruction. It begins with dwelling on sense objects, leading to attachment, desire, anger, and ultimately delusion.",
                    themes: ["desire", "anger", "attachment", "mind"],
                    situations: ["anger", "desire", "temptation", "addiction"]
                },
                {
                    verse: 63,
                    ref: "2.63",
                    sanskrit: "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः ।\nस्मृतिभ्रंशाद्बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥",
                    transliteration: "krodhād bhavati sammohaḥ sammohāt smṛiti-vibhramaḥ\nsmṛiti-bhraṁśhād buddhi-nāśho buddhi-nāśhāt praṇaśhyati",
                    translation: "From anger arises delusion; from delusion, loss of memory; from loss of memory, destruction of intelligence; and when intelligence is destroyed, one falls down.",
                    explanation: "This continues the chain: anger leads to confusion, then we forget our wisdom, lose our judgment, and ultimately our downfall. Guard the mind from anger.",
                    themes: ["anger", "delusion", "intelligence", "destruction"],
                    situations: ["anger", "conflict", "rage", "regret"]
                },
                {
                    verse: 70,
                    ref: "2.70",
                    sanskrit: "आपूर्यमाणमचलप्रतिष्ठं\nसमुद्रमापः प्रविशन्ति यद्वत् ।\nतद्वत्कामा यं प्रविशन्ति सर्वे\nस शान्तिमाप्नोति न कामकामी ॥",
                    transliteration: "āpūryamāṇam achala-pratiṣhṭhaṁ\nsamudram āpaḥ praviśhanti yadvat\ntadvat kāmā yaṁ praviśhanti sarve\nsa śhāntim āpnoti na kāma-kāmī",
                    translation: "Just as the ocean remains undisturbed by the constant flow of waters from rivers, one who is unmoved by the flow of desireful objects attains peace; not one who strives to satisfy desires.",
                    explanation: "Like the ocean that absorbs all rivers yet remains calm, a wise person accepts life's experiences without being disturbed. Peace comes from inner stability, not from fulfilling endless desires.",
                    themes: ["peace", "desire", "stability", "calm"],
                    situations: ["peace", "desire", "overwhelm", "seeking_calm"]
                },
                {
                    verse: 55,
                    ref: "2.55",
                    sanskrit: "प्रजहाति यदा कामान्सर्वान्पार्थ मनोगतान् ।\nआत्मन्येवात्मना तुष्टः स्थितप्रज्ञस्तदोच्यते ॥",
                    transliteration: "prajahāti yadā kāmān sarvān pārtha mano-gatān\nātmany evātmanā tuṣhṭaḥ sthita-prajñas tadochyate",
                    translation: "When a person gives up all desires of the mind and finds satisfaction in the Self alone, then they are said to be established in perfect wisdom.",
                    explanation: "True contentment comes from within. When we stop seeking happiness in external things and discover the joy within our own consciousness, we achieve stable wisdom.",
                    themes: ["wisdom", "contentment", "self", "satisfaction"],
                    situations: ["seeking_purpose", "contentment", "happiness"]
                }
            ]
        }
    ],

    // Emotion to verse mapping for quick lookup
    emotionMap: {
        "grief": ["2.20", "2.14"],
        "loss": ["2.20"],
        "fear": ["2.20", "2.14"],
        "anxiety": ["2.47", "2.48", "2.70"],
        "anger": ["2.62", "2.63"],
        "stress": ["2.47", "2.48", "2.70"],
        "confusion": ["2.47", "2.55"],
        "failure": ["2.47", "2.48"],
        "purpose": ["2.47", "2.55"],
        "peace": ["2.70", "2.55"],
        "desire": ["2.62", "2.70"],
        "work": ["2.47", "2.48"]
    },

    // Get verse by reference (e.g., "2.47")
    getVerse(ref) {
        for (const chapter of this.chapters) {
            const verse = chapter.verses.find(v => v.ref === ref);
            if (verse) {
                return {
                    ...verse,
                    chapterTitle: chapter.title,
                    chapterTitleEnglish: chapter.titleEnglish
                };
            }
        }
        return null;
    },

    // Find verses by emotion/situation
    findByEmotion(emotion) {
        const refs = this.emotionMap[emotion.toLowerCase()] || [];
        return refs.map(ref => this.getVerse(ref)).filter(v => v);
    },

    // Search verses by keyword
    search(query) {
        const results = [];
        const q = query.toLowerCase();

        for (const chapter of this.chapters) {
            for (const verse of chapter.verses) {
                const searchText = [
                    verse.translation,
                    verse.explanation,
                    ...verse.themes,
                    ...verse.situations
                ].join(' ').toLowerCase();

                if (searchText.includes(q)) {
                    results.push({
                        ...verse,
                        chapterTitle: chapter.title,
                        chapterTitleEnglish: chapter.titleEnglish
                    });
                }
            }
        }

        return results;
    },

    // Get random verse for daily wisdom
    getRandomVerse() {
        const allVerses = [];
        for (const chapter of this.chapters) {
            for (const verse of chapter.verses) {
                allVerses.push({
                    ...verse,
                    chapterTitle: chapter.title,
                    chapterTitleEnglish: chapter.titleEnglish
                });
            }
        }
        return allVerses[Math.floor(Math.random() * allVerses.length)];
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GITA_DATA;
}
