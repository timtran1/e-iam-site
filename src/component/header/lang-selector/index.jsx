import React from 'react';

/**
 * Language selector
 *
 * @returns {JSX.Element}
 * @constructor
 */
const LangSelector = () => {
  // Visible state
  const [opened, setOpened] = React.useState(false);

  return (
    <>
      <div className="relative ml-auto mr-4 cursor-pointer hidden sm:block">
        lang selector
      </div>
    </>
  );
};

export default LangSelector;
