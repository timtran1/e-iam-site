import React from 'react';

/**
 * Custom hook to monitor URL hash changes and automatically scroll to corresponding element
 * @param {Object} options - Configuration options
 * @param {string} options.behavior - Scroll behavior ('smooth' or 'auto')
 * @param {string} options.block - Vertical alignment ('start', 'center', 'end', 'nearest')
 * @param {number} options.offset - Additional offset from top in pixels
 */
const useHashScroll = (options = {}) => {
  const {behavior = 'smooth', block = 'start', offset = 10 * 16, handleInitialHash = true} = options;

  /**
   * Scroll to element with given ID
   * @param {string} hash - The hash string (including #)
   */
  const scrollToElement = React.useCallback(
    (hash) => {
      if (!hash || hash === '#') return;

      // Remove # from hash to get element ID
      const elementId = hash.substring(1);
      const element = document.getElementById(elementId);

      if (element) {
        // Calculate position with offset
        if (offset > 0) {
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
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
          setTimeout(() => { element.style.transition = ''; }, 300);
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
      const currentHash = window.location.hash;
      if (!currentHash || currentHash === '#') return;

      const elementId = currentHash.substring(1);
      let attempts = 0;
      const maxAttempts = 40; // 4 seconds max

      const tryScroll = () => {
        attempts++;
        const el = document.getElementById(elementId);
        const rect = el?.getBoundingClientRect();

        if (el && rect && rect.height > 0) {
          scrollToElement(currentHash);
        } else if (attempts < maxAttempts) {
          setTimeout(tryScroll, 100);
        }
      };

      tryScroll();
    };

    /**
     * Handle scrolling to article by ID from legacy URL format (e.g. ?foo&bar&123)
     */
    const handleArticleScroll = () => {
      const did = getArticleIdFromUrl();
      if (!did) return;

      const elementId = 'd' + did;
      let attempts = 0;
      const maxAttempts = 40;

      const tryScroll = () => {
        attempts++;
        const el = document.getElementById(elementId);
        const rect = el?.getBoundingClientRect();

        if (el && rect && rect.height > 0) {
          scrollToElement('#' + elementId);

          // Clear any active filter
          const filter = document.getElementById('filter');
          if (filter && filter.value !== '') {
            filter.value = '';
            if (filter.onchange) filter.onchange();
          }
        } else if (attempts < maxAttempts) {
          setTimeout(tryScroll, 100);
        }
      };

      tryScroll();
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Handle initial hash or article scroll on component mount
    if (handleInitialHash) {
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
  }, [behavior, block, offset, scrollToElement, getArticleIdFromUrl]);

  // Return utility function for manual scrolling
  return {
    scrollToHash: scrollToElement,
  };
};

export default useHashScroll;
