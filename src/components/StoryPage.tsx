import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowRight, ArrowLeft, Languages, AlertCircle, BookOpen, Undo2 } from 'lucide-react';
import { StoryPageData, CoreEmotionId } from '../types/story';
import { CORE_EMOTIONS } from '../data/storyData';
import { STORY_TIMINGS } from '../data/storyTimings';
import { soundEngine } from '../utils/soundEffects';
import { pronunciationPlayer } from '../utils/pronunciation';

interface StoryPageProps {
  page: StoryPageData;
  totalPages: number;
  hasListened: boolean;
  quizReturnId: number | null;
  onReturnToQuiz: () => void;
  onPageSelect: (pageNumber: number) => void;
  onMarkListened: () => void;
  onNext: () => void;
  onPrev: () => void;
  onWordClick: (word: string) => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({
  page,
  totalPages,
  hasListened,
  quizReturnId,
  onReturnToQuiz,
  onPageSelect,
  onMarkListened,
  onNext,
  onPrev,
  onWordClick,
}) => {
  const [speed, setSpeed] = useState<'normal' | 'slow'>('normal');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number | null>(null);
  const [activeWordStr, setActiveWordStr] = useState<string | null>(null);
  const [showKorean, setShowKorean] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Clean and prepare audio on page change
  useEffect(() => {
    setIsPlaying(false);
    setActiveSentenceIdx(null);
    setActiveWordStr(null);
    setShowKorean(false);
    setImgError(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(`/audio/page_${page.pageNumber}.mp3`);
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
      setActiveSentenceIdx(null);
      setActiveWordStr(null);
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [page.pageNumber]);

  // Frame-accurate word and sentence highlight synchronization
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const timingData = STORY_TIMINGS[page.pageNumber];

    const checkTime = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused && timingData) {
        const currentTime = audio.currentTime;

        // 1. Identify active word precisely
        // CRITICAL: Ensure the very first word of the page is immediately highlighted on playback start
        let activeWordItem: typeof timingData.words[0] | undefined;
        const firstWord = timingData.words[0];

        // Slight negative / initial tolerance so from 0.00s up to firstWord.end, the first word is strictly active
        if (firstWord && currentTime <= firstWord.end) {
          activeWordItem = firstWord;
        } else {
          // Responsive lead time (~0.16s) to ensure highlight leads naturally without skipping
          const lead = 0.16;
          const targetTime = currentTime + lead;
          activeWordItem = timingData.words.find(
            (w) => targetTime >= w.start && targetTime < w.end
          );
        }

        // If near end of page, preserve the final word highlight until audio ends
        if (
          !activeWordItem &&
          currentTime > 0.5 &&
          timingData.words.length > 0 &&
          currentTime >= timingData.words[timingData.words.length - 1].start
        ) {
          activeWordItem = timingData.words[timingData.words.length - 1];
        }
        setActiveWordStr(activeWordItem ? activeWordItem.word : null);

        // 2. Identify active sentence (Sentence 0 immediately active when playing starts)
        const sentIdx = timingData.sentenceBounds.findIndex(
          (b, idx) => (idx === 0 && currentTime <= b.end) || (currentTime >= b.start - 0.20 && currentTime <= b.end)
        );
        setActiveSentenceIdx(sentIdx !== -1 ? sentIdx : (currentTime < (timingData.sentenceBounds[0]?.end || 1) ? 0 : null));
      }

      animationFrameRef.current = requestAnimationFrame(checkTime);
    };

    animationFrameRef.current = requestAnimationFrame(checkTime);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, page.pageNumber]);

  const handleReadToMe = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setActiveSentenceIdx(null);
      setActiveWordStr(null);
      return;
    }

    pronunciationPlayer.stop();
    soundEngine.playPop();
    onMarkListened();

    // Friendly, comfortable listening speed for 6th graders
    audio.playbackRate = speed === 'slow' ? 0.70 : 0.92;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn('Audio play failed:', err);
        setIsPlaying(false);
      });
  };

  const handleSpeedToggle = (newSpeed: 'normal' | 'slow') => {
    soundEngine.playPop();
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed === 'slow' ? 0.70 : 0.92;
    }
  };

  const handlePlaySentence = (sentenceIndex: number) => {
    const audio = audioRef.current;
    const timingData = STORY_TIMINGS[page.pageNumber];
    if (!audio || !timingData) return;

    pronunciationPlayer.stop();
    soundEngine.playPop();
    onMarkListened();

    const bound = timingData.sentenceBounds[sentenceIndex];
    if (bound) {
      audio.currentTime = bound.start;
      audio.playbackRate = speed === 'slow' ? 0.70 : 0.92;
      audio.play().then(() => {
        setIsPlaying(true);
        setActiveSentenceIdx(sentenceIndex);
      });
    }
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto w-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 space-y-2 sm:space-y-3">
      {/* Return to Question Mission Banner if reviewing from a quiz */}
      {quizReturnId !== null && (
        <div className="bg-amber-500 text-white p-2 rounded-2xl flex items-center justify-between shadow-md animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
            <span>📖</span>
            <span>이야기를 확인한 후 문제로 돌아갈 수 있어요</span>
          </div>
          <button
            onClick={() => {
              soundEngine.playPop();
              onReturnToQuiz();
            }}
            className="flex items-center gap-1 bg-white text-amber-900 px-2.5 py-1 rounded-xl font-black text-xs hover:bg-amber-50 transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            <Undo2 size={13} />
            <span>문제로 복귀</span>
          </button>
        </div>
      )}

      {/* Page Navigation Bar (1 to 8 Direct Jump Buttons) */}
      <div className="flex items-center justify-between bg-white/95 px-2.5 py-1 rounded-2xl border border-amber-200 shadow-2xs">
        <span className="text-[11px] sm:text-xs font-bold text-amber-900 px-1 shrink-0">
          페이지 이동:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
            const isCurrent = num === page.pageNumber;
            return (
              <button
                key={num}
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onPageSelect(num);
                }}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl font-bold text-xs transition-all flex items-center justify-center cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-600 text-white shadow-xs scale-105'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/60'
                }`}
                title={`Page ${num}으로 바로 이동`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Illustration & Story Content Container */}
      <div className="space-y-2 sm:space-y-2.5">
        {/* Top: Natural Proportional Illustration Card (Never cropped or sliced, preserving full art) */}
        <div className="relative w-full aspect-4/3 max-h-[36vh] sm:max-h-[42vh] rounded-2xl sm:rounded-3xl overflow-hidden bg-amber-100 shadow-sm border border-amber-200/90 group flex items-center justify-center">
          {!imgError ? (
            <img
              src={page.image}
              alt={page.imageAlt}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain sm:object-cover transition-transform duration-500 group-hover:scale-101"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 text-center">
              <BookOpen className="w-12 h-12 text-amber-600 mb-1" />
              <p className="text-sm font-bold text-amber-900">
                Page {page.pageNumber} Illustration
              </p>
            </div>
          )}

          {/* Clean minimal Page Badge */}
          <div className="absolute top-2.5 left-2.5 bg-slate-900/75 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs flex items-center gap-1.5">
            <span>Page {page.pageNumber}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-300">{totalPages}</span>
          </div>
        </div>

        {/* Bottom: Proportional Synchronized Story Text Box */}
        <div className="bg-white/95 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm border border-amber-200/80 space-y-2 sm:space-y-2.5">
          {/* Sentences with Live Audio Highlighting */}
          <div className="space-y-1 sm:space-y-1.5">
            {page.sentences.map((sentence, sIdx) => {
              const isSentenceActive = isPlaying && activeSentenceIdx === sIdx;
              const words = sentence.split(/\s+/).filter(Boolean);

              return (
                <div
                  key={sIdx}
                  className={`p-1.5 sm:p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    isSentenceActive
                      ? 'bg-amber-100/90 border border-amber-300 shadow-2xs'
                      : 'hover:bg-amber-50/50'
                  }`}
                  onClick={() => handlePlaySentence(sIdx)}
                  title="클릭하면 이 문장부터 들을 수 있어요"
                >
                  <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed select-none">
                    {words.map((word, wIdx) => {
                      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
                      const cleanActive = activeWordStr ? activeWordStr.toLowerCase().replace(/[^a-z]/g, '') : '';
                      const isCoreEmotion = (['worried', 'anxious', 'relieved', 'excited'] as CoreEmotionId[]).includes(
                        cleanWord as CoreEmotionId
                      );
                      const emotionInfo = isCoreEmotion ? CORE_EMOTIONS[cleanWord] : null;
                      const isWordSpeaking = isSentenceActive && cleanWord === cleanActive;

                      return (
                        <button
                          key={wIdx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (audioRef.current && isPlaying) {
                              audioRef.current.pause();
                              setIsPlaying(false);
                            }
                            soundEngine.playPop();
                            onWordClick(word);
                          }}
                          className={`inline-block px-1 py-0.5 mx-0.5 rounded-lg transition-all text-left font-semibold cursor-pointer ${
                            isWordSpeaking
                              ? 'bg-amber-400 text-slate-950 font-black scale-105 shadow-xs'
                              : isCoreEmotion
                              ? 'bg-amber-200/80 text-amber-950 border-b-2 border-amber-600 hover:bg-amber-300 font-bold'
                              : 'hover:bg-amber-100 text-slate-800'
                          }`}
                          title={
                            isCoreEmotion
                              ? `⭐ 핵심 감정 어휘: ${emotionInfo?.koreanMeaning}`
                              : '단어 뜻 보기 및 발음 듣기'
                          }
                        >
                          {word}
                          {isCoreEmotion && (
                            <span className="ml-0.5 text-xs inline-block align-top">
                              {emotionInfo?.stampIcon}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive Tip */}
          <div className="text-[11px] text-amber-800/90 flex items-center justify-between font-medium pt-1 border-t border-amber-100">
            <span className="flex items-center gap-1">
              <span>💡</span>
              <span>단어를 탭하면 우리말 뜻을 볼 수 있고, 문장을 탭하면 바로 들을 수 있어요!</span>
            </span>
          </div>

          {/* Korean Translation Peek */}
          {showKorean && (
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs sm:text-sm font-medium text-amber-950 animate-in fade-in duration-200">
              <span className="font-bold text-amber-800 block mb-1">
                우리말 해석:
              </span>
              <p className="leading-relaxed">{page.koreanTranslation}</p>
            </div>
          )}

          {/* Audio Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Play/Pause Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReadToMe}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer ${
                  isPlaying
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
                title="이야기 MP3 음성 듣기"
              >
                {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span>{isPlaying ? '일시 정지' : 'Read to me'}</span>
              </button>

              {/* Speed Controls (Normal / Slow) */}
              <div className="flex items-center p-1 bg-amber-100/80 rounded-xl border border-amber-200 text-xs font-bold">
                <button
                  onClick={() => handleSpeedToggle('normal')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    speed === 'normal'
                      ? 'bg-white text-amber-900 shadow-xs'
                      : 'text-amber-700 hover:text-amber-900'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => handleSpeedToggle('slow')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    speed === 'slow'
                      ? 'bg-white text-amber-900 shadow-xs'
                      : 'text-amber-700 hover:text-amber-900'
                  }`}
                >
                  <span>🐢</span>
                  <span>Slow</span>
                </button>
              </div>
            </div>

            {/* Korean Translation Toggle */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setShowKorean(!showKorean);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 transition-colors cursor-pointer"
            >
              <Languages size={14} />
              <span>{showKorean ? '해석 숨기기' : '해석 보기'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row */}
      <div className="mt-4 pt-3 flex items-center justify-between gap-3 border-t border-amber-200/60">
        {page.pageNumber > 1 ? (
          <button
            onClick={() => {
              soundEngine.playPop();
              onPrev();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 border border-slate-200 text-sm font-semibold transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>이전 페이지</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex flex-col items-end">
          <button
            onClick={() => {
              if (hasListened) {
                soundEngine.playPop();
                onNext();
              }
            }}
            disabled={!hasListened}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
              hasListened
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white cursor-pointer active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
            title={hasListened ? '다음 단계로 이동' : '[Read to me]를 먼저 들어보세요'}
          >
            <span>{page.hasQuestionAfter ? '감정 질문 풀기' : 'Next'}</span>
            <ArrowRight size={16} />
          </button>

          {!hasListened && (
            <span className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              <span>[Read to me]를 눌러 먼저 들어보세요!</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
