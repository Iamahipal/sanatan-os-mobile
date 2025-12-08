/**
 * Live Darshan App - JavaScript
 * All pilgrimage categories with YouTube channel data
 */

document.addEventListener('DOMContentLoaded', () => {
    // === TEMPLE DATA ===
    const CATEGORIES = [
        { id: 'all', name: 'All', icon: '🕉️' },
        { id: 'jyotirlinga', name: '12 Jyotirlinga', icon: '🔱' },
        { id: 'chardham', name: 'Char Dham', icon: '🛕' },
        { id: 'chotachardham', name: 'Chota Char Dham', icon: '⛰️' },
        { id: 'saptapuri', name: 'Sapta Puri', icon: '🏛️' },
        { id: 'panchkedar', name: 'Panch Kedar', icon: '🏔️' },
        { id: 'panchbadri', name: 'Panch Badri', icon: '🙏' },
        { id: 'shaktipeetha', name: 'Shakti Peetha', icon: '🔴' },
        { id: 'shankaracharya', name: '4 Math', icon: '📿' },
        { id: 'divyadesam', name: 'Divya Desam', icon: '🪷' },
        { id: 'ashtavinayak', name: 'Ashtavinayak', icon: '🐘' },
        { id: 'kumbh', name: 'Kumbh Cities', icon: '💧' },
        { id: 'iskcon', name: 'ISKCON', icon: '🙏' },
        { id: 'historic', name: 'Historic', icon: '🏛️' }
    ];

    const TEMPLES = [
        // === 12 JYOTIRLINGA ===
        { name: 'Somnath', location: 'Veraval, Gujarat', category: 'jyotirlinga', youtube: '@SomnathTempleOfficial', channelId: 'UCqKSfpFkJmNQMyVZmZLMLBg', hasLive: true, icon: '🔱' },
        { name: 'Mallikarjuna', location: 'Srisailam, AP', category: 'jyotirlinga', youtube: '@SrisailaTV', channelId: 'UCqK7cM4AYTxQFjhZhXJqCqg', hasLive: true, icon: '🔱' },
        { name: 'Mahakaleshwar', location: 'Ujjain, MP', category: 'jyotirlinga', youtube: '@mahakaleshwarujjain', channelId: 'UCvQ7iV1qfqJrqDAKNYTaHPw', hasLive: true, icon: '🔱' },
        { name: 'Omkareshwar', location: 'Khandwa, MP', category: 'jyotirlinga', youtube: '@ShriOmkareshwarJyotirlingaOfficial', channelId: null, hasLive: true, icon: '🔱' },
        { name: 'Kedarnath', location: 'Uttarakhand', category: 'jyotirlinga', youtube: null, channelId: null, hasLive: false, icon: '🔱' },
        { name: 'Bhimashankar', location: 'Pune, MH', category: 'jyotirlinga', youtube: null, channelId: null, hasLive: false, icon: '🔱' },
        { name: 'Kashi Vishwanath', location: 'Varanasi, UP', category: 'jyotirlinga', youtube: '@ShreeKashiVishwanathMandirTrust', channelId: 'UC5Ky5GAbFwCdBMVjKl1lAog', hasLive: true, icon: '🔱' },
        { name: 'Trimbakeshwar', location: 'Nashik, MH', category: 'jyotirlinga', youtube: '@ShriTrimbakeshwarJyotirling', channelId: null, hasLive: true, icon: '🔱' },
        { name: 'Vaidyanath', location: 'Deoghar, JH', category: 'jyotirlinga', youtube: null, channelId: null, hasLive: false, icon: '🔱' },
        { name: 'Nageshwar', location: 'Dwarka, GJ', category: 'jyotirlinga', youtube: null, channelId: null, hasLive: false, icon: '🔱' },
        { name: 'Rameshwaram', location: 'Tamil Nadu', category: 'jyotirlinga', youtube: null, channelId: null, hasLive: false, icon: '🔱' },
        { name: 'Grishneshwar', location: 'Ellora, MH', category: 'jyotirlinga', youtube: null, channelId: null, hasLive: false, icon: '🔱' },

        // === CHAR DHAM ===
        { name: 'Badrinath', location: 'Uttarakhand', category: 'chardham', youtube: null, channelId: null, hasLive: false, icon: '🛕' },
        { name: 'Dwarkadheesh', location: 'Dwarka, Gujarat', category: 'chardham', youtube: '@ShriDwarikadhishMandirOfficial', channelId: null, hasLive: true, icon: '🛕' },
        { name: 'Jagannath Puri', location: 'Puri, Odisha', category: 'chardham', youtube: '@SJTA_Puri', channelId: null, hasLive: true, icon: '🛕' },
        { name: 'Rameshwaram', location: 'Tamil Nadu', category: 'chardham', youtube: null, channelId: null, hasLive: false, icon: '🛕' },

        // === CHOTA CHAR DHAM ===
        { name: 'Yamunotri', location: 'Uttarkashi', category: 'chotachardham', youtube: null, channelId: null, hasLive: false, icon: '⛰️' },
        { name: 'Gangotri', location: 'Uttarkashi', category: 'chotachardham', youtube: null, channelId: null, hasLive: false, icon: '⛰️' },
        { name: 'Kedarnath', location: 'Rudraprayag', category: 'chotachardham', youtube: null, channelId: null, hasLive: false, icon: '⛰️' },
        { name: 'Badrinath', location: 'Chamoli', category: 'chotachardham', youtube: null, channelId: null, hasLive: false, icon: '⛰️' },

        // === SAPTA PURI ===
        { name: 'Ayodhya', location: 'Uttar Pradesh', category: 'saptapuri', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "Ram Janmabhoomi" },
        { name: 'Mathura', location: 'Uttar Pradesh', category: 'saptapuri', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "Krishna Janmabhoomi" },
        { name: 'Haridwar', location: 'Uttarakhand', category: 'saptapuri', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "Gateway to Gods" },
        { name: 'Varanasi (Kashi)', location: 'Uttar Pradesh', category: 'saptapuri', youtube: '@ShreeKashiVishwanathMandirTrust', channelId: 'UC5Ky5GAbFwCdBMVjKl1lAog', hasLive: true, icon: '🏛️' },
        { name: 'Kanchipuram', location: 'Tamil Nadu', category: 'saptapuri', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "1000 Temples" },
        { name: 'Ujjain', location: 'Madhya Pradesh', category: 'saptapuri', youtube: '@mahakaleshwarujjain', channelId: 'UCvQ7iV1qfqJrqDAKNYTaHPw', hasLive: true, icon: '🏛️' },
        { name: 'Dwarka', location: 'Gujarat', category: 'saptapuri', youtube: '@ShriDwarikadhishMandirOfficial', channelId: 'UCdwarka', hasLive: true, icon: '🏛️' },

        // === PANCH KEDAR ===
        { name: 'Kedarnath', location: '3,583m', category: 'panchkedar', youtube: null, channelId: null, hasLive: false, icon: '🏔️', subtitle: "Hump" },
        { name: 'Tungnath', location: '3,680m', category: 'panchkedar', youtube: null, channelId: null, hasLive: false, icon: '🏔️', subtitle: "Arms - Highest Shiva Temple" },
        { name: 'Rudranath', location: '3,559m', category: 'panchkedar', youtube: null, channelId: null, hasLive: false, icon: '🏔️', subtitle: "Face" },
        { name: 'Madhyamaheshwar', location: '3,490m', category: 'panchkedar', youtube: null, channelId: null, hasLive: false, icon: '🏔️', subtitle: "Navel" },
        { name: 'Kalpeshwar', location: '2,200m', category: 'panchkedar', youtube: null, channelId: null, hasLive: false, icon: '🏔️', subtitle: "Hair" },

        // === PANCH BADRI ===
        { name: 'Badrinath (Vishal Badri)', location: 'Chamoli', category: 'panchbadri', youtube: null, channelId: null, hasLive: false, icon: '🙏' },
        { name: 'Adi Badri', location: 'Chamoli', category: 'panchbadri', youtube: null, channelId: null, hasLive: false, icon: '🙏', subtitle: "16 Ancient Temples" },
        { name: 'Vridha Badri', location: 'Chamoli', category: 'panchbadri', youtube: null, channelId: null, hasLive: false, icon: '🙏', subtitle: "Old Badri" },
        { name: 'Bhavishya Badri', location: 'Chamoli', category: 'panchbadri', youtube: null, channelId: null, hasLive: false, icon: '🙏', subtitle: "Future Badri" },
        { name: 'Yogadhyan Badri', location: 'Pandukeshwar', category: 'panchbadri', youtube: null, channelId: null, hasLive: false, icon: '🙏', subtitle: "Meditation" },

        // === SHAKTI PEETHA ===
        { name: 'Kamakhya', location: 'Guwahati, Assam', category: 'shaktipeetha', youtube: '@maakamakhyadham9903', channelId: null, hasLive: true, icon: '🔴', subtitle: "Yoni - Most Powerful" },
        { name: 'Kalighat', location: 'Kolkata, WB', category: 'shaktipeetha', youtube: null, channelId: null, hasLive: false, icon: '🔴', subtitle: "Right Toes" },
        { name: 'Vindhyachal', location: 'Mirzapur, UP', category: 'shaktipeetha', youtube: null, channelId: null, hasLive: false, icon: '🔴' },
        { name: 'Vaishno Devi', location: 'J&K', category: 'shaktipeetha', youtube: '@shrimatavaishnodevishrineboard', channelId: null, hasLive: true, icon: '🔴', subtitle: "Arms" },
        { name: 'Jwalaji', location: 'Kangra, HP', category: 'shaktipeetha', youtube: null, channelId: null, hasLive: false, icon: '🔴', subtitle: "Tongue" },
        { name: 'Naina Devi', location: 'Bilaspur, HP', category: 'shaktipeetha', youtube: null, channelId: null, hasLive: false, icon: '🔴', subtitle: "Eyes" },
        { name: 'Chintpurni', location: 'Una, HP', category: 'shaktipeetha', youtube: null, channelId: null, hasLive: false, icon: '🔴', subtitle: "Feet" },
        { name: 'Tarapith', location: 'Birbhum, WB', category: 'shaktipeetha', youtube: null, channelId: null, hasLive: false, icon: '🔴', subtitle: "Third Eye" },
        { name: 'Ambaji', location: 'Gujarat', category: 'shaktipeetha', youtube: null, channelId: null, hasLive: false, icon: '🔴', subtitle: "Heart" },
        { name: 'Vishalakshi', location: 'Varanasi, UP', category: 'shaktipeetha', youtube: null, channelId: null, hasLive: false, icon: '🔴', subtitle: "Earrings" },

        // === SHANKARACHARYA MATH ===
        { name: 'Sringeri Sharada', location: 'Karnataka', category: 'shankaracharya', youtube: null, channelId: null, hasLive: false, icon: '📿', subtitle: "South - Yajur Veda" },
        { name: 'Dwarka Sharada', location: 'Gujarat', category: 'shankaracharya', youtube: null, channelId: null, hasLive: false, icon: '📿', subtitle: "West - Sama Veda" },
        { name: 'Govardhan Math', location: 'Puri, Odisha', category: 'shankaracharya', youtube: null, channelId: null, hasLive: false, icon: '📿', subtitle: "East - Rig Veda" },
        { name: 'Jyotir Math', location: 'Joshimath, UK', category: 'shankaracharya', youtube: null, channelId: null, hasLive: false, icon: '📿', subtitle: "North - Atharva Veda" },

        // === DIVYA DESAM (Top Ones) ===
        { name: 'Srirangam', location: 'Trichy, TN', category: 'divyadesam', youtube: null, channelId: null, hasLive: false, icon: '🪷' },
        { name: 'Tirupati Balaji', location: 'Tirumala, AP', category: 'divyadesam', youtube: '@svbcttd', channelId: null, hasLive: true, icon: '🪷' },
        { name: 'Badrinath', location: 'Chamoli, UK', category: 'divyadesam', youtube: null, channelId: null, hasLive: false, icon: '🪷' },
        { name: 'Muktinath', location: 'Nepal', category: 'divyadesam', youtube: null, channelId: null, hasLive: false, icon: '🪷' },
        { name: 'Guruvayur', location: 'Thrissur, Kerala', category: 'divyadesam', youtube: null, channelId: null, hasLive: false, icon: '🪷' },
        { name: 'Padmanabhaswamy', location: 'Trivandrum, Kerala', category: 'divyadesam', youtube: null, channelId: null, hasLive: false, icon: '🪷' },

        // === ASHTAVINAYAK ===
        { name: 'Morgaon', location: 'Pune, MH', category: 'ashtavinayak', youtube: null, channelId: null, hasLive: false, icon: '🐘' },
        { name: 'Siddhatek', location: 'Ahmednagar, MH', category: 'ashtavinayak', youtube: null, channelId: null, hasLive: false, icon: '🐘' },
        { name: 'Pali', location: 'Raigad, MH', category: 'ashtavinayak', youtube: null, channelId: null, hasLive: false, icon: '🐘' },
        { name: 'Mahad', location: 'Raigad, MH', category: 'ashtavinayak', youtube: null, channelId: null, hasLive: false, icon: '🐘' },
        { name: 'Theur', location: 'Pune, MH', category: 'ashtavinayak', youtube: null, channelId: null, hasLive: false, icon: '🐘' },
        { name: 'Lenyadri', location: 'Pune, MH', category: 'ashtavinayak', youtube: null, channelId: null, hasLive: false, icon: '🐘' },
        { name: 'Ozar', location: 'Pune, MH', category: 'ashtavinayak', youtube: null, channelId: null, hasLive: false, icon: '🐘' },
        { name: 'Ranjangaon', location: 'Pune, MH', category: 'ashtavinayak', youtube: null, channelId: null, hasLive: false, icon: '🐘' },

        // === KUMBH MELA CITIES ===
        { name: 'Prayagraj', location: 'Uttar Pradesh', category: 'kumbh', youtube: null, channelId: null, hasLive: false, icon: '💧', subtitle: "Triveni Sangam" },
        { name: 'Haridwar', location: 'Uttarakhand', category: 'kumbh', youtube: null, channelId: null, hasLive: false, icon: '💧', subtitle: "Har Ki Pauri" },
        { name: 'Nashik', location: 'Maharashtra', category: 'kumbh', youtube: null, channelId: null, hasLive: false, icon: '💧', subtitle: "Godavari" },
        { name: 'Ujjain', location: 'Madhya Pradesh', category: 'kumbh', youtube: '@mahakaleshwarujjain', channelId: 'UCvQ7iV1qfqJrqDAKNYTaHPw', hasLive: true, icon: '💧', subtitle: "Shipra" },

        // === ISKCON TEMPLES ===
        { name: 'ISKCON Mayapur', location: 'West Bengal', category: 'iskcon', youtube: '@MayapurTVOfficial', channelId: null, hasLive: true, icon: '🙏', subtitle: "HQ" },
        { name: 'ISKCON Vrindavan', location: 'Uttar Pradesh', category: 'iskcon', youtube: '@ISKCONVrndavan', channelId: null, hasLive: true, icon: '🙏' },
        { name: 'ISKCON Bangalore', location: 'Karnataka', category: 'iskcon', youtube: '@iskconbangalore', channelId: null, hasLive: true, icon: '🙏' },
        { name: 'ISKCON Dwarka', location: 'Delhi', category: 'iskcon', youtube: '@ISKCONDwarka', channelId: null, hasLive: true, icon: '🙏' },

        // === HISTORIC TEMPLES ===
        { name: 'Jagannath Puri', location: 'Odisha', category: 'historic', youtube: '@SJTA_Puri', channelId: null, hasLive: true, icon: '🏛️' },
        { name: 'Meenakshi Amman', location: 'Madurai, TN', category: 'historic', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "Parvati" },
        { name: 'Brihadeeswara', location: 'Thanjavur, TN', category: 'historic', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "UNESCO - Shiva" },
        { name: 'Konark Sun Temple', location: 'Odisha', category: 'historic', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "UNESCO - Surya" },
        { name: 'Khajuraho', location: 'Madhya Pradesh', category: 'historic', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "UNESCO" },
        { name: 'Lingaraj', location: 'Bhubaneswar, Odisha', category: 'historic', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "Shiva" },
        { name: 'Siddhivinayak', location: 'Mumbai, MH', category: 'historic', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "Ganesh" },
        { name: 'Mahabodhi', location: 'Bodh Gaya, Bihar', category: 'historic', youtube: null, channelId: null, hasLive: false, icon: '🏛️', subtitle: "Buddha" }
    ];

    // === DOM ELEMENTS ===
    const searchBtn = document.getElementById('search-btn');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');
    const clearSearch = document.getElementById('clear-search');
    const featuredGrid = document.getElementById('featured-grid');
    const categoryTabs = document.getElementById('category-tabs');
    const templesGrid = document.getElementById('temples-grid');
    const categoryTitle = document.getElementById('category-title');
    const playerModal = document.getElementById('player-modal');
    const playerTitle = document.getElementById('player-title');
    const youtubePlayer = document.getElementById('youtube-player');
    const closePlayer = document.getElementById('close-player');
    const subscribeBtn = document.getElementById('subscribe-btn');
    const youtubeBtn = document.getElementById('youtube-btn');

    let currentCategory = 'all';

    // === INITIALIZE ===
    function init() {
        renderFeatured();
        renderCategoryTabs();
        renderTemples();
        setupEventListeners();
        lucide.createIcons();
    }

    // === RENDER FEATURED (LIVE TEMPLES) ===
    function renderFeatured() {
        const liveTemples = TEMPLES.filter(t => t.hasLive);

        if (liveTemples.length === 0) {
            document.getElementById('featured-section').style.display = 'none';
            return;
        }

        featuredGrid.innerHTML = liveTemples.map(temple => `
            <div class="featured-card" data-temple='${JSON.stringify(temple)}'>
                <div class="featured-thumbnail">
                    <span class="temple-icon">${temple.icon}</span>
                    <div class="play-icon"><i data-lucide="play"></i></div>
                    <span class="live-badge">Live</span>
                </div>
                <div class="featured-info">
                    <div class="featured-name">${temple.name}</div>
                    <div class="featured-location">${temple.location}</div>
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    }

    // === RENDER CATEGORY TABS ===
    function renderCategoryTabs() {
        categoryTabs.innerHTML = CATEGORIES.map(cat => `
            <button class="category-tab ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
                ${cat.icon} ${cat.name}
            </button>
        `).join('');
    }

    // === RENDER TEMPLES ===
    function renderTemples(searchTerm = '') {
        let filtered = TEMPLES;

        // Filter by category
        if (currentCategory !== 'all') {
            filtered = filtered.filter(t => t.category === currentCategory);
        }

        // Filter by search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(term) ||
                t.location.toLowerCase().includes(term)
            );
        }

        // Remove duplicates by name for display
        const uniqueTemples = [];
        const seenNames = new Set();
        filtered.forEach(t => {
            if (!seenNames.has(t.name)) {
                seenNames.add(t.name);
                uniqueTemples.push(t);
            }
        });

        if (uniqueTemples.length === 0) {
            templesGrid.innerHTML = `
                <div class="no-results">
                    <i data-lucide="search-x"></i>
                    <p>No temples found</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        // Update title
        const cat = CATEGORIES.find(c => c.id === currentCategory);
        categoryTitle.textContent = cat ? `${cat.icon} ${cat.name}` : 'All Temples';

        templesGrid.innerHTML = uniqueTemples.map(temple => `
            <div class="temple-card" data-temple='${JSON.stringify(temple)}'>
                <div class="temple-thumbnail">
                    <span class="temple-icon">${temple.icon}</span>
                    ${temple.hasLive ? '<div class="mini-play"><i data-lucide="play"></i></div>' : ''}
                </div>
                <div class="temple-info">
                    <div class="temple-name">${temple.name}</div>
                    <div class="temple-location">${temple.subtitle || temple.location}</div>
                    ${temple.hasLive ? '<span class="temple-category-badge">🔴 Live</span>' : ''}
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    }

    // === OPEN PLAYER ===
    function openPlayer(temple) {
        if (!temple.youtube) {
            alert('Live stream not available for this temple yet. Coming soon!');
            return;
        }

        playerTitle.textContent = temple.name;

        // Clear any previous error state
        const errorContainer = document.getElementById('player-error');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }

        // Build YouTube embed URL for live stream using channel ID if available
        // Note: YouTube embed for live streams works best with channel handle for /live endpoint
        // We'll use the direct channel live page embed approach
        const channelHandle = temple.youtube.replace('@', '');

        // Use the channel's live page via embed - more reliable than live_stream parameter
        // The live_stream?channel= parameter requires the OLD channel ID format (starts with UC)
        if (temple.channelId && temple.channelId.startsWith('UC') && temple.channelId.length === 24) {
            // Valid channel ID found - use live_stream embed
            youtubePlayer.src = `https://www.youtube.com/embed/live_stream?channel=${temple.channelId}&autoplay=1`;
        } else {
            // Fallback: embed the channel's homepage which will show latest/live content
            youtubePlayer.src = `https://www.youtube.com/embed?listType=user_uploads&list=${channelHandle}&autoplay=1`;
        }

        // Set button links
        subscribeBtn.href = `https://www.youtube.com/${temple.youtube}?sub_confirmation=1`;
        youtubeBtn.href = `https://www.youtube.com/${temple.youtube}/live`;

        playerModal.classList.add('active');

        // Add error handling for iframe
        youtubePlayer.onerror = () => showPlayerError(temple);

        // Set a timeout to check if video loaded (fallback error detection)
        setTimeout(() => {
            if (playerModal.classList.contains('active')) {
                // Add a subtle indicator that user can click "Open YouTube" if embed fails
                const actionsEl = document.querySelector('.player-actions');
                if (actionsEl && !document.getElementById('youtube-tip')) {
                    const tip = document.createElement('p');
                    tip.id = 'youtube-tip';
                    tip.className = 'youtube-tip';
                    tip.textContent = 'If video doesn\'t load, click "Open YouTube" to watch directly';
                    tip.style.cssText = 'font-size: 12px; color: #888; text-align: center; margin-top: 8px; width: 100%;';
                    actionsEl.appendChild(tip);
                }
            }
        }, 3000);

        lucide.createIcons();
    }

    // === SHOW PLAYER ERROR ===
    function showPlayerError(temple) {
        const playerContainer = document.querySelector('.player-container');
        if (playerContainer) {
            playerContainer.innerHTML = `
                <div id="player-error" class="player-error" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #1a1a2e; border-radius: 12px; padding: 24px; text-align: center;">
                    <span style="font-size: 48px; margin-bottom: 16px;">🙏</span>
                    <h4 style="color: #fff; margin-bottom: 8px;">Live stream unavailable</h4>
                    <p style="color: #888; font-size: 14px; margin-bottom: 16px;">The live stream may be offline or temporarily unavailable.</p>
                    <a href="https://www.youtube.com/${temple.youtube}/live" target="_blank" class="action-btn youtube-btn" style="padding: 10px 20px; background: #ff0000; color: #fff; border-radius: 8px; text-decoration: none; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="youtube"></i> Watch on YouTube
                    </a>
                </div>
            `;
            lucide.createIcons();
        }
    }

    // === CLOSE PLAYER ===
    function closePlayerModal() {
        playerModal.classList.remove('active');
        youtubePlayer.src = '';

        // Remove temporary tip if exists
        const tip = document.getElementById('youtube-tip');
        if (tip) tip.remove();

        // Restore player container if it was replaced with error
        const playerContainer = document.querySelector('.player-container');
        const errorEl = document.getElementById('player-error');
        if (errorEl && playerContainer) {
            playerContainer.innerHTML = `
                <iframe id="youtube-player" src="" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            `;
        }
    }

    // === EVENT LISTENERS ===
    function setupEventListeners() {
        // Search toggle
        searchBtn.addEventListener('click', () => {
            searchBar.classList.toggle('hidden');
            if (!searchBar.classList.contains('hidden')) {
                searchInput.focus();
            }
        });

        // Search input
        searchInput.addEventListener('input', (e) => {
            renderTemples(e.target.value);
        });

        // Clear search
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            renderTemples();
            searchBar.classList.add('hidden');
        });

        // Category tabs
        categoryTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-tab')) {
                currentCategory = e.target.dataset.category;
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                renderTemples(searchInput.value);
            }
        });

        // Featured cards - direct to player
        featuredGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.featured-card');
            if (card) {
                const temple = JSON.parse(card.dataset.temple);
                openPlayer(temple);
            }
        });

        // Temple cards - open info modal first
        templesGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.temple-card');
            if (card) {
                const temple = JSON.parse(card.dataset.temple);
                openTempleInfo(temple);
            }
        });

        // Close player
        closePlayer.addEventListener('click', closePlayerModal);
        playerModal.addEventListener('click', (e) => {
            if (e.target === playerModal) {
                closePlayerModal();
            }
        });

        // Temple info modal
        setupInfoModal();
    }

    // === TEMPLE INFO MODAL ===
    let currentInfoTemple = null;
    const infoModal = document.getElementById('temple-info-modal');
    const closeInfo = document.getElementById('close-info');

    function getEnrichedData(temple) {
        // Map temple name to enriched data key
        const keyMap = {
            'Somnath': 'somnath',
            'Kashi Vishwanath': 'kashivishwanath',
            'Mahakaleshwar': 'mahakaleshwar',
            'Mallikarjuna': 'srisailam',
            'Tirupati Balaji': 'tirupati',
            'Vaishno Devi': 'vaishnodevi',
            'Kamakhya': 'kamakhya',
            'Jagannath Puri': 'jagannathpuri',
            'Badrinath': 'badrinathkedarnath',
            'Kedarnath': 'badrinathkedarnath',
            'Srirangam': 'srirangam',
            'Guruvayur': 'guruvayur',
            'Padmanabhaswamy': 'padmanabhaswamy',
            'Kalighat': 'kalighat',
            'Ambaji': 'ambaji'
        };

        const key = keyMap[temple.name];
        if (key && typeof TEMPLE_ENRICHED_DATA !== 'undefined') {
            return TEMPLE_ENRICHED_DATA[key];
        }
        return null;
    }

    function openTempleInfo(temple) {
        currentInfoTemple = temple;
        const enriched = getEnrichedData(temple);

        // Set basic info
        document.getElementById('info-icon').textContent = temple.icon;
        document.getElementById('info-temple-name').textContent = temple.name;
        document.getElementById('info-temple-location').textContent = temple.location;

        // Set badges
        const badgesEl = document.getElementById('info-badges');
        let badges = [];
        if (temple.category === 'jyotirlinga') badges.push('<span class="info-badge jyotirlinga">🔱 Jyotirlinga</span>');
        if (temple.category === 'shaktipeetha') badges.push('<span class="info-badge shaktipeetha">🔴 Shakti Peetha</span>');
        if (temple.category === 'chardham') badges.push('<span class="info-badge chardham">🛕 Char Dham</span>');
        if (temple.hasLive) badges.push('<span class="info-badge live">🔴 Live</span>');
        badgesEl.innerHTML = badges.join('');

        // Fill enriched data if available
        if (enriched) {
            document.getElementById('info-significance').textContent = enriched.significance || '-';
            document.getElementById('info-history').textContent = enriched.history || '-';
            document.getElementById('info-dynasty').textContent = enriched.dynasty || '-';
            document.getElementById('info-scripture').textContent = enriched.scripture || '-';
            document.getElementById('info-legend').textContent = enriched.legend || '-';

            // Rituals
            const rituals = enriched.rituals || [];
            document.getElementById('info-rituals').innerHTML = rituals.length > 0
                ? rituals.map(r => `<span class="ritual-tag">${r}</span>`).join('')
                : '-';
        } else {
            document.getElementById('info-significance').textContent = temple.subtitle || 'A sacred pilgrimage site.';
            document.getElementById('info-history').textContent = 'Historical data coming soon.';
            document.getElementById('info-dynasty').textContent = '-';
            document.getElementById('info-scripture').textContent = 'Scriptural references coming soon.';
            document.getElementById('info-legend').textContent = '-';
            document.getElementById('info-rituals').textContent = '-';
        }

        // Action buttons
        const watchBtn = document.getElementById('watch-live-btn');
        const channelBtn = document.getElementById('view-channel-btn');

        watchBtn.disabled = !temple.hasLive;
        watchBtn.onclick = () => {
            closeInfoModal();
            openPlayer(temple);
        };

        channelBtn.onclick = () => {
            if (temple.youtube) {
                window.open(`https://www.youtube.com/${temple.youtube}`, '_blank');
            }
        };
        channelBtn.disabled = !temple.youtube;

        // Show modal
        infoModal.classList.add('active');
        lucide.createIcons();

        // Reset to About tab
        document.querySelectorAll('.info-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.info-tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector('.info-tab[data-tab="about"]').classList.add('active');
        document.getElementById('tab-about').classList.add('active');
    }

    function closeInfoModal() {
        infoModal.classList.remove('active');
        currentInfoTemple = null;
    }

    function setupInfoModal() {
        if (closeInfo) {
            closeInfo.addEventListener('click', closeInfoModal);
        }

        if (infoModal) {
            infoModal.addEventListener('click', (e) => {
                if (e.target === infoModal) {
                    closeInfoModal();
                }
            });
        }

        // Tab switching
        document.querySelectorAll('.info-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.info-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.info-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
            });
        });
    }

    // === START ===
    init();
});

