const tiles = [
    { title: 'Gita AI', size: 'wide', color: 'saffron', icon: '🕉️', link: '#' },
    { title: 'Live Darshan', size: 'small', color: 'crimson', icon: '📺', link: '#' },
    { title: 'Panchang', size: 'small', color: 'teal', icon: '📅', link: '#' },
    { title: 'Kids Corner', size: 'medium', color: 'yellow', icon: '👶', link: '#' },
    { title: 'Radha Japa', size: 'medium', color: 'purple', icon: '📿', link: 'apps/japa/index.html' }
];

function renderGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear existing content

    tiles.forEach(tile => {
        const tileDiv = document.createElement('div');
        tileDiv.className = `tile tile-${tile.size} ${tile.color}`;

        // Icon
        const iconDiv = document.createElement('div');
        iconDiv.className = 'tile-icon';
        iconDiv.textContent = tile.icon;
        tileDiv.appendChild(iconDiv);

        // Title
        const titleH2 = document.createElement('h2');
        titleH2.textContent = tile.title;
        tileDiv.appendChild(titleH2);

        // Click handler (optional, for now just log or navigate)
        tileDiv.onclick = () => {
            console.log(`Clicked ${tile.title}`);
            if (tile.link && tile.link !== '#') {
                window.location.href = tile.link;
            }
        };

        grid.appendChild(tileDiv);
    });
}

// Render on load
window.addEventListener('DOMContentLoaded', renderGrid);
