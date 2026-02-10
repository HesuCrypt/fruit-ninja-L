// Simple Retro Sound Synthesizer using Web Audio API
class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy load on interaction
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(muted ? 0 : 0.3, this.ctx?.currentTime || 0);
    }
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3; // Master volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Short high-pitched blip for UI buttons
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playUiToggle() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    
    // Double blip for toggles
    const playBlip = (time: number, freq: number) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.1);
    }
    playBlip(now, 600);
    playBlip(now + 0.1, 800);
  }

  playGameStart() {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      // Ascending "Power Up" sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.4);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.4);
  }

  playGameOverTune() {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      
      const playNote = (freq: number, start: number, duration: number) => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.15, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(start);
          osc.stop(start + duration);
      };
      
      // Sad descending melody
      playNote(392.00, now, 0.3); // G4
      playNote(369.99, now + 0.3, 0.3); // F#4
      playNote(349.23, now + 0.6, 0.3); // F4
      playNote(329.63, now + 0.9, 0.8); // E4
  }

  playSlice() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playThrow() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playCombo(count: number) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    
    // Scale pitch higher with combo
    const intensity = Math.min(count, 15);
    // Base pitch starts at 220Hz (A3) and rises chromatically
    const baseFreq = 220 * Math.pow(1.05946, intensity * 2); 

    // Helper to play a layer
    const playLayer = (freq: number, type: OscillatorType, delay: number, vol: number, decay: number) => {
        if (!this.ctx || !this.masterGain) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + delay);
        
        // Attack-Decay Envelope
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(vol, now + delay + 0.05); // Quick attack
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + decay);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now + delay);
        osc.stop(now + delay + decay + 0.1);
    };

    // --- DISTINCT LAYERED SOUND SYNTHESIS ---

    // 1. Fundamental (Always present) - Square for 8-bit punch
    playLayer(baseFreq, 'square', 0, 0.2, 0.3);

    // 2. Combo > 2: Add Major Third (Harmonization) - Sawtooth for bite
    if (count > 2) {
        playLayer(baseFreq * 1.25, 'sawtooth', 0, 0.15, 0.4);
    }

    // 3. Combo > 4: Add Perfect Fifth (Power Chord) - Sine for width
    if (count > 4) {
        playLayer(baseFreq * 1.5, 'sine', 0.05, 0.2, 0.5);
    }

    // 4. Combo > 6: Add Octave (Shimmer) - Triangle
    if (count > 6) {
        playLayer(baseFreq * 2, 'triangle', 0.02, 0.15, 0.4);
    }

    // 5. Massive Combo (> 8): Add High Arpeggio
    if (count > 8) {
        playLayer(baseFreq * 3, 'square', 0.1, 0.1, 0.3);
    }
  }

  playLevelUp() {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      
      const playNote = (freq: number, time: number) => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);
          
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
          
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(time);
          osc.stop(time + 0.4);
      };

      // C Major Arpeggio (C4, E4, G4, C5)
      playNote(261.63, now);
      playNote(329.63, now + 0.1);
      playNote(392.00, now + 0.2);
      playNote(523.25, now + 0.3);
  }

  playExplosion() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    // Noise buffer for explosion
    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    noise.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
  }
}

export const soundEngine = new SoundEngine();