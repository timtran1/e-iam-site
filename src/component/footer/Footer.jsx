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
      className="!bg-gray-pickled-bluewood !py-2 !m-0 !border-0"
      // use inline here to avoid style shifts due to old u5cms css being applied first
      style={{
        fontStyle: 'normal',
        fontWeight: 400,
        fontFamily:
          'var(--Basic-Font-Family-Font-Family, "Noto Sans"), sans-serif',
        fontSize: 'var(--Color-Font-Header-Elements-Font-Size, 14)',
        lineHeight: 'var(--Color-Font-Header-Elements-Line-Height, 18px)',
      }}
    >
      <div
        className="!container !mx-auto !text-white"
        dangerouslySetInnerHTML={{__html: footerHTML}}
      ></div>
    </footer>
  );
};

export default Footer;
