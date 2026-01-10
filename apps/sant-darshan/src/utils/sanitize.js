/**
 * Sant Darshan App - Input Sanitization
 * Security utilities to prevent XSS and injection attacks
 */

// HTML entities map for escaping
const HTML_ENTITIES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for HTML insertion
 */
export function escapeHtml(str) {
    if (typeof str !== 'string') {
        return String(str ?? '');
    }
    return str.replace(/[&<>"'`=/]/g, char => HTML_ENTITIES[char]);
}

/**
 * Sanitize user input for storage
 * Removes potentially dangerous content while preserving legitimate text
 * @param {string} input - User input to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input, options = {}) {
    const {
        maxLength = 10000,
        allowNewlines = true,
        trimWhitespace = true
    } = options;

    if (typeof input !== 'string') {
        return '';
    }

    let sanitized = input;

    // Trim if requested
    if (trimWhitespace) {
        sanitized = sanitized.trim();
    }

    // Remove null bytes and other control characters (except newlines/tabs if allowed)
    if (allowNewlines) {
        sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    } else {
        sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, ' ');
    }

    // Normalize unicode to prevent homograph attacks
    sanitized = sanitized.normalize('NFC');

    // Truncate to max length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.slice(0, maxLength);
    }

    return sanitized;
}

/**
 * Sanitize for use in HTML attributes
 * @param {string} str - String to sanitize
 * @returns {string} Safe for use in HTML attributes
 */
export function sanitizeAttribute(str) {
    if (typeof str !== 'string') {
        return String(str ?? '');
    }
    // Escape and remove any attribute-breaking characters
    return escapeHtml(str).replace(/[\n\r]/g, ' ');
}

/**
 * Sanitize a CSS value (for inline styles)
 * @param {string} value - CSS value to sanitize
 * @returns {string} Safe CSS value
 */
export function sanitizeCssValue(value) {
    if (typeof value !== 'string') {
        return '';
    }
    // Remove anything that could break out of CSS context
    return value
        .replace(/[;<>{}]/g, '')
        .replace(/expression\s*\(/gi, '')
        .replace(/url\s*\(/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
}

/**
 * Sanitize an ID (for data attributes and element IDs)
 * @param {string} id - ID to sanitize
 * @returns {string} Safe ID string
 */
export function sanitizeId(id) {
    if (typeof id !== 'string') {
        return String(id ?? '');
    }
    // Only allow alphanumeric, hyphens, and underscores
    return id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100);
}

/**
 * Create a safe text node (cannot execute scripts)
 * @param {string} text - Text content
 * @returns {Text} Text node
 */
export function createSafeTextNode(text) {
    return document.createTextNode(String(text ?? ''));
}

/**
 * Safely set text content of an element
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text to set
 */
export function setTextContent(element, text) {
    if (element && typeof element.textContent !== 'undefined') {
        element.textContent = String(text ?? '');
    }
}

/**
 * Validate and sanitize a URL
 * @param {string} url - URL to validate
 * @param {Array<string>} allowedProtocols - Allowed protocols
 * @returns {string|null} Safe URL or null if invalid
 */
export function sanitizeUrl(url, allowedProtocols = ['http:', 'https:']) {
    if (typeof url !== 'string') {
        return null;
    }

    try {
        const parsed = new URL(url);
        if (allowedProtocols.includes(parsed.protocol)) {
            return parsed.href;
        }
    } catch {
        // Not a valid URL
    }

    return null;
}

/**
 * Sanitize JSON before parsing (defense in depth)
 * @param {string} jsonString - JSON string to parse
 * @returns {Object|null} Parsed object or null if invalid
 */
export function safeJsonParse(jsonString) {
    if (typeof jsonString !== 'string') {
        return null;
    }

    try {
        // Remove any potential prototype pollution attempts
        const parsed = JSON.parse(jsonString);

        if (parsed && typeof parsed === 'object') {
            // Remove __proto__ and constructor if present
            delete parsed.__proto__;
            delete parsed.constructor;
            delete parsed.prototype;
        }

        return parsed;
    } catch {
        return null;
    }
}

/**
 * Deep clone an object safely (removes circular refs and dangerous props)
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function safeClone(obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch {
        return null;
    }
}

/**
 * Template literal tag for safe HTML strings
 * Escapes interpolated values automatically
 * @example html`<div>${userInput}</div>` // userInput is escaped
 */
export function html(strings, ...values) {
    return strings.reduce((result, str, i) => {
        const value = values[i - 1];
        const escaped = typeof value === 'string' ? escapeHtml(value) : String(value ?? '');
        return result + escaped + str;
    });
}

/**
 * Check if a string contains potential XSS patterns
 * @param {string} str - String to check
 * @returns {boolean} True if suspicious patterns found
 */
export function hasSuspiciousPatterns(str) {
    if (typeof str !== 'string') return false;

    const patterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,  // onclick=, onerror=, etc.
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /data:/i,
        /vbscript:/i
    ];

    return patterns.some(pattern => pattern.test(str));
}
