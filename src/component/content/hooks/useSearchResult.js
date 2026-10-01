import {useMemo} from 'react';
import useQueryParam from '../../../common/hook/useQueryParam.js';
import {MockingCurrentPage} from '../../../common/constant/dummy.js';
import {parseSearchResultItem} from '../../../common/helper/search-parsing.js';

const isDevMode = import.meta.env.DEV;

/** List of search page query params */
const SEARCH_PAGE_QUERY_PARAMS = ['_search', '_searchsi'];

/**
 * U5CMS loads the results of other sites with hidden iframes
 * Each iframe fills the container which has the id of its 'c' param (e.g. #teledocs)
 * @see htmltemplate.external-react.html:71
 */
const CROSS_SITE_IFRAME_SELECTOR = 'iframe[src*="u5sys.content.php?c=tele"]';

/**
 * Get the term the user has searched for
 * U5CMS prints it in the script which fills the search form of the content
 *
 * @param {Element} container
 * @returns {string}
 */
const getSearchTerm = (container) => {
  const prefill = container.innerHTML.match(
    /fsearch2\.q\.value=unescape\('((?:\\'|[^'])*)'\)/
  );
  const term = prefill
    ? unescape(prefill[1].replace(/\\'/g, "'")).replace(/&quot;/g, '"')
    : new URLSearchParams(location.search).get('q') || '';

  // U5CMS separates the words of a term with commas in the url
  return term.replace(/[,\s]+/g, ' ').trim();
};

/**
 * Get the term U5CMS has searched for instead, when the term of the user has no hits
 * U5CMS prints a notice and a line break in front of the hits in this case
 *
 * @param {Element} container
 * @param {string} searchTerm
 * @returns {string}
 */
const getReplacementTerm = (container, searchTerm) => {
  const terms = container.querySelector('#terms');
  const lineBreak = terms?.closest('p')?.previousElementSibling;
  const notice = lineBreak?.previousSibling;
  const hasNotice =
    lineBreak?.tagName === 'BR' &&
    notice?.nodeType === Node.TEXT_NODE &&
    !!notice.textContent.trim();
  const replacementTerm = terms?.textContent.trim() || '';

  if (
    !hasNotice ||
    replacementTerm.toLowerCase() === searchTerm.toLowerCase()
  ) {
    return '';
  }
  return replacementTerm;
};

/**
 * Get the containers of the results of other sites
 *
 * @param {Element} container
 * @returns {Array<CrossSiteSource>}
 */
const getCrossSiteSources = (container) => {
  /** @type {Array<CrossSiteSource>} */
  const sources = [];

  container.querySelectorAll(CROSS_SITE_IFRAME_SELECTOR).forEach((iframe) => {
    const src = iframe.getAttribute('src');
    const id = new URLSearchParams(src.split('?')[1]).get('c');
    if (!id || sources.some((source) => source.id === id)) {
      return;
    }

    sources.push({
      id,
      src,
      html: container.querySelector(`[id="${id}"]`)?.innerHTML.trim() || '',
    });
  });

  return sources;
};

/**
 * Custom hook to get search content
 *
 * @param {Element | null} content
 */
const useSearchResult = (content = null) => {
  // Get current page
  const [pageParam] = useQueryParam('c');
  const page = isDevMode ? (pageParam ?? MockingCurrentPage) : pageParam;

  /**
   * @type {boolean}
   */
  const isSearchResultPage = useMemo(
    () => SEARCH_PAGE_QUERY_PARAMS.includes(page),
    [page]
  );

  /**
   * @type {{
   *   searchResults: Array<SearchResult>,
   *   contentWithoutSearchResults: Element,
   *   searchTerm: string,
   *   replacementTerm: string,
   *   crossSiteSources: Array<CrossSiteSource>
   * }}
   */
  const searchInstance = useMemo(() => {
    const emptyInstance = {
      searchResults: [],
      contentWithoutSearchResults: content,
      searchTerm: '',
      replacementTerm: '',
      crossSiteSources: [],
    };

    if (!isSearchResultPage || !content) {
      return emptyInstance;
    }

    let container = null;
    let isStringInput = false;

    if (content instanceof Element) {
      container = content;
    } else if (typeof content === 'string') {
      const tempWrapper = document?.createElement?.('div');
      if (!tempWrapper) {
        return emptyInstance;
      }
      tempWrapper.innerHTML = content;
      container = tempWrapper;
      isStringInput = true;
    }

    if (!container) {
      return emptyInstance;
    }

    const clonedContainer = container.cloneNode(true);
    const crossSiteSources = getCrossSiteSources(container);
    const crossSiteContainerSelector = crossSiteSources
      .map(({id}) => `[id="${id}"]`)
      .join(',');

    /** @type {Array<SearchResult>} */
    const results = [];
    const headings = Array.from(container.querySelectorAll('h5'));
    const clonedHeadings = clonedContainer.querySelectorAll('h5');

    headings.forEach((heading, index) => {
      // The results of other sites are not results of this site
      if (
        crossSiteContainerSelector &&
        heading.closest(crossSiteContainerSelector)
      ) {
        return;
      }

      const result = parseSearchResultItem(heading);
      if (!result) {
        return;
      }

      const clonedHeading = clonedHeadings[index];
      const clonedDescription = clonedHeading?.nextElementSibling || null;

      if (
        clonedHeading &&
        clonedDescription &&
        clonedDescription.tagName.toLowerCase() === 'p'
      ) {
        clonedHeading.remove();
        clonedDescription.remove();
      }

      results.push(result);
    });

    const contentWithoutSearchResults = isStringInput
      ? clonedContainer.innerHTML
      : /** @type {Element} */ (clonedContainer);

    const searchTerm = getSearchTerm(container);

    return {
      searchResults: results,
      contentWithoutSearchResults,
      searchTerm,
      replacementTerm: getReplacementTerm(container, searchTerm),
      crossSiteSources,
    };
  }, [content, isSearchResultPage]);

  return {
    isSearchResultPage,
    searchResults: searchInstance.searchResults,
    contentWithoutSearchResults: searchInstance.contentWithoutSearchResults,
    searchTerm: searchInstance.searchTerm,
    replacementTerm: searchInstance.replacementTerm,
    crossSiteSources: searchInstance.crossSiteSources,
  };
};

export default useSearchResult;
