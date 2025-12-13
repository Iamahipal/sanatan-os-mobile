/**
 * Gau Seva - Gaushala & Emergency Contacts Database
 * Data Source: Verified from official websites, AWBI, State Goseva Aayogs
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
        'Haryana': { name: 'Gau Seva Aayog', number: '1962' },
        'default': { name: 'Pashu Dhan Sanjeevani', number: '1962' }
    },

    // Verified Gaushalas with REAL contact numbers
    // Sources: Official websites, helpgaushala.com, AWBI
    gaushalas: [
        // --- DELHI (24/7 Ambulance) ---
        {
            id: 'DL-KMP-001',
            name: 'Kamdhenu Mangal Parivar',
            state: 'Delhi',
            city: 'Delhi',
            district: 'Central Delhi',
            address: 'Delhi NCR Region',
            pincode: '110001',
            phone: '7503777888',
            whatsapp: '917503777888', // 24/7 Cow Ambulance
            type: 'NGO',
            verified: true,
            source: 'voicelessindia.org',
            features: ['24/7', 'Ambulance', 'Doctor on board'],
            geo: { lat: 28.6139, lng: 77.2090 }
        },
        {
            id: 'DL-SGACC-001',
            name: 'Sanjay Gandhi Animal Care Centre',
            state: 'Delhi',
            city: 'Delhi',
            district: 'Delhi',
            address: 'Raja Garden, New Delhi',
            pincode: '110015',
            phone: '9560802425',
            whatsapp: '919560802425',
            type: 'Hospital',
            verified: true,
            source: 'sanjaygandhianimalcarecentre.org',
            features: ['Hospital', 'Surgery', 'Shelter'],
            geo: { lat: 28.6519, lng: 77.1169 }
        },

        // --- TAMIL NADU (Chennai) ---
        {
            id: 'TN-CHN-001',
            name: 'Blue Cross of India',
            state: 'Tamil Nadu',
            city: 'Chennai',
            district: 'Chennai',
            address: 'Velachery, Chennai',
            pincode: '600042',
            phone: '9962998886',
            whatsapp: '919962998886', // Click to Rescue WhatsApp
            type: 'NGO',
            verified: true,
            source: 'bluecrossofindia.org',
            features: ['WhatsApp Rescue', 'Hospital', 'Shelter'],
            geo: { lat: 13.0067, lng: 80.2206 }
        },

        // --- RAJASTHAN (Jaipur) ---
        {
            id: 'RJ-JAI-001',
            name: 'TOLFA - Tree of Life for Animals',
            state: 'Rajasthan',
            city: 'Jaipur',
            district: 'Jaipur',
            address: 'Bassi Road, Jaipur',
            pincode: '303012',
            phone: '9829965585',
            whatsapp: '919829965585', // WhatsApp for rescue assessment
            type: 'NGO',
            verified: true,
            source: 'tolfa.in',
            features: ['8am-5pm', 'WhatsApp Assessment', 'Rescue'],
            geo: { lat: 26.8469, lng: 75.8124 }
        },
        {
            id: 'RJ-JAI-002',
            name: 'Help in Suffering',
            state: 'Rajasthan',
            city: 'Jaipur',
            district: 'Jaipur',
            address: 'Maharani Farm, Jaipur',
            pincode: '302019',
            phone: '8107299711',
            whatsapp: '918107299711',
            type: 'NGO',
            verified: true,
            source: 'helpinsuffering.org',
            features: ['Hospital', 'Rescue', 'Rehabilitation'],
            geo: { lat: 26.8866, lng: 75.7890 }
        },
        {
            id: 'RJ-JOD-001',
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
            source: 'helpgaushala.com',
            capacity: 585,
            geo: { lat: 26.2389, lng: 73.0243 }
        },

        // --- UTTAR PRADESH (Mathura/Vrindavan) ---
        {
            id: 'UP-MTH-001',
            name: 'Shri Mataji Gaushala',
            state: 'Uttar Pradesh',
            city: 'Barsana',
            district: 'Mathura',
            address: 'Barsana, Mathura, UP',
            pincode: '281405',
            phone: '9927338666',
            whatsapp: '919927338666', // Primary rescue line
            type: 'Trust',
            verified: true,
            source: 'matajigaushala.org',
            features: ['Rescue', 'Care', 'Support'],
            geo: { lat: 27.6500, lng: 77.3800 }
        },

        // --- MAHARASHTRA (Nagpur) ---
        {
            id: 'MH-NGP-001',
            name: 'Gaushala Pashupalan Sanstha',
            state: 'Maharashtra',
            city: 'Nagpur',
            district: 'Nagpur',
            address: 'Nagpur, Maharashtra',
            pincode: '440001',
            phone: '9325103104',
            whatsapp: '919325103104',
            type: 'Trust',
            verified: true,
            source: 'goushalanagpur.com',
            features: ['AWBI Registered', 'Rescue'],
            geo: { lat: 21.1458, lng: 79.0882 }
        },

        // --- NATIONAL (Gau Chikitsa) ---
        {
            id: 'NAT-GC-001',
            name: 'Gau Chikitsa (National Helpline)',
            state: 'All India',
            city: 'National',
            district: 'All India',
            address: 'Pan-India Service',
            pincode: '000000',
            phone: '8003470108',
            whatsapp: '918003470108',
            type: 'National NGO',
            verified: true,
            source: 'gauchikitsa.org',
            features: ['National', 'Helpline', 'Guidance'],
            geo: null
        },

        // --- HARYANA (Government) ---
        {
            id: 'HR-GOV-001',
            name: 'Haryana Gau Seva Aayog',
            state: 'Haryana',
            city: 'Chandigarh',
            district: 'Chandigarh',
            address: 'SCO 17-19, Sector 17-C, Chandigarh',
            pincode: '160017',
            phone: '0172-2992817',
            whatsapp: null, // Government office, no WhatsApp
            type: 'Government',
            verified: true,
            source: 'hargauseva.gov.in',
            features: ['Government', 'Policy', 'Coordination'],
            geo: { lat: 30.7333, lng: 76.7794 }
        }
    ]
};

/**
 * Find nearest Gaushala using Haversine distance formula
 * Priority: GPS distance > State match > WhatsApp availability
 */
