import React from 'react';
import AppContext from '../../common/context/app/app.context.js';
import {useDebouncedCallback} from '@mantine/hooks';
import {ELEMENT_ID} from '../../common/constant/element-id.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
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
        <div className="relative" ref={searchContainerRef}>
          <div
            className="hidden absolute"
            dangerouslySetInnerHTML={{
              __html: serverSideData.search.innerHTML,
            }}
          ></div>

          <div onClick={() => setExpanded(true)}>
            <label
              htmlFor={searchId}
              tabIndex="-1"
              className={clsx(
                'hidden sm:block',
                'py-0 pr-6 transition opacity-0',
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
                  ? 'opacity-100 !w-44 sm:!w-56'
                  : 'opacity-0 !w-20 hover:border-transparent active:border-transparent cursor-pointer'
              )}
              placeholder={t('search')}
              value={searchValue || ''}
              onChange={({target: {value}}) => setSearchValue(value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div
            className="absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer"
            onClick={handleClickSearchBtn}
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="w-4 h-4 px-1 text-gray-chateau-2"
            />
          </div>
        </div>
      )}
    </>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
