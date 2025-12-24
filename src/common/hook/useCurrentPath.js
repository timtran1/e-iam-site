import {useState, useEffect} from 'react';

/**
 * Custom hook to track the current path and listen for location changes
 * Handles both browser navigation (popstate) and programmatic navigation (pushState/replaceState)
 *
 * @returns {string} The current pathname from window.location
 */
const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handleLocationChange);

    // Override history methods to detect programmatic navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return currentPath;
};

export default useCurrentPath;
