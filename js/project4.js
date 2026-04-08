// Project 4: top nav hide/show on scroll (same behavior as Home/About)
const projectTopNav = document.querySelector('.project4-header.topbar');
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

// Project 4: shared More Works logic
if (typeof window.initProjectMoreWorks === 'function') {
  window.initProjectMoreWorks({
    currentProjectId: 'project4',
    currentProjectCategory: 'coding',
    classPrefix: 'project4'
  });
}
