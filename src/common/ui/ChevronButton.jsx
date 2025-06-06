import React from 'react';
import clsx from 'clsx';

/**
 * Chevron icon button
 * @type {React.NamedExoticComponent<{
 *     leftSection
 *     className: string,
 *     onClick: () => void
 * }>}
 */
const ChevronButton = React.memo(
  ({className = '', onClick = () => {}, leftSection = <></>}) => {
    return (
      <>
        <button
          className={clsx(
            'lang-switcher flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer',
            className
          )}
          onClick={onClick}
        >
          {leftSection}
          <svg
            className="lang-caret w-4 h-4 transform transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </>
    );
  }
);

ChevronButton.displayName = 'ChevronButton';
export default ChevronButton;
