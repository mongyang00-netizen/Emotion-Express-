import React from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { STORY_IMAGES, CORE_EMOTIONS } from '../data/storyData';
import { CoreEmotionId } from '../types/story';
import { soundEngine } from '../utils/soundEffects';

interface CoverScreenProps {
  stamps: CoreEmotionId[];
  onStartStory: () => void;
  onStartFreeReading: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({
  stamps,
  onStartStory,
  onStartFreeReading,
}) => {
  const stampKeys: CoreEmotionId[] = ['worried', 'anxious', 'relieved', 'excited'];

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-5 sm:py-8 flex flex-col items-center text-center space-y-6">
      {/* Title & Badge */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide">
          <span>🚂</span>
          <span>Emotion Express</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          The Unread Message
        </h1>
      </div>

      {/* Book Cover Illustration Card */}
      <div className="relative aspect-4/3 w-full max-w-md rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-amber-100 group">
        <img
          src={STORY_IMAGES.cover}
          alt="The Unread Message Book Cover"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
        />

        {/* 4 Stamps Slot Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-200 shadow-xs flex items-center gap-1">
          <span className="text-[10px] font-bold text-amber-900 mr-0.5">Stamps:</span>
          {stampKeys.map((key) => {
            const hasStamp = stamps.includes(key);
            const info = CORE_EMOTIONS[key];
            return (
              <span
                key={key}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${
                  hasStamp
                    ? 'bg-amber-500 text-white font-bold scale-110'
                    : 'bg-amber-100 text-amber-300 border border-amber-200'
                }`}
                title={info.word}
              >
                {hasStamp ? info.stampIcon : '○'}
              </span>
            );
          })}
        </div>
      </div>

      {/* 3 Step Journey Cards */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 text-left">
        <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center mb-1.5">
            1
          </div>
          <p className="text-xs font-bold text-slate-900">듣고 읽기</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
            내 속도에 맞춰 소리 듣기
          </p>
        </div>

        <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 font-bold text-xs flex items-center justify-center mb-1.5">
            2
          </div>
          <p className="text-xs font-bold text-slate-900">감정 이해하기</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
            4가지 감정 스탬프 모으기
          </p>
        </div>

        <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mb-1.5">
            3
          </div>
          <p className="text-xs font-bold text-slate-900">패스 완성하기</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
            기억에 남는 장면과 감정 기록
          </p>
        </div>
      </div>

      {/* 4 Core Emotions Preview - Balanced 2x2 on Mobile, 4-col on Desktop */}
      <div className="w-full bg-amber-50/80 p-3 sm:p-4 rounded-2xl border border-amber-200/90 text-left space-y-2">
        <span className="text-xs font-bold text-amber-950 block">4대 핵심 감정 어휘 (Core Emotions)</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stampKeys.map((k) => (
            <div
              key={k}
              className="bg-white p-2.5 rounded-xl border border-amber-200/80 flex items-center gap-2 shadow-2xs"
            >
              <span className="text-xl shrink-0">{CORE_EMOTIONS[k].stampIcon}</span>
              <div className="leading-tight">
                <span className="text-xs font-bold text-slate-800 capitalize block">
                  {CORE_EMOTIONS[k].word}
                </span>
                <span className="text-[10px] text-amber-700 font-medium">
                  {CORE_EMOTIONS[k].koreanMeaning.split(',')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Reading Options in Intuitive, Easy English */}
      <div className="w-full space-y-3 pt-1">
        {/* 1. Main Recommended Mode: Read & Collect Stamps */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onStartStory();
          }}
          className="w-full py-4 px-5 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-500/25 flex items-center justify-between transition-all active:scale-98 cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
              🚂
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl">Read &amp; Collect Stamps</span>
              <span className="text-[11px] bg-amber-400 text-amber-950 font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                Recommended
              </span>
            </div>
          </div>
          <ArrowRight size={22} className="shrink-0 text-amber-200 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* 2. Free Reading Mode: Read Only (Without Quizzes) */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onStartFreeReading();
          }}
          className="w-full py-3.5 px-5 rounded-3xl bg-white hover:bg-amber-50/80 text-slate-800 border-2 border-amber-300 shadow-xs flex items-center justify-between transition-all active:scale-98 cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-900">Read Only</span>
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
