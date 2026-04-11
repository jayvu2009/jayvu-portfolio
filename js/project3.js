// Project 3: top nav hide/show on scroll (same behavior as Home/About)
const projectTopNav = document.querySelector('.project3-header.topbar');
let projectLastScrollY = window.scrollY;
let projectScrollTicking = false;

function updateProjectNavVisibility() {
  if (!projectTopNav) {
    projectScrollTicking = false;
    return;
  }

  const currentScrollY = window.scrollY;
  const delta = currentScrollY - projectLastScrollY;

  if (Math.abs(delta) < 6) {
    projectScrollTicking = false;
    return;
  }

  if (delta > 0 && currentScrollY > 80) {
    projectTopNav.classList.add('nav-hidden');
    projectTopNav.classList.remove('nav-visible');
  } else if (delta < 0) {
    projectTopNav.classList.add('nav-visible');
    projectTopNav.classList.remove('nav-hidden');
  }

  projectLastScrollY = currentScrollY;
  projectScrollTicking = false;
}

if (projectTopNav) {
  projectTopNav.classList.add('nav-visible');
  window.addEventListener('scroll', () => {
    if (projectScrollTicking) return;
    projectScrollTicking = true;
    window.requestAnimationFrame(updateProjectNavVisibility);
  }, { passive: true });
}

// Project 3: shared More Works logic
if (typeof window.initProjectMoreWorks === 'function') {
  window.initProjectMoreWorks({
    currentProjectId: 'project3',
    currentProjectCategory: 'design',
    classPrefix: 'project3'
  });
}

// Project 3: initial load animation + hybrid scroll reveal animation
const project3Body = document.body;

if (project3Body && project3Body.classList.contains('project3-page')) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const REVEAL_THRESHOLD = 0.16;
  const REVEAL_ROOT_MARGIN = '0px 0px -8% 0px';

  const prepareLoadElements = () => {
    const loadElements = Array.from(document.querySelectorAll('.load-from-top, .load-from-left, .load-from-right, .load-fade-up'));
    loadElements.forEach((element) => {
      const delay = Number(element.dataset.loadDelay || 0);
      element.style.setProperty('--load-delay', `${delay}ms`);
    });
  };

  const initScrollReveal = () => {
    const revealOnceObserver = prefersReducedMotion ? null : new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: REVEAL_THRESHOLD,
        rootMargin: REVEAL_ROOT_MARGIN
      }
    );

    const revealReplayObserver = prefersReducedMotion ? null : new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: REVEAL_THRESHOLD,
        rootMargin: REVEAL_ROOT_MARGIN
      }
    );

    const registerRevealElement = (element, delayMs = 0) => {
      if (!(element instanceof HTMLElement)) return;
      if (!element.classList.contains('reveal-up') && !element.classList.contains('reveal-left') && !element.classList.contains('reveal-right')) return;
      if (element.dataset.revealBound === 'true') return;

      element.dataset.revealBound = 'true';
      element.style.setProperty('--reveal-delay', `${delayMs}ms`);

      if (prefersReducedMotion) {
        element.classList.add('is-visible');
        return;
      }

      const isReplay = element.classList.contains('reveal-replay');
      if (isReplay) {
        revealReplayObserver.observe(element);
      } else {
        revealOnceObserver.observe(element);
      }
    };

    const tagVisualGroups = () => {
      const visualFigures = Array.from(document.querySelectorAll('.project3-visual-layout figure'));
      visualFigures.forEach((figure, index) => {
        figure.classList.add('reveal-up', 'reveal-replay');
        registerRevealElement(figure, 70 + index * 70);
      });

      const logoFigures = Array.from(document.querySelectorAll('.project3-logo-grid figure'));
      logoFigures.forEach((figure, index) => {
        figure.classList.add('reveal-up', 'reveal-replay');
        registerRevealElement(figure, 80 + index * 80);
      });

      const brandFigures = Array.from(document.querySelectorAll('.project3-brand-grid figure'));
      brandFigures.forEach((figure, index) => {
        figure.classList.add('reveal-up', 'reveal-replay');
        registerRevealElement(figure, 80 + index * 80);
      });

      const finalFigures = Array.from(document.querySelectorAll('.project3-final-layout figure'));
      finalFigures.forEach((figure, index) => {
        figure.classList.add('reveal-up', 'reveal-replay');
        registerRevealElement(figure, 90 + index * 70);
      });
    };

    const tagSectionText = () => {
      const softTextBlocks = Array.from(document.querySelectorAll('.project3-section-lead, .project3-final-layout article p, .project3-reflection p'));
      softTextBlocks.forEach((block, index) => {
        block.classList.add('reveal-up', 'reveal-once');
        registerRevealElement(block, Math.min(80 + index * 45, 520));
      });
    };

    const tagMoreWorksCards = () => {
      const cards = Array.from(document.querySelectorAll('#moreWorksGrid .project3-more-card'));
      cards.forEach((card, cardIndex) => {
        // Keep carousel/layout transforms untouched on structural card nodes.
        card.classList.remove('reveal-up', 'reveal-left', 'reveal-right', 'reveal-once', 'reveal-replay', 'is-visible');
        delete card.dataset.revealBound;

        const safeInnerTargets = [
          card.querySelector('.project3-more-image'),
          card.querySelector('h3'),
          card.querySelector('p'),
          card.querySelector('.tag-row'),
          card.querySelector('.btn-outline')
        ].filter((element) => element instanceof HTMLElement);

        safeInnerTargets.forEach((element, innerIndex) => {
          element.classList.add('reveal-up', 'reveal-replay');
          registerRevealElement(element, 70 + cardIndex * 85 + innerIndex * 45);
        });
      });
    };

    project3Body.classList.add('project3-reveal-ready');

    const baseRevealElements = Array.from(document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right'));
    baseRevealElements.forEach((element) => {
      const delay = Number(element.dataset.revealDelay || 0);
      if (!element.classList.contains('reveal-once') && !element.classList.contains('reveal-replay')) {
        element.classList.add('reveal-once');
      }
      registerRevealElement(element, delay);
    });

    tagVisualGroups();
    tagSectionText();
    tagMoreWorksCards();

    const moreWorksGrid = document.getElementById('moreWorksGrid');
    if (moreWorksGrid) {
      const moreWorksObserver = new MutationObserver(() => {
        tagMoreWorksCards();
      });
      moreWorksObserver.observe(moreWorksGrid, { childList: true });
    }
  };

  const startProject3Animations = () => {
    prepareLoadElements();
    project3Body.classList.add('project3-load-running');

    if (prefersReducedMotion) {
      project3Body.classList.add('is-loaded');
      project3Body.classList.remove('project3-load-running');
      project3Body.classList.remove('project3-load-anim');
      initScrollReveal();
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        project3Body.classList.add('is-loaded');
      });
    });

    window.setTimeout(() => {
      project3Body.classList.remove('project3-load-running');
      project3Body.classList.remove('project3-load-anim');
      initScrollReveal();
    }, 980);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startProject3Animations, { once: true });
  } else {
    startProject3Animations();
  }
}
