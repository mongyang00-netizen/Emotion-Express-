import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { CORE_EMOTIONS } from '../data/storyData';
import { CoreEmotionId, ReadingMode } from '../types/story';
import { soundEngine } from '../utils/soundEffects';

interface HeaderProps {
  currentPage: number; // 0 for cover, 1..8 for story, 9 for reflection, 10 for pass
  totalPages: number;
  stamps: CoreEmotionId[];
  onGoHome: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  readingMode?: ReadingMode;
  onEmotionClick?: (emotion: CoreEmotionId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  totalPages,
  stamps,
  onGoHome,
  soundEnabled,
  onToggleSound,
  readingMode = 'mission',
  onEmotionClick,
}) => {
  const isStoryPage = currentPage >= 1 && currentPage <= totalPages;
  const stampKeys: CoreEmotionId[] = ['worried', 'anxious', 'relieved', 'excited'];

  return (
    <header className="sticky top-0 z-30 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/80 px-4 py-2.5 transition-all">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 group text-left focus:outline-none"
          title="처음으로 돌아가기"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-base">🚂</span>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-800 group-hover:text-amber-700 transition-colors flex items-center gap-1">
              Emotion Express
            </span>
          </div>
        </button>

        {/* Center: Story Progress (When on story page) */}
        {isStoryPage && (
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <span className="text-xs font-bold text-amber-900 tracking-wide">
                Page {currentPage} / {totalPages}
              </span>
              {readingMode === 'free' && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-1.5 py-0.2 rounded-md ml-1.5 shadow-2xs">
                  자유 읽기
                </span>
              )}
            </div>
            <div className="w-20 sm:w-24 h-1.5 bg-amber-200/70 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Right Zone: Stamps Tracker & Audio Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Stamps Collected Tracker */}
          <div
            className="flex items-center gap-1 bg-amber-100/80 border border-amber-200 px-2 py-1 rounded-full text-xs"
            title={`모은 감정 스탬프: ${stamps.length} / 4개 (스탬프를 탭하면 뜻과 그림을 볼 수 있어요)`}
          >
            <span className="text-amber-900 font-bold hidden sm:inline">Stamps:</span>
            <div className="flex items-center gap-1">
              {stampKeys.map((key) => {
                const isCollected = stamps.includes(key);
                const info = CORE_EMOTIONS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      if (onEmotionClick) {
                        onEmotionClick(key);
                      }
                    }}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-300 cursor-pointer hover:scale-120 active:scale-95 ${
                      isCollected
                        ? 'bg-amber-500 text-white shadow-xs scale-105'
                        : 'bg-amber-200/60 text-amber-500 hover:bg-amber-200'
                    }`}
                    title={`${info.word} (${info.koreanMeaning}) - 탭해서 그림과 뜻 보기`}
                  >
                    {isCollected ? info.stampIcon : '○'}
                  </button>
                );
              })}
            </div>
            <span className="text-[11px] font-bold text-amber-800 ml-0.5">
              {stamps.length}/4
            </span>
          </div>

          {/* Sound Effect Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundEngine.playPop();
            }}
            className="p-1.5 rounded-lg text-amber-800 hover:bg-amber-200/60 transition-colors"
            title={soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Reset / Home button when inside story */}
          {currentPage > 0 && (
            <button
              onClick={onGoHome}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-200/60 hover:text-slate-800 transition-colors"
              title="표지로 이동"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
