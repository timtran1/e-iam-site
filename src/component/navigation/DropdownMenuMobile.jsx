import React from 'react';
import ToggleButton from '../../common/ui/ToggleButton.jsx';
import clsx from 'clsx';
import LangSelector from '../header/lang-selector/index.jsx';
import AppContext from '../../common/context/app/app.context.js';
import useQueryParam from '../../common/hook/useQueryParam.js';

/**
 * Dropdown menu for mobile
 *
 * This is bottom-sheet modal to render all of menu
 *
 * @returns {JSX.Element}
 * @constructor
 */
const DropdownMenuMobile = () => {
  // Visible state
  const [opened, setOpened] = React.useState(false);

  // Get context data
  const {menu} = React.useContext(AppContext);

  // Get current page
  const currentPage = useQueryParam('c');

  return (
    <>
      {/*region target btn*/}
      <ToggleButton onClick={() => setOpened((prev) => !prev)} />
      {/*endregion target btn*/}

      {/*region content*/}
      <div
        className={clsx(
          'fixed top-[52px] left-0  h-screen w-screen overflow-hidden'
        )}
      >
        <div
          className={clsx(
            'h-full bg-white transition-transform duration-300 ease-in-out transform',
            opened ? 'translate-y-0' : '-translate-y-full'
          )}
        >
          {/*region lang selector*/}
          <div className="p-4 border-b border-b-gray-geyser">
            <LangSelector />
          </div>
          {/*endregion lang selector*/}
          {/*region menu*/}
          <nav>
            <ul>
              {menu.map((menuItem, i) => (
                <li
                  key={i}
                  className={clsx(
                    'px-4 py-2 border-b transition border-b-gray-geyser border-s-danger-cinnabar',
                    'hover:border-s-4',
                    currentPage === menuItem.key ? 'border-s-4' : ''
                  )}
                >
                  <a href={menuItem.href} className="block !no-underline">
                    {menuItem.label}
                  </a>{' '}
                </li>
              ))}
            </ul>
          </nav>
          {/*endregion menu*/}
        </div>
      </div>
      {/*endregion content*/}
    </>
  );
};

export default DropdownMenuMobile;
