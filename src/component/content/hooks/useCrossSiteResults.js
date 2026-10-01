import {useEffect, useMemo, useState} from 'react';
import {
  parseCrossSiteHeading,
  parseSearchResults,
} from '../../../common/helper/search-parsing.js';

const isDevMode = import.meta.env.DEV;

/**
 * Custom hook to get the search results of other sites
 *
 * U5CMS loads them with hidden iframes, each iframe copies its results into the
 * container with its id in the parent document. These iframes and containers are
 * removed together with the server-side content, so this hook adds them again
 * outside the React tree and collects the results as soon as U5CMS has filled them.
 *
 * @param {Array<CrossSiteSource>} sources
 * @returns {Array<CrossSiteResultGroup>}
 */
const useCrossSiteResults = (sources) => {
  // Results by id of the source
  const [resultsById, setResultsById] = useState({});

  useEffect(() => {
    if (!sources.length) {
      return;
    }

    const holder = document.createElement('div');
    holder.style.display = 'none';

    const observers = [];

    const collectResults = (id, container) => {
      const results = parseSearchResults(container);
      setResultsById((prevState) => ({
        ...prevState,
        [id]: {
          id,
          ...parseCrossSiteHeading(container, results),
          results,
        },
      }));
    };

    sources.forEach(({id, src, html}) => {
      const container = document.createElement('div');

      // U5CMS has filled this container before the server-side content was captured
      if (html) {
        container.innerHTML = html;
        collectResults(id, container);
        return;
      }

      // There is no U5CMS to answer the iframes in dev mode
      if (!src || isDevMode) {
        return;
      }

      container.id = id;
      holder.appendChild(container);

      const observer = new MutationObserver(() =>
        collectResults(id, container)
      );
      observer.observe(container, {childList: true});
      observers.push(observer);

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = src;
      holder.appendChild(iframe);
    });

    document.body.appendChild(holder);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      holder.remove();
    };
  }, [sources]);

  return useMemo(
    () =>
      sources
        .map(({id}) => resultsById[id])
        .filter((group) => group?.results.length),
    [sources, resultsById]
  );
};

export default useCrossSiteResults;
