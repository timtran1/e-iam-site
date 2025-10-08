import {useTranslation} from 'react-i18next';
import clsx from 'clsx';
import {VIEW_MODE} from './constants.js';

/**
 * Layout component for search results page
 *
 * @param {Object} props
 * @param {number} props.resultsCount - Number of search results
 * @param {React.ReactNode} props.children - Results content to render
 * @param {string} props.searchTerm - Current search term for empty state
 * @param {string} props.viewMode
 * @param props.setViewMode
 */
const SearchResultsLayout = ({
  resultsCount,
  children,
  searchTerm = '',
  viewMode,
  setViewMode,
}) => {
  // Translation
  const {t} = useTranslation();

  return (
    <div className="w-full">
      {/* Search Header Section */}
      <div className="bg-gray-100 px-4 py-8 md:px-8 lg:px-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{t('search')}</h1>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            className={clsx(
              'w-full !p-4 !pr-12 rounded-none',
              'border-blue-cornflower hover:border-blue-cornflower hover:outline-blue-cornflower',
              'focus:border-blue-cornflower focus:outline-blue-cornflower'
            )}
            placeholder={t('search')}
          />
          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Results Info Bar */}
      <div className="border-b border-gray-300 px-4 py-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Results Count */}
          <div className="text-gray-700">
            {resultsCount} {t('searchResults')}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Divider */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* View Toggle Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode(VIEW_MODE.List)}
                className={`p-2 rounded transition ${
                  viewMode === VIEW_MODE.List
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="List view"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode(VIEW_MODE.Grid)}
                className={`p-2 rounded transition ${
                  viewMode === VIEW_MODE.Grid
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="py-8">
        {resultsCount === 0 ? (
          /* Empty State */
          <div className="px-4 py-8 md:px-8 lg:px-12 max-w-2xl">
            <h2 className="text-xl font-semibold mb-6">
              {t('noMatchesFor', {searchTerm})}
            </h2>
            <div className="space-y-4">
              <h3 className="font-semibold">{t('searchTips')}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>{t('checkSpelling')}</li>
                <li>{t('useDifferentTerm')}</li>
                <li>{t('useFewerTerms')}</li>
                <li>{t('useAnotherSite')}</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Results Grid */
          <>{children}</>
        )}
      </div>
    </div>
  );
};

export default SearchResultsLayout;
