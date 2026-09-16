/**
 * Titleify Pro - Web Audio Engine
 * Plays the authentic Breaking Bad theme soundtrack (dobro guitar riff, sub-bass,
 * percussion, whistle slide, and smoke hiss) synchronized with the 17-second intro.
 * Routes directly to speakers and MediaStreamDestination for video recording.
 */

class IntroAudioSynth {
  constructor() {
    this.ctx = null;
    this.dest = null;
    this.audioBuffer = null;
    this.currentSource = null;
    this.isLoading = false;
    this.isLoaded = false;
    this.initPromise = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  getDestinationNode() {
    this.init();
    if (!this.dest) {
      this.dest = this.ctx.createMediaStreamDestination();
    }
    return this.dest;
  }

  /**
   * Preload and decode the authentic theme soundtrack
   */
  async loadTrack() {
    if (this.isLoaded && this.audioBuffer) return this.audioBuffer;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const ctx = this.init();

        // 1. Try to load from base64 data URI if available
        if (window.THEME_AUDIO_BASE64) {
          const res = await fetch(window.THEME_AUDIO_BASE64);
          const arrayBuffer = await res.arrayBuffer();
          this.audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          this.isLoaded = true;
          return this.audioBuffer;
        }

        // 2. Try loading from audio/theme.mp3 directly
        const res = await fetch('audio/theme.mp3');
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          this.audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          this.isLoaded = true;
          return this.audioBuffer;
        }
      } catch (err) {
        console.warn('Could not decode audio file, will fallback to procedural synth:', err);
      }
      return null;
    })();

    return this.initPromise;
  }

  /**
   * Plays the authentic Breaking Bad theme
   * @param {number} duration - total duration in seconds (17.1s)
   */
  async play(duration = 17.1) {
    this.stop();
    const ctx = this.init();

    // Ensure soundtrack is loaded
    if (!this.audioBuffer) {
      await this.loadTrack();
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, now);
    masterGain.connect(ctx.destination);
    
    // Connect to recorder stream destination if active
    if (this.dest) {
      masterGain.connect(this.dest);
    }

    if (this.audioBuffer) {
      // Play authentic soundtrack
      const source = ctx.createBufferSource();
      source.buffer = this.audioBuffer;
      source.connect(masterGain);
      source.start(now);
      this.currentSource = source;
      return;
    }

    // Fallback procedural sound generator if audio track is blocked
    this.playFallbackSynth(ctx, masterGain, now, duration);
  }

  stop() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {}
      this.currentSource = null;
    }
  }

  playFallbackSynth(ctx, masterGain, now, duration) {
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    const bassFilter = ctx.createBiquadFilter();

    bassOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(55, now);
    bassOsc.frequency.exponentialRampToValueAtTime(32.7, now + 3.0);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(200, now);
    bassFilter.frequency.exponentialRampToValueAtTime(60, now + 5.0);

    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(0.6, now + 0.5);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(masterGain);

    bassOsc.start(now);
    bassOsc.stop(now + duration);
  }
}

window.IntroAudioSynth = IntroAudioSynth;
window.introAudio = new IntroAudioSynth();
