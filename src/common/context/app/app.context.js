import React from 'react';

/**
 * @typedef AppContext
 *
 * @property {ServerSideData} serverSideData
 * @property {Array<AppMenu>} menu
 * @property {Array<AppLanguage>} languages
 * @property {{backgroundImage?: string, headerHeight?: number}} headerMeta
 * @property setHeaderMeta
 */

/**
 * @type {AppContext}
 */
const DefaultState = {
  serverSideData: {
    languages: undefined,
    navigation: undefined,
    footer: undefined,
    rightContent: undefined,
    content: undefined,
  },
  menu: [],
  languages: [],
  headerMeta: {},
  setHeaderMeta: () => {},
};

/**
 * @type {React.Context<AppContext>}
 */
const AppContext = React.createContext(DefaultState);

export default AppContext;
