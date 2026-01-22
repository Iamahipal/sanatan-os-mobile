// Ashtanga Hridayam - Prakriti Quiz Data

const QUIZ_QUESTIONS = [
    {
        question: "What is your body frame like?",
        options: [
            { text: "Thin, light, hard to gain weight", dosha: "vata" },
            { text: "Medium build, athletic", dosha: "pitta" },
            { text: "Large frame, gains weight easily", dosha: "kapha" }
        ]
    },
    {
        question: "How is your skin?",
        options: [
            { text: "Dry, rough, thin, dark", dosha: "vata" },
            { text: "Warm, oily, prone to rashes", dosha: "pitta" },
            { text: "Thick, oily, cool, pale", dosha: "kapha" }
        ]
    },
    {
        question: "How is your hair?",
        options: [
            { text: "Dry, frizzy, thin", dosha: "vata" },
            { text: "Fine, oily, early greying", dosha: "pitta" },
            { text: "Thick, wavy, lustrous", dosha: "kapha" }
        ]
    },
    {
        question: "How do you handle cold weather?",
        options: [
            { text: "I hate it, always feel cold", dosha: "vata" },
            { text: "I prefer cool weather", dosha: "pitta" },
            { text: "Cold doesn't bother me much", dosha: "kapha" }
        ]
    },
    {
        question: "What is your appetite like?",
        options: [
            { text: "Irregular, sometimes skip meals", dosha: "vata" },
            { text: "Strong, get irritable if hungry", dosha: "pitta" },
            { text: "Steady, can skip meals easily", dosha: "kapha" }
        ]
    },
    {
        question: "How is your digestion?",
        options: [
            { text: "Irregular, prone to gas/bloating", dosha: "vata" },
            { text: "Strong, sometimes hyperacidity", dosha: "pitta" },
            { text: "Slow, feel heavy after eating", dosha: "kapha" }
        ]
    },
    {
        question: "How do you sleep?",
        options: [
            { text: "Light, interrupted, insomnia", dosha: "vata" },
            { text: "Moderate, wake feeling rested", dosha: "pitta" },
            { text: "Deep, heavy, hard to wake up", dosha: "kapha" }
        ]
    },
    {
        question: "How do you handle stress?",
        options: [
            { text: "Anxiety, worry, fear", dosha: "vata" },
            { text: "Anger, frustration, irritation", dosha: "pitta" },
            { text: "Withdrawal, depression, attachment", dosha: "kapha" }
        ]
    },
    {
        question: "How is your memory?",
        options: [
            { text: "Quick to learn, quick to forget", dosha: "vata" },
            { text: "Sharp, precise recall", dosha: "pitta" },
            { text: "Slow to learn, never forget", dosha: "kapha" }
        ]
    },
    {
        question: "What activities do you prefer?",
        options: [
            { text: "Creative, artistic, travel", dosha: "vata" },
            { text: "Competitive, challenging, debates", dosha: "pitta" },
            { text: "Relaxing, steady, routine", dosha: "kapha" }
        ]
    }
];

const DOSHA_RESULTS = {
    vata: {
        title: "Vata Prakriti",
        emoji: "💨",
        color: "#5C6BC0",
        description: "You have a Vata-dominant constitution. Vata is composed of Air and Space elements, making you creative, quick-thinking, and energetic. When balanced, you're enthusiastic and adaptable.",
        tips: [
            "Favor warm, cooked, oily foods",
            "Maintain regular routines for sleep and meals",
            "Practice grounding activities like yoga and meditation",
            "Stay warm and avoid cold, dry environments",
            "Use sesame oil for self-massage (Abhyanga)"
        ]
    },
    pitta: {
        title: "Pitta Prakriti",
        emoji: "🔥",
        color: "#EF5350",
        description: "You have a Pitta-dominant constitution. Pitta is composed of Fire and Water elements, making you intelligent, focused, and driven. When balanced, you're a natural leader with sharp intellect.",
        tips: [
            "Favor cooling foods like cucumber, coconut, and mint",
            "Avoid excessive spicy, sour, and salty foods",
            "Practice cooling exercises during hot times",
            "Take breaks to prevent burnout",
            "Use coconut oil for massage"
        ]
    },
    kapha: {
        title: "Kapha Prakriti",
        emoji: "🌊",
        color: "#26A69A",
        description: "You have a Kapha-dominant constitution. Kapha is composed of Water and Earth elements, making you calm, steady, and nurturing. When balanced, you're stable, compassionate, and patient.",
        tips: [
            "Favor light, warm, and spicy foods",
            "Stay active with regular exercise",
            "Wake early and avoid daytime sleep",
            "Embrace change and new experiences",
            "Use mustard or sunflower oil for massage"
        ]
    }
};

if (typeof window !== 'undefined') {
    window.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
    window.DOSHA_RESULTS = DOSHA_RESULTS;
}
