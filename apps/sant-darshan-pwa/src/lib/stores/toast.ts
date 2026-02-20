import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

function createToastStore() {
    const { subscribe, update } = writable<ToastMessage[]>([]);

    return {
        subscribe,
        add: (message: string, type: ToastType = 'info', duration = 3000) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newToast: ToastMessage = { id, message, type };

            update(toasts => [...toasts, newToast]);

            setTimeout(() => {
                update(toasts => toasts.filter(t => t.id !== id));
            }, duration);
        },
        remove: (id: string) => {
            update(toasts => toasts.filter(t => t.id !== id));
        }
    };
}

export const toast = createToastStore();
