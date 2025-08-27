import React from 'react';
import {ELEMENT_ID} from '../constant/element-id.js';
import useEffectOnce from './useEffectOnce.js';

/**
 * Custom hook - to get the server-side variables
 */
const useServerSideVariables = () => {
  // Flag to mark where the variable has been read
  const [hasGotten, setHasGotten] = React.useState(false);

  // Sever data state
  const [serverSideData, setServerSideData] = React.useState(
    /** @type {ServerSideData} */ {
      languages: undefined,
      navigation: undefined,
      content: undefined,
      footer: undefined,
      right: undefined,
    }
  );

  /**
   * Get sever side variables
   *
   * @type {() => void}
   */
  const getServerSideVariables = React.useCallback(() => {
    if (document) {
      Object.values(ELEMENT_ID).forEach((eleId) => {
        const ele = document.querySelector(`#${eleId}`);
        setServerSideData((prevState) => ({
          ...prevState,
          [eleId]: ele || null,
        }));
      });
      setHasGotten(true);
    }
  }, []);

  /**
   * Use effect once
   * Get server-side data
   */
  useEffectOnce(() => {
    setTimeout(getServerSideVariables, 100);
  });

  /**
   * Use effect to delete variables html region
   */
  React.useEffect(() => {
    if (hasGotten) {
      setTimeout(() => {
        Object.values(ELEMENT_ID).forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            element.remove();
          }
        });
      }, 1750); // Delete the server element hook ids after a while to make sure there is no any change.
    }
  }, [hasGotten]);

  return {
    serverSideData,
  };
};

export default useServerSideVariables;
