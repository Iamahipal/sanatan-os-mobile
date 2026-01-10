/**
 * Sant Darshan App - Core Index
 * Re-export all core modules
 */

export { default as state, StateManager, DEFAULT_STATE } from './state.js';
export { default as eventBus, Events, on, off, once, emit } from './events.js';
export { default as router, navigate, back, openModal, closeModal } from './router.js';
export { Component, createComponent, render, createList } from './component.js';
