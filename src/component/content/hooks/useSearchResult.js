import {useMemo} from 'react';
import useQueryParam from '../../../common/hook/useQueryParam.js';

/** List of search page query params */
const SEARCH_PAGE_QUERY_PARAMS = ['_search', '_searchsi'];

/**
 * Custom hook to get search content
 *
 * @param {Element | null} content
 */
const useSearchResult = (content = null) => {
  // Get current page
  const [page] = useQueryParam('c');

  /**
   * @type {boolean}
   */
  const isSearchResultPage = useMemo(
    () => SEARCH_PAGE_QUERY_PARAMS.includes(page),
    [page]
  );

  /**
   * @type {{searchResults: Array<SearchResult>, contentWithoutSearchResults: Element }}
   */
  const searchInstance = useMemo(() => {
    if (!isSearchResultPage || !content) {
      return {
        searchResults: [],
        contentWithoutSearchResults: content,
      };
    }

    let container = null;
    let isStringInput = false;

    if (content instanceof Element) {
      container = content;
    } else if (typeof content === 'string') {
      const tempWrapper = document?.createElement?.('div');
      if (!tempWrapper) {
        return {
          searchResults: [],
          contentWithoutSearchResults: content,
        };
      }
      tempWrapper.innerHTML = content;
      container = tempWrapper;
      isStringInput = true;
    }

    if (!container) {
      return {
        searchResults: [],
        contentWithoutSearchResults: content,
      };
    }

    const clonedContainer = container.cloneNode(true);

    /** @type {Array<SearchResult>} */
    const results = [];
    const headings = Array.from(container.querySelectorAll('h5'));
    const clonedHeadings = clonedContainer.querySelectorAll('h5');

    headings.forEach((heading, index) => {
      const description = heading.nextElementSibling;

      if (!description || description.tagName.toLowerCase() !== 'p') {
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

      // Extract URL from anchor tag inside h5
      let href = '';
      const anchorTag = heading.querySelector('a');
      if (anchorTag) {
        href = anchorTag.getAttribute('href') || '';
      }

      // Create new heading element with plain text only
      const newHeading = document.createElement('h5');
      newHeading.className = 'heading';
      newHeading.textContent = heading.textContent || '';

      results.push({
        heading: newHeading,
        description,
        href,
      });
    });

    const contentWithoutSearchResults = isStringInput
      ? clonedContainer.innerHTML
      : /** @type {Element} */ (clonedContainer);

    return {
      searchResults: results,
      contentWithoutSearchResults,
    };
  }, [content, isSearchResultPage]);

  return {
    isSearchResultPage,
    searchResults: searchInstance.searchResults,
    contentWithoutSearchResults: searchInstance.contentWithoutSearchResults,
  };
};

export default useSearchResult;
