// Project 1: top nav hide/show on scroll (same behavior as Home/About)
const projectTopNav = document.querySelector('.project1-header.topbar');
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

// Project 1: local More Works category dropdown + filter
const moreWorksToggle = document.getElementById('moreWorksToggle');
const moreWorksMenu = document.getElementById('moreWorksMenu');
const moreWorksCurrent = document.getElementById('moreWorksCurrent');
const moreWorksCards = Array.from(document.querySelectorAll('#moreWorksGrid .project1-more-card'));
const moreWorksOptions = Array.from(document.querySelectorAll('#moreWorksMenu button[data-category]'));

let activeMoreWorksCategory = 'design';

function applyMoreWorksFilter() {
  moreWorksCards.forEach((card) => {
    card.hidden = card.dataset.category !== activeMoreWorksCategory;
  });
}

function setMenuOpen(isOpen) {
  if (!moreWorksToggle || !moreWorksMenu) return;
  moreWorksMenu.hidden = !isOpen;
  moreWorksToggle.setAttribute('aria-expanded', String(isOpen));
}

if (moreWorksToggle && moreWorksMenu && moreWorksCurrent) {
  moreWorksToggle.addEventListener('click', () => {
    const isOpen = !moreWorksMenu.hidden;
    setMenuOpen(!isOpen);
  });

  moreWorksOptions.forEach((option) => {
    option.addEventListener('click', () => {
      activeMoreWorksCategory = option.dataset.category;
      moreWorksCurrent.textContent = option.textContent.trim();
      applyMoreWorksFilter();
      setMenuOpen(false);
    });
  });

  document.addEventListener('click', (event) => {
    if (moreWorksMenu.hidden) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (moreWorksToggle.contains(target) || moreWorksMenu.contains(target)) return;
    setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });
}

applyMoreWorksFilter();
