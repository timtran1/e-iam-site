import React from 'react';

/**
 * Use query param hook - provides both getter and setter for URL query parameters
 *
 * @param {string} key - The query parameter key
 * @returns {[string | null, function]} - Returns [value, setValue] tuple
 */
const useQueryParam = (key) => {
  // Value state
  const [value, setValue] = React.useState(null);

  // Ref to track if we're updating from internal setValue to prevent infinite loop
  const isUpdatingRef = React.useRef(false);

  /**
   * Custom setValue function that updates both state and URL query param
   *
   * @param {string | null} newValue - New value for the query parameter
   */
  const setQueryParam = React.useCallback(
    (newValue) => {
      // Set flag to prevent useEffect from triggering
      isUpdatingRef.current = true;

      // Update state immediately
      setValue(newValue);

      // Update URL query parameter
      const url = new URL(window.location);
      const params = url.searchParams;

      if (newValue === null || newValue === undefined || newValue === '') {
        // Remove parameter if value is null/undefined/empty
        params.delete(key);
      } else {
        // Set parameter value
        params.set(key, newValue);
      }

      // Update URL without page reload
      const newUrl = `${url.pathname}${params.toString() ? '?' + params.toString() : ''}${url.hash}`;
      window.history.replaceState({}, '', newUrl);
    },
    [key]
  );

  /**
   * Use effect to detect window location changes and sync with state
   */
  React.useEffect(() => {
    // Skip if we're currently updating the URL from setValue
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get(key);
    setValue(paramValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, window.location.search]);

  return [value, setQueryParam];
};

export default useQueryParam;
