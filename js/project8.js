const projectTopNav = document.querySelector('.project8-header.topbar');
const projectMenuToggle = document.getElementById('topbar-menu-toggle');
const projectMobilePanel = document.getElementById('topbar-mobile-panel');
let projectLastScrollY = window.scrollY;
let projectScrollTicking = false;

function closeProjectMobileMenu() {
  if (!projectTopNav || !projectMenuToggle) return;
  projectTopNav.classList.remove('is-open');
  projectMenuToggle.setAttribute('aria-expanded', 'false');
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
  if (Math.abs(delta) >= 6) {
    if (delta > 0 && currentScrollY > 80) {
      closeProjectMobileMenu();
      projectTopNav.classList.add('nav-hidden');
      projectTopNav.classList.remove('nav-visible');
    } else if (delta < 0) {
      projectTopNav.classList.add('nav-visible');
      projectTopNav.classList.remove('nav-hidden');
    }
    projectLastScrollY = currentScrollY;
  }
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
    } else {
      closeProjectMobileMenu();
    }
  });
}

if (projectTopNav && projectMenuToggle && projectMobilePanel) {
  projectMenuToggle.addEventListener('click', () => {
    const isOpen = projectTopNav.classList.toggle('is-open');
    projectMenuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  projectMobilePanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeProjectMobileMenu));
  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !projectTopNav.contains(event.target)) closeProjectMobileMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeProjectMobileMenu();
  });
}

if (typeof window.initProjectMoreWorks === 'function') {
  window.initProjectMoreWorks({ currentProjectId: 'project8', currentProjectCategory: 'uiux', classPrefix: 'project8' });
}

const project8Body = document.body;
if (project8Body?.classList.contains('project8-page')) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initProject8Reveal() {
    const elements = Array.from(document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right'));
    project8Body.classList.add('project8-reveal-ready');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    elements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 30, 180)}ms`);
      observer.observe(element);
    });
  }

  function startProject8Page() {
    project8Body.classList.add('project8-load-running');
    if (prefersReducedMotion) {
      project8Body.classList.add('is-loaded');
      project8Body.classList.remove('project8-load-running', 'project8-load-anim');
      initProject8Reveal();
      return;
    }
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => project8Body.classList.add('is-loaded')));
    window.setTimeout(() => {
      project8Body.classList.remove('project8-load-running', 'project8-load-anim');
      initProject8Reveal();
    }, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startProject8Page, { once: true });
  } else {
    startProject8Page();
  }
}
