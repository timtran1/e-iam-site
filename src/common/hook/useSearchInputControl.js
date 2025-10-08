import React from 'react';
import useQueryParam from './useQueryParam.js';

const useSearchInputControl = () => {
  // Search id
  const searchId = React.useId();

  // Search string value
  const searchKeyForU5cm = 'q'; // Why is it 'q' - this is the rule of U5CMS
  const searchKeyForDisplay = 'q2';
  const [searchValue, setSearchValue] = useQueryParam(searchKeyForDisplay);

  // Encoded search string, using for u5cms engine (@see window.fsearch)
  const encodedSearchStr = React.useMemo(
    () => escape(searchValue?.replace(/ /g, ',')?.replace(/\+/g, ',') || ''),
    [searchValue]
  );

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

  return {
    searchId,
    searchValue,
    setSearchValue,
    encodedSearchStr,
    handleSubmit,
  };
};

export default useSearchInputControl;
