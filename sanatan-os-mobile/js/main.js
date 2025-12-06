document.addEventListener("DOMContentLoaded", () => {
    // Get elements
    const appListView = document.getElementById('appListView');
    const gridContainer = document.querySelector('.grid-container');

    // Flag to track if initial animation has played
    let initialAnimationPlayed = false;

    // Animate tiles with standard Windows animation - only on first load
    function animateTiles() {
        if (!initialAnimationPlayed) {
            const tiles = document.querySelectorAll(".tile, .small");
            tiles.forEach((tile, index) => {
                tile.style.opacity = "0";
                tile.style.transform = "scale(0.8)";
                setTimeout(() => {
                    tile.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
                    tile.style.opacity = "1";
                    tile.style.transform = "scale(1)";
                }, index * 50); // Faster animation
            });
            initialAnimationPlayed = true;
        }
    }

    // Run animation on first load
    animateTiles();

    // View switching functions
    function switchToTileView() {
        appListView.classList.remove('active');
        gridContainer.style.display = 'grid';
        animateTiles(); // Re-animate on switch back? Maybe not.
    }

    function switchToListView() {
        appListView.classList.add('active');
        gridContainer.style.display = 'none';
    }

    // Add search functionality
    const searchInput = document.getElementById('searchApps');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const appItems = document.querySelectorAll('.app-item');

        appItems.forEach(item => {
            const appName = item.querySelector('.app-name').textContent.toLowerCase();
            if (appName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        // Hide/show section headers based on visible apps
        const sections = document.querySelectorAll('.letter-header');
        sections.forEach(section => {
            const sectionId = section.id;
            const sectionApps = document.querySelectorAll(`#${sectionId} + .app-item`); // This selector might need adjustment if multiple apps per section
            // Better logic: check next siblings until next header
            let next = section.nextElementSibling;
            let hasVisible = false;
            while (next && !next.classList.contains('letter-header')) {
                if (next.classList.contains('app-item') && next.style.display !== 'none') {
                    hasVisible = true;
                }
                next = next.nextElementSibling;
            }

            section.style.display = hasVisible ? 'inline-block' : 'none';
        });
    });

    // Search icon click behavior
    const searchIcon = document.querySelector('.search-icon');
    searchIcon.addEventListener('click', () => {
        if (searchInput.style.display === 'none') {
            searchInput.style.display = 'block';
            searchInput.focus();
        } else {
            searchInput.style.display = 'none';
            searchInput.value = '';
            // Reset search results
            const appItems = document.querySelectorAll('.app-item');
            appItems.forEach(item => {
                item.style.display = 'flex';
            });

            // Show all section headers
            const sections = document.querySelectorAll('.letter-header');
            sections.forEach(section => {
                section.style.display = 'inline-block';
            });
        }
    });

    // Add swipe functionality
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const angleThreshold = 30;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
        const isHorizontalSwipe = angle <= angleThreshold || angle >= (180 - angleThreshold);

        if (deltaX < -swipeThreshold && isHorizontalSwipe) {
            // Swipe left: show app list
            switchToListView();
        }

        if (deltaX > swipeThreshold && isHorizontalSwipe) {
            // Swipe right: show tiles
            switchToTileView();
        }
    }

    // Selection Mode & Tile Logic
    let selectedTile = null;
    let selectionOverlay = document.createElement('div');
    selectionOverlay.className = 'selection-overlay';
    document.body.appendChild(selectionOverlay);
    let isSelectionMode = false;

    function addLongPressToTiles() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            let pressTimer;

            tile.addEventListener('touchstart', e => {
                pressTimer = setTimeout(() => {
                    enterSelectionMode(tile);
                }, 800);
            });

            tile.addEventListener('touchend', e => {
                clearTimeout(pressTimer);
            });

            tile.addEventListener('mousedown', e => {
                pressTimer = setTimeout(() => {
                    enterSelectionMode(tile);
                }, 800);
            });

            tile.addEventListener('mouseup', e => {
                clearTimeout(pressTimer);
            });

            tile.addEventListener('mouseleave', e => {
                clearTimeout(pressTimer);
            });
        });
    }

    function enterSelectionMode(tile) {
        if (isSelectionMode) return;
        if (navigator.vibrate) navigator.vibrate(50);

        isSelectionMode = true;
        selectedTile = tile;
        tile.classList.add('selected');

        const allTiles = document.querySelectorAll('.tile');
        allTiles.forEach(t => {
            if (t !== tile) t.classList.add('floating');
        });

        selectionOverlay.classList.add('active');
        addActionButtons(tile);
    }

    function addActionButtons(tile) {
        const actionContainer = document.createElement('div');
        actionContainer.className = 'tile-actions';

        const unpinBtn = document.createElement('div');
        unpinBtn.className = 'tile-action-btn unpin-btn';
        unpinBtn.innerHTML = '<i class="fa-solid fa-thumbtack fa-rotate-90"></i>';
        unpinBtn.addEventListener('click', (e) => { e.stopPropagation(); unpinTile(tile); });

        const infoBtn = document.createElement('div');
        infoBtn.className = 'tile-action-btn info-btn';
        infoBtn.innerHTML = '<i class="fa-solid fa-info"></i>';
        infoBtn.addEventListener('click', (e) => { e.stopPropagation(); showTileInfo(tile); });

        const resizeBtn = document.createElement('div');
        resizeBtn.className = 'tile-action-btn resize-btn';
        resizeBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        resizeBtn.addEventListener('click', (e) => { e.stopPropagation(); resizeTile(tile); });

        actionContainer.appendChild(unpinBtn);
        actionContainer.appendChild(infoBtn);
        actionContainer.appendChild(resizeBtn);
        tile.appendChild(actionContainer);
    }

    function exitSelectionMode() {
        if (!isSelectionMode) return;
        isSelectionMode = false;

        if (selectedTile) {
            selectedTile.classList.remove('selected');
            const actions = selectedTile.querySelector('.tile-actions');
            if (actions) selectedTile.removeChild(actions);
        }

        const allTiles = document.querySelectorAll('.tile');
        allTiles.forEach(tile => tile.classList.remove('floating'));

        selectionOverlay.classList.remove('active');
        selectedTile = null;
    }

    function unpinTile(tile) {
        tile.classList.add('removing');
        setTimeout(() => {
            if (tile.parentNode) tile.parentNode.removeChild(tile);
            exitSelectionMode();
        }, 300);
    }

    function showTileInfo(tile) {
        const tileName = tile.querySelector('span') ? tile.querySelector('span').innerText : 'App';
        alert(`${tileName} Info:\nThis is a tile for ${tileName}.`);
        exitSelectionMode();
    }

    function resizeTile(tile) {
        tile.classList.add('resizing');

        if (tile.classList.contains('small')) {
            tile.classList.remove('small');
            // Move out of small-grid if needed
            if (tile.parentElement.classList.contains('small-grid')) {
                const smallGrid = tile.parentElement;
                gridContainer.insertBefore(tile, smallGrid.nextSibling);
            }
        } else if (!tile.classList.contains('medium') && !tile.classList.contains('large')) {
            tile.classList.add('medium');
        } else if (tile.classList.contains('medium')) {
            tile.classList.remove('medium');
            tile.classList.add('large');
        } else if (tile.classList.contains('large')) {
            tile.classList.remove('large');
            tile.classList.add('small');
            // Logic to put back into small grid omitted for simplicity, just becomes small in main grid
        }

        setTimeout(() => {
            tile.classList.remove('resizing');
        }, 300);
    }

    selectionOverlay.addEventListener('click', exitSelectionMode);
    addLongPressToTiles();

    // Live Tile Animation (Gita AI)
    setInterval(() => {
        const liveTile = document.getElementById('gitaTile');
        if (liveTile) {
            liveTile.classList.toggle('flipped');
        }
    }, 5000); // Flip every 5 seconds
});
