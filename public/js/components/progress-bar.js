// Progress bar component

class ProgressBar {
  constructor(barElement, statusElement) {
    this.bar = barElement;
    this.status = statusElement;
    this.progress = 0;
  }

  setProgress(percent, message = '') {
    this.progress = Math.min(100, Math.max(0, percent));
    this.bar.style.width = `${this.progress}%`;
    
    if (message && this.status) {
      this.status.textContent = message;
    }
  }

  start(message = 'Processing...') {
    this.setProgress(0, message);
  }

  update(percent, message) {
    this.setProgress(percent, message);
  }

  complete(message = 'Complete!') {
    this.setProgress(100, message);
  }

  reset() {
    this.setProgress(0, '');
  }

  simulate(duration = 3000, onComplete) {
    let progress = 0;
    const interval = 50;
    const steps = duration / interval;
    const increment = 90 / steps;

    const timer = setInterval(() => {
      progress += increment;
      if (progress >= 90) {
        clearInterval(timer);
        this.setProgress(90, 'Finalizing...');
        if (onComplete) onComplete();
      } else {
        this.setProgress(progress, 'Converting...');
      }
    }, interval);

    return timer;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProgressBar;
}
