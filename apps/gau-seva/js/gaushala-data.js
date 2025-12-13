/**
 * Gau Seva - Gaushala & Emergency Contacts Database
 * Data Source: Animal Welfare Board of India (AWBI) & State Goseva Aayogs
 * Last Updated: December 2024
 */

const EMERGENCY_CONTACTS = {
    // Government Services (Pan-India)
    govt: {
        vetAmbulance: '1962',
        police: '112',
        nhaiHighway: '1033',
        description: 'Pashu Dhan Sanjeevani - 29 States'
    },

    // State-wise local names for 1962
    stateServices: {
        'Tamil Nadu': { name: 'AMMA Ambulance', number: '1962' },
        'Gujarat': { name: 'Karuna Ambulance', number: '1962' },
        'Karnataka': { name: 'Pashu Sanjeevini', number: '1962' },
        'Madhya Pradesh': { name: 'Cow Express', number: '1962' },
        'Andhra Pradesh': { name: 'MVU Ambulance', number: '1962' },
        'Telangana': { name: 'Pashu Sanjeevani', number: '1962' },
        'Uttar Pradesh': { name: 'Pashu Dhan Sanjeevani', number: '1962' },
        'Rajasthan': { name: 'Gau Raksha', number: '1962' },
        'Maharashtra': { name: 'Pashu Swasthya Seva', number: '1962' },
        'default': { name: 'Pashu Dhan Sanjeevani', number: '1962' }
    },

    // Verified Gaushalas from AWBI & State Goseva Aayogs
    // Source: awbi.gov.in, gopalanapp.rajasthan.gov.in, mhgosevaayog
    gaushalas: [
        // --- ANDHRA PRADESH (AWBI Verified) ---
        {
            id: 'AP016',
            name: 'Visakha Society for Protection and Care of Animals',
            state: 'Andhra Pradesh',
            city: 'Visakhapatnam',
            district: 'Visakhapatnam',
            address: '26-15-200, Main Road, Visakhapatnam, AP - 530001',
            pincode: '530001',
            phone: '0891-2564759',
            whatsapp: null,
            type: 'NGO',
            verified: true,
            source: 'AWBI',
            geo: { lat: 17.6868, lng: 83.2185 }
        },

        // --- GUJARAT (State Registered) ---
        {
            id: 'GJ015',
            name: 'Shri Amreli Gaushala Panjrapole',
            state: 'Gujarat',
            city: 'Amreli',
            district: 'Amreli',
            address: 'Gandhi Chowk, Amreli, Gujarat - 365601',
            pincode: '365601',
            phone: null,
            whatsapp: null,
            type: 'Trust',
            verified: true,
            source: 'Gujarat Goseva Aayog',
            geo: { lat: 21.6032, lng: 71.2217 }
        },

        // --- MAHARASHTRA (Maha Goseva Aayog) ---
        {
            id: 'MHGA00186',
            name: 'Gopal Gauraksha Anand Ashram',
            state: 'Maharashtra',
            city: 'Sengaon',
            district: 'Hingoli',
            address: 'At Post Bamni Kedi, Taluka Sengaon, Dist Hingoli',
            pincode: '431542',
            phone: null,
            whatsapp: null,
            type: 'Registered',
            verified: true,
            source: 'Maharashtra Goseva Aayog',
            geo: { lat: 19.7027, lng: 76.9298 }
        },

        // --- RAJASTHAN (Gopalan Dept Verified) ---
        {
            id: 'RJ-AJM-001',
            name: 'Shri Madnesh Goshala',
            state: 'Rajasthan',
            city: 'Kishangarh',
            district: 'Ajmer',
            address: 'Madanganj, Kishangarh, Dist Ajmer, Rajasthan',
            pincode: '305801',
            phone: '01463-251591',
            whatsapp: null,
            type: 'Trust',
            verified: true,
            source: 'Rajasthan Gopalan Dept',
            geo: { lat: 26.5786, lng: 74.8569 }
        },
        {
            id: 'RJ-JOD-157',
            name: 'Shree Ratnesh Gaushala Samiti',
            state: 'Rajasthan',
            city: 'Shekhala',
            district: 'Jodhpur',
            address: 'Kanodiya Purohitan, Shekhala, Jodhpur',
            pincode: '342001',
            phone: null,
            whatsapp: '919149678510', // Verified from HelpGaushala
            type: 'Samiti',
            verified: true,
            source: 'HelpGaushala',
            capacity: 585,
            geo: { lat: 26.2389, lng: 73.0243 }
        },

        // --- UTTAR PRADESH (Vrindavan) ---
        {
            id: 'UP-MTH-001',
            name: 'Shri Krishna Gaushala',
            state: 'Uttar Pradesh',
            city: 'Vrindavan',
            district: 'Mathura',
            address: 'Near Banke Bihari Temple, Vrindavan',
            pincode: '281121',
            phone: null,
            whatsapp: null, // Need to verify
            type: 'Trust',
            verified: false,
            source: 'Manual Entry',
            capacity: 450,
            geo: { lat: 27.5800, lng: 77.6964 }
        },

        // --- DELHI ---
        {
            id: 'DL-001',
            name: 'Delhi Gaushala Society',
            state: 'Delhi',
            city: 'Delhi',
            district: 'Central Delhi',
            address: 'Azadpur, Delhi',
            pincode: '110033',
            phone: null,
            whatsapp: null,
            type: 'Society',
            verified: false,
            source: 'Manual Entry',
            geo: { lat: 28.7041, lng: 77.1025 }
        }
    ]
};

/**
 * Find nearest Gaushala using Haversine distance formula
 */
function findNearestGaushala(userLat, userLng, state) {
    const gaushalas = EMERGENCY_CONTACTS.gaushalas;

    // If we have GPS coordinates, find by distance
    if (userLat && userLng) {
        let nearest = null;
        let minDist = Infinity;

        gaushalas.forEach(g => {
            if (g.geo && g.geo.lat && g.geo.lng) {
                const dist = haversineDistance(userLat, userLng, g.geo.lat, g.geo.lng);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = { ...g, distance: dist };
                }
            }
        });

        if (nearest) return nearest;
    }

    // Fallback: Try state match
    if (state) {
        const stateMatch = gaushalas.find(g =>
            g.state.toLowerCase() === state.toLowerCase() && g.verified
        );
        if (stateMatch) return stateMatch;
    }

    // Fallback: Return first verified with WhatsApp
    const withWhatsapp = gaushalas.find(g => g.whatsapp && g.verified);
    if (withWhatsapp) return withWhatsapp;

    // Last resort: First verified
    return gaushalas.find(g => g.verified) || gaushalas[0];
}

/**
 * Haversine formula to calculate distance between two GPS points
 * Returns distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Get state-specific service name for 1962
 */
function getStateServiceName(state) {
    return EMERGENCY_CONTACTS.stateServices[state] ||
        EMERGENCY_CONTACTS.stateServices.default;
}

/**
 * Get all Gaushalas in a state
 */
function getGaushalasByState(state) {
    return EMERGENCY_CONTACTS.gaushalas.filter(g =>
        g.state.toLowerCase() === state.toLowerCase()
    );
}

// Export for use
window.EMERGENCY_CONTACTS = EMERGENCY_CONTACTS;
window.findNearestGaushala = findNearestGaushala;
window.getStateServiceName = getStateServiceName;
window.getGaushalasByState = getGaushalasByState;
