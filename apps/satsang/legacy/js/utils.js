/**
 * Satsang App - Utilities
 * Shared helper functions
 */

export const Utils = {
    /**
     * Share functionality using Web Share API
     * @param {string} title 
     * @param {string} text 
     * @param {string} url 
     */
    async share(title, text, url = window.location.href) {
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (err) {
                console.warn('Share failed:', err);
            }
        } else {
            console.log('Web Share API not supported');
            // Fallback: Copy to clipboard or show toast
            this.copyToClipboard(url);
            alert('Link copied to clipboard!');
        }
    },

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy keys', err);
        }
    },

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    },

    formatNumber(num) {
        if (num > 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num > 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    }
};
