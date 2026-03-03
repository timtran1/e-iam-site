/**
 * This function is used to check if a link is the current page.
 *
 * @deprecated: Use 'activeItem' from menu data instead. OUTDATED.
 * @see: src/typedef/menu.js:4
 *
 * However, this function is still kept for backward compatibility because 'activeItem' has not been validated for all cases.
 *
 * @param {string} link
 * @returns {boolean}
 */
export default function linkIsCurrentPage(link) {
  try {
    // Handle relative URLs by resolving them against the current page URL
    const urlObject = new URL(link, window.location.href);
    const currentUrl = new URL(window.location.href);

    // Compare the 'c' parameter if it exists
    const linkSearchParams = urlObject.searchParams;
    const linkCParam = linkSearchParams.get('c');
    const currentSearchParams = new URLSearchParams(window.location.search);
    const currentCParam = currentSearchParams.get('c');

    if (linkCParam || currentCParam) {
      // If either URL has a 'c' parameter, compare those
      return linkCParam === currentCParam;
    } else {
      // Otherwise, compare the pathname (ignoring protocol, host, etc.)
      return urlObject.pathname === currentUrl.pathname;
    }
  } catch (e) {
    console.error('Error comparing URLs:', e);
    return false;
  }
}
