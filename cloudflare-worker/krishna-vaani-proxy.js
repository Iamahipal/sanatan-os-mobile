/**
 * Krishna Vaani - Cloudflare Worker Proxy
 * This protects your Gemini API key from being exposed
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://dash.cloudflare.com/
 * 2. Create free account (no credit card needed)
 * 3. Go to Workers & Pages → Create Worker
 * 4. Paste this code
 * 5. Go to Settings → Variables → Add "GEMINI_API_KEY" with your key
 * 6. Deploy and copy your worker URL
 */

export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Max-Age': '86400',
                },
            });
        }

        // Only allow POST
        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        try {
            // Get the request body
            const body = await request.json();

            // Forward to Gemini API with your secret key
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${env.GEMINI_API_KEY}`;

            const response = await fetch(geminiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            // Return response with CORS headers
            return new Response(JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }
    },
};
