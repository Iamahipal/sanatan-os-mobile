/**
 * Sadhana Guru - Vow Screen Handler
 * Manages invocation and sankalpa (vow) flow
 */

const VowScreen = {
    signaturePad: null,

    /**
     * Initialize vow screens
     */
    init() {
        this._bindInvocationEvents();
        this._bindSankalpaEvents();
    },

    // ===== INVOCATION SCREEN =====

    _bindInvocationEvents() {
        const proceedBtn = document.getElementById('proceedBtn');
        proceedBtn?.addEventListener('click', () => {
            App.showScreen('sankalpa');
            this._initSignaturePad();
            this._updateTimestamps();
        });
    },

    // ===== SANKALPA SCREEN =====

    _bindSankalpaEvents() {
        const backBtn = document.getElementById('sankalpaBackBtn');
        backBtn?.addEventListener('click', () => {
            App.showScreen('invocation');
        });

        const clearBtn = document.getElementById('clearSignatureBtn');
        clearBtn?.addEventListener('click', () => {
            if (this.signaturePad) {
                this.signaturePad.clear();
                document.getElementById('sealVowBtn').disabled = true;
            }
        });

        const sealBtn = document.getElementById('sealVowBtn');
        sealBtn?.addEventListener('click', () => this._sealVow());
    },

    _initSignaturePad() {
        const canvas = document.getElementById('signatureCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Style
        ctx.strokeStyle = '#E67E22';  // Saffron color
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.touches) {
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
            }
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const startDrawing = (e) => {
            e.preventDefault();
            isDrawing = true;
            const pos = getPos(e);
            lastX = pos.x;
            lastY = pos.y;
        };

        const draw = (e) => {
            if (!isDrawing) return;
            e.preventDefault();

            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();

            lastX = pos.x;
            lastY = pos.y;

            // Enable seal button
            document.getElementById('sealVowBtn').disabled = false;
        };

        const stopDrawing = () => {
            isDrawing = false;
        };

        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch events
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        this.signaturePad = {
            canvas,
            ctx,
            clear: () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
            isEmpty: () => {
                const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                return !data.some((channel, i) => i % 4 === 3 && channel !== 0);
            },
            toDataURL: () => canvas.toDataURL()
        };
    },

    _updateTimestamps() {
        const dateEl = document.getElementById('vowDate');
        const muhurtaEl = document.getElementById('vowMuhurta');

        if (dateEl) {
            dateEl.textContent = Time.formatShortDate();
        }

        if (muhurtaEl) {
            const muhurta = Time.getCurrentMuhurta();
            muhurtaEl.textContent = `${muhurta.name} Muhurta`;
        }
    },

    _sealVow() {
        if (this.signaturePad && this.signaturePad.isEmpty()) {
            App.showToast('Please sign your name to seal the vow');
            return;
        }

        // Save vow data
        State.set({
            hasVow: true,
            signature: this.signaturePad ? this.signaturePad.toDataURL() : null,
            vowDate: new Date().toISOString()
        });

        Storage.save();

        // Show success and navigate
        App.showToast('Your sacred vow has been sealed 🙏');

        setTimeout(() => {
            App.showScreen('main');
            MainScreen.init();
        }, 1000);
    },

    /**
     * Show vow modal (for viewing existing vow)
     */
    showVowModal() {
        const state = State.get();
        const vowDate = state.vowDate ? new Date(state.vowDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) : 'Unknown';

        const modal = document.getElementById('vowModal');
        if (!modal) return;

        // Update content
        const dateEl = modal.querySelector('.vow-modal-date');
        if (dateEl) dateEl.textContent = `Sealed on: ${vowDate}`;

        const signatureImg = modal.querySelector('.vow-modal-signature');
        if (signatureImg && state.signature) {
            signatureImg.src = state.signature;
            signatureImg.style.display = 'block';
        }

        const daysEl = modal.querySelector('.vow-modal-days');
        if (daysEl) daysEl.textContent = State.getDaysOnPath();

        modal.classList.add('active');

        // Close handlers
        modal.querySelector('.modal-backdrop')?.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.querySelector('.modal-close')?.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
};

// Make it globally available
window.VowScreen = VowScreen;
