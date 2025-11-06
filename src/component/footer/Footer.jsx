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
    <footer className="bg-gray-pickled-bluewood py-2">
      <div
        className="container mx-auto text-white text-3.2"
        dangerouslySetInnerHTML={{__html: footerHTML}}
      ></div>
    </footer>
  );
};

export default Footer;
