/**
 * Vachak Profile Component
 */
import { store } from '../store.js';
import { EventService } from '../services/events.js';
import { EventCard } from './EventCard.js';
import { Utils } from '../utils.js'; // Added for Utils.formatNumber

export function VachakProfile(vachak) {
    const container = document.createElement('div');
    container.className = 'vachak-profile-container';

    // State for Tabs
    let activeTab = 'events'; // 'events' | 'about'

    // Compute Events for this Vachak
    const vachakEvents = EventService.getFilteredEvents({ vachakId: vachak.id });

    // Render Function
    const render = () => {
        container.innerHTML = `
            <header class="app-header transparent">
                <button class="header-btn" onclick="window.history.back()">
                    <i data-lucide="chevron-left"></i>
                </button>
                <div class="header-actions">
                    <button class="header-btn"><i data-lucide="share-2"></i></button>
                </div>
            </header>

            <div class="profile-hero">
                <div class="profile-avatar-lg">
                    ${vachak.image
                ? `<img src="${vachak.image}" class="vachak-image-lg" alt="${vachak.name}">`
                : vachak.emoji
            }
                </div>
                <h1>${vachak.name}</h1>
                <p class="profile-specialty">${vachak.specialty}</p>
                <div class="profile-stats-row">
                    <div class="stat-box">
                        <span class="stat-num">${Utils.formatNumber(vachak.followers)}</span>
                        <span class="stat-lbl">Followers</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${vachak.eventsCount}</span>
                        <span class="stat-lbl">Events</span>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="btn-primary flex-1" id="followBtn">Follow</button>
                    <button class="btn-secondary flex-1" id="donateBtn">Donate</button>
                    ${vachak.socials && vachak.socials.youtube ? `
                        <a href="${vachak.socials.youtube}" target="_blank" class="btn-secondary icon-only">
                            <i data-lucide="youtube" style="color: #ff0000;"></i>
                        </a>` : ''}
                </div>
            </div>

            <div class="profile-tabs">
                <button class="tab-btn ${activeTab === 'events' ? 'active' : ''}" data-tab="events">Upcoming Events</button>
                <button class="tab-btn ${activeTab === 'about' ? 'active' : ''}" data-tab="about">About Guru</button>
            </div>

            <div class="profile-body">
                ${activeTab === 'events' ? renderEventsTab() : renderAboutTab()}
            </div>
        `;

        // Bind Events
        container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = () => {
                activeTab = btn.dataset.tab;
                render();
                lucide.createIcons();
            };
        });

        // Donate Button
        const donateBtn = container.querySelector('#donateBtn');
        if (donateBtn) {
            donateBtn.addEventListener('click', () => {
                import('./DonationModal.js').then(module => {
                    document.body.appendChild(module.DonationModal(vachak.name));
                });
            });
        }

        // Event Card clicks
        container.querySelectorAll('.event-card').forEach(card => {
            card.onclick = () => {
                window.location.hash = `event/${card.dataset.id}`;
            };
        });
    };

    const renderEventsTab = () => {
        if (vachakEvents.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon"><i data-lucide="calendar-off"></i></div>
                    <h3>No Upcoming Events</h3>
                    <p>Follow to get notified when new schedules are added.</p>
                </div>
            `;
        }
        // Reuse logic from Home render (simplified)
        // We'll regenerate lists manually here since we need string HTML for innerHTML
        return `
            <div class="events-list v-stack" style="padding: 16px;">
                ${vachakEvents.map(event => {
            const dateStart = new Date(event.dates.start);
            const day = dateStart.getDate();
            const month = dateStart.toLocaleString('default', { month: 'short' });

            return `
                    <div class="event-card" data-id="${event.id}">
                        <div class="card-image-placeholder ${event.type}">
                            ${event.emoji || '🕉️'}
                        </div>
                        <div class="card-content">
                            <div class="card-header-row">
                                <span class="chip ${event.type}">${event.typeName}</span>
                                ${event.features.isLive ? '<span class="live-badge">LIVE</span>' : ''}
                            </div>
                            <h3>${event.title}</h3>
                            <div class="card-meta">
                                <span><i data-lucide="calendar"></i> ${day} ${month}</span>
                                <span><i data-lucide="map-pin"></i> ${event.location.cityName}</span>
                            </div>
                        </div>
                    </div>
                    `;
        }).join('')}
            </div>
        `;
    };

    const renderAboutTab = () => {
        return `
            <div class="about-section">
                ${vachak.lineage ? `
                <div class="info-card">
                    <label>Lineage / Sampradaya</label>
                    <p>${vachak.lineage}</p>
                </div>` : ''}
                
                <div class="bio-text">
                    ${vachak.fullBio ? vachak.fullBio.replace(/\n\n/g, '<br><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : vachak.bio}
                </div>

                ${vachak.socials ? `
                <div class="social-links-grid">
                    ${vachak.socials.instagram ? `<a href="${vachak.socials.instagram}" target="_blank" class="social-pill insta"><i data-lucide="instagram"></i> Instagram</a>` : ''}
                    ${vachak.socials.website ? `<a href="${vachak.socials.website}" target="_blank" class="social-pill web"><i data-lucide="globe"></i> Website</a>` : ''}
                </div>` : ''}
            </div>
        `;
    };

    render();
    return container;
}
