import AppContext from './app.context.js';
import useServerSideVariables from '../../hook/useServerSideVariables.js';

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

  return (
    <>
      <AppContext.Provider value={{serverSideData}}>
        {children}
      </AppContext.Provider>
    </>
  );
};

export default AppProvider;
