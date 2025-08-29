import {useCallback, useState} from 'react';
import Cookies from 'js-cookie';

/**
 * A React hook to read, set, and delete a cookie by name using js-cookie.
 *
 * @param {string} cookieName - The name/key of the cookie to manage.
 */
const useCookie = (cookieName) => {
  // Initialize state from current cookie value (or null if missing)
  const [value, setValue] = useState(() => Cookies.get(cookieName) || null);

  // Update cookie value and keep React state in sync
  const updateCookie = useCallback(
    (newValue, options) => {
      // options follows js-cookie CookieAttributes (e.g., expires, path, secure, sameSite)
      Cookies.set(cookieName, newValue, options);
      setValue(newValue);
    },
    [cookieName]
  );

  // Remove cookie and reset state to null
  const deleteCookie = useCallback(() => {
    Cookies.remove(cookieName);
    setValue(null);
  }, [cookieName]);

  return [value, updateCookie, deleteCookie];
};

export default useCookie;
