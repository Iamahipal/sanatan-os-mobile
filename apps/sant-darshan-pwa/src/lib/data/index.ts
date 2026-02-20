import { SAINTS as RawSaints, TRADITIONS as RawTraditions } from './saints-data';
import type { Saint, Tradition } from '../domain/types';

// Map raw data into properly typed domain models
export const traditions: Tradition[] = Object.values(RawTraditions).map((t: any) => ({
    id: t.id,
    name: t.name,
    nameHi: t.nameHi,
    icon: t.icon,
    color: t.color || '#FF9933',
    description: t.description || ''
}));

export const saints: Saint[] = RawSaints.map((s: any) => ({
    id: s.id,
    name: {
        en: s.name,
        hi: s.nameHi,
        local: s.nameLocal
    },
    traditionId: s.tradition,
    sampradaya: s.sampradaya,
    period: s.period,
    works: s.works || [],
    quotes: s.quotes || [],
    image: s.image || '',
    places: s.places || []
}));
