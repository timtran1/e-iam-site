import React from 'react';
import AppContext from '../../common/context/app/app.context.js';
import {useDebouncedCallback} from '@mantine/hooks';
import {ELEMENT_ID} from '../../common/constant/element-id.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import useQueryParam from '../../common/hook/useQueryParam.js';
import clsx from 'clsx';
import useClickAway from '../../common/hook/useClickAway.js';

/**
 * Search input component
 * This should use for the header
 * After rendered it will delete the server element
 */
const SearchInput = React.memo(() => {
  // Search id
  const searchId = React.useId();

  // Search string value
  const searchKeyForU5cm = 'q'; // Why is it 'q' - this is the rule of U5CMS
  const searchKeyForDisplay = 'q2';
  const [searchValue, setSearchValue] = useQueryParam(searchKeyForDisplay);

  // Search input control
  const [expanded, setExpanded] = React.useState(false);
  const searchContainerRef = React.useRef(null);
  useClickAway(searchContainerRef, () => setExpanded(false));

  // Encoded search string, using for u5cms engine (@see window.fsearch)
  const encodedSearchStr = React.useMemo(
    () => escape(searchValue?.replace(/ /g, ',')?.replace(/\+/g, ',') || ''),
    [searchValue]
  );

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
   * Handle submit search
   * Why's that fsearch (for header), fsearch2 (for content) - this is element name of U5CMS
   * @type {function(): void}
   */
  const handleSubmit = React.useCallback(() => {
    const fsearch = document.fsearch;
    if (fsearch) {
      fsearch.q.value = searchValue;
      const href =
        fsearch.action.split(`javascript:location.href='`)?.[1] || 'index.php?';
      const [path, paramsStr] = href.split('?');
      const params = new URLSearchParams(paramsStr);
      params.set(searchKeyForU5cm, encodedSearchStr);
      params.set(searchKeyForDisplay, searchValue);
      location.href = `${path}?${params.toString()}`;
    }
  }, [encodedSearchStr, searchValue]);

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
                'hidden md:block',
                'py-0 pr-6 transition opacity-0',
                {
                  'opacity-100': !expanded,
                }
              )}
            >
              Suche
            </label>

            <input
              id={searchId}
              type="text"
              className={clsx(
                'absolute top-1/2 -translate-y-1/2 right-0',
                'rounded-none border-2 border-opacity-90',
                'border-blue-cornflower hover:border-blue-cornflower active:border-blue-cornflower focus:outline-blue-cornflower',
                'pl-2 !pr-8 py-1 transition-all',
                expanded
                  ? 'opacity-100 !w-44 sm:!w-56'
                  : 'opacity-0 !w-20 hover:border-transparent active:border-transparent cursor-pointer'
              )}
              placeholder="Suche"
              onChange={({target: {value}}) => setSearchValue(value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div
            className="absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer"
            onClick={() => setExpanded((prevState) => !prevState)}
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
