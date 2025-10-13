/**
 * Handles responsive width management for elements
 * Saves original width when switching to mobile and restores it when returning to desktop
 * 
 * @param {boolean} isMobile - Current mobile state
 * @param {string|Array} selectors - CSS selector(s) for target elements
 */
export const handleResponsiveWidth = (isMobile, selectors) => {
  // Convert single selector to array for consistent handling
  const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
  
  selectorArray.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      if (isMobile) {
        // Save original width if not already saved
        if (!element.getAttribute('data-original-width')) {
          // Get computed style to ensure we have a value even if inline style isn't set
          const originalWidth = element.style.width || window.getComputedStyle(element).width;
          element.setAttribute('data-original-width', originalWidth);
        }
        // Remove fixed width to allow natural responsive behavior
        element.style.width = '';
        element.style.maxWidth = '100%';
      } else {
        // Restore original width if available
        const originalWidth = element.getAttribute('data-original-width');
        if (originalWidth) {
          element.style.width = originalWidth;
        }
      }
    });
  });
};

/**
 * Reset all saved original widths
 * Useful when content changes and you need to re-evaluate widths
 * 
 * @param {string|Array} selectors - CSS selector(s) for target elements
 */
export const resetSavedWidths = (selectors) => {
  const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
  
  selectorArray.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.removeAttribute('data-original-width');
    });
  });
};
