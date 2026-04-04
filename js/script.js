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

// work section: category filters, tool filters, centered carousel, and auto slideshow
const workRoot = document.getElementById('works');
const filterButtons = Array.from(document.querySelectorAll('.work-filter-row .filter-btn'));
const allWorkCards = Array.from(document.querySelectorAll('#work-carousel-stage .project-card'));
const toolTags = Array.from(document.querySelectorAll('.tool-tag'));
const carouselPrev = document.querySelector('.carousel-arrow.prev');
const carouselNext = document.querySelector('.carousel-arrow.next');

let activeCategory = 'all';
let activeTool = null;
let filteredCards = [...allWorkCards];
let activeIndex = 0;

function normalizeTool(tool) {
  return tool.trim().toLowerCase();
}

function getCardTools(card) {
  return (card.dataset.tools || '')
    .split(',')
    .map(normalizeTool)
    .filter(Boolean);
}

function applyFilters() {
  filteredCards = allWorkCards.filter((card) => {
    const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
    const toolMatch = !activeTool || getCardTools(card).includes(normalizeTool(activeTool));
    return categoryMatch && toolMatch;
  });

  activeIndex = 0;
  renderCarousel();
}

function renderCarousel() {
  allWorkCards.forEach((card) => {
    card.classList.remove('is-left', 'is-center', 'is-right', 'is-hidden');
    card.classList.add('is-hidden');
  });

  if (!filteredCards.length) {
    return;
  }

  if (filteredCards.length === 1) {
    filteredCards[0].classList.remove('is-hidden');
    filteredCards[0].classList.add('is-center');
    return;
  }

  const centerCard = filteredCards[activeIndex];
  const leftCard = filteredCards[(activeIndex - 1 + filteredCards.length) % filteredCards.length];
  const rightCard = filteredCards[(activeIndex + 1) % filteredCards.length];

  centerCard.classList.remove('is-hidden');
  centerCard.classList.add('is-center');

  if (filteredCards.length === 2) {
    rightCard.classList.remove('is-hidden');
    rightCard.classList.add('is-right');
    return;
  }

  leftCard.classList.remove('is-hidden');
  leftCard.classList.add('is-left');
  rightCard.classList.remove('is-hidden');
  rightCard.classList.add('is-right');
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    activeCategory = btn.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});

toolTags.forEach((tag) => {
  tag.addEventListener('click', () => {
    const selectedTool = tag.dataset.tool;
    activeTool = activeTool === selectedTool ? null : selectedTool;

    toolTags.forEach((item) => {
      item.classList.toggle('active', item.dataset.tool === activeTool);
    });

    applyFilters();
    if (workRoot) {
      workRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

if (carouselPrev) {
  carouselPrev.addEventListener('click', () => {
    if (!filteredCards.length) return;
    activeIndex = (activeIndex - 1 + filteredCards.length) % filteredCards.length;
    renderCarousel();
  });
}

if (carouselNext) {
  carouselNext.addEventListener('click', () => {
    if (!filteredCards.length) return;
    activeIndex = (activeIndex + 1) % filteredCards.length;
    renderCarousel();
  });
}

allWorkCards.forEach((card) => {
  const images = Array.from(card.querySelectorAll('.slide-img'));
  if (images.length < 2) return;

  let imageIndex = 0;
  window.setInterval(() => {
    images[imageIndex].classList.remove('active');
    imageIndex = (imageIndex + 1) % images.length;
    images[imageIndex].classList.add('active');
  }, 5000);
});

if (allWorkCards.length) {
  applyFilters();
}

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
