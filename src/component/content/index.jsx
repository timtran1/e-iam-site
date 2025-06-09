import React from 'react';
import AppContext from '../../common/context/app/app.context.js';
import PureElementRendering from '../../common/ui/PureElementRendering.jsx';

/**
 * Content
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Content = () => {
  // Get context data
  const {serverSideData} = React.useContext(AppContext);

  return (
    <>
      <PureElementRendering ele={serverSideData.content} />
    </>
  );
};

export default Content;
