import React from 'react';
import EIAMSystem from './EIAMSystem.jsx';
import CHLoginAndTechInfo from './CHLoginAndTechInfo.jsx';
import OfficersAndManagers from './OfficersAndManagers.jsx';

/**
 * Core Functions of the eIAM System section
 *
 * @type {React.NamedExoticComponent<object>}
 */
const CoreFunctions = React.memo(() => {
  return (
    <>
      <section className="py-10 md:py-32.5">
        <EIAMSystem className="mb-14" />
        <CHLoginAndTechInfo className="mb-8" />
        <OfficersAndManagers />
      </section>
    </>
  );
});

CoreFunctions.displayName = 'CoreFunctions';
export default CoreFunctions;
