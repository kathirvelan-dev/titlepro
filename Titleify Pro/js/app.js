/**
 * Titleify Pro - Application Controller
 * Connects UI inputs, element matcher, canvas renderer, and video recorder.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Wait for web fonts to load
  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
  } catch (e) {
    console.warn('Font loading check:', e);
  }

  const canvas = document.getElementById('renderCanvas');
  const renderer = new TitleifyRenderer(canvas);

  // State
  let state = {
    title1: 'Breaking',
    title2: 'Bad',
    subtitle: 'Created by Vince Gilligan',
    selectedMatch1: null,
    selectedMatch2: null,
    layoutMode: 'authentic',
    aspectRatio: '16:9',
    showSmoke: true,
    showFormulas: true,
    enableSound: true
  };

  // DOM Elements
  const title1Input = document.getElementById('title1');
  const title2Input = document.getElementById('title2');
  const subtitleInput = document.getElementById('subtitle');
  const layoutModeSelect = document.getElementById('layoutMode');
  const elementChips1 = document.getElementById('elementChips1');
  const elementChips2 = document.getElementById('elementChips2');
  const aspectRatioSelect = document.getElementById('aspectRatio');
  const showSmokeToggle = document.getElementById('showSmoke');
  const showFormulasToggle = document.getElementById('showFormulas');
  const enableSoundToggle = document.getElementById('enableSound');
  const previewContainer = document.getElementById('previewContainer');
  const playOverlayBtn = document.getElementById('playOverlayBtn');
  const playIntroBtn = document.getElementById('playIntroBtn');
  const downloadPngBtn = document.getElementById('downloadPngBtn');
  const downloadJpgBtn = document.getElementById('downloadJpgBtn');
  const downloadVideoBtn = document.getElementById('downloadVideoBtn');
  const copyImageBtn = document.getElementById('copyImageBtn');
  const presetsBar = document.getElementById('presetsBar');

  // Modal & Toast
  const progressModal = document.getElementById('progressModal');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressStatus = document.getElementById('progressStatus');
  const toast = document.getElementById('toast');

  function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Preload authentic soundtrack
  if (window.introAudio) {
    window.introAudio.loadTrack().catch(() => {});
  }

  // Presets Definition
  const PRESETS = [
    { label: 'Breaking Bad', title1: 'Breaking', title2: 'Bad', subtitle: 'Created by Vince Gilligan' },
    { label: 'Better Call Saul', title1: 'Better', title2: 'Call Saul', subtitle: 'Created by Vince Gilligan & Peter Gould' },
    { label: 'Walter White', title1: 'Walter', title2: 'White', subtitle: 'Say My Name' },
    { label: 'Jesse Pinkman', title1: 'Jesse', title2: 'Pinkman', subtitle: 'Yeah Science!' },
    { label: 'Los Pollos Hermanos', title1: 'Los Pollos', title2: 'Hermanos', subtitle: 'Taste The Difference' },
    { label: 'Heisenberg', title1: 'Heisen', title2: 'berg', subtitle: 'I Am The One Who Knocks' }
  ];

  if (presetsBar) {
    presetsBar.innerHTML = '';
    PRESETS.forEach(preset => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-btn';
      btn.textContent = preset.label;
      btn.addEventListener('click', () => {
        title1Input.value = preset.title1;
        title2Input.value = preset.title2;
        subtitleInput.value = preset.subtitle;
        state.selectedMatch1 = null;
        state.selectedMatch2 = null;
        syncAndRender();
        showToast(`Preset loaded: ${preset.label}`);
      });
      presetsBar.appendChild(btn);
    });
  }

  // Update Element Selection Chips for a given title
  function updateElementChips(container, word, selectedMatch, onSelect) {
    container.innerHTML = '';
    const matches = window.findElementMatches(word);

    if (matches.length === 0) {
      const noneNotice = document.createElement('span');
      noneNotice.style.fontSize = '11px';
      noneNotice.style.color = '#718576';
      noneNotice.textContent = 'No matching chemical elements (plain text)';
      container.appendChild(noneNotice);
      return;
    }

    matches.forEach(match => {
      const chip = document.createElement('div');
      chip.className = 'element-chip';
      
      const isActive = selectedMatch
        ? (selectedMatch.element.symbol === match.element.symbol && selectedMatch.startIndex === match.startIndex)
        : (matches[0] === match);

      if (isActive) chip.classList.add('active');

      chip.innerHTML = `
        <span class="element-chip-symbol">[${match.element.symbol}]</span>
        <span>${match.element.name}</span>
        <span class="element-chip-num">#${match.element.number}</span>
      `;

      chip.addEventListener('click', () => {
        onSelect(match);
      });

      container.appendChild(chip);
    });
  }

  // Sync state and trigger render
  function syncAndRender() {
    state.title1 = title1Input.value || '';
    state.title2 = title2Input.value || '';
    state.subtitle = subtitleInput.value || '';
    if (layoutModeSelect) state.layoutMode = layoutModeSelect.value || 'authentic';

    // Update chips
    updateElementChips(elementChips1, state.title1, state.selectedMatch1, (match) => {
      state.selectedMatch1 = match;
      syncAndRender();
    });

    updateElementChips(elementChips2, state.title2, state.selectedMatch2, (match) => {
      state.selectedMatch2 = match;
      syncAndRender();
    });

    // Update renderer config
    renderer.setConfig({
      title1: state.title1,
      title2: state.title2,
      subtitle: state.subtitle,
      selectedMatch1: state.selectedMatch1,
      selectedMatch2: state.selectedMatch2,
      layoutMode: state.layoutMode,
      aspectRatio: state.aspectRatio,
      showSmoke: state.showSmoke,
      showFormulas: state.showFormulas,
      enableSound: state.enableSound
    });
  }

  // Event Listeners for text inputs
  title1Input.addEventListener('input', () => {
    state.selectedMatch1 = null;
    syncAndRender();
  });

  title2Input.addEventListener('input', () => {
    state.selectedMatch2 = null;
    syncAndRender();
  });

  subtitleInput.addEventListener('input', () => {
    syncAndRender();
  });

  if (layoutModeSelect) {
    layoutModeSelect.addEventListener('change', (e) => {
      state.layoutMode = e.target.value;
      syncAndRender();
    });
  }

  // Settings
  aspectRatioSelect.addEventListener('change', (e) => {
    state.aspectRatio = e.target.value;
    previewContainer.className = 'preview-container';
    if (state.aspectRatio === '1:1') {
      previewContainer.classList.add('aspect-1-1');
    } else if (state.aspectRatio === '9:16') {
      previewContainer.classList.add('aspect-9-16');
    }
    syncAndRender();
  });

  showSmokeToggle.addEventListener('change', (e) => {
    state.showSmoke = e.target.checked;
    syncAndRender();
  });

  showFormulasToggle.addEventListener('change', (e) => {
    state.showFormulas = e.target.checked;
    syncAndRender();
  });

  enableSoundToggle.addEventListener('change', (e) => {
    state.enableSound = e.target.checked;
    renderer.setConfig({ enableSound: state.enableSound });
  });

  // Play / Stop Intro Sequence Toggle
  function toggleIntroAnimation() {
    if (renderer.isAnimating) {
      renderer.stopIntro();
      if (playOverlayBtn) playOverlayBtn.style.display = 'flex';
      if (playIntroBtn) {
        playIntroBtn.innerHTML = `
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          Play Intro Sequence
        `;
      }
      return;
    }

    if (playOverlayBtn) playOverlayBtn.style.display = 'none';
    if (playIntroBtn) {
      playIntroBtn.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        Stop Intro
      `;
    }

    renderer.playIntro(() => {
      if (playOverlayBtn) playOverlayBtn.style.display = 'flex';
      if (playIntroBtn) {
        playIntroBtn.innerHTML = `
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          Play Intro Sequence
        `;
      }
    });
  }

  if (playOverlayBtn) {
    playOverlayBtn.addEventListener('click', toggleIntroAnimation);
  }
  if (playIntroBtn) {
    playIntroBtn.addEventListener('click', toggleIntroAnimation);
  }

  // Download High-Res Image
  function downloadImage(format) {
    try {
      const dataUrl = renderer.exportImage(format, 1);
      const link = document.createElement('a');
      const clean1 = (state.title1 || 'title').trim().replace(/\\s+/g, '-');
      const clean2 = (state.title2 || '').trim().replace(/\\s+/g, '-');
      const filename = `${clean1}-${clean2}-Titleify.${format}`.toLowerCase();
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Downloaded ${filename} successfully!`);
    } catch (err) {
      console.error(err);
      alert('Could not generate image download: ' + err.message);
    }
  }

  downloadPngBtn.addEventListener('click', () => downloadImage('png'));
  downloadJpgBtn.addEventListener('click', () => downloadImage('jpeg'));

  // Copy to Clipboard
  if (copyImageBtn) {
    copyImageBtn.addEventListener('click', async () => {
      try {
        const offscreen = document.createElement('canvas');
        const dims = renderer.getDimensions(state.aspectRatio, 1);
        offscreen.width = dims.width;
        offscreen.height = dims.height;
        const offCtx = offscreen.getContext('2d');
        renderer.drawSceneStatic(offCtx, dims.width, dims.height);

        offscreen.toBlob(async (blob) => {
          if (!blob) throw new Error('Blob generation failed');
          if (navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            showToast('Image copied to clipboard!');
          } else {
            showToast('Clipboard copy not supported by your browser');
          }
        }, 'image/png');
      } catch (err) {
        console.error(err);
        showToast('Clipboard error: ' + err.message);
      }
    });
  }

  // Render & Download High-Def 17-second Video
  downloadVideoBtn.addEventListener('click', () => {
    progressModal.classList.add('active');
    progressBarFill.style.width = '0%';
    progressStatus.textContent = 'Rendering 17-second cinematic sequence with authentic soundtrack...';

    renderer.recordVideo(
      (progressPct) => {
        progressBarFill.style.width = `${progressPct}%`;
        if (progressPct < 20) {
          progressStatus.textContent = 'Phase 1: Floating chemical formulas in 3D...';
        } else if (progressPct < 40) {
          progressStatus.textContent = 'Phase 2: Periodic table flythrough & element locks...';
        } else if (progressPct < 75) {
          progressStatus.textContent = 'Phase 3: Title reveal & volumetric cooking smoke...';
        } else if (progressPct < 95) {
          progressStatus.textContent = 'Phase 4: Subtitle credits & cinematic fadeout...';
        } else {
          progressStatus.textContent = 'Finalizing video and encoding soundtrack...';
        }
      },
      (videoUrl, extension) => {
        progressModal.classList.remove('active');
        const link = document.createElement('a');
        const clean1 = (state.title1 || 'Breaking').trim().replace(/\\s+/g, '-');
        const clean2 = (state.title2 || 'Bad').trim().replace(/\\s+/g, '-');
        const filename = `${clean1}-${clean2}-Intro-1080p.${extension}`;
        link.download = filename;
        link.href = videoUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`Video ${filename} downloaded successfully!`);
      },
      (err) => {
        progressModal.classList.remove('active');
        console.error('Video recording failed:', err);
        alert('Video recording failed: ' + err.message);
      }
    );
  });

  // Initial render
  syncAndRender();
});
