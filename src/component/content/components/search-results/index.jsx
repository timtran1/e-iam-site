import React from 'react';
import ResultItem from './ResultItem.jsx';
import SearchResultsLayout from './SearchResultsLayout.jsx';
import CrossSiteResults from './CrossSiteResults.jsx';
import clsx from 'clsx';
import {VIEW_MODE} from './constants.js';

/**
 * Render list results of search
 *
 * @param {string} className
 * @param {Array<SearchResult>} searchResults
 * @param {string} searchTerm - Current search term
 * @param {string} replacementTerm - Term U5CMS has searched for instead, when the search term has no hits
 * @param {Array<CrossSiteResultGroup>} crossSiteResults - Results of other sites
 */
const SearchResults = ({
  className = '',
  searchResults,
  searchTerm = '',
  replacementTerm = '',
  crossSiteResults = [],
}) => {
  // View mode state
  const [viewMode, setViewMode] = React.useState(VIEW_MODE.List);

  return (
    <div className={clsx('search-result-groups', className)}>
      <SearchResultsLayout
        viewMode={viewMode}
        setViewMode={setViewMode}
        resultsCount={searchResults.length}
        searchTerm={searchTerm}
        replacementTerm={replacementTerm}
      >
        <div
          className={clsx(
            'grid',
            viewMode === VIEW_MODE.Grid
              ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 pt-3'
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

      {crossSiteResults.map((group) => (
        <CrossSiteResults
          key={group.id}
          title={group.title}
          domain={group.domain}
          searchResults={group.results}
        />
      ))}
    </div>
  );
};

export default SearchResults;
