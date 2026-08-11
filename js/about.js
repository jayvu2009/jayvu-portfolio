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

// WHO'S JAY? photo stories: edit this array to update each title, description, or caption.
const aboutPolaroidSlides = [
  {
    image: 'assets/about/pic1.jpg',
    alt: 'Jay Vu taking a mirror selfie',
    width: 3024,
    height: 4032,
    orientation: 'portrait',
    rotation: '-3deg',
    title: "Hi, I'm Jay!",
    description: [
      "I'm a designer based in Canada who enjoys turning ideas into thoughtful visual experiences.",
      'I care about details, storytelling, and creating things that feel both useful and personal.'
    ],
    caption: 'just a random mirror selfie :)'
  },
  {
    image: 'assets/about/pic2.jpg',
    alt: 'Jay Vu exploring the city',
    width: 3024,
    height: 4032,
    orientation: 'portrait',
    rotation: '2.5deg',
    title: 'Curious by nature',
    description: [
      'I find inspiration in small details, new places, and the unexpected ideas that show up along the way.'
    ],
    caption: 'out looking for ideas'
  },
  {
    image: 'assets/about/pic3.JPEG',
    alt: 'Jay Vu sharing time with friends',
    width: 4320,
    height: 3240,
    orientation: 'landscape',
    rotation: '-2deg',
    title: 'People keep me inspired',
    description: [
      'Good conversations and shared moments remind me that the best creative work always has a human side.'
    ],
    caption: 'better together'
  },
  {
    image: 'assets/about/pic4.JPG',
    alt: 'Jay Vu spending time outdoors',
    width: 2048,
    height: 1638,
    orientation: 'landscape',
    rotation: '2deg',
    title: 'A little room to wander',
    description: [
      'Stepping away from the screen helps me reset, notice more, and return to a project with fresh eyes.'
    ],
    caption: 'taking the scenic route'
  },
  {
    image: 'assets/about/pic5.jpg',
    alt: 'Jay Vu in a scenic outdoor setting',
    width: 1328,
    height: 900,
    orientation: 'landscape',
    rotation: '-1.5deg',
    title: 'Always making something',
    description: [
      'Whether it is design, motion, or a new experiment, I am happiest when an idea starts becoming real.'
    ],
    caption: 'one idea at a time'
  }
];

const aboutPolaroidStage = document.getElementById('about-polaroid-stage');
const aboutPolaroidActive = document.getElementById('about-polaroid-active');
const aboutPolaroidImage = document.getElementById('about-polaroid-image');
const aboutPolaroidBackOne = document.getElementById('about-polaroid-back-one');
const aboutPolaroidBackTwo = document.getElementById('about-polaroid-back-two');
const aboutPolaroidCaption = document.getElementById('about-polaroid-caption');
const aboutPolaroidCounter = document.getElementById('about-polaroid-counter');
const aboutPolaroidTitle = document.getElementById('about-polaroid-title');
const aboutPolaroidCopy = document.getElementById('about-polaroid-copy');
const aboutPolaroidDots = Array.from(document.querySelectorAll('.about-polaroid-dot'));

