(() => {
  'use strict';

  const SIGNED_IN_KEY = 'portfolioSignedIn';
  const INTERNAL_NAVIGATION_KEY = 'portfolioInternalNavigation';
  const INDEX_FILE_PATTERN = /(?:^|\/)index\.html$/i;
  const PORTFOLIO_PAGE_PATTERN = /(?:^|\/)(?:about|project[1-6])\.html$/i;

  const navigationScript = document.currentScript;
  if (navigationScript?.src) {
    const mascotScriptUrl = new URL('mascots.js', navigationScript.src).href;
    const mascotAlreadyLoaded = Array.from(document.scripts)
      .some((script) => script.src === mascotScriptUrl);

    if (!mascotAlreadyLoaded) {
      const mascotScript = document.createElement('script');
      mascotScript.src = mascotScriptUrl;
      mascotScript.defer = true;
      mascotScript.dataset.mascotSystem = 'true';
      document.head.append(mascotScript);
    }
  }

  const getSessionValue = (key) => {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const setSessionValue = (key, value) => {
    try {
      window.sessionStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };

  const removeSessionValue = (key) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Navigation continues when session storage is unavailable.
    }
  };

  const getNavigationType = () => {
    const navigationEntry = window.performance?.getEntriesByType?.('navigation')?.[0];
    if (navigationEntry?.type) return navigationEntry.type;

    const legacyType = window.performance?.navigation?.type;
    if (legacyType === 1) return 'reload';
    if (legacyType === 2) return 'back_forward';
    return 'navigate';
  };

  const isIndexPath = (pathname) => (
    INDEX_FILE_PATTERN.test(pathname) || pathname.endsWith('/')
  );

  const currentPathIsIndex = isIndexPath(window.location.pathname);

  window.portfolioSessionState = Object.freeze({
    signedInKey: SIGNED_IN_KEY,
    setSessionValue
  });

  if (currentPathIsIndex) {
    const internalNavigation = getSessionValue(INTERNAL_NAVIGATION_KEY);
    removeSessionValue(INTERNAL_NAVIGATION_KEY);

    const hash = window.location.hash.toLowerCase();
    const isHomeDestination = hash === '' || hash === '#home';
    const navigationType = getNavigationType();
    const isReload = navigationType === 'reload';
    const isBackForward = navigationType === 'back_forward';
    const isSignedIn = getSessionValue(SIGNED_IN_KEY) === 'true';

    let cameFromPortfolioPage = false;
    if (document.referrer) {
      try {
        const referrer = new URL(document.referrer);
        cameFromPortfolioPage = (
          referrer.origin === window.location.origin
          && PORTFOLIO_PAGE_PATTERN.test(referrer.pathname)
        );
      } catch {
        cameFromPortfolioPage = false;
      }
    }

    const shouldShowIntro = (
      isHomeDestination
      && !internalNavigation
      && !isBackForward
      && (isReload || (!isSignedIn && !cameFromPortfolioPage))
    );

    if (!shouldShowIntro) {
      document.documentElement.classList.add('intro-skipped');
    }

    window.portfolioIntroDecision = Object.freeze({
      internalNavigation,
      isHomeDestination,
      navigationType,
      shouldShowIntro
    });

    return;
  }

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;

    const backToTopLink = target.closest('.footer-back-to-top');
    if (backToTopLink) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const link = target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

    let destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    if (destination.origin !== window.location.origin || !isIndexPath(destination.pathname)) return;

    const hash = destination.hash.toLowerCase();
    const destinationSection = hash === '#works'
      ? 'works'
      : hash === '#contact'
        ? 'contact'
        : 'home';

    setSessionValue(INTERNAL_NAVIGATION_KEY, destinationSection);
  }, true);
})();
