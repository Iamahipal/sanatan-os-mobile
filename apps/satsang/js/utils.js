/**
 * Satsang App v2 - Utility Functions
 */

/**
 * Format date range for display
 * @param {string} start - Start date (YYYY-MM-DD)
 * @param {string} end - End date (YYYY-MM-DD)
 * @returns {string} Formatted date range
 */
export function formatDateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();

    // Check if event is live (today is between start and end)
    if (today >= startDate && today <= endDate) {
        return 'Live Now';
    }

    const options = { month: 'short', day: 'numeric' };
    const startStr = startDate.toLocaleDateString('en-IN', options);
    const endStr = endDate.toLocaleDateString('en-IN', options);

    // Same month
    if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.getDate()} - ${endStr}`;
    }

    return `${startStr} - ${endStr}`;
}

/**
 * Check if event is currently live
 * @param {Object} event - Event object
 * @returns {boolean}
 */
export function isEventLive(event) {
    if (event.features?.isLive) return true;

    const today = new Date();
    const start = new Date(event.dates.start);
    const end = new Date(event.dates.end);

    return today >= start && today <= end;
}

/**
 * Format number for display (1200000 → 1.2M)
 * @param {number} num - Number to format
 * @returns {string}
 */
export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

/**
 * Create HTML element from template string
 * @param {string} html - HTML string
 * @returns {HTMLElement}
 */
export function createElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get category info
 * @param {string} type - Event type
 * @returns {Object} Category info with icon and label
 */
export function getCategoryInfo(type) {
    const categories = {
        'all': { icon: 'infinity', label: 'All', labelHi: 'सभी' },
        'bhagwat': { icon: 'book-open', label: 'Bhagwat', labelHi: 'भागवत' },
        'ramkatha': { icon: 'feather', label: 'Ram Katha', labelHi: 'राम कथा' },
        'kirtan': { icon: 'music', label: 'Kirtan', labelHi: 'कीर्तन' },
        'darbar': { icon: 'sparkles', label: 'Darbar', labelHi: 'दरबार' },
        'concert': { icon: 'mic', label: 'Concert', labelHi: 'कॉन्सर्ट' }
    };

    return categories[type] || categories['all'];
}

/**
 * Show/hide screens
 * @param {string} screenId - Screen to show
 */
export function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const screen = document.getElementById(`${screenId}Screen`);
    if (screen) {
        screen.classList.add('active');
    }
}

/**
 * Refresh Lucide icons in a container
 * @param {HTMLElement} container - Container element
 */
export function refreshIcons(container = document) {
    if (window.lucide) {
        window.lucide.createIcons({
            attrs: {
                'stroke-width': 2
            }
        });
    }
}

/**
 * Simple modal management
 */
export const modal = {
    open(modalId) {
        const backdrop = document.getElementById('modalBackdrop');
        const modalEl = document.getElementById(modalId);

        if (backdrop && modalEl) {
            backdrop.classList.add('active');
            modalEl.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    close(modalId) {
        const backdrop = document.getElementById('modalBackdrop');
        const modalEl = document.getElementById(modalId);

        if (backdrop && modalEl) {
            backdrop.classList.remove('active');
            modalEl.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    closeAll() {
        const backdrop = document.getElementById('modalBackdrop');
        document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
        if (backdrop) backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
};
