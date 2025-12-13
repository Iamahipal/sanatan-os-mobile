/**
 * Secure Telegram Proxy - Vercel Serverless Function
 * Handles Text and Photo alerts
 * Endpoint: /api/telegram-alert
 */

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: 'Server not configured' });
    }

    try {
        const { report } = req.body;
        if (!report) return res.status(400).json({ error: 'Report data required' });

        // Format message
        const mapLink = report.lat && report.lon ? `https://www.google.com/maps?q=${report.lat},${report.lon}` : 'N/A';
        const conditions = Array.isArray(report.conditions) ? report.conditions.join(', ') : report.conditions || 'Unknown';

        const caption = `
🚨 *NEW COW RESCUE ALERT* 🚨

📋 *Case ID:* ${report.caseId || 'N/A'}
🩹 *Condition:* ${conditions}
📍 *Address:* ${report.location || 'Not provided'}
🗺️ *Map:* [Open Location](${mapLink})
📞 *Reporter:* ${report.contact || 'N/A'}
🏛️ *State:* ${report.state || 'Unknown'}
📝 *Details:* ${report.description || 'None'}

⏰ *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
`.trim();

        // If Photo Exists -> sendPhoto
        if (report.photoBase64) {
            const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
            const cleanBase64 = report.photoBase64.replace(/^data:image\/\w+;base64,/, '');
            const fileBuffer = Buffer.from(cleanBase64, 'base64');

            // Construct Multipart Body Manually
            let body = `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="chat_id"\r\n\r\n${CHAT_ID}\r\n`;

            body += `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`;

            body += `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="parse_mode"\r\n\r\nMarkdown\r\n`;

            body += `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="photo"; filename="cow_rescue.jpg"\r\n`;
            body += `Content-Type: image/jpeg\r\n\r\n`;

            const footer = `\r\n--${boundary}--`;

            // Combine buffers
            const payload = Buffer.concat([
                Buffer.from(body),
                fileBuffer,
                Buffer.from(footer)
            ]);

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
                body: payload
            });

            const result = await response.json();
            if (result.ok) return res.status(200).json({ success: true, mode: 'photo' });
            else throw new Error(result.description);

        } else {
            // Text Only -> sendMessage
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: caption,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: false
                })
            });

            const result = await response.json();
            if (result.ok) return res.status(200).json({ success: true, mode: 'text' });
            else throw new Error(result.description);
        }

    } catch (error) {
        console.error('Telegram Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
