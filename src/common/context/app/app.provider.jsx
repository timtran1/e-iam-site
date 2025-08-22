import React from 'react';
import AppContext from './app.context.js';
import useServerSideVariables from '../../hook/useServerSideVariables.js';
import {parseLangEle, parseMenuEle} from '../../helper/element-parsing.js';

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

  const content = React.useMemo(() => {
    if (serverSideData.content) {
      return serverSideData.content.innerHTML;
    } else {
      return null;
    }
  }, [serverSideData.content]);

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
        }}
      >
        {children}
      </AppContext.Provider>
    </>
  );
};

export default AppProvider;
