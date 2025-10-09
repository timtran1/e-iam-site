import React from 'react';
import {ELEMENT_ID} from '../../../constant/element-id.js';
import {isEmptyElement} from '../../../helper/element-parsing.js';
import useEffectOnce from '../../../hook/useEffectOnce.js';
import {cloneIframe} from '../../../helper/iframe.js';

// Configuration constants for server-side data fetching
const RENDER_CONFIG = {
  DEBOUNCE_DELAY: 330, // Interval between polling attempts (ms)
  POLLING_TIMEOUT: 5000, // Maximum time to poll before giving up (ms)
};

/**
 * Handle element content
 *
 * @param {Element} ele
 * @param {Element} clonedEle
 */
const handleElementContent = (ele, clonedEle) => {
  // Clone form pre-fill iframe
  const ifrMonoFillIframe = ele.querySelector('[name="ifrmonofill"]');
  if (ifrMonoFillIframe) {
    clonedEle.querySelector('[name="ifrmonofill"]')?.remove();
    clonedEle.appendChild(cloneIframe(ifrMonoFillIframe));
  }

  // Remove original u5forms to avoid conflicts between React and U5CMS
  const u5formState = ele.querySelectorAll('[name="u5form"]');
  if (u5formState.length) {
    u5formState.forEach((item) => item.remove());
  }
};

/**
 * Custom hook - to get the server-side variables
 */
const useServerSideVariables = () => {
  // Server data state
  const [serverSideData, setServerSideData] = React.useState(
    /** @type {ServerSideData} */ {
      languages: undefined,
      navigation: undefined,
      content: undefined,
      footer: undefined,
      right: undefined,
    }
  );

  // Ref to store interval ID for cleanup
  const intervalRef = React.useRef(null);

  /**
   * Get server side variables for elements that are not empty
   */
  const getServerSideVariables = React.useCallback(() => {
    if (!document) return;

    Object.values(ELEMENT_ID).forEach((eleId) => {
      // Get element
      const ele = document.querySelector(`#${eleId}`);

      // Only update state if element is not empty
      if (!isEmptyElement(ele)) {
        // Clone sever site element
        const clonedEle = ele.cloneNode(true);

        // Handle element before assigning to state
        switch (eleId) {
          case ELEMENT_ID.CONTENT:
            handleElementContent(ele, clonedEle);
            break;
          default:
            break;
        }

        // Update state
        setServerSideData((prevState) => {
          return {
            ...prevState,
            [eleId]: prevState[eleId] || clonedEle, // Only update if the ele of eleId is not existed
          };
        });
      }
    });
  }, []);

  /**
   * Remove DOM elements immediately after data collection is complete
   */
  const removeElements = React.useCallback(() => {
    Object.values(ELEMENT_ID).forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.remove();
      }
    });
  }, []);

  /**
   * Start polling for server side data with debounce mechanism
   */
  const startPolling = React.useCallback(() => {
    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start interval to check for data with debounced delay
    intervalRef.current = setInterval(() => {
      getServerSideVariables();
    }, RENDER_CONFIG.DEBOUNCE_DELAY);

    // Safety timeout - stop polling after configured timeout regardless
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        removeElements();
      }
    }, RENDER_CONFIG.POLLING_TIMEOUT);
  }, [getServerSideVariables, removeElements]);

  /**
   * Use effect once
   * Start polling for server-side data
   */
  useEffectOnce(() => {
    startPolling();
  });

  /**
   * Cleanup effect
   */
  React.useEffect(() => {
    return () => {
      // Cleanup intervals on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    serverSideData,
  };
};

export default useServerSideVariables;
