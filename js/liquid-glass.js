/**
 * Liquid Glass Effect for SanatanOS
 * Adapted from Shu Ding's liquid-glass (https://github.com/shuding/liquid-glass)
 * Creates a beautiful distortion/refraction effect on tiles
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

  // Create SVG filter for liquid glass effect with enhanced distortion
  function createLiquidGlassFilter(id, width, height, intensity = 1.0) {
    const canvasDPI = 1;

    // Create canvas for displacement map
    const canvas = document.createElement('canvas');
    canvas.width = width * canvasDPI;
    canvas.height = height * canvasDPI;
    canvas.style.display = 'none';
    const context = canvas.getContext('2d');

    // Enhanced fragment shader with stronger edge refraction
    const fragment = (uv) => {
      const ix = uv.x - 0.5;
      const iy = uv.y - 0.5;

      // Distance to edge of rounded rectangle
      const distanceToEdge = roundedRectSDF(ix, iy, 0.42, 0.42, 0.15);

      // Edge refraction - stronger near edges, creates lens effect
      const edgeRefract = smoothStep(0.0, -0.15, distanceToEdge) * 0.8;

      // Center bulge - subtle magnification in center
      const centerDist = length(ix, iy);
      const centerBulge = smoothStep(0.5, 0, centerDist) * 0.3;

      // Combine effects
      const totalDisplacement = (edgeRefract + centerBulge) * intensity;

      // Apply displacement - scale towards center
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

    // Increase scale for more visible effect
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
    svg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    `;

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
    feDisplacementMap.setAttribute('scale', Math.round(maxScale * 1.5).toString());

    filter.appendChild(feImage);
    filter.appendChild(feDisplacementMap);
    defs.appendChild(filter);
    svg.appendChild(defs);

    return svg;
  }

  // Initialize liquid glass effect
  function initLiquidGlass() {
    // Remove existing if present
    const existing = document.getElementById('liquid-glass-filters');
    if (existing) existing.remove();
    const existingStyle = document.getElementById('liquid-glass-styles');
    if (existingStyle) existingStyle.remove();

    // Create filters for different tile sizes  
    const filterConfigs = [
      { id: 'liquid-glass-small', width: 120, height: 120, intensity: 1.0 },
      { id: 'liquid-glass-medium', width: 260, height: 120, intensity: 0.8 },
      { id: 'liquid-glass-large', width: 380, height: 130, intensity: 0.7 },
      { id: 'liquid-glass-quote', width: 380, height: 120, intensity: 0.6 }
    ];

    // Create container for SVG filters
    const container = document.createElement('div');
    container.id = 'liquid-glass-filters';
    container.style.cssText = `
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
      pointer-events: none;
    `;

    filterConfigs.forEach(config => {
      const svg = createLiquidGlassFilter(config.id, config.width, config.height, config.intensity);
      container.appendChild(svg);
    });

    document.body.appendChild(container);

    // Add CSS for liquid glass tiles
    const style = document.createElement('style');
    style.id = 'liquid-glass-styles';
    style.textContent = `
      /* Liquid Glass Effect - Distortion + Blur */
      .tile {
        backdrop-filter: url(#liquid-glass-small) blur(2px) saturate(1.2) brightness(1.05);
        -webkit-backdrop-filter: url(#liquid-glass-small) blur(2px) saturate(1.2) brightness(1.05);
      }

      .tile.medium {
        backdrop-filter: url(#liquid-glass-medium) blur(2px) saturate(1.2) brightness(1.05);
        -webkit-backdrop-filter: url(#liquid-glass-medium) blur(2px) saturate(1.2) brightness(1.05);
      }

      .tile.large {
        backdrop-filter: url(#liquid-glass-large) blur(1.5px) saturate(1.15) brightness(1.05);
        -webkit-backdrop-filter: url(#liquid-glass-large) blur(1.5px) saturate(1.15) brightness(1.05);
      }

      .tile.quote {
        backdrop-filter: url(#liquid-glass-quote) blur(1.5px) saturate(1.1) brightness(1.03);
        -webkit-backdrop-filter: url(#liquid-glass-quote) blur(1.5px) saturate(1.1) brightness(1.03);
      }

      /* Enhanced glass appearance - top light refraction */
      .tile::before {
        background: linear-gradient(180deg,
          rgba(255, 255, 255, 0.28) 0%,
          rgba(255, 255, 255, 0.12) 30%,
          rgba(255, 255, 255, 0.04) 60%,
          transparent 100%) !important;
      }

      /* Inner edge highlight for depth */
      .tile::after {
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
        z-index: 3;
      }
    `;
    document.head.appendChild(style);

    console.log('✨ Liquid Glass effect initialized for SanatanOS');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidGlass);
  } else {
    initLiquidGlass();
  }

  // Expose for debugging
  window.liquidGlassEffect = {
    reinit: initLiquidGlass
  };

})();
