// Ashtanga Hridayam - Sample Remedy Database
// This data will be expanded with actual content from the book

const REMEDIES = [
    {
        id: "triphala",
        name: "Triphala Churna",
        name_sanskrit: "त्रिफला चूर्ण",
        emoji: "🌿",
        symptoms: ["constipation", "digestion", "eye health", "detox", "weight"],
        dosha: ["vata", "pitta", "kapha"],
        ingredients: ["Amalaki (Amla)", "Bibhitaki", "Haritaki"],
        instructions: "Take 1 teaspoon with warm water before bedtime. For eye wash, soak overnight and strain in the morning.",
        benefits: "Balances all three doshas, cleanses the digestive tract, supports healthy digestion and elimination.",
        source: "Sutrasthana, Chapter 6"
    },
    {
        id: "ashwagandha",
        name: "Ashwagandha",
        name_sanskrit: "अश्वगंधा",
        emoji: "🍃",
        symptoms: ["stress", "anxiety", "fatigue", "weakness", "sleep", "immunity"],
        dosha: ["vata", "kapha"],
        ingredients: ["Ashwagandha root powder"],
        instructions: "Take ½ to 1 teaspoon with warm milk or ghee, preferably at night.",
        benefits: "Reduces stress and anxiety, improves energy and stamina, supports restful sleep.",
        source: "Chikitsasthana, Chapter 3"
    },
    {
        id: "trikatu",
        name: "Trikatu Churna",
        name_sanskrit: "त्रिकटु चूर्ण",
        emoji: "🌶️",
        symptoms: ["cold", "cough", "congestion", "metabolism", "appetite"],
        dosha: ["kapha", "vata"],
        ingredients: ["Black Pepper (Maricha)", "Long Pepper (Pippali)", "Ginger (Shunti)"],
        instructions: "Take ¼ to ½ teaspoon with honey before meals.",
        benefits: "Kindles digestive fire, clears respiratory congestion, boosts metabolism.",
        source: "Sutrasthana, Chapter 15"
    },
    {
        id: "brahmi",
        name: "Brahmi",
        name_sanskrit: "ब्राह्मी",
        emoji: "🧠",
        symptoms: ["memory", "concentration", "anxiety", "mental clarity", "hair"],
        dosha: ["pitta", "vata", "kapha"],
        ingredients: ["Brahmi (Bacopa monnieri) leaves or powder"],
        instructions: "Take 1 teaspoon powder with ghee or honey. For hair, apply brahmi oil.",
        benefits: "Enhances memory and concentration, calms the mind, promotes hair growth.",
        source: "Uttarasthana, Chapter 6"
    },
    {
        id: "hingvastak",
        name: "Hingvastak Churna",
        name_sanskrit: "हिंग्वाष्टक चूर्ण",
        emoji: "💨",
        symptoms: ["bloating", "gas", "indigestion", "stomach pain", "vata"],
        dosha: ["vata"],
        ingredients: ["Hing (Asafoetida)", "Cumin", "Black Cumin", "Ajwain", "Black Pepper", "Pippali", "Ginger", "Rock Salt"],
        instructions: "Take ½ teaspoon with warm water or buttermilk after meals.",
        benefits: "Relieves bloating and gas, improves digestion, balances Vata in the digestive system.",
        source: "Chikitsasthana, Chapter 14"
    },
    {
        id: "chyawanprash",
        name: "Chyawanprash",
        name_sanskrit: "च्यवनप्राश",
        emoji: "🍯",
        symptoms: ["immunity", "energy", "weakness", "respiratory", "anti-aging"],
        dosha: ["vata", "pitta", "kapha"],
        ingredients: ["Amla", "Ghee", "Honey", "40+ herbs including Ashwagandha, Pippali, Cardamom"],
        instructions: "Take 1-2 teaspoons daily, preferably in the morning with warm milk.",
        benefits: "Boosts immunity, increases vitality, supports respiratory health, rejuvenates the body.",
        source: "Chikitsasthana, Chapter 1"
    },
    {
        id: "sitopaladi",
        name: "Sitopaladi Churna",
        name_sanskrit: "सितोपलादि चूर्ण",
        emoji: "🤧",
        symptoms: ["cough", "cold", "fever", "respiratory", "sore throat"],
        dosha: ["pitta", "kapha"],
        ingredients: ["Mishri (Rock Sugar)", "Vanshlochan", "Pippali", "Cardamom", "Cinnamon"],
        instructions: "Take ½ to 1 teaspoon with honey 2-3 times daily.",
        benefits: "Relieves cough and cold symptoms, soothes sore throat, reduces fever.",
        source: "Chikitsasthana, Chapter 3"
    },
    {
        id: "dashamoola",
        name: "Dashamoola",
        name_sanskrit: "दशमूल",
        emoji: "🌳",
        symptoms: ["pain", "inflammation", "arthritis", "joint pain", "vata disorders"],
        dosha: ["vata"],
        ingredients: ["Ten roots: Bilva, Agnimantha, Shyonaka, Patala, Gambhari, Brihati, Kantakari, Shalaparni, Prishniparni, Gokshura"],
        instructions: "Take as decoction (kashaya) or in ghrita (medicated ghee) form as directed.",
        benefits: "Reduces inflammation, relieves pain, balances Vata, supports nervous system.",
        source: "Sutrasthana, Chapter 15"
    }
];

// Export for use in app.js
if (typeof window !== 'undefined') {
    window.REMEDIES = REMEDIES;
}
