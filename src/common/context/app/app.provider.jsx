import React from 'react';
import AppContext from './app.context.js';
import useServerSideVariables from '../../hook/useServerSideVariables.js';
import {DUMMY_MENU} from '../../constant/dummy.js';
import {parseMenu} from '../../helper/element-parsing.js';

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
   * @type {Array<AppMenu>}
   */
  const menu = React.useMemo(() => {
    return DUMMY_MENU;
    if (serverSideData.navigation) {
      return parseMenu(serverSideData.navigation.querySelector('ul'));
    } else {
      return [];
    }
  }, [serverSideData.navigation]);

  return (
    <>
      <AppContext.Provider
        value={{
          serverSideData,
          menu,
        }}
      >
        {children}
      </AppContext.Provider>
    </>
  );
};

export default AppProvider;
