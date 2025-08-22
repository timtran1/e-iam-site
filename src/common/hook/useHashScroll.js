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
      }
    },
    [behavior, block, offset]
  );

  React.useEffect(() => {
    /**
     * Handle hash change events
     */
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      scrollToElement(currentHash);
    };

    /**
     * Handle initial page load with hash
     */
    const handleInitialHash = () => {
      const currentHash = window.location.hash;
      if (currentHash) {
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
          scrollToElement(currentHash);
        }, 100);
      }
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
