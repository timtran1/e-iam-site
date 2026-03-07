import React from 'react';

/**
 * Custom hook to monitor URL hash changes and automatically scroll to corresponding element
 * @param {Object} options - Configuration options
 * @param {string} options.behavior - Scroll behavior ('smooth' or 'auto')
 * @param {string} options.block - Vertical alignment ('start', 'center', 'end', 'nearest')
 * @param {number} options.offset - Additional offset from top in pixels
 */
const useHashScroll = (options = {}) => {
  const {behavior = 'smooth', block = 'start', offset = 10 * 16} = options;

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
        element.style.background = 'lightyellow';
      }
    },
    [behavior, block, offset]
  );

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
    const handleInitialHash = () => {
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

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Handle initial hash on component mount
    handleInitialHash();

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [behavior, block, offset, scrollToElement]);

  // Return utility function for manual scrolling
  return {
    scrollToHash: scrollToElement,
  };
};

export default useHashScroll;
