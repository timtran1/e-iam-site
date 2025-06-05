import React from 'react';

/**
 * @typedef AppContext
 *
 * @property {ServerSideData} serverSideData
 * @property {Array<AppMenu>} menu
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
};

/**
 * @type {React.Context<AppContext>}
 */
const AppContext = React.createContext(DefaultState);

export default AppContext;
