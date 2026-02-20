export interface SaintName {
    en: string; // English
    hi?: string; // Hindi
    local?: string; // Local script (e.g. Tamil, Gurmukhi)
}

export interface Saint {
    id: string;
    name: SaintName;
    traditionId: 'hindu' | 'sikh' | 'jain' | 'buddhist';
    sampradaya?: string;
    period: string;
    works?: string[];
    quotes: string[];
    image: string; // Relative path or URL
    places?: string[];
}

export interface Tradition {
    id: 'hindu' | 'sikh' | 'jain' | 'buddhist';
    name: string;
    nameHi: string;
    icon: string;
    color: string;
    description: string;
}
