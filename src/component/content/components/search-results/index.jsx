import React from 'react';
import ResultItem from './ResultItem.jsx';
import SearchResultsLayout from './SearchResultsLayout.jsx';
import clsx from 'clsx';
import {VIEW_MODE} from './constants.js';

/**
 * Render list results of search
 *
 * @param {string} className
 * @param {Array<SearchResult>} searchResults
 * @param {string} searchTerm - Current search term
 */
const SearchResults = ({className = '', searchResults, searchTerm = ''}) => {
  // View mode state
  const [viewMode, setViewMode] = React.useState(VIEW_MODE.List);

  return (
    <SearchResultsLayout
      viewMode={viewMode}
      setViewMode={setViewMode}
      resultsCount={searchResults.length}
      searchTerm={searchTerm}
      className={clsx(className)}
    >
      <div
        className={clsx(
          'grid gap-6 lg:gap-8 xl:gap-10',
          viewMode === VIEW_MODE.Grid
            ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
            : 'grid-cols-1'
        )}
      >
        {searchResults.map((searchResult, index) => (
          <div key={index}>
            <ResultItem viewMode={viewMode} searchResult={searchResult} />
          </div>
        ))}
      </div>
    </SearchResultsLayout>
  );
};

export default SearchResults;
