import React from 'react';
import clsx from 'clsx';

/**
 * Toggle button
 *
 * @type {React.NamedExoticComponent<{
 *     className: string
 *     onClick: () => void
 * }>}
 */
const ToggleButton = React.memo(({className, onClick = () => {}}) => {
  return (
    <>
      <button
        className={clsx(
          'flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none relative z-[999]',
          className
        )}
        onClick={onClick}
      >
        <span className="origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 mb-0 bg-gray-800"></span>
        <span className="origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 bg-gray-800"></span>
        <span className="origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 bg-gray-800"></span>
      </button>
    </>
  );
});

ToggleButton.displayName = 'ToggleButton';
export default ToggleButton;
