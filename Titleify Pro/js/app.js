/**
 * Titleify Pro - Application Controller
 * Connects UI inputs, element matcher, canvas renderer, and video recorder.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Wait for web fonts to load to ensure canvas renders with correct custom typography
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
    subtitle: '',
    selectedMatch1: null,
    selectedMatch2: null,
    aspectRatio: '16:9',
    showSmoke: true,
    showFormulas: true,
    enableSound: true
  };

  // DOM Elements
  const title1Input = document.getElementById('title1');
  const title2Input = document.getElementById('title2');
  const subtitleInput = document.getElementById('subtitle');
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

    // Tokenize
    const token1 = window.tokenizeWord(state.title1, state.selectedMatch1);
    const token2 = window.tokenizeWord(state.title2, state.selectedMatch2);

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
      token1: token1,
      token2: token2,
      aspectRatio: state.aspectRatio,
      showSmoke: state.showSmoke,
      showFormulas: state.showFormulas
    });
  }

  // Event Listeners for text inputs
  title1Input.addEventListener('input', () => {
    state.selectedMatch1 = null; // reset to auto-pick best on text change
    syncAndRender();
  });

  title2Input.addEventListener('input', () => {
    state.selectedMatch2 = null;
    syncAndRender();
  });

  subtitleInput.addEventListener('input', () => {
    syncAndRender();
  });

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
  });

  // Play Intro Sequence
  function playIntroAnimation() {
    if (playOverlayBtn) playOverlayBtn.style.display = 'none';

    if (!state.enableSound && window.introAudio && window.introAudio.ctx) {
      // mute if user disabled sound
      window.introAudio.ctx.suspend();
    } else if (state.enableSound && window.introAudio && window.introAudio.ctx) {
      window.introAudio.ctx.resume();
    }

    renderer.playIntro(() => {
      if (playOverlayBtn) playOverlayBtn.style.display = 'flex';
    });
  }

  if (playOverlayBtn) {
    playOverlayBtn.addEventListener('click', playIntroAnimation);
  }
  if (playIntroBtn) {
    playIntroBtn.addEventListener('click', playIntroAnimation);
  }

  // Download High-Res Image
  function downloadImage(format) {
    try {
      const dataUrl = renderer.exportImage(format, 1);
      const link = document.createElement('a');
      const filename = `titleify-${(state.title1 || 'title').toLowerCase()}-${(state.title2 || '').toLowerCase()}.${format}`;
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

  // Copy Image to Clipboard
  copyImageBtn.addEventListener('click', async () => {
    try {
      const dataUrl = renderer.exportImage('png', 1);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Image copied to clipboard!');
      } else {
        showToast('Clipboard copy not supported in this browser');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to copy to clipboard');
    }
  });

  // Download Video Recording
  downloadVideoBtn.addEventListener('click', () => {
    progressModal.classList.add('active');
    progressBarFill.style.width = '0%';
    progressStatus.textContent = 'Rendering animated intro frames...';

    renderer.recordVideo(
      (pct) => {
        progressBarFill.style.width = `${pct}%`;
        progressStatus.textContent = `Rendering video: ${pct}%`;
      },
      (videoUrl, ext) => {
        progressStatus.textContent = 'Video ready! Downloading...';
        progressBarFill.style.width = '100%';

        setTimeout(() => {
          const link = document.createElement('a');
          const filename = `titleify-intro-${(state.title1 || 'title').toLowerCase()}.${ext}`;
          link.download = filename;
          link.href = videoUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          progressModal.classList.remove('active');
          showToast(`Downloaded ${filename}!`);
        }, 600);
      },
      (err) => {
        progressModal.classList.remove('active');
        alert('Video recording error: ' + err.message);
      }
    );
  });

  // Presets Handlers
  const presets = [
    { label: 'Breaking Bad', t1: 'Breaking', t2: 'Bad', sub: 'Created by Vince Gilligan' },
    { label: 'Titleify Pro', t1: 'Titleify', t2: 'Pro', sub: 'Chemical Title & Intro Studio' },
    { label: 'Better Call Saul', t1: 'Better Call', t2: 'Saul', sub: 'Speedy Justice For You' },
    { label: 'Heisenberg', t1: 'Walter', t2: 'White', sub: 'Say My Name' },
    { label: 'Los Pollos', t1: 'Los Pollos', t2: 'Hermanos', sub: 'Taste The Family Tradition' },
    { label: 'El Camino', t1: 'El Camino', t2: 'Movie', sub: 'A Breaking Bad Story' },
    { label: 'Chemistry', t1: 'Chemistry', t2: 'Teacher', sub: 'Respect The Chemistry' }
  ];

  const presetsBar = document.getElementById('presetsBar');
  if (presetsBar) {
    presets.forEach(p => {
      const chip = document.createElement('button');
      chip.className = 'preset-chip';
      chip.type = 'button';
      chip.textContent = p.label;
      chip.addEventListener('click', () => {
        title1Input.value = p.t1;
        title2Input.value = p.t2;
        subtitleInput.value = p.sub;
        state.selectedMatch1 = null;
        state.selectedMatch2 = null;
        syncAndRender();
        showToast(`Loaded preset: ${p.label}`);
      });
      presetsBar.appendChild(chip);
    });
  }

  // Initial Sync and Render
  syncAndRender();
});
