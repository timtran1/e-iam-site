import React from 'react';

/**
 * Render pure element
 */
const PureElementRendering = ({ele}) => {
  // Get uniq id for this component
  const eleId = React.useId();

  // Rendering element
  const renderingRef = React.useRef(null);

  /**
   * Update and render ele
   */
  React.useEffect(() => {
    if (renderingRef.current && typeof ele === 'object' && ele !== null) {
      const clone = ele.cloneNode(true);
      renderingRef.current.appendChild(clone);
    }
  }, [ele]);

  return (
    <>
      <div id={eleId} key={eleId} ref={renderingRef}></div>
    </>
  );
};

export default PureElementRendering;
