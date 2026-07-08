import React from 'react';

/**
 * Custom hook to monitor URL hash changes and automatically scroll to corresponding element
 * @param {Object} options - Configuration options
 * @param {string} options.behavior - Scroll behavior ('smooth' or 'auto')
 * @param {string} options.block - Vertical alignment ('start', 'center', 'end', 'nearest')
 * @param {number} options.offset - Additional offset from top in pixels
 * @param {boolean} options.ready - Whether the target content is ready to be
 *   searched/scrolled to. Defaults to true so consumers that never pass it
 *   keep the previous behavior. Pass false while content is still loading
 *   asynchronously (e.g. legacy server-rendered markup) so the initial-hash
 *   and article-id retry loops only start once it actually lands, instead of
 *   racing a fixed timeout.
 */
const useHashScroll = (options = {}) => {
  const {
    behavior = 'smooth',
    block = 'start',
    offset = 10 * 16,
    handleInitialHash = true,
    ready = true,
  } = options;

  // Guards the initial-hash/article-id handling so it only completes once —
  // flips true only when a scroll is actually dispatched (see tryScroll
  // below), not merely when a retry loop starts.
  const hasHandledInitialHashRef = React.useRef(false);

  /**
   * Look up an element by ID, falling back to <a name="..."> if not found.
   */
  const findTarget = (id) =>
    document.getElementById(id) ||
    document.querySelector(`a[name="${CSS.escape(id)}"]`);

  /**
   * True when the element has been laid out enough to scroll to.
   * Empty <a name> anchors have no box of their own — use the parent.
   */
  const isLaidOut = (el) => {
    const r = el.getBoundingClientRect();
    if (r.height > 0) return true;
    const p = el.parentElement;
    if (!p) return false;
    const pr = p.getBoundingClientRect();
    return pr.height > 0 && (pr.top !== 0 || pr.bottom !== 0);
  };

  /**
   * Resolve an element's absolute Y position, with fallbacks for empty
   * inline elements whose own rect/offsetTop may be zero.
   */
  const getScrollY = (el) => {
    const r = el.getBoundingClientRect();
    if (r.height > 0) return r.top + window.pageYOffset;
    // Walk offsetTop chain (for empty inline elements)
    let offsetY = 0;
    let cur = el;
    while (cur) {
      offsetY += cur.offsetTop || 0;
      cur = cur.offsetParent;
    }
    if (offsetY > 0) return offsetY;
    if (el.parentElement) {
      return el.parentElement.getBoundingClientRect().top + window.pageYOffset;
    }
    return 0;
  };

  /**
   * Scroll to element with given ID
   * @param {string} hash - The hash string (including #)
   */
  const scrollToElement = React.useCallback(
    (hash) => {
      if (!hash || hash === '#') return;

      // Remove # from hash to get element ID
      const elementId = hash.substring(1);
      const element = findTarget(elementId);

      if (element) {
        // Calculate position with offset
        if (offset > 0) {
          const elementPosition = getScrollY(element);
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: behavior,
          });
        } else {
          // Use native scrollIntoView for better browser compatibility
          element.scrollIntoView({
            behavior: behavior,
            block: block,
          });
        }

        // Highlight the target element
        element.style.transition = 'background 1s ease';
        element.style.background = 'lightyellow';
        setTimeout(() => {
          element.style.background = '';
          setTimeout(() => {
            element.style.transition = '';
          }, 300);
        }, 3000);
      }
    },
    [behavior, block, offset]
  );

  /**
   * Extract article ID from URL query parameters (legacy format: &did at end of URL)
   * URLs like: page?param1&param2&123 where 123 is the article ID
   */
  const getArticleIdFromUrl = React.useCallback(() => {
    const href = window.location.href;
    if (href.indexOf('&') < 0 || href.indexOf('#') >= 0) return null;

    const cleaned = href
      .replace(/&l=de/g, '')
      .replace(/&l=fr/g, '')
      .replace(/&l=en/g, '')
      .replace(/&l=it/g, '');

    const parts = cleaned.split('&');
    const did = parts[parts.length - 1];

    if (did > 0) return did;
    return null;
  }, []);

  React.useEffect(() => {
    /**
     * Handle hash change events
     */
    const handleHashChange = () => {
      scrollToElement(window.location.hash);
    };

    /**
     * Handle initial page load with hash
     */
    const handleInitialHashFn = () => {
      if (hasHandledInitialHashRef.current) return;

      const currentHash = window.location.hash;
      if (!currentHash || currentHash === '#') return;

      const elementId = currentHash.substring(1);
      let attempts = 0;
      const maxAttempts = 40; // 4 seconds max

      const tryScroll = () => {
        attempts++;
        const el = findTarget(elementId);

        if (el && isLaidOut(el)) {
          scrollToElement(currentHash);
          hasHandledInitialHashRef.current = true;
        } else if (attempts < maxAttempts) {
          setTimeout(tryScroll, 100);
        } else if (el) {
          // Retry budget exhausted but something matched — scroll to it
          // anyway rather than silently giving up.
          scrollToElement(currentHash);
          hasHandledInitialHashRef.current = true;
        } else {
          console.warn(
            `[useHashScroll] gave up scrolling to "${currentHash}" — element never appeared in the DOM`
          );
        }
      };

      tryScroll();
    };

    /**
     * Handle scrolling to article by ID from legacy URL format (e.g. ?foo&bar&123)
     */
    const handleArticleScroll = () => {
      if (hasHandledInitialHashRef.current) return;

      const did = getArticleIdFromUrl();
      if (!did) return;

      const elementId = 'd' + did;
      let attempts = 0;
      const maxAttempts = 40;

      const finishScroll = () => {
        scrollToElement('#' + elementId);
        hasHandledInitialHashRef.current = true;

        // Clear any active filter
        const filter = document.getElementById('filter');
        if (filter && filter.value !== '') {
          filter.value = '';
          if (filter.onchange) filter.onchange();
        }
      };

      const tryScroll = () => {
        attempts++;
        const el = findTarget(elementId);

        if (el && isLaidOut(el)) {
          finishScroll();
        } else if (attempts < maxAttempts) {
          setTimeout(tryScroll, 100);
        } else if (el) {
          // Retry budget exhausted but something matched — scroll to it
          // anyway rather than silently giving up.
          finishScroll();
        } else {
          console.warn(
            `[useHashScroll] gave up scrolling to "#${elementId}" — element never appeared in the DOM`
          );
        }
      };

      tryScroll();
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Handle initial hash or article scroll once the target content is
    // ready. When ready flips false -> true (e.g. slow-loading legacy
    // content lands late), this effect re-runs and starts the retry loop
    // then, instead of depending on a fixed wall-clock timeout.
    if (handleInitialHash && ready) {
      const did = getArticleIdFromUrl();
      if (did) {
        handleArticleScroll();
      } else {
        handleInitialHashFn();
      }
    }

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [
    behavior,
    block,
    offset,
    ready,
    scrollToElement,
    getArticleIdFromUrl,
    handleInitialHash,
  ]);

  // Return utility function for manual scrolling
  return {
    scrollToHash: scrollToElement,
  };
};

export default useHashScroll;
