import MiniSearch from 'minisearch';
import type { Saint } from '../domain/types';

class SearchEngine {
    private miniSearch: MiniSearch<Saint>;
    private isIndexed = false;

    constructor() {
        this.miniSearch = new MiniSearch({
            fields: ['name.en', 'name.hi', 'name.local', 'sampradaya', 'period', 'worksString'],
            storeFields: ['id', 'name', 'traditionId', 'image', 'period', 'sampradaya'],
            extractField: (document: any, fieldName: string) => {
                // Handle nested fields like name.en
                return fieldName.split('.').reduce((doc: any, key: string) => doc && doc[key], document);
            },
            searchOptions: {
                boost: { 'name.en': 10, 'name.hi': 10, 'name.local': 10, 'worksString': 2 },
                fuzzy: 0.2, // typo tolerance
                prefix: true // allows partial matching while typing
            }
        });
    }

    public indexData(saints: Saint[]) {
        if (this.isIndexed) return;

        // Map works from string[] to single string for better searching
        const processedSaints = saints.map(s => ({
            ...s,
            worksString: s.works?.join(' ') || ''
        }));

        this.miniSearch.addAll(processedSaints);
        this.isIndexed = true;
    }

    public search(query: string, traditionFilter?: string) {
        if (!query.trim()) return [];

        return this.miniSearch.search(query, {
            filter: (result) => {
                if (traditionFilter && traditionFilter !== 'all') {
                    return result.traditionId === traditionFilter;
                }
                return true;
            }
        });
    }
}

export const searchEngine = new SearchEngine();
