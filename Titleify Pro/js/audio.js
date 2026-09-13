/**
 * Titleify Pro - Web Audio API Sound Synthesizer
 * Synthesizes the ominous Breaking Bad style intro ambient drone, sub-bass rumble, and resonant chime.
 * 100% offline with zero external audio assets required.
 */

class IntroAudioSynth {
  constructor() {
    this.ctx = null;
    this.dest = null;
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

  /**
   * Get an audio stream destination for recording with MediaRecorder
   */
  getDestinationNode() {
    this.init();
    if (!this.dest) {
      this.dest = this.ctx.createMediaStreamDestination();
    }
    return this.dest;
  }

  /**
   * Plays the signature Breaking Bad style intro sound effect
   * @param {number} duration - total duration in seconds (default ~4.5s)
   */
  play(duration = 4.5) {
    try {
      const ctx = this.init();
      const now = ctx.currentTime;

      // Master output node (routes to speakers and recorder destination if available)
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.8, now);
      masterGain.connect(ctx.destination);
      if (this.dest) {
        masterGain.connect(this.dest);
      }

      // 1. Deep Sub-Bass Rumble / Impact
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      const bassFilter = ctx.createBiquadFilter();

      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(55, now); // A1 note
      bassOsc.frequency.exponentialRampToValueAtTime(32.7, now + 1.2); // Drop to C1

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(200, now);
      bassFilter.frequency.exponentialRampToValueAtTime(60, now + 2.5);

      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.6, now + 0.1);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(masterGain);

      bassOsc.start(now);
      bassOsc.stop(now + duration);

      // 2. Resonant Eerie Slide / Harmonics (Dorian mode vibe)
      const notes = [146.83, 220, 261.63, 329.63]; // D3, A3, C4, E4
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.2);
        osc.frequency.linearRampToValueAtTime(freq * 1.015, now + duration * 0.8);

        const startTime = now + 0.3 + (idx * 0.15);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 3.0);

        if (panner) {
          panner.pan.setValueAtTime((idx % 2 === 0 ? -0.4 : 0.4), now);
          osc.connect(panner);
          panner.connect(gain);
        } else {
          osc.connect(gain);
        }

        gain.connect(masterGain);
        osc.start(startTime);
        osc.stop(startTime + 3.2);
      });

      // 3. Toxic Chemical Hiss / Smoke Whoosh
      const bufferSize = ctx.sampleRate * 2.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 2.0);
      noiseFilter.Q.setValueAtTime(3, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.3);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + 2.5);

      // 4. Glass Clink / Beaker Resonance at reveal moment (t = 0.8s)
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(1174.66, now + 0.8); // D6
      chimeOsc.frequency.exponentialRampToValueAtTime(1170, now + 2.2);

      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.setValueAtTime(0.001, now + 0.8);
      chimeGain.gain.linearRampToValueAtTime(0.2, now + 0.85);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(masterGain);

      chimeOsc.start(now + 0.8);
      chimeOsc.stop(now + 2.6);

    } catch (err) {
      console.warn('Audio synthesis warning:', err);
    }
  }
}

window.introAudio = new IntroAudioSynth();
