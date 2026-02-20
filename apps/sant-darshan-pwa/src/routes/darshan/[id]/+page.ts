import { saints } from '$lib/data';
import { error } from '@sveltejs/kit';

export const prerender = true;

export function entries() {
    // Generate static paths for all saints
    return saints.map(s => ({ id: s.id }));
}

export function load({ params }) {
    const saint = saints.find(s => s.id === params.id);

    if (!saint) {
        throw error(404, 'Saint not found');
    }

    return {
        saint
    };
}
