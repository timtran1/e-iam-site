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
    <footer {...(hasRemovedServerElements ? {id: ELEMENT_ID.FOOTER} : {})}>
      {!!footerHTML && (
        <div
          className="footer-container"
          dangerouslySetInnerHTML={{__html: footerHTML}}
        ></div>
      )}
    </footer>
  );
};

export default Footer;
