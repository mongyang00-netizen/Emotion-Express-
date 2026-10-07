/**
 * Web Speech API wrapper designed for educational apps.
 * - Dynamic English voice discovery with resilient fallbacks
 * - Multi-tap prevention & immediate previous speech cancellation
 * - Robust normal / slow speed controls
 * - Real-time word boundary callback support for karaoke tracking
 */

export type PlaybackSpeed = 'normal' | 'slow';

export interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
  onWordBoundary?: (charIndex: number, length: number) => void;
}

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private isVoicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    try {
      const voices = this.synth.getVoices();
      if (voices && voices.length > 0) {
        this.cachedVoices = voices;
        this.isVoicesLoaded = true;
      }
    } catch {
      // ignore
    }
  }

  public getBestEnglishVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    if (!this.isVoicesLoaded) {
      this.loadVoices();
    }
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // Filter English voices
    const enVoices = voices.filter(v => v.lang && (v.lang.startsWith('en') || v.lang.startsWith('en-')));
    if (enVoices.length === 0) {
      // Fallback to first available or default voice
      return voices.find(v => v.default) || voices[0] || null;
    }

    // Prefer high quality / natural voices often present on Chrome, iOS Safari, macOS, Windows, Android
    const preferredKeywords = ['natural', 'google', 'samantha', 'karen', 'daniel', 'serena', 'oliver', 'ava'];
    for (const kw of preferredKeywords) {
      const match = enVoices.find(v => v.name.toLowerCase().includes(kw));
      if (match) return match;
    }

    // Prefer en-US or en-GB
    const enUS = enVoices.find(v => v.lang.toLowerCase() === 'en-us');
    if (enUS) return enUS;

    const enGB = enVoices.find(v => v.lang.toLowerCase() === 'en-gb');
    if (enGB) return enGB;

    return enVoices[0];
  }

  public stop(): void {
    if (!this.synth) return;
    try {
      this.synth.cancel();
      this.currentUtterance = null;
    } catch {
      // ignore
    }
  }

  public speak(
    text: string,
    speed: PlaybackSpeed = 'normal',
    callbacks?: SpeechCallbacks
  ): void {
    if (!this.synth) {
      callbacks?.onError?.(new Error('SpeechSynthesis is not supported in this browser.'));
      return;
    }

    // 1. Immediately cancel any currently ongoing speech to prevent overlap
    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const voice = this.getBestEnglishVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }

      // Normal speed: ~0.92 (clear child-friendly pace)
      // Slow speed: ~0.68 (turtle speed for deep pronunciation comprehension)
      utterance.rate = speed === 'slow' ? 0.68 : 0.92;
      utterance.pitch = 1.05; // Slightly warm and cheerful tone

      utterance.onstart = () => {
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        // Don't crash if interrupted by user
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          callbacks?.onError?.(e);
        } else {
          callbacks?.onEnd?.();
        }
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          callbacks?.onWordBoundary?.(event.charIndex, event.charLength || 0);
        }
      };

      this.synth.speak(utterance);
    } catch (err) {
      callbacks?.onError?.(err);
    }
  }

  public isSpeaking(): boolean {
    if (!this.synth) return false;
    return this.synth.speaking;
  }
}

export const speechEngine = new SpeechEngine();
