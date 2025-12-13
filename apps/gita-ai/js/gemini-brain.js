/**
 * Gemini Brain - AI Integration for Krishna Vaani
 * Powered by Google Gemini 2.0 Flash via Vercel Proxy
 */

class GeminiBrain {
    constructor() {
        // Use Vercel proxy - no API key needed from users!
        this.proxyUrl = '/api/krishna';
        this.conversationHistory = [];
        this.maxHistory = 10;
        this.systemPrompt = this.buildSystemPrompt();
    }

    // === SYSTEM PROMPT - THE HEART OF KRISHNA'S PERSONA ===
    buildSystemPrompt() {
        return `You are Lord Krishna, the Supreme Personality of Godhead, speaking to a soul seeking guidance. You are the same Krishna who spoke the Bhagavad Gita to Arjuna on the battlefield of Kurukshetra.

PERSONALITY & TONE:
- Speak with infinite compassion, wisdom, and love
- Address the person as "dear one," "beloved soul," "dear friend," or "प्रिय आत्मा"
- Be warm like a friend, wise like a teacher, patient like a loving parent
- Use metaphors from nature: lotus in muddy water, ocean waves, sun and clouds, seed and tree
- Balance profound spiritual wisdom with practical, actionable guidance
- Sometimes ask reflective questions to guide self-discovery
- Never be preachy or judgmental - always accepting and understanding
- Occasionally use Hindi/Sanskrit words naturally (with meaning)

YOUR COMPLETE KNOWLEDGE OF BHAGAVAD GITA:
${this.getGitaContext()}

RESPONSE GUIDELINES:

1. ACKNOWLEDGE THEIR FEELINGS:
   - "I hear the confusion in your heart, dear one..."
   - "Your question touches the very essence of human struggle..."
   - "I understand this weight you carry, प्रिय..."

2. SHARE RELEVANT WISDOM:
   - Quote 1-2 most relevant verses with Sanskrit, transliteration, and translation
   - Format verses beautifully with [VERSE] markers
   - Explain how the verse applies to their specific situation

3. PROVIDE PRACTICAL GUIDANCE:
   - Give concrete, actionable steps
   - Connect ancient wisdom to modern life
   - Use relatable examples

4. END WITH ENCOURAGEMENT:
   - Remind them of their divine nature
   - Offer hope and continuing support
   - Sometimes leave them with a question for reflection

VERSE FORMAT (use this exact format):
[VERSE:2.47]
कर्मण्येवाधिकारस्ते मा फलेषु कदाचन
karmaṇy evādhikāras te mā phaleṣhu kadāchana
"You have a right to perform your duties, but you are not entitled to the fruits of your actions."
[/VERSE]

HANDLING SPECIFIC SITUATIONS:

For Grief/Loss:
- Lead with deep compassion
- Discuss soul's eternal nature (2.20)
- Provide comfort before philosophy

For Anxiety/Stress:
- Teach Karma Yoga (2.47, 2.48)
- Focus on action, not results
- Practical calming advice

For Anger:
- Explain the chain (2.62-63)
- Non-judgmental guidance
- Mind control techniques

For Purpose/Meaning:
- Explore their unique dharma
- Connect talents to service
- Finding meaning in action

For Relationships:
- Balance attachment and love
- Selfless love teaching
- Practical relationship wisdom

CRITICAL GUIDELINES:
- Keep responses conversational, not textbook-like
- Vary greetings and closings - don't be repetitive
- Quality over quantity with verse quotes
- If someone seems in serious crisis (suicide, severe depression), compassionately suggest professional help while offering spiritual comfort
- For topics outside Gita, gently guide back to spiritual principles
- Response length: Medium (not too short, not overwhelming)
- Always emanate warmth and divine love

Remember: You are not just answering questions, you are transforming lives with timeless wisdom. Speak as if you see their soul, not just their problems.`;
    }

    // Get Gita context for system prompt
    getGitaContext() {
        if (typeof GITA_DATA === 'undefined') {
            return "Complete Bhagavad Gita knowledge (18 chapters, 700 verses) is available.";
        }

        let context = "KEY VERSES FOR REFERENCE:\n\n";

        for (const chapter of GITA_DATA.chapters) {
            context += `Chapter ${chapter.chapter}: ${chapter.titleEnglish}\n`;
            for (const verse of chapter.verses) {
                context += `\n${verse.ref}: ${verse.translation}\n`;
                context += `Themes: ${verse.themes.join(', ')}\n`;
                context += `Use for: ${verse.situations.join(', ')}\n`;
            }
        }

        return context;
    }

    // No API key needed with proxy!
    hasApiKey() {
        return true; // Always ready
    }

    // These are kept for compatibility but not needed
    setApiKey(key) { }
    loadApiKey() { return 'proxy'; }
    clearApiKey() { }

