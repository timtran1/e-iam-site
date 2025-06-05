import React from 'react';

/**
 * @typedef AppContext
 *
 * @property {ServerSideData} serverSideData
 * @property {Array<AppMenu>} menu
 * @property {Array<AppLanguage>} languages
 */

/**
 * @type {AppContext}
 */
const DefaultState = {
  serverSideData: {
    languages: undefined,
    navigation: undefined,
    content: undefined,
    footer: undefined,
  },
  menu: [],
  languages: [],
};

/**
 * @type {React.Context<AppContext>}
 */
const AppContext = React.createContext(DefaultState);

export default AppContext;
