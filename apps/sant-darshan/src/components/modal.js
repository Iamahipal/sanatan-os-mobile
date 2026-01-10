/**
 * Sant Darshan App - Modal Component
 * Base modal functionality
 */

import { createElement, addClass, removeClass, show, hide, trapFocus } from '../utils/dom.js';
import { escapeHtml } from '../utils/sanitize.js';
import { closeModal } from '../core/router.js';

/**
 * Create a modal structure
 * @param {Object} options - Modal configuration
 * @returns {HTMLElement}
 */
export function createModal(options = {}) {
    const {
        id,
        title,
        titleHi = null,
        content = null,
        footer = null,
        className = '',
        closable = true,
        fullHeight = false
    } = options;

    const modal = createElement('div', {
        id: `${id}-modal`,
        className: `modal ${className} ${fullHeight ? 'modal-full-height' : ''}`,
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': `${id}-title`
    }, [
        // Backdrop
        createElement('div', { className: 'modal-backdrop' }),

        // Modal content container
        createElement('div', { className: 'modal-container' }, [
            // Header
            createElement('div', { className: 'modal-header' }, [
                createElement('div', { className: 'modal-title-group' }, [
                    createElement('h2', {
                        id: `${id}-title`,
                        className: 'modal-title'
                    }, title),
                    titleHi ? createElement('p', {
                        className: 'modal-title-hi',
                        lang: 'hi'
                    }, titleHi) : null
                ].filter(Boolean)),
                closable ? createElement('button', {
                    className: 'modal-close',
                    'aria-label': 'Close modal',
                    onClick: () => closeModal()
                }, [
                    createElement('i', { className: 'fas fa-times' })
                ]) : null
            ].filter(Boolean)),

            // Body
            createElement('div', { className: 'modal-body' }, content),

            // Footer (optional)
            footer ? createElement('div', { className: 'modal-footer' }, footer) : null
        ].filter(Boolean))
    ]);

    return modal;
}

/**
 * Create a confirmation modal
 * @param {Object} options
 * @returns {Promise<boolean>}
 */
export function confirmModal(options = {}) {
    const {
        title = 'Confirm',
        message = 'Are you sure?',
        confirmText = 'Yes',
        cancelText = 'Cancel',
        danger = false
    } = options;

    return new Promise((resolve) => {
        const modalId = 'confirm-' + Date.now();

        const modal = createModal({
            id: modalId,
            title,
            className: 'modal-confirm',
            content: createElement('p', { className: 'confirm-message' }, message),
            footer: [
                createElement('button', {
                    className: 'btn btn-secondary',
                    onClick: () => {
                        removeConfirmModal(modal);
                        resolve(false);
                    }
                }, cancelText),
                createElement('button', {
                    className: `btn ${danger ? 'btn-danger' : 'btn-primary'}`,
                    onClick: () => {
                        removeConfirmModal(modal);
                        resolve(true);
                    }
                }, confirmText)
            ]
        });

        document.body.appendChild(modal);
        requestAnimationFrame(() => addClass(modal, 'active'));

        // Escape key handling
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                removeConfirmModal(modal);
                document.removeEventListener('keydown', escHandler);
                resolve(false);
            }
        };
        document.addEventListener('keydown', escHandler);
    });
}

function removeConfirmModal(modal) {
    removeClass(modal, 'active');
    setTimeout(() => modal.remove(), 300);
}

/**
 * Modal content builders
 */
export const ModalContent = {
    /**
     * Create a list section
     */
    list(items, renderItem) {
        return createElement('div', { className: 'modal-list' },
            items.map(renderItem)
        );
    },

    /**
     * Create a grid section
     */
    grid(items, renderItem, columns = 2) {
        const container = createElement('div', {
            className: 'modal-grid',
            style: { gridTemplateColumns: `repeat(${columns}, 1fr)` }
        }, items.map(renderItem));
        return container;
    },

    /**
     * Create a section with title
     */
    section(title, content) {
        return createElement('section', { className: 'modal-section' }, [
            createElement('h3', { className: 'modal-section-title' }, title),
            createElement('div', { className: 'modal-section-content' }, content)
        ]);
    },

    /**
     * Create an empty state
     */
    empty(message, icon = 'fa-inbox') {
        return createElement('div', { className: 'modal-empty' }, [
            createElement('i', { className: `fas ${icon} modal-empty-icon` }),
            createElement('p', { className: 'modal-empty-message' }, message)
        ]);
    },

    /**
     * Create a loading state
     */
    loading(message = 'Loading...') {
        return createElement('div', { className: 'modal-loading' }, [
            createElement('div', { className: 'loading-spinner' }),
            createElement('p', {}, message)
        ]);
    }
};

/**
 * Modal footer button builders
 */
export const ModalFooter = {
    /**
     * Single primary action
     */
    primary(text, onClick) {
        return createElement('button', {
            className: 'btn btn-primary btn-block',
            onClick
        }, text);
    },

    /**
     * Two buttons (cancel + action)
     */
    duo(cancelText, actionText, onCancel, onAction, actionDanger = false) {
        return [
            createElement('button', {
                className: 'btn btn-secondary',
                onClick: onCancel
            }, cancelText),
            createElement('button', {
                className: `btn ${actionDanger ? 'btn-danger' : 'btn-primary'}`,
                onClick: onAction
            }, actionText)
        ];
    },

    /**
     * Close button only
     */
    close(text = 'Close') {
        return createElement('button', {
            className: 'btn btn-secondary btn-block',
            onClick: () => closeModal()
        }, text);
    }
};

export default {
    createModal,
    confirmModal,
    ModalContent,
    ModalFooter
};
