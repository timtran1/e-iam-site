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
