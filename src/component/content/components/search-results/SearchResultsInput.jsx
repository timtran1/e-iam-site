import React from 'react';
import {useTranslation} from 'react-i18next';
import clsx from 'clsx';
import useSearchInputControl from '../../../../common/hook/useSearchInputControl.js';
import useEffectOnce from '../../../../common/hook/useEffectOnce.js';

/**
 * Search input component for search results page only
 * This component is specifically designed for use within the search results layout
 *
 * @param {Object} props
 * @param {string} props.className
 * @param {string} props.userSearchTerm - Term of the user, set when U5CMS has replaced it in its search inputs
 * @returns {JSX.Element}
 */
const SearchResultsInput = ({className = '', userSearchTerm = ''}) => {
  // Translation
  const {t} = useTranslation();

  // Search input control
  const {searchId, searchValue, setSearchValue, handleSubmit} =
    useSearchInputControl();

  /**
   * U5CMS writes the replacement of a search term without hits into its search inputs
   * Keep the term of the user in the textfield instead
   */
  React.useEffect(() => {
    if (userSearchTerm) {
      setSearchValue(userSearchTerm);
    }
  }, [userSearchTerm, setSearchValue]);

  /**
   * The textfield is active when the user arrives on the page
   */
  const inputRef = React.useRef(null);
  useEffectOnce(() => {
    inputRef.current?.focus({preventScroll: true});
  });

  return (
    <div className={clsx('relative', className)}>
      <input
        ref={inputRef}
        id={searchId}
        type="text"
        className={clsx(
          'border-[var(--Color-Textfield-Focus,#8655F6)] hover:border-[var(--Color-Textfield-Focus,#8655F6)] hover:outline-[var(--Color-Textfield-Focus,#8655F6)] focus:border-[var(--Color-Textfield-Focus,#8655F6)] focus:outline-[var(--Color-Textfield-Focus,#8655F6)]'
        )}
        placeholder={t('searchTerm')}
        value={searchValue || ''}
        onChange={({target: {value}}) => setSearchValue(value)}
        onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
      />
      <button
        className="absolute right-5 top-1/2 -translate-y-1/2 flex text-[var(--Color-Font-Main,#1F2937)]"
        onClick={handleSubmit}
        aria-label={t('Search button')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M13.2999 12.8002C15.1999 10.6002 14.9999 7.20016 12.7999 5.30016C10.5999 3.40016 7.19992 3.60016 5.29992 5.80016C3.39992 8.00016 3.59992 11.4002 5.79992 13.3002C7.79992 15.0002 10.6999 15.0002 12.6999 13.3002L18.6999 19.3002L19.1999 18.8002L13.2999 12.8002ZM9.29992 13.8002C6.79992 13.8002 4.79992 11.8002 4.79992 9.30016C4.79992 6.80016 6.79992 4.80016 9.29992 4.80016C11.7999 4.80016 13.7999 6.80016 13.7999 9.30016C13.7999 11.8002 11.7999 13.8002 9.29992 13.8002Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchResultsInput;
