(() => {
  'use strict';

  const STORAGE_KEY = 'portfolioIntroViewed';
  const overlay = document.getElementById('intro-overlay');
  const video = document.getElementById('intro-video');
  const skipButton = document.getElementById('intro-skip');
  const playButton = document.getElementById('intro-play');

  if (!overlay) return;

  const prefersReducedMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hasViewedIntro = () => {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  };

  const markIntroViewed = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // The intro can still close when storage is unavailable.
    }
  };

  let isClosing = false;

  const removeOverlay = () => {
    if (overlay.isConnected) {
      overlay.remove();
    }
  };

  const closeIntro = ({ animate = true } = {}) => {
    if (isClosing) return;
    isClosing = true;
    markIntroViewed();

    if (video) {
      video.pause();
    }

    if (!animate || prefersReducedMotion) {
      removeOverlay();
      return;
    }

    overlay.classList.add('intro-exit');
    overlay.addEventListener('transitionend', (event) => {
      if (event.target === overlay && event.propertyName === 'opacity') {
        removeOverlay();
      }
    });
    window.setTimeout(removeOverlay, 600);
  };

  if (hasViewedIntro() || prefersReducedMotion) {
    closeIntro({ animate: false });
    return;
  }

  if (!video || !skipButton || !playButton) {
    removeOverlay();
    return;
  }

  const showPlayFallback = () => {
    playButton.hidden = false;
  };

  const tryToPlay = () => {
    const playAttempt = video.play();

    if (playAttempt && typeof playAttempt.then === 'function') {
      playAttempt
        .then(() => {
          playButton.hidden = true;
        })
        .catch(showPlayFallback);
    }
  };

  video.addEventListener('ended', () => closeIntro());
  video.addEventListener('error', showPlayFallback);
  skipButton.addEventListener('click', () => closeIntro());
  playButton.addEventListener('click', tryToPlay);

  tryToPlay();
})();
