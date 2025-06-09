import React from 'react';
import PureElementRendering from '../../common/ui/PureElementRendering.jsx';
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

  return (
    <>
      <footer className="bg-gray-pickled-bluewood px-6 py-2 text-white text-3.2 flex justify-start items-center gap-2">
        <PureElementRendering ele={serverSideData.footer} />
      </footer>
    </>
  );
};

export default Footer;
