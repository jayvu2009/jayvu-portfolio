// About: Load-In Animation (run once)
const aboutLoadRoot = document.body;

if (aboutLoadRoot && aboutLoadRoot.classList.contains('about-load-anim')) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const startAboutLoadAnimation = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        aboutLoadRoot.classList.add('is-loaded');
        window.setTimeout(() => {
          aboutLoadRoot.classList.remove('about-load-anim');
        }, 2200);
      });
    });
  };

  if (prefersReducedMotion) {
    aboutLoadRoot.classList.add('is-loaded');
    aboutLoadRoot.classList.remove('about-load-anim');
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAboutLoadAnimation, { once: true });
  } else {
    startAboutLoadAnimation();
  }
}

// About slider: smooth infinite loop + synced arrows/dots/thumbs + stable autoplay
const aboutTrack = document.getElementById('about-slider-track');
const aboutViewport = document.querySelector('.about-slider-viewport');
const aboutPrev = document.querySelector('.about-prev');
const aboutNext = document.querySelector('.about-next');
const aboutDots = Array.from(document.querySelectorAll('.about-dot'));
const aboutThumbs = Array.from(document.querySelectorAll('.about-thumb'));

if (aboutTrack) {
  const baseSlides = Array.from(aboutTrack.children);
  const slideCount = baseSlides.length;
  const AUTO_DELAY_MS = 5200;

  const firstClone = baseSlides[0].cloneNode(true);
  const lastClone = baseSlides[slideCount - 1].cloneNode(true);
  aboutTrack.appendChild(firstClone);
  aboutTrack.insertBefore(lastClone, aboutTrack.firstChild);

  let currentIndex = 1; // Track index includes clones: [0..slideCount+1]
  let isAnimating = false;
  let autoTimer = null;

  function toRealIndex(trackIndex) {
    if (trackIndex === 0) return slideCount - 1;
    if (trackIndex === slideCount + 1) return 0;
    return trackIndex - 1;
  }

  function updateIndicators(realIndex = toRealIndex(currentIndex)) {
    aboutDots.forEach((dot, idx) => dot.classList.toggle('active', idx === realIndex));
    aboutThumbs.forEach((thumb, idx) => thumb.classList.toggle('active', idx === realIndex));
  }

  function setTrackPosition(animated = true) {
    aboutTrack.style.transition = animated ? 'transform 0.62s cubic-bezier(0.22, 0.61, 0.36, 1)' : 'none';
    aboutTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function goToTrackIndex(targetIndex) {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex = targetIndex;
    setTrackPosition(true);
    updateIndicators(toRealIndex(currentIndex));
  }

  function goToSlide(realIndex) {
    goToTrackIndex(realIndex + 1);
  }

  function stopAutoplay() {
    if (!autoTimer) return;
    window.clearInterval(autoTimer);
    autoTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    autoTimer = window.setInterval(() => {
      if (!isAnimating) goToTrackIndex(currentIndex + 1);
    }, AUTO_DELAY_MS);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  aboutTrack.addEventListener('transitionend', (event) => {
    if (event.propertyName !== 'transform') return;

    if (currentIndex === 0) {
      currentIndex = slideCount;
      setTrackPosition(false);
    } else if (currentIndex === slideCount + 1) {
      currentIndex = 1;
      setTrackPosition(false);
    }

    updateIndicators(toRealIndex(currentIndex));
    isAnimating = false;
  });

  if (aboutNext) {
    aboutNext.addEventListener('click', () => {
      goToTrackIndex(currentIndex + 1);
      restartAutoplay();
    });
  }

  if (aboutPrev) {
    aboutPrev.addEventListener('click', () => {
      goToTrackIndex(currentIndex - 1);
      restartAutoplay();
    });
  }

  aboutDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      restartAutoplay();
    });
  });

  aboutThumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      goToSlide(idx);
      restartAutoplay();
    });
  });

  if (aboutViewport) {
    aboutViewport.addEventListener('mouseenter', stopAutoplay);
    aboutViewport.addEventListener('mouseleave', startAutoplay);
  }

  setTrackPosition(false);
  updateIndicators();
  startAutoplay();
}

// About top nav: match Home behavior (show on load, hide on scroll down, show on scroll up)
const aboutTopNav = document.querySelector('.topbar');
let aboutLastScrollY = window.scrollY;
let aboutScrollTicking = false;

function updateAboutNavVisibility() {
  if (!aboutTopNav) {
    aboutScrollTicking = false;
    return;
  }

  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > aboutLastScrollY;
  const scrollingUp = currentScrollY < aboutLastScrollY;

  if (currentScrollY <= 10) {
    aboutTopNav.classList.add('nav-visible');
    aboutTopNav.classList.remove('nav-hidden');
    aboutLastScrollY = currentScrollY;
    aboutScrollTicking = false;
    return;
  }

  if (scrollingDown) {
    if (!aboutTopNav.classList.contains('nav-hidden')) {
      aboutTopNav.classList.add('nav-hidden');
      aboutTopNav.classList.remove('nav-visible');
    }
  } else if (scrollingUp) {
    if (!aboutTopNav.classList.contains('nav-visible')) {
      aboutTopNav.classList.add('nav-visible');
      aboutTopNav.classList.remove('nav-hidden');
    }
  }

  aboutLastScrollY = currentScrollY;
  aboutScrollTicking = false;
}

if (aboutTopNav) {
  aboutTopNav.classList.add('nav-visible');
  window.addEventListener('scroll', () => {
    if (aboutScrollTicking) return;
    aboutScrollTicking = true;
    window.requestAnimationFrame(updateAboutNavVisibility);
  }, { passive: true });
}
