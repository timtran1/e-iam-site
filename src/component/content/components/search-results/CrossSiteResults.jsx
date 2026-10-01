import ResultItem from './ResultItem.jsx';
import {VIEW_MODE} from './constants.js';

/**
 * Render the search results of another site
 *
 * @param {Object} props
 * @param {string} props.title - Heading of U5CMS, which contains the domain
 * @param {string} props.domain - Site the results come from
 * @param {Array<SearchResult>} props.searchResults
 */
const CrossSiteResults = ({title, domain, searchResults}) => {
  // Keep the wording of U5CMS, only the domain gets its own style
  const [beforeDomain, afterDomain] = title.includes(domain)
    ? title.split(domain)
    : ['', ''];

  return (
    <div className="search-result search-result--cross-site">
      {/* Header which indicates where the results come from */}
      <div className="search-result__input-container">
        <div className="search-result__input-content">
          <div
            role="heading"
            aria-level={2}
            className="search-result__cross-site-label"
          >
            {beforeDomain}
            <i>{domain}</i>
            {afterDomain}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1">
        {searchResults.map((searchResult, index) => (
          <div key={index}>
            <ResultItem
              crossSite
              viewMode={VIEW_MODE.List}
              searchResult={searchResult}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrossSiteResults;
