import React from 'react';
import AppContext from '../../common/context/app/app.context.js';
import {useDebouncedCallback} from '@mantine/hooks';
import {ELEMENT_ID} from '../../common/constant/element-id.js';
import clsx from 'clsx';
import useClickAway from '../../common/hook/useClickAway.js';
import {useTranslation} from 'react-i18next';
import useSearchInputControl from '../../common/hook/useSearchInputControl.js';

/**
 * Search input component
 * This should use for the header
 * After rendered it will delete the server element
 */
const SearchInput = React.memo(() => {
  // Translation
  const {t} = useTranslation();

  // Search input control
  const {searchId, searchValue, setSearchValue, handleSubmit} =
    useSearchInputControl();

  // Search input control
  const [expanded, setExpanded] = React.useState(false);
  const searchContainerRef = React.useRef(null);
  useClickAway(searchContainerRef, () => setExpanded(false));

  // Get app context
  const {serverSideData, removeServerElement, hasRemovedServerElements} =
    React.useContext(AppContext);

  /**
   * Remove server search element after debounced time
   */
  const removeServerSearchElement = useDebouncedCallback(() => {
    removeServerElement(ELEMENT_ID.SEARCH);
  }, 500);

  /**
   * Set value for both search header input and search content input after debounced time
   * Why's that fsearch (for header), fsearch2 (for content) - this is element name of U5CMS
   */
  const setSearchInput = useDebouncedCallback(() => {
    // Setting function
    const setInput = (inputEle) => {
      if (inputEle) {
        // Check if the given input is an HTMLCollection (a live list of elements).
        if (inputEle instanceof HTMLCollection) {
          for (const ele of inputEle) {
            ele.q && (ele.q.value = searchValue);
          }
        } else {
          inputEle.q && (inputEle.q.value = searchValue);
        }
      }
    };

    setInput(document.fsearch);
    setInput(document.fsearch2);
  }, 500);

  /**
   * Handle click search button icon
   * @type {function(): void}
   */
  const handleClickSearchBtn = React.useCallback(() => {
    if (!expanded) {
      setExpanded(true);
    } else {
      handleSubmit();
    }
  }, [expanded, handleSubmit]);

  /**
   * Handle server side data is rendered, delete server element after that
   */
  React.useEffect(() => {
    if (serverSideData.search?.innerHTML) {
      removeServerSearchElement();
      setSearchInput();
    }
  }, [
    removeServerSearchElement,
    serverSideData.search?.innerHTML,
    setSearchInput,
  ]);

  return (
    <>
      {!!serverSideData.search && (
        <div
          {...(hasRemovedServerElements ? {id: ELEMENT_ID.SEARCH} : {})}
          className="relative"
          ref={searchContainerRef}
        >
          <div
            className="hidden absolute"
            dangerouslySetInnerHTML={{
              __html: serverSideData.search.innerHTML,
            }}
          ></div>

          <div onClick={() => setExpanded(true)}>
            <label
              htmlFor={searchId}
              onFocus={() => setExpanded(true)}
              className={clsx(
                'hidden xl:block',
                'py-0 pr-6 transition opacity-0 cursor-pointer',
                {
                  'opacity-100': !expanded,
                }
              )}
            >
              {t('search')}
            </label>

            <input
              id={searchId}
              type="text"
              className={clsx(
                'absolute top-1/2 -translate-y-1/2 right-0',
                'rounded-none border-3 border-opacity-90',
                'border-blue-cornflower hover:border-blue-cornflower active:border-blue-cornflower focus:border-blue-cornflower focus:outline-blue-cornflower',
                '!pl-3 !pr-8 !py-1.5 transition-all',
                expanded
                  ? 'opacity-100 !w-44 xl:!w-56'
                  : 'opacity-0 !w-20 hover:border-transparent active:border-transparent cursor-pointer'
              )}
              placeholder={t('search')}
              value={searchValue || ''}
              onChange={({target: {value}}) => setSearchValue(value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
              onFocus={() => setExpanded(true)}
            />
          </div>

          <div
            className="absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer"
            onClick={handleClickSearchBtn}
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
                fill="black"
              />
            </svg>
          </div>
        </div>
      )}
    </>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
