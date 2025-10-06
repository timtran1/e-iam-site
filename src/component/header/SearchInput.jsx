import React from 'react';
import AppContext from '../../common/context/app/app.context.js';
import {useDebouncedCallback} from '@mantine/hooks';
import {ELEMENT_ID} from '../../common/constant/element-id.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import useQueryParam from '../../common/hook/useQueryParam.js';

/**
 * Search input component
 * This should use for the header
 * After rendered it will delete the server element
 */
const SearchInput = React.memo(() => {
  // Search string value
  const searchKeyForU5cm = 'q'; // Why is it 'q' - this is the rule of U5CMS
  const searchKeyForDisplay = 'q2';
  const [searchValue, setSearchValue] = useQueryParam(searchKeyForDisplay);

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
        <div className="relative mx-2 md:mx-4 lg:mx-6 2xl:mx-8">
          <div
            className="hidden absolute"
            dangerouslySetInnerHTML={{__html: serverSideData.search.innerHTML}}
          ></div>
          <input
            className="w-32 xl:w-44 2xl:w-64 text-xs rounded-none pl-8 pr-2 py-1.5 border-gray-athens-gray active:!border-gray-100 focus:!border-gray-100"
            placeholder="Search"
            value={searchValue}
            onChange={({target: {value}}) => setSearchValue(value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute w-6 h-4 px-1.5 left-0 top-0 translate-y-1/2 text-gray-chateau-2"
          />
        </div>
      )}
    </>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
