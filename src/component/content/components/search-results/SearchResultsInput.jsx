import {useTranslation} from 'react-i18next';
import clsx from 'clsx';
import useSearchInputControl from '../../../../common/hook/useSearchInputControl.js';

/**
 * Search input component for search results page only
 * This component is specifically designed for use within the search results layout
 *
 * @returns {JSX.Element}
 */
const SearchResultsInput = () => {
  // Translation
  const {t} = useTranslation();

  // Search input control
  const {searchId, searchValue, setSearchValue, handleSubmit} =
    useSearchInputControl();

  return (
    <div className="relative max-w-[62rem]">
      <input
        id={searchId}
        type="text"
        className={clsx(
          'w-full !p-4 !pr-12 rounded-none',
          'border-3 hover:border-3 active:border-3 focus:border-3',
          'border-blue-cornflower hover:border-blue-cornflower hover:outline-blue-cornflower',
          'focus:border-blue-cornflower focus:outline-blue-cornflower'
        )}
        placeholder={t('searchTerm')}
        value={searchValue || ''}
        onChange={({target: {value}}) => setSearchValue(value)}
        onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
      />
      <button
        className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
        onClick={handleSubmit}
      >
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
  );
};

export default SearchResultsInput;
