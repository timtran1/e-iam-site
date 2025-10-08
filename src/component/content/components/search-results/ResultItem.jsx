import React from 'react';
import ArrowRightButton from '../../../../common/ui/ArrowRightButton.jsx';
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
   * Handle click search result item
   * @type {(function(): void)|*}
   */
  const handleClickItem = React.useCallback(() => {
    const [endpoint] = location.href.split('?');
    location.href = endpoint + searchResult.href;
  }, [searchResult.href]);

  return (
    <>
      <div
        className={clsx(
          'cursor-pointer group',
          viewMode === VIEW_MODE.Grid &&
            'rounded p-6 shadow transition hover:shadow-xl',
          viewMode === VIEW_MODE.List && 'border-b pb-6'
        )}
        onClick={handleClickItem}
      >
        <h5
          className="font-bold text-lg truncate transition group-hover:text-primary-main"
          dangerouslySetInnerHTML={{
            __html: searchResult.heading?.innerHTML,
          }}
        ></h5>

        <p
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
            <ArrowRightButton className="w-8 h-8 md:w-12 md:h-12" />
          </div>
        )}
      </div>
    </>
  );
});

ResultItem.displayName = 'ResultItem';
export default ResultItem;
