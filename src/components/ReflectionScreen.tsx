import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Award } from 'lucide-react';
import { CoreEmotionId, ReflectionScene } from '../types/story';
import { CORE_EMOTIONS, REFLECTION_SCENES } from '../data/storyData';
import { soundEngine } from '../utils/soundEffects';

interface ReflectionScreenProps {
  stamps: CoreEmotionId[];
  onCompletePass: (sceneId: string, emotionId: CoreEmotionId, studentName: string) => void;
}

export const ReflectionScreen: React.FC<ReflectionScreenProps> = ({
  stamps,
  onCompletePass,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>('scene-walk');
  const [selectedEmotionId, setSelectedEmotionId] = useState<CoreEmotionId>('excited');
  const [studentName, setStudentName] = useState<string>('레오의 친구');

  const coreEmotionsList: CoreEmotionId[] = ['worried', 'anxious', 'relieved', 'excited'];

  const handleSelectEmotion = (emotion: CoreEmotionId) => {
    soundEngine.playPop();
    setSelectedEmotionId(emotion);
  };

  const handleSelectScene = (sceneId: string) => {
    soundEngine.playPop();
    setSelectedSceneId(sceneId);
  };

  const isReady = Boolean(selectedSceneId && selectedEmotionId && studentName.trim());

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-6 space-y-6">
      {/* Celebration Header */}
      <div className="text-center space-y-2 bg-gradient-to-b from-amber-100/90 to-orange-50/60 p-6 rounded-3xl border border-amber-200/90 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-xs mb-1">
          <Sparkles size={13} />
          <span>Story Complete!</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          You finished the story!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          ‘The Unread Message’ 이야기를 모두 읽었어요. 4개의 감정 스탬프를 모두 모았습니다!
        </p>

        {/* 4 Collected Stamps Row */}
        <div className="pt-3 flex items-center justify-center gap-2 sm:gap-3">
          {coreEmotionsList.map((key) => {
            const info = CORE_EMOTIONS[key];
            return (
              <div
                key={key}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/90 border border-amber-200 shadow-xs w-18 sm:w-20"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl shadow-xs">
                  {info.stampIcon}
                </div>
                <span className="text-[11px] font-bold text-slate-800 capitalize">
                  {info.word}
                </span>
                <span className="text-[9px] text-amber-700 font-medium">
                  {info.koreanMeaning.split(',')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Select Memorable Scene */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              가장 기억에 남는 장면은 무엇인가요?
            </h3>
          </div>
          <span className="text-xs text-amber-700 font-semibold">1개 선택</span>
        </div>
        <p className="text-xs text-slate-500">
          이야기 중에서 마음에 가장 와닿았던 순간을 선택해 보세요.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {REFLECTION_SCENES.map((scene: ReflectionScene) => {
            const isSelected = selectedSceneId === scene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSelectScene(scene.id)}
                className={`text-left rounded-2xl overflow-hidden border-2 transition-all p-2 flex flex-col group active:scale-98 cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-300 shadow-sm'
                    : 'border-slate-200 bg-slate-50/60 hover:border-amber-200 hover:bg-amber-50/30'
                }`}
              >
                <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-amber-100 relative">
                  <img
                    src={scene.image}
                    alt={scene.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                      <Check size={14} />
                    </div>
                  )}
                </div>
                <div className="mt-2 px-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {scene.koreanTitle}
                  </p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">
                    {scene.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Choose Emotion felt in that scene */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              그 장면에서 느낀 감정은 무엇인가요?
            </h3>
          </div>
          <span className="text-xs text-amber-700 font-semibold">1개 선택</span>
        </div>
        <p className="text-xs text-slate-500">
          배운 4개의 핵심 감정 어휘 중에서 골라보세요.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {coreEmotionsList.map((emotionKey) => {
            const info = CORE_EMOTIONS[emotionKey];
            const isSelected = selectedEmotionId === emotionKey;

            return (
              <button
                key={emotionKey}
                type="button"
                onClick={() => handleSelectEmotion(emotionKey)}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-300 shadow-sm'
                    : 'border-slate-200 bg-slate-50/60 hover:border-amber-200 hover:bg-amber-50/30'
                }`}
              >
                <span className="text-2xl mb-1">{info.stampIcon}</span>
                <span className="text-xs font-bold text-slate-900 capitalize">
                  {info.word}
                </span>
                <span className="text-[10px] text-amber-800 font-medium mt-0.5">
                  {info.koreanMeaning.split(',')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Learner Name */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
            3
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            내 이름 또는 별명 입력
          </h3>
        </div>

        <div>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-semibold text-slate-800"
          />
        </div>
      </div>

      {/* Complete Button CTA */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (isReady) {
              soundEngine.playFanfare();
              onCompletePass(selectedSceneId, selectedEmotionId, studentName);
            }
          }}
          disabled={!isReady}
          className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
            isReady
              ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white cursor-pointer shadow-amber-500/25'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
          }`}
        >
          <Award size={20} />
          <span>Emotion Express Pass 완성하기</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
