/**
 * Chat Engine - UI Logic for Krishna Vaani
 */

(function () {
    'use strict';

    // === DOM ELEMENTS ===
    const elements = {
        welcomeScreen: document.getElementById('welcome-screen'),
        chatMessages: document.getElementById('chat-messages'),
        typingIndicator: document.getElementById('typing-indicator'),
        userInput: document.getElementById('user-input'),
        sendBtn: document.getElementById('send-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        settingsModal: document.getElementById('settings-modal'),
        closeSettings: document.getElementById('close-settings'),
        apiKeyInput: document.getElementById('api-key-input'),
        saveApiKey: document.getElementById('save-api-key'),
        toggleKeyVisibility: document.getElementById('toggle-key-visibility'),
        darkModeToggle: document.getElementById('dark-mode-toggle'),
        clearChat: document.getElementById('clear-chat'),
        apiSetupModal: document.getElementById('api-setup-modal'),
        setupApiKey: document.getElementById('setup-api-key'),
        startJourney: document.getElementById('start-journey'),
        suggestionChips: document.querySelectorAll('.suggestion-chip')
    };

    // === STATE ===
    let isProcessing = false;

    // === INITIALIZATION ===
    function init() {
        // No API key needed - using Vercel proxy!
        // Just load existing chat or show welcome
        loadExistingChat();

        // Setup event listeners
        setupEventListeners();

        // Auto-resize textarea
        setupAutoResize();

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // === API SETUP ===
    function showApiSetupModal() {
        elements.apiSetupModal.classList.add('active');
    }

    function hideApiSetupModal() {
        elements.apiSetupModal.classList.remove('active');
    }

    // === EVENT LISTENERS ===
    function setupEventListeners() {
        // Send message
        elements.sendBtn.addEventListener('click', sendMessage);
        elements.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Input change - enable/disable send button
        elements.userInput.addEventListener('input', () => {
            elements.sendBtn.disabled = !elements.userInput.value.trim();
        });

        // Suggestion chips
        elements.suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.dataset.question;
                elements.userInput.value = question;
                elements.sendBtn.disabled = false;
                sendMessage();
            });
        });

        // Settings modal (optional - only if button exists)
        if (elements.settingsBtn) {
            elements.settingsBtn.addEventListener('click', () => {
                elements.settingsModal.classList.add('active');
                elements.apiKeyInput.value = krishnaBrain.apiKey || '';
            });
        }

        elements.closeSettings.addEventListener('click', () => {
            elements.settingsModal.classList.remove('active');
        });

        elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === elements.settingsModal) {
                elements.settingsModal.classList.remove('active');
            }
        });

        // Toggle API key visibility
        elements.toggleKeyVisibility.addEventListener('click', () => {
            const input = elements.apiKeyInput;
            input.type = input.type === 'password' ? 'text' : 'password';
        });

        // Save API key
        elements.saveApiKey.addEventListener('click', () => {
            const key = elements.apiKeyInput.value.trim();
            if (key) {
                krishnaBrain.setApiKey(key);
                showToast('API key saved successfully!');
                elements.settingsModal.classList.remove('active');
            }
        });

        // Clear chat
        elements.clearChat.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all conversations?')) {
                krishnaBrain.clearHistory();
                elements.chatMessages.innerHTML = '';
                elements.chatMessages.classList.remove('active');
                elements.welcomeScreen.style.display = 'flex';
                showToast('Conversations cleared');
            }
        });

        // API Setup modal
        elements.setupApiKey.addEventListener('input', () => {
            elements.startJourney.disabled = !elements.setupApiKey.value.trim();
        });

        elements.startJourney.addEventListener('click', () => {
            const key = elements.setupApiKey.value.trim();
            if (key) {
                krishnaBrain.setApiKey(key);
                hideApiSetupModal();
                showToast('Welcome! Krishna is ready to guide you');
            }
        });

        // Close modal on outside click
        elements.apiSetupModal.addEventListener('click', (e) => {
            // Don't close setup modal on outside click - force key entry
        });
    }

    // === AUTO RESIZE TEXTAREA ===
    function setupAutoResize() {
        elements.userInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    // === SEND MESSAGE ===
    async function sendMessage() {
        const message = elements.userInput.value.trim();
        if (!message || isProcessing) return;

        // Check API key
        if (!krishnaBrain.hasApiKey()) {
            showApiSetupModal();
            return;
        }

        isProcessing = true;
        elements.sendBtn.disabled = true;

        // Hide welcome, show chat
        elements.welcomeScreen.style.display = 'none';
        elements.chatMessages.classList.add('active');

        // Add user message to UI
        addMessage('user', message);

        // Clear input
        elements.userInput.value = '';
        elements.userInput.style.height = 'auto';

        // Show typing indicator
        elements.typingIndicator.style.display = 'flex';
        scrollToBottom();

        try {
            // Get Krishna's response
            const response = await krishnaBrain.chat(message);

            // Hide typing indicator
            elements.typingIndicator.style.display = 'none';

            // Add Krishna's response
            addMessage('krishna', response);

        } catch (error) {
            elements.typingIndicator.style.display = 'none';

            let errorMsg = error.message;
            if (errorMsg.includes('API key')) {
                showApiSetupModal();
            } else {
                addMessage('krishna', `<p>Forgive me, dear one. I encountered an issue: ${errorMsg}</p><p>Please try again, or check your settings.</p>`);
            }
        }

        isProcessing = false;
        elements.sendBtn.disabled = !elements.userInput.value.trim();
    }

    // === ADD MESSAGE TO UI ===
    function addMessage(type, content, useTypewriter = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        messageDiv.appendChild(contentDiv);

        elements.chatMessages.appendChild(messageDiv);

        if (type === 'krishna' && useTypewriter) {
            // Typewriter effect for Krishna's responses
            typewriterEffect(contentDiv, content);
        } else {
            // Instant for user messages
            contentDiv.innerHTML = content;
        }

        scrollToBottom();

        // Re-init Lucide icons if needed
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // === TYPEWRITER STREAMING EFFECT ===
    function typewriterEffect(element, htmlContent) {
        // Parse HTML to extract text and preserve structure
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Get all text nodes and their content
        const textContent = tempDiv.textContent || tempDiv.innerText;
        const words = textContent.split(/(\s+)/); // Split by whitespace, keeping spaces

        let currentIndex = 0;
        let displayedText = '';

        // Create a cursor element
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.textContent = '▊';
        cursor.style.cssText = `
            animation: cursorBlink 0.8s infinite;
            color: var(--primary);
            font-weight: 300;
            margin-left: 2px;
        `;

        // Add cursor animation if not exists
        if (!document.getElementById('typewriter-styles')) {
            const style = document.createElement('style');
            style.id = 'typewriter-styles';
            style.textContent = `
                @keyframes cursorBlink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Speed settings (words per interval)
        const baseDelay = 30; // milliseconds between words
        const variableDelay = 20; // random variation

        function typeNextWord() {
            if (currentIndex < words.length) {
                displayedText += words[currentIndex];
                currentIndex++;

                // Render partial content with cursor
                element.innerHTML = formatPartialText(displayedText);
                element.appendChild(cursor);

                scrollToBottom();

                // Variable speed for natural feel
                const delay = baseDelay + Math.random() * variableDelay;

                // Pause slightly longer on punctuation
                const lastChar = displayedText.slice(-1);
                const extraDelay = '.!?'.includes(lastChar) ? 200 :
                    ',;:'.includes(lastChar) ? 80 : 0;

                setTimeout(typeNextWord, delay + extraDelay);
            } else {
                // Done typing - show full formatted content, remove cursor
                element.innerHTML = htmlContent;

                // Re-init Lucide icons if any
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        }

        // Start typing
        typeNextWord();
    }

    // === FORMAT PARTIAL TEXT ===
    function formatPartialText(text) {
        // Simple formatting for partial text during typing
        // Wrap in paragraph tags for consistency
        return `<p>${text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
    }

    // === LOAD EXISTING CHAT ===
    function loadExistingChat() {
        const history = krishnaBrain.loadHistory();

        if (history.length > 0) {
            elements.welcomeScreen.style.display = 'none';
            elements.chatMessages.classList.add('active');

            for (const msg of history) {
                const type = msg.role === 'user' ? 'user' : 'krishna';
                const content = msg.role === 'user' ?
                    `<p>${msg.content}</p>` :
                    krishnaBrain.formatResponse(msg.content);
                addMessage(type, content, false); // No typewriter for history
            }
        }
    }

    // === SCROLL TO BOTTOM ===
    function scrollToBottom() {
        const container = document.querySelector('.chat-container');
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }

    // === TOAST NOTIFICATION ===
    function showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #1A1A19;
            color: white;
            padding: 12px 24px;
            border-radius: 100px;
            font-size: 0.875rem;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1), fadeOut 0.3s ease 2.5s forwards;
        `;

        document.body.appendChild(toast);

        // Add animation styles if not exists
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove after animation
        setTimeout(() => toast.remove(), 3000);
    }

    // === INITIALIZE ON DOM READY ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
