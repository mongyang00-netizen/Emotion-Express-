import { UserPassData, CoreEmotionInfo, ReflectionScene, CoreEmotionId } from '../types/story';
import { CORE_EMOTIONS } from '../data/storyData';

/**
 * Standalone, pure SVG vector definitions for emojis and icons.
 * This completely avoids iOS Safari's WebKit limitation where system emoji fonts
 * fail to rasterize to Canvas 2D context.
 */
const EMOJI_SVGS: Record<string, string> = {
  train: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <rect x="8" y="24" width="48" height="26" rx="6" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
    <path d="M8 36 h48 v14 H8 Z" fill="#f59e0b"/>
    <path d="M48 24 h8 c2 0 4 2 4 4 v18 c0 4 -3 8 -8 8 h-4 Z" fill="#ea580c"/>
    <rect x="42" y="12" width="8" height="12" rx="2" fill="#78350f"/>
    <ellipse cx="46" cy="12" rx="6" ry="2.5" fill="#f59e0b"/>
    <circle cx="34" cy="8" r="4" fill="#ffffff" opacity="0.9"/>
    <circle cx="26" cy="6" r="3" fill="#ffffff" opacity="0.7"/>
    <rect x="14" y="27" width="10" height="9" rx="2" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5"/>
    <rect x="28" y="27" width="10" height="9" rx="2" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5"/>
    <circle cx="58" cy="38" r="3.5" fill="#fef08a" stroke="#d97706" stroke-width="1.5"/>
    <circle cx="18" cy="50" r="7" fill="#334155" stroke="#0f172a" stroke-width="2"/>
    <circle cx="18" cy="50" r="3" fill="#94a3b8"/>
    <circle cx="34" cy="50" r="7" fill="#334155" stroke="#0f172a" stroke-width="2"/>
    <circle cx="34" cy="50" r="3" fill="#94a3b8"/>
    <circle cx="50" cy="50" r="7" fill="#334155" stroke="#0f172a" stroke-width="2"/>
    <circle cx="50" cy="50" r="3" fill="#94a3b8"/>
    <rect x="18" y="48" width="32" height="3.5" rx="1.5" fill="#e2e8f0" stroke="#475569" stroke-width="1"/>
  </svg>`,

  worried: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <circle cx="32" cy="32" r="28" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/>
    <path d="M16 20 Q 22 17 26 21" fill="none" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
    <path d="M48 20 Q 42 17 38 21" fill="none" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="22" cy="27" rx="3.5" ry="4.5" fill="#292524"/>
    <circle cx="21" cy="25.5" r="1.3" fill="#ffffff"/>
    <ellipse cx="42" cy="27" rx="3.5" ry="4.5" fill="#292524"/>
    <circle cx="41" cy="25.5" r="1.3" fill="#ffffff"/>
    <path d="M22 45 Q 32 37 42 45" fill="none" stroke="#78350f" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`,

  anxious: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <circle cx="32" cy="32" r="28" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/>
    <path d="M16 12 C 14 15, 12 18, 12 21 C 12 24, 15 26, 17 26 C 20 26, 22 24, 22 21 C 22 18, 18 15, 16 12 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
    <circle cx="15.5" cy="20" r="1.2" fill="#ffffff"/>
    <path d="M19 22 Q 24 18 28 23" fill="none" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
    <path d="M45 22 Q 40 18 36 23" fill="none" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="24" cy="28" rx="4" ry="5" fill="#292524"/>
    <circle cx="23" cy="26" r="1.5" fill="#ffffff"/>
    <ellipse cx="40" cy="28" rx="4" ry="5" fill="#292524"/>
    <circle cx="39" cy="26" r="1.5" fill="#ffffff"/>
    <path d="M22 42 Q 32 38 42 42 Q 32 49 22 42 Z" fill="#78350f" stroke="#78350f" stroke-width="1"/>
    <path d="M24 42 Q 32 40 40 42" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  relieved: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <circle cx="32" cy="32" r="28" fill="#fbbf24" stroke="#ca8a04" stroke-width="2.5"/>
    <path d="M18 20 Q 23 17 28 20" fill="none" stroke="#854d0e" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M46 20 Q 41 17 36 20" fill="none" stroke="#854d0e" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M18 28 Q 23 23 28 28" fill="none" stroke="#713f12" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M46 28 Q 41 23 36 28" fill="none" stroke="#713f12" stroke-width="3.2" stroke-linecap="round"/>
    <ellipse cx="16" cy="35" rx="4.5" ry="2.5" fill="#f43f5e" opacity="0.45"/>
    <ellipse cx="48" cy="35" rx="4.5" ry="2.5" fill="#f43f5e" opacity="0.45"/>
    <path d="M24 38 Q 32 46 40 38" fill="none" stroke="#713f12" stroke-width="3.2" stroke-linecap="round"/>
  </svg>`,

  excited: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <circle cx="32" cy="32" r="28" fill="#fbbf24" stroke="#c2410c" stroke-width="2.5"/>
    <polygon points="23,17 25,23 31,23 26,27 28,33 23,29 18,33 20,27 15,23 21,23" fill="#f59e0b" stroke="#78350f" stroke-width="1.2"/>
    <polygon points="23,19 24.5,23.5 28.5,23.5 25,26.5 26.5,31 23,28 19.5,31 21,26.5 17.5,23.5 21.5,23.5" fill="#fef08a"/>
    <polygon points="41,17 43,23 49,23 44,27 46,33 41,29 36,33 38,27 33,23 39,23" fill="#f59e0b" stroke="#78350f" stroke-width="1.2"/>
    <polygon points="41,19 42.5,23.5 46.5,23.5 43,26.5 44.5,31 41,28 37.5,31 39,26.5 35.5,23.5 39.5,23.5" fill="#fef08a"/>
    <path d="M20 38 Q 32 38 44 38 C 44 48, 38 52, 32 52 C 26 52, 20 48, 20 38 Z" fill="#78350f" stroke="#78350f" stroke-width="1"/>
    <path d="M21 38 Q 32 38 43 38 C 43 41, 40 43, 32 43 C 24 43, 21 41, 21 38 Z" fill="#ffffff"/>
    <path d="M26 48 C 28 45, 36 45, 38 48 C 36 51, 28 51, 26 48 Z" fill="#f43f5e"/>
  </svg>`,
};

