/**
 * Emotion Express - Interactive English Storybook
 * Features:
 * - "The Unread Message" 8-page story with 8 distinct, consistent illustrations
 * - Consistent, friendly American English female voice MP3s across all 8 pages
 * - Frame-accurate word and sentence highlighting in both Normal & Slow modes
 * - 1~8 direct page jump navigation & return-to-question review feature
 * - Simplified, intuitive comprehension missions (2 literal + 2 contextual/inferential)
 * - Tap-to-pronounce dictionary with instant audio for words & example sentences
 * - High-fidelity PDF & PNG download with zero distortion on mobile and desktop
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { CoverScreen } from './components/CoverScreen';
import { StoryPage } from './components/StoryPage';
import { WordModal } from './components/WordModal';
import { EmotionQuizModal } from './components/EmotionQuizModal';
import { ReflectionScreen } from './components/ReflectionScreen';
import { EmotionExpressPass } from './components/EmotionExpressPass';
import { STORY_PAGES, EMOTION_QUESTIONS, CORE_EMOTIONS } from './data/storyData';
import { CoreEmotionId, ReadingMode, UserPassData, QuizAttempt } from './types/story';
import { soundEngine } from './utils/soundEffects';
import { pronunciationPlayer } from './utils/pronunciation';

export default function App() {
  // Page Navigation State
  // 0: Cover, 1..8: Story Pages, 9: Reflection, 10: Express Pass
  const [currentPage, setCurrentPage] = useState<number>(0);
  const totalPages = STORY_PAGES.length;

  // Reading Mode: 'mission' (Quiz & Stamps) | 'free' (Continuous story reading without quizzes)
  const [readingMode, setReadingMode] = useState<ReadingMode>('mission');
  const [freeReadingFinished, setFreeReadingFinished] = useState<boolean>(false);

  // Reading status & Audio controls
  const [listenedPages, setListenedPages] = useState<Record<number, boolean>>({});
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Stamps collected
  const [stamps, setStamps] = useState<CoreEmotionId[]>([]);

  // Quiz Attempts tracking (Record results and any wrong answer choices)
  const [quizAttempts, setQuizAttempts] = useState<Record<number, QuizAttempt>>({});

  // Active Interactive Modals
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);

  // Returning to quiz mission from story review
  const [quizReturnId, setQuizReturnId] = useState<number | null>(null);

  // Incomplete missions modal state (when user reaches end without completing all 4 quizzes)
  const [showIncompleteNotice, setShowIncompleteNotice] = useState<boolean>(false);

  // Completed Pass Data
  const [passData, setPassData] = useState<UserPassData | null>(null);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundEngine.enabled = nextVal;
  };

  // Start with Stamps & Quiz Missions (Recommended)
  const handleStartStory = () => {
    pronunciationPlayer.stop();
    setReadingMode('mission');
    setStamps([]); // Clean fresh start
    setQuizAttempts({});
    setListenedPages({});
    setPassData(null);
    setActiveQuizId(null);
    setQuizReturnId(null);
    setFreeReadingFinished(false);
    setCurrentPage(1);
  };

  // Start in Free Reading Mode (Continuous 1~8 pages, no quiz interruptions)
  const handleStartFreeReading = () => {
    pronunciationPlayer.stop();
    setReadingMode('free');
    setStamps([]);
    setQuizAttempts({});
    setListenedPages({});
    setPassData(null);
    setActiveQuizId(null);
    setQuizReturnId(null);
    setFreeReadingFinished(false);
    setCurrentPage(1);
  };

  // Reset all state when clicking "Go Home" / 처음으로
  const handleGoHome = () => {
    pronunciationPlayer.stop();
    setStamps([]); // Reset stamps so quizzes appear again fresh!
    setQuizAttempts({});
    setListenedPages({});
    setPassData(null);
    setActiveQuizId(null);
    setQuizReturnId(null);
    setSelectedWord(null);
    setFreeReadingFinished(false);
    setCurrentPage(0);
  };

  // Reset all state when clicking "Read Again" / 다시 읽기
  const handleReadAgain = () => {
    pronunciationPlayer.stop();
    setStamps([]); // Reset stamps so quizzes appear again fresh!
    setQuizAttempts({});
    setListenedPages({});
    setPassData(null);
    setActiveQuizId(null);
    setQuizReturnId(null);
    setSelectedWord(null);
    setFreeReadingFinished(false);
    setCurrentPage(1);
  };

  const handleMarkListened = (pageNumber: number) => {
    setListenedPages((prev) => ({
      ...prev,
      [pageNumber]: true,
    }));
  };

  const handleNextPage = () => {
    pronunciationPlayer.stop();
    const currentPageData = STORY_PAGES[currentPage - 1];

    // In Mission Mode: Check if this page has a question mission that hasn't been completed yet
    if (readingMode === 'mission' && currentPageData && currentPageData.hasQuestionAfter && currentPageData.questionId) {
      const q = EMOTION_QUESTIONS[currentPageData.questionId];
      if (q && !stamps.includes(q.coreEmotionId)) {
        setActiveQuizId(currentPageData.questionId);
        return;
      }
    }

    // Proceed to next page or completion
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      if (readingMode === 'mission') {
        // STRICT REQUIREMENT: Explorer must have truly solved all 4 questions (collected all 4 stamps)
        const allFourStamps: CoreEmotionId[] = ['worried', 'anxious', 'relieved', 'excited'];
        const missingStamp = allFourStamps.find((s) => !stamps.includes(s));

        if (missingStamp) {
          // Show friendly guidance modal without forcing jump
          setShowIncompleteNotice(true);
          return;
        }

        setCurrentPage(9); // Reflection & Pass creation
      } else {
        // Free reading mode completed page 8!
        setFreeReadingFinished(true);
      }
    }
  };

  const handlePrevPage = () => {
    pronunciationPlayer.stop();
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageSelect = (pageNumber: number) => {
    pronunciationPlayer.stop();
    setCurrentPage(pageNumber);
  };

  const handleReviewStory = (pageNumber: number) => {
    pronunciationPlayer.stop();
    setQuizReturnId(activeQuizId);
    setActiveQuizId(null);
    setCurrentPage(pageNumber);
  };

  const handleReturnToQuiz = () => {
    pronunciationPlayer.stop();
    if (quizReturnId !== null) {
      setActiveQuizId(quizReturnId);
      setQuizReturnId(null);
    }
  };

  const handleQuizAnswerCorrect = (
    emotionId: CoreEmotionId,
    attemptData: {
      questionId: number;
      firstTryCorrect: boolean;
      attemptsCount: number;
      wrongAnswersChosen: string[];
      correctAnswer: string;
    }
  ) => {
    if (!stamps.includes(emotionId)) {
      setStamps((prev) => [...prev, emotionId]);
    }
    const q = EMOTION_QUESTIONS[attemptData.questionId];
    if (q) {
      setQuizAttempts((prev) => ({
        ...prev,
        [attemptData.questionId]: {
          questionId: attemptData.questionId,
          stageTitle: q.stageTitle,
          coreEmotionId: emotionId,
          questionText: q.questionText,
          questionKorean: q.questionKorean,
          firstTryCorrect: attemptData.firstTryCorrect,
          attemptsCount: attemptData.attemptsCount,
          wrongAnswersChosen: attemptData.wrongAnswersChosen,
          correctAnswer: attemptData.correctAnswer,
        },
      }));
    }
  };

  const handleQuizContinue = () => {
    setActiveQuizId(null);
    setQuizReturnId(null);

    // Check if there are any remaining questions before page 9
    const allFourStamps: CoreEmotionId[] = ['worried', 'anxious', 'relieved', 'excited'];
    const remainingMissing = allFourStamps.find((s) => !stamps.includes(s));

    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      if (remainingMissing) {
        setShowIncompleteNotice(true);
        return;
      }
      setCurrentPage(9);
    }
  };

  const handleCompletePass = (
    sceneId: string,
    emotionId: CoreEmotionId,
    studentName: string
  ) => {
    const today = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const randomTicketSuffix = Math.floor(1000 + Math.random() * 9000);

    setPassData({
      studentName: studentName || '레오의 친구',
      date: today,
      ticketNumber: `EXP-2026-6TH-${randomTicketSuffix}`,
      stampsCollected: stamps,
      selectedSceneId: sceneId,
      selectedEmotionId: emotionId,
      quizAttempts: Object.values(quizAttempts),
    });

    setCurrentPage(10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-amber-100/30 to-orange-50/50 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Application Header */}
      <Header
        currentPage={currentPage}
        totalPages={totalPages}
        stamps={stamps}
        onGoHome={handleGoHome}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        readingMode={readingMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {/* Screen 1: Cover Screen */}
        {currentPage === 0 && (
          <CoverScreen
            stamps={stamps}
            onStartStory={handleStartStory}
            onStartFreeReading={handleStartFreeReading}
          />
        )}

        {/* Screen 2: 8 Story Pages */}
        {currentPage >= 1 && currentPage <= totalPages && (
          <StoryPage
            page={STORY_PAGES[currentPage - 1]}
            totalPages={totalPages}
            hasListened={Boolean(listenedPages[currentPage])}
            quizReturnId={quizReturnId}
            readingMode={readingMode}
            onReturnToQuiz={handleReturnToQuiz}
            onPageSelect={handlePageSelect}
            onMarkListened={() => handleMarkListened(currentPage)}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            onWordClick={(word) => setSelectedWord(word)}
          />
        )}

        {/* Screen 3: Post-Reading Reflection */}
        {currentPage === 9 && (
          <ReflectionScreen
            stamps={stamps}
            onCompletePass={handleCompletePass}
          />
        )}

        {/* Screen 4: Emotion Express Pass Completed */}
        {currentPage === 10 && passData && (
          <EmotionExpressPass
            passData={passData}
            onReadAgain={handleReadAgain}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      {/* Free Reading Mode Completed Modal (Page 8 Finish) */}
      {freeReadingFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-2 border-amber-300 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 text-3xl mx-auto flex items-center justify-center shadow-xs">
              🎉
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">
                You finished the story!
              </h3>
              <p
                className="text-xs text-slate-600 leading-relaxed font-medium"
                style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              >
                &ldquo;The Unread Message&rdquo; 8페이지를 모두 읽었어요! 이번에는 퀴즈를 풀고 4개의 감정 스탬프를 모아볼까요?
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setFreeReadingFinished(false);
                  handleStartStory();
                }}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-sm active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🚂 이번에는 스탬프 모아보기</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setFreeReadingFinished(false);
                  handleStartFreeReading();
                }}
                className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 active:scale-98 transition-all cursor-pointer"
              >
                Read again
              </button>
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setFreeReadingFinished(false);
                  handleGoHome();
                }}
                className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incomplete Missions Guidance Modal */}
      {showIncompleteNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-2 border-amber-300 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 text-3xl mx-auto flex items-center justify-center shadow-xs">
              🚂
            </div>
            <div className="space-y-1.5">
              <h3
                className="text-lg sm:text-xl font-black text-slate-900 leading-snug"
                style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              >
                아직 풀지 않은 문제가 있어요!
              </h3>
              <p
                className="text-xs text-slate-600 leading-relaxed font-medium"
                style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              >
                Emotion Express Pass를 발급받으려면 4개의 감정 미션을 모두 완료해야 해요. (현재 모은 스탬프: {stamps.length} / 4개)
              </p>
            </div>

            {/* Missing Stamps Badge Icons */}
            <div className="flex items-center justify-center gap-2 py-1">
              {(['worried', 'anxious', 'relieved', 'excited'] as CoreEmotionId[]).map((key) => {
                const isCollected = stamps.includes(key);
                const info = CORE_EMOTIONS[key];
                return (
                  <div
                    key={key}
                    className={`flex flex-col items-center p-1.5 rounded-xl border text-center transition-all ${
                      isCollected
                        ? 'bg-amber-100/80 border-amber-300 text-amber-900 font-bold'
                        : 'bg-slate-100/80 border-dashed border-slate-300 text-slate-400'
                    }`}
                  >
                    <span className="text-base">{isCollected ? info.stampIcon : '○'}</span>
                    <span className="text-[10px] capitalize mt-0.5">{info.word}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setShowIncompleteNotice(false);
                  handleReadAgain();
                }}
                className="w-full py-3 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-sm active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>📖 이야기 처음부터 다시 읽기</span>
              </button>

              {(() => {
                const allFourStamps: CoreEmotionId[] = ['worried', 'anxious', 'relieved', 'excited'];
                const firstMissing = allFourStamps.find((s) => !stamps.includes(s));
                const missingQ = firstMissing ? Object.values(EMOTION_QUESTIONS).find((q) => q.coreEmotionId === firstMissing) : null;
                if (!missingQ) return null;

                return (
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      setShowIncompleteNotice(false);
                      setCurrentPage(missingQ.pageAfter);
                      setActiveQuizId(missingQ.id);
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 active:scale-98 transition-all cursor-pointer"
                  >
                    미완료 문제 풀러 가기 (Page {missingQ.pageAfter})
                  </button>
                );
              })()}

              <button
                onClick={() => {
                  soundEngine.playPop();
                  setShowIncompleteNotice(false);
                }}
                className="w-full py-2 px-4 rounded-2xl font-bold text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Word Translation & Pronunciation Modal */}
      {selectedWord && (
        <WordModal
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          stampsCollected={stamps}
        />
      )}

      {/* Emotion Quiz Modal (Appears in Mission Mode after Pages 2, 4, 6, 8) */}
      {activeQuizId !== null && EMOTION_QUESTIONS[activeQuizId] && (
        <EmotionQuizModal
          question={EMOTION_QUESTIONS[activeQuizId]}
          onAnswerCorrect={handleQuizAnswerCorrect}
          onContinue={handleQuizContinue}
          onReviewStory={handleReviewStory}
        />
      )}
    </div>
  );
}

