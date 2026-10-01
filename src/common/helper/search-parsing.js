/**
 * Parse a search result of U5CMS, which is a pair of h5 (title) and p (description)
 *
 * @param {Element} heading - h5 element
 * @returns {SearchResult | null}
 */
export const parseSearchResultItem = (heading) => {
  const description = heading.nextElementSibling;

  if (!description || description.tagName.toLowerCase() !== 'p') {
    return null;
  }

  // Extract URL from anchor tag inside h5
  const anchorTag = heading.querySelector('a');
  const href = anchorTag?.getAttribute('href') || '';

  // U5CMS puts a small label in front of the title of documents and protected content
  // e.g. <span style="font-size:60%">cug docx</span>
  const title = (anchorTag || heading).cloneNode(true);
  const badgeEle = title.firstElementChild;
  let badge = '';
  if (badgeEle?.tagName === 'SPAN' && title.firstChild === badgeEle) {
    badge = badgeEle.textContent.trim();
    badgeEle.remove();
  }

  // Create new heading element with plain text only
  const newHeading = document.createElement('h5');
  newHeading.className = 'heading';
  newHeading.textContent = (title.textContent || '').trim();

  return {
    heading: newHeading,
    description,
    href,
    badge,
  };
};

/**
 * Parse all search results of U5CMS within a container
 *
 * @param {Element} container
 * @returns {Array<SearchResult>}
 */
export const parseSearchResults = (container) =>
  Array.from(container.querySelectorAll('h5'))
    .map(parseSearchResultItem)
    .filter(Boolean);

/**
 * Get the heading of the cross-site results of a U5CMS container and the site they come from
 * U5CMS prints the heading in the h1, in the language of the page (e.g. 'Suggestions from docs.eiam.admin.ch:')
 *
 * @param {Element} container
 * @param {Array<SearchResult>} results
 * @returns {{title: string, domain: string}}
 */
export const parseCrossSiteHeading = (container, results) => {
  const title = (container.querySelector('h1')?.textContent || '')
    .trim()
    .replace(/\s*:$/, '');
  const domainInTitle = title.match(/([a-z0-9-]+\.)+[a-z]{2,}/i)?.[0];
  if (domainInTitle) {
    return {title, domain: domainInTitle};
  }

  try {
    return {title: '', domain: new URL(results[0]?.href).hostname};
  } catch (_error) {
    return {title: '', domain: ''};
  }
};
