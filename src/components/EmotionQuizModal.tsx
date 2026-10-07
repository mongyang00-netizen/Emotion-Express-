import React, { useState } from 'react';
import { Sparkles, CheckCircle2, HelpCircle, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { QuestionData, CoreEmotionId } from '../types/story';
import { CORE_EMOTIONS } from '../data/storyData';
import { soundEngine } from '../utils/soundEffects';

interface EmotionQuizModalProps {
  question: QuestionData;
  onAnswerCorrect: (
    emotionId: CoreEmotionId,
    attemptData: {
      questionId: number;
      firstTryCorrect: boolean;
      attemptsCount: number;
      wrongAnswersChosen: string[];
      correctAnswer: string;
    }
  ) => void;
  onContinue: () => void;
  onReviewStory: (pageNumber: number) => void;
}

export const EmotionQuizModal: React.FC<EmotionQuizModalProps> = ({
  question,
  onAnswerCorrect,
  onContinue,
  onReviewStory,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  const emotionInfo = CORE_EMOTIONS[question.coreEmotionId];
  const correctOption = question.options.find((o) => o.isCorrect);

  const handleSelectOption = (index: number) => {
    if (isCorrect) return;

    setSelectedIndex(index);
    const selectedOption = question.options[index];
    const newCount = attemptsCount + 1;
    setAttemptsCount(newCount);

    if (selectedOption.isCorrect) {
      setIsCorrect(true);
      setIsAnswered(true);
      setShowHint(false);
      soundEngine.playStampEarned();
      onAnswerCorrect(question.coreEmotionId, {
        questionId: question.id,
        firstTryCorrect: newCount === 1,
        attemptsCount: newCount,
        wrongAnswersChosen: wrongAnswers,
        correctAnswer: selectedOption.text,
      });
    } else {
      if (!wrongAnswers.includes(selectedOption.text)) {
        setWrongAnswers((prev) => [...prev, selectedOption.text]);
      }
      setIsCorrect(false);
      setIsAnswered(true);
      setShowHint(true);
      soundEngine.playWrong();
    }
  };

  const handleRetry = () => {
    soundEngine.playPop();
    setSelectedIndex(null);
    setIsAnswered(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Quiz Header Bar (Clean: No pedagogical classification labels) */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                {question.stageTitle}
              </h3>
            </div>
          </div>

          {/* Review story button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onReviewStory(question.pageAfter);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer border border-white/30"
            title="이야기 페이지를 다시 확인하고 문제로 돌아옵니다"
          >
            <BookOpen size={14} />
            <span>이야기 다시 확인</span>
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Question Prompt */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {question.questionText}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-amber-900 mt-1.5">
              {question.questionKorean}
            </p>
          </div>

          {/* Short, Intuitive Options List */}
          <div className="space-y-2.5">
            {question.options.map((option, idx) => {
              const isCurrent = selectedIndex === idx;
              let btnStyle = 'bg-white hover:bg-amber-50/80 border-slate-200 hover:border-amber-300 text-slate-800';

              if (isCurrent) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 text-emerald-950';
                } else {
                  btnStyle = 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 text-rose-950';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isCorrect}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start gap-3 active:scale-98 cursor-pointer ${btnStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isCurrent && option.isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isCurrent && !option.isCorrect
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-bold text-slate-900">
                      {option.text}
                    </p>
                    {option.korean ? (
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {option.korean}
                      </p>
                    ) : null}
                  </div>
                  {isCurrent && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Correct Feedback & Stamp Earned */}
          {isCorrect && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-center space-y-3 animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-3xl shadow-lg shadow-amber-400/40 animate-pulse">
                {emotionInfo.stampIcon}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
                  Stamp Unlocked!
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">
                  &lsquo;{emotionInfo.word} ({emotionInfo.koreanMeaning.split(',')[0]})&rsquo; 스탬프 획득!
                </h4>
              </div>
              <p
                className="text-xs sm:text-sm text-slate-700 font-medium bg-white/80 p-3 rounded-xl border border-amber-200 leading-relaxed"
                style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              >
                {question.explanation}
              </p>
            </div>
          )}

          {/* Incorrect Feedback & Hint */}
          {isAnswered && !isCorrect && showHint && (
            <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 space-y-2 animate-in shake duration-200">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-sm">
                <HelpCircle size={16} />
                <span>다시 한번 확인해 볼까요?</span>
              </div>
              <p
                className="text-xs text-slate-700 font-medium leading-relaxed"
                style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              >
                {question.hint}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleRetry}
                  className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 underline underline-offset-2 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>다른 보기 선택하기</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    onReviewStory(question.pageAfter);
                  }}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 underline underline-offset-2 cursor-pointer"
                >
                  <BookOpen size={12} />
                  <span>이야기 본문 확인하기</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            {!isCorrect ? '정답을 선택하면 스탬프를 받아요!' : '스탬프를 획득했어요!'}
          </div>

          <button
            onClick={() => {
              if (isCorrect) {
                soundEngine.playPop();
                onContinue();
              }
            }}
            disabled={!isCorrect}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
              isCorrect
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white active:scale-95 cursor-pointer shadow-amber-500/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
