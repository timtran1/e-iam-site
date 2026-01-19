import {useEffect, useMemo} from 'react';
import useIsMobile from './useIsMobile';

/**
 * Hook to handle responsive width for elements
 * Some elements in u5cms content have fixed widths that don't respond to screen size
 * This hook removes those fixed widths on mobile to allow natural responsive behavior
 * It will restore the fixed width when the screen is resized to desktop
 * @param {string|string[]} selectors - CSS selector(s) for elements to handle
 * @returns {void}
 */
export default function useResponsiveElementWidths(selectors) {
  const {isMobile} = useIsMobile();
  // Convert single selector to array for consistent handling
  const selectorArray = useMemo(
    () => (Array.isArray(selectors) ? selectors : [selectors]),
    [selectors]
  );

  useEffect(() => {
    selectorArray.forEach((selector) => {
      const elements = document.querySelectorAll(selector);

      elements.forEach((element) => {
        if (isMobile) {
          // Save original width if not already saved
          if (!element.getAttribute('data-original-width')) {
            // Get computed style to ensure we have a value even if inline style isn't set
            const originalWidth =
              element.style.width || window.getComputedStyle(element).width;
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
  }, [isMobile, selectorArray]);
}
