/**
 * Liquid Glass Effect for Krishna Vaani App
 * Adapted from Shu Ding's liquid-glass (https://github.com/shuding/liquid-glass)
 * Creates a beautiful distortion/refraction effect on UI elements
 */

(function () {
  'use strict';

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
  function createLiquidGlassFilter(id, width, height, intensity = 1.0, cornerRadius = 0.15) {
    const canvasDPI = 1;

    const canvas = document.createElement('canvas');
    canvas.width = width * canvasDPI;
    canvas.height = height * canvasDPI;
    canvas.style.display = 'none';
    const context = canvas.getContext('2d');

    // Enhanced fragment shader with edge refraction
    const fragment = (uv) => {
      const ix = uv.x - 0.5;
      const iy = uv.y - 0.5;

      // Distance to edge of rounded rectangle
      const aspectX = 0.42;
      const aspectY = 0.42 * (width / height);
      const distanceToEdge = roundedRectSDF(ix, iy, aspectX, aspectY, cornerRadius);

      // Edge refraction - stronger near edges
      const edgeRefract = smoothStep(0.0, -0.12, distanceToEdge) * 0.7;

      // Center bulge - subtle magnification
      const centerDist = length(ix, iy);
      const centerBulge = smoothStep(0.5, 0, centerDist) * 0.25;

      // Combine effects
      const totalDisplacement = (edgeRefract + centerBulge) * intensity;

      // Apply displacement
      const scale = 1.0 - totalDisplacement * 0.35;
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

    maxScale = Math.max(maxScale * 0.6, 4);

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
    svg.style.cssText = `position: absolute; top: 0; left: 0; pointer-events: none;`;

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
    feDisplacementMap.setAttribute('scale', Math.round(maxScale * 1.2).toString());

    filter.appendChild(feImage);
    filter.appendChild(feDisplacementMap);
    defs.appendChild(filter);
    svg.appendChild(defs);

    return svg;
  }

  // Initialize liquid glass effect for Krishna Vaani
  function initLiquidGlass() {
    // Check if already initialized
    const existing = document.getElementById('kv-liquid-glass-filters');
    if (existing) existing.remove();
    const existingStyle = document.getElementById('kv-liquid-glass-styles');
    if (existingStyle) existingStyle.remove();

    // Filter configurations for different UI elements
    const filterConfigs = [
      // Header button (42x42)
      { id: 'kv-glass-btn', width: 60, height: 60, intensity: 1.0, cornerRadius: 0.25 },
      // Suggestion chips (wide pills)
      { id: 'kv-glass-chip', width: 320, height: 60, intensity: 0.8, cornerRadius: 0.35 },
      // Message bubbles
      { id: 'kv-glass-message', width: 300, height: 120, intensity: 0.7, cornerRadius: 0.2 },
      // Input wrapper (wide pill)
      { id: 'kv-glass-input', width: 380, height: 70, intensity: 0.85, cornerRadius: 0.4 },
      // Modal content
      { id: 'kv-glass-modal', width: 350, height: 400, intensity: 0.5, cornerRadius: 0.08 },
      // Welcome content
      { id: 'kv-glass-welcome', width: 300, height: 200, intensity: 0.6, cornerRadius: 0.15 },
      // Chapter cards (Library page - tile-like)
      { id: 'kv-glass-chapter', width: 180, height: 180, intensity: 1.0, cornerRadius: 0.18 },
      // Verse items (Library page - list items)
      { id: 'kv-glass-verse', width: 350, height: 100, intensity: 0.75, cornerRadius: 0.12 }
    ];

    // Create container for SVG filters
    const container = document.createElement('div');
    container.id = 'kv-liquid-glass-filters';
    container.style.cssText = `position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none;`;

    filterConfigs.forEach(config => {
      const svg = createLiquidGlassFilter(config.id, config.width, config.height, config.intensity, config.cornerRadius);
      container.appendChild(svg);
    });

    document.body.appendChild(container);

    // Add CSS for liquid glass elements
    const style = document.createElement('style');
    style.id = 'kv-liquid-glass-styles';
    style.textContent = `
      /* ============================================
         LIQUID GLASS EFFECT - Krishna Vaani
         ============================================ */

      /* Header Buttons */
      .header-btn {
        backdrop-filter: url(#kv-glass-btn) blur(2px) saturate(1.2) brightness(1.05) !important;
        -webkit-backdrop-filter: url(#kv-glass-btn) blur(2px) saturate(1.2) brightness(1.05) !important;
      }

      /* Suggestion Chips */
      .suggestion-chip {
        backdrop-filter: url(#kv-glass-chip) blur(2px) saturate(1.25) brightness(1.05) !important;
        -webkit-backdrop-filter: url(#kv-glass-chip) blur(2px) saturate(1.25) brightness(1.05) !important;
      }

      /* Message Bubbles */
      .message.krishna .message-content,
      .message.user .message-content {
        backdrop-filter: url(#kv-glass-message) blur(2px) saturate(1.2) brightness(1.03) !important;
        -webkit-backdrop-filter: url(#kv-glass-message) blur(2px) saturate(1.2) brightness(1.03) !important;
      }

      /* Input Wrapper */
      .input-wrapper {
        backdrop-filter: url(#kv-glass-input) blur(2px) saturate(1.25) brightness(1.05) !important;
        -webkit-backdrop-filter: url(#kv-glass-input) blur(2px) saturate(1.25) brightness(1.05) !important;
      }

      /* Modal Content */
      .modal-content {
        backdrop-filter: url(#kv-glass-modal) blur(20px) saturate(1.3) brightness(1.02) !important;
        -webkit-backdrop-filter: url(#kv-glass-modal) blur(20px) saturate(1.3) brightness(1.02) !important;
      }

      /* Verse Cards */
      .verse-card {
        backdrop-filter: url(#kv-glass-message) blur(8px) saturate(1.3) !important;
        -webkit-backdrop-filter: url(#kv-glass-message) blur(8px) saturate(1.3) !important;
      }

      /* ============================================
         LIBRARY PAGE - Chapter Cards (Same as Home Tiles)
         ============================================ */
      .chapter-card {
        background: rgba(255, 255, 255, 0.06) !important;
        backdrop-filter: url(#kv-glass-chapter) blur(2px) saturate(1.2) brightness(1.05) !important;
        -webkit-backdrop-filter: url(#kv-glass-chapter) blur(2px) saturate(1.2) brightness(1.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.35) !important;
        box-shadow: 
          0 2px 20px rgba(0, 0, 0, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.15),
          inset 0 -1px 0 rgba(0, 0, 0, 0.08) !important;
      }

      /* Chapter card top light refraction */
      .chapter-card::before {
        background: linear-gradient(180deg,
          rgba(255, 255, 255, 0.28) 0%,
          rgba(255, 255, 255, 0.12) 30%,
          rgba(255, 255, 255, 0.04) 60%,
          transparent 100%) !important;
      }

      /* Chapter card inner edge */
      .chapter-card::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: 
          inset 0 1px 1px rgba(255, 255, 255, 0.25),
          inset 0 -1px 1px rgba(0, 0, 0, 0.15),
          inset 1px 0 1px rgba(255, 255, 255, 0.08),
          inset -1px 0 1px rgba(0, 0, 0, 0.08);
        pointer-events: none;
        z-index: 1;
      }

      /* Verse List Items */
      .verse-item {
        position: relative;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.06) !important;
        backdrop-filter: url(#kv-glass-verse) blur(2px) saturate(1.2) brightness(1.03) !important;
        -webkit-backdrop-filter: url(#kv-glass-verse) blur(2px) saturate(1.2) brightness(1.03) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 16px !important;
        margin-bottom: 10px !important;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1) !important;
      }

      .verse-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(180deg,
          rgba(255, 255, 255, 0.22) 0%,
          rgba(255, 255, 255, 0.08) 40%,
          transparent 100%);
        border-radius: 16px 16px 0 0;
        pointer-events: none;
        z-index: 1;
      }

      /* Sticky Header glass effect */
      .sticky-header {
        background: rgba(0, 0, 0, 0.4) !important;
        backdrop-filter: blur(20px) saturate(1.3) !important;
        -webkit-backdrop-filter: blur(20px) saturate(1.3) !important;
      }

      /* Verse Reader Modal glass */
      .verse-reader-modal .reader-header {
        background: rgba(0, 0, 0, 0.4) !important;
        backdrop-filter: blur(20px) saturate(1.3) !important;
        -webkit-backdrop-filter: blur(20px) saturate(1.3) !important;
      }

      .reader-sanskrit {
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(8px) saturate(1.2) !important;
        -webkit-backdrop-filter: blur(8px) saturate(1.2) !important;
      }

      /* Enhanced Glass Highlights (applied via ::before) */
      .header-btn::before,
      .suggestion-chip::before,
      .message-content::before,
      .input-wrapper::before {
        background: linear-gradient(180deg,
          rgba(255, 255, 255, 0.28) 0%,
          rgba(255, 255, 255, 0.12) 30%,
          rgba(255, 255, 255, 0.04) 60%,
          transparent 100%) !important;
      }

      /* Inner Shadow for Depth */
      .header-btn::after,
      .suggestion-chip::after,
      .message-content::after,
      .input-wrapper::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: 
          inset 0 1px 1px rgba(255, 255, 255, 0.2),
          inset 0 -1px 1px rgba(0, 0, 0, 0.12),
          inset 1px 0 1px rgba(255, 255, 255, 0.06),
          inset -1px 0 1px rgba(0, 0, 0, 0.06);
        pointer-events: none;
        z-index: 2;
      }
    `;
    document.head.appendChild(style);

    console.log('✨ Liquid Glass effect initialized for Krishna Vaani');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidGlass);
  } else {
    initLiquidGlass();
  }

  // Expose for debugging
  window.kvLiquidGlass = {
    reinit: initLiquidGlass
  };

})();
