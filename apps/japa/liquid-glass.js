/**
 * Apple Liquid Glass Effect for Japa App
 * Enhanced with iOS 26 Liquid Glass principles:
 * - Real-time lensing (light bending)
 * - Specular highlights
 * - Physics-based interactions
 */

(function () {
    'use strict';

    // Check if device prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth <= 480;

    // === UTILITY FUNCTIONS ===

    function smoothStep(a, b, t) {
        t = Math.max(0, Math.min(1, (t - a) / (b - a)));
        return t * t * (3 - 2 * t);
    }

    function length(x, y) {
        return Math.sqrt(x * x + y * y);
    }

    // Signed Distance Function for rounded rectangle
    function roundedRectSDF(x, y, width, height, radius) {
        const qx = Math.abs(x) - width + radius;
        const qy = Math.abs(y) - height + radius;
        return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
    }

    // === LIQUID GLASS FILTER CREATION ===

    function createLiquidGlassFilter(id, width, height, config = {}) {
        const {
            intensity = 1.2,
            edgeRefraction = 0.9,
            centerBulge = 0.35,
            cornerRadius = 0.18
        } = config;

        const canvasDPI = window.devicePixelRatio > 1 ? 1.5 : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * canvasDPI);
        canvas.height = Math.round(height * canvasDPI);
        canvas.style.display = 'none';
        const context = canvas.getContext('2d');

        // Fragment shader - creates lensing displacement map
        const fragment = (uv) => {
            const ix = uv.x - 0.5;
            const iy = uv.y - 0.5;

            // Distance to rounded rectangle edge
            const distToEdge = roundedRectSDF(ix, iy, 0.40, 0.40, cornerRadius);

            // Edge refraction - light bends more near edges
            const edgeRefract = smoothStep(0.0, -0.18, distToEdge) * edgeRefraction;

            // Center bulge - glass curves inward slightly
            const centerDist = length(ix, iy);
            const centerEffect = smoothStep(0.5, 0, centerDist) * centerBulge;

            // Combined displacement
            const totalDisplacement = (edgeRefract + centerEffect) * intensity;
            const scale = 1.0 - totalDisplacement * 0.45;

            return { x: ix * scale + 0.5, y: iy * scale + 0.5 };
        };

        // Generate displacement map
        const w = canvas.width;
        const h = canvas.height;
        const data = new Uint8ClampedArray(w * h * 4);
        let maxScale = 0;
        const rawValues = [];

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % w;
            const y = Math.floor(i / 4 / w);
            const pos = fragment({ x: x / w, y: y / h });
            const dx = pos.x * w - x;
            const dy = pos.y * h - y;
            maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
            rawValues.push(dx, dy);
        }

        maxScale = Math.max(maxScale * 0.65, 6);

        let index = 0;
        for (let i = 0; i < data.length; i += 4) {
            const r = rawValues[index++] / maxScale + 0.5;
            const g = rawValues[index++] / maxScale + 0.5;
            data[i] = Math.max(0, Math.min(255, r * 255));
            data[i + 1] = Math.max(0, Math.min(255, g * 255));
            data[i + 2] = 128;
            data[i + 3] = 255;
        }

        context.putImageData(new ImageData(data, w, h), 0, 0);
        const dataURL = canvas.toDataURL();

        // Create SVG filter
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none;';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', id);
        filter.setAttribute('filterUnits', 'objectBoundingBox');
        filter.setAttribute('primitiveUnits', 'userSpaceOnUse');
        filter.setAttribute('colorInterpolationFilters', 'sRGB');
        filter.setAttribute('x', '0%');
        filter.setAttribute('y', '0%');
        filter.setAttribute('width', '100%');
        filter.setAttribute('height', '100%');

        const feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
        feImage.setAttribute('id', `${id}_map`);
        feImage.setAttribute('result', 'displacementMap');
        feImage.setAttribute('preserveAspectRatio', 'none');
        feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataURL);

        const feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
        feDisplacementMap.setAttribute('in', 'SourceGraphic');
        feDisplacementMap.setAttribute('in2', 'displacementMap');
        feDisplacementMap.setAttribute('xChannelSelector', 'R');
        feDisplacementMap.setAttribute('yChannelSelector', 'G');

        // Higher scale for more visible distortion
        const scaleValue = isMobile ? Math.round(maxScale * 1.8) : Math.round(maxScale * 1.5);
        feDisplacementMap.setAttribute('scale', scaleValue.toString());

        filter.appendChild(feImage);
        filter.appendChild(feDisplacementMap);
        defs.appendChild(filter);
        svg.appendChild(defs);

        return svg;
    }

    // === INITIALIZE LIQUID GLASS ===

    function initLiquidGlass() {
        if (prefersReducedMotion) {
            console.log('🔇 Liquid Glass disabled: User prefers reduced motion');
            return;
        }

        // Remove existing if present
        const existing = document.getElementById('japa-liquid-glass-filters');
        if (existing) existing.remove();
        const existingStyle = document.getElementById('japa-liquid-glass-styles');
        if (existingStyle) existingStyle.remove();

        // Filter configurations for different element sizes
        const filterConfigs = [
            {
                id: 'glass-btn',
                width: 44,
                height: 44,
                config: { intensity: 1.3, cornerRadius: 0.5 }
            },
            {
                id: 'glass-badge',
                width: 160,
                height: 48,
                config: { intensity: 1.2, cornerRadius: 0.4 }
            },
            {
                id: 'glass-counter',
                width: 280,
                height: 90,
                config: { intensity: 1.4, cornerRadius: 0.3 }
            },
            {
                id: 'glass-modal',
                width: 400,
                height: 200,
                config: { intensity: 1.0, cornerRadius: 0.15, edgeRefraction: 0.7 }
            }
        ];

        // Create container for SVG filters
        const container = document.createElement('div');
        container.id = 'japa-liquid-glass-filters';
        container.style.cssText = 'position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none;';

        filterConfigs.forEach(({ id, width, height, config }) => {
            const svg = createLiquidGlassFilter(id, width, height, config);
            container.appendChild(svg);
        });

        document.body.appendChild(container);

        // Add CSS for liquid glass elements
        const style = document.createElement('style');
        style.id = 'japa-liquid-glass-styles';
        style.textContent = `
            /* === APPLE LIQUID GLASS - GPU ACCELERATED === */
            
            /* Header Buttons - Circular glass */
            .header-btn {
                backdrop-filter: url(#glass-btn) blur(16px) saturate(1.6) brightness(1.08);
                -webkit-backdrop-filter: url(#glass-btn) blur(16px) saturate(1.6) brightness(1.08);
                transform: translateZ(0);
                will-change: transform;
            }
            
            /* Level Badge - Pill glass */
            .level-badge {
                backdrop-filter: url(#glass-badge) blur(28px) saturate(1.7) brightness(1.08);
                -webkit-backdrop-filter: url(#glass-badge) blur(28px) saturate(1.7) brightness(1.08);
                transform: translateX(-50%) translateZ(0);
                will-change: transform;
            }
            
            /* Counter Display - Large glass panel */
            .counter-display {
                backdrop-filter: url(#glass-counter) blur(32px) saturate(1.8) brightness(1.1);
                -webkit-backdrop-filter: url(#glass-counter) blur(32px) saturate(1.8) brightness(1.1);
                transform: translateX(-50%) translateZ(0);
                will-change: transform;
            }
            
            /* Modal Content - Full sheet glass */
            .modal-content {
                backdrop-filter: url(#glass-modal) blur(48px) saturate(2) brightness(1.05);
                -webkit-backdrop-filter: url(#glass-modal) blur(48px) saturate(2) brightness(1.05);
                will-change: transform;
            }
            
            /* Specular highlight overlay - top gradient */
            .header-btn::before,
            .level-badge::before,
            .counter-display::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 55%;
                border-radius: inherit;
                background: linear-gradient(180deg,
                    rgba(255, 255, 255, 0.28) 0%,
                    rgba(255, 255, 255, 0.12) 35%,
                    transparent 100%);
                pointer-events: none;
                z-index: 1;
            }
            
            /* Inner shadow for depth */
            .header-btn::after,
            .level-badge::after,
            .counter-display::after {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: inherit;
                box-shadow: 
                    inset 0 1px 1px rgba(255, 255, 255, 0.25),
                    inset 0 -1px 2px rgba(0, 0, 0, 0.08);
                pointer-events: none;
                z-index: 2;
            }
            
            /* Interactive press feedback */
            .header-btn:active::before,
            .level-badge:active::before,
            .counter-display:active::before {
                background: linear-gradient(180deg,
                    rgba(255, 255, 255, 0.35) 0%,
                    rgba(255, 255, 255, 0.15) 50%,
                    transparent 100%);
            }
        `;
        document.head.appendChild(style);

        console.log('✨ Apple Liquid Glass effect initialized');
    }

    // === INTERACTIVE RIPPLE EFFECT ===

    function addRippleEffect() {
        const tapArea = document.getElementById('japa-canvas');
        if (!tapArea) return;

        tapArea.addEventListener('pointerdown', (e) => {
            if (prefersReducedMotion) return;

            const rect = tapArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 20px;
                height: 20px;
                margin: -10px;
                border-radius: 50%;
                background: radial-gradient(circle, 
                    var(--deity-color) 0%, 
                    transparent 70%);
                opacity: 0.6;
                pointer-events: none;
                animation: rippleExpand 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
                z-index: 3;
            `;

            tapArea.appendChild(ripple);

            ripple.addEventListener('animationend', () => ripple.remove());
        });

        // Add ripple keyframes
        if (!document.getElementById('ripple-keyframes')) {
            const keyframes = document.createElement('style');
            keyframes.id = 'ripple-keyframes';
            keyframes.textContent = `
                @keyframes rippleExpand {
                    0% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(15);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(keyframes);
        }
    }

    // === INIT ON DOM READY ===

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initLiquidGlass();
            addRippleEffect();
        });
    } else {
        initLiquidGlass();
        addRippleEffect();
    }

})();
