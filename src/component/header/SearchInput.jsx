import React from 'react';
import AppContext from '../../common/context/app/app.context.js';
import {useDebouncedCallback} from '@mantine/hooks';
import {ELEMENT_ID} from '../../common/constant/element-id.js';
import useClickAway from '../../common/hook/useClickAway.js';
import {useTranslation} from 'react-i18next';
import useSearchInputControl from '../../common/hook/useSearchInputControl.js';
import clsx from 'clsx';

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
  const {serverSideData, removeServerElement} = React.useContext(AppContext);

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
        <>
          <div
            className="hidden absolute"
            dangerouslySetInnerHTML={{
              __html: serverSideData.search.innerHTML,
            }}
          ></div>

          <div ref={searchContainerRef} className="search search--main">
            <div className="search__group" onClick={handleClickSearchBtn}>
              <h2 className="sr-only">{t('search')}</h2>
              <div className="form__group__input ">
                <label htmlFor="search-main">{t('search')}</label>
                <input
                  id={searchId}
                  type="search"
                  className={clsx(
                    'input--outline !my-0 !transition-all',
                    expanded
                      ? 'opacity-100 !w-44 sm:!w-72'
                      : 'opacity-0 !w-20 hover:border-transparent active:border-transparent cursor-pointer'
                  )}
                  autoComplete="off"
                  name="search-main"
                  placeholder={t('search')}
                  value={searchValue || ''}
                  onChange={({target: {value}}) => setSearchValue(value)}
                  onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
                />
              </div>
              <div className="search__button" title="Toggle search">
                <span className="search__button__title">{t('search')}</span>
                <svg
                  viewBox="0 0 24 24"
                  enableBackground="new 0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon--lg icon--Search search__button__icon"
                >
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="m13.3 12.8c1.9-2.2 1.7-5.6-.5-7.5s-5.6-1.7-7.5.5-1.7 5.6.5 7.5c2 1.7 4.9 1.7 6.9 0l6 6 .5-.5zm-4 1c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
