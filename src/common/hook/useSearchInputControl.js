import React from 'react';
import useQueryParam, {toQueryString} from './useQueryParam.js';
import useEffectOnce from './useEffectOnce.js';

const useSearchInputControl = () => {
  // Search id
  const searchId = React.useId();

  // Search string value
  const searchKeyForU5cm = 'q'; // Why is it 'q' - this is the rule of U5CMS
  const [searchValue, setSearchValue] = useQueryParam(searchKeyForU5cm);

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
      location.href = `${path}?${toQueryString(params)}`;
    }
  }, [encodedSearchStr, searchValue]);

  /**
   * Set search value from server side data
   * This only executes once time
   */
  useEffectOnce(() => {
    // The 'fsearch' is element name of U5CMS
    if (document.fsearch) {
      const fsearch = Array.isArray(document.fsearch)
        ? document.fsearch[0]
        : document.fsearch;
      const searchValue = fsearch[searchKeyForU5cm]?.value;
      searchValue && setSearchValue(searchValue);
    }
  });

  return {
    searchId,
    searchValue,
    setSearchValue,
    encodedSearchStr,
    handleSubmit,
  };
};

export default useSearchInputControl;
