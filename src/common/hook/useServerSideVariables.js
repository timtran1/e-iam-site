import React from 'react';
import {ELEMENT_ID} from '../constant/element-id.js';
import {isEmptyElement} from '../helper/element-parsing.js';
import useEffectOnce from './useEffectOnce.js';

// Configuration constants for server-side data fetching
const RENDER_CONFIG = {
  DEBOUNCE_DELAY: 330, // Interval between polling attempts (ms)
  POLLING_TIMEOUT: 5000, // Maximum time to poll before giving up (ms)
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
        setServerSideData((prevState) => {
          return {
            ...prevState,
            [eleId]: prevState[eleId] || ele, // Only update if the ele of eleId is not existed
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
   * Effect to handle u5form element conflicts between React and u5cms
   *
   * This effect prevents duplication of u5form elements by removing them from the original
   *
   * The effect compares u5form elements in both the current DOM and the server-side content,
   * and removes duplicates from the original element to maintain form functionality.
   */
  React.useEffect(() => {
    if (serverSideData.content) {
      const ele = document.querySelector(`#${ELEMENT_ID.CONTENT}`);
      if (ele) {
        // Remove u5form on original element to avoid duplication
        const u5formStateTemplate = ele.querySelectorAll('[name="u5form"]');
        const u5formState =
          serverSideData.content.querySelectorAll('[name="u5form"]');
        if (u5formState.length && u5formStateTemplate.length) {
          u5formStateTemplate.forEach((item) => item.remove());
        }
      }
    }
  }, [serverSideData.content]);

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
