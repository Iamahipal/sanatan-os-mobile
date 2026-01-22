// Ashtanga Hridayam - Herb Encyclopedia Data

const HERBS = [
    {
        id: "ashwagandha",
        name: "Ashwagandha",
        name_sanskrit: "अश्वगंधा",
        botanical: "Withania somnifera",
        image: "🌿",
        rasa: "Tikta (Bitter), Kashaya (Astringent)",
        virya: "Ushna (Hot)",
        vipaka: "Madhura (Sweet)",
        dosha: "Balances Vata and Kapha",
        parts_used: "Root",
        properties: ["Adaptogen", "Anti-stress", "Rejuvenative", "Nervine tonic"],
        uses: "Stress relief, energy boost, muscle strength, sleep support, immunity",
        contraindications: "Pregnancy, hyperthyroidism, high Pitta conditions"
    },
    {
        id: "tulsi",
        name: "Tulsi (Holy Basil)",
        name_sanskrit: "तुलसी",
        botanical: "Ocimum sanctum",
        image: "🌱",
        rasa: "Katu (Pungent), Tikta (Bitter)",
        virya: "Ushna (Hot)",
        vipaka: "Katu (Pungent)",
        dosha: "Balances Kapha and Vata",
        parts_used: "Leaves, seeds",
        properties: ["Antimicrobial", "Expectorant", "Carminative", "Adaptogen"],
        uses: "Respiratory health, fever, cough, cold, stress, diabetes",
        contraindications: "May thin blood, avoid before surgery"
    },
    {
        id: "turmeric",
        name: "Turmeric",
        name_sanskrit: "हरिद्रा",
        botanical: "Curcuma longa",
        image: "🧡",
        rasa: "Tikta (Bitter), Katu (Pungent)",
        virya: "Ushna (Hot)",
        vipaka: "Katu (Pungent)",
        dosha: "Balances all three doshas",
        parts_used: "Rhizome",
        properties: ["Anti-inflammatory", "Antioxidant", "Antimicrobial", "Hepatoprotective"],
        uses: "Inflammation, skin conditions, liver health, wound healing, digestive support",
        contraindications: "Gallstones, bile duct obstruction, blood thinners"
    },
    {
        id: "brahmi",
        name: "Brahmi",
        name_sanskrit: "ब्राह्मी",
        botanical: "Bacopa monnieri",
        image: "🧠",
        rasa: "Tikta (Bitter), Kashaya (Astringent)",
        virya: "Shita (Cold)",
        vipaka: "Madhura (Sweet)",
        dosha: "Balances all three doshas",
        parts_used: "Whole plant",
        properties: ["Nootropic", "Nervine", "Sedative", "Cardiotonic"],
        uses: "Memory, concentration, anxiety, epilepsy, hair growth",
        contraindications: "Pregnancy, ulcers, thyroid medications"
    },
    {
        id: "amla",
        name: "Amla (Indian Gooseberry)",
        name_sanskrit: "आमलकी",
        botanical: "Emblica officinalis",
        image: "🫒",
        rasa: "Five tastes (except Lavana)",
        virya: "Shita (Cold)",
        vipaka: "Madhura (Sweet)",
        dosha: "Balances all three doshas, especially Pitta",
        parts_used: "Fruit",
        properties: ["Rasayana", "Antioxidant", "Vitamin C rich", "Digestive"],
        uses: "Immunity, digestion, skin, hair, eyes, anti-aging",
        contraindications: "Diarrhea, low blood sugar"
    },
    {
        id: "ginger",
        name: "Ginger",
        name_sanskrit: "शुण्ठी",
        botanical: "Zingiber officinale",
        image: "🫚",
        rasa: "Katu (Pungent)",
        virya: "Ushna (Hot)",
        vipaka: "Madhura (Sweet)",
        dosha: "Balances Vata and Kapha",
        parts_used: "Rhizome",
        properties: ["Digestive", "Carminative", "Antiemetic", "Anti-inflammatory"],
        uses: "Digestion, nausea, cold, arthritis, circulation",
        contraindications: "Gastritis, bleeding disorders, pregnancy (high doses)"
    },
    {
        id: "neem",
        name: "Neem",
        name_sanskrit: "निम्ब",
        botanical: "Azadirachta indica",
        image: "🌳",
        rasa: "Tikta (Bitter)",
        virya: "Shita (Cold)",
        vipaka: "Katu (Pungent)",
        dosha: "Balances Pitta and Kapha",
        parts_used: "Leaves, bark, oil",
        properties: ["Antibacterial", "Antifungal", "Blood purifier", "Antiparasitic"],
        uses: "Skin diseases, blood purification, dental health, diabetes",
        contraindications: "Pregnancy, infants, autoimmune conditions"
    },
    {
        id: "shatavari",
        name: "Shatavari",
        name_sanskrit: "शतावरी",
        botanical: "Asparagus racemosus",
        image: "🌾",
        rasa: "Madhura (Sweet), Tikta (Bitter)",
        virya: "Shita (Cold)",
        vipaka: "Madhura (Sweet)",
        dosha: "Balances Vata and Pitta",
        parts_used: "Root",
        properties: ["Rasayana", "Galactagogue", "Adaptogen", "Demulcent"],
        uses: "Women's health, hormonal balance, lactation, digestive ulcers",
        contraindications: "Kidney disorders, estrogen-sensitive conditions"
    }
];

if (typeof window !== 'undefined') {
    window.HERBS = HERBS;
}
