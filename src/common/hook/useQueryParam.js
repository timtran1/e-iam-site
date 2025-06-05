import React from 'react';

/**
 * Use query param
 *
 * @param {string} key
 * @returns {string | null}
 */
const useQueryParam = (key) => {
  // Value state
  const [value, setValue] = React.useState(null);

  /**
   * Use effect to detect window location changes
   */
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setValue(params.get(key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, window.location.search]);

  return value;
};

export default useQueryParam;
