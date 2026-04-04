// typewriter
const roles = ['Front-end Developer', 'UI/UX Designer', 'Branding Designer'];
const typeEl = document.getElementById('typewriter');
let roleIndex = 0;
let chr = 0;
let isDeleting = false;
let loopDelay = 180;

function typeLoop() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typeEl.textContent = current.substring(0, chr - 1);
    chr--;
  } else {
    typeEl.textContent = current.substring(0, chr + 1);
    chr++;
  }

  if (!isDeleting && chr === current.length) {
    setTimeout(() => { isDeleting = true; typeLoop(); }, 1000);
    return;
  }

  if (isDeleting && chr === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeLoop, isDeleting ? 80 : 140);
}
if (typeEl) typeLoop();

// section nav state and scroll
const sectionButtons = document.querySelectorAll('.section-btn');
const sections = document.querySelectorAll('.page-section');
const contentPanel = document.getElementById('main-content');

function setActiveSection(name) {
  sectionButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.section === name));
}

sectionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.section);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if (contentPanel) {
  contentPanel.addEventListener('scroll', () => {
    let top = contentPanel.scrollTop + 120;
    sections.forEach(sec => {
      if (top >= sec.offsetTop && top < sec.offsetTop + sec.offsetHeight) {
        setActiveSection(sec.id);
      }
    });
  });
}

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
