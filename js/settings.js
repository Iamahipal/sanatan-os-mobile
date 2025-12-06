/* ============================================
   SANATAN OS - SETTINGS SYSTEM
   Manages user preferences with localStorage
   ============================================ */

const SettingsManager = {
    // Default settings
    defaults: {
        theme: 'indigo',
        wallpaper: 'default',
        customWallpaper: null,
        glassBlur: 0,
        textSize: 'medium',
        gridGap: 'normal'
    },

    // Current settings
    settings: {},

    // Initialize on page load
    init() {
        this.load();
        this.apply();
        this.bindEvents();
        this.updateUI();
    },

    // Load settings from localStorage
    load() {
        const saved = localStorage.getItem('sanatanSettings');
        if (saved) {
            try {
                this.settings = { ...this.defaults, ...JSON.parse(saved) };
            } catch (e) {
                this.settings = { ...this.defaults };
            }
        } else {
            this.settings = { ...this.defaults };
        }
    },

    // Save settings to localStorage
    save() {
        localStorage.setItem('sanatanSettings', JSON.stringify(this.settings));
    },

    // Apply all settings to the page
    apply() {
        const root = document.documentElement;
        const body = document.body;

        // Theme
        this.applyTheme(this.settings.theme);

        // Wallpaper
        if (this.settings.customWallpaper) {
            body.style.backgroundImage = `url(${this.settings.customWallpaper})`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
            body.style.backgroundAttachment = 'fixed';
        } else {
            this.applyWallpaper(this.settings.wallpaper);
        }

        // Glass Blur
        root.style.setProperty('--glass-blur', `${this.settings.glassBlur}px`);

        // Update tile background based on blur
        if (this.settings.glassBlur > 0) {
            root.style.setProperty('--tile-bg', 'rgba(30, 27, 55, 0.6)');
            document.querySelectorAll('.tile').forEach(tile => {
                tile.style.backdropFilter = `blur(${this.settings.glassBlur}px)`;
                tile.style.webkitBackdropFilter = `blur(${this.settings.glassBlur}px)`;
            });
        } else {
            root.style.setProperty('--tile-bg', 'rgba(30, 27, 55, 0.85)');
            document.querySelectorAll('.tile').forEach(tile => {
                tile.style.backdropFilter = 'none';
                tile.style.webkitBackdropFilter = 'none';
            });
        }

        // Text Size
        const textSizes = { small: '14px', medium: '16px', large: '18px' };
        root.style.setProperty('--base-font-size', textSizes[this.settings.textSize] || '16px');

        // Grid Gap
        const gaps = { tight: '4px', normal: '6px', airy: '10px' };
        root.style.setProperty('--gap', gaps[this.settings.gridGap] || '6px');
    },

    // Apply theme colors
    applyTheme(theme) {
        const themes = {
            indigo: {
                bgBase: '#0f0c29',
                gradient: 'linear-gradient(160deg, #0f0c29 0%, #1a1635 30%, #241b4a 60%, #1a2040 100%)'
            },
            white: {
                bgBase: '#f0f0f5',
                gradient: 'linear-gradient(160deg, #f0f0f5 0%, #e8e8f0 30%, #dcdce8 60%, #d0d0e0 100%)'
            },
            saffron: {
                bgBase: '#1a0f05',
                gradient: 'linear-gradient(160deg, #1a0f05 0%, #2d1810 30%, #4a2515 60%, #2d1810 100%)'
            }
        };

        const t = themes[theme] || themes.indigo;
        const root = document.documentElement;
        root.style.setProperty('--bg-base', t.bgBase);

        if (!this.settings.customWallpaper) {
            document.body.style.background = t.gradient;
            document.body.style.backgroundAttachment = 'fixed';
        }

        // Adjust text color for light theme
        if (theme === 'white') {
            root.style.setProperty('--text-primary', '#1a1a2e');
            root.style.setProperty('--text-muted', 'rgba(26, 26, 46, 0.7)');
            root.style.setProperty('--tile-bg', 'rgba(255, 255, 255, 0.7)');
            root.style.setProperty('--tile-border', 'rgba(0, 0, 0, 0.1)');
        } else {
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-muted', 'rgba(255, 255, 255, 0.7)');
            root.style.setProperty('--tile-bg', 'rgba(30, 27, 55, 0.85)');
            root.style.setProperty('--tile-border', 'rgba(255, 255, 255, 0.08)');
        }
    },

    // Apply preset wallpaper
    applyWallpaper(preset) {
        const wallpapers = {
            default: 'linear-gradient(160deg, #0f0c29 0%, #1a1635 30%, #241b4a 60%, #1a2040 100%)',
            cosmic: 'linear-gradient(135deg, #0c0c1e 0%, #1a0a2e 30%, #2d1b4e 60%, #0c0c1e 100%)',
            forest: 'linear-gradient(160deg, #0a1a0a 0%, #0f2a1a 30%, #1a3a2a 60%, #0a1a0a 100%)'
        };

        if (!this.settings.customWallpaper) {
            document.body.style.background = wallpapers[preset] || wallpapers.default;
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundImage = '';
        }
    },

    // Update UI to reflect current settings
    updateUI() {
        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.settings.theme);
        });

        // Wallpaper buttons
        document.querySelectorAll('.wallpaper-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.wallpaper === this.settings.wallpaper && !this.settings.customWallpaper);
        });

        // Blur slider
        const blurSlider = document.getElementById('blur-slider');
        if (blurSlider) {
            blurSlider.value = this.settings.glassBlur;
            const blurValue = document.getElementById('blur-value');
            if (blurValue) blurValue.textContent = `${this.settings.glassBlur}px`;
        }

        // Text size buttons
        document.querySelectorAll('.text-size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === this.settings.textSize);
        });

        // Grid gap buttons
        document.querySelectorAll('.grid-gap-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.gap === this.settings.gridGap);
        });
    },

    // Bind all event listeners
    bindEvents() {
        // Open settings modal
        const settingsTile = document.querySelector('[data-action="open-settings"]');
        if (settingsTile) {
            settingsTile.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }

        // Close settings modal
        const closeBtn = document.getElementById('settings-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close on overlay click
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Theme selection
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.theme = btn.dataset.theme;
                this.settings.customWallpaper = null;
                this.save();
                this.apply();
                this.updateUI();
            });
        });

        // Wallpaper selection
        document.querySelectorAll('.wallpaper-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.wallpaper = btn.dataset.wallpaper;
                this.settings.customWallpaper = null;
                this.save();
                this.apply();
                this.updateUI();
            });
        });

        // Custom wallpaper upload
        const wallpaperInput = document.getElementById('wallpaper-upload');
        if (wallpaperInput) {
            wallpaperInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.settings.customWallpaper = event.target.result;
                        this.save();
                        this.apply();
                        this.updateUI();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Blur slider
        const blurSlider = document.getElementById('blur-slider');
        if (blurSlider) {
            blurSlider.addEventListener('input', (e) => {
                this.settings.glassBlur = parseInt(e.target.value);
                const blurValue = document.getElementById('blur-value');
                if (blurValue) blurValue.textContent = `${this.settings.glassBlur}px`;
                this.apply();
            });
            blurSlider.addEventListener('change', () => this.save());
        }

        // Text size
        document.querySelectorAll('.text-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.textSize = btn.dataset.size;
                this.save();
                this.apply();
                this.updateUI();
            });
        });

        // Grid gap
        document.querySelectorAll('.grid-gap-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.gridGap = btn.dataset.gap;
                this.save();
                this.apply();
                this.updateUI();
            });
        });

        // Reset all
        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Reset all settings and data? This cannot be undone.')) {
                    localStorage.clear();
                    this.settings = { ...this.defaults };
                    this.save();
                    this.apply();
                    this.updateUI();
                    this.closeModal();
                }
            });
        }
    },

    // Open modal
    openModal() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    },

    // Close modal
    closeModal() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SettingsManager.init();
});
