import {useEffect, useMemo} from 'react';
import useCurrentPath from './useCurrentPath';

const useGlobalStyleConfig = () => {
  // Get current path
  const currentPath = useCurrentPath();

  /**
   * Whether the current page is formdatadel page
   * @example https://exp-domain.swiss/formdatadel.php?n=f%21eiamglossary
   *
   * @type {boolean}
   */
  const isInFormDataActionPage = useMemo(() => {
    return (
      /formdatadel\.php/.test(currentPath) ||
      /formdataedit\.php/.test(currentPath)
    );
  }, [currentPath]);

  useEffect(() => {
    if (isInFormDataActionPage) {
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
  }, [isInFormDataActionPage]);

  return {
    isFormDataDelPage: isInFormDataActionPage,
  };
};

export default useGlobalStyleConfig;
