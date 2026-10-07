import { UserPassData, CoreEmotionInfo, ReflectionScene, CoreEmotionId } from '../types/story';
import { CORE_EMOTIONS } from '../data/storyData';

/**
 * High-resolution Canvas 2D Boarding Pass Generator.
 * 100% offline, zero remote stylesheet access, immune to CORS/SecurityError.
 * Produces crisp 2x resolution certificate matching the on-screen card layout.
 */
export async function generatePassCanvas(
  passData: UserPassData,
  selectedScene: ReflectionScene,
  selectedEmotion: CoreEmotionInfo,
  sceneImageElement?: HTMLImageElement | null
): Promise<HTMLCanvasElement> {
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

  // Train icon
  ctx.font = '36px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.fillText('🚂', margin + 28, margin + 62);

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

    // Emoji icon (centered inside circle)
    ctx.font = '22px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(info.stampIcon, badgeCenterX, badgeCenterY + 1);
    ctx.textBaseline = 'alphabetic';

    // Word text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
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

  // Emoji in pill badge
  ctx.font = '22px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(selectedEmotion.stampIcon, reflTextX + 28, feelingY + 36);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  // Word in pill badge
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(selectedEmotion.word.toUpperCase(), reflTextX + 54, feelingY + 42);

  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`(${selectedEmotion.koreanMeaning.split(',')[0]})`, reflTextX + 175, feelingY + 41);

  // Verified Stamp ribbon at bottom right
  ctx.textAlign = 'right';
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('✔ 100% COMPLETE · OFFICIAL EMOTION EXPRESS PASS', margin + cardW - 28, H - margin - 18);
  ctx.textAlign = 'left';

  return canvas;
}

