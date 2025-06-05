import React from 'react';
import {ELEMENT_ID} from '../constant/element-id.js';
import useEffectOnce from './useEffectOnce.js';

const useServerSideVariables = () => {
  // Sever data state
  const [serverSideData, setServerSideData] = React.useState(
    /** @type {ServerSideData} */ {
      languages: undefined,
      navigation: undefined,
      content: undefined,
      footer: undefined,
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
    }
  }, []);

  /**
   * Use effect once
   * Get server-side data
   */
  useEffectOnce(() => {
    setTimeout(getServerSideVariables, 100);
  });

  return {
    serverSideData,
  };
};

export default useServerSideVariables;
