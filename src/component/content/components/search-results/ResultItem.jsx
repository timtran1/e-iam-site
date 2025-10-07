import React from 'react';
import ArrowRightButton from '../../../../common/ui/ArrowRightButton.jsx';

/**
 * Search result item
 * @type {React.NamedExoticComponent<{
 *     readonly searchResult: SearchResult
 * }>}
 */
const ResultItem = React.memo(({searchResult}) => {
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
        className="rounded p-6 shadow cursor-pointer transition hover:shadow-xl"
        onClick={handleClickItem}
      >
        <h5
          className="font-bold text-lg truncate"
          dangerouslySetInnerHTML={{
            __html: searchResult.heading?.innerHTML,
          }}
        ></h5>

        <p
          className="break-words mb-0 min-h-44 line-clamp-6"
          dangerouslySetInnerHTML={{
            __html: searchResult.description?.innerHTML,
          }}
        ></p>

        <div className="flex justify-end mt-4">
          <ArrowRightButton className="w-8 h-8 md:w-12 md:h-12" />
        </div>
      </div>
    </>
  );
});

ResultItem.displayName = 'ResultItem';
export default ResultItem;
