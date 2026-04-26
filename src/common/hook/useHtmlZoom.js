import React from 'react';

/**
 * Reads the current CSS zoom value applied to the <html> element.
 * Supports both inline style and stylesheet-applied zoom.
 *
 * @returns {number}
 */
const _getHtmlZoom = () => {
  const inlineZoom = parseFloat(document.documentElement.style.zoom);
  if (!isNaN(inlineZoom)) return inlineZoom;

  const computedZoom = parseFloat(
    window.getComputedStyle(document.documentElement).zoom
  );
  if (!isNaN(computedZoom)) return computedZoom;

  return 1;
};

/**
 * Returns the current zoom value of the <html> element and reactively updates
 * when the inline style of <html> changes (via MutationObserver).
 *
 * Useful to compensate for zoom-induced layout issues on `position: fixed` elements.
 *
 * @returns {number} - Current zoom level (e.g. 0.8, 1, 1.2)
 */
const useHtmlZoom = () => {
  const [zoom, setZoom] = React.useState(_getHtmlZoom);

  React.useEffect(() => {
    const handleChange = () => setZoom(_getHtmlZoom());

    const observer = new MutationObserver(handleChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  return zoom;
};

export default useHtmlZoom;
