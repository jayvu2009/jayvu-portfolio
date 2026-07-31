(() => {
  'use strict';

  const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointerOffsetX = 10;
  const pointerOffsetY = 10;
  const interactiveSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'summary',
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="tab"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="switch"]',
    '[tabindex]:not([tabindex="-1"])',
    '[data-clickable]',
    '[data-filter]',
    '.filter-btn',
    '.project-card',
    '.more-works-card'
  ].join(',');
  const nativePointerSelector = [
    'input:not([type])',
    'input[type="text"]',
    'input[type="email"]',
    'input[type="tel"]',
    'input[type="url"]',
    'input[type="search"]',
    'input[type="password"]',
    'input[type="number"]',
    'textarea',
    '[contenteditable="true"]',
    'iframe',
    'object',
    'embed',
    'video[controls]'
  ].join(',');

  let cleanup = null;
  let isInitializing = false;

  function loadImage(src, className) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.className = className;
      image.src = src;
      image.alt = '';
      image.draggable = false;
      image.setAttribute('aria-hidden', 'true');
      image.addEventListener('load', () => resolve(image), { once: true });
      image.addEventListener('error', reject, { once: true });

      if (image.complete) {
        if (image.naturalWidth > 0) resolve(image);
        else reject(new Error(`Unable to load ${src}`));
      }
    });
  }

  async function initializeMascots() {
    if (!pointerQuery.matches || cleanup || isInitializing) return;
    isInitializing = true;

    let cursorImage;
    let helperImage;

    try {
      [cursorImage, helperImage] = await Promise.all([
        loadImage('assets/mascots/mascot-cursor.svg', 'mascot-cursor-image'),
        loadImage('assets/mascots/mascot-helper.svg', 'mascot-helper-image')
      ]);
    } catch {
      isInitializing = false;
      return;
    }

    if (!pointerQuery.matches || cleanup) {
      isInitializing = false;
      return;
    }

    const pointer = document.createElement('div');
    const cursor = document.createElement('span');
    const cursorVisual = document.createElement('span');
    const cursorArtwork = document.createElement('span');
    const helper = document.createElement('span');
    const helperVisual = document.createElement('span');
    const helperArtwork = document.createElement('span');

    pointer.className = 'mascot-pointer';
    pointer.setAttribute('aria-hidden', 'true');
    cursor.className = 'mascot-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursorVisual.className = 'mascot-cursor-visual';
    cursorArtwork.className = 'mascot-cursor-artwork';
    cursorArtwork.append(cursorImage);
    cursorVisual.append(cursorArtwork);
    cursor.append(cursorVisual);

    helper.className = 'mascot-helper';
    helper.setAttribute('aria-hidden', 'true');
    helperVisual.className = 'mascot-helper-visual';
    helperArtwork.className = 'mascot-helper-artwork';
    helperArtwork.append(helperImage);
    helperVisual.append(helperArtwork);
    helper.append(helperVisual);

    pointer.append(cursor, helper);
    document.body.append(pointer);
    document.documentElement.classList.add('mascot-system-active');
    document.documentElement.classList.toggle('is-reduced-motion', motionQuery.matches);

    const controller = new AbortController();
    const listenerOptions = { signal: controller.signal };
    const passiveOptions = { passive: true, signal: controller.signal };
    let frameId = null;
    let pointerSeen = false;
    let pageVisible = !document.hidden;
    let inNativeArea = false;
    let isPressed = false;
    let activeState = 'hidden';
    let interactiveTarget = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastMovement = 0;

    const isEnabled = (element) => {
      if (!element) return false;
      if (element.matches(':disabled')) return false;
      if (element.closest('[aria-disabled="true"], .is-disabled, .disabled')) return false;
      if (
        element.matches('.project-card, .more-works-card')
        && !element.querySelector('a[href], button:not([disabled]), [data-clickable]')
      ) {
        return false;
      }
      return window.getComputedStyle(element).pointerEvents !== 'none';
    };

    const syncMascotState = () => {
      const shouldShow = pointerSeen && pageVisible && !inNativeArea;
      const nextState = !shouldShow
        ? 'hidden'
        : interactiveTarget
          ? 'interactive'
          : 'normal';

      if (activeState !== nextState) {
        cursor.classList.remove('is-visible', 'is-pressed');
        helper.classList.remove('is-visible', 'is-pressed');
        activeState = nextState;

        if (activeState === 'normal') cursor.classList.add('is-visible');
        if (activeState === 'interactive') helper.classList.add('is-visible');
      }

      cursor.classList.toggle('is-pressed', activeState === 'normal' && isPressed);
      helper.classList.toggle('is-pressed', activeState === 'interactive' && isPressed);
    };

    const setInteractiveTarget = (element) => {
      const nextTarget = isEnabled(element) ? element : null;
      if (interactiveTarget === nextTarget) return;

      interactiveTarget = nextTarget;
      syncMascotState();
    };

    const hideMascots = () => {
      isPressed = false;
      activeState = 'hidden';
      cursor.classList.remove('is-visible', 'is-pressed');
      helper.classList.remove('is-visible', 'is-pressed');
    };

    const render = (time) => {
      frameId = null;
      if (!pageVisible) return;

      if (pointerSeen) {
        currentX = targetX;
        currentY = targetY;
        const renderX = currentX + pointerOffsetX;
        const renderY = currentY + pointerOffsetY;
        const position = `translate3d(${renderX}px, ${renderY}px, 0)`;
        const isMoving = time - lastMovement < 120;

        pointer.style.transform = position;
        cursor.classList.toggle('is-moving', isMoving);
        helper.classList.toggle('is-moving', isMoving);
      }

      frameId = window.requestAnimationFrame(render);
    };

    const startRendering = () => {
      if (frameId === null && pageVisible) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      lastMovement = performance.now();

      if (!pointerSeen) {
        pointerSeen = true;
        currentX = targetX;
        currentY = targetY;
      }

      cursor.classList.add('is-moving');
      helper.classList.add('is-moving');
      syncMascotState();
    };

    const handlePointerOver = (event) => {
      if (!(event.target instanceof Element)) return;

      inNativeArea = Boolean(event.target.closest(nativePointerSelector));
      if (inNativeArea) {
        pointerSeen = false;
        setInteractiveTarget(null);
        hideMascots();
        return;
      }

      setInteractiveTarget(event.target.closest(interactiveSelector));
    };

    const handlePointerOut = (event) => {
      if (!(event.target instanceof Element)) return;

      const relatedElement = event.relatedTarget instanceof Element
        ? event.relatedTarget
        : null;

      if (!relatedElement) {
        pointerSeen = false;
        inNativeArea = false;
        setInteractiveTarget(null);
        hideMascots();
        return;
      }

      const relatedInteractive = relatedElement.closest(interactiveSelector);
      if (relatedInteractive === interactiveTarget) return;

      inNativeArea = Boolean(relatedElement.closest(nativePointerSelector));
      if (inNativeArea) {
        pointerSeen = false;
        setInteractiveTarget(null);
        hideMascots();
      } else {
        setInteractiveTarget(relatedInteractive);
      }
    };

    const handlePointerDown = () => {
      if (!pointerSeen || inNativeArea) return;
      isPressed = true;
      syncMascotState();
    };

    const handlePointerUp = () => {
      isPressed = false;
      syncMascotState();
    };

    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (!pageVisible) {
        hideMascots();
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
          frameId = null;
        }
        return;
      }

      currentX = targetX;
      currentY = targetY;
      isPressed = false;
      pointerSeen = false;
      startRendering();
    };

    const handleMotionChange = () => {
      document.documentElement.classList.toggle('is-reduced-motion', motionQuery.matches);
      currentX = targetX;
      currentY = targetY;
    };

    document.addEventListener('pointermove', handlePointerMove, passiveOptions);
    document.addEventListener('pointerover', handlePointerOver, passiveOptions);
    document.addEventListener('pointerout', handlePointerOut, passiveOptions);
    document.addEventListener('pointerdown', handlePointerDown, listenerOptions);
    document.addEventListener('pointerup', handlePointerUp, listenerOptions);
    document.addEventListener('pointercancel', handlePointerUp, listenerOptions);
    document.addEventListener('visibilitychange', handleVisibilityChange, listenerOptions);
    window.addEventListener('blur', hideMascots, listenerOptions);
    motionQuery.addEventListener('change', handleMotionChange, listenerOptions);
    startRendering();

    cleanup = () => {
      controller.abort();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      pointer.remove();
      document.documentElement.classList.remove('mascot-system-active', 'is-reduced-motion');
      cleanup = null;
    };
    isInitializing = false;
  }

  const handlePointerCapabilityChange = () => {
    if (pointerQuery.matches) initializeMascots();
    else cleanup?.();
  };

  pointerQuery.addEventListener('change', handlePointerCapabilityChange);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMascots, { once: true });
  } else {
    initializeMascots();
  }
})();
