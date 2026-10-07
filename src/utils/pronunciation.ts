/**
 * 100% Static MP3 Audio Engine for Word Pronunciation & Example Sentences.
 * - ZERO Web Speech API dependency (guarantees universal compatibility in all browsers/OS).
 * - Pre-generated American English MP3 audio files in /public/audio/words/ and /public/audio/examples/.
 * - Always stops existing audio before playing a new track to prevent overlapping speech.
 * - Supports normal and slow turtle playback speeds.
 */

class PronunciationPlayer {
  private currentAudio: HTMLAudioElement | null = null;

  public stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
  }

  public playWord(word: string, speed: 'normal' | 'slow' = 'normal'): void {
    this.stop();
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '').trim();
    if (!cleanWord) return;

    try {
      const audio = new Audio(`/audio/words/${cleanWord}.mp3`);
      audio.playbackRate = speed === 'slow' ? 0.72 : 1.0;
      this.currentAudio = audio;

      audio.play().catch(() => {
        // Fallback for plurals (e.g., bikes -> bike)
        if (cleanWord.endsWith('s') && cleanWord.length > 3) {
          const singular = cleanWord.slice(0, -1);
          const fallbackAudio = new Audio(`/audio/words/${singular}.mp3`);
          fallbackAudio.playbackRate = speed === 'slow' ? 0.72 : 1.0;
          this.currentAudio = fallbackAudio;
          fallbackAudio.play().catch((err) => {
            console.warn(`Word fallback audio failed for ${singular}:`, err);
          });
        }
      });
    } catch (err) {
      console.warn('Word audio initialization error:', err);
    }
  }

  public playExample(emotionId: string): void {
    this.stop();
    const cleanId = emotionId.toLowerCase().trim();
    if (!cleanId) return;

    try {
      const audio = new Audio(`/audio/examples/${cleanId}.mp3`);
      audio.playbackRate = 0.95;
      this.currentAudio = audio;

      audio.play().catch((err) => {
        console.warn(`Example MP3 play failed for ${cleanId}:`, err);
      });
    } catch (err) {
      console.warn('Example audio initialization error:', err);
    }
  }
}

export const pronunciationPlayer = new PronunciationPlayer();
