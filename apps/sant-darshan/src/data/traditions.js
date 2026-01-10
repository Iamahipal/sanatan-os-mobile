/**
 * Sant Darshan App - Traditions Data
 * Definitions for the four major spiritual traditions
 */

export const TRADITIONS = {
    hindu: {
        id: 'hindu',
        name: 'Hindu Saints',
        nameHi: 'हिंदू संत',
        icon: '🕉️',
        color: '#E85D04',
        gradient: 'linear-gradient(135deg, #FF9933 0%, #E85D04 100%)',
        description: 'Bhakti poets, Vedantic sages, and devotional masters from across India',
        descriptionHi: 'भारत भर के भक्ति कवि, वेदांतिक ऋषि और भक्ति गुरु'
    },
    sikh: {
        id: 'sikh',
        name: 'Sikh Gurus',
        nameHi: 'सिख गुरु',
        icon: '☬',
        color: '#0077B6',
        gradient: 'linear-gradient(135deg, #00A8E8 0%, #0077B6 100%)',
        description: 'The ten divine teachers who established the Sikh faith',
        descriptionHi: 'दस दिव्य गुरु जिन्होंने सिख धर्म की स्थापना की'
    },
    jain: {
        id: 'jain',
        name: 'Jain Tirthankaras',
        nameHi: 'जैन तीर्थंकर',
        icon: '🙌',
        color: '#D4A574',
        gradient: 'linear-gradient(135deg, #F4D03F 0%, #D4A574 100%)',
        description: 'The 24 ford-makers who taught the path of non-violence and liberation',
        descriptionHi: '24 तीर्थंकर जिन्होंने अहिंसा और मोक्ष का मार्ग सिखाया'
    },
    buddhist: {
        id: 'buddhist',
        name: 'Buddhist Masters',
        nameHi: 'बौद्ध गुरु',
        icon: '☸️',
        color: '#7C5CBF',
        gradient: 'linear-gradient(135deg, #9B59B6 0%, #7C5CBF 100%)',
        description: 'Enlightened teachers who spread the Dharma across Asia',
        descriptionHi: 'प्रबुद्ध गुरु जिन्होंने एशिया में धर्म का प्रसार किया'
    }
};

export const TRADITION_ORDER = ['hindu', 'sikh', 'jain', 'buddhist'];

export default TRADITIONS;
