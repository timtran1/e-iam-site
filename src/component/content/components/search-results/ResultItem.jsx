import React from 'react';
import clsx from 'clsx';
import {VIEW_MODE} from './constants.js';

/**
 * Search result item
 * @type {React.NamedExoticComponent<{
 *     readonly searchResult: SearchResult
 *     readonly viewMode: string
 * }>}
 */
const ResultItem = React.memo(({searchResult, viewMode}) => {
  /**
   * Build the full href URL with current search params
   * @type {string}
   */
  const fullHref = React.useMemo(() => {
    const [endpoint] = location.href.split('?');
    const currentSearchParams = new URLSearchParams(location.search);
    const hrefPath = searchResult.href?.includes('?')
      ? searchResult.href.split('?')[0]
      : '';
    const hrefParams = new URLSearchParams(
      searchResult.href?.includes('?')
        ? searchResult.href?.split('?')[1]
        : searchResult.href?.split[0]
    );
    for (const key of hrefParams.keys()) {
      if (currentSearchParams.has(key)) {
        currentSearchParams.set(key, hrefParams.get(key));
      }
    }
    return endpoint + hrefPath + `?${currentSearchParams.toString()}`;
  }, [searchResult.href]);

  /**
   * Get aria label for the result item
   * @type {string}
   */
  const ariaLabel = React.useMemo(() => {
    const heading =
      searchResult.heading?.innerHTML?.replace(/<[^>]*>/g, '').trim() || '';
    const description =
      searchResult.description?.innerHTML
        ?.replace(/<[^>]*>/g, '')
        .trim()
        .split(' ')
        .slice(0, 20)
        .join(' ') || '';
    return `${heading}. ${description}`;
  }, [searchResult.heading?.innerHTML, searchResult.description?.innerHTML]);

  return (
    <>
      <a
        href={fullHref}
        className={clsx(
          'block no-underline cursor-pointer group focus:outline-none visited:!text-inherit focus:ring-2 focus:ring-primary-main focus:ring-offset-2',
          viewMode === VIEW_MODE.Grid &&
            'rounded p-6 shadow transition hover:shadow-xl',
          viewMode === VIEW_MODE.List && 'border-b pb-6'
        )}
        aria-label={ariaLabel}
      >
        <h5
          aria-hidden="true"
          className="font-bold text-lg truncate transition group-hover:text-primary-main"
          dangerouslySetInnerHTML={{
            __html: searchResult.heading?.innerHTML,
          }}
        ></h5>

        <p
          aria-hidden="true"
          className={clsx(
            'break-words mb-0',
            viewMode === VIEW_MODE.Grid && 'min-h-44 line-clamp-6',
            viewMode === VIEW_MODE.List && 'min-h-24 line-clamp-3'
          )}
          dangerouslySetInnerHTML={{
            __html: searchResult.description?.innerHTML,
          }}
        ></p>

        {viewMode === VIEW_MODE.Grid && (
          <div className="flex justify-end mt-4">
            <div
              aria-hidden="true"
              className={clsx(
                'w-12 h-12 p-2 border border-primary-main flex justify-center items-center'
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                color=""
                className="fill-primary-main"
              >
                <path d="m16.444 19.204 4.066-7.044-4.066-7.044-.65.375 3.633 6.294H4.24v.75h15.187l-3.633 6.294z"></path>
              </svg>
            </div>
          </div>
        )}
      </a>
    </>
  );
});

ResultItem.displayName = 'ResultItem';
export default ResultItem;
