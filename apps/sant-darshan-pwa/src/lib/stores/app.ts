import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'temple';

export const theme: Writable<Theme> = writable('temple');

// Initialize theme from localStorage if available
if (browser) {
    const savedTheme = localStorage.getItem('sant-darshan-theme') as Theme;
    if (savedTheme && ['light', 'dark', 'temple'].includes(savedTheme)) {
        theme.set(savedTheme);
    }

    theme.subscribe(value => {
        localStorage.setItem('sant-darshan-theme', value);
        document.documentElement.setAttribute('data-theme', value);
    });
}

export const isSearchOpen = writable(false);
export const searchQuery = writable('');

// Bottom navigation state
export const activeTab = writable('darshan'); // 'darshan', 'saints', 'journal', 'profile'
