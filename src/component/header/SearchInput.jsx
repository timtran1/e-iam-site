import React from 'react';
import AppContext from '../../common/context/app/app.context.js';
import {useDebouncedCallback} from '@mantine/hooks';
import {ELEMENT_ID} from '../../common/constant/element-id.js';
import useEffectOnce from '../../common/hook/useEffectOnce.js';

/**
 * Search input component
 * This should use for the header
 * After rendered it will delete the server element
 */
const SearchInput = React.memo(() => {
  // Get app context
  const {serverSideData, removeServerElement} = React.useContext(AppContext);

  // Search str from query param
  const [initSearchStr, setInitSearchStr] = React.useState('');

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
  const setInitSearchInput = useDebouncedCallback(() => {
    const setInput = (inputEle) => {
      if (inputEle) {
        // Check if the given input is an HTMLCollection (a live list of elements).
        if (inputEle instanceof HTMLCollection) {
          for (const ele of inputEle) {
            ele.q && (ele.q.value = initSearchStr);
          }
        } else {
          inputEle.q && (inputEle.q.value = initSearchStr);
        }
      }
    };

    setInput(document.fsearch);
    setInput(document.fsearch2);
  }, 500);

  /**
   * Handle server side data is rendered, delete server element after that
   */
  React.useEffect(() => {
    if (serverSideData.search?.innerHTML) {
      removeServerSearchElement();
      setInitSearchInput();
    }
  }, [
    removeServerSearchElement,
    serverSideData.search?.innerHTML,
    setInitSearchInput,
  ]);

  /**
   * Use effect once - to set init searching value to search inputs
   */
  useEffectOnce(() => {
    const params = new URLSearchParams(window.location.search);
    const searchStr = params.get('q') || ''; // Why is it 'q'? - this is the rule of U5CMS
    searchStr && setInitSearchStr(searchStr);
  });

  return (
    <>
      {!!serverSideData.search && (
        <div
          className="min-w-40 mx-3"
          dangerouslySetInnerHTML={{__html: serverSideData.search.innerHTML}}
        ></div>
      )}
    </>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
