(() => {
  'use strict';

  const overlay = document.getElementById('intro-overlay');
  const video = document.getElementById('intro-video');
  const playButton = document.getElementById('intro-play');
  const dateElement = document.getElementById('intro-date');
  const timeElement = document.getElementById('intro-time');
  const lockScreen = overlay?.querySelector('.intro-lock-screen');

  if (!overlay) return;

  const prefersReducedMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  let isSigningIn = false;
  let replayTimer = null;
  let clockTimer = null;
  let removalTimer = null;
  let cursorTimer = null;

  const updateClock = () => {
    const now = new Date();

    if (dateElement) {
      const dateText = dateFormatter.format(now).replace(',', '');
      dateElement.textContent = dateText;
      dateElement.dateTime = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0')
      ].join('-');
    }

    if (timeElement) {
      const timeText = timeFormatter
        .formatToParts(now)
        .filter((part) => part.type !== 'dayPeriod' && part.type !== 'literal')
        .map((part) => part.value)
        .join(':');
      timeElement.textContent = timeText;
      timeElement.dateTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
  };

  const clearReplayTimer = () => {
    if (replayTimer !== null) {
      window.clearTimeout(replayTimer);
      replayTimer = null;
    }
  };

  const restorePage = () => {
    document.body.classList.remove('intro-active');
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('mousemove', handleMouseMove);
    if (cursorTimer !== null) {
      window.clearTimeout(cursorTimer);
      cursorTimer = null;
    }
    overlay.classList.remove('intro-cursor-hidden');
    if (clockTimer !== null) {
      window.clearInterval(clockTimer);
      clockTimer = null;
    }
  };

  const removeOverlay = () => {
    if (removalTimer !== null) {
      window.clearTimeout(removalTimer);
      removalTimer = null;
    }
    if (overlay.isConnected) {
      overlay.remove();
    }
    restorePage();
  };

  const signIn = () => {
    if (isSigningIn) return;
    isSigningIn = true;

    clearReplayTimer();
    if (video) {
      video.pause();
    }

    overlay.classList.add('intro-exit');
    overlay.addEventListener('transitionend', (event) => {
      if (event.target === overlay && event.propertyName === 'opacity') {
        removeOverlay();
      }
    });
    removalTimer = window.setTimeout(removeOverlay, prefersReducedMotion ? 150 : 850);
  };

  function handleKeydown(event) {
    if (isSigningIn || !overlay.isConnected) return;
    if (event.target === playButton) return;
    if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      signIn();
    }
  }

  const showPlayFallback = () => {
    if (playButton && !isSigningIn && !prefersReducedMotion) {
      playButton.hidden = false;
    }
  };

  const pulseLockScreen = () => {
    if (!lockScreen || prefersReducedMotion) return;
    lockScreen.classList.remove('intro-loop-pulse');
    void lockScreen.offsetWidth;
    lockScreen.classList.add('intro-loop-pulse');
  };

  function handleMouseMove() {
    if (isSigningIn || !overlay.isConnected) return;
    overlay.classList.remove('intro-cursor-hidden');
    if (cursorTimer !== null) {
      window.clearTimeout(cursorTimer);
    }
    cursorTimer = window.setTimeout(() => {
      cursorTimer = null;
      if (!isSigningIn && overlay.isConnected) {
        overlay.classList.add('intro-cursor-hidden');
      }
    }, 2000);
  }

  const tryToPlay = () => {
    if (!video || isSigningIn || prefersReducedMotion) return;
    clearReplayTimer();
    const playAttempt = video.play();

    if (playAttempt && typeof playAttempt.then === 'function') {
      playAttempt
        .then(() => {
          if (playButton) playButton.hidden = true;
        })
        .catch(showPlayFallback);
    }
  };

  const scheduleReplay = () => {
    if (isSigningIn || prefersReducedMotion) return;
    clearReplayTimer();
    replayTimer = window.setTimeout(() => {
      replayTimer = null;
      if (!video || isSigningIn) return;
      video.currentTime = 0;
      pulseLockScreen();
      tryToPlay();
    }, 3000);
  };

  updateClock();
  clockTimer = window.setInterval(updateClock, 30000);

  overlay.addEventListener('click', signIn);
  if (playButton) {
    playButton.addEventListener('click', (event) => {
      event.stopPropagation();
      tryToPlay();
    });
  }
  document.addEventListener('keydown', handleKeydown);
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
  }

  if (video) {
    video.addEventListener('ended', scheduleReplay);
    video.addEventListener('error', showPlayFallback);
    if (lockScreen) {
      lockScreen.addEventListener('animationend', () => {
        lockScreen.classList.remove('intro-loop-pulse');
      });
    }

    if (prefersReducedMotion) {
      video.removeAttribute('autoplay');
      video.pause();
    } else {
      tryToPlay();
    }
  }
})();
