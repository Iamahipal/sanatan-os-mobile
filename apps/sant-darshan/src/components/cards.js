/**
 * Sant Darshan App - Card Components
 * Reusable card components for traditions and saints
 */

import { createElement } from '../utils/dom.js';
import { escapeHtml, sanitizeId } from '../utils/sanitize.js';
import { getInitials } from '../utils/helpers.js';
import storage from '../services/storage.js';
import { TRADITIONS } from '../data/traditions.js';
import { getTraditionSaintCount } from '../services/saints.js';

/**
 * Create a tradition card element
 * @param {Object} tradition - Tradition data
 * @param {Object} options - Card options
 * @returns {HTMLElement}
 */
export function createTraditionCard(tradition, options = {}) {
    const {
        onClick = null,
        showCount = true
    } = options;

    const count = getTraditionSaintCount(tradition.id);

    const card = createElement('div', {
        className: 'tradition-card',
        dataset: { tradition: tradition.id },
        style: { '--tradition-color': tradition.color }
    }, [
        createElement('div', { className: 'tradition-card-icon' }, [
            createElement('span', { className: 'tradition-icon-text' }, tradition.icon)
        ]),
        createElement('div', { className: 'tradition-card-content' }, [
            createElement('h3', { className: 'tradition-card-title' }, tradition.name),
            createElement('p', {
                className: 'tradition-card-title-hi',
                lang: 'hi'
            }, tradition.nameHi),
            showCount && count > 0
                ? createElement('span', { className: 'tradition-card-count' }, `${count} saints`)
                : null
        ].filter(Boolean))
    ]);

    if (onClick) {
        card.addEventListener('click', () => onClick(tradition));
        card.style.cursor = 'pointer';
    }

    return card;
}

/**
 * Create a saint card element
 * @param {Object} saint - Saint data
 * @param {Object} options - Card options
 * @returns {HTMLElement}
 */
export function createSaintCard(saint, options = {}) {
    const {
        onClick = null,
        showExplored = true,
        showFavorite = false,
        compact = false
    } = options;

    const isExplored = storage.isExplored(saint.id);
    const isFavorite = storage.isFavorite(saint.id);
    const tradition = TRADITIONS[saint.tradition] || {};
    const initials = getInitials(saint.name);

    const card = createElement('div', {
        className: `saint-card ${compact ? 'saint-card-compact' : ''} ${isExplored ? 'explored' : ''}`,
        dataset: { saint: saint.id, tradition: saint.tradition }
    }, [
        // Avatar
        createElement('div', {
            className: 'saint-card-avatar',
            style: { background: tradition.gradient || 'var(--primary-gradient)' }
        }, [
            createElement('span', { className: 'saint-avatar-initials' }, initials)
        ]),

        // Info
        createElement('div', { className: 'saint-card-info' }, [
            createElement('h4', { className: 'saint-card-name' }, escapeHtml(saint.name)),
            saint.nameLocal ? createElement('p', {
                className: 'saint-card-name-local'
            }, escapeHtml(saint.nameLocal)) : null,
            createElement('div', { className: 'saint-card-meta' }, [
                createElement('span', {
                    className: 'saint-card-sampradaya',
                    style: { color: tradition.color }
                }, escapeHtml(saint.sampradaya || '')),
                saint.period ? createElement('span', {
                    className: 'saint-card-period'
                }, escapeHtml(saint.period)) : null
            ].filter(Boolean))
        ].filter(Boolean)),

        // Right side
        createElement('div', { className: 'saint-card-right' }, [
            showExplored && !isExplored
                ? createElement('span', { className: 'badge badge-new' }, 'New')
                : null,
            showExplored && isExplored
                ? createElement('span', { className: 'badge badge-explored' }, [
                    createElement('i', { className: 'fas fa-check' })
                ])
                : null,
            showFavorite && isFavorite
                ? createElement('span', { className: 'badge badge-favorite' }, [
                    createElement('i', { className: 'fas fa-heart' })
                ])
                : null,
            createElement('i', { className: 'fas fa-chevron-right saint-card-arrow' })
        ].filter(Boolean))
    ]);

    if (onClick) {
        card.addEventListener('click', () => onClick(saint));
        card.style.cursor = 'pointer';
    }

    return card;
}

/**
 * Create a favorites carousel item
 * @param {Object} saint - Saint data
 * @param {Object} options - Options
 * @returns {HTMLElement}
 */
export function createFavoriteCard(saint, options = {}) {
    const { onClick = null } = options;
    const tradition = TRADITIONS[saint.tradition] || {};
    const initials = getInitials(saint.name);

    const card = createElement('div', {
        className: 'favorite-card',
        dataset: { saint: saint.id }
    }, [
        createElement('div', {
            className: 'favorite-avatar',
            style: { background: tradition.gradient || 'var(--primary-gradient)' }
        }, [
            createElement('span', {}, initials)
        ]),
        createElement('span', { className: 'favorite-name' }, escapeHtml(saint.name))
    ]);

    if (onClick) {
        card.addEventListener('click', () => onClick(saint));
        card.style.cursor = 'pointer';
    }

    return card;
}

