import React from 'react';
import AppContext from './app.context.js';
import useServerSideVariables from '../../hook/useServerSideVariables.js';
import {parseLangEle, parseMenuEle} from '../../helper/element-parsing.js';
import {ELEMENT_ID} from '../../constant/element-id.js';

/**
 * App data context
 *
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const AppProvider = ({children}) => {
  // Get server-side data
  const {serverSideData} = useServerSideVariables();

  // Header meta state
  const [headerMeta, setHeaderMeta] = React.useState({});

  /**
   * @type {Array<AppMenu>}
   */
  const menu = React.useMemo(() => {
    if (serverSideData.navigation) {
      return parseMenuEle(serverSideData.navigation.querySelector('ul'));
    } else {
      return [];
    }
  }, [serverSideData.navigation]);

  /**
   * @type {Array<AppLanguage>}
   */
  const languages = React.useMemo(() => {
    if (serverSideData.languages) {
      return parseLangEle(serverSideData.languages);
    } else {
      return [];
    }
  }, [serverSideData.languages]);

  /**
   * @type {string|null}
   */
  const rightContent = React.useMemo(() => {
    if (serverSideData.right) {
      return serverSideData.right.innerHTML;
    } else {
      return null;
    }
  }, [serverSideData.right]);

  /**
   * @type {string}
   */
  const content = React.useMemo(() => {
    if (serverSideData.content) {
      return serverSideData.content.innerHTML;
    } else {
      return null;
    }
  }, [serverSideData.content]);

  /**
   * Remove sever element by id
   *
   * @type {(id: string) => void}
   */
  const removeServerElement = React.useCallback((id) => {
    if (Object.values(ELEMENT_ID).includes(id)) {
      const ele = document.getElementById(id);
      if (ele) {
        ele.remove();
      }
    } else {
      console.warn(
        `Have not removed element ${id} - it should be one of ELEMENT_ID`
      );
    }
  }, []);

  /**
   * Get header meta
   * @type {{backgroundImage: string}|{}}
   */
  React.useEffect(() => {
    if (serverSideData && serverSideData.header) {
      const backgroundImage = window.getComputedStyle(
        serverSideData.header
      ).backgroundImage;
      setHeaderMeta((prevState) => ({
        ...prevState,
        backgroundImage,
      }));
    }
  }, [serverSideData]);

  return (
    <>
      <AppContext.Provider
        value={{
          serverSideData,
          menu,
          languages,
          rightContent,
          content,
          headerMeta,
          setHeaderMeta,
          removeServerElement,
        }}
      >
        {children}
      </AppContext.Provider>
    </>
  );
};

export default AppProvider;
