/**
 * CSS zoom factor applied to the app wrapper on Windows (see App.jsx) to
 * visually match the density of macOS. Must stay in sync with useHtmlZoom,
 * which position: fixed elements use to compensate for Chromium's
 * zoom-scaled viewport units.
 */
export const WINDOWS_ZOOM_FACTOR = 0.8;
