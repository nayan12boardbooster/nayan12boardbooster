// This file is intentionally left blank. Pattern lock logic moved to studypage1.js.
  const lockOverlay = document.getElementById('lockOverlay');
  if (!lockOverlay) return;

  lockOverlay.innerHTML = `
    <div style="background:rgba(255,255,255,0.98);border-radius:28px;box-shadow:0 0 40px 8px #fbc2eb66;padding:45px 40px 35px;max-width:400px;width:92%;color:#7f53ac;display:flex;flex-direction:column;align-items:center;font-family:'Montserrat','Segoe UI',sans-serif;">
      <div style="font-size:3.2em;margin-bottom:24px;text-shadow:0 0 15px #fbc2eb99;">🔒</div>
      <div style="font-size:1.3rem;color:#7f53ac;font-weight:700;margin-bottom:12px;text-align:center;text-shadow:0 0 8px #fbc2eb44;">Welcome to 12 Boards Booster</div>
      <div style="font-size:1.1rem;color:#7f53ac;font-weight:600;margin-bottom:25px;text-align:center;">Draw the pattern to access</div>
      <div style="font-size: 1.15rem; background: linear-gradient(45deg, #7f53ac, #fbc2eb); -webkit-background-clip: text; background-clip: text; color: transparent; font-weight: 700; margin-bottom: 20px; text-align: center; padding: 8px 20px; border-radius: 15px; border: 2px solid #fbc2eb44; box-shadow: 0 0 20px #7f53ac33; text-shadow: 0 0 15px #fbc2eb66; animation: ownerGlow 2s infinite alternate;">✨ Created by Nayan Gupta ✨</div>
      <style>@keyframes ownerGlow { from { text-shadow: 0 0 15px #fbc2eb66; } to { text-shadow: 0 0 25px #7f53ac88; } }</style>
      <canvas id='patternCanvas' width='320' height='320' style='background:linear-gradient(135deg,#fbc2eb22 0%,#a6c1ee22 100%);border-radius:24px;box-shadow:0 0 30px #fbc2eb44;margin-bottom:22px;touch-action:none;backdrop-filter:blur(8px);border:2px solid #fbc2eb33;'></canvas>
      <div id='lockError' style='color:#ff6b6b;font-size:1.05rem;min-height:24px;margin-bottom:12px;font-weight:500;text-shadow:0 0 8px #ff6b6b33;'></div>
    </div>
  `;

  const patternCanvas = document.getElementById('patternCanvas');
  const ctx = patternCanvas.getContext('2d');
  const dotRadius = 22;
  const grid = 3;
  const spacing = 90;
  const offset = 60;
  let pattern = [];
  let isDrawing = false;
  let lastDot = null;
  let dots = [];
  const correctPattern = [8, 5, 3, 6, 9];

  // Calculate dot positions
  dots = [];
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      dots.push({
        x: offset + x * spacing,
        y: offset + y * spacing,
        n: y * grid + x + 1
      });
    }
  }

  function drawPattern(current) {
    ctx.clearRect(0, 0, 320, 320);
    // Draw connecting lines
    if (pattern.length > 0) {
      const gradient = ctx.createLinearGradient(0, 0, 320, 320);
      gradient.addColorStop(0, '#7f53accc');
      gradient.addColorStop(1, '#fbc2ebcc');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#fbc2eb';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      for (let i = 0; i < pattern.length; i++) {
        let d = dots.find(dot => dot.n === pattern[i]);
        if (i === 0) {
          ctx.moveTo(d.x, d.y);
        } else {
          ctx.lineTo(d.x, d.y);
        }
      }
      if (current) {
        ctx.lineTo(current.x, current.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    // Draw dots
    for (let d of dots) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, dotRadius, 0, 2 * Math.PI);
      ctx.fillStyle = pattern.includes(d.n) ? '#fbc2eb' : '#fff';
      ctx.shadowColor = pattern.includes(d.n) ? '#fbc2eb' : '#7f53ac';
      ctx.shadowBlur = pattern.includes(d.n) ? 18 : 8;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = pattern.includes(d.n) ? '#7f53ac' : '#d1d1d1';
      ctx.stroke();
      ctx.shadowBlur = 0;
      // Dot highlight
      if (pattern.includes(d.n)) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, dotRadius / 2.2, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff6';
        ctx.fill();
      }
    }
  }

  function getDotAt(x, y) {
    const touchRadius = dotRadius + 15;
    for (let d of dots) {
      if (Math.hypot(d.x - x, d.y - y) < touchRadius && !pattern.includes(d.n)) return d;
    }
    return null;
  }

  patternCanvas.addEventListener('pointerdown', e => {
    pattern = [];
    isDrawing = true;
    lastDot = null;
    const rect = patternCanvas.getBoundingClientRect();
    const d = getDotAt(e.clientX - rect.left, e.clientY - rect.top);
    if (d) {
      pattern.push(d.n);
      lastDot = d;
      drawPattern();
    }
  });

  patternCanvas.addEventListener('pointermove', e => {
    if (!isDrawing) return;
    const rect = patternCanvas.getBoundingClientRect();
    const d = getDotAt(e.clientX - rect.left, e.clientY - rect.top);
    if (d && (!lastDot || d.n !== lastDot.n)) {
      pattern.push(d.n);
      lastDot = d;
    }
    drawPattern();
  });

  patternCanvas.addEventListener('pointerup', () => {
    isDrawing = false;
    drawPattern();
    if (pattern.length === correctPattern.length && pattern.every((v, i) => v === correctPattern[i])) {
      // Success animation
      const overlay = lockOverlay.querySelector('div');
      overlay.style.transform = 'scale(0.95)';
      overlay.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        overlay.style.transform = 'scale(1.05)';
        setTimeout(() => {
          overlay.style.transform = 'scale(0)';
          overlay.style.opacity = '0';
          setTimeout(() => {
            lockOverlay.style.background = 'transparent';
            lockOverlay.style.backdropFilter = 'blur(0)';
            setTimeout(() => {
              lockOverlay.style.display = 'none';
              document.body.style.overflow = '';
              document.body.style.pointerEvents = '';
              pattern = [];
            }, 300);
          }, 200);
        }, 100);
      }, 100);
    } else {
      // Error animation and feedback
      const errorElem = document.getElementById('lockError');
      const canvas = document.getElementById('patternCanvas');
      canvas.style.transform = 'translateX(10px)';
      canvas.style.transition = 'transform 0.1s ease';
      setTimeout(() => {
        canvas.style.transform = 'translateX(-8px)';
        setTimeout(() => {
          canvas.style.transform = 'translateX(6px)';
          setTimeout(() => {
            canvas.style.transform = 'translateX(-4px)';
            setTimeout(() => {
              canvas.style.transform = 'translateX(0)';
            }, 50);
          }, 50);
        }, 50);
      }, 50);
      errorElem.innerText = 'Incorrect pattern. Please try again.';
      errorElem.style.transform = 'scale(1.1)';
      errorElem.style.transition = 'all 0.2s ease';
      setTimeout(() => {
        errorElem.style.transform = 'scale(1)';
        pattern = [];
        drawPattern();
// This file is intentionally left blank. Pattern lock logic has been moved to studypage1.js.