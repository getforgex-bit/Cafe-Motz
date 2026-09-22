/**
 * Web Audio API procedural music & soundscape engine for Motz Café.
 * Synthesizes lush, relaxing specialty coffee-shop Lo-Fi / Jazz / Piano music
 * with authentic acoustic atmospheres directly in-browser.
 */

export type SoundscapeType = 'coffee-shop' | 'chiapas-rain' | 'roastery';

export interface SoundscapePreset {
  id: SoundscapeType;
  name: string;
  description: string;
  badge: string;
}

export const SOUNDSCAPE_PRESETS: SoundscapePreset[] = [
  {
    id: 'coffee-shop',
    name: 'Música Lo-Fi & Cafetería',
    description: 'Armonías cálidas de piano Rhodes, bajo acústico y suave ambiente de espresso.',
    badge: 'Lo-Fi Jazz & Café',
  },
  {
    id: 'chiapas-rain',
    name: 'Piano Calmo & Lluvia Serrana',
    description: 'Melodías contemplativas de piano con suave llovizna sobre cafetales.',
    badge: 'Piano & Lluvia',
  },
  {
    id: 'roastery',
    name: 'Bossa Chillout & Tostaduría',
    description: 'Ritmo suave acústico con vibración de tueste y brisa de montaña.',
    badge: 'Bossa & Tueste',
  },
];

