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

  /**
   * Get header meta
   * @type {{backgroundImage: string}|{}}
   */
  const headerMeta = React.useMemo(() => {
    if (serverSideData && serverSideData.header) {
      const backgroundImage = window.getComputedStyle(
        serverSideData.header
      ).backgroundImage;
      return {backgroundImage};
    } else {
      return {};
    }
  }, [serverSideData]);

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

  return (
    <>
      <AppContext.Provider
        value={{
          serverSideData,
          headerMeta,
          menu,
          languages,
        }}
      >
        {children}
      </AppContext.Provider>
    </>
  );
};

export default AppProvider;
