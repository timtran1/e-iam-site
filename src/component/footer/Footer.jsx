import React from 'react';
import AppContext from '../../common/context/app/app.context.js';

/**
 * Footer
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Footer = () => {
  // Get context data
  const {serverSideData} = React.useContext(AppContext);
  const footerHTML = React.useMemo(() => {
    return serverSideData?.footer?.innerHTML;
  }, [serverSideData]);

  return (
    <footer
      className="bg-gray-pickled-bluewood px-6 py-2 text-white text-3.2"
      dangerouslySetInnerHTML={{__html: footerHTML}}
    />
  );
};

export default Footer;