/**
 * Loads an inline SVG into an HTMLImageElement safely
 */
function loadSvgElement(svgString: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    const encoded = encodeURIComponent(svgString.trim());
    img.src = `data:image/svg+xml;charset=utf-8,${encoded}`;
    if (img.complete && img.naturalWidth > 0) {
      resolve(img);
      return;
    }
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    setTimeout(() => resolve(img), 400);
  });
}

/**
 * High-resolution Canvas 2D Boarding Pass Generator.
 * 100% offline, zero remote stylesheet access, immune to CORS/SecurityError and iOS emoji font missing glyphs.
 * Produces crisp 2x resolution certificate matching the on-screen card layout.
 */
export async function generatePassCanvas(
  passData: UserPassData,
  selectedScene: ReflectionScene,
  selectedEmotion: CoreEmotionInfo,
  sceneImageElement?: HTMLImageElement | null
): Promise<HTMLCanvasElement> {
  // Ensure document fonts are loaded if available
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  // Pre-load all standalone vector SVGs for emojis
  const [trainImg, worriedImg, anxiousImg, relievedImg, excitedImg] = await Promise.all([
    loadSvgElement(EMOJI_SVGS.train),
    loadSvgElement(EMOJI_SVGS.worried),
    loadSvgElement(EMOJI_SVGS.anxious),
    loadSvgElement(EMOJI_SVGS.relieved),
    loadSvgElement(EMOJI_SVGS.excited),
  ]);

  const emotionSvgMap: Record<string, HTMLImageElement> = {
    worried: worriedImg,
    anxious: anxiousImg,
    relieved: relievedImg,
    excited: excitedImg,
  };

  const canvas = document.createElement('canvas');
  // High-resolution canvas matching the on-screen vertical proportion (900 x 920)
  const W = 900;
  const H = 920;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas 2D context');

  // Helper for rounded rectangles
  const roundRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    fill = true,
    stroke = false
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  };

  // 1. Overall Background (Clean white border margin)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);

  // 2. Ticket Card Body
  const margin = 20;
  const cardW = W - margin * 2;
  const cardH = H - margin * 2;

  // Ticket shadow
  ctx.fillStyle = 'rgba(217, 119, 6, 0.10)';
  roundRect(margin + 4, margin + 6, cardW, cardH, 28, true, false);

  // Card background (matching bg-gradient-to-br from-amber-50 via-white to-orange-50/70)
  const bgGrad = ctx.createLinearGradient(margin, margin, margin + cardW, margin + cardH);
  bgGrad.addColorStop(0, '#fffdf5');
  bgGrad.addColorStop(0.5, '#ffffff');
  bgGrad.addColorStop(1, '#fff7ed');
  ctx.fillStyle = bgGrad;
  roundRect(margin, margin, cardW, cardH, 24, true, false);

  // Card border
  ctx.strokeStyle = '#fcd34d';
  ctx.lineWidth = 3;
  roundRect(margin, margin, cardW, cardH, 24, false, true);

  // 3. Top Header Section (matching from-amber-600 via-orange-600 to-amber-700)
  const headerH = 100;
  const headerGrad = ctx.createLinearGradient(margin, margin, margin + cardW, margin);
  headerGrad.addColorStop(0, '#d97706');
  headerGrad.addColorStop(0.5, '#ea580c');
  headerGrad.addColorStop(1, '#b45309');

  // Clip header to rounded top
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(margin + 24, margin);
  ctx.lineTo(margin + cardW - 24, margin);
  ctx.quadraticCurveTo(margin + cardW, margin, margin + cardW, margin + 24);
  ctx.lineTo(margin + cardW, margin + headerH);
  ctx.lineTo(margin, margin + headerH);
  ctx.lineTo(margin, margin + 24);
  ctx.quadraticCurveTo(margin, margin, margin + 24, margin);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = headerGrad;
  ctx.fillRect(margin, margin, cardW, headerH);

  // Vector Train icon (drawn as vector SVG, zero font dependency)
  if (trainImg && trainImg.naturalWidth > 0) {
    ctx.drawImage(trainImg, margin + 24, margin + 26, 48, 48);
  }

  // Header Subtitle & Title
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('OFFICIAL READING CERTIFICATE', margin + 85, margin + 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('EMOTION EXPRESS PASS', margin + 85, margin + 74);

  // Ticket No on right side
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('TICKET NO.', margin + cardW - 28, margin + 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(passData.ticketNumber, margin + cardW - 28, margin + 72);

  ctx.restore();
  ctx.textAlign = 'left';

  // 4. Story & Learner Details Row
  const detailsY = margin + headerH + 32;

  // Left: Story Title
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('STORY TITLE', margin + 28, detailsY);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('The Unread Message', margin + 28, detailsY + 28);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Interactive English Storybook', margin + 28, detailsY + 48);

  // Right: Learner / Explorer Name & Date
  const rightX = margin + cardW - 28;
  ctx.textAlign = 'right';
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('LEARNER / EXPLORER', rightX, detailsY);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(passData.studentName, rightX, detailsY + 28);

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(passData.date, rightX, detailsY + 48);
  ctx.textAlign = 'left';

  // Dashed Divider 1
  const divider1Y = detailsY + 70;
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(margin + 20, divider1Y);
  ctx.lineTo(margin + cardW - 20, divider1Y);
  ctx.stroke();
  ctx.setLineDash([]);

  // 5. 4 Official Emotion Stamps Section
  const stampsTitleY = divider1Y + 28;
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('★ 4대 감정 스탬프 (Verified Emotion Stamps)', margin + 28, stampsTitleY);

  // Green "All 4 Unlocked!" badge
  ctx.fillStyle = '#d1fae5';
  roundRect(margin + cardW - 145, stampsTitleY - 16, 117, 24, 12, true, false);
  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✔ All 4 Unlocked!', margin + cardW - 145 + 58, stampsTitleY);
  ctx.textAlign = 'left';

  // 4 Stamp Cards in a row
  const stampKeys: CoreEmotionId[] = ['worried', 'anxious', 'relieved', 'excited'];
  const stampGap = 12;
  const totalStampWidth = cardW - 56;
  const stampWidth = (totalStampWidth - stampGap * 3) / 4;
  const stampH = 110;
  const stampsBoxY = stampsTitleY + 14;

  stampKeys.forEach((key, idx) => {
    const sX = margin + 28 + idx * (stampWidth + stampGap);
    const sY = stampsBoxY;
    const info = CORE_EMOTIONS[key];

    // Stamp card box
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 1.5;
    roundRect(sX, sY, stampWidth, stampH, 16, true, true);

    // Circle gradient badge
    const badgeSize = 44;
    const badgeCenterX = sX + stampWidth / 2;
    const badgeCenterY = sY + 34;

    const badgeGrad = ctx.createLinearGradient(
      badgeCenterX - badgeSize / 2,
      badgeCenterY - badgeSize / 2,
      badgeCenterX + badgeSize / 2,
      badgeCenterY + badgeSize / 2
    );
    badgeGrad.addColorStop(0, '#f59e0b');
    badgeGrad.addColorStop(1, '#ea580c');
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.arc(badgeCenterX, badgeCenterY, badgeSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Standalone Vector Emoji Icon (centered inside circle badge)
    const svgIcon = emotionSvgMap[key];
    if (svgIcon && svgIcon.naturalWidth > 0) {
      ctx.drawImage(svgIcon, badgeCenterX - 15, badgeCenterY - 15, 30, 30);
    }

    // Word text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(info.word, badgeCenterX, sY + 74);

    // Korean meaning
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(info.koreanMeaning.split(',')[0], badgeCenterX, sY + 94);
    ctx.textAlign = 'left';
  });

  // Dashed Divider 2
  const divider2Y = stampsBoxY + stampH + 24;
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(margin + 20, divider2Y);
  ctx.lineTo(margin + cardW - 20, divider2Y);
  ctx.stroke();
  ctx.setLineDash([]);

  // 6. Memorable Scene & Reflection Section
  const sceneAreaY = divider2Y + 22;
  const sceneThumbW = 320;
  const sceneThumbH = 220;
  const sceneX = margin + 28;

  // Scene Box Frame
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#fcd34d';
  ctx.lineWidth = 2;
  roundRect(sceneX, sceneAreaY, sceneThumbW, sceneThumbH, 18, true, true);

  // Draw scene image onto canvas
  try {
    let imgToDraw: CanvasImageSource | null = sceneImageElement || null;
    if (!imgToDraw || !(imgToDraw as HTMLImageElement).complete) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = selectedScene.image;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        setTimeout(resolve, 600);
      });
      if (img.complete && img.naturalWidth > 0) {
        imgToDraw = img;
      }
    }

    if (imgToDraw) {
      ctx.save();
      ctx.beginPath();
      roundRect(sceneX + 5, sceneAreaY + 5, sceneThumbW - 10, sceneThumbH - 10, 14, false, false);
      ctx.clip();
      ctx.drawImage(imgToDraw, sceneX + 5, sceneAreaY + 5, sceneThumbW - 10, sceneThumbH - 10);
      ctx.restore();

      // Page tag on image
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      roundRect(sceneX + 12, sceneAreaY + sceneThumbH - 34, 68, 22, 6, true, false);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Page ${selectedScene.pageNumber}`, sceneX + 46, sceneAreaY + sceneThumbH - 19);
      ctx.textAlign = 'left';
    }
  } catch (err) {
    console.warn('Canvas scene image draw note:', err);
  }

  // Right Side of Reflection: Scene title & My Feeling
  const reflTextX = sceneX + sceneThumbW + 28;
  const reflW = margin + cardW - reflTextX - 28;

  // Memorable Scene title
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('MEMORABLE SCENE (기억에 남는 장면)', reflTextX, sceneAreaY + 28);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(selectedScene.koreanTitle, reflTextX, sceneAreaY + 58);

  ctx.fillStyle = '#64748b';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(selectedScene.title, reflTextX, sceneAreaY + 82);

  // My Feeling Badge
  const feelingY = sceneAreaY + 125;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('MY EMOTIONAL CONNECTION (내가 선택한 감정)', reflTextX, feelingY);

  // Pill badge for selected emotion
  const pillGrad = ctx.createLinearGradient(reflTextX, feelingY + 12, reflTextX + 320, feelingY + 12);
  pillGrad.addColorStop(0, '#f59e0b');
  pillGrad.addColorStop(1, '#ea580c');
  ctx.fillStyle = pillGrad;
  roundRect(reflTextX, feelingY + 12, Math.min(reflW, 340), 48, 24, true, false);

  // Standalone Vector Emoji in pill badge
  const selSvgIcon = emotionSvgMap[selectedEmotion.id] || emotionSvgMap['excited'];
  if (selSvgIcon && selSvgIcon.naturalWidth > 0) {
    ctx.drawImage(selSvgIcon, reflTextX + 14, feelingY + 22, 28, 28);
  }

  // Word in pill badge
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(selectedEmotion.word.toUpperCase(), reflTextX + 50, feelingY + 42);

  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`(${selectedEmotion.koreanMeaning.split(',')[0]})`, reflTextX + 165, feelingY + 41);

  // Verified Stamp ribbon at bottom right
  ctx.textAlign = 'right';
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('✔ 100% COMPLETE · OFFICIAL EMOTION EXPRESS PASS', margin + cardW - 28, H - margin - 18);
  ctx.textAlign = 'left';

  return canvas;
}
