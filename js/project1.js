// Project 1: top nav hide/show on scroll (same behavior as Home/About)
const projectTopNav = document.querySelector('.project1-header.topbar');
const projectMenuToggle = document.getElementById('topbar-menu-toggle');
const projectMobilePanel = document.getElementById('topbar-mobile-panel');
let projectLastScrollY = window.scrollY;
let projectScrollTicking = false;

function closeProjectMobileMenu() {
  if (!projectTopNav || !projectMenuToggle) return;
  projectTopNav.classList.remove('is-open');
  projectMenuToggle.setAttribute('aria-expanded', 'false');
}

function openProjectMobileMenu() {
  if (!projectTopNav || !projectMenuToggle) return;
  projectTopNav.classList.add('is-open');
  projectMenuToggle.setAttribute('aria-expanded', 'true');
}

function updateProjectNavVisibility() {
  if (!projectTopNav) {
    projectScrollTicking = false;
    return;
  }

  if (window.innerWidth <= 1024) {
    projectTopNav.classList.add('nav-visible');
    projectTopNav.classList.remove('nav-hidden');
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
    closeProjectMobileMenu();
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

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 1024) {
      projectTopNav.classList.add('nav-visible');
      projectTopNav.classList.remove('nav-hidden');
      return;
    }
    closeProjectMobileMenu();
  });
}

if (projectTopNav && projectMenuToggle && projectMobilePanel) {
  projectMenuToggle.addEventListener('click', () => {
    const isOpen = projectTopNav.classList.contains('is-open');
    if (isOpen) {
      closeProjectMobileMenu();
    } else {
      openProjectMobileMenu();
    }
  });

  projectMobilePanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeProjectMobileMenu();
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!projectTopNav.contains(target)) {
      closeProjectMobileMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeProjectMobileMenu();
    }
  });
}

// Project 1: shared More Works logic
if (typeof window.initProjectMoreWorks === 'function') {
  window.initProjectMoreWorks({
    currentProjectId: 'project1',
    currentProjectCategory: 'design',
    classPrefix: 'project1'
  });
}

// Project 1: initial load animation + hybrid scroll reveal animation
const project1Body = document.body;

if (project1Body && project1Body.classList.contains('project1-page')) {
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

    const tagResearchRows = () => {
      const rows = Array.from(document.querySelectorAll('.project1-research h3, .project1-research p'));
      rows.forEach((row, index) => {
        row.classList.add('reveal-up', 'reveal-once');
        registerRevealElement(row, Math.min(index * 70, 560));
      });
    };

    const tagFinalOutcomeItems = () => {
      const figures = Array.from(document.querySelectorAll('.project1-final-grid figure'));
      figures.forEach((figure, index) => {
        figure.classList.add('reveal-up', 'reveal-replay');
        registerRevealElement(figure, 70 + index * 75);
      });
    };

    const tagMoreWorksCards = () => {
      const cards = Array.from(document.querySelectorAll('#moreWorksGrid .project1-more-card'));
      cards.forEach((card, index) => {
        card.classList.add('reveal-up', 'reveal-replay');
        registerRevealElement(card, 80 + index * 85);
      });
    };

    project1Body.classList.add('project1-reveal-ready');

    const baseRevealElements = Array.from(document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right'));
    baseRevealElements.forEach((element) => {
      const delay = Number(element.dataset.revealDelay || 0);
      if (!element.classList.contains('reveal-once') && !element.classList.contains('reveal-replay')) {
        element.classList.add('reveal-once');
      }
      registerRevealElement(element, delay);
    });

    tagResearchRows();
    tagFinalOutcomeItems();
    tagMoreWorksCards();

    const moreWorksGrid = document.getElementById('moreWorksGrid');
    if (moreWorksGrid) {
      const moreWorksObserver = new MutationObserver(() => {
        tagMoreWorksCards();
      });
      moreWorksObserver.observe(moreWorksGrid, { childList: true });
    }
  };

  const startProject1Animations = () => {
    prepareLoadElements();
    project1Body.classList.add('project1-load-running');

    if (prefersReducedMotion) {
      project1Body.classList.add('is-loaded');
      project1Body.classList.remove('project1-load-running');
      project1Body.classList.remove('project1-load-anim');
      initScrollReveal();
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        project1Body.classList.add('is-loaded');
      });
    });

    window.setTimeout(() => {
      project1Body.classList.remove('project1-load-running');
      project1Body.classList.remove('project1-load-anim');
      initScrollReveal();
    }, 980);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startProject1Animations, { once: true });
  } else {
    startProject1Animations();
  }
}
