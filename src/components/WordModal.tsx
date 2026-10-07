import React, { useEffect } from 'react';
import { Volume2, X, Star } from 'lucide-react';
import { CORE_EMOTIONS, WORD_DICTIONARY } from '../data/storyData';
import { CoreEmotionId } from '../types/story';
import { pronunciationPlayer } from '../utils/pronunciation';
import { soundEngine } from '../utils/soundEffects';

interface WordModalProps {
  word: string | null;
  onClose: () => void;
  stampsCollected: CoreEmotionId[];
}

export const WordModal: React.FC<WordModalProps> = ({
  word,
  onClose,
  stampsCollected,
}) => {
  // Stop any pronunciation audio when closing or unmounting
  useEffect(() => {
    return () => {
      pronunciationPlayer.stop();
    };
  }, []);

  if (!word) return null;

  // Clean the word for dictionary lookup
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  const coreEmotion = (['worried', 'anxious', 'relieved', 'excited'] as CoreEmotionId[]).includes(
    cleanWord as CoreEmotionId
  )
    ? CORE_EMOTIONS[cleanWord]
    : null;

  const dictEntry = WORD_DICTIONARY[cleanWord];
  const meaning = coreEmotion ? coreEmotion.koreanMeaning : dictEntry?.meaning || '단어 뜻을 확인해 보세요';
  const pos = dictEntry?.pos || (coreEmotion ? '형용사' : '');

  const handlePronounce = () => {
    soundEngine.playPop();
    pronunciationPlayer.playWord(cleanWord, 'normal');
  };

  const handlePronounceSlow = () => {
    soundEngine.playPop();
    pronunciationPlayer.playWord(cleanWord, 'slow');
  };

  const handlePronounceExample = () => {
    if (!coreEmotion) return;
    soundEngine.playPop();
    pronunciationPlayer.playExample(coreEmotion.id);
  };

  const handleClose = () => {
    soundEngine.playPop();
    pronunciationPlayer.stop();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden transform transition-transform animate-in slide-in-from-bottom duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <div className={`p-5 pb-4 border-b ${coreEmotion ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              {coreEmotion && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white mb-2 shadow-xs">
                  <Star size={12} fill="currentColor" />
                  <span>핵심 감정 어휘 (Core Emotion)</span>
                </div>
              )}
              <div className="flex items-baseline gap-2.5">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
                  {cleanWord}
                </h3>
                {pos && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                    {pos}
                  </span>
                )}
              </div>
              <p className="text-base font-semibold text-amber-900 mt-1">
                {meaning}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Pronunciation Buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handlePronounce}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-transform active:scale-95 shadow-xs cursor-pointer"
            >
              <Volume2 size={14} />
              <span>발음 듣기</span>
            </button>
            <button
              onClick={handlePronounceSlow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-transform active:scale-95 border border-amber-300 cursor-pointer"
            >
              <span>🐢 천천히 듣기</span>
            </button>
            {coreEmotion && (
              <span className="text-xs text-amber-800 font-medium ml-1">
                {coreEmotion.pronunciationGuide}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {coreEmotion ? (
            <>
              {/* Emotion Illustrative Picture Card (예문 및 감정 이해를 돕는 그림) */}
              {coreEmotion.image && (
                <div className="relative w-full aspect-16/9 rounded-2xl overflow-hidden bg-amber-100 border-2 border-amber-300 shadow-sm group">
                  <img
                    src={coreEmotion.image}
                    alt={coreEmotion.imageAlt || `${coreEmotion.word} illustration`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <span className="text-sm">{coreEmotion.stampIcon}</span>
                    <span>감정 이해 힌트 그림</span>
                  </div>
                </div>
              )}

              {/* Emotion Deep Dive Card */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{coreEmotion.stampIcon}</span>
                  <span className="text-sm font-bold text-amber-950">
                    언제 이 감정을 느끼나요?
                  </span>
                </div>
                <p
                  className="text-xs text-slate-700 leading-relaxed font-medium"
                  style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
                >
                  {coreEmotion.explanation}
                </p>
              </div>

              {/* Example Sentence Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    예문 (Example Sentence)
                  </span>
                  <button
                    onClick={handlePronounceExample}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 cursor-pointer"
                  >
                    <Volume2 size={13} />
                    <span>예문 듣기</span>
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  &ldquo;{coreEmotion.exampleSentence}&rdquo;
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {coreEmotion.exampleKorean}
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60">
                <p className="text-xs font-bold text-amber-900 mb-1">
                  동화책 읽기 팁
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  이야기 문맥 속에서 단어의 의미를 파악해 보세요. 문장을 소리 내어 함께 읽으면 영어 실력이 쑥쑥 자라납니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
