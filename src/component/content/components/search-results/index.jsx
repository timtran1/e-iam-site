import ResultItem from './ResultItem.jsx';

/**
 * Render list results of search
 *
 * @param {Array<SearchResult>} searchResults
 */
const SearchResults = ({searchResults}) => {
  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        {searchResults.map((searchResult, index) => (
          <div key={index}>
            <ResultItem searchResult={searchResult} />
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchResults;
