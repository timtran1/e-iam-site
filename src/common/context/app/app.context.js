import React from 'react';

/**
 * @type {{serverSideData: ServerSideData}}
 */
const DefaultState = {
  serverSideData: {
    languages: undefined,
    navigation: undefined,
    content: undefined,
    footer: undefined,
  },
};

/**
 * @type {React.Context<{serverSideData: ServerSideData}>}
 */
const AppContext = React.createContext(DefaultState);

export default AppContext;
