export interface WordTiming {
  word: string;
  start: number;
  end: number;
  sentenceIdx: number;
}

export interface PageTimingData {
  totalDuration: number;
  sentenceBounds: { start: number; end: number }[];
  words: WordTiming[];
}

export const STORY_TIMINGS: Record<number, PageTimingData> = {
  // Page 1 (7.06s)
  // "School was over. Leo sent a message to his best friend Max. "Do you want to ride bikes today?""
  1: {
    totalDuration: 7.06,
    sentenceBounds: [
      { start: 0.0, end: 1.6 },
      { start: 1.8, end: 5.3 },
      { start: 5.5, end: 7.06 },
    ],
    words: [
      { word: "School", start: 0.0, end: 0.55, sentenceIdx: 0 },
      { word: "was", start: 0.55, end: 0.85, sentenceIdx: 0 },
      { word: "over.", start: 0.85, end: 1.6, sentenceIdx: 0 },

      { word: "Leo", start: 1.8, end: 2.25, sentenceIdx: 1 },
      { word: "sent", start: 2.25, end: 2.6, sentenceIdx: 1 },
      { word: "a", start: 2.6, end: 2.8, sentenceIdx: 1 },
      { word: "message", start: 2.8, end: 3.3, sentenceIdx: 1 },
      { word: "to", start: 3.3, end: 3.55, sentenceIdx: 1 },
      { word: "his", start: 3.55, end: 3.8, sentenceIdx: 1 },
      { word: "best", start: 3.8, end: 4.15, sentenceIdx: 1 },
      { word: "friend", start: 4.15, end: 4.6, sentenceIdx: 1 },
      { word: "Max.", start: 4.6, end: 5.3, sentenceIdx: 1 },

      { word: '"Do', start: 5.5, end: 5.75, sentenceIdx: 2 },
      { word: "you", start: 5.75, end: 5.95, sentenceIdx: 2 },
      { word: "want", start: 5.95, end: 6.2, sentenceIdx: 2 },
      { word: "to", start: 6.2, end: 6.35, sentenceIdx: 2 },
      { word: "ride", start: 6.35, end: 6.6, sentenceIdx: 2 },
      { word: "bikes", start: 6.6, end: 6.85, sentenceIdx: 2 },
      { word: 'today?"', start: 6.85, end: 7.06, sentenceIdx: 2 },
    ],
  },

  // Page 2 (7.63s)
  // "Two hours passed, but there was no reply. The message was unread. Leo sat on the bench and felt worried."
  2: {
    totalDuration: 7.63,
    sentenceBounds: [
      { start: 0.0, end: 2.8 },
      { start: 3.0, end: 4.8 },
      { start: 5.0, end: 7.63 },
    ],
    words: [
      { word: "Two", start: 0.0, end: 0.35, sentenceIdx: 0 },
      { word: "hours", start: 0.35, end: 0.75, sentenceIdx: 0 },
      { word: "passed,", start: 0.75, end: 1.35, sentenceIdx: 0 },
      { word: "but", start: 1.45, end: 1.7, sentenceIdx: 0 },
      { word: "there", start: 1.7, end: 1.95, sentenceIdx: 0 },
      { word: "was", start: 1.95, end: 2.2, sentenceIdx: 0 },
      { word: "no", start: 2.2, end: 2.45, sentenceIdx: 0 },
      { word: "reply.", start: 2.45, end: 2.85, sentenceIdx: 0 },

      { word: "The", start: 3.0, end: 3.25, sentenceIdx: 1 },
      { word: "message", start: 3.25, end: 3.75, sentenceIdx: 1 },
      { word: "was", start: 3.75, end: 4.05, sentenceIdx: 1 },
      { word: "unread.", start: 4.05, end: 4.8, sentenceIdx: 1 },

      { word: "Leo", start: 5.0, end: 5.35, sentenceIdx: 2 },
      { word: "sat", start: 5.35, end: 5.65, sentenceIdx: 2 },
      { word: "on", start: 5.65, end: 5.85, sentenceIdx: 2 },
      { word: "the", start: 5.85, end: 6.05, sentenceIdx: 2 },
      { word: "bench", start: 6.05, end: 6.45, sentenceIdx: 2 },
      { word: "and", start: 6.45, end: 6.7, sentenceIdx: 2 },
      { word: "felt", start: 6.7, end: 7.05, sentenceIdx: 2 },
      { word: "worried.", start: 7.05, end: 7.63, sentenceIdx: 2 },
    ],
  },

  // Page 3 (8.62s)
  // "The next morning, Leo saw Max at school. Max was talking and laughing with other friends. He did not look at Leo."
  3: {
    totalDuration: 8.62,
    sentenceBounds: [
      { start: 0.0, end: 3.1 },
      { start: 3.3, end: 6.4 },
      { start: 6.6, end: 8.62 },
    ],
    words: [
      { word: "The", start: 0.0, end: 0.25, sentenceIdx: 0 },
      { word: "next", start: 0.25, end: 0.6, sentenceIdx: 0 },
      { word: "morning,", start: 0.6, end: 1.25, sentenceIdx: 0 },
      { word: "Leo", start: 1.4, end: 1.75, sentenceIdx: 0 },
      { word: "saw", start: 1.75, end: 2.1, sentenceIdx: 0 },
      { word: "Max", start: 2.1, end: 2.45, sentenceIdx: 0 },
      { word: "at", start: 2.45, end: 2.65, sentenceIdx: 0 },
      { word: "school.", start: 2.65, end: 3.1, sentenceIdx: 0 },

      { word: "Max", start: 3.3, end: 3.65, sentenceIdx: 1 },
      { word: "was", start: 3.65, end: 3.9, sentenceIdx: 1 },
      { word: "talking", start: 3.9, end: 4.4, sentenceIdx: 1 },
      { word: "and", start: 4.4, end: 4.6, sentenceIdx: 1 },
      { word: "laughing", start: 4.6, end: 5.15, sentenceIdx: 1 },
      { word: "with", start: 5.15, end: 5.4, sentenceIdx: 1 },
      { word: "other", start: 5.4, end: 5.75, sentenceIdx: 1 },
      { word: "friends.", start: 5.75, end: 6.4, sentenceIdx: 1 },

      { word: "He", start: 6.6, end: 6.85, sentenceIdx: 2 },
      { word: "did", start: 6.85, end: 7.15, sentenceIdx: 2 },
      { word: "not", start: 7.15, end: 7.45, sentenceIdx: 2 },
      { word: "look", start: 7.45, end: 7.8, sentenceIdx: 2 },
      { word: "at", start: 7.8, end: 8.05, sentenceIdx: 2 },
      { word: "Leo.", start: 8.05, end: 8.62, sentenceIdx: 2 },
    ],
  },

  // Page 4 (8.16s)
  // "Leo sat at his desk quietly. "Is Max mad at me?" he thought. Leo felt anxious about their friendship."
  4: {
    totalDuration: 8.16,
    sentenceBounds: [
      { start: 0.0, end: 2.4 },
      { start: 2.6, end: 5.0 },
      { start: 5.2, end: 8.16 },
    ],
    words: [
      { word: "Leo", start: 0.0, end: 0.35, sentenceIdx: 0 },
      { word: "sat", start: 0.35, end: 0.7, sentenceIdx: 0 },
      { word: "at", start: 0.7, end: 0.9, sentenceIdx: 0 },
      { word: "his", start: 0.9, end: 1.15, sentenceIdx: 0 },
      { word: "desk", start: 1.15, end: 1.6, sentenceIdx: 0 },
      { word: "quietly.", start: 1.6, end: 2.4, sentenceIdx: 0 },

      { word: '"Is', start: 2.6, end: 2.85, sentenceIdx: 1 },
      { word: "Max", start: 2.85, end: 3.2, sentenceIdx: 1 },
      { word: "mad", start: 3.2, end: 3.55, sentenceIdx: 1 },
      { word: "at", start: 3.55, end: 3.75, sentenceIdx: 1 },
      { word: 'me?"', start: 3.75, end: 4.15, sentenceIdx: 1 },
      { word: "he", start: 4.25, end: 4.45, sentenceIdx: 1 },
      { word: "thought.", start: 4.45, end: 5.0, sentenceIdx: 1 },

      { word: "Leo", start: 5.2, end: 5.55, sentenceIdx: 2 },
      { word: "felt", start: 5.55, end: 5.9, sentenceIdx: 2 },
      { word: "anxious", start: 5.9, end: 6.5, sentenceIdx: 2 },
      { word: "about", start: 6.5, end: 6.9, sentenceIdx: 2 },
      { word: "their", start: 6.9, end: 7.25, sentenceIdx: 2 },
      { word: "friendship.", start: 7.25, end: 8.16, sentenceIdx: 2 },
    ],
  },

  // Page 5 (7.46s)
  // "At lunch, Leo walked to Max. He asked softly, "Max, did you see my message yesterday?""
  5: {
    totalDuration: 7.46,
    sentenceBounds: [
      { start: 0.0, end: 2.6 },
      { start: 2.8, end: 7.46 },
    ],
    words: [
      { word: "At", start: 0.0, end: 0.25, sentenceIdx: 0 },
      { word: "lunch,", start: 0.25, end: 0.85, sentenceIdx: 0 },
      { word: "Leo", start: 1.0, end: 1.35, sentenceIdx: 0 },
      { word: "walked", start: 1.35, end: 1.85, sentenceIdx: 0 },
      { word: "to", start: 1.85, end: 2.1, sentenceIdx: 0 },
      { word: "Max.", start: 2.1, end: 2.6, sentenceIdx: 0 },

      { word: "He", start: 2.8, end: 3.05, sentenceIdx: 1 },
      { word: "asked", start: 3.05, end: 3.5, sentenceIdx: 1 },
      { word: "softly,", start: 3.5, end: 4.1, sentenceIdx: 1 },
      { word: '"Max,', start: 4.3, end: 4.8, sentenceIdx: 1 },
      { word: "did", start: 4.8, end: 5.1, sentenceIdx: 1 },
      { word: "you", start: 5.1, end: 5.3, sentenceIdx: 1 },
      { word: "see", start: 5.3, end: 5.65, sentenceIdx: 1 },
      { word: "my", start: 5.65, end: 5.9, sentenceIdx: 1 },
      { word: "message", start: 5.9, end: 6.45, sentenceIdx: 1 },
      { word: 'yesterday?"', start: 6.45, end: 7.46, sentenceIdx: 1 },
    ],
  },

  // Page 6 (8.98s)
  // "Max showed his phone. The screen was cracked and black! "I dropped it during soccer," said Max. Leo felt so relieved."
  6: {
    totalDuration: 8.98,
    sentenceBounds: [
      { start: 0.0, end: 1.7 },
      { start: 1.85, end: 4.2 },
      { start: 4.4, end: 6.9 },
      { start: 7.1, end: 8.98 },
    ],
    words: [
      { word: "Max", start: 0.0, end: 0.35, sentenceIdx: 0 },
      { word: "showed", start: 0.35, end: 0.8, sentenceIdx: 0 },
      { word: "his", start: 0.8, end: 1.05, sentenceIdx: 0 },
      { word: "phone.", start: 1.05, end: 1.7, sentenceIdx: 0 },

      { word: "The", start: 1.85, end: 2.1, sentenceIdx: 1 },
      { word: "screen", start: 2.1, end: 2.55, sentenceIdx: 1 },
      { word: "was", start: 2.55, end: 2.8, sentenceIdx: 1 },
      { word: "broken", start: 2.8, end: 3.35, sentenceIdx: 1 },
      { word: "and", start: 3.35, end: 3.55, sentenceIdx: 1 },
      { word: "black!", start: 3.55, end: 4.2, sentenceIdx: 1 },

      { word: '"I', start: 4.4, end: 4.6, sentenceIdx: 2 },
      { word: "dropped", start: 4.6, end: 5.1, sentenceIdx: 2 },
      { word: "it", start: 5.1, end: 5.25, sentenceIdx: 2 },
      { word: "during", start: 5.25, end: 5.7, sentenceIdx: 2 },
      { word: 'soccer,"', start: 5.7, end: 6.25, sentenceIdx: 2 },
      { word: "said", start: 6.35, end: 6.6, sentenceIdx: 2 },
      { word: "Max.", start: 6.6, end: 6.9, sentenceIdx: 2 },

      { word: "Leo", start: 7.1, end: 7.45, sentenceIdx: 3 },
      { word: "felt", start: 7.45, end: 7.8, sentenceIdx: 3 },
      { word: "so", start: 7.8, end: 8.1, sentenceIdx: 3 },
      { word: "relieved.", start: 8.1, end: 8.98, sentenceIdx: 3 },
    ],
  },

  // Page 7 (8.04s)
  // "Max smiled. "My dad can fix it on Saturday. Let us ride our bikes this weekend!" Leo smiled too."
  7: {
    totalDuration: 8.04,
    sentenceBounds: [
      { start: 0.0, end: 1.1 },
      { start: 1.3, end: 3.6 },
      { start: 3.8, end: 6.2 },
      { start: 6.4, end: 8.04 },
    ],
    words: [
      { word: "Max", start: 0.0, end: 0.4, sentenceIdx: 0 },
      { word: "smiled.", start: 0.4, end: 1.1, sentenceIdx: 0 },

      { word: '"My', start: 1.3, end: 1.55, sentenceIdx: 1 },
      { word: "dad", start: 1.55, end: 1.9, sentenceIdx: 1 },
      { word: "can", start: 1.9, end: 2.15, sentenceIdx: 1 },
      { word: "fix", start: 2.15, end: 2.5, sentenceIdx: 1 },
      { word: "it", start: 2.5, end: 2.65, sentenceIdx: 1 },
      { word: "on", start: 2.65, end: 2.85, sentenceIdx: 1 },
      { word: 'Saturday."', start: 2.85, end: 3.6, sentenceIdx: 1 },

      { word: '"Let', start: 3.8, end: 4.1, sentenceIdx: 2 },
      { word: "us", start: 4.1, end: 4.3, sentenceIdx: 2 },
      { word: "ride", start: 4.3, end: 4.65, sentenceIdx: 2 },
      { word: "our", start: 4.65, end: 4.9, sentenceIdx: 2 },
      { word: "bikes", start: 4.9, end: 5.3, sentenceIdx: 2 },
      { word: "this", start: 5.3, end: 5.55, sentenceIdx: 2 },
      { word: 'weekend!"', start: 5.55, end: 6.2, sentenceIdx: 2 },

      { word: "Leo", start: 6.4, end: 6.75, sentenceIdx: 3 },
      { word: "smiled", start: 6.75, end: 7.25, sentenceIdx: 3 },
      { word: "too.", start: 7.25, end: 8.04, sentenceIdx: 3 },
    ],
  },

  // Page 8 (6.79s)
  // "They walked home together and ate sweet ice cream. Leo felt so excited for the weekend bike ride."
  8: {
    totalDuration: 6.79,
    sentenceBounds: [
      { start: 0.0, end: 3.3 },
      { start: 3.5, end: 6.79 },
    ],
    words: [
      { word: "They", start: 0.0, end: 0.3, sentenceIdx: 0 },
      { word: "walked", start: 0.3, end: 0.75, sentenceIdx: 0 },
      { word: "home", start: 0.75, end: 1.1, sentenceIdx: 0 },
      { word: "together", start: 1.1, end: 1.65, sentenceIdx: 0 },
      { word: "and", start: 1.65, end: 1.9, sentenceIdx: 0 },
      { word: "ate", start: 1.9, end: 2.2, sentenceIdx: 0 },
      { word: "sweet", start: 2.2, end: 2.6, sentenceIdx: 0 },
      { word: "ice", start: 2.6, end: 2.85, sentenceIdx: 0 },
      { word: "cream.", start: 2.85, end: 3.3, sentenceIdx: 0 },

      { word: "Leo", start: 3.5, end: 3.85, sentenceIdx: 1 },
      { word: "felt", start: 3.85, end: 4.2, sentenceIdx: 1 },
      { word: "so", start: 4.2, end: 4.5, sentenceIdx: 1 },
      { word: "excited", start: 4.5, end: 5.15, sentenceIdx: 1 },
      { word: "for", start: 5.15, end: 5.4, sentenceIdx: 1 },
      { word: "the", start: 5.4, end: 5.6, sentenceIdx: 1 },
      { word: "weekend", start: 5.6, end: 6.05, sentenceIdx: 1 },
      { word: "bike", start: 6.05, end: 6.4, sentenceIdx: 1 },
      { word: "ride.", start: 6.4, end: 6.79, sentenceIdx: 1 },
    ],
  },
};
