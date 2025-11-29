import React from 'react';
import clsx from 'clsx';

/**
 * Chevron icon button
 * @type {React.NamedExoticComponent<{
 *     leftSection
 *     className: string,
 *     iconClassName: string,
 *     onClick: () => void,
 *     rotateChevron: boolean
 * }>}
 */
const ChevronButton = React.memo(
  ({
    className = '',
    iconClassName = '',
    onClick = () => {},
    leftSection = <></>,
    rotateChevron = false,
  }) => {
    return (
      <>
        <button
          className={clsx(
            '!w-auto flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer',
            className
          )}
          onClick={onClick}
        >
          {leftSection}
          <svg
            className={clsx(
              'w-8 transform transition-transform duration-300',
              rotateChevron && 'rotate-180',
              iconClassName
            )}
            role="presentation"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="m5.706 10.015 6.669 3.85 6.669-3.85.375.649-7.044 4.067-7.044-4.067z"></path>
          </svg>
        </button>
      </>
    );
  }
);

ChevronButton.displayName = 'ChevronButton';
export default ChevronButton;
