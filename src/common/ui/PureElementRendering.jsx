import React from 'react';
import clsx from 'clsx';

/**
 * Render pure element
 *
 * @param {string} id
 * @param {string} component - Tag name of HTML element (e.g. 'div', 'p', 'nav')
 * @param {className} className
 * @param {() => void} onUpdated
 * @param ele
 */
const PureElementRendering = React.forwardRef(
  ({id, className, ele, component = 'div', onUpdated = () => {}}, ref) => {
    // Get uniq id for this component
    const randomId = `pure-ele-${String(Math.random()).slice(-5)}`;

    /** @type {string} */
    const eleId = React.useMemo(() => id || randomId, [id, randomId]);

    // Rendering element
    const internalRef = React.useRef(null);
    const renderingRef = ref || internalRef;

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

        // Emit update event
        onUpdated();
      }
    }, [className, component, ele, onUpdated, renderingRef]);

    return (
      <>
        <div id={eleId} key={eleId} ref={renderingRef}></div>
      </>
    );
  }
);

PureElementRendering.displayName = 'PureElementRendering';
export default PureElementRendering;
