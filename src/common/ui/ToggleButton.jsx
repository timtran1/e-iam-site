import React from 'react';
import clsx from 'clsx';

/**
 * Toggle button
 *
 * @type {React.NamedExoticComponent<{
 *     opened: boolean,
 *     className: string
 *     onClick: () => void
 * }>}
 */
const ToggleButton = React.memo(({opened, className, onClick = () => {}}) => {
  return (
    <>
      <button
        className={clsx(
          'flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none relative z-[999]',
          className
        )}
        onClick={onClick}
      >
        <span
          className={clsx(
            'origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 mb-0 bg-gray-800',
            {'rotate-[22.5deg] origin-center': opened}
          )}
        ></span>
        {!opened && (
          <span
            className={clsx(
              'origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 bg-gray-800',
              {hidden: opened}
            )}
          ></span>
        )}
        <span
          className={clsx(
            'origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 bg-gray-800',
            {'rotate-[-22.5deg] !m-0': opened}
          )}
        ></span>
      </button>
    </>
  );
});

ToggleButton.displayName = 'ToggleButton';
export default ToggleButton;
