export type CoreEmotionId = 'worried' | 'anxious' | 'relieved' | 'excited';
export type ReadingMode = 'mission' | 'free';

export interface CoreEmotionInfo {
  id: CoreEmotionId;
  word: string;
  koreanMeaning: string;
  pronunciationGuide: string;
  explanation: string;
  exampleSentence: string;
  exampleKorean: string;
  color: string;
  badgeBg: string;
  stampIcon: string;
  stampColor: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
}

export interface StoryPageData {
  pageNumber: number;
  text: string;
  sentences: string[];
  koreanTranslation: string;
  image: string;
  imageAlt: string;
  coreEmotionId?: CoreEmotionId;
  hasQuestionAfter: boolean;
  questionId?: number;
}

export interface QuestionData {
  id: number;
  pageAfter: number; // Page after which this question appears (2, 4, 6, 8)
  stageTitle: string; // 문자적 이해, 맥락적 이해, 추론적 이해, 감정 공감
  coreEmotionId: CoreEmotionId;
  questionText: string;
  questionKorean: string;
  options: {
    text: string;
    korean: string;
    isCorrect: boolean;
    emotionId?: CoreEmotionId;
  }[];
  hint: string;
  explanation: string;
}

export interface ReflectionScene {
  id: string;
  title: string;
  koreanTitle: string;
  description: string;
  image: string;
  pageNumber: number;
}

export interface QuizAttempt {
  questionId: number;
  stageTitle: string;
  coreEmotionId: CoreEmotionId;
  questionText: string;
  questionKorean: string;
  firstTryCorrect: boolean;
  attemptsCount: number;
  wrongAnswersChosen: string[];
  correctAnswer: string;
}

export interface UserPassData {
  studentName: string;
  date: string;
  ticketNumber: string;
  stampsCollected: CoreEmotionId[];
  selectedSceneId: string;
  selectedEmotionId: CoreEmotionId;
  quizAttempts?: QuizAttempt[];
}