interface ChordInfo {
  bass: number;
  frequencies: number[];
  duration: number; // in beats
}

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private isRunning: boolean = false;
  private currentType: SoundscapeType = 'coffee-shop';
  private currentVolume: number = 0.65;
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private schedulerTimer: number | null = null;
  private nextBeatTime: number = 0;
  private currentBeat: number = 0;

  // Music progressions per preset
  private readonly presetsData: Record<
    SoundscapeType,
    {
      bpm: number;
      melodyScale: number[];
      chords: ChordInfo[];
      ambientNoiseFilter: number;
      ambientNoiseGain: number;
      includePercussion: boolean;
    }
  > = {
    'coffee-shop': {
      bpm: 74,
      // Pentatonic / Dorian jazz notes for relaxing improvisation
      melodyScale: [
        293.66, // D4
        329.63, // E4
        392.0,  // G4
        440.0,  // A4
        523.25, // C5
        587.33, // D5
        659.25, // E5
      ],
      // Dm9 -> G13 -> Cmaj9 -> Am9
      chords: [
        {
          bass: 73.42, // D2
          frequencies: [146.83, 174.61, 220.0, 261.63, 329.63], // D3, F3, A3, C4, E4
          duration: 4,
        },
        {
          bass: 98.0, // G2
          frequencies: [196.0, 246.94, 293.66, 349.23, 440.0], // G3, B3, D4, F4, A4
          duration: 4,
        },
        {
          bass: 65.41, // C2
          frequencies: [130.81, 164.81, 196.0, 246.94, 293.66], // C3, E3, G3, B3, D4
          duration: 4,
        },
        {
          bass: 110.0, // A2
          frequencies: [220.0, 261.63, 329.63, 392.0, 493.88], // A3, C4, E4, G4, B4
          duration: 4,
        },
      ],
      ambientNoiseFilter: 420,
      ambientNoiseGain: 0.12,
      includePercussion: true,
    },
    'chiapas-rain': {
      bpm: 62,
      // Lyrical peaceful piano scale
      melodyScale: [
        349.23, // F4
        392.0,  // G4
        440.0,  // A4
        523.25, // C5
        587.33, // D5
        698.46, // F5
      ],
      // Fmaj7 -> Am7 -> Dm7 -> Bbmaj7
      chords: [
        {
          bass: 87.31, // F2
          frequencies: [174.61, 220.0, 261.63, 329.63], // F3, A3, C4, E4
          duration: 4,
        },
        {
          bass: 110.0, // A2
          frequencies: [164.81, 196.0, 261.63, 329.63], // E3, G3, C4, E4
          duration: 4,
        },
        {
          bass: 73.42, // D2
          frequencies: [146.83, 174.61, 220.0, 261.63], // D3, F3, A3, C4
          duration: 4,
        },
        {
          bass: 116.54, // Bb2
          frequencies: [174.61, 233.08, 293.66, 349.23], // F3, Bb3, D4, F4
          duration: 4,
        },
      ],
      ambientNoiseFilter: 1800,
      ambientNoiseGain: 0.22,
      includePercussion: false,
    },
    'roastery': {
      bpm: 82,
      melodyScale: [
        261.63, // C4
        293.66, // D4
        329.63, // E4
        392.0,  // G4
        440.0,  // A4
        523.25, // C5
      ],
      // Cmaj7 -> Dm7 -> Em7 -> A7b9
      chords: [
        {
          bass: 65.41, // C2
          frequencies: [130.81, 164.81, 196.0, 246.94], // C3, E3, G3, B3
          duration: 4,
        },
        {
          bass: 73.42, // D2
          frequencies: [146.83, 174.61, 220.0, 261.63], // D3, F3, A3, C4
          duration: 4,
        },
        {
          bass: 82.41, // E2
          frequencies: [164.81, 196.0, 246.94, 293.66], // E3, G3, B3, D4
          duration: 4,
        },
        {
          bass: 110.0, // A2
          frequencies: [220.0, 277.18, 329.63, 392.0], // A3, C#4, E4, G4
          duration: 4,
        },
      ],
      ambientNoiseFilter: 600,
      ambientNoiseGain: 0.16,
      includePercussion: true,
    },
  };

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, now + 0.1);
    }
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public getPreset(): SoundscapeType {
    return this.currentType;
  }

  public async setPreset(type: SoundscapeType) {
    if (this.currentType === type && this.isRunning) return;
    this.currentType = type;
    if (this.isRunning) {
      this.stop();
      await this.start(this.currentType, this.currentVolume);
    }
  }

  public async start(type: SoundscapeType = 'coffee-shop', volume?: number): Promise<void> {
    if (typeof volume === 'number') {
      this.currentVolume = volume;
    }
    this.currentType = type;

    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      this.stopNodes();

      // Master output bus
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(
        Math.max(0.05, this.currentVolume),
        ctx.currentTime + 0.4
      );
      this.masterGain.connect(ctx.destination);

      // Music sub-bus (prominent & crystal clear)
      this.musicGain = ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.75, ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Ambient atmosphere sub-bus (soft underlying room presence)
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.2, ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      // Start gentle background atmosphere
      this.startAmbientTexture(ctx, this.ambientGain, type);

      // Reset beat counters & start musical sequencer
      this.nextBeatTime = ctx.currentTime + 0.1;
      this.currentBeat = 0;
      this.isRunning = true;

      this.schedulerTimer = window.setInterval(() => {
        if (!this.isRunning || !this.ctx) return;
        this.runScheduler();
      }, 35);
    } catch (e) {
      console.warn('AudioContext playback could not be started:', e);
    }
  }

  public stop() {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.schedulerTimer) {
      window.clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
      } catch {
        // Fallback
      }
    }

    setTimeout(() => {
      this.stopNodes();
    }, 320);
  }

  private stopNodes() {
    for (const node of this.activeNodes) {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {
        // Safe disposal
      }
    }
    this.activeNodes = [];
  }

  /**
   * Lookahead Beat Scheduler
   * Ensures perfect audio timing without Javascript timer jitter
   */
  private runScheduler() {
    if (!this.ctx || !this.musicGain || !this.isRunning) return;

    const data = this.presetsData[this.currentType];
    const secondsPerBeat = 60.0 / data.bpm;
    const scheduleAheadTime = 0.2; // seconds

    while (this.nextBeatTime < this.ctx.currentTime + scheduleAheadTime) {
      this.scheduleBeat(this.ctx, this.nextBeatTime, this.currentBeat, data);
      this.nextBeatTime += secondsPerBeat;
      this.currentBeat = (this.currentBeat + 1) % 16;
    }
  }

  /**
   * Schedules notes and musical events for a single beat
   */
  private scheduleBeat(
    ctx: AudioContext,
    time: number,
    beat: number,
    data: (typeof this.presetsData)[SoundscapeType]
  ) {
    if (!this.musicGain) return;

    const chordIndex = Math.floor(beat / 4) % data.chords.length;
    const beatInChord = beat % 4;
    const chord = data.chords[chordIndex];

    // On beat 0 of each measure: Play chord + acoustic bass root
    if (beatInChord === 0) {
      this.playRhodesChord(ctx, chord.frequencies, time, 3.8);
      this.playAcousticBass(ctx, chord.bass, time, 3.2);
    } else if (beatInChord === 2 && Math.random() < 0.6) {
      // Subtle chord pulse on beat 3
      this.playRhodesChord(ctx, chord.frequencies.slice(1), time, 1.6, 0.5);
    }

    // Gentle improvisational melody note on selected beats
    if (beatInChord === 1 || beatInChord === 2 || beatInChord === 3) {
      if (Math.random() < 0.7) {
        const noteIdx = Math.floor(Math.random() * data.melodyScale.length);
        const freq = data.melodyScale[noteIdx];
        const duration = Math.random() < 0.4 ? 1.2 : 0.6;
        this.playMelodyNote(ctx, freq, time + (Math.random() < 0.2 ? 0.15 : 0), duration);
      }
    }

    // Soft lo-fi rhythm / brushed percussion
    if (data.includePercussion) {
      // Gentle brushed hi-hat / shaker on 8th note feel
      this.playBrushedHat(ctx, time);
      if (Math.random() < 0.5) {
        const secondsPerBeat = 60.0 / data.bpm;
        this.playBrushedHat(ctx, time + secondsPerBeat * 0.5, 0.035);
      }
      // Soft lo-fi kick on beat 0 and beat 2.5
      if (beatInChord === 0) {
        this.playSoftKick(ctx, time);
      }
      // Soft rim / finger snap on beat 2 (backbeat)
      if (beatInChord === 2) {
        this.playRimClick(ctx, time);
      }
    }
  }

  /**
   * Warm Electric Piano / Rhodes chord voice
   */
  private playRhodesChord(
    ctx: AudioContext,
    frequencies: number[],
    startTime: number,
    duration: number,
    velocity: number = 1.0
  ) {
    if (!this.musicGain) return;

    frequencies.forEach((freq, idx) => {
      // Fundamental oscillator (sine)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);

      // Warm body overtone (triangle at octave)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      // Lowpass filter to give mellow vintage Rhodes warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, startTime);
      filter.frequency.exponentialRampToValueAtTime(700, startTime + duration);

      const gain = ctx.createGain();
      const peakVol = (0.055 / Math.sqrt(frequencies.length)) * velocity * (1 - idx * 0.08);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peakVol, startTime + 0.035); // Soft attack
      gain.gain.exponentialRampToValueAtTime(peakVol * 0.45, startTime + 0.4); // Decay
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // Release

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain!);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    });
  }

  /**
   * Plucked Acoustic Upright Bass note
   */
  private playAcousticBass(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number
  ) {
    if (!this.musicGain) return;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, startTime);

    // Filter sweep gives authentic acoustic finger pluck thump
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, startTime);
    filter.frequency.exponentialRampToValueAtTime(95, startTime + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.16, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.06, startTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Soothing melody chime / acoustic vibraphone bell note
   */
  private playMelodyNote(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number
  ) {
    if (!this.musicGain) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    // Subtle gentle vibrato
    const vibrato = ctx.createOscillator();
    vibrato.frequency.setValueAtTime(4.5, startTime);
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.setValueAtTime(2.0, startTime);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    const gain = ctx.createGain();
    const peakVol = 0.085;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peakVol, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(peakVol * 0.3, startTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    vibrato.start(startTime);
    osc.start(startTime);
    vibrato.stop(startTime + duration);
    osc.stop(startTime + duration);
  }

  /**
   * Soft lo-fi brushed percussion
   */
  private playBrushedHat(ctx: AudioContext, startTime: number, vol = 0.045) {
    if (!this.musicGain) return;

    const buffer = this.createNoiseBuffer(ctx, 0.1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(6000, startTime);
    filter.Q.setValueAtTime(2.5, startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    source.start(startTime);
    source.stop(startTime + 0.09);
  }

  /**
   * Soft lo-fi kick drum
   */
  private playSoftKick(ctx: AudioContext, startTime: number) {
    if (!this.musicGain) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, startTime);
    osc.frequency.exponentialRampToValueAtTime(42, startTime + 0.12);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.16, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + 0.23);
  }

  /**
   * Soft rim click / wood snap
   */
  private playRimClick(ctx: AudioContext, startTime: number) {
    if (!this.musicGain) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(820, startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.07, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.035);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + 0.04);
  }

  /**
   * Continuous gentle acoustic room presence (soothing cafe murmur / rain)
   */
  private startAmbientTexture(
    ctx: AudioContext,
    destination: GainNode,
    type: SoundscapeType
  ) {
    const data = this.presetsData[type];
    const noiseBuffer = this.createNoiseBuffer(ctx, 4);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = type === 'chiapas-rain' ? 'bandpass' : 'lowpass';
    filter.frequency.setValueAtTime(data.ambientNoiseFilter, ctx.currentTime);
    if (type === 'chiapas-rain') {
      filter.Q.setValueAtTime(0.8, ctx.currentTime);
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(data.ambientNoiseGain, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noiseSource.start();

    this.activeNodes.push({
      stop: () => noiseSource.stop(),
      disconnect: () => {
        noiseSource.disconnect();
        filter.disconnect();
        gain.disconnect();
      },
    });
  }

  private createNoiseBuffer(ctx: AudioContext, seconds: number = 3): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.07;
      b6 = white * 0.115926;
    }
    return buffer;
  }
}

export const soundscape = new SoundscapeEngine();
