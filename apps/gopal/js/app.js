/**
 * Bal Krishna - Dharmic Habit Companion
 * Simplified Mobile-First Logic
 */

const routines = {
    morning: { title: 'Wake Up!', action: 'Time to Stretch!', duration: 10 },
    meal: { title: 'Bhog Time!', action: 'Time to Eat Mindfully!', duration: 60 },
    night: { title: 'Goodnight!', action: 'Time to Sleep!', duration: 10 }
};

let currentRoutine = 'morning';
let streak = parseInt(localStorage.getItem('gopal_streak') || '0');
let timer = null;

// DOM Elements
const startBtn = document.getElementById('start-btn');
const doneBtn = document.getElementById('done-btn');
const overlay = document.getElementById('overlay');
const actionTitle = document.getElementById('action-title');
const timerDisplay = document.getElementById('timer');
const streakDisplay = document.getElementById('streak');
const tabs = document.querySelectorAll('.tab');
const krishnaImg = document.getElementById('krishna');

// Init
function init() {
    streakDisplay.textContent = streak;
    updateStartBtn();

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentRoutine = tab.dataset.routine;
            updateStartBtn();
        });
    });

    // Start Button
    startBtn.addEventListener('click', startAction);

    // Done Button
    doneBtn.addEventListener('click', completeAction);
}

function updateStartBtn() {
    const r = routines[currentRoutine];
    startBtn.innerHTML = `<i class="fa-solid fa-play"></i> <span>${r.title}</span>`;
}

function startAction() {
    const r = routines[currentRoutine];
    actionTitle.textContent = r.action;
    overlay.classList.remove('hidden');

    // Make Krishna bounce
    krishnaImg.style.animation = 'none';
    setTimeout(() => krishnaImg.style.animation = 'float 1s ease-in-out infinite', 10);

    startTimer(r.duration);
}

function startTimer(seconds) {
    let remaining = seconds;
    updateTimerDisplay(remaining);

    timer = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);

        if (remaining <= 0) {
            clearInterval(timer);
            // Auto highlight done button
            doneBtn.style.animation = 'pulse 0.5s infinite';
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

function completeAction() {
    clearInterval(timer);
    overlay.classList.add('hidden');
    doneBtn.style.animation = '';

    // Update Streak
    streak++;
    localStorage.setItem('gopal_streak', streak);
    streakDisplay.textContent = streak;

    // Celebrate
    krishnaImg.style.transform = 'scale(1.2)';
    setTimeout(() => krishnaImg.style.transform = 'scale(1)', 300);

    alert('🎉 Jai Shri Krishna! You did it!');
}

// Start
init();
