/**
 * Gopal App - Dharmic Habit Companion
 * "Watch -> Do -> Check" Logic
 */

class HabitEngine {
    constructor() {
        this.currentRoutine = 'morning';
        this.streak = parseInt(localStorage.getItem('gopal_streak') || '0');
        this.ui = {
            scene: document.getElementById('scene-container'),
            krishna: document.getElementById('krishna-container'),
            overlay: document.getElementById('action-overlay'),
            timerText: document.getElementById('timer-text'),
            streakCount: document.getElementById('streak-count'),
            btns: document.querySelectorAll('.routine-btn')
        };

        this.init();
    }

    init() {
        this.updateStreakUI();
        this.setupListeners();
        this.setRoutine('morning'); // Default
    }

    setupListeners() {
        this.ui.btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const routine = btn.dataset.routine;
                this.setRoutine(routine);

                // Active Class Logic
                this.ui.btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        document.getElementById('btn-done').addEventListener('click', () => {
            this.completeAction();
        });

        // Interaction: Tap Anywhere on Scene to Trigger
        this.ui.scene.addEventListener('click', (e) => {
            // Visual Feedback (Ripple)
            this.createRipple(e.clientX, e.clientY);

            // Logic: If morning, wake up.
            if (this.currentRoutine === 'morning') {
                this.triggerAction("Wake Up!", 5);
            }
        });
    }

    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    setRoutine(routine) {
        this.currentRoutine = routine;

        // Theme Switching
        if (routine === 'night') {
            this.ui.scene.classList.add('scene-night');
            this.ui.scene.classList.remove('scene-morning');
        } else {
            this.ui.scene.classList.remove('scene-night');
            this.ui.scene.classList.add('scene-morning');
        }

        console.log(`[Gopal] Switched to ${routine} routine`);
    }

    triggerAction(title, durationSeconds) {
        document.getElementById('action-title').textContent = title;
        this.ui.overlay.classList.remove('hidden');
        this.startTimer(durationSeconds);
        // Play Flute Sound Here
    }

    startTimer(seconds) {
        let remaining = seconds;
        this.ui.timerText.textContent = this.formatTime(remaining);

        this.timer = setInterval(() => {
            remaining--;
            this.ui.timerText.textContent = this.formatTime(remaining);

            if (remaining <= 0) {
                clearInterval(this.timer);
                // Enable 'Done' button or Auto-finish
            }
        }, 1000);
    }

    completeAction() {
        this.ui.overlay.classList.add('hidden');
        clearInterval(this.timer);

        // Reward Logic
        this.streak++;
        localStorage.setItem('gopal_streak', this.streak);
        this.updateStreakUI();

        // Animation: Krishna High Five or Jump
        alert("Jai Shri Krishna! Great job!");
    }

    updateStreakUI() {
        this.ui.streakCount.textContent = this.streak;
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }
}

// Initialize
const app = new HabitEngine();
