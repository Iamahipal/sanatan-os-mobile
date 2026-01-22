import { useState, useEffect } from 'react';

export function useTemples() {
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTemples() {
            try {
                const response = await fetch('/data/index.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch temples data');
                }
                const data = await response.json();
                // Since we are in the 'temples-web' app but data paths might be relative to the old app,
                // we might need to adjust thumbnail paths if they are not just 'data/...' but relative.
                // Assuming data/index.json contains paths like "data/temples/somnath/..."
                // In our new structure, public/data is the root.
                // So a path "data/temples/somnath/image.png" becomes "/data/temples/somnath/image.png".

                const processTemples = data.map(t => ({
                    ...t,
                    // Ensure path starts with / so it's absolute to domain root
                    thumbnail: t.thumbnail.startsWith('/') ? t.thumbnail : `/${t.thumbnail}`,
                    image: t.thumbnail.startsWith('/') ? t.thumbnail : `/${t.thumbnail}`
                }));

                setTemples(processTemples);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchTemples();
    }, []);

    return { temples, loading, error };
}