if (aboutPolaroidStage && aboutPolaroidActive && aboutPolaroidImage) {
  let aboutPolaroidIndex = 0;
  let aboutPolaroidAnimationTimer = null;

  function setAboutPolaroidFrame(frame, image, slide) {
    frame.classList.toggle('about-polaroid--portrait', slide.orientation === 'portrait');
    frame.classList.toggle('about-polaroid--landscape', slide.orientation === 'landscape');
    image.src = slide.image;
    image.width = slide.width;
    image.height = slide.height;
  }

  function renderAboutPolaroid(index, animate = true) {
    const slide = aboutPolaroidSlides[index];
    const nextSlide = aboutPolaroidSlides[(index + 1) % aboutPolaroidSlides.length];
    const followingSlide = aboutPolaroidSlides[(index + 2) % aboutPolaroidSlides.length];

    aboutPolaroidIndex = index;
    aboutPolaroidStage.classList.toggle('about-polaroid-stage--portrait', slide.orientation === 'portrait');
    aboutPolaroidStage.classList.toggle('about-polaroid-stage--landscape', slide.orientation === 'landscape');
    setAboutPolaroidFrame(aboutPolaroidActive, aboutPolaroidImage, slide);
    setAboutPolaroidFrame(aboutPolaroidBackOne.parentElement, aboutPolaroidBackOne, nextSlide);
    setAboutPolaroidFrame(aboutPolaroidBackTwo.parentElement, aboutPolaroidBackTwo, followingSlide);

    aboutPolaroidActive.style.setProperty('--polaroid-rotation', slide.rotation);
    aboutPolaroidImage.alt = slide.alt;
    aboutPolaroidCaption.textContent = slide.caption;
    aboutPolaroidCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(aboutPolaroidSlides.length).padStart(2, '0')}`;
    aboutPolaroidTitle.textContent = slide.title;
    aboutPolaroidCopy.replaceChildren(...slide.description.map((text) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));

    aboutPolaroidDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle('active', isActive);
      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    if (animate) {
      window.clearTimeout(aboutPolaroidAnimationTimer);
      aboutPolaroidActive.classList.remove('is-shuffling');
      void aboutPolaroidActive.offsetWidth;
      aboutPolaroidActive.classList.add('is-shuffling');
      aboutPolaroidAnimationTimer = window.setTimeout(() => {
        aboutPolaroidActive.classList.remove('is-shuffling');
      }, 400);
    }
  }

  aboutPolaroidActive.addEventListener('click', () => {
    renderAboutPolaroid((aboutPolaroidIndex + 1) % aboutPolaroidSlides.length);
  });

  aboutPolaroidDots.forEach((dot, index) => {
    dot.addEventListener('click', () => renderAboutPolaroid(index));
  });

  aboutPolaroidSlides.forEach((slide) => {
    const image = new Image();
    image.src = slide.image;
  });

  renderAboutPolaroid(0, false);
}

// Shared two-step explanation for every About-page diamond.
const aboutDiamondTriggers = Array.from(document.querySelectorAll('.diamond-trigger'));
const aboutDiamondPrompt = document.getElementById('diamond-prompt');
const aboutDiamondPopover = document.getElementById('diamond-explanation-popover');
const aboutDiamondClose = aboutDiamondPopover?.querySelector('.diamond-popover-close');

if (aboutDiamondTriggers.length && aboutDiamondPrompt && aboutDiamondPopover && aboutDiamondClose) {
  const aboutDiamondHoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  let activeDiamondTrigger = null;
  let diamondPromptHideTimer = null;
  let suppressDiamondFocusPrompt = false;
  const diamondVisibilityTimers = new WeakMap();

  function getDiamondMinimumTop() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return 12;

    const topbarRect = topbar.getBoundingClientRect();
    if (topbarRect.bottom <= 0 || topbarRect.top >= window.innerHeight) return 12;
    return Math.max(12, topbarRect.bottom + 8);
  }

  function positionDiamondFloatingElement(element, trigger, gap = 10) {
    const viewportInset = 12;
    const triggerRect = trigger.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const minimumTop = getDiamondMinimumTop();
    const maximumLeft = Math.max(viewportInset, window.innerWidth - elementRect.width - viewportInset);
    const preferredLeft = triggerRect.right - elementRect.width;
    const left = Math.min(Math.max(preferredLeft, viewportInset), maximumLeft);
    const belowTop = triggerRect.bottom + gap;
    const aboveTop = triggerRect.top - elementRect.height - gap;
    const canOpenAbove = aboveTop >= minimumTop;
    const opensAbove = belowTop + elementRect.height > window.innerHeight - viewportInset && canOpenAbove;
    const maximumTop = Math.max(minimumTop, window.innerHeight - elementRect.height - viewportInset);
    const preferredTop = opensAbove ? aboveTop : belowTop;
    const top = Math.min(Math.max(preferredTop, minimumTop), maximumTop);
    const pointerLeft = Math.min(Math.max(triggerRect.left + (triggerRect.width / 2) - left, 20), elementRect.width - 20);

    element.style.left = `${Math.round(left)}px`;
    element.style.top = `${Math.round(top)}px`;
    element.style.setProperty('--diamond-pointer-left', `${Math.round(pointerLeft)}px`);
    element.classList.toggle('opens-above', opensAbove);
  }

  function revealDiamondElement(element, trigger) {
    window.clearTimeout(diamondVisibilityTimers.get(element));
    element.hidden = false;
    positionDiamondFloatingElement(element, trigger);
    window.requestAnimationFrame(() => element.classList.add('is-visible'));
  }

  function concealDiamondElement(element) {
    element.classList.remove('is-visible');
    window.clearTimeout(diamondVisibilityTimers.get(element));
    const visibilityTimer = window.setTimeout(() => {
      if (!element.classList.contains('is-visible')) element.hidden = true;
    }, 230);
    diamondVisibilityTimers.set(element, visibilityTimer);
  }

  function cancelDiamondPromptHide() {
    window.clearTimeout(diamondPromptHideTimer);
    diamondPromptHideTimer = null;
  }

  function hideDiamondPrompt() {
    cancelDiamondPromptHide();
    concealDiamondElement(aboutDiamondPrompt);
  }

  function scheduleDiamondPromptHide() {
    if (!aboutDiamondHoverQuery.matches || !aboutDiamondPopover.hidden) return;
    cancelDiamondPromptHide();
    diamondPromptHideTimer = window.setTimeout(hideDiamondPrompt, 180);
  }

  function showDiamondPrompt(trigger) {
    if (!aboutDiamondPopover.hidden) return;
    cancelDiamondPromptHide();
    activeDiamondTrigger = trigger;
    revealDiamondElement(aboutDiamondPrompt, trigger);
  }

  function openDiamondPopover(trigger = activeDiamondTrigger) {
    if (!trigger) return;
    activeDiamondTrigger = trigger;
    hideDiamondPrompt();
    aboutDiamondTriggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', String(trigger === activeDiamondTrigger));
    });
    revealDiamondElement(aboutDiamondPopover, activeDiamondTrigger);
    aboutDiamondClose.focus({ preventScroll: true });
  }

  function restoreDiamondTriggerFocus(trigger) {
    if (!trigger) return;
    suppressDiamondFocusPrompt = true;
    trigger.focus({ preventScroll: true });
    window.requestAnimationFrame(() => {
      suppressDiamondFocusPrompt = false;
    });
  }

  function closeDiamondPopover(restoreFocus = false) {
    if (aboutDiamondPopover.hidden) return;
    concealDiamondElement(aboutDiamondPopover);
    aboutDiamondTriggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    const triggerToRestore = activeDiamondTrigger;
    activeDiamondTrigger = null;
    if (restoreFocus) restoreDiamondTriggerFocus(triggerToRestore);
  }

  aboutDiamondTriggers.forEach((trigger) => {
    trigger.addEventListener('pointerenter', () => {
      if (aboutDiamondHoverQuery.matches) showDiamondPrompt(trigger);
    });

    trigger.addEventListener('pointerleave', scheduleDiamondPromptHide);
    trigger.addEventListener('focus', () => {
      if (!suppressDiamondFocusPrompt) showDiamondPrompt(trigger);
    });
    trigger.addEventListener('blur', scheduleDiamondPromptHide);
    trigger.addEventListener('click', () => openDiamondPopover(trigger));
  });

  aboutDiamondClose.addEventListener('click', () => closeDiamondPopover(true));

  document.addEventListener('pointerdown', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    if (!aboutDiamondPopover.hidden) {
      if (aboutDiamondPopover.contains(target) || activeDiamondTrigger?.contains(target)) return;
      closeDiamondPopover();
      return;
    }

    if (!aboutDiamondPrompt.hidden && !aboutDiamondPrompt.contains(target) && !activeDiamondTrigger?.contains(target)) {
      hideDiamondPrompt();
      activeDiamondTrigger = null;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    if (!aboutDiamondPopover.hidden) {
      closeDiamondPopover(true);
    } else if (!aboutDiamondPrompt.hidden) {
      const triggerToRestore = activeDiamondTrigger;
      hideDiamondPrompt();
      activeDiamondTrigger = null;
      restoreDiamondTriggerFocus(triggerToRestore);
    }
  });

  function repositionDiamondExplanation() {
    if (!activeDiamondTrigger) return;
    if (!aboutDiamondPopover.hidden) {
      positionDiamondFloatingElement(aboutDiamondPopover, activeDiamondTrigger);
    } else if (!aboutDiamondPrompt.hidden) {
      positionDiamondFloatingElement(aboutDiamondPrompt, activeDiamondTrigger);
    }
  }

  window.addEventListener('resize', repositionDiamondExplanation);
  window.addEventListener('scroll', repositionDiamondExplanation, { passive: true });
}

// About top nav: match Home behavior (show on load, hide on scroll down, show on scroll up)
const aboutTopNav = document.querySelector('.topbar');
const aboutMenuToggle = document.getElementById('topbar-menu-toggle');
const aboutMobilePanel = document.getElementById('topbar-mobile-panel');
const aboutDesktopNavLinks = Array.from(document.querySelectorAll('.topbar-links .section-btn'));
const aboutMobileNavLinks = Array.from(document.querySelectorAll('.topbar-mobile-panel .topbar-mobile-link'));
let aboutLastScrollY = window.scrollY;
let aboutScrollTicking = false;

function syncAboutActiveNavigation() {
  const useMobileNavigation = window.innerWidth <= 1024;

  [...aboutDesktopNavLinks, ...aboutMobileNavLinks].forEach((link) => {
    const isMobileLink = aboutMobilePanel?.contains(link) ?? false;
    const isAboutLink = new URL(link.href, window.location.href).pathname.endsWith('/about.html');
    const isVisibleNavigation = useMobileNavigation ? isMobileLink : !isMobileLink;
    const isActive = isVisibleNavigation && isAboutLink;

    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function closeAboutMobileMenu() {
  if (!aboutTopNav || !aboutMenuToggle) return;
  aboutTopNav.classList.remove('is-open');
  aboutMenuToggle.setAttribute('aria-expanded', 'false');
}

function openAboutMobileMenu() {
  if (!aboutTopNav || !aboutMenuToggle) return;
  aboutTopNav.classList.add('is-open');
  aboutMenuToggle.setAttribute('aria-expanded', 'true');
}

function updateAboutNavVisibility() {
  if (!aboutTopNav) {
    aboutScrollTicking = false;
    return;
  }

  // Match homepage behavior: mobile/tablet nav stays anchored and visible.
  if (window.innerWidth <= 1024) {
    aboutTopNav.classList.add('nav-visible');
    aboutTopNav.classList.remove('nav-hidden');
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
      closeAboutMobileMenu();
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
  syncAboutActiveNavigation();

  window.addEventListener('scroll', () => {
    if (aboutScrollTicking) return;
    aboutScrollTicking = true;
    window.requestAnimationFrame(updateAboutNavVisibility);
  }, { passive: true });

  window.addEventListener('resize', () => {
    syncAboutActiveNavigation();

    if (window.innerWidth <= 1024) {
      aboutTopNav.classList.add('nav-visible');
      aboutTopNav.classList.remove('nav-hidden');
      return;
    }
    closeAboutMobileMenu();
  });
}

if (aboutTopNav && aboutMenuToggle && aboutMobilePanel) {
  aboutMenuToggle.addEventListener('click', () => {
    const isOpen = aboutTopNav.classList.contains('is-open');
    if (isOpen) {
      closeAboutMobileMenu();
    } else {
      openAboutMobileMenu();
    }
  });

  aboutMobilePanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeAboutMobileMenu();
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!aboutTopNav.contains(target)) {
      closeAboutMobileMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAboutMobileMenu();
    }
  });
}