/**
 * Create today's saint card
 * @param {Object} saint - Saint data
 * @param {Object} options - Options
 * @returns {HTMLElement}
 */
export function createTodaySaintCard(saint, options = {}) {
    const { onClick = null } = options;
    const tradition = TRADITIONS[saint.tradition] || {};

    const card = createElement('div', {
        className: 'today-saint-card',
        dataset: { saint: saint.id }
    }, [
        createElement('div', { className: 'today-saint-header' }, [
            createElement('span', { className: 'today-saint-label' }, "Today's Saint"),
            createElement('i', { className: 'fas fa-sun today-saint-icon' })
        ]),
        createElement('div', { className: 'today-saint-content' }, [
            createElement('div', {
                className: 'today-saint-avatar',
                style: { background: tradition.gradient || 'var(--primary-gradient)' }
            }, [
                createElement('span', {}, getInitials(saint.name))
            ]),
            createElement('div', { className: 'today-saint-info' }, [
                createElement('h3', { className: 'today-saint-name' }, escapeHtml(saint.name)),
                createElement('p', { className: 'today-saint-tradition' }, escapeHtml(saint.sampradaya || tradition.name)),
                saint.quotes?.[0] ? createElement('p', { className: 'today-saint-quote' },
                    escapeHtml(saint.quotes[0].slice(0, 100) + (saint.quotes[0].length > 100 ? '...' : ''))
                ) : null
            ].filter(Boolean))
        ]),
        createElement('div', { className: 'today-saint-action' }, [
            createElement('span', {}, 'View Saint'),
            createElement('i', { className: 'fas fa-arrow-right' })
        ])
    ]);

    if (onClick) {
        card.addEventListener('click', () => onClick(saint));
        card.style.cursor = 'pointer';
    }

    return card;
}

/**
 * Create an action card for the home screen
 * @param {Object} action - Action configuration
 * @returns {HTMLElement}
 */
export function createActionCard(action) {
    const {
        id,
        icon,
        title,
        subtitle,
        onClick = null,
        badge = null,
        color = 'var(--primary-color)'
    } = action;

    const card = createElement('div', {
        className: 'action-card',
        dataset: { action: id }
    }, [
        createElement('div', { className: 'action-card-icon', style: { color } }, [
            createElement('i', { className: icon })
        ]),
        createElement('div', { className: 'action-card-content' }, [
            createElement('h4', { className: 'action-card-title' }, title),
            subtitle ? createElement('p', { className: 'action-card-subtitle' }, subtitle) : null
        ].filter(Boolean)),
        badge ? createElement('span', { className: 'action-card-badge' }, badge) : null
    ].filter(Boolean));

    if (onClick) {
        card.addEventListener('click', onClick);
        card.style.cursor = 'pointer';
    }

    return card;
}

/**
 * Create a stat card
 * @param {Object} stat
 * @returns {HTMLElement}
 */
export function createStatCard(stat) {
    const { icon, value, label, color = 'var(--primary-color)' } = stat;

    return createElement('div', { className: 'stat-card' }, [
        createElement('div', { className: 'stat-icon', style: { color } }, [
            createElement('i', { className: icon })
        ]),
        createElement('div', { className: 'stat-value' }, String(value)),
        createElement('div', { className: 'stat-label' }, label)
    ]);
}

/**
 * Create a progress ring (SVG)
 * @param {number} percentage - Progress percentage (0-100)
 * @param {Object} options
 * @returns {SVGElement}
 */
export function createProgressRing(percentage, options = {}) {
    const {
        size = 40,
        strokeWidth = 3,
        color = 'var(--primary-color)',
        bgColor = 'var(--surface-variant)'
    } = options;

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.classList.add('progress-ring');

    // Background circle
    const bgCircle = document.createElementNS(ns, 'circle');
    bgCircle.setAttribute('cx', size / 2);
    bgCircle.setAttribute('cy', size / 2);
    bgCircle.setAttribute('r', radius);
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', bgColor);
    bgCircle.setAttribute('stroke-width', strokeWidth);

    // Progress circle
    const progressCircle = document.createElementNS(ns, 'circle');
    progressCircle.setAttribute('cx', size / 2);
    progressCircle.setAttribute('cy', size / 2);
    progressCircle.setAttribute('r', radius);
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', color);
    progressCircle.setAttribute('stroke-width', strokeWidth);
    progressCircle.setAttribute('stroke-linecap', 'round');
    progressCircle.setAttribute('stroke-dasharray', circumference);
    progressCircle.setAttribute('stroke-dashoffset', offset);
    progressCircle.setAttribute('transform', `rotate(-90 ${size / 2} ${size / 2})`);
    progressCircle.classList.add('progress-ring-circle');

    svg.appendChild(bgCircle);
    svg.appendChild(progressCircle);

    return svg;
}

export default {
    createTraditionCard,
    createSaintCard,
    createFavoriteCard,
    createTodaySaintCard,
    createActionCard,
    createStatCard,
    createProgressRing
};
