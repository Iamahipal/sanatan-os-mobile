/**
 * Satsang App - Community Service
 * Comments, photo sharing, and community features
 */

/**
 * Get comments for an event
 * @param {string} eventId 
 */
export function getEventComments(eventId) {
    const all = getAllComments();
    return all.filter(c => c.eventId === eventId).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
}

/**
 * Get all comments from localStorage
 */
function getAllComments() {
    try {
        return JSON.parse(localStorage.getItem('satsang_comments') || '[]');
    } catch {
        return [];
    }
}

/**
 * Save comments to localStorage
 */
function saveComments(comments) {
    localStorage.setItem('satsang_comments', JSON.stringify(comments));
}

/**
 * Add a comment to an event
 * @param {string} eventId 
 * @param {string} text 
 * @param {string} userId 
 */
export function addComment(eventId, text, userId = 'guest') {
    if (!text.trim()) return null;

    const comment = {
        id: `cmt_${Date.now()}`,
        eventId,
        userId,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        likes: 0
    };

    const comments = getAllComments();
    comments.push(comment);
    saveComments(comments);

    return comment;
}

/**
 * Delete a comment
 * @param {string} commentId 
 * @param {string} userId - Must match comment author
 */
export function deleteComment(commentId, userId) {
    const comments = getAllComments();
    const idx = comments.findIndex(c => c.id === commentId && c.userId === userId);
    if (idx !== -1) {
        comments.splice(idx, 1);
        saveComments(comments);
        return true;
    }
    return false;
}

/**
 * Like a comment
 * @param {string} commentId 
 */
export function likeComment(commentId) {
    const comments = getAllComments();
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        comment.likes = (comment.likes || 0) + 1;
        saveComments(comments);
        return comment.likes;
    }
    return 0;
}

/**
 * Get photos for an event
 * @param {string} eventId 
 */
export function getEventPhotos(eventId) {
    const all = getAllPhotos();
    return all.filter(p => p.eventId === eventId);
}

/**
 * Get all photos
 */
function getAllPhotos() {
    try {
        return JSON.parse(localStorage.getItem('satsang_photos') || '[]');
    } catch {
        return [];
    }
}

/**
 * Save photos
 */
function savePhotos(photos) {
    localStorage.setItem('satsang_photos', JSON.stringify(photos));
}

/**
 * Add a photo to an event
 * @param {string} eventId 
 * @param {string} dataUrl - Base64 image data
 * @param {string} caption 
 * @param {string} userId 
 */
export function addPhoto(eventId, dataUrl, caption = '', userId = 'guest') {
    const photo = {
        id: `photo_${Date.now()}`,
        eventId,
        userId,
        dataUrl,
        caption,
        createdAt: new Date().toISOString(),
        likes: 0
    };

    const photos = getAllPhotos();
    photos.push(photo);
    savePhotos(photos);

    return photo;
}

/**
 * Delete a photo
 * @param {string} photoId 
 * @param {string} userId 
 */
export function deletePhoto(photoId, userId) {
    const photos = getAllPhotos();
    const idx = photos.findIndex(p => p.id === photoId && p.userId === userId);
    if (idx !== -1) {
        photos.splice(idx, 1);
        savePhotos(photos);
        return true;
    }
    return false;
}

/**
 * Render comments section
 * @param {string} eventId 
 * @param {string} userId 
 */
export function renderCommentsSection(eventId, userId = 'guest') {
    const comments = getEventComments(eventId);

    return `
        <div class="community-section">
            <h4 class="community-section__title">
                <i data-lucide="message-circle"></i>
                Comments (${comments.length})
            </h4>
            
            <!-- Add Comment -->
            <div class="comment-form">
                <input type="text" 
                       class="comment-input" 
                       placeholder="Add a comment..."
                       data-event-id="${eventId}">
                <button class="comment-submit" data-event-id="${eventId}">
                    <i data-lucide="send"></i>
                </button>
            </div>
            
            <!-- Comments List -->
            <div class="comments-list">
                ${comments.length === 0 ? `
                    <p class="comments-empty">Be the first to comment!</p>
                ` : comments.map(c => `
                    <div class="comment-card" data-comment-id="${c.id}">
                        <div class="comment-card__avatar">
                            <i data-lucide="user"></i>
                        </div>
                        <div class="comment-card__content">
                            <div class="comment-card__header">
                                <span class="comment-card__author">${c.userId === 'guest' ? 'Guest' : c.userId}</span>
                                <span class="comment-card__time">${formatTimeAgo(c.createdAt)}</span>
                            </div>
                            <p class="comment-card__text">${escapeHtml(c.text)}</p>
                            <div class="comment-card__actions">
                                <button class="comment-like" data-comment-id="${c.id}">
                                    <i data-lucide="heart"></i>
                                    ${c.likes || 0}
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Format time ago
 */
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