function findNearestGaushala(userLat, userLng, state) {
    const gaushalas = EMERGENCY_CONTACTS.gaushalas;

    // Filter only those with WhatsApp for rescue
    const withWhatsapp = gaushalas.filter(g => g.whatsapp && g.verified);

    // If we have GPS coordinates, find by distance
    if (userLat && userLng) {
        let nearest = null;
        let minDist = Infinity;

        withWhatsapp.forEach(g => {
            if (g.geo && g.geo.lat && g.geo.lng) {
                const dist = haversineDistance(userLat, userLng, g.geo.lat, g.geo.lng);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = { ...g, distance: Math.round(dist) };
                }
            }
        });

        // Return nearest if within 200km, otherwise try state match
        if (nearest && minDist < 200) return nearest;
    }

    // Try state match
    if (state) {
        const stateMatch = withWhatsapp.find(g =>
            g.state.toLowerCase() === state.toLowerCase()
        );
        if (stateMatch) return stateMatch;
    }

    // Fallback to National helpline (Gau Chikitsa)
    const national = withWhatsapp.find(g => g.id === 'NAT-GC-001');
    if (national) return national;

    // Last resort: First verified with WhatsApp
    return withWhatsapp[0] || gaushalas[0];
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

/**
 * Get count of verified Gaushalas with WhatsApp
 */
function getVerifiedGaushalaCount() {
    return EMERGENCY_CONTACTS.gaushalas.filter(g => g.whatsapp && g.verified).length;
}

// Export functions
window.EMERGENCY_CONTACTS = EMERGENCY_CONTACTS;
window.findNearestGaushala = findNearestGaushala;
window.getStateServiceName = getStateServiceName;
window.getGaushalasByState = getGaushalasByState;
window.getVerifiedGaushalaCount = getVerifiedGaushalaCount;
