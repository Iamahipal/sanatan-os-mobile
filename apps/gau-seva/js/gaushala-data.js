/**
 * Gau Seva - Gaushala & Emergency Contacts Database
 * State-wise routing for cow rescue
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
        'default': { name: 'Pashu Dhan Sanjeevani', number: '1962' }
    },

    // Verified Gaushalas (seed data - expand as needed)
    gaushalas: [
        {
            id: 'VRN001',
            name: 'Shri Krishna Gaushala',
            city: 'Vrindavan',
            state: 'Uttar Pradesh',
            pincode: '281121',
            whatsapp: '919876543210', // Replace with real number
            verified: true,
            cows: 450
        },
        {
            id: 'NGP001',
            name: 'Kamdhenu Gau Gram',
            city: 'Nagpur',
            state: 'Maharashtra',
            pincode: '440001',
            whatsapp: '919876543211', // Replace with real number
            verified: true,
            cows: 280
        },
        {
            id: 'AHM001',
            name: 'Shree Gau Seva Trust',
            city: 'Ahmedabad',
            state: 'Gujarat',
            pincode: '380001',
            whatsapp: '919876543212', // Replace with real number
            verified: true,
            cows: 350
        },
        {
            id: 'JRP001',
            name: 'Hingonia Gaushala',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302001',
            whatsapp: '919876543213', // Replace with real number
            verified: true,
            cows: 15000 // One of India's largest
        },
        {
            id: 'DEL001',
            name: 'Delhi Gaushala Society',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            whatsapp: '919876543214', // Replace with real number
            verified: true,
            cows: 200
        }
    ],

    // NGO Backup contacts (when 1962 is busy)
    ngos: [
        {
            name: 'People For Animals (PFA)',
            city: 'Delhi',
            phone: '9810088tried', // Replace
            website: 'peopleforanimalsindia.org'
        }
    ]
};

/**
 * Find nearest Gaushala by pincode prefix or state
 */
function findNearestGaushala(pincode, state) {
    const pincodePrefix = pincode ? pincode.substring(0, 3) : null;

    // Try exact pincode match first
    let match = EMERGENCY_CONTACTS.gaushalas.find(g => g.pincode === pincode);

    // Then try pincode prefix (same district)
    if (!match && pincodePrefix) {
        match = EMERGENCY_CONTACTS.gaushalas.find(g =>
            g.pincode.startsWith(pincodePrefix)
        );
    }

    // Then try state match
    if (!match && state) {
        match = EMERGENCY_CONTACTS.gaushalas.find(g =>
            g.state.toLowerCase() === state.toLowerCase()
        );
    }

    // Return default (first verified) if no match
    return match || EMERGENCY_CONTACTS.gaushalas[0];
}

/**
 * Get state-specific service name for 1962
 */
function getStateServiceName(state) {
    return EMERGENCY_CONTACTS.stateServices[state] ||
        EMERGENCY_CONTACTS.stateServices.default;
}

// Export for use
window.EMERGENCY_CONTACTS = EMERGENCY_CONTACTS;
window.findNearestGaushala = findNearestGaushala;
window.getStateServiceName = getStateServiceName;
