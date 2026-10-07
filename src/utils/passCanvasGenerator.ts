import { UserPassData, CoreEmotionInfo, ReflectionScene, CoreEmotionId } from '../types/story';
import { CORE_EMOTIONS } from '../data/storyData';

/**
 * Robust, 100% offline Canvas 2D Boarding Pass Generator.
 * Completely immune to CSS `oklab` / stylesheet parser errors.
 * Produces crisp 2x resolution certificates compatible with mobile & desktop.
 */
export async function generatePassCanvas(
  passData: UserPassData,
  selectedScene: ReflectionScene,
  selectedEmotion: CoreEmotionInfo,
  sceneImageElement?: HTMLImageElement | null
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  // High-resolution landscape pass (1200 x 820)
  const W = 1200;
  const H = 820;
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

  // 1. Overall Background (Clean crisp white border margin)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);

  // 2. Ticket Card Body
  const margin = 24;
  const cardW = W - margin * 2;
  const cardH = H - margin * 2;

  // Ticket shadow
  ctx.fillStyle = 'rgba(217, 119, 6, 0.12)';
  roundRect(margin + 4, margin + 6, cardW, cardH, 28, true, false);

  // Card background
  const bgGrad = ctx.createLinearGradient(margin, margin, margin + cardW, margin + cardH);
  bgGrad.addColorStop(0, '#fffdf5');
  bgGrad.addColorStop(0.5, '#ffffff');
  bgGrad.addColorStop(1, '#fff7ed');
  ctx.fillStyle = bgGrad;
  roundRect(margin, margin, cardW, cardH, 24, true, false);

  // Card border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  roundRect(margin, margin, cardW, cardH, 24, false, true);

  // 3. Top Header Bar (Railroad ticket header)
  const headerH = 110;
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

  // Header content
  ctx.fillStyle = '#ffffff';
  ctx.font = '42px sans-serif';
  ctx.fillText('🚂', margin + 30, margin + 72);

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('OFFICIAL READING CERTIFICATE · EMOTION EXPRESS', margin + 95, margin + 45);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('EMOTION EXPRESS PASS', margin + 95, margin + 85);

  // Ticket No & Issue Date on right side
  ctx.fillStyle = '#fef3c7';
  ctx.font = '13px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('TICKET NO.', margin + cardW - 35, margin + 45);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(passData.ticketNumber, margin + cardW - 35, margin + 75);

  ctx.restore();
  ctx.textAlign = 'left'; // reset

  // Perforation dots below header
  ctx.strokeStyle = '#fcd34d';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(margin + 20, margin + headerH + 15);
  ctx.lineTo(margin + cardW - 20, margin + headerH + 15);
  ctx.stroke();
  ctx.setLineDash([]); // reset dash

  // 4. Learner & Story Details Row
  const detailsY = margin + headerH + 45;
  // Left: Story Title
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('STORY TITLE', margin + 35, detailsY);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('The Unread Message', margin + 35, detailsY + 30);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Interactive English Storybook', margin + 35, detailsY + 54);

  // Right: Explorer Name & Date
  const rightX = margin + cardW - 35;
  ctx.textAlign = 'right';
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('LEARNER / EXPLORER', rightX, detailsY);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(passData.studentName, rightX, detailsY + 30);

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(`DATE: ${passData.date}`, rightX, detailsY + 54);
  ctx.textAlign = 'left';

  // 5. 4 Official Emotion Stamps Section
  const stampsY = detailsY + 80;
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('★ 4대 핵심 감정 스탬프 (Verified Emotion Stamps)', margin + 35, stampsY);

  // Draw 4 stamp cards side by side
  const stampKeys: CoreEmotionId[] = ['worried', 'anxious', 'relieved', 'excited'];
  const stampWidth = (cardW - 70 - 36) / 4;
  const stampH = 88;

  stampKeys.forEach((key, idx) => {
    const sX = margin + 35 + idx * (stampWidth + 12);
    const sY = stampsY + 12;
    const info = CORE_EMOTIONS[key];

    // Stamp card box
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 2;
    roundRect(sX, sY, stampWidth, stampH, 16, true, true);

    // Mini circle badge with icon
    const badgeSize = 40;
    const badgeGrad = ctx.createLinearGradient(sX + 14, sY + 14, sX + 14 + badgeSize, sY + 14 + badgeSize);
    badgeGrad.addColorStop(0, '#f59e0b');
    badgeGrad.addColorStop(1, '#ea580c');
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.arc(sX + 32, sY + 44, 22, 0, Math.PI * 2);
    ctx.fill();

    // Emoji icon
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(info.stampIcon, sX + 32, sY + 52);

    // Text info
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(info.word, sX + 65, sY + 38);

    ctx.fillStyle = '#92400e';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(info.koreanMeaning.split(',')[0], sX + 65, sY + 60);
  });

  // Perforation separator
  const dividerY = stampsY + stampH + 35;
  ctx.strokeStyle = '#fcd34d';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(margin + 20, dividerY);
  ctx.lineTo(margin + cardW - 20, dividerY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 6. Memorable Scene & Reflection Section
  const sceneAreaY = dividerY + 20;
  const sceneThumbW = 340;
  const sceneThumbH = 220;
  const sceneX = margin + 35;

  // Scene Box Frame
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#fbbf24';
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
        setTimeout(resolve, 600); // safety timeout
      });
      if (img.complete && img.naturalWidth > 0) {
        imgToDraw = img;
      }
    }

    if (imgToDraw) {
      ctx.save();
      ctx.beginPath();
      roundRect(sceneX + 6, sceneAreaY + 6, sceneThumbW - 12, sceneThumbH - 12, 14, false, false);
      ctx.clip();
      ctx.drawImage(imgToDraw, sceneX + 6, sceneAreaY + 6, sceneThumbW - 12, sceneThumbH - 12);
      ctx.restore();

      // Page tag on image
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      roundRect(sceneX + 16, sceneAreaY + sceneThumbH - 38, 70, 24, 6, true, false);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Page ${selectedScene.pageNumber}`, sceneX + 51, sceneAreaY + sceneThumbH - 22);
      ctx.textAlign = 'left';
    }
  } catch (err) {
    console.warn('Canvas scene image draw note:', err);
  }

  // Right Side of Reflection: Scene title & My Feeling
  const reflTextX = sceneX + sceneThumbW + 35;
  const reflW = margin + cardW - reflTextX - 35;

  // Memorable Scene title
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('MEMORABLE SCENE (기억에 남는 장면)', reflTextX, sceneAreaY + 30);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(selectedScene.koreanTitle, reflTextX, sceneAreaY + 62);

  ctx.fillStyle = '#64748b';
  ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(selectedScene.title, reflTextX, sceneAreaY + 86);

  // My Feeling Badge
  const feelingY = sceneAreaY + 125;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('MY EMOTIONAL CONNECTION (내가 선택한 감정)', reflTextX, feelingY);

  // Large pill badge for selected emotion
  const pillGrad = ctx.createLinearGradient(reflTextX, feelingY + 14, reflTextX + 320, feelingY + 14);
  pillGrad.addColorStop(0, '#f59e0b');
  pillGrad.addColorStop(1, '#ea580c');
  ctx.fillStyle = pillGrad;
  roundRect(reflTextX, feelingY + 14, Math.min(reflW, 360), 54, 27, true, false);

  ctx.fillStyle = '#ffffff';
  ctx.font = '26px sans-serif';
  ctx.fillText(selectedEmotion.stampIcon, reflTextX + 18, feelingY + 50);

  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(selectedEmotion.word.toUpperCase(), reflTextX + 58, feelingY + 48);

  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`(${selectedEmotion.koreanMeaning.split(',')[0]})`, reflTextX + 185, feelingY + 47);

  // Official Verified Stamp Ribbon on bottom right
  ctx.textAlign = 'right';
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('✔ 100% COMPLETE · OFFICIAL EMOTION EXPRESS PASS', margin + cardW - 35, H - margin - 20);
  ctx.textAlign = 'left';

  return canvas;
}
