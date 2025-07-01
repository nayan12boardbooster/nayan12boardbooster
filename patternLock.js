(function() {
  const PATTERN = [8,5,3,6,9];
  function showPatternLock() {
    if (document.getElementById('lockOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'lockOverlay';
    overlay.style.display = 'flex';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '2000';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'radial-gradient(ellipse at center, #0a0a13 0%, #1a1a2e 100%)';
    overlay.style.pointerEvents = 'auto';
    overlay.innerHTML = `
      <div style="background: linear-gradient(120deg,#181a23 0 60px,#232a3c 60px 120px,#181a23 120px 180px); color: #1a3cff; box-shadow: 0 0 60px #232a3c, 0 0 120px #181a23; border: 4px solid #1a3cff; border-radius: 22px; padding: 36px 28px; text-align: center; min-width: 320px; max-width: 90vw; pointer-events: auto; position: relative; overflow: visible;">
        <div style="font-size:2.7em;filter:drop-shadow(0 0 18px #1a3cff) drop-shadow(0 0 32px #232a3c);margin-bottom:8px;">\uD83D\uDC7B</div>
        <div class="owner" style="color: #1a3cff; font-family: 'Montserrat', Arial, sans-serif; font-size: 1.2em; margin-bottom: 14px; text-shadow: 0 0 18px #232a3c, 0 0 24px #1a3cff; letter-spacing:2px;">PATTERN LOCK</div>
        <canvas id='patternCanvas' width='320' height='320' style='background:linear-gradient(135deg,#181a23 0 60px,#232a3c 60px 120px,#181a23 120px 180px);border-radius:20px;box-shadow:0 0 40px #232a3c,0 0 80px #181a23;margin-bottom:16px;touch-action:none;backdrop-filter:blur(4px);border:3px solid #1a3cff;pointer-events:auto;'></canvas>
        <div id='patternError' style='color:#1a3cff; margin-top: 10px; min-height: 1.5em; font-weight:bold; text-shadow:0 0 8px #232a3c,0 0 16px #1a3cff;'></div>
        <div style="font-size:1em;color:#1a3cff;margin-top:8px;text-shadow:0 0 8px #232a3c;font-family:'Nosifer','Montserrat',cursive,sans-serif;letter-spacing:2px;">Draw the pattern to unlock...<br><span style='color:#c00;font-family:Nosifer,cursive,sans-serif;text-shadow:0 0 8px #000,0 0 16px #c00;font-size:1.1em;'>Fail, and the spirits will haunt you.</span></div>
        <div style="position:absolute;top:-40px;left:50%;transform:translateX(-50%);font-size:2em;filter:drop-shadow(0 0 12px #1a3cff);">\uD83D\uDC7B</div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    setupPatternCanvas(PATTERN, overlay);
  }

  function setupPatternCanvas(correctPattern, overlay) {
    const canvas = document.getElementById('patternCanvas');
    const ctx = canvas.getContext('2d');
    const dotRadius = 22;
    const grid = 3;
    const spacing = 90;
    const offset = 60;
    let pattern = [];
    let isDrawing = false;
    let lastDot = null;
    let pointerDown = false;
    let dots = [];
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
      if (pattern.length > 0) {
        // Dark blue glowing line with shadow
        const gradient = ctx.createLinearGradient(0, 0, 320, 320);
        gradient.addColorStop(0, '#1a3cff'); // deep blue
        gradient.addColorStop(0.5, '#0a1a3c'); // darker blue
        gradient.addColorStop(1, '#000');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#1a3cff';
        ctx.shadowBlur = 48;
        ctx.beginPath();
        for (let i = 0; i < pattern.length; i++) {
          let d = dots.find(dot => dot.n === pattern[i]);
          if (i === 0) ctx.moveTo(d.x, d.y);
          else ctx.lineTo(d.x, d.y);
        }
        if (current) ctx.lineTo(current.x, current.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      for (let d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, dotRadius, 0, 2 * Math.PI);
        ctx.fillStyle = pattern.includes(d.n) ? '#fff' : '#fff';
        ctx.shadowColor = pattern.includes(d.n) ? '#1a3cff' : '#232a3c';
        ctx.shadowBlur = pattern.includes(d.n) ? 32 : 12;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = pattern.includes(d.n) ? '#1a3cff' : '#232a3c';
        ctx.stroke();
        ctx.shadowBlur = 0;
        if (pattern.includes(d.n)) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, dotRadius / 2.1, 0, 2 * Math.PI);
          ctx.fillStyle = '#eaf6ff';
          ctx.fill();
          // Draw a skull emoji in the center of selected dots
          ctx.font = 'bold 26px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#1a3cff';
          ctx.shadowColor = '#1a3cff';
          ctx.shadowBlur = 12;
          ctx.fillText('\uD83D\uDC80', d.x, d.y);
          ctx.shadowBlur = 0;
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
    canvas.addEventListener('pointerdown', e => {
      pointerDown = true;
      pattern = [];
      isDrawing = true;
      lastDot = null;
      const rect = canvas.getBoundingClientRect();
      const d = getDotAt(e.clientX - rect.left, e.clientY - rect.top);
      if (d) {
        pattern.push(d.n);
        lastDot = d;
        drawPattern();
      }
    });
    canvas.addEventListener('pointermove', e => {
      if (!isDrawing || !pointerDown) return;
      const rect = canvas.getBoundingClientRect();
      const d = getDotAt(e.clientX - rect.left, e.clientY - rect.top);
      if (d && (!lastDot || d.n !== lastDot.n)) {
        pattern.push(d.n);
        lastDot = d;
      }
      drawPattern();
    });
    canvas.addEventListener('pointerup', e => {
      pointerDown = false;
      isDrawing = false;
      drawPattern();
      if (pattern.length === correctPattern.length && pattern.every((v, i) => v === correctPattern[i])) {
        // Success
        overlay.style.transition = 'opacity 0.5s';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = '';
        }, 500);
      } else {
        // Error
        const errorElem = document.getElementById('patternError');
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
        errorElem.innerText = 'The spirits shriek! Wrong pattern!';
        errorElem.style.transform = 'scale(1.1)';
        errorElem.style.transition = 'all 0.2s ease';
        setTimeout(() => {
          errorElem.style.transform = 'scale(1)';
          pattern = [];
          drawPattern();
          setTimeout(() => {
            errorElem.style.opacity = '0';
            setTimeout(() => {
              errorElem.innerText = '';
              errorElem.style.opacity = '1';
            }, 200);
          }, 1000);
        }, 200);
      }
    });
    drawPattern();
  }

  // Show on page load
  window.addEventListener('DOMContentLoaded', showPatternLock);
})();
