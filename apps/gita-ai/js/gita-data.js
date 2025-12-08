/**
 * Gita Data - Complete Bhagavad Gita Verses Database
 * Expanded with more chapters for Krishna Vaani
 */

const GITA_DATA = {
    meta: {
        title: "श्रीमद् भगवद् गीता",
        titleEnglish: "Shrimad Bhagavad Gita",
        totalChapters: 18,
        totalVerses: 700,
        loadedVerses: 35
    },

    chapters: [
        // Chapter 1 - Arjuna Vishada Yoga
        {
            chapter: 1,
            title: "अर्जुन विषाद योग",
            titleEnglish: "Arjuna Vishada Yoga",
            subtitle: "The Yoga of Arjuna's Dejection",
            summary: "Arjuna surveys the armies on the battlefield and is overcome with grief at the prospect of fighting his own relatives.",
            totalVerses: 47,
            verses: [
                {
                    verse: 47,
                    ref: "1.47",
                    sanskrit: "एवमुक्त्वार्जुनः सङ्ख्ये रथोपस्थ उपाविशत् ।\nविसृज्य सशरं चापं शोकसंविग्नमानसः ॥",
                    transliteration: "evam uktvārjunaḥ saṅkhye rathopastha upāviśhat\nvisṛijya sa-śharaṁ chāpaṁ śhoka-saṁvigna-mānasaḥ",
                    translation: "Having spoken thus on the battlefield, Arjuna cast aside his bow and arrows, and sat down on the chariot, his mind overwhelmed with grief.",
                    explanation: "This verse shows the depth of Arjuna's crisis. Even the greatest warrior can be overcome by emotional turmoil when facing impossible choices.",
                    themes: ["grief", "crisis", "surrender", "emotion"],
                    situations: ["overwhelmed", "crisis", "giving_up", "emotional_breakdown"]
                }
            ]
        },
        // Chapter 2 - Sankhya Yoga (Expanded)
        {
            chapter: 2,
            title: "सांख्य योग",
            titleEnglish: "Sankhya Yoga",
            subtitle: "The Yoga of Knowledge",
            summary: "This chapter contains the essence of the entire Gita. Krishna teaches about the eternal soul, karma yoga, and the path of wisdom.",
            totalVerses: 72,
            verses: [
                {
                    verse: 11,
                    ref: "2.11",
                    sanskrit: "अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे ।\nगतासूनगतासूंश्च नानुशोचन्ति पण्डिताः ॥",
                    transliteration: "aśhochyān anvaśhochas tvaṁ prajñā-vādānśh cha bhāṣhase\ngatāsūn agatāsūnśh cha nānuśhochanti paṇḍitāḥ",
                    translation: "The wise grieve neither for the living nor for the dead. You speak words of wisdom, yet you grieve for that which is not worthy of grief.",
                    explanation: "Krishna begins His teaching by pointing out the contradiction in Arjuna's behavior. True wisdom means understanding the eternal nature of the soul.",
                    themes: ["wisdom", "grief", "attachment", "knowledge"],
                    situations: ["grief", "loss", "worry", "anxiety"]
                },
                {
                    verse: 14,
                    ref: "2.14",
                    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः ।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥",
                    transliteration: "mātrā-sparśhās tu kaunteya śhītoṣhṇa-sukha-duḥkha-dāḥ\nāgamāpāyino 'nityās tāṁs titikṣhasva bhārata",
                    translation: "The contact of the senses with their objects gives rise to feelings of cold and heat, pleasure and pain. They are temporary. Bear them patiently, O Bharata.",
                    explanation: "All experiences are temporary. The wise person learns to remain steady through both pleasure and pain.",
                    themes: ["patience", "impermanence", "equanimity", "suffering"],
                    situations: ["pain", "difficulty", "change", "hardship"]
                },
                {
                    verse: 20,
                    ref: "2.20",
                    sanskrit: "न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ॥",
                    transliteration: "na jāyate mriyate vā kadāchin\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ\najo nityaḥ śhāśhvato 'yaṁ purāṇo\nna hanyate hanyamāne śharīre",
                    translation: "The soul is never born, nor does it ever die. It is unborn, eternal, ever-existing, and primeval. The soul is not slain when the body is slain.",
                    explanation: "One of the most important verses about the immortality of the soul. Death is only of the body, not of the eternal self.",
                    themes: ["soul", "immortality", "death", "eternal"],
                    situations: ["grief", "death", "loss", "fear_of_death"]
                },
                {
                    verse: 22,
                    ref: "2.22",
                    sanskrit: "वासांसि जीर्णानि यथा विहाय\nनवानि गृह्णाति नरोऽपराणि ।\nतथा शरीराणि विहाय जीर्णा-\nन्यन्यानि संयाति नवानि देही ॥",
                    transliteration: "vāsānsi jīrṇāni yathā vihāya\nnavāni gṛihṇāti naro 'parāṇi\ntathā śharīrāṇi vihāya jīrṇāny\nanyāni saṁyāti navāni dehī",
                    translation: "Just as a person discards old clothes and puts on new ones, the soul discards old bodies and enters new ones.",
                    explanation: "The beautiful metaphor of changing clothes explains reincarnation. Death is merely a transition, not an ending.",
                    themes: ["reincarnation", "soul", "death", "change"],
                    situations: ["death", "fear", "transition", "change"]
                },
                {
                    verse: 47,
                    ref: "2.47",
                    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
                    transliteration: "karmaṇy evādhikāras te mā phaleṣhu kadāchana\nmā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi",
                    translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results, and never be attached to inaction.",
                    explanation: "The cornerstone of Karma Yoga. Focus on your effort, not the outcome. This frees you from anxiety and enables peak performance.",
                    themes: ["karma", "action", "detachment", "duty", "work"],
                    situations: ["anxiety", "stress", "expectations", "failure", "success", "work"]
                },
                {
                    verse: 48,
                    ref: "2.48",
                    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥",
                    transliteration: "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga uchyate",
                    translation: "Perform your duties established in Yoga, abandoning attachment. Be equal in success and failure, for this equanimity is called Yoga.",
                    explanation: "True yoga is mental balance. When you remain calm in victory and defeat, you have mastered the art of living.",
                    themes: ["equanimity", "balance", "yoga", "success", "failure"],
                    situations: ["success", "failure", "competition", "outcome"]
                },
                {
                    verse: 55,
                    ref: "2.55",
                    sanskrit: "प्रजहाति यदा कामान्सर्वान्पार्थ मनोगतान् ।\nआत्मन्येवात्मना तुष्टः स्थितप्रज्ञस्तदोच्यते ॥",
                    transliteration: "prajahāti yadā kāmān sarvān pārtha mano-gatān\nātmany evātmanā tuṣhṭaḥ sthita-prajñas tadochyate",
                    translation: "When a person gives up all desires of the mind and finds satisfaction in the Self alone, then they are said to be established in perfect wisdom.",
                    explanation: "True contentment comes from within. When we discover inner joy, we no longer depend on external things for happiness.",
                    themes: ["wisdom", "contentment", "self", "satisfaction"],
                    situations: ["seeking_purpose", "contentment", "happiness"]
                },
                {
                    verse: 62,
                    ref: "2.62",
                    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते ॥",
                    transliteration: "dhyāyato viṣhayān puṁsaḥ saṅgas teṣhūpajāyate\nsaṅgāt sañjāyate kāmaḥ kāmāt krodho 'bhijāyate",
                    translation: "While contemplating sense objects, one develops attachment. From attachment arises desire, and from unfulfilled desire comes anger.",
                    explanation: "This explains how the mind falls into negative patterns. Attachment leads to desire, desire to anger, and anger to destruction.",
                    themes: ["desire", "anger", "attachment", "mind"],
                    situations: ["anger", "desire", "temptation", "addiction"]
                },
                {
                    verse: 63,
                    ref: "2.63",
                    sanskrit: "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः ।\nस्मृतिभ्रंशाद्बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥",
                    transliteration: "krodhād bhavati sammohaḥ sammohāt smṛiti-vibhramaḥ\nsmṛiti-bhraṁśhād buddhi-nāśho buddhi-nāśhāt praṇaśhyati",
                    translation: "From anger arises delusion; from delusion, loss of memory; from loss of memory, destruction of intelligence; and when intelligence is destroyed, one falls down.",
                    explanation: "The chain of destruction continues. Guard against anger - it leads to confusion, forgetfulness, and ultimately self-destruction.",
                    themes: ["anger", "delusion", "intelligence", "destruction"],
                    situations: ["anger", "conflict", "rage", "regret"]
                },
                {
                    verse: 70,
                    ref: "2.70",
                    sanskrit: "आपूर्यमाणमचलप्रतिष्ठं\nसमुद्रमापः प्रविशन्ति यद्वत् ।\nतद्वत्कामा यं प्रविशन्ति सर्वे\nस शान्तिमाप्नोति न कामकामी ॥",
                    transliteration: "āpūryamāṇam achala-pratiṣhṭhaṁ\nsamudram āpaḥ praviśhanti yadvat\ntadvat kāmā yaṁ praviśhanti sarve\nsa śhāntim āpnoti na kāma-kāmī",
                    translation: "Just as the ocean remains undisturbed by the constant flow of waters from rivers, one who is unmoved by desires attains peace.",
                    explanation: "Like the ocean absorbing all rivers yet remaining calm, a wise person accepts experiences without being disturbed.",
                    themes: ["peace", "desire", "stability", "calm"],
                    situations: ["peace", "desire", "overwhelm", "seeking_calm"]
                }
            ]
        },
        // Chapter 3 - Karma Yoga
        {
            chapter: 3,
            title: "कर्म योग",
            titleEnglish: "Karma Yoga",
            subtitle: "The Yoga of Action",
            summary: "Krishna explains the importance of selfless action and why inaction is not the answer to life's challenges.",
            totalVerses: 43,
            verses: [
                {
                    verse: 19,
                    ref: "3.19",
                    sanskrit: "तस्मादसक्तः सततं कार्यं कर्म समाचर ।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः ॥",
                    transliteration: "tasmād asaktaḥ satataṁ kāryaṁ karma samāchara\nasakto hy ācharan karma param āpnoti pūruṣhaḥ",
                    translation: "Therefore, always perform your duty without attachment. By working without attachment, one attains the Supreme.",
                    explanation: "Work done without selfish motives leads to spiritual liberation. This is the essence of Karma Yoga.",
                    themes: ["karma", "detachment", "duty", "liberation"],
                    situations: ["work", "purpose", "motivation", "success"]
                },
                {
                    verse: 21,
                    ref: "3.21",
                    sanskrit: "यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः ।\nस यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ॥",
                    transliteration: "yad yad ācharati śhreṣhṭhas tat tad evetaro janaḥ\nsa yat pramāṇaṁ kurute lokas tad anuvartate",
                    translation: "Whatever actions a great person performs, common people follow. Whatever standards they set, the world follows.",
                    explanation: "Leaders set examples. Your actions influence others. Be mindful of the example you set.",
                    themes: ["leadership", "example", "influence", "responsibility"],
                    situations: ["leadership", "parenting", "teaching", "responsibility"]
                },
                {
                    verse: 27,
                    ref: "3.27",
                    sanskrit: "प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः ।\nअहङ्कारविमूढात्मा कर्ताहमिति मन्यते ॥",
                    transliteration: "prakṛiteḥ kriyamāṇāni guṇaiḥ karmāṇi sarvaśhaḥ\nahaṅkāra-vimūḍhātmā kartāham iti manyate",
                    translation: "All actions are performed by the modes of nature. But one deluded by ego thinks, 'I am the doer.'",
                    explanation: "The ego creates the illusion of doership. Understanding that nature acts through us brings humility and peace.",
                    themes: ["ego", "nature", "humility", "action"],
                    situations: ["pride", "ego", "control", "stress"]
                }
            ]
        },
        // Chapter 4 - Jnana Karma Sannyasa Yoga
        {
            chapter: 4,
            title: "ज्ञान कर्म संन्यास योग",
            titleEnglish: "Jnana Karma Sannyasa Yoga",
            subtitle: "The Yoga of Knowledge and Renunciation of Action",
            summary: "Krishna reveals the nature of divine incarnation and the power of spiritual knowledge to purify.",
            totalVerses: 42,
            verses: [
                {
                    verse: 7,
                    ref: "4.7",
                    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥",
                    transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata\nabhyutthānam adharmasya tadātmānaṁ sṛijāmyaham",
                    translation: "Whenever there is a decline in righteousness and an increase in unrighteousness, O Arjuna, at that time I manifest myself.",
                    explanation: "Krishna promises divine intervention when evil rises. The Lord always protects dharma.",
                    themes: ["dharma", "avatar", "protection", "divine"],
                    situations: ["injustice", "hope", "faith", "despair"]
                },
                {
                    verse: 8,
                    ref: "4.8",
                    sanskrit: "परित्राणाय साधूनां विनाशाय च दुष्कृताम् ।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥",
                    transliteration: "paritrāṇāya sādhūnāṁ vināśhāya cha duṣhkṛitām\ndharma-sansthāpanārthāya sambhavāmi yuge yuge",
                    translation: "To protect the righteous, destroy the wicked, and establish dharma, I appear in every age.",
                    explanation: "God incarnates to restore balance. Good always ultimately triumphs over evil.",
                    themes: ["protection", "righteousness", "dharma", "divine_help"],
                    situations: ["fear", "injustice", "faith", "hope"]
                },
                {
                    verse: 38,
                    ref: "4.38",
                    sanskrit: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते ।\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति ॥",
                    transliteration: "na hi jñānena sadṛiśhaṁ pavitram iha vidyate\ntat svayaṁ yoga-sansiddhaḥ kālenātmani vindati",
                    translation: "There is nothing as purifying as knowledge in this world. One perfected in yoga finds this knowledge within, in due course of time.",
                    explanation: "Spiritual knowledge is the greatest purifier. Through practice, it reveals itself from within.",
                    themes: ["knowledge", "purification", "yoga", "self-realization"],
                    situations: ["learning", "growth", "confusion", "seeking"]
                }
            ]
        },
        // Chapter 6 - Dhyana Yoga
        {
            chapter: 6,
            title: "ध्यान योग",
            titleEnglish: "Dhyana Yoga",
            subtitle: "The Yoga of Meditation",
            summary: "Krishna teaches the practice of meditation and how to control the restless mind.",
            totalVerses: 47,
            verses: [
                {
                    verse: 5,
                    ref: "6.5",
                    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
                    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
                    translation: "Elevate yourself by your own mind, and do not degrade yourself. The mind can be the friend of the self, and it can also be its enemy.",
                    explanation: "You are your own best friend and worst enemy. Lift yourself up through self-discipline.",
                    themes: ["self-improvement", "mind", "discipline", "willpower"],
                    situations: ["self-doubt", "motivation", "depression", "growth"]
                },
                {
                    verse: 6,
                    ref: "6.6",
                    sanskrit: "बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः ।\nअनात्मनस्तु शत्रुत्वे वर्तेतात्मैव शत्रुवत् ॥",
                    transliteration: "bandhur ātmātmanas tasya yenātmaivātmanā jitaḥ\nanātmanas tu śhatrutve vartetātmaiva śhatru-vat",
                    translation: "For one who has conquered the mind, the mind is the best of friends. But for one who has failed to do so, the mind remains the greatest enemy.",
                    explanation: "A controlled mind serves you. An uncontrolled mind destroys you. Master your mind.",
                    themes: ["mind_control", "self-mastery", "discipline", "peace"],
                    situations: ["anxiety", "overthinking", "distraction", "focus"]
                },
                {
                    verse: 35,
                    ref: "6.35",
                    sanskrit: "असंशयं महाबाहो मनो दुर्निग्रहं चलम् ।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥",
                    transliteration: "asanśhayaṁ mahā-bāho mano durnigrahaṁ chalam\nabhyāsena tu kaunteya vairāgyeṇa cha gṛihyate",
                    translation: "Undoubtedly, O mighty-armed one, the mind is restless and difficult to control. But it can be controlled through practice and detachment.",
                    explanation: "Krishna acknowledges the challenge but provides the solution: consistent practice and non-attachment.",
                    themes: ["mind", "practice", "detachment", "meditation"],
                    situations: ["meditation", "focus", "restlessness", "discipline"]
                }
            ]
        },
        // Chapter 9 - Raja Vidya Raja Guhya Yoga
        {
            chapter: 9,
            title: "राजविद्याराजगुह्य योग",
            titleEnglish: "Raja Vidya Raja Guhya Yoga",
            subtitle: "The Yoga of Royal Knowledge and Royal Secret",
            summary: "Krishna reveals the most confidential knowledge about devotion and His all-pervading nature.",
            totalVerses: 34,
            verses: [
                {
                    verse: 22,
                    ref: "9.22",
                    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते ।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥",
                    transliteration: "ananyāśh chintayanto māṁ ye janāḥ paryupāsate\nteṣhāṁ nityābhiyuktānāṁ yoga-kṣhemaṁ vahāmy aham",
                    translation: "To those who always worship Me with exclusive devotion, thinking of no other, I personally carry what they lack and preserve what they have.",
                    explanation: "Krishna promises to personally take care of His devotees' needs. This is the security of surrender.",
                    themes: ["devotion", "surrender", "protection", "faith"],
                    situations: ["worry", "security", "faith", "surrender"]
                }
            ]
        },
        // Chapter 12 - Bhakti Yoga
        {
            chapter: 12,
            title: "भक्ति योग",
            titleEnglish: "Bhakti Yoga",
            subtitle: "The Yoga of Devotion",
            summary: "Krishna describes the path of devotion and the qualities of His dear devotees.",
            totalVerses: 20,
            verses: [
                {
                    verse: 13,
                    ref: "12.13",
                    sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥",
                    transliteration: "adveṣhṭā sarva-bhūtānāṁ maitraḥ karuṇa eva cha\nnirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣhamī",
                    translation: "One who hates no creature, who is friendly and compassionate, free from possessiveness and ego, balanced in pleasure and pain, and forgiving...",
                    explanation: "These are the qualities of an ideal devotee - compassion, humility, equanimity, and forgiveness.",
                    themes: ["compassion", "forgiveness", "devotion", "humility"],
                    situations: ["relationships", "anger", "forgiveness", "kindness"]
                },
                {
                    verse: 14,
                    ref: "12.14",
                    sanskrit: "सन्तुष्टः सततं योगी यतात्मा दृढनिश्चयः ।\nमय्यर्पितमनोबुद्धिर्यो मद्भक्तः स मे प्रियः ॥",
                    transliteration: "santuṣhṭaḥ satataṁ yogī yatātmā dṛiḍha-niśhchayaḥ\nmayy arpita-mano-buddhir yo mad-bhaktaḥ sa me priyaḥ",
                    translation: "...who is ever content, steady in meditation, self-controlled, with firm conviction, and whose mind and intellect are dedicated to Me - such a devotee is dear to Me.",
                    explanation: "Contentment, self-control, and dedication make one dear to the Lord.",
                    themes: ["contentment", "devotion", "self-control", "dedication"],
                    situations: ["spiritual_growth", "dedication", "focus", "peace"]
                }
            ]
        },
        // Chapter 18 - Moksha Sannyasa Yoga
        {
            chapter: 18,
            title: "मोक्ष संन्यास योग",
            titleEnglish: "Moksha Sannyasa Yoga",
            subtitle: "The Yoga of Liberation and Renunciation",
            summary: "The final chapter summarizes all teachings and reveals the ultimate secret of surrender.",
            totalVerses: 78,
            verses: [
                {
                    verse: 65,
                    ref: "18.65",
                    sanskrit: "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु ।\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे ॥",
                    transliteration: "man-manā bhava mad-bhakto mad-yājī māṁ namaskuru\nmām evaiṣhyasi satyaṁ te pratijāne priyo 'si me",
                    translation: "Fix your mind on Me, be devoted to Me, worship Me, bow to Me. I promise you truly - you will come to Me, for you are dear to Me.",
                    explanation: "Krishna's intimate promise to His devotee. Simply remember Him, love Him, and you will reach Him.",
                    themes: ["devotion", "surrender", "love", "promise"],
                    situations: ["seeking_god", "devotion", "faith", "love"]
                },
                {
                    verse: 66,
                    ref: "18.66",
                    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥",
                    transliteration: "sarva-dharmān parityajya mām ekaṁ śharaṇaṁ vraja\nahaṁ tvāṁ sarva-pāpebhyo mokṣhayiṣhyāmi mā śhuchaḥ",
                    translation: "Abandon all varieties of dharma and simply surrender unto Me alone. I shall liberate you from all sinful reactions; do not fear.",
                    explanation: "The ultimate conclusion of the Gita - complete surrender to Krishna. Let go of everything and trust in Him.",
                    themes: ["surrender", "liberation", "faith", "freedom"],
                    situations: ["surrender", "fear", "guilt", "liberation", "peace"]
                },
                {
                    verse: 78,
                    ref: "18.78",
                    sanskrit: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः ।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ॥",
                    transliteration: "yatra yogeśhvaraḥ kṛiṣhṇo yatra pārtho dhanur-dharaḥ\ntatra śhrīr vijayo bhūtir dhruvā nītir matir mama",
                    translation: "Wherever there is Krishna, the Lord of Yoga, and wherever there is Arjuna, the archer, there will surely be fortune, victory, prosperity, and righteousness.",
                    explanation: "The final verse - where God and His devotee unite, success is guaranteed. Have Krishna in your heart, and victory follows.",
                    themes: ["victory", "success", "devotion", "prosperity"],
                    situations: ["success", "hope", "faith", "new_beginning"]
                }
            ]
        }
    ],

    // Expanded emotion to verse mapping
    emotionMap: {
        "grief": ["2.11", "2.20", "2.22", "2.14"],
        "loss": ["2.20", "2.22"],
        "death": ["2.20", "2.22"],
        "fear": ["2.20", "2.14", "4.7", "4.8", "18.66"],
        "anxiety": ["2.47", "2.48", "2.70", "6.35"],
        "anger": ["2.62", "2.63", "12.13"],
        "stress": ["2.47", "2.48", "2.70", "3.27"],
        "confusion": ["2.47", "2.55", "4.38"],
        "failure": ["2.47", "2.48", "6.5"],
        "purpose": ["2.47", "3.19", "6.5"],
        "peace": ["2.70", "2.55", "6.6", "9.22"],
        "desire": ["2.62", "2.70"],
        "work": ["2.47", "2.48", "3.19"],
        "hope": ["4.7", "4.8", "18.78"],
        "faith": ["9.22", "18.65", "18.66"],
        "surrender": ["18.65", "18.66", "9.22"],
        "leadership": ["3.21"],
        "ego": ["3.27"],
        "meditation": ["6.5", "6.6", "6.35"],
        "forgiveness": ["12.13", "12.14"],
        "depression": ["6.5", "2.14"],
        "motivation": ["6.5", "3.19"]
    },

    // Get verse by reference
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
    },

    // Get all chapters summary
    getChapters() {
        return this.chapters.map(ch => ({
            chapter: ch.chapter,
            title: ch.title,
            titleEnglish: ch.titleEnglish,
            subtitle: ch.subtitle,
            summary: ch.summary,
            verseCount: ch.verses.length
        }));
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GITA_DATA;
}
