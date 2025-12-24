import {useEffect, useMemo} from 'react';
import useQueryParam from './useQueryParam.js';

const useGlobalStyleConfig = () => {
  // Get current page params. 'c' and 'n' are the query params for specific page (this is business structure)
  const [cParam] = useQueryParam('c');
  const [nParam] = useQueryParam('n');

  /**
   * Whether the current page is formdatadel page
   * @example https://exp-domain.swiss/formdatadel.php?n=f%21eiamglossary%21edit
   *
   * @type {boolean}
   */
  const isInFormDataActionPage = useMemo(() => {
    return [cParam, nParam].includes('f!eiamglossary!edit');
  }, [cParam, nParam]);

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
