import React from 'react';
import AppContext from '../../common/context/app/app.context.js';
import {ELEMENT_ID} from '../../common/constant/element-id.js';

/**
 * Footer
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Footer = () => {
  // Get context data
  const {serverSideData, hasRemovedServerElements} =
    React.useContext(AppContext);
  const footerHTML = React.useMemo(() => {
    return serverSideData?.footer?.innerHTML;
  }, [serverSideData]);

  return (
    <footer
      {...(hasRemovedServerElements ? {id: ELEMENT_ID.FOOTER} : {})}
      className="!bg-gray-pickled-bluewood !py-2 !m-0 !border-0 !text-3.2"
    >
      <div
        className="!container !mx-auto !text-white !text-3.2"
        dangerouslySetInnerHTML={{__html: footerHTML}}
      ></div>
    </footer>
  );
};

export default Footer;
