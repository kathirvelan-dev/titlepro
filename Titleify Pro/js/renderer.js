/**
 * Titleify Pro - High-DPI Canvas Rendering Engine & Particle Animator
 * Renders authentic Breaking Bad titles, chemical element tiles, smoke atmosphere,
 * and handles live animation & video recording.
 */

class TitleifyRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Default configuration
    this.config = {
      title1: 'Breaking',
      title2: 'Bad',
      subtitle: '',
      token1: null,
      token2: null,
      themeColor: '#2fa354', // Main chemical green
      bgColor: '#09130c',     // Deep dark green-black
      aspectRatio: '16:9',    // 16:9, 1:1, 9:16
      showSmoke: true,
      showFormulas: true,
      smokeDensity: 35,
      zoom: 1.0
    };

    // Smoke particles for animation and background atmosphere
    this.particles = [];
    this.formulas = [
      'C10H15N', 'CH3NH2', '149.24', 'P4S10', 'C8H9NO2',
      'NaCl', 'C6H12O6', '56.08', 'C21H23NO5', '35.45', '79.90'
    ];
    this.formulaObjects = [];
    this.initAtmosphere();

    // Animation state
    this.isAnimating = false;
    this.animStartTime = 0;
    this.animDuration = 4500; // ms
    this.animFrameId = null;

    // Media recording state
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }

  initAtmosphere() {
    this.particles = [];
    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        radius: 120 + Math.random() * 200,
        vx: (Math.random() - 0.4) * 0.4,
        vy: -0.2 - Math.random() * 0.5,
        alpha: 0.02 + Math.random() * 0.06,
        color: Math.random() > 0.3 ? '35, 120, 55' : '20, 80, 40'
      });
    }

    this.formulaObjects = [];
    for (let i = 0; i < 14; i++) {
      this.formulaObjects.push({
        text: this.formulas[Math.floor(Math.random() * this.formulas.length)],
        x: 100 + Math.random() * 1720,
        y: 80 + Math.random() * 920,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.15 - Math.random() * 0.2,
        alpha: 0.08 + Math.random() * 0.12,
        size: 16 + Math.random() * 14
      });
    }
  }

  updateAtmosphere(w, h, dt = 1) {
    this.particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y < -p.radius) {
        p.y = h + p.radius;
        p.x = Math.random() * w;
      }
      if (p.x < -p.radius) p.x = w + p.radius;
      if (p.x > w + p.radius) p.x = -p.radius;
    });

    this.formulaObjects.forEach(f => {
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      if (f.y < -40) {
        f.y = h + 40;
        f.x = 50 + Math.random() * (w - 100);
      }
    });
  }

  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.draw();
  }

  getDimensions(aspectRatio = this.config.aspectRatio, exportScale = 1) {
    let baseW = 1920, baseH = 1080;
    if (aspectRatio === '1:1') {
      baseW = 1440;
      baseH = 1440;
    } else if (aspectRatio === '9:16') {
      baseW = 1080;
      baseH = 1920;
    }
    return {
      width: Math.round(baseW * exportScale),
      height: Math.round(baseH * exportScale)
    };
  }

  /**
   * Main Drawing Routine
   * @param {CanvasRenderingContext2D} ctx - canvas 2d context
   * @param {number} width - canvas width
   * @param {number} height - canvas height
   * @param {object} animProgress - animation state { t, tileScale, textAlpha, glow, cameraZoom }
   */
  drawScene(ctx, width, height, anim = null) {
    const scale = width / 1920;
    const isMobileAspect = this.config.aspectRatio === '9:16';

    ctx.save();

    // Camera zoom during intro
    if (anim && anim.cameraZoom) {
      ctx.translate(width / 2, height / 2);
      ctx.scale(anim.cameraZoom, anim.cameraZoom);
      ctx.translate(-width / 2, -height / 2);
    }

    // 1. Dark Smoky Background
    const bgGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.45, width * 0.1,
      width * 0.5, height * 0.5, width * 0.75
    );
    bgGrad.addColorStop(0, '#102517');
    bgGrad.addColorStop(0.5, this.config.bgColor);
    bgGrad.addColorStop(1, '#040704');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Background Smoke & Toxic Mist
    if (this.config.showSmoke) {
      this.particles.forEach(p => {
        ctx.save();
        const grad = ctx.createRadialGradient(p.x * scale, p.y * scale, 0, p.x * scale, p.y * scale, p.radius * scale);
        grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x * scale, p.y * scale, p.radius * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // 3. Floating Chemical Formulas
    if (this.config.showFormulas) {
      ctx.save();
      ctx.font = `600 ${18 * scale}px "Montserrat Alternates", "Arial Narrow", sans-serif`;
      this.formulaObjects.forEach(f => {
        ctx.fillStyle = `rgba(100, 200, 130, ${f.alpha})`;
        ctx.fillText(f.text, f.x * scale, f.y * scale);
      });
      ctx.restore();
    }

    // 4. Render Titles
    const token1 = this.config.token1 || window.tokenizeWord(this.config.title1);
    const token2 = this.config.token2 || window.tokenizeWord(this.config.title2);

    // Layout configuration
    const fontSize = isMobileAspect ? (130 * scale) : (145 * scale);
    const tileSide = fontSize * 1.05;
    const lineHeight = fontSize * 1.15;

    let centerY = height * 0.48;
    if (this.config.subtitle && this.config.subtitle.trim()) {
      centerY = height * 0.44;
    }

    const row1Y = centerY - (lineHeight * 0.55);
    const row2Y = centerY + (lineHeight * 0.55);

    // Render Title 1
    this.drawTitleRow(ctx, token1, width / 2, row1Y, fontSize, tileSide, scale, anim, 1);

    // Render Title 2
    this.drawTitleRow(ctx, token2, width / 2, row2Y, fontSize, tileSide, scale, anim, 2);

    // Render Optional Subtitle
    if (this.config.subtitle && this.config.subtitle.trim()) {
      const subAlpha = anim ? anim.textAlpha : 1.0;
      if (subAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = subAlpha;
        ctx.font = `600 ${22 * scale}px "Arial Narrow", "Helvetica", sans-serif`;
        ctx.fillStyle = 'rgba(230, 235, 230, 0.85)';
        ctx.textAlign = 'center';
        ctx.letterSpacing = `${4 * scale}px`;
        const subY = row2Y + (fontSize * 0.85);
        ctx.fillText(this.config.subtitle.trim().toUpperCase(), width / 2, subY);
        ctx.restore();
      }
    }

    // 5. Cinematic Vignette
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.35,
      width / 2, height / 2, width * 0.72
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  /**
   * Draw a single row containing prefix, element tile, and suffix centered horizontally
   */
  drawTitleRow(ctx, token, centerX, baselineY, fontSize, tileSide, scale, anim, rowNum) {
    ctx.save();

    // Fonts setup
    const titleFont = `bold ${fontSize}px "BreakingCooper", "CooperMedium", "Georgia", serif`;
    const letterSpacing = 2 * scale;

    ctx.font = titleFont;

    // Measure prefix & suffix text
    const prefix = token.prefix || '';
    const suffix = token.suffix || '';
    const prefixWidth = prefix ? ctx.measureText(prefix).width + letterSpacing : 0;
    const suffixWidth = suffix ? ctx.measureText(suffix).width + letterSpacing : 0;

    const hasElement = token.hasElement && token.element;
    const tileSpacing = 8 * scale;
    const elementWidth = hasElement ? tileSide + (tileSpacing * 2) : 0;

    const totalWidth = prefixWidth + elementWidth + suffixWidth;
    let currentX = centerX - (totalWidth / 2);

    // Animation values for this row
    const tileScale = anim ? (rowNum === 1 ? anim.tile1Scale : anim.tile2Scale) : 1.0;
    const textAlpha = anim ? (rowNum === 1 ? anim.text1Alpha : anim.text2Alpha) : 1.0;
    const tileGlow = anim ? (rowNum === 1 ? anim.tile1Glow : anim.tile2Glow) : 0.0;

    // 1. Draw Prefix (if present)
    if (prefix && textAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = textAlpha;
      ctx.font = titleFont;
      ctx.fillStyle = '#f6f6f2';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 12 * scale;
      ctx.shadowOffsetY = 4 * scale;
      ctx.textBaseline = 'middle';
      ctx.fillText(prefix, currentX, baselineY);
      ctx.restore();
      currentX += prefixWidth;
    }

    // 2. Draw Chemical Element Tile
    if (hasElement && tileScale > 0.01) {
      const tileX = currentX + tileSpacing;
      const tileY = baselineY - (tileSide / 2);

      this.drawChemicalTile(
        ctx,
        token.element,
        tileX,
        tileY,
        tileSide,
        scale,
        tileScale,
        tileGlow
      );

      currentX += elementWidth;
    }

    // 3. Draw Suffix (if present)
    if (suffix && textAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = textAlpha;
      ctx.font = titleFont;
      ctx.fillStyle = '#f6f6f2';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 12 * scale;
      ctx.shadowOffsetY = 4 * scale;
      ctx.textBaseline = 'middle';
      ctx.fillText(suffix, currentX, baselineY);
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Draw the authentic Breaking Bad periodic table tile
   */
  drawChemicalTile(ctx, elem, x, y, size, scale, tileScale = 1.0, glowAmount = 0.0) {
    ctx.save();

    // Apply scaling from tile center
    const cx = x + size / 2;
    const cy = y + size / 2;
    ctx.translate(cx, cy);
    ctx.scale(tileScale, tileScale);
    ctx.translate(-cx, -cy);

    // Outer Glow Effect
    if (glowAmount > 0.05) {
      ctx.save();
      ctx.shadowColor = '#4eed7a';
      ctx.shadowBlur = (25 + glowAmount * 40) * scale;
      ctx.fillStyle = 'rgba(40, 160, 75, 0.4)';
      ctx.fillRect(x, y, size, size);
      ctx.restore();
    }

    // 1. Dark Green Gradient Background
    const tileGrad = ctx.createLinearGradient(x, y, x, y + size);
    tileGrad.addColorStop(0, '#2d7a46');
    tileGrad.addColorStop(0.45, '#1e5a32');
    tileGrad.addColorStop(1, '#0e341c');
    ctx.fillStyle = tileGrad;
    ctx.fillRect(x, y, size, size);

    // 2. Bright Green Outer Border
    const borderWidth = Math.max(3, 4.5 * scale);
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = '#43c06d';
    ctx.strokeRect(x + borderWidth / 2, y + borderWidth / 2, size - borderWidth, size - borderWidth);

    // 3. Subtle Inner Highlight Border
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.strokeRect(x + borderWidth + 2, y + borderWidth + 2, size - (borderWidth * 2) - 4, size - (borderWidth * 2) - 4);

    // 4. Atomic Number (Top Left)
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(size * 0.16)}px "Arial Narrow", "Roboto", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`${elem.number}`, x + (size * 0.1), y + (size * 0.08));

    // 5. Atomic Mass (Top Right)
    ctx.font = `600 ${Math.round(size * 0.12)}px "Arial Narrow", "Roboto", sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(`${elem.mass}`, x + size - (size * 0.1), y + (size * 0.1));

    // 6. Chemical Symbol (Center, large BreakingCooper serif font)
    const symbolFontSize = Math.round(size * (elem.symbol.length > 1 ? 0.52 : 0.58));
    ctx.font = `bold ${symbolFontSize}px "BreakingCooper", "CooperMedium", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 8 * scale;
    ctx.shadowOffsetY = 2 * scale;
    ctx.fillText(elem.symbol, cx, cy + (size * 0.04));

    // 7. Element Name (Bottom Center)
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = `bold ${Math.round(size * 0.125)}px "Arial Narrow", "Roboto", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = `${1 * scale}px`;
    ctx.fillText(elem.name.toUpperCase(), cx, y + size - (size * 0.08));

    ctx.restore();
  }

  /**
   * Draw current frame onto the bound canvas
   */
  draw() {
    if (this.isAnimating) return; // let animation loop handle it

    const dims = this.getDimensions();
    if (this.canvas.width !== dims.width || this.canvas.height !== dims.height) {
      this.canvas.width = dims.width;
      this.canvas.height = dims.height;
    }

    this.drawScene(this.ctx, dims.width, dims.height, null);
  }

  /**
   * Play the cinematic intro animation sequence
   */
  playIntro(onComplete = null) {
    if (this.isAnimating) {
      cancelAnimationFrame(this.animFrameId);
    }

    this.isAnimating = true;
    this.animStartTime = performance.now();

    // Trigger audio synth
    if (window.introAudio) {
      window.introAudio.play(4.5);
    }

    const dims = this.getDimensions();
    this.canvas.width = dims.width;
    this.canvas.height = dims.height;

    const animate = (timestamp) => {
      const elapsed = timestamp - this.animStartTime;
      const progress = Math.min(1.0, elapsed / this.animDuration);

      // Animation Timeline:
      // 0ms - 800ms:   Fog drifts, quiet suspense
      // 800ms - 1300ms: Tile 1 slams into view with glow
      // 1300ms - 1800ms: Tile 2 slams into view with glow
      // 1800ms - 2700ms: Text fades in
      // 2700ms - 4500ms: Cinematic camera slow zoom-in

      // Tile 1 animation
      let tile1Scale = 0;
      let tile1Glow = 0;
      if (elapsed > 750) {
        const t = Math.min(1.0, (elapsed - 750) / 450);
        // Elastic/overshoot ease-out
        tile1Scale = Math.sin(t * Math.PI * 0.5) * (1 + 0.25 * (1 - t));
        tile1Glow = Math.max(0, 1 - t);
      }

      // Tile 2 animation
      let tile2Scale = 0;
      let tile2Glow = 0;
      if (elapsed > 1200) {
        const t = Math.min(1.0, (elapsed - 1200) / 450);
        tile2Scale = Math.sin(t * Math.PI * 0.5) * (1 + 0.25 * (1 - t));
        tile2Glow = Math.max(0, 1 - t);
      }

      // Text fade in
      let text1Alpha = 0;
      if (elapsed > 1650) {
        text1Alpha = Math.min(1.0, (elapsed - 1650) / 600);
      }
      let text2Alpha = 0;
      if (elapsed > 1850) {
        text2Alpha = Math.min(1.0, (elapsed - 1850) / 600);
      }

      // Subtitle
      let textAlpha = 0;
      if (elapsed > 2100) {
        textAlpha = Math.min(1.0, (elapsed - 2100) / 700);
      }

      // Camera slow push-in
      const cameraZoom = 1.0 + (progress * 0.07);

      // Update background mist
      this.updateAtmosphere(dims.width, dims.height, 1.5);

      this.drawScene(this.ctx, dims.width, dims.height, {
        tile1Scale,
        tile1Glow,
        tile2Scale,
        tile2Glow,
        text1Alpha,
        text2Alpha,
        textAlpha,
        cameraZoom
      });

      if (progress < 1.0) {
        this.animFrameId = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        // Keep final state drawn
        this.draw();
        if (onComplete) onComplete();
      }
    };

    this.animFrameId = requestAnimationFrame(animate);
  }

  /**
   * Export high-resolution image as blob/URL
   * @param {string} format - 'png' or 'jpeg'
   * @param {number} scaleMultiplier - 1 for 1080p, 2 for 4K
   */
  exportImage(format = 'png', scaleMultiplier = 1) {
    const offscreen = document.createElement('canvas');
    const dims = this.getDimensions(this.config.aspectRatio, scaleMultiplier);
    offscreen.width = dims.width;
    offscreen.height = dims.height;

    const offCtx = offscreen.getContext('2d');
    this.drawScene(offCtx, dims.width, dims.height, null);

    const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpeg' ? 0.95 : undefined;
    return offscreen.toDataURL(mime, quality);
  }

  /**
   * Record intro animation to WebM or MP4 video
   */
  recordVideo(onProgress, onComplete, onError) {
    try {
      const dims = this.getDimensions();
      this.canvas.width = dims.width;
      this.canvas.height = dims.height;

      // Capture canvas stream at 60 FPS
      const canvasStream = this.canvas.captureStream(60);

      // Optional audio stream
      let combinedStream = canvasStream;
      if (window.introAudio) {
        try {
          const audioDest = window.introAudio.getDestinationNode();
          if (audioDest && audioDest.stream) {
            const audioTrack = audioDest.stream.getAudioTracks()[0];
            if (audioTrack) {
              combinedStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                audioTrack
              ]);
            }
          }
        } catch (e) {
          console.warn('Audio track capture fallback:', e);
        }
      }

      // Check supported MIME types
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: 8000000 // 8 Mbps high quality
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(blob);
        const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
        onComplete(videoUrl, extension);
      };

      recorder.start();

      // Progress reporting
      const startTime = performance.now();
      const progressTimer = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const pct = Math.min(99, Math.round((elapsed / 4500) * 100));
        if (onProgress) onProgress(pct);
      }, 100);

      // Play intro animation
      this.playIntro(() => {
        clearInterval(progressTimer);
        if (onProgress) onProgress(100);
        setTimeout(() => {
          recorder.stop();
        }, 300);
      });

    } catch (err) {
      if (onError) onError(err);
    }
  }
}

window.TitleifyRenderer = TitleifyRenderer;
