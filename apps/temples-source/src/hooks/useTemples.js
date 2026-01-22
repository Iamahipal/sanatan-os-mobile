import { useState, useEffect } from 'react';

export function useTemples() {
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTemples() {
            try {
                // Use relative path for fetching data in sub-directory deployment
                const response = await fetch(`${import.meta.env.BASE_URL}data/index.json`);
                if (!response.ok) {
                    throw new Error('Failed to fetch temples data');
                }
                const data = await response.json();

                // Prepend base URL to image paths so they resolve correctly
                const processTemples = data.map(t => {
                    const cleanPath = t.thumbnail.startsWith('/') ? t.thumbnail.slice(1) : t.thumbnail;
                    return {
                        ...t,
                        thumbnail: `${import.meta.env.BASE_URL}${cleanPath}`,
                        image: `${import.meta.env.BASE_URL}${cleanPath}`
                    };
                });

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
