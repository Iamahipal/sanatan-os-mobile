/**
 * Secure Telegram Proxy - Vercel Serverless Function
 * Hides bot token from client-side code
 * 
 * Endpoint: /api/telegram-alert
 * Method: POST
 * Body: { report: {...} }
 */

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get environment variables (set in Vercel dashboard)
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        console.error('Telegram credentials not configured');
        return res.status(500).json({ error: 'Server not configured' });
    }

    try {
        const { report } = req.body;

        if (!report) {
            return res.status(400).json({ error: 'Report data required' });
        }

        // Build Google Maps link
        const mapLink = report.lat && report.lon
            ? `https://www.google.com/maps?q=${report.lat},${report.lon}`
            : 'Location not available';

        // Format conditions
        const conditions = Array.isArray(report.conditions)
            ? report.conditions.join(', ')
            : report.conditions || 'Unknown';

        // Build message
        const message = `
🚨 *NEW COW RESCUE ALERT* 🚨

📋 *Case ID:* ${report.caseId || 'N/A'}
🩹 *Condition:* ${conditions}
📍 *Address:* ${report.location || 'Not provided'}
🗺️ *Map:* [Open Location](${mapLink})
📞 *Reporter:* ${report.contact || 'N/A'}
🏛️ *State:* ${report.state || 'Unknown'}
📝 *Details:* ${report.description || 'None'}

⏰ *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

_Please coordinate with nearest Gaushala immediately!_
        `.trim();

        // Send to Telegram
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            })
        });

        const result = await telegramResponse.json();

        if (result.ok) {
            return res.status(200).json({ success: true, message: 'Alert sent!' });
        } else {
            console.error('Telegram error:', result);
            return res.status(500).json({ success: false, error: result.description });
        }
    } catch (error) {
        console.error('Telegram proxy error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
