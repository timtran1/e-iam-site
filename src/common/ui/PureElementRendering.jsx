import React from 'react';
import clsx from 'clsx';

/**
 * Render pure element
 *
 * @param {string} component - Tag name of HTML element (e.g. 'div', 'p', 'nav')
 * @param {className} className
 * @param ele
 */
const PureElementRendering = ({className, ele, component = 'div'}) => {
  // Get uniq id for this component
  const eleId = React.useId();

  // Rendering element
  const renderingRef = React.useRef(null);

  /**
   * Update and render ele with a different tag
   */
  React.useEffect(() => {
    if (renderingRef.current && typeof ele === 'object' && ele !== null) {
      const newTag = component;
      const clone = ele.cloneNode(true);

      // Create a new element with the desired tag
      const newElement = document.createElement(newTag);

      // Copy attributes
      for (const attr of clone.attributes) {
        if (attr.name === 'class') {
          const mergedClass = clsx(attr.value, className);
          newElement.setAttribute('class', mergedClass);
        } else {
          newElement.setAttribute(attr.name, attr.value);
        }
      }
      if (!clone.hasAttribute('class') && className) {
        newElement.setAttribute('class', clsx(className));
      }

      // Move child nodes
      while (clone.firstChild) {
        newElement.appendChild(clone.firstChild);
      }

      // Append to the DOM
      renderingRef.current.appendChild(newElement);
    }
  }, [className, component, ele]);

  return (
    <>
      <div id={eleId} key={eleId} ref={renderingRef}></div>
    </>
  );
};

export default PureElementRendering;
