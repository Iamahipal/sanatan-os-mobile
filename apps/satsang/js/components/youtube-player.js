/**
 * Satsang App - YouTube Player Component
 * Embedded YouTube player for live streams and katha recordings
 */

/**
 * Initialize YouTube IFrame API
 * Called once when app loads
 */
export function initYouTubeAPI() {
    // Check if already loaded
    if (window.YT) return Promise.resolve();

    return new Promise((resolve) => {
        // Create script tag
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // YouTube API will call this when ready
        window.onYouTubeIframeAPIReady = () => {
            console.log('✅ YouTube IFrame API Ready');
            resolve();
        };
    });
}

/**
 * YouTube Player State
 */
let currentPlayer = null;
let playerContainer = null;

/**
 * Open YouTube player in full-screen modal
 * @param {string} videoId - YouTube video ID
 * @param {string} title - Video title for header
 * @param {boolean} isLive - Whether this is a live stream
 */
export function openYouTubePlayer(videoId, title = 'Live Katha', isLive = false) {
    // Create modal container
    playerContainer = document.createElement('div');
    playerContainer.className = 'youtube-player-modal';
    playerContainer.innerHTML = `
        <div class="youtube-player__header">
            <button class="youtube-player__close" aria-label="Close">
                <i data-lucide="x"></i>
            </button>
            <div class="youtube-player__title">
                ${isLive ? '<span class="chip chip--live">🔴 LIVE</span>' : ''}
                <span>${title}</span>
            </div>
            <button class="youtube-player__pip" aria-label="Picture in Picture">
                <i data-lucide="picture-in-picture-2"></i>
            </button>
        </div>
        <div class="youtube-player__container">
            <div id="ytPlayerEmbed"></div>
        </div>
        <div class="youtube-player__controls">
            <div class="youtube-player__info">
                <span class="youtube-player__viewers"></span>
            </div>
            <div class="youtube-player__actions">
                <button class="btn btn--icon" id="ytOpenApp" aria-label="Open in YouTube">
                    <i data-lucide="external-link"></i>
                    <span>Open in YouTube</span>
                </button>
                <button class="btn btn--icon" id="ytShare" aria-label="Share">
                    <i data-lucide="share-2"></i>
                    <span>Share</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(playerContainer);
    document.body.style.overflow = 'hidden';

    // Initialize Lucide icons in modal
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Create YouTube player
    if (window.YT && window.YT.Player) {
        createPlayer(videoId);
    } else {
        initYouTubeAPI().then(() => createPlayer(videoId));
    }

    // Event listeners
    playerContainer.querySelector('.youtube-player__close').addEventListener('click', closeYouTubePlayer);
    playerContainer.querySelector('#ytOpenApp').addEventListener('click', () => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    });
    playerContainer.querySelector('#ytShare').addEventListener('click', () => {
        shareVideo(videoId, title);
    });

    // Close on escape
    document.addEventListener('keydown', handleEscape);
}

/**
 * Create YouTube player instance
 */
function createPlayer(videoId) {
    currentPlayer = new YT.Player('ytPlayerEmbed', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            fs: 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log('🎬 Player ready');
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    // YT.PlayerState: ENDED=0, PLAYING=1, PAUSED=2, BUFFERING=3, CUED=5
    if (event.data === YT.PlayerState.PLAYING) {
        console.log('▶️ Video playing');
    }
}

function onPlayerError(event) {
    console.error('❌ Player error:', event.data);
    const container = document.querySelector('.youtube-player__container');
    if (container) {
        container.innerHTML = `
            <div class="youtube-player__error">
                <i data-lucide="alert-circle"></i>
                <p>Video unavailable. Try opening in YouTube.</p>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    }
}

/**
 * Close YouTube player modal
 */
export function closeYouTubePlayer() {
    if (currentPlayer) {
        currentPlayer.destroy();
        currentPlayer = null;
    }

    if (playerContainer) {
        playerContainer.remove();
        playerContainer = null;
    }

    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscape);
}

function handleEscape(e) {
    if (e.key === 'Escape') {
        closeYouTubePlayer();
    }
}

/**
 * Share video using Web Share API
 */
async function shareVideo(videoId, title) {
    const shareData = {
        title: title,
        text: `Watch ${title} on Satsang App`,
        url: `https://www.youtube.com/watch?v=${videoId}`
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(shareData.url);
            showToast('Link copied to clipboard!');
        }
    } catch (err) {
        console.log('Share cancelled or failed');
    }
}

/**
 * Check if a video is currently live
 * @param {Object} event - Event object with liveStream data
 * @returns {boolean}
 */
export function isStreamLive(event) {
    if (!event.liveStream) return false;

    const now = new Date();
    const start = new Date(event.liveStream.startTime);
    const end = new Date(event.liveStream.endTime);

    return now >= start && now <= end;
}

/**
 * Get YouTube video ID from various URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
export function extractYouTubeId(url) {
    if (!url) return null;

    // Already a video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }

    // Various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

// Toast helper (import from utils if available)
function showToast(message) {
    if (window.showToast) {
        window.showToast(message);
    } else {
        console.log(message);
    }
}
