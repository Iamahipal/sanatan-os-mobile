/**
 * Liquid Glass Effect for Japa App
 * Adapted from SanatanOS main liquid-glass.js
 * Creates beautiful distortion/refraction effect on glass elements
 */

(function () {
    'use strict';

    // Check if device prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth <= 480;

    // Utility functions
    function smoothStep(a, b, t) {
        t = Math.max(0, Math.min(1, (t - a) / (b - a)));
        return t * t * (3 - 2 * t);
    }

    function length(x, y) {
        return Math.sqrt(x * x + y * y);
    }

    function roundedRectSDF(x, y, width, height, radius) {
        const qx = Math.abs(x) - width + radius;
        const qy = Math.abs(y) - height + radius;
        return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
    }

    function texture(x, y) {
        return { type: 't', x, y };
    }

    // Create SVG filter for liquid glass effect
    function createLiquidGlassFilter(id, width, height, intensity = 1.0) {
        const canvasDPI = 1;

        const canvas = document.createElement('canvas');
        canvas.width = width * canvasDPI;
        canvas.height = height * canvasDPI;
        canvas.style.display = 'none';
        const context = canvas.getContext('2d');

        // Fragment shader with edge refraction
        const fragment = (uv) => {
            const ix = uv.x - 0.5;
            const iy = uv.y - 0.5;

            const distanceToEdge = roundedRectSDF(ix, iy, 0.42, 0.42, 0.15);
            const edgeRefract = smoothStep(0.0, -0.15, distanceToEdge) * 0.8;
            const centerDist = length(ix, iy);
            const centerBulge = smoothStep(0.5, 0, centerDist) * 0.3;
            const totalDisplacement = (edgeRefract + centerBulge) * intensity;
            const scale = 1.0 - totalDisplacement * 0.4;
            return texture(ix * scale + 0.5, iy * scale + 0.5);
        };

        // Generate displacement map
        const w = width * canvasDPI;
        const h = height * canvasDPI;
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

        maxScale = Math.max(maxScale * 0.6, 5);

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
        const scaleValue = isMobile ? Math.round(maxScale * 1.5) : Math.round(maxScale * 1.2);
        feDisplacementMap.setAttribute('scale', scaleValue.toString());

        filter.appendChild(feImage);
        filter.appendChild(feDisplacementMap);
        defs.appendChild(filter);
        svg.appendChild(defs);

        return svg;
    }

    // Initialize liquid glass effect for Japa app elements
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

        // Create filters for Japa app elements
        const filterConfigs = [
            { id: 'japa-glass-btn', width: 40, height: 40, intensity: 0.8 },
            { id: 'japa-glass-badge', width: 120, height: 36, intensity: 0.7 },
            { id: 'japa-glass-counter', width: 220, height: 70, intensity: 0.6 }
        ];

        // Create container for SVG filters
        const container = document.createElement('div');
        container.id = 'japa-liquid-glass-filters';
        container.style.cssText = 'position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none;';

        filterConfigs.forEach(config => {
            const svg = createLiquidGlassFilter(config.id, config.width, config.height, config.intensity);
            container.appendChild(svg);
        });

        document.body.appendChild(container);

        // Add CSS for liquid glass elements
        const style = document.createElement('style');
        style.id = 'japa-liquid-glass-styles';
        style.textContent = `
      /* Japa Liquid Glass - GPU Accelerated */
      
      /* Header Buttons - no centering needed, just GPU acceleration */
      .header-btn {
        backdrop-filter: url(#japa-glass-btn) blur(12px) saturate(1.3) brightness(1.05);
        -webkit-backdrop-filter: url(#japa-glass-btn) blur(12px) saturate(1.3) brightness(1.05);
        transform: translateZ(0);
        backface-visibility: hidden;
      }
      
      /* Level Badge - MUST preserve translateX(-50%) for centering */
      .level-badge {
        backdrop-filter: url(#japa-glass-badge) blur(12px) saturate(1.3) brightness(1.05);
        -webkit-backdrop-filter: url(#japa-glass-badge) blur(12px) saturate(1.3) brightness(1.05);
        transform: translateX(-50%) translateZ(0);
        backface-visibility: hidden;
      }
      
      /* Counter Display - MUST preserve translateX(-50%) for centering */
      .counter-display {
        backdrop-filter: url(#japa-glass-counter) blur(12px) saturate(1.3) brightness(1.05);
        -webkit-backdrop-filter: url(#japa-glass-counter) blur(12px) saturate(1.3) brightness(1.05);
        transform: translateX(-50%) translateZ(0);
        backface-visibility: hidden;
      }
      
      /* Light refraction overlay - top gradient */
      .header-btn::before,
      .level-badge::before,
      .counter-display::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60%;
        border-radius: inherit;
        background: linear-gradient(180deg,
          rgba(255, 255, 255, 0.22) 0%,
          rgba(255, 255, 255, 0.08) 40%,
          transparent 100%);
        pointer-events: none;
        z-index: 1;
      }
      
      /* Inner edge highlight for depth */
      .header-btn::after,
      .level-badge::after,
      .counter-display::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: 
          inset 0 1px 1px rgba(255, 255, 255, 0.2),
          inset 0 -1px 1px rgba(0, 0, 0, 0.1),
          inset 1px 0 1px rgba(255, 255, 255, 0.05),
          inset -1px 0 1px rgba(0, 0, 0, 0.05);
        pointer-events: none;
        z-index: 2;
      }
    `;
        document.head.appendChild(style);

        console.log('✨ Japa Liquid Glass effect initialized');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLiquidGlass);
    } else {
        initLiquidGlass();
    }

})();
