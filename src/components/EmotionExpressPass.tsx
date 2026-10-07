import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { Award, RotateCcw, Home, Download, CheckCircle2, Loader2, Image as ImageIcon, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { UserPassData, CoreEmotionId } from '../types/story';
import { CORE_EMOTIONS, REFLECTION_SCENES } from '../data/storyData';
import { soundEngine } from '../utils/soundEffects';
import { generatePassCanvas } from '../utils/passCanvasGenerator';

interface EmotionExpressPassProps {
  passData: UserPassData;
  onReadAgain: () => void;
  onGoHome: () => void;
}

export const EmotionExpressPass: React.FC<EmotionExpressPassProps> = ({
  passData,
  onReadAgain,
  onGoHome,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const sceneImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ea580c', '#10b981', '#6366f1', '#ec4899'],
      });
    } catch {
      // ignore
    }
  }, []);

  const selectedScene = REFLECTION_SCENES.find((s) => s.id === passData.selectedSceneId) || REFLECTION_SCENES[0];
  const selectedEmotion = CORE_EMOTIONS[passData.selectedEmotionId] || CORE_EMOTIONS['excited'];
  const stampKeys: CoreEmotionId[] = ['worried', 'anxious', 'relieved', 'excited'];

  // Helper to generate the exact ticket canvas: 100% offline, zero CSS/remote font security errors
  const captureTicketCanvas = async (): Promise<HTMLCanvasElement> => {
    return await generatePassCanvas(passData, selectedScene, selectedEmotion, sceneImgRef.current);
  };

  // 1. High-fidelity PDF Download (Universal Mobile & Desktop Support)
  const handleDownloadPdf = async () => {
    if (isProcessing) return;
    soundEngine.playPop();
    setIsProcessing(true);

    try {
      const canvas = await captureTicketCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // High-resolution A4 Certificate
      const isLandscape = canvas.width > canvas.height;
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const pdfImageWidth = pageWidth - margin * 2;
      const pdfImageHeight = (canvas.height * pdfImageWidth) / canvas.width;

      const offsetY = Math.max(margin, (pageHeight - pdfImageHeight) / 2);

      pdf.addImage(imgData, 'JPEG', margin, offsetY, pdfImageWidth, Math.min(pdfImageHeight, pageHeight - margin * 2));

      // Clean ASCII-safe fallback filename with Korean support
      const safeName = passData.studentName.replace(/[/\\?%*:|"<>]/g, '').trim() || 'Student';
      const fileName = `Emotion_Express_Pass_${safeName}.pdf`;

      // Extract proper binary ArrayBuffer to guarantee complete, uncorrupted PDF stream
      const arrayBuffer = pdf.output('arraybuffer');
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

      // Direct file download using persistent Blob URL
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();

      // Keep blobUrl active for 60 seconds so async download managers complete without truncation
      setTimeout(() => {
        try {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(blobUrl);
        } catch {
          // ignore
        }
      }, 60000);

      soundEngine.playCorrect();
    } catch (err) {
      console.error('PDF Download failed:', err);
      try {
        const fallbackPdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        fallbackPdf.text('EMOTION EXPRESS PASS', 20, 30);
        fallbackPdf.text(`Explorer: ${passData.studentName}`, 20, 45);
        fallbackPdf.text(`Ticket No: ${passData.ticketNumber}`, 20, 55);
        fallbackPdf.text(`Emotion: ${selectedEmotion.word}`, 20, 65);
        fallbackPdf.save('Emotion_Express_Pass.pdf');
      } catch {
        window.print();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. High-res Image (PNG) Download for Mobile Devices
  const handleDownloadImage = async () => {
    if (isProcessing) return;
    soundEngine.playPop();
    setIsProcessing(true);

    try {
      const canvas = await captureTicketCanvas();
      const safeName = passData.studentName.replace(/[/\\?%*:|"<>]/g, '').trim() || 'Student';
      const fileName = `Emotion_Express_Pass_${safeName}.png`;

      canvas.toBlob((blob) => {
        if (!blob) return;

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          try {
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
            URL.revokeObjectURL(blobUrl);
          } catch {
            // ignore
          }
        }, 60000);

        soundEngine.playCorrect();
      }, 'image/png');
    } catch (err) {
      console.error('Image download failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-6 space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Banner */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
          <CheckCircle2 size={13} />
          <span>Pass Issued Successfully!</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          You finished the story!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          축하합니다! 4개의 감정을 모두 마스터하고 나만의 패스를 완성했어요.
        </p>
      </div>

      {/* The Printable & PDF-capturable Boarding Pass Card */}
      <div
        ref={ticketRef}
        id="emotion-express-pass-ticket"
        className="bg-gradient-to-br from-amber-50 via-white to-orange-50/70 rounded-3xl border-2 border-amber-300 shadow-xl overflow-hidden relative print:shadow-none print:border-black"
      >
        {/* Ticket Perforation Notch (Left & Right) */}
        <div className="absolute top-[28%] -left-3 w-6 h-6 rounded-full bg-amber-50/40 border-r-2 border-amber-300" />
        <div className="absolute top-[28%] -right-3 w-6 h-6 rounded-full bg-amber-50/40 border-l-2 border-amber-300" />

        {/* Top Header Section of Ticket */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🚂</span>
            <div>
              <span className="text-[10px] tracking-widest uppercase text-amber-200 font-bold block">
                Official Reading Certificate
              </span>
              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                EMOTION EXPRESS PASS
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-amber-200 block">
              Ticket No.
            </span>
            <span className="text-xs font-mono font-bold tracking-wider">
              {passData.ticketNumber}
            </span>
          </div>
        </div>

        {/* Story & Learner Details */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-dashed border-amber-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Story Title
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900 block">
                The Unread Message
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Learner / Explorer
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900">
                {passData.studentName}
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                {passData.date}
              </span>
            </div>
          </div>

          {/* 4 Official Verified Emotion Stamps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                <Award size={14} className="text-amber-600" />
                <span>4대 감정 스탬프 (Verified Emotion Stamps)</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                All 4 Unlocked!
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {stampKeys.map((key) => {
                const info = CORE_EMOTIONS[key];
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center p-2.5 rounded-2xl bg-white border border-amber-200 shadow-2xs text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl shadow-xs">
                      {info.stampIcon}
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 capitalize mt-1.5">
                      {info.word}
                    </span>
                    <span className="text-[9px] text-amber-800 font-medium">
                      {info.koreanMeaning.split(',')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Memorable Scene & Emotional Connection (Clean: No artificial quote) */}
          <div className="pt-2 border-t border-dashed border-amber-200 grid sm:grid-cols-5 gap-4 items-center">
            {/* Scene Thumbnail */}
            <div className="sm:col-span-2 aspect-4/3 rounded-2xl overflow-hidden bg-amber-100 border border-amber-200 relative shadow-2xs">
              <img
                ref={sceneImgRef}
                src={selectedScene.image}
                alt={selectedScene.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                Page {selectedScene.pageNumber}
              </div>
            </div>

            {/* Reflection Content */}
            <div className="sm:col-span-3 space-y-2.5 text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Memorable Scene
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900">
                  {selectedScene.koreanTitle}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedScene.title}
                </p>
              </div>

              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                  My Feeling:
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-2xs">
                  <span>{selectedEmotion.stampIcon}</span>
                  <span className="capitalize">{selectedEmotion.word}</span>
                  <span>({selectedEmotion.koreanMeaning.split(',')[0]})</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Mission Quiz Review Report (간결하고 깔끔한 미션 결과 분석 카드) */}
      {passData.quizAttempts && passData.quizAttempts.length > 0 && (
        <div className="w-full bg-white rounded-3xl border border-amber-200/90 p-4 sm:p-5 shadow-xs space-y-3 text-left print:hidden">
          <div className="flex items-center justify-between border-b border-amber-100/80 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">📝</span>
              <h4 className="text-sm font-black text-slate-900">
                미션 결과 요약
              </h4>
            </div>

            {/* Quick summary badge */}
            {(() => {
              const wrongCount = passData.quizAttempts.filter((a) => !a.firstTryCorrect).length;
              return wrongCount === 0 ? (
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={12} className="text-emerald-600" />
                  <span>모든 문제 원패스 정답! ⭐</span>
                </span>
              ) : (
                <span className="text-xs font-black text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle size={12} className="text-amber-600" />
                  <span>{wrongCount}문제 재도전 완료</span>
                </span>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {passData.quizAttempts.map((attempt) => {
              const emotionInfo = CORE_EMOTIONS[attempt.coreEmotionId];
              const wasPerfect = attempt.firstTryCorrect;

              return (
                <div
                  key={attempt.questionId}
                  className={`p-2.5 rounded-2xl border text-xs transition-all flex flex-col justify-between ${
                    wasPerfect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-[11px] text-slate-800 flex items-center gap-1 truncate">
                      <span>{emotionInfo?.stampIcon}</span>
                      <span>{attempt.stageTitle}</span>
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        wasPerfect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {wasPerfect ? '정답' : `${attempt.attemptsCount}회 시도`}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800 line-clamp-1 mb-1.5 text-[11px]">
                    {attempt.questionText}
                  </p>

                  <div className="bg-white/90 p-1.5 rounded-xl border border-slate-100 text-[11px] space-y-0.5">
                    <div className="flex items-center gap-1">
                      <span className="font-black text-emerald-700 shrink-0">정답:</span>
                      <span className="font-bold text-slate-900 truncate">{attempt.correctAnswer}</span>
                    </div>
                    {!wasPerfect && attempt.wrongAnswersChosen.length > 0 && (
                      <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                        <span className="font-bold text-rose-600 shrink-0">오답:</span>
                        <span className="line-through truncate">{attempt.wrongAnswersChosen.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 print:hidden">
        {/* Real PDF Download Button */}
        <button
          onClick={handleDownloadPdf}
          disabled={isProcessing}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          <span>{isProcessing ? '저장 중...' : 'PDF 저장'}</span>
        </button>

        {/* Mobile-friendly Image Save Option */}
        <button
          onClick={handleDownloadImage}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300 font-bold text-sm shadow-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          title="갤러리 및 기기에 이미지로 저장"
        >
          <ImageIcon size={16} />
          <span>이미지(PNG) 저장</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            onReadAgain();
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>Read again</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            onGoHome();
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Home size={16} />
          <span>Home</span>
        </button>
      </div>
    </div>
  );
};
