import {useTranslation} from 'react-i18next';
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
    <>
      <div className="search search--large search--page-result">
        <div className="search__group">
          <input
            id={searchId}
            type="search"
            autoComplete="off"
            placeholder={t('searchTerm')}
            className="!my-0"
            value={searchValue || ''}
            onChange={({target: {value}}) => setSearchValue(value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
          />
          <button
            type="button"
            className="btn btn--bare btn--lg btn--icon-only"
            onClick={handleSubmit}
          >
            <svg
              viewBox="0 0 24 24"
              enableBackground="new 0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon--base icon--Search btn__icon"
            >
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="m13.3 12.8c1.9-2.2 1.7-5.6-.5-7.5s-5.6-1.7-7.5.5-1.7 5.6.5 7.5c2 1.7 4.9 1.7 6.9 0l6 6 .5-.5zm-4 1c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"
              ></path>
            </svg>
            <span className="btn__text">Ämter filtern</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchResultsInput;
