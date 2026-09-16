/**
 * Titleify Pro - Cinematic 17-Second Canvas Rendering Engine & Particle Simulator
 * Replicates the authentic Breaking Bad opening sequence:
 * - Phase 1 (0.0s - 2.5s): Floating 3D Methamphetamine Chemical Formula Cloud
 * - Phase 2 (2.5s - 5.5s): 3D Periodic Table Flythrough Grid with Glowing Element Locks
 * - Phase 3 (5.5s - 12.2s): Iconic Title Reveal with Volumetric Yellow/Amber Cooking Smoke
 * - Phase 4 (12.2s - 17.0s): Subtitle / Credits Screen with Chemical Badge & Fade to Black
 */

class TitleifyRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Configuration
    this.config = {
      title1: 'Breaking',
      title2: 'Bad',
      subtitle: 'Created by Vince Gilligan',
      selectedMatch1: null,
      selectedMatch2: null,
      aspectRatio: '16:9',    // 16:9, 1:1, 9:16
      layoutMode: 'authentic', // 'authentic' (indented) or 'centered'
      showSmoke: true,
      showFormulas: true,
      enableSound: true
    };

    // Animation & Timeline State
    this.isAnimating = false;
    this.animStartTime = 0;
    this.animDuration = 17100; // 17.1 seconds matching authentic intro video
    this.animFrameId = null;

    // Media Recorder
    this.mediaRecorder = null;
    this.recordedChunks = [];

    // Particle & Simulation Systems
    this.initFormulas3D();
    this.initPeriodicGrid();
    this.initSmokeParticles();
    this.initYellowSmokePuffs();
  }

  /* -------------------------------------------------------------
     PHASE 1: 3D FLOATING FORMULA CLOUD
  -------------------------------------------------------------- */
  initFormulas3D() {
    const list = [
      'C10H15N', '149.24', 'meth', 'CH3NH2', 'C10', 'H15', 'N',
      '149.24', 'C10H15N', 'meth', 'P4S10', 'C10', 'H15', 'N'
    ];
    this.formulas3D = [];
    for (let i = 0; i < 28; i++) {
      this.formulas3D.push({
        text: list[i % list.length],
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 900,
        z: 100 + Math.random() * 1400, // Depth
        vz: -220 - Math.random() * 150, // Moving towards camera
        rot: (Math.random() - 0.5) * 0.2,
        baseSize: list[i % list.length] === 'C10H15N' || list[i % list.length] === '149.24' ? 38 : 26,
        isMajor: (i % 3 === 0)
      });
    }

    // Small floating glowing gas sparks
    this.greenSparks = [];
    for (let i = 0; i < 40; i++) {
      this.greenSparks.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        radius: 1.5 + Math.random() * 3,
        vy: -0.3 - Math.random() * 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        alpha: 0.15 + Math.random() * 0.35
      });
    }
  }

  /* -------------------------------------------------------------
     PHASE 2: PERIODIC TABLE FLYTHROUGH GRID
  -------------------------------------------------------------- */
  initPeriodicGrid() {
    // Generate a structured grid of elements around rows 3-6 and cols 1-18
    this.gridElements = window.PERIODIC_TABLE || [];
  }

  /* -------------------------------------------------------------
     ATMOSPHERIC GREEN MIST PARTICLES
  -------------------------------------------------------------- */
  initSmokeParticles() {
    this.mistPuffs = [];
    for (let i = 0; i < 35; i++) {
      this.mistPuffs.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        radius: 180 + Math.random() * 260,
        vx: (Math.random() - 0.3) * 0.4,
        vy: -0.2 - Math.random() * 0.4,
        alpha: 0.03 + Math.random() * 0.07,
        color: Math.random() > 0.4 ? '30, 95, 45' : '15, 60, 30'
      });
    }
  }

  /* -------------------------------------------------------------
     PHASE 3: VOLUMETRIC ROLLING YELLOW COOKING SMOKE
  -------------------------------------------------------------- */
  initYellowSmokePuffs() {
    this.yellowSmokePuffs = [];
    // Emitter starting from bottom right
    for (let i = 0; i < 55; i++) {
      this.yellowSmokePuffs.push({
        x: 1400 + (Math.random() - 0.3) * 600,
        y: 600 + Math.random() * 600,
        radius: 140 + Math.random() * 240,
        vx: -1.2 - Math.random() * 1.8,  // drifts left
        vy: -0.8 - Math.random() * 1.5,  // drifts upward
        growth: 0.2 + Math.random() * 0.4,
        alpha: 0.04 + Math.random() * 0.11,
        hue: 48 + Math.random() * 16, // Golden yellow to chartreuse
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008
      });
    }
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

  /* -------------------------------------------------------------
     MAIN DRAW ROUTINE (DISPATCHES PHASES OR STATIC VIEW)
  -------------------------------------------------------------- */
  draw() {
    if (this.isAnimating) return;
    const dims = this.getDimensions();
    if (this.canvas.width !== dims.width || this.canvas.height !== dims.height) {
      this.canvas.width = dims.width;
      this.canvas.height = dims.height;
    }
    // Static preview: show Phase 3 at its peak state (title + badges + subtle yellow vapor)
    this.drawSceneStatic(this.ctx, dims.width, dims.height);
  }

  drawSceneStatic(ctx, width, height) {
    const scale = width / 1920;
    ctx.save();

    // 1. Dark Green Smoky Background
    this.renderDarkGreenBackground(ctx, width, height);

    // 2. Subtle green mist
    if (this.config.showSmoke) {
      this.renderGreenMist(ctx, width, height, scale, 1.0);
    }

    // 3. Title Reveal (Phase 3 style)
    const token1 = window.tokenizeWord(this.config.title1, this.config.selectedMatch1);
    const token2 = window.tokenizeWord(this.config.title2, this.config.selectedMatch2);
    this.renderTitleLayout(ctx, width, height, scale, token1, token2, 1.0, 1.0, 0.0);

    // 4. Subtle yellow smoke curls on right side
    if (this.config.showSmoke) {
      this.renderYellowSmokeStatic(ctx, width, height, scale);
    }

    // 5. Subtitle if present
    if (this.config.subtitle && this.config.subtitle.trim()) {
      this.renderSubtitleCompact(ctx, width, height, scale, 1.0);
    }

    // 6. Cinematic Vignette
    this.renderVignette(ctx, width, height);

    ctx.restore();
  }

  /* -------------------------------------------------------------
     BACKGROUND & ATMOSPHERE
  -------------------------------------------------------------- */
  renderDarkGreenBackground(ctx, width, height) {
    const bgGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.45, width * 0.08,
      width * 0.5, height * 0.5, width * 0.8
    );
    bgGrad.addColorStop(0, '#15321f');
    bgGrad.addColorStop(0.45, '#0b1c11');
    bgGrad.addColorStop(1, '#030704');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  renderGreenMist(ctx, width, height, scale, alphaMult = 1.0) {
    ctx.save();
    this.mistPuffs.forEach(p => {
      const grad = ctx.createRadialGradient(
        p.x * scale, p.y * scale, 0,
        p.x * scale, p.y * scale, p.radius * scale
      );
      grad.addColorStop(0, `rgba(${p.color}, ${p.alpha * alphaMult})`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x * scale, p.y * scale, p.radius * scale, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  renderVignette(ctx, width, height, intensity = 0.72) {
    ctx.save();
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.32,
      width / 2, height / 2, width * 0.78
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  /* -------------------------------------------------------------
     ANIMATION LOOP (17.1 SECONDS)
  -------------------------------------------------------------- */
  playIntro(onComplete = null) {
    if (this.isAnimating) {
      cancelAnimationFrame(this.animFrameId);
    }

    this.isAnimating = true;
    this.animStartTime = performance.now();

    // Start authentic audio track
    if (this.config.enableSound && window.introAudio) {
      window.introAudio.play(17.1);
    }

    const dims = this.getDimensions();
    this.canvas.width = dims.width;
    this.canvas.height = dims.height;

    const animate = (timestamp) => {
      const elapsed = timestamp - this.animStartTime;
      const progress = Math.min(1.0, elapsed / this.animDuration);

      this.renderFrameAtTime(elapsed, dims.width, dims.height);

      if (progress < 1.0 && this.isAnimating) {
        this.animFrameId = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        this.draw();
        if (onComplete) onComplete();
      }
    };

    this.animFrameId = requestAnimationFrame(animate);
  }

  stopIntro() {
    if (this.isAnimating) {
      cancelAnimationFrame(this.animFrameId);
      this.isAnimating = false;
    }
    if (window.introAudio) {
      window.introAudio.stop();
    }
    this.draw();
  }

  /* -------------------------------------------------------------
     FRAME RENDERER BY TIMESTAMP (0ms - 17100ms)
  -------------------------------------------------------------- */
  renderFrameAtTime(elapsed, width, height) {
    const ctx = this.ctx;
    const scale = width / 1920;
    const tSec = elapsed / 1000;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Timeline phases:
    // 0.0s - 2.5s:  Phase 1 (Floating 3D Formulas & Green Mist)
    // 2.5s - 5.5s:  Phase 2 (Periodic Table 3D Flythrough)
    // 5.5s - 12.2s: Phase 3 (Title Reveal & Rolling Yellow Smoke)
    // 12.2s - 17.0s: Phase 4 (Subtitle / Credits Screen & Fade to Black)

    if (tSec < 2.5) {
      // PHASE 1: Floating 3D Chemical Formulas
      this.renderPhase1(ctx, width, height, scale, tSec);
    } else if (tSec < 5.5) {
      // PHASE 2: Periodic Table Flythrough Grid
      const p2Time = tSec - 2.5; // 0 to 3.0s
      this.renderPhase2(ctx, width, height, scale, p2Time);
    } else if (tSec < 12.2) {
      // PHASE 3: Title Reveal & Yellow Cooking Smoke
      const p3Time = tSec - 5.5; // 0 to 6.7s
      this.renderPhase3(ctx, width, height, scale, p3Time);
    } else {
      // PHASE 4: Subtitle / Credits Screen & Black Fadeout
      const p4Time = tSec - 12.2; // 0 to 4.9s
      this.renderPhase4(ctx, width, height, scale, p4Time);
    }

    ctx.restore();
  }

  /* -------------------------------------------------------------
     PHASE 1 IMPLEMENTATION: FLOATING 3D FORMULAS (0.0s - 2.5s)
  -------------------------------------------------------------- */
  renderPhase1(ctx, width, height, scale, tSec) {
    // 1. Dark Green Smoky Background
    this.renderDarkGreenBackground(ctx, width, height);

    // 2. Drifting green mist
    this.renderGreenMist(ctx, width, height, scale, 1.2);

    // 3. Green rising sparks/bubbles
    ctx.save();
    this.greenSparks.forEach(s => {
      s.y += s.vy;
      s.x += s.vx;
      if (s.y < 0) s.y = 1080;
      ctx.fillStyle = `rgba(120, 240, 150, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x * scale, s.y * scale, s.radius * scale, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 4. 3D Formulas floating toward camera
    const fov = 450;
    const cx = width / 2;
    const cy = height / 2;

    // Fade in at start, crossfade out near 2.3s
    let alphaFade = 1.0;
    if (tSec < 0.4) alphaFade = tSec / 0.4;
    if (tSec > 2.2) alphaFade = Math.max(0, 1.0 - (tSec - 2.2) / 0.3);

    ctx.save();
    this.formulas3D.forEach(f => {
      // Move z forward
      const currentZ = ((f.z + f.vz * tSec) % 1300 + 1300) % 1300;
      if (currentZ <= 20) return;

      const projScale = fov / (fov + currentZ);
      const px = cx + f.x * projScale * scale;
      const py = cy + f.y * projScale * scale;

      const fontSize = Math.round(f.baseSize * projScale * scale * 2.8);
      if (fontSize < 6 || px < -100 || px > width + 100 || py < -100 || py > height + 100) return;

      const depthAlpha = Math.min(0.9, (1.0 - (currentZ / 1300))) * alphaFade;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(f.rot);
      ctx.font = f.isMajor
        ? `bold ${fontSize}px "BreakingCooper", "CooperMedium", serif`
        : `600 ${fontSize}px "Montserrat Alternates", "Arial Narrow", sans-serif`;

      if (f.text === 'meth') {
        ctx.fillStyle = `rgba(140, 200, 150, ${depthAlpha * 0.45})`;
      } else if (f.text === 'C10H15N' || f.text === '149.24') {
        ctx.fillStyle = `rgba(220, 245, 225, ${depthAlpha * 0.85})`;
        ctx.shadowColor = 'rgba(60, 200, 100, 0.6)';
        ctx.shadowBlur = 12 * scale * projScale;
      } else {
        ctx.fillStyle = `rgba(160, 210, 175, ${depthAlpha * 0.6})`;
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.text, 0, 0);
      ctx.restore();
    });
    ctx.restore();

    this.renderVignette(ctx, width, height, 0.7);
  }

  /* -------------------------------------------------------------
     PHASE 2 IMPLEMENTATION: 3D PERIODIC TABLE FLYTHROUGH (2.5s - 5.5s)
  -------------------------------------------------------------- */
  renderPhase2(ctx, width, height, scale, p2Time) {
    this.renderDarkGreenBackground(ctx, width, height);

    const token1 = window.tokenizeWord(this.config.title1, this.config.selectedMatch1);
    const token2 = window.tokenizeWord(this.config.title2, this.config.selectedMatch2);

    const elem1 = token1.hasElement ? token1.element : { symbol: 'Br', number: 35, mass: '79.904', electrons: '2-8-18-7', oxidation: ['-1', '+1', '+5'], col: 17, row: 4 };
    const elem2 = token2.hasElement ? token2.element : { symbol: 'Ba', number: 56, mass: '137.33', electrons: '2-8-18-18-8-2', oxidation: ['+2'], col: 2, row: 6 };

    // Camera animation trajectory:
    // 0.0s - 1.2s: Zoom into grid and lock onto Element 1 (e.g. Br)
    // 1.2s - 2.2s: Pan and zoom down toward Element 2 (e.g. Ba)
    // 2.2s - 3.0s: Zoom into center & blur transition to Phase 3

    let camX, camY, camZoom;
    const target1X = (elem1.col || 17) * 160;
    const target1Y = (elem1.row || 4) * 160;
    const target2X = (elem2.col || 2) * 160;
    const target2Y = (elem2.row || 6) * 160;

    if (p2Time < 1.3) {
      const t = p2Time / 1.3;
      const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
      camX = 1400 + (target1X - 1400) * ease;
      camY = 500 + (target1Y - 500) * ease;
      camZoom = 0.9 + 0.8 * ease;
    } else if (p2Time < 2.3) {
      const t = (p2Time - 1.3) / 1.0;
      const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
      camX = target1X + (target2X - target1X) * ease;
      camY = target1Y + (target2Y - target1Y) * ease;
      camZoom = 1.7 + 0.3 * Math.sin(t * Math.PI);
    } else {
      const t = (p2Time - 2.3) / 0.7;
      camX = target2X + ((width / 2) - target2X) * t;
      camY = target2Y + ((height / 2) - target2Y) * t;
      camZoom = 2.0 + t * 1.5;
    }

    // Grid Fade-in at start, Fade-out at end
    let gridAlpha = 1.0;
    if (p2Time < 0.4) gridAlpha = p2Time / 0.4;
    if (p2Time > 2.5) gridAlpha = Math.max(0, 1.0 - (p2Time - 2.5) / 0.5);

    ctx.save();
    ctx.globalAlpha = gridAlpha;

    // Apply Camera Transform
    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-camX * scale, -camY * scale);

    // Draw visible elements in Periodic Table Grid
    const cellSize = 150 * scale;
    const gap = 8 * scale;

    this.gridElements.forEach(el => {
      const col = el.col || 1;
      const row = el.row || 1;
      const gx = col * (cellSize + gap);
      const gy = row * (cellSize + gap);

      // Cull cells far outside viewport
      const screenX = width / 2 + (gx - camX * scale) * camZoom;
      const screenY = height / 2 + (gy - camY * scale) * camZoom;
      if (screenX < -300 || screenX > width + 300 || screenY < -300 || screenY > height + 300) return;

      const isElem1 = el.symbol.toLowerCase() === elem1.symbol.toLowerCase();
      const isElem2 = el.symbol.toLowerCase() === elem2.symbol.toLowerCase();

      let isLocked = false;
      let glowAmt = 0;

      if (isElem1 && p2Time >= 0.7) {
        isLocked = true;
        glowAmt = Math.min(1.0, (p2Time - 0.7) / 0.4);
      } else if (isElem2 && p2Time >= 1.7) {
        isLocked = true;
        glowAmt = Math.min(1.0, (p2Time - 1.7) / 0.4);
      }

      this.drawPeriodicGridCell(ctx, el, gx, gy, cellSize, scale, isLocked, glowAmt);
    });

    ctx.restore();

    this.renderVignette(ctx, width, height, 0.75);
  }

  drawPeriodicGridCell(ctx, el, x, y, size, scale, isLocked, glowAmt) {
    ctx.save();

    if (isLocked) {
      // Glow and highlighted green box
      ctx.shadowColor = '#4eed7a';
      ctx.shadowBlur = (20 + glowAmt * 30) * scale;
      ctx.fillStyle = '#1c5e2e';
      ctx.fillRect(x, y, size, size);

      ctx.lineWidth = 3 * scale;
      ctx.strokeStyle = '#62f68e';
      ctx.strokeRect(x, y, size, size);
    } else {
      // Normal dim grid cell
      ctx.fillStyle = 'rgba(10, 26, 15, 0.7)';
      ctx.fillRect(x, y, size, size);
      ctx.lineWidth = 1 * scale;
      ctx.strokeStyle = 'rgba(60, 120, 75, 0.35)';
      ctx.strokeRect(x, y, size, size);
    }

    // Atomic mass (top-left)
    ctx.font = `500 ${Math.round(size * 0.13)}px "Arial Narrow", sans-serif`;
    ctx.fillStyle = isLocked ? '#ffffff' : 'rgba(180, 215, 190, 0.6)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`${el.mass}`, x + size * 0.08, y + size * 0.07);

    // Oxidation states (top-right)
    if (el.oxidation && el.oxidation.length > 0) {
      ctx.font = `600 ${Math.round(size * 0.11)}px "Arial Narrow", sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(el.oxidation[0], x + size - size * 0.08, y + size * 0.07);
    }

    // Element symbol (center)
    const symSize = Math.round(size * 0.44);
    ctx.font = `bold ${symSize}px "BreakingCooper", "CooperMedium", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(el.symbol, x + size / 2, y + size * 0.52);

    // Atomic number & electron config (bottom-left)
    ctx.font = `bold ${Math.round(size * 0.13)}px "Arial Narrow", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`${el.number}`, x + size * 0.08, y + size - size * 0.07);

    ctx.restore();
  }

  /* -------------------------------------------------------------
     PHASE 3 IMPLEMENTATION: TITLE REVEAL & ROLLING YELLOW SMOKE (5.5s - 12.2s)
  -------------------------------------------------------------- */
  renderPhase3(ctx, width, height, scale, p3Time) {
    this.renderDarkGreenBackground(ctx, width, height);

    // 1. Green background mist
    this.renderGreenMist(ctx, width, height, scale, 1.0);

    const token1 = window.tokenizeWord(this.config.title1, this.config.selectedMatch1);
    const token2 = window.tokenizeWord(this.config.title2, this.config.selectedMatch2);

    // Title reveals:
    // 0.0s - 0.6s: Tile 1 slams into place with glow
    // 0.4s - 1.0s: Tile 2 slams into place with glow
    // 0.7s - 1.5s: Text letters fade in
    // 1.5s - 6.7s: Title stays solid while thick yellow smoke rolls in

    let tile1Scale = 1.0, tile1Glow = 0;
    let tile2Scale = 1.0, tile2Glow = 0;
    let textAlpha = 1.0;

    if (p3Time < 0.6) {
      const t = p3Time / 0.6;
      tile1Scale = Math.sin(t * Math.PI * 0.5) * (1 + 0.3 * (1 - t));
      tile1Glow = Math.max(0, 1 - t);
    }
    if (p3Time < 1.0) {
      const t = Math.max(0, (p3Time - 0.3) / 0.7);
      tile2Scale = Math.sin(t * Math.PI * 0.5) * (1 + 0.3 * (1 - t));
      tile2Glow = Math.max(0, 1 - t);
    }
    if (p3Time < 1.4) {
      textAlpha = Math.max(0, (p3Time - 0.6) / 0.8);
    }

    // Crossfade out into Phase 4 near end of Phase 3
    let masterAlpha = 1.0;
    if (p3Time > 6.0) {
      masterAlpha = Math.max(0, 1.0 - (p3Time - 6.0) / 0.7);
    }

    ctx.save();
    ctx.globalAlpha = masterAlpha;

    // Slow camera push-in
    const camZoom = 1.0 + (p3Time / 6.7) * 0.05;
    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2, -height / 2);

    // Render the Title Rows
    this.renderTitleLayout(ctx, width, height, scale, token1, token2, tile1Scale, tile2Scale, tile1Glow, textAlpha);

    // 2. Volumetric Rolling Yellow Smoke (Starts at ~1.5s of Phase 3, i.e. 7.0s total)
    if (this.config.showSmoke && p3Time > 1.2) {
      const smokeTime = p3Time - 1.2;
      this.renderYellowSmokeAnimated(ctx, width, height, scale, smokeTime);
    }

    ctx.restore();

    this.renderVignette(ctx, width, height, 0.7);
  }

  /* -------------------------------------------------------------
     AUTHENTIC BREAKING BAD TITLE LAYOUT
  -------------------------------------------------------------- */
  renderTitleLayout(ctx, width, height, scale, token1, token2, tile1Scale, tile2Scale, tile1Glow, textAlpha = 1.0) {
    const isMobile = this.config.aspectRatio === '9:16';
    const fontSize = isMobile ? 130 * scale : 150 * scale;
    const tileSide = fontSize * 1.08;
    const lineHeight = fontSize * 1.2;

    const centerY = height * 0.48;
    const row1Y = centerY - (lineHeight * 0.52);
    const row2Y = centerY + (lineHeight * 0.52);

    ctx.save();
    const titleFont = `bold ${fontSize}px "BreakingCooper", "CooperMedium", serif`;
    ctx.font = titleFont;

    if (this.config.layoutMode === 'authentic' && token1.element && token2.element) {
      // Authentic show layout: Title 2 is indented so that [Ba] sits under 'ak' of 'Breaking'
      const p1 = token1.prefix || '';
      const s1 = token1.suffix || '';
      const p1W = p1 ? ctx.measureText(p1).width : 0;
      const s1W = s1 ? ctx.measureText(s1).width : 0;
      const row1Width = p1W + tileSide + s1W + (12 * scale);

      const p2 = token2.prefix || '';
      const s2 = token2.suffix || '';
      const p2W = p2 ? ctx.measureText(p2).width : 0;
      const s2W = s2 ? ctx.measureText(s2).width : 0;
      const row2Width = p2W + tileSide + s2W + (12 * scale);

      // Block starts aligned
      const blockLeft = (width / 2) - (row1Width * 0.52);
      const row1X = blockLeft;
      // In the show, the second badge aligns roughly with the 3rd/4th letter
      const row2X = blockLeft + (p1W + tileSide * 0.8);

      this.drawTitleRowAt(ctx, token1, row1X, row1Y, fontSize, tileSide, scale, tile1Scale, tile1Glow, textAlpha, false);
      this.drawTitleRowAt(ctx, token2, row2X, row2Y, fontSize, tileSide, scale, tile2Scale, 0, textAlpha, false);
    } else {
      // Balanced Centered layout
      this.drawTitleRowCentered(ctx, token1, width / 2, row1Y, fontSize, tileSide, scale, tile1Scale, tile1Glow, textAlpha);
      this.drawTitleRowCentered(ctx, token2, width / 2, row2Y, fontSize, tileSide, scale, tile2Scale, 0, textAlpha);
    }

    ctx.restore();
  }

  drawTitleRowCentered(ctx, token, centerX, baselineY, fontSize, tileSide, scale, tileScale, tileGlow, textAlpha) {
    const titleFont = `bold ${fontSize}px "BreakingCooper", "CooperMedium", serif`;
    ctx.font = titleFont;

    const prefix = token.prefix || '';
    const suffix = token.suffix || '';
    const prefixW = prefix ? ctx.measureText(prefix).width : 0;
    const suffixW = suffix ? ctx.measureText(suffix).width : 0;
    const elemW = token.hasElement ? tileSide + (14 * scale) : 0;

    const totalW = prefixW + elemW + suffixW;
    const startX = centerX - (totalW / 2);

    this.drawTitleRowAt(ctx, token, startX, baselineY, fontSize, tileSide, scale, tileScale, tileGlow, textAlpha, true);
  }

  drawTitleRowAt(ctx, token, startX, baselineY, fontSize, tileSide, scale, tileScale, tileGlow, textAlpha) {
    const titleFont = `bold ${fontSize}px "BreakingCooper", "CooperMedium", serif`;
    let curX = startX;

    // 1. Prefix Text
    if (token.prefix && textAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = textAlpha;
      ctx.font = titleFont;
      ctx.fillStyle = '#f5f6ed';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 14 * scale;
      ctx.shadowOffsetY = 4 * scale;
      ctx.textBaseline = 'middle';
      ctx.fillText(token.prefix, curX, baselineY);
      ctx.restore();
      curX += ctx.measureText(token.prefix).width + (4 * scale);
    }

    // 2. Element Tile
    if (token.hasElement && tileScale > 0.01) {
      const tileY = baselineY - (tileSide / 2);
      this.drawChemicalBadge(ctx, token.element, curX + (4 * scale), tileY, tileSide, scale, tileScale, tileGlow);
      curX += tileSide + (12 * scale);
    }

    // 3. Suffix Text
    if (token.suffix && textAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = textAlpha;
      ctx.font = titleFont;
      ctx.fillStyle = '#f5f6ed';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 14 * scale;
      ctx.shadowOffsetY = 4 * scale;
      ctx.textBaseline = 'middle';
      ctx.fillText(token.suffix, curX, baselineY);
      ctx.restore();
    }
  }

  /* -------------------------------------------------------------
     AUTHENTIC BREAKING BAD CHEMICAL BADGE
  -------------------------------------------------------------- */
  drawChemicalBadge(ctx, elem, x, y, size, scale, tileScale = 1.0, glow = 0.0) {
    ctx.save();

    const cx = x + size / 2;
    const cy = y + size / 2;
    ctx.translate(cx, cy);
    ctx.scale(tileScale, tileScale);
    ctx.translate(-cx, -cy);

    // Intense Green Outer Glow
    if (glow > 0.02) {
      ctx.save();
      ctx.shadowColor = '#50f882';
      ctx.shadowBlur = (35 + glow * 45) * scale;
      ctx.fillStyle = 'rgba(50, 200, 90, 0.5)';
      ctx.fillRect(x, y, size, size);
      ctx.restore();
    }

    // 1. Deep Emerald Green Gradient
    const bg = ctx.createLinearGradient(x, y, x, y + size);
    bg.addColorStop(0, '#246b38');
    bg.addColorStop(0.5, '#164d26');
    bg.addColorStop(1, '#0b2914');
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, size, size);

    // 2. Crisp Light Mint Border
    const bw = Math.max(3, 4 * scale);
    ctx.lineWidth = bw;
    ctx.strokeStyle = 'rgba(230, 255, 235, 0.95)';
    ctx.strokeRect(x + bw / 2, y + bw / 2, size - bw, size - bw);

    // 3. Inner fine hairline
    ctx.lineWidth = 1 * scale;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(x + bw + 2, y + bw + 2, size - (bw * 2) - 4, size - (bw * 2) - 4);

    // 4. Atomic Mass (Top Left)
    ctx.font = `600 ${Math.round(size * 0.125)}px "Arial Narrow", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`${elem.mass}`, x + size * 0.08, y + size * 0.07);

    // 5. Oxidation States (Top Right - vertical list)
    const oxStates = elem.oxidation || ['+1'];
    ctx.font = `600 ${Math.round(size * 0.105)}px "Arial Narrow", sans-serif`;
    ctx.textAlign = 'right';
    oxStates.slice(0, 3).forEach((ox, idx) => {
      ctx.fillText(ox, x + size - size * 0.08, y + size * 0.07 + (idx * size * 0.11));
    });

    // 6. Chemical Symbol (Center, authentic BreakingCooper serif)
    const symSize = Math.round(size * (elem.symbol.length > 1 ? 0.54 : 0.60));
    ctx.font = `bold ${symSize}px "BreakingCooper", "CooperMedium", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 10 * scale;
    ctx.shadowOffsetY = 2 * scale;
    ctx.fillText(elem.symbol, cx, cy + size * 0.03);

    // 7. Atomic Number & Electron Config (Bottom Left - authentic show detail!)
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = `bold ${Math.round(size * 0.14)}px "Arial Narrow", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`${elem.number}`, x + size * 0.08, y + size - size * 0.17);

    if (elem.electrons) {
      ctx.font = `500 ${Math.round(size * 0.095)}px "Arial Narrow", sans-serif`;
      ctx.fillText(elem.electrons, x + size * 0.08, y + size - size * 0.06);
    }

    ctx.restore();
  }

  /* -------------------------------------------------------------
     VOLUMETRIC ROLLING YELLOW SMOKE (ANIMATED & STATIC)
  -------------------------------------------------------------- */
  renderYellowSmokeAnimated(ctx, width, height, scale, smokeTime) {
    ctx.save();
    // Smoke drifts from bottom right toward center-left
    const flowX = Math.min(width * 0.6, smokeTime * 220 * scale);

    this.yellowSmokePuffs.forEach((p, idx) => {
      const puffX = (p.x * scale) - flowX + (Math.sin(smokeTime + idx) * 30 * scale);
      const puffY = (p.y * scale) - (smokeTime * 50 * scale) + (Math.cos(smokeTime * 0.8 + idx) * 20 * scale);
      const puffRad = (p.radius + smokeTime * 20) * scale;

      const alpha = p.alpha * Math.min(1.0, smokeTime / 1.0);

      const grad = ctx.createRadialGradient(puffX, puffY, 0, puffX, puffY, puffRad);
      grad.addColorStop(0, `hsla(${p.hue}, 85%, 52%, ${alpha * 0.5})`);
      grad.addColorStop(0.4, `hsla(${p.hue - 8}, 75%, 45%, ${alpha * 0.3})`);
      grad.addColorStop(1, `hsla(${p.hue}, 80%, 40%, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(puffX, puffY, puffRad, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  renderYellowSmokeStatic(ctx, width, height, scale) {
    ctx.save();
    this.yellowSmokePuffs.slice(0, 20).forEach((p, idx) => {
      const puffX = p.x * scale - 200 * scale;
      const puffY = p.y * scale - 100 * scale;
      const puffRad = p.radius * scale;

      const grad = ctx.createRadialGradient(puffX, puffY, 0, puffX, puffY, puffRad);
      grad.addColorStop(0, `hsla(${p.hue}, 80%, 50%, ${p.alpha * 0.45})`);
      grad.addColorStop(0.4, `hsla(${p.hue - 6}, 70%, 45%, ${p.alpha * 0.25})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(puffX, puffY, puffRad, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  /* -------------------------------------------------------------
     PHASE 4 IMPLEMENTATION: SUBTITLE / CREDITS SCREEN (12.2s - 17.0s)
  -------------------------------------------------------------- */
  renderPhase4(ctx, width, height, scale, p4Time) {
    this.renderDarkGreenBackground(ctx, width, height);

    // Drifting yellow-green mist
    this.renderYellowSmokeStatic(ctx, width, height, scale);

    // Subtitle fade in (0.0s - 0.8s)
    let textAlpha = Math.min(1.0, p4Time / 0.8);

    // Fade to black at end (3.5s - 4.8s)
    let blackFade = 0;
    if (p4Time > 3.2) {
      blackFade = Math.min(1.0, (p4Time - 3.2) / 1.5);
    }

    const subData = window.tokenizeSubtitle(this.config.subtitle || 'Created by Vince Gilligan');

    ctx.save();
    ctx.globalAlpha = textAlpha * (1 - blackFade);

    const isMobile = this.config.aspectRatio === '9:16';
    const fontSize = isMobile ? 80 * scale : 92 * scale;
    const tileSide = fontSize * 1.05;
    const centerY = height * 0.48;

    // Line 1: e.g. [Cr]eated by
    const token = subData.token1;
    const line1Y = subData.line2 ? (centerY - fontSize * 0.7) : centerY;
    const tokenSuffix = subData.token1Suffix || '';

    ctx.font = `bold ${fontSize}px "BreakingCooper", "CooperMedium", serif`;
    const prefix = token.prefix || '';
    const suffix = (token.suffix || '') + tokenSuffix;
    const prefixW = prefix ? ctx.measureText(prefix).width : 0;
    const suffixW = suffix ? ctx.measureText(suffix).width : 0;
    const elemW = token.hasElement ? tileSide + 12 * scale : 0;
    const totalW = prefixW + elemW + suffixW;

    let curX = (width / 2) - (totalW / 2);

    if (prefix) {
      ctx.fillStyle = '#f5f6ed';
      ctx.textBaseline = 'middle';
      ctx.fillText(prefix, curX, line1Y);
      curX += prefixW + 4 * scale;
    }

    if (token.hasElement) {
      this.drawChemicalBadge(ctx, token.element, curX, line1Y - tileSide / 2, tileSide, scale, 1.0, 0.0);
      curX += tileSide + 10 * scale;
    }

    if (suffix) {
      ctx.fillStyle = '#f5f6ed';
      ctx.textBaseline = 'middle';
      ctx.fillText(suffix, curX, line1Y);
    }

    // Line 2: e.g. Vince Gilligan
    if (subData.line2) {
      const line2Y = centerY + fontSize * 0.8;
      ctx.font = `bold ${fontSize * 0.88}px "BreakingCooper", "CooperMedium", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f5f6ed';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 12 * scale;
      ctx.fillText(subData.line2, width / 2, line2Y);
    }

    ctx.restore();

    // Final Fade to Pitch Black
    if (blackFade > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${blackFade})`;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } else {
      this.renderVignette(ctx, width, height, 0.75);
    }
  }

  renderSubtitleCompact(ctx, width, height, scale, alpha = 1.0) {
    const subText = this.config.subtitle.trim();
    if (!subText) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `600 ${22 * scale}px "Arial Narrow", sans-serif`;
    ctx.fillStyle = 'rgba(235, 245, 235, 0.85)';
    ctx.textAlign = 'center';
    ctx.letterSpacing = `${3 * scale}px`;
    ctx.fillText(subText.toUpperCase(), width / 2, height * 0.86);
    ctx.restore();
  }

  /* -------------------------------------------------------------
     EXPORT HIGH RESOLUTION IMAGE (PNG / JPEG)
  -------------------------------------------------------------- */
  exportImage(format = 'png', scaleMultiplier = 1) {
    const offscreen = document.createElement('canvas');
    const dims = this.getDimensions(this.config.aspectRatio, scaleMultiplier);
    offscreen.width = dims.width;
    offscreen.height = dims.height;

    const offCtx = offscreen.getContext('2d');
    this.drawSceneStatic(offCtx, dims.width, dims.height);

    const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpeg' ? 0.95 : undefined;
    return offscreen.toDataURL(mime, quality);
  }

  /* -------------------------------------------------------------
     VIDEO RECORDER (60 FPS, COMBINED VIDEO + AUDIO STREAM)
  -------------------------------------------------------------- */
  recordVideo(onProgress, onComplete, onError) {
    try {
      const dims = this.getDimensions();
      this.canvas.width = dims.width;
      this.canvas.height = dims.height;

      const canvasStream = this.canvas.captureStream(60);
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
          console.warn('Audio track capture error:', e);
        }
      }

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
        videoBitsPerSecond: 10000000 // 10 Mbps pristine quality
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

      const startTime = performance.now();
      const progressTimer = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const pct = Math.min(99, Math.round((elapsed / this.animDuration) * 100));
        if (onProgress) onProgress(pct);
      }, 200);

      this.playIntro(() => {
        clearInterval(progressTimer);
        if (onProgress) onProgress(100);
        setTimeout(() => {
          recorder.stop();
        }, 400);
      });

    } catch (err) {
      if (onError) onError(err);
    }
  }
}

window.TitleifyRenderer = TitleifyRenderer;