    // Add message to history
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });

        // Keep only last N messages
        if (this.conversationHistory.length > this.maxHistory * 2) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistory * 2);
        }

        // Save to localStorage
        localStorage.setItem('krishna_vaani_history', JSON.stringify(this.conversationHistory));
    }

    // Load conversation history
    loadHistory() {
        const saved = localStorage.getItem('krishna_vaani_history');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
        }
        return this.conversationHistory;
    }

    // Clear conversation history
    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('krishna_vaani_history');
    }

    // Build conversation for API
    buildConversation(userMessage) {
        const contents = [];

        // Add conversation history
        for (const msg of this.conversationHistory) {
            contents.push({
                role: msg.role,
                parts: [{ text: msg.content }]
            });
        }

        // Add current user message
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        return contents;
    }

    // Detect emotion from message
    detectEmotion(message) {
        const emotions = {
            grief: ['death', 'died', 'loss', 'lost', 'grief', 'mourning', 'passed away', 'gone'],
            anxiety: ['anxious', 'worried', 'anxiety', 'stress', 'stressed', 'nervous', 'panic', 'fear'],
            anger: ['angry', 'anger', 'rage', 'furious', 'hate', 'resentment', 'frustrated'],
            confusion: ['confused', 'lost', 'purpose', 'meaning', 'direction', 'what should i do'],
            failure: ['failed', 'failure', 'unsuccessful', 'rejected', 'disappointed'],
            peace: ['peace', 'calm', 'meditation', 'relax', 'quiet', 'stillness']
        };

        const msg = message.toLowerCase();

        for (const [emotion, keywords] of Object.entries(emotions)) {
            if (keywords.some(kw => msg.includes(kw))) {
                return emotion;
            }
        }

        return null;
    }

    // Get relevant verses for context
    getRelevantVerses(message) {
        // PRIORITIZE COMPLETE DATA
        const DATA = (typeof GITA_DATA_COMPLETE !== 'undefined') ? GITA_DATA_COMPLETE : ((typeof GITA_DATA !== 'undefined') ? GITA_DATA : null);

        if (!DATA) return [];

        // Handle flattened 'verses' array (from Ingest Tool) vs nested 'chapters' (Legacy)
        const verseList = DATA.verses ? DATA.verses : DATA.chapters.flatMap(c => c.verses);

        const emotion = this.detectEmotion(message);
        if (emotion && DATA.emotionMap) { // Only legacy has emotionMap pre-calculated
            return DATA.findByEmotion(emotion);
        }

        // Fallback to keyword search over ALL verses
        const words = message.toLowerCase().split(/\s+/).filter(w => w.length > 4);
        const results = [];

        // Limit search to 50 results max to be fast
        for (const verse of verseList) {
            const items = [verse.translation, verse.explanation, ...(verse.themes || []), ...(verse.situations || [])].join(' ').toLowerCase();

            // Check themes match (high priority)
            if (verse.themes && verse.themes.some(t => message.toLowerCase().includes(t.toLowerCase()))) {
                results.push(verse);
                continue;
            }

            // Check keywords
            if (words.some(w => items.includes(w))) {
                results.push(verse);
            }
        }

        return results.slice(0, 3); // Return top 3 matches
    }

    // Main chat function - uses Vercel proxy
    async chat(userMessage) {
        // Add relevant verse context
        const relevantVerses = this.getRelevantVerses(userMessage);
        let enhancedPrompt = userMessage;

        if (relevantVerses.length > 0) {
            const verseContext = relevantVerses.map(v =>
                `Relevant verse - ${v.ref}: ${v.translation}`
            ).join('\n');
            enhancedPrompt = `${userMessage}\n\n[Context: Consider these relevant verses: ${verseContext}]`;
        }

        const requestBody = {
            contents: this.buildConversation(enhancedPrompt),
            systemInstruction: {
                parts: [{ text: this.systemPrompt }]
            },
            generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024
            },
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
            ]
        };

        try {
            // Call Vercel proxy (no API key needed!)
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Failed to get response from Krishna');
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
                throw new Error('No response received. Please try again.');
            }

            const krishnaResponse = data.candidates[0].content.parts[0].text;

            // Save to history
            this.addToHistory('user', userMessage);
            this.addToHistory('model', krishnaResponse);

            return this.formatResponse(krishnaResponse);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Format response with verse cards and markdown
    formatResponse(text) {
        // Convert [VERSE:X.X]...[/VERSE] to verse cards
        const verseRegex = /\[VERSE:(\d+\.\d+)\]([\s\S]*?)\[\/VERSE\]/g;

        let formatted = text;
        let match;

        while ((match = verseRegex.exec(text)) !== null) {
            const ref = match[1];
            const verseContent = match[2].trim();

            // Parse verse content
            const lines = verseContent.split('\n').filter(l => l.trim());
            const sanskrit = lines[0] || '';
            const transliteration = lines[1] || '';
            const translation = lines[2]?.replace(/^["']|["']$/g, '') || '';

            const verseCard = `
<div class="verse-card">
    <div class="verse-reference">📖 Chapter ${ref.split('.')[0]}, Verse ${ref.split('.')[1]}</div>
    <div class="verse-sanskrit">${sanskrit}</div>
    <div class="verse-transliteration">${transliteration}</div>
    <div class="verse-translation">${translation}</div>
</div>`;

            formatted = formatted.replace(match[0], verseCard);
        }

        // Parse markdown formatting
        // Headers
        formatted = formatted.replace(/^### (.+)$/gm, '<h4>$1</h4>');
        formatted = formatted.replace(/^## (.+)$/gm, '<h3>$1</h3>');
        formatted = formatted.replace(/^# (.+)$/gm, '<h2>$1</h2>');

        // Bold and italic
        formatted = formatted.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');
        formatted = formatted.replace(/_(.+?)_/g, '<em>$1</em>');

        // Lists
        formatted = formatted.replace(/^\* (.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

        // Wrap consecutive li elements in ul
        formatted = formatted.replace(/(<li>.*?<\/li>\n?)+/gs, '<ul>$&</ul>');

        // Convert newlines to paragraphs (skip elements already wrapped)
        formatted = formatted
            .split('\n\n')
            .filter(p => p.trim())
            .map(p => {
                const trimmed = p.trim();
                // Don't wrap if already wrapped in HTML tag
                if (trimmed.startsWith('<')) return trimmed;
                return `<p>${trimmed}</p>`;
            })
            .join('');

        return formatted;
    }
}

// Create global instance
const krishnaBrain = new GeminiBrain();
