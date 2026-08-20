import React from 'react';
import useOSDetect from './useOSDetect.js';
import {WINDOWS_ZOOM_FACTOR} from '../constant/zoom.js';

/**
 * Reads the current CSS zoom value applied to the <html> element.
 * Supports both inline style and stylesheet-applied zoom. This value may be
 * set outside of this codebase (e.g. by the deploy environment), so it must
 * be read from the DOM rather than assumed.
 *
 * @returns {number}
 */
const _getDocumentZoom = () => {
  const inlineZoom = parseFloat(document.documentElement.style.zoom);
  if (!isNaN(inlineZoom)) return inlineZoom;

  const computedZoom = parseFloat(
    window.getComputedStyle(document.documentElement).zoom
  );
  if (!isNaN(computedZoom)) return computedZoom;

  return 1;
};

/**
 * Returns the combined CSS zoom factor affecting the app: any zoom applied
 * externally to <html> (outside this codebase's control) multiplied by the
 * zoom App.jsx applies to its wrapper <div> on Windows. CSS zoom composes
 * multiplicatively across nested elements, so both sources must be combined
 * rather than read independently.
 *
 * Useful to compensate for zoom-induced layout issues on `position: fixed`
 * elements, whose viewport units (vw/vh) get scaled by ancestor zoom in
 * Chromium.
 *
 * Reactively updates when <html>'s inline style/class changes (via
 * MutationObserver); the App.jsx-driven factor is derived from OS detection,
 * which does not change at runtime.
 *
 * @returns {number} - Combined zoom factor (e.g. 0.8, 1, 0.64)
 */
const useHtmlZoom = () => {
  const {os} = useOSDetect();
  const appZoom = os === 'Windows' ? WINDOWS_ZOOM_FACTOR : 1;

  const [documentZoom, setDocumentZoom] = React.useState(_getDocumentZoom);

  React.useEffect(() => {
    const handleChange = () => setDocumentZoom(_getDocumentZoom());

    const observer = new MutationObserver(handleChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  return documentZoom * appZoom;
};

export default useHtmlZoom;
