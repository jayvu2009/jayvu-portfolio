// =========================
// Home: Typewriter
// =========================
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

// =========================
// Global: Smooth Scroll Links
// =========================
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

// =========================
// Work: Filters + Carousel + Slideshow
// =========================
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
  const isProject4Card = card.dataset.project === 'project4';
  const images = Array.from(card.querySelectorAll('.slide-img'));
  if (images.length < 2) return;

  if (isProject4Card) return;

  let imageIndex = 0;
  window.setInterval(() => {
    images[imageIndex].classList.remove('active');
    imageIndex = (imageIndex + 1) % images.length;
    images[imageIndex].classList.add('active');
  }, 5000);
});

// =========================
// Work: Project 4 Card Slider (auto + pause)
// =========================
const project4Card = document.querySelector('#work-carousel-stage .project-card[data-project="project4"]');

if (project4Card) {
  const project4Images = Array.from(project4Card.querySelectorAll('.slide-img'));
  const imageWrap = project4Card.querySelector('.project-image-wrap');
  const projectLink = project4Card.querySelector('.btn-outline');

  if (project4Images.length > 1 && imageWrap) {
    let project4Index = 0;
    let project4Timer = null;
    let resumeTimer = null;

    const showProject4Slide = (nextIndex) => {
      project4Images[project4Index].classList.remove('active');
      project4Index = (nextIndex + project4Images.length) % project4Images.length;
      project4Images[project4Index].classList.add('active');
    };

    const goNextProject4Slide = () => showProject4Slide(project4Index + 1);

    const clearProject4Timers = () => {
      if (project4Timer) {
        window.clearInterval(project4Timer);
        project4Timer = null;
      }
      if (resumeTimer) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    };

    const startProject4AutoSlide = () => {
      clearProject4Timers();
      project4Timer = window.setInterval(goNextProject4Slide, 3800);
    };

    const pauseProject4AutoSlide = (resumeDelay = 4200) => {
      clearProject4Timers();
      resumeTimer = window.setTimeout(startProject4AutoSlide, resumeDelay);
    };

    imageWrap.addEventListener('mouseenter', () => {
      clearProject4Timers();
    });

    imageWrap.addEventListener('mouseleave', () => {
      startProject4AutoSlide();
    });

    imageWrap.addEventListener('click', () => {
      goNextProject4Slide();
      pauseProject4AutoSlide(4200);
    });

    if (projectLink) {
      projectLink.addEventListener('click', () => {
        pauseProject4AutoSlide(4200);
      });
    }

    startProject4AutoSlide();
  }
}

if (allWorkCards.length) {
  applyFilters();
}

// =========================
// Top Nav: Hide/Show on Scroll Direction
// =========================
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

// =========================
// Contact: Mailto Form + Validation
// =========================
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const companyInput = document.getElementById('contact-company');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const descriptionInput = document.getElementById('contact-description');

    if (!nameInput || !companyInput || !emailInput || !phoneInput || !descriptionInput) return;

    const requiredFields = [nameInput, emailInput, phoneInput, descriptionInput];
    const firstMissing = requiredFields.find((field) => !field.value.trim());
    if (firstMissing) {
      if (contactMessage) contactMessage.textContent = 'Please complete all required fields.';
      firstMissing.focus();
      return;
    }

    if (!emailInput.checkValidity()) {
      if (contactMessage) contactMessage.textContent = 'Please enter a valid email address.';
      emailInput.focus();
      return;
    }

    if (contactMessage) contactMessage.textContent = '';

    const bodyText = [
      `Name: ${nameInput.value.trim()}`,
      `Company: ${companyInput.value.trim()}`,
      `Email address: ${emailInput.value.trim()}`,
      `Phone number: ${phoneInput.value.trim()}`,
      `Description of work: ${descriptionInput.value.trim()}`
    ].join('\n');

    const mailtoUrl = `mailto:jayvu209@gmail.com?subject=${encodeURIComponent('Project Inquiry')}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoUrl;
  });
}
