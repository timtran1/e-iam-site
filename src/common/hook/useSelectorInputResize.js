import {useRef} from 'react';
import useEffectOnce from './useEffectOnce.js';

/**
 * Hook to automatically resize input elements based on their content
 * Targets FIRST CHILD inputs within span elements with class '.selector'
 */
const useSelectorInputResize = () => {
  const inputHandlersRef = useRef(new Map());

  /**
   * useEffectOnce hook to run the code only once
   */
  useEffectOnce(() => {
    // Create canvas for measuring text width (faster than DOM manipulation)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Cache font strings for each input
    const inputFontCache = new WeakMap();

    /**
     * Gets or creates cached font string for an input
     * @param {HTMLInputElement} input - The input element
     * @returns {string} Font string for canvas context
     */
    const getInputFont = (input) => {
      let font = inputFontCache.get(input);
      if (!font) {
        const computedStyle = window.getComputedStyle(input);
        font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
        inputFontCache.set(input, font);
      }
      return font;
    };

    /**
     * Adjusts input width based on its content
     * @param {HTMLInputElement} input - The input element to resize
     */
    const adjustInputWidth = (input) => {
      // Set font for measurement
      ctx.font = getInputFont(input);

      // Measure text width
      const text = input.value || input.placeholder || '';
      const textWidth = ctx.measureText(text).width;

      // Set width with padding (44px). This has minimum width of 50px
      const newWidth = Math.max(Math.ceil(textWidth) + 44, 50);
      input.style.width = `${newWidth}px`;
    };

    /**
     * Finds and processes all target inputs
     */
    const processInputs = () => {
      // Find all span elements with class 'selector'
      const selectorSpans = document.querySelectorAll('span.selector');

      selectorSpans.forEach((span) => {
        // Get first child input
        const input = span.querySelector(':scope > input');

        if (input) {
          // Always resize to ensure correct width
          adjustInputWidth(input);

          // Add event listeners only if not already added
          if (!inputHandlersRef.current.has(input)) {
            // Create event handler
            const handleInput = () => adjustInputWidth(input);

            // Add event listeners
            input.addEventListener('input', handleInput);
            input.addEventListener('change', handleInput);

            // Store handler reference for cleanup
            inputHandlersRef.current.set(input, handleInput);
          }
        }
      });
    };

    // Initial processing
    processInputs();

    // Setup MutationObserver to handle dynamically added inputs and attribute changes
    const observer = new MutationObserver(() => {
      processInputs();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      observer.disconnect();

      // Remove all event listeners
      inputHandlersRef.current.forEach((handler, input) => {
        input.removeEventListener('input', handler);
        input.removeEventListener('change', handler);
      });

      // Clear the map
      inputHandlersRef.current.clear();
    };
  });
};

export default useSelectorInputResize;
