import React from 'react';

/**
 * @typedef AppContext
 *
 * @property {ServerSideData} serverSideData
 * @property {Array<AppMenu>} menu
 * @property {Array<AppLanguage>} languages
 * @property {Array<{text: string, href: string}>} vlineLinks
 * @property {{backgroundImage?: string, headerHeight?: number, navigationHeight?: number}} headerMeta
 * @property {function} setHeaderMeta
 * @property {{width?: number, height?: number}} contentMeta
 * @property {function} setContentMeta
 * @property {(id: string) => void} removeServerElement
 * @property {boolean} hasRemovedServerElements
 * @property {boolean} contentReady - true once legacy #content markup has been captured
 * @property {boolean} contentRemoved - true once the raw #content DOM node has been removed
 * @property {'macOS' | 'Windows' | 'Linux' | 'iOS' | 'Android' | 'unknown'} os
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
    vline2: undefined,
  },
  menu: [],
  languages: [],
  vlineLinks: [],
  headerMeta: {},
  setHeaderMeta: () => {},
  contentMeta: {},
  setContentMeta: () => {},
  removeServerElement: () => {},
  hasRemovedServerElements: false,
  contentReady: false,
  contentRemoved: false,
  os: 'unknown',
};

/**
 * @type {React.Context<AppContext>}
 */
const AppContext = React.createContext(DefaultState);

export default AppContext;
