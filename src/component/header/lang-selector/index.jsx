import React from 'react';
import {LANGUAGES} from '../../../common/constant/language.js';
import {Menu} from '@mantine/core';
import clsx from 'clsx';

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
        <Menu width={77} open={opened} onChange={setOpened}>
          <Menu.Target>
            <button className="lang-switcher flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer">
              <span className="current-lang">EN</span>
              <svg
                className={clsx(
                  'w-4 h-4 transform transition-transform duration-300',
                  opened ? 'rotate-90' : 'rotate-0'
                )}
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
          </Menu.Target>
          <Menu.Dropdown className="!w-[77px] rounded-none p-0 border-t border-t-gray-geyser shadow-[0_3px_4px_1px_#828e9a] z-50 transform">
            <div className="flex flex-col">
              {Object.values(LANGUAGES).map((lang, index) => (
                <a
                  key={index}
                  href={lang.href}
                  className="px-4 py-2 inline-flex hover:bg-gray-black-squeeze"
                >
                  {lang.sortLabel}
                </a>
              ))}
            </div>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  );
};

export default LangSelector;
