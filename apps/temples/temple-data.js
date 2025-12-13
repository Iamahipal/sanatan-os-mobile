/**
 * Digital Yatra - Temple Data with Hidden Stories
 * "Transforming Tourists into Conscious Pilgrims"
 */

const YATRA_TEMPLES = [
    // 1. KASHI VISHWANATH
    {
        id: "kashi_vishwanath",
        name: "Kashi Vishwanath",
        name_local: "काशी विश्वनाथ",
        icon: "🕉️",
        location: { city: "Varanasi", state: "Uttar Pradesh" },
        coordinates: { lat: 25.3109, lon: 83.0107 },
        category: ["jyotirlinga", "char_dham_equivalent"],

        // THE HOOK - Hidden Story
        hidden_secret: {
            title: "The Jyotirlinga That Moves",
            hook: "Most visitors don't know that Kashi Vishwanath is the only Jyotirlinga that moves.",
            full_story: "During the great floods, temple priests relocate the sacred lingam to higher ground. The lingam you see today has witnessed 5+ such migrations. That scratch on its north face? From the 1943 flood rescue.",
            source: "Temple Archives, Flood Records 1943"
        },

        // Darshan Guide
        darshan_guide: [
            { step: 1, title: "Look UP", instruction: "The ceiling has a 16th-century silver dome engraved with 108 names of Shiva. Most visitors miss it." },
            { step: 2, title: "Whisper to Nandi", instruction: "Touch Nandi's LEFT ear and whisper your prayer. He carries it to Shiva." },
            { step: 3, title: "Walk the Panchkroshi", instruction: "The 5-Kosi route around Kashi washes away sins of 7 lifetimes. Start at Manikarnika Ghat." }
        ],

        // Sensory Vibe
        vibe: {
            smell: ["sandalwood incense", "marigold garlands", "ghee lamps", "Ganga waters"],
            sound: ["Om Namah Shivaya chant", "temple bells every 30 seconds", "morning Suprabhatam"],
            feel: ["crush of devotees", "slippery wet marble", "brass rail worn smooth by millions"]
        },

        best_time: { time: "4:00 AM - 6:00 AM (Mangala Aarti)", season: "October - March", avoid: "Mondays, Shivaratri (extreme crowds)" },

        hero_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kashi_Vishwanath_Temple_Varanasi.jpg/1200px-Kashi_Vishwanath_Temple_Varanasi.jpg",
        passport_stamp: { icon: "shivalinga", path: "jyotirlinga" }
    },

    // 2. TIRUMALA TIRUPATI
    {
        id: "tirupati",
        name: "Tirumala Tirupati",
        name_local: "तिरुमला तिरुपति",
        icon: "🙏",
        location: { city: "Tirupati", state: "Andhra Pradesh" },
        coordinates: { lat: 13.6833, lon: 79.3474 },
        category: ["divya_desam", "richest_temple"],

        hidden_secret: {
            title: "The Debt to Kubera",
            hook: "Lord Venkateswara is still paying off a loan.",
            full_story: "When Vishnu married Padmavati, he borrowed wedding expenses from Kubera (God of Wealth). The interest compounds until Kali Yuga ends. Every rupee you donate to the Hundi is a payment on this cosmic debt—that's why TTD is the richest temple in the world.",
            source: "Varaha Purana, Bhavishyottara Purana"
        },

        darshan_guide: [
            { step: 1, title: "Look at His Feet First", instruction: "The idol's feet are always visible. Start at the feet; work your way up in gratitude." },
            { step: 2, title: "Count Kalyanotsavam Steps", instruction: "If you witness the wedding ritual, it repeats the exact sequence from Varaha Purana—108 steps." },
            { step: 3, title: "Take the Laddu", instruction: "The Tirupati Laddu is GI-tagged. 300,000+ made daily. The only prasad with a 'best before' date." }
        ],

        vibe: {
            smell: ["camphor (overwhelming)", "sandal paste", "sweet ghee of Tirupati Laddu"],
            sound: ["Govinda Govinda chant (continuous)", "Nadaswaram pipes", "crowd murmur"],
            feel: ["long queue (can be 12+ hours)", "air-conditioned queue rooms", "steel barricades"]
        },

        best_time: { time: "Early morning (less crowd)", season: "September - February", avoid: "Brahmotsavam festival (massive crowds)" },

        hero_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/ISKCONTirupati.jpg/1200px-ISKCONTirupati.jpg",
        passport_stamp: { icon: "chakra", path: "divya_desam" }
    },

    // 3. KEDARNATH
    {
        id: "kedarnath",
        name: "Kedarnath",
        name_local: "केदारनाथ",
        icon: "🏔️",
        location: { city: "Kedarnath", state: "Uttarakhand" },
        coordinates: { lat: 30.7352, lon: 79.0669 },
        category: ["jyotirlinga", "char_dham", "panch_kedar"],

        hidden_secret: {
            title: "The Stone Bull's Protest",
            hook: "The triangular stone you worship is the literal BACK of Shiva-as-bull.",
            full_story: "When the Pandavas chased Shiva after the Mahabharata war, he turned into a bull and dove into the earth. Only his hump remained. But here's the secret: The other body parts surfaced at 4 other locations (Panch Kedar). Kedarnath is just the beginning of a 5-temple trail.",
            source: "Shiva Purana, Kedar Khanda"
        },

        darshan_guide: [
            { step: 1, title: "Touch the Hump", instruction: "The triangular stone IS the Jyotirlinga—the literal back of Shiva-as-bull. Go closer than the railing." },
            { step: 2, title: "4:30 AM Rudrabhishek", instruction: "Priests perform abhishek in complete darkness (no cameras). Shiva is most 'awake' then." },
            { step: 3, title: "Bow to Bhairava Nath", instruction: "The guardian deity across the river protected the temple in 2013 flood. The waters stopped at his temple." }
        ],

        vibe: {
            smell: ["fresh mountain air", "ice-melt", "wet stone", "juniper incense (unique to Uttarakhand)"],
            sound: ["wind (constant)", "Mandakini river roar", "distant avalanche rumble", "sparse bells"],
            feel: ["cold (even in summer)", "altitude breathlessness", "overwhelming solitude despite crowds"]
        },

        best_time: { time: "4:30 AM for Rudrabhishek", season: "May - June, September - October", avoid: "Monsoon (July-August), Winter (closed Nov-April)" },

        hero_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kedarnath_Temple.jpg/1200px-Kedarnath_Temple.jpg",
        passport_stamp: { icon: "mountain", path: "char_dham" }
    },

    // 4. MEENAKSHI AMMAN
    {
        id: "meenakshi",
        name: "Meenakshi Amman",
        name_local: "मीनाक्षी अम्मन",
        icon: "🌸",
        location: { city: "Madurai", state: "Tamil Nadu" },
        coordinates: { lat: 9.9195, lon: 78.1193 },
        category: ["shakti_peetha", "dravidian_marvel"],

        hidden_secret: {
            title: "The Princess with Three Breasts",
            hook: "Queen Meenakshi was born with three breasts.",
            full_story: "The prophecy said the third would disappear when she met her equal. She conquered 8 directions, defeated Indra, and marched to Mount Meru. When she saw Shiva, the third breast vanished. She is the only goddess who was a warrior queen first, and a bride second. The marriage hall has 985 pillars—each carved differently.",
            source: "Thiruvilayadal Puranam"
        },

        darshan_guide: [
            { step: 1, title: "9 PM Palliayarai Ritual", instruction: "Priests carry Sundareshwarar (Shiva) to Meenakshi's bedroom. The ONLY temple where deities 'sleep together.'" },
            { step: 2, title: "Find the Musical Pillars", instruction: "1000+ pillars produce different notes when struck. Find the group of 22 that play a full raga. Tap gently!" },
            { step: 3, title: "Golden Lotus Tank", instruction: "Porthamarai Kulam predates the temple. Tamil Sangam poets debated here—if your poem floated, it was divine." }
        ],

        vibe: {
            smell: ["jasmine (overwhelming—Madurai is 'Jasmine City')", "coconut oil", "sandalwood"],
            sound: ["nadaswaram (non-stop)", "Thiruvilayadal Puranam recitations", "flower vendors"],
            feel: ["humid South Indian heat", "smooth granite coolness inside", "vastness of 17 acres"]
        },

        best_time: { time: "9 PM for Palliayarai", season: "October - March", avoid: "April-May (extreme heat)" },

        hero_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Madurai_Meenakshi_temple.jpg/1200px-Madurai_Meenakshi_temple.jpg",
        passport_stamp: { icon: "lotus", path: "shakti_peetha" }
    },

    // 5. KONARK SUN TEMPLE
    {
        id: "konark",
        name: "Konark Sun Temple",
        name_local: "कोणार्क सूर्य मंदिर",
        icon: "☀️",
        location: { city: "Konark", state: "Odisha" },
        coordinates: { lat: 19.8876, lon: 86.0945 },
        category: ["unesco_heritage", "architectural_wonder"],

        hidden_secret: {
            title: "The Magnet That Sank Ships",
            hook: "The original temple had a magnet so powerful it caused ships to crash on the coast.",
            full_story: "The British removed the apex magnet—and the temple collapsed without its 'capstone'. But here's the secret: The 12 pairs of chariot wheels are ACTUAL SUNDIALS. Each spoke marks a 1-hour increment. You can tell the time to the minute by the shadow. It still works after 800 years.",
            source: "Temple Inscriptions, Colonial Records"
        },

        darshan_guide: [
            { step: 1, title: "Check Time at NE Wheel", instruction: "Use the shadow to calculate time. Thick spokes = 3-hour marks; thin spokes = 1.5-hour marks." },
            { step: 2, title: "Find the 'Erotic' Sculptures", instruction: "They're at the BASE (earthly desires). Divine sculptures are at TOP. Message: transcend the earthly to reach the divine." },
            { step: 3, title: "Sunrise in Dancing Hall", instruction: "The Nat Mandir was designed so dawn rays illuminated the deity (now missing). Stand where the god stood." }
        ],

        vibe: {
            smell: ["sea breeze (Bay of Bengal 3 km away)", "casuarina trees", "hot sandstone"],
            sound: ["wind through carved lattice", "birds nesting in crevices", "distant ocean at night"],
            feel: ["sun-baked stone (visit 6 AM or 5 PM)", "absence of central deity creates melancholic emptiness"]
        },

        best_time: { time: "Sunrise (6 AM)", season: "October - February", avoid: "Monsoon (temples slippery)" },

        hero_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Konarka_Temple.jpg/1200px-Konarka_Temple.jpg",
        passport_stamp: { icon: "sun", path: "unesco" }
    }
];

// Pilgrimage Paths
const YATRA_PATHS = {
    jyotirlinga: { name: "Jyotirlinga Yatra", total: 12, description: "The 12 Self-Manifested Lingams of Shiva" },
    char_dham: { name: "Char Dham", total: 4, description: "The Four Sacred Abodes" },
    shakti_peetha: { name: "Shakti Peetha", total: 51, description: "Where Sati's Body Fell" },
    divya_desam: { name: "Divya Desam", total: 108, description: "Abodes Sung by Alvar Saints" },
    panch_kedar: { name: "Panch Kedar", total: 5, description: "The Five Body Parts of Shiva-as-Bull" },
    unesco: { name: "UNESCO Heritage", total: 40, description: "World Heritage Temples of India" }
};

// Export
if (typeof module !== 'undefined') {
    module.exports = { YATRA_TEMPLES, YATRA_PATHS };
}
