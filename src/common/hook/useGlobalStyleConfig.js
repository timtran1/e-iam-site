import {useState, useEffect, useMemo} from 'react';

const useGlobalStyleConfig = () => {
  // Track current path
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Listen for location changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

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

  /**
   * Whether the current page is formdatadel page
   * @example https://docs-r.eiam.swiss/formdatadel.php?n=f%21eiamglossary%21edit&id=15107&l=en
   *
   * @type {boolean}
   */
  const isFormDataDelPage = useMemo(() => {
    return /formdatadel\.php/.test(currentPath);
  }, [currentPath]);

  useEffect(() => {
    if (isFormDataDelPage) {
      // Select all button elements that are direct children of body and apply styles to delete buttons
      const deleteButtons = Array.from(
        document.querySelectorAll('body > button[type="button"]')
      ).filter(
        (button) => button.textContent.trim().toLowerCase() === 'delete'
      );
      deleteButtons.forEach((button) => {
        button.style.textAlign = 'end';
      });
      const sbmtbttn = document.getElementById('sbmtbttn');
      if (sbmtbttn) {
        sbmtbttn.style.setProperty('border-radius', '0', 'important');
        sbmtbttn.style.setProperty(
          'border',
          '1px solid #e5e7eb !important',
          'important'
        );
      }
    }
  }, [isFormDataDelPage]);

  return {
    isFormDataDelPage,
  };
};

export default useGlobalStyleConfig;
