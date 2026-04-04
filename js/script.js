// typewriter
const roles = ['UX/UI Designer', 'Front-end Developer', 'Branding Designer'];
const typeEl = document.getElementById('typewriter');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!typeEl) return;

  const current = roles[roleIndex];
  typeEl.textContent = current.slice(0, charIndex);

  if (!isDeleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(typeLoop, 120);
    return;
  }

  if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1250);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 75);
    return;
  }

  isDeleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeLoop, 240);
}

if (typeEl) typeLoop();

// lightweight smooth-scroll for in-page links
document.querySelectorAll('.js-scroll-link, .section-btn[data-section]').forEach(link => {
  link.addEventListener('click', (event) => {
    const hrefTarget = link.getAttribute('href');
    const dataTarget = link.dataset.section ? `#${link.dataset.section}` : '';
    const targetSelector = (hrefTarget && hrefTarget.startsWith('#')) ? hrefTarget : dataTarget;

    if (!targetSelector) return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// project card filter
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    const firstVisible = Array.from(projectCards).find(c => c.style.display === 'block');
    if (firstVisible) firstVisible.scrollIntoView({ behavior:'smooth', inline:'start' });
  });
});

// nested card image slider
document.querySelectorAll('.project-card').forEach(card => {
  const images = card.querySelectorAll('.slide-img');
  let activeIndex = 0;

  const prev = card.querySelector('.img-nav.prev');
  const next = card.querySelector('.img-nav.next');

  if (!images.length || !prev || !next) return;

  function updateImage() {
    images.forEach((img, i) => img.classList.toggle('active', i === activeIndex));
  }

  prev.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + images.length) % images.length;
    updateImage();
  });
  next.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % images.length;
    updateImage();
  });
});

// top navigation hide/show on scroll direction
const topNav = document.querySelector('.topbar');
let lastScrollY = window.scrollY;
let scrollTicking = false;

function updateNavVisibility() {
  if (!topNav) return;

  const currentScrollY = window.scrollY;
  const delta = currentScrollY - lastScrollY;

  if (Math.abs(delta) < 6) {
    scrollTicking = false;
    return;
  }

  if (delta > 0 && currentScrollY > 80) {
    if (!topNav.classList.contains('nav-hidden')) {
      topNav.classList.add('nav-hidden');
      topNav.classList.remove('nav-visible');
    }
  } else if (delta < 0) {
    if (!topNav.classList.contains('nav-visible')) {
      topNav.classList.add('nav-visible');
      topNav.classList.remove('nav-hidden');
    }
  }

  lastScrollY = currentScrollY;
  scrollTicking = false;
}

if (topNav) {
  topNav.classList.add('nav-visible');
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateNavVisibility);
  }, { passive: true });
}
