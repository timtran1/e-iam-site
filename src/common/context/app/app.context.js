import React from 'react';

/**
 * @typedef AppContext
 *
 * @property {ServerSideData} serverSideData
 * @property {Array<AppMenu>} menu
 * @property {Array<AppLanguage>} languages
 * @property {{backgroundImage?: string, headerHeight?: number}} headerMeta
 * @property {function} setHeaderMeta
 * @property {(id: string) => void} removeServerElement
 */

/**
 * @type {AppContext}
 */
const DefaultState = {
  serverSideData: {
    header: undefined,
    search: undefined,
    languages: undefined,
    navigation: undefined,
    footer: undefined,
    rightContent: undefined,
    newsContent: undefined,
    content: undefined,
  },
  menu: [],
  languages: [],
  headerMeta: {},
  setHeaderMeta: () => {},
  removeServerElement: () => {},
};

/**
 * @type {React.Context<AppContext>}
 */
const AppContext = React.createContext(DefaultState);

export default AppContext;
