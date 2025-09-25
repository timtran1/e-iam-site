/**
 * Check if the current page is running in u5admin preview mode
 *
 * This function detects whether the page is being displayed inside an iframe
 * within the u5admin system for preview purposes.
 *
 * Detection logic:
 * 1. Check if current window is different from top window (iframe detection)
 * 2. Try to access parent URL and check if it contains 'u5admin'
 * 3. If cross-origin restrictions prevent URL access, assume it's u5admin preview
 *
 * @returns {boolean} true if running in u5admin preview mode, false otherwise
 */
export function isU5AdminPreview() {
  try {
    // Check if we're in an iframe by comparing window with window.top
    const isInIframe = window !== window.top;

    if (!isInIframe) {
      // Not in iframe, definitely not u5admin preview
      return false;
    }

    try {
      // Try to access parent URL (may fail due to cross-origin restrictions)
      const parentUrl = window.top.location.href;

      // Check if parent URL contains u5admin indicator
      return parentUrl.includes('u5admin');
    } catch (error) {
      // Cross-origin restriction - assume it's u5admin if we can't access parent
      // This is common when iframe is from different domain
      return true;
    }
  } catch (error) {
    // Any other error - assume not in preview mode
    return false;
  }
}
