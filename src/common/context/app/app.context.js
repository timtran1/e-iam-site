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
 * @property {boolean} hasRemovedServerElements
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
    right: undefined,
    news: undefined,
    content: undefined,
    bit: undefined,
  },
  menu: [],
  languages: [],
  headerMeta: {},
  setHeaderMeta: () => {},
  removeServerElement: () => {},
  hasRemovedServerElements: false,
};

/**
 * @type {React.Context<AppContext>}
 */
const AppContext = React.createContext(DefaultState);

export default AppContext;
