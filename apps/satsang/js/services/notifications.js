/**
 * Satsang App - Notifications Service
 * Push notifications and local reminders
 */

/**
 * Check if notifications are supported
 */
export function isNotificationsSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission() {
    if (!isNotificationsSupported()) return 'unsupported';
    return Notification.permission;
}

/**
 * Request notification permission
 * @returns {Promise<string>} 'granted', 'denied', or 'default'
 */
export async function requestNotificationPermission() {
    if (!isNotificationsSupported()) {
        console.log('Notifications not supported');
        return 'unsupported';
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
}

/**
 * Schedule a local reminder for an event
 * @param {Object} event - Event object
 * @param {number} minutesBefore - Minutes before event to remind
 */
export function scheduleReminder(event, minutesBefore = 60) {
    const reminders = getStoredReminders();

    const eventStart = new Date(event.dates.start);
    const reminderTime = new Date(eventStart.getTime() - minutesBefore * 60 * 1000);

    // Don't schedule if reminder time is in the past
    if (reminderTime <= new Date()) {
        console.log('Reminder time already passed');
        return false;
    }

    const reminder = {
        id: `rem-${event.id}-${minutesBefore}`,
        eventId: event.id,
        eventTitle: event.title,
        scheduledFor: reminderTime.toISOString(),
        minutesBefore,
        notified: false
    };

    // Check if already scheduled
    const existing = reminders.find(r => r.id === reminder.id);
    if (existing) {
        console.log('Reminder already exists');
        return false;
    }

    reminders.push(reminder);
    saveReminders(reminders);

    console.log('✅ Reminder scheduled for:', reminderTime);
    return true;
}

/**
 * Cancel a scheduled reminder
 * @param {string} eventId - Event ID
 */
export function cancelReminder(eventId) {
    const reminders = getStoredReminders();
    const filtered = reminders.filter(r => r.eventId !== eventId);
    saveReminders(filtered);
    console.log('Reminder cancelled for event:', eventId);
}

/**
 * Get all scheduled reminders
 */
export function getStoredReminders() {
    try {
        return JSON.parse(localStorage.getItem('satsang_reminders') || '[]');
    } catch {
        return [];
    }
}

/**
 * Save reminders to localStorage
 */
function saveReminders(reminders) {
    localStorage.setItem('satsang_reminders', JSON.stringify(reminders));
}

/**
 * Check and trigger due reminders
 * Called periodically by app
 */
export function checkReminders() {
    const reminders = getStoredReminders();
    const now = new Date();
    let updated = false;

    for (const reminder of reminders) {
        if (reminder.notified) continue;

        const scheduledTime = new Date(reminder.scheduledFor);
        if (now >= scheduledTime) {
            // Trigger notification
            showLocalNotification(
                `🕉️ ${reminder.eventTitle}`,
                `Starting in ${reminder.minutesBefore} minutes!`,
                { eventId: reminder.eventId }
            );
            reminder.notified = true;
            updated = true;
        }
    }

    if (updated) {
        saveReminders(reminders);
    }
}

/**
 * Show a local notification
 * @param {string} title 
 * @param {string} body 
 * @param {Object} data 
 */
export async function showLocalNotification(title, body, data = {}) {
    const permission = getNotificationPermission();

    if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return false;
    }

    // Use Service Worker for notifications if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
            body,
            icon: '/assets/icons/icon-192x192.png',
            badge: '/assets/icons/icon-72x72.png',
            vibrate: [100, 50, 100],
            data,
            tag: data.eventId || 'satsang-notification',
            renotify: true
        });
        return true;
    }

    // Fallback to regular Notification API
    new Notification(title, {
        body,
        icon: '/assets/icons/icon-192x192.png',
        data
    });

    return true;
}

/**
 * Start reminder check interval
 * Checks every minute for due reminders
 */
export function startReminderService() {
    // Check immediately
    checkReminders();

    // Then check every minute
    setInterval(checkReminders, 60 * 1000);
    console.log('🔔 Reminder service started');
}

/**
 * Get reminder status for an event
 * @param {string} eventId 
 * @returns {Object|null} Reminder object or null
 */
export function getEventReminder(eventId) {
    const reminders = getStoredReminders();
    return reminders.find(r => r.eventId === eventId && !r.notified) || null;
}

/**
 * Toggle reminder for an event
 * @param {Object} event 
 * @param {number} minutesBefore 
 * @returns {boolean} true if added, false if removed
 */
export function toggleReminder(event, minutesBefore = 60) {
    const existing = getEventReminder(event.id);

    if (existing) {
        cancelReminder(event.id);
        return false;
    } else {
        return scheduleReminder(event, minutesBefore);
    }
}
