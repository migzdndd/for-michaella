let highestZ = 20;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 26 - 13;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Set initial natural rotation
    paper.style.transform = `translateX(0px) translateY(0px) rotateZ(${this.rotation}deg)`;

    // --- TOUCH EVENTS (Mobile / Tablet) ---
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    }, { passive: false });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.holdingPaper) return;

      if (e.touches.length === 1 && !this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;

        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;

        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;

        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      } else if (e.touches.length > 1) {
        // Two-finger rotate
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        this.rotation = Math.round(angle);
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    }, { passive: false });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    paper.addEventListener('touchcancel', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // --- MOUSE EVENTS (Desktop) ---
    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;

      this.prevTouchX = e.clientX;
      this.prevTouchY = e.clientY;
      this.touchStartX = e.clientX;
      this.touchStartY = e.clientY;

      if (e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.holdingPaper) return;

      if (!this.rotating) {
        this.velX = e.clientX - this.prevTouchX;
        this.velY = e.clientY - this.prevTouchY;

        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;

        this.prevTouchX = e.clientX;
        this.prevTouchY = e.clientY;
      } else {
        const dirX = e.clientX - this.touchStartX;
        const dirY = e.clientY - this.touchStartY;
        const angle = Math.atan2(dirY, dirX) * (180 / Math.PI);
        this.rotation = (360 + Math.round(angle)) % 360;
      }

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    paper.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
