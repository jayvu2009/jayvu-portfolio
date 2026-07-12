// Project Detail: Shared More Works data + renderer (static 1-2, carousel 3+)
(() => {
  const CATEGORY_LABELS = {
    design: 'DESIGN',
    coding: 'CODING',
    uiux: 'UI/UX',
    motion: 'MOTION'
  };

  const PROJECTS = [
    {
      id: 'project1',
      category: 'design',
      title: "Re-branding Nonna’s Thread",
      description: 'Nonna’s Thread is a branding project focused on creating hand-made pasta by Canada wheat, and using fabric bag for the sustainability which is the core brand values.',
      tools: ['Illustrator', 'Procreate', 'InDesign'],
      images: ['assets/home/project card/project-card-1(1).png', 'assets/home/project card/project-card-1(2).png'],
      link: 'project1.html'
    },
    {
      id: 'project2',
      category: 'design',
      title: 'Packaging Vintage Jungle',
      description: 'Vintage Jungle is a fictional chocolate branding project that combines nostalgic jungle-inspired visuals with bold packaging, focusing on storytelling and strong shelf presence as its core values.',
      tools: ['Illustrator', 'Procreate'],
      images: ['assets/home/project card/project-card-2(1).png', 'assets/home/project card/project-card-2(2).png'],
      link: 'project2.html'
    },
    {
      id: 'project3',
      category: 'design',
      title: 'Packaging Aura Tint',
      description: 'Aura Tint is a lipstick branding project centered on unconventional shades, encouraging individuality and self-expression through a visual identity that balances softness and confidence as its core brand values.',
      tools: ['Illustrator', 'Photoshop', 'After Effects'],
      images: ['assets/home/project card/project-card-3(1).png', 'assets/home/project card/project-card-3(2).png'],
      link: 'project3.html'
    },
    {
      id: 'project4',
      category: 'coding',
      title: 'Zestli – Meal Delivery Website',
      description: 'Zestli is a responsive meal delivery website developed using HTML, Tailwind CSS, and JavaScript. The project focuses on clean layout structure, accessibility, and creating a smooth, intuitive user experience for browsing and ordering meals.',
      tools: ['HTML', 'Tailwind', 'JavaScript'],
      images: ['assets/project4/image1.png', 'assets/project4/image6.png'],
      link: 'project4.html'
    },
    {
      id: 'project5',
      category: 'coding',
      title: 'Love is Love',
      description: 'An interactive awareness website promoting LGBTQ+ acceptance through storytelling, educational content, and calls to action.',
      tools: ['HTML', 'CSS', 'JavaScript'],
      images: ['assets/project5/image1.png'],
      link: 'project5.html'
    },
    {
      id: 'project6',
      category: 'motion',
      title: 'Paris in the Rain',
      description: "A lyric-based motion graphics project inspired by Lauv's Paris in the Rain, combining hand-drawn illustrations, kinetic typography, and cinematic transitions to visually tell the emotional journey of the song.",
      tools: ['After Effects', 'Premiere Pro', 'Illustrator'],
      images: ['assets/project6/image1.png'],
      link: 'project6.html'
    },
  ];

  const IMAGE_DIMENSIONS = {
    'assets/home/project card/project-card-1(1).png': { width: 535, height: 350 },
    'assets/home/project card/project-card-1(2).png': { width: 535, height: 350 },
    'assets/home/project card/project-card-2(1).png': { width: 535, height: 398 },
    'assets/home/project card/project-card-2(2).png': { width: 535, height: 401 },
    'assets/home/project card/project-card-3(1).png': { width: 535, height: 350 },
    'assets/home/project card/project-card-3(2).png': { width: 535, height: 350 },
    'assets/project4/image1.png': { width: 1727, height: 1132 },
    'assets/project4/image6.png': { width: 1729, height: 1279 },
    'assets/project5/image1.png': { width: 2624, height: 1542 },
    'assets/project6/image1.png': { width: 1162, height: 654 }
  };

  function categoryLabel(category) {
    return CATEGORY_LABELS[category] || category.toUpperCase();
  }

  function buildCardMarkup(project, classPrefix) {
    const image = project.images && project.images.length ? project.images[0] : '';
    const dimensions = IMAGE_DIMENSIONS[image];
    const sizeAttrs = dimensions ? ` width="${dimensions.width}" height="${dimensions.height}"` : '';
    const imageMarkup = image
      ? `<img src="${image}" alt="${project.title} preview"${sizeAttrs} loading="lazy" />`
      : '';

    const toolMarkup = project.tools
      .map((tool) => `<span class="tool-tag">${tool}</span>`)
      .join('');

    const actionMarkup = project.link
      ? `<a class="btn-outline" href="${project.link}">VIEW PROJECT</a>`
      : '<span class="btn-outline" aria-disabled="true">COMING SOON</span>';

    return `
      <article class="${classPrefix}-more-card more-works-card" data-category="${project.category}" data-project-id="${project.id}">
        <div class="${classPrefix}-more-image${image ? '' : ` ${classPrefix}-placeholder-image`}">
          ${imageMarkup}
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tag-row">
          ${toolMarkup}
        </div>
        ${actionMarkup}
      </article>
    `;
  }

  function renderStatic(gridEl, projects, classPrefix) {
    gridEl.classList.remove('more-works-grid--carousel');
    gridEl.innerHTML = projects.map((project) => buildCardMarkup(project, classPrefix)).join('');
  }

  function renderCarousel(gridEl, projects, classPrefix) {
    gridEl.classList.add('more-works-grid--carousel');

    gridEl.innerHTML = `
      <div class="more-works-carousel-wrap">
        <button class="carousel-arrow prev" type="button" aria-label="Previous project">‹</button>
        <div class="more-works-carousel-stage"></div>
        <button class="carousel-arrow next" type="button" aria-label="Next project">›</button>
      </div>
    `;

    const stage = gridEl.querySelector('.more-works-carousel-stage');
    if (!stage) return;

    stage.innerHTML = projects.map((project) => buildCardMarkup(project, classPrefix)).join('');

    const cards = Array.from(stage.querySelectorAll('.more-works-card'));
    const prevBtn = gridEl.querySelector('.carousel-arrow.prev');
    const nextBtn = gridEl.querySelector('.carousel-arrow.next');
    const wrap = gridEl.querySelector('.more-works-carousel-wrap');

    if (cards.length < 3) return;

    let activeIndex = 0;

    const syncHeight = () => {
      const heights = cards.map((card) => card.offsetHeight || 0);
      const tallest = Math.max(...heights, 0);
      stage.style.minHeight = `${tallest}px`;
      if (wrap) wrap.style.minHeight = `${Math.max(tallest + 8, 560)}px`;
    };

    const renderState = () => {
      cards.forEach((card) => {
        card.classList.remove('is-left', 'is-center', 'is-right', 'is-hidden');
        card.classList.add('is-hidden');
      });

      const center = cards[activeIndex];
      const left = cards[(activeIndex - 1 + cards.length) % cards.length];
      const right = cards[(activeIndex + 1) % cards.length];

      center.classList.remove('is-hidden');
      center.classList.add('is-center');

      left.classList.remove('is-hidden');
      left.classList.add('is-left');

      right.classList.remove('is-hidden');
      right.classList.add('is-right');
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + cards.length) % cards.length;
        renderState();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % cards.length;
        renderState();
      });
    }

    renderState();
    requestAnimationFrame(syncHeight);
    window.addEventListener('resize', syncHeight, { passive: true });
  }

  function filterProjects(selectedCategory, currentProjectId) {
    return PROJECTS.filter((project) => {
      if (project.category !== selectedCategory) return false;
      if (project.category === selectedCategory && project.id === currentProjectId) return false;
      return true;
    });
  }

  function setMenuOpen(toggleEl, menuEl, isOpen) {
    menuEl.hidden = !isOpen;
    toggleEl.setAttribute('aria-expanded', String(isOpen));
  }

  function initProjectMoreWorks(config) {
    const {
      currentProjectId,
      currentProjectCategory,
      classPrefix,
      toggleId = 'moreWorksToggle',
      menuId = 'moreWorksMenu',
      currentId = 'moreWorksCurrent',
      gridId = 'moreWorksGrid',
      emptyId = 'moreWorksEmpty'
    } = config;

    const toggleEl = document.getElementById(toggleId);
    const menuEl = document.getElementById(menuId);
    const currentEl = document.getElementById(currentId);
    const gridEl = document.getElementById(gridId);
    const emptyEl = document.getElementById(emptyId);

    if (!toggleEl || !menuEl || !currentEl || !gridEl || !emptyEl) return;

    let activeCategory = currentProjectCategory;

    const render = () => {
      currentEl.textContent = categoryLabel(activeCategory);

      const matched = filterProjects(activeCategory, currentProjectId);

      if (!matched.length) {
        gridEl.hidden = true;
        gridEl.innerHTML = '';
        emptyEl.hidden = false;
        emptyEl.textContent = `No more "${activeCategory.toLowerCase()}" work at this time`;
        return;
      }

      gridEl.hidden = false;
      emptyEl.hidden = true;
      emptyEl.textContent = '';

      if (matched.length >= 3) {
        renderCarousel(gridEl, matched, classPrefix);
      } else {
        renderStatic(gridEl, matched, classPrefix);
      }
    };

    toggleEl.addEventListener('click', () => {
      const isOpen = !menuEl.hidden;
      setMenuOpen(toggleEl, menuEl, !isOpen);
    });

    Object.entries(CATEGORY_LABELS).forEach(([category, label]) => {
      if (menuEl.querySelector(`button[data-category="${category}"]`)) return;

      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.category = category;
      button.textContent = label;
      item.appendChild(button);
      menuEl.appendChild(item);
    });

    const options = Array.from(menuEl.querySelectorAll('button[data-category]'));
    options.forEach((option) => {
      option.addEventListener('click', () => {
        activeCategory = option.dataset.category || currentProjectCategory;
        render();
        setMenuOpen(toggleEl, menuEl, false);
      });
    });

    document.addEventListener('click', (event) => {
      if (menuEl.hidden) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (toggleEl.contains(target) || menuEl.contains(target)) return;
      setMenuOpen(toggleEl, menuEl, false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuOpen(toggleEl, menuEl, false);
    });

    render();
  }

  window.initProjectMoreWorks = initProjectMoreWorks;
})();
