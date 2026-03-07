import React from 'react';

/**
 * Use query param hook - reads a URL query parameter and keeps it in sync with state
 *
 * @param {string} key - The query parameter key
 * @returns {[string | null, function]} - Returns [value, setValue] tuple
 */
const useQueryParam = (key) => {
  const [value, setValue] = React.useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  });

  /**
   * Use effect to detect window location changes and sync with state
   */
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get(key);
    setValue(paramValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, window.location.search]);

  return [value, setValue];
};

export default useQueryParam;
