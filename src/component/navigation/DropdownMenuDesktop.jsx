import React from 'react';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import clsx from 'clsx';
import AppContext from '../../common/context/app/app.context.js';
import {mockMenu} from '../../common/constant/dummy.js';
import DesktopMenuList from './DesktopMenuList.jsx';
import useClickAway from '../../common/hook/useClickAway.js';
import {hasChildActive} from '../../common/helper/menu.js';
import useQueryParam from '../../common/hook/useQueryParam.js';

const isDevMode = import.meta.env.DEV;

/**
 * Dropdown menu for desktop
 *
 * @param {boolean} withSubmenuDropdown
 * @returns {JSX.Element}
 *
 * @constructor
 */
const DropdownMenuDesktop = ({withSubmenuDropdown = false}) => {
  // Get context data
  const {menu} = React.useContext(AppContext);
  const menus = isDevMode ? mockMenu : menu;

  // Track open state for each menu item individually
  const [openedItems, setOpenedItems] = React.useState({});

  // Get current page
  const [currentPage] = useQueryParam('c');

  // Toggle open state for a specific item
  const toggleItem = (key) => {
    setOpenedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Main dropdown ref
  const wrapperRef = React.useRef(null);

  /**
   * Handle click away
   */
  useClickAway(wrapperRef, () => {
    setOpenedItems({});
  });

  return (
    <nav className="container mx-auto main-navigation main-navigation--desktop">
      <ul ref={wrapperRef} className="">
        {menus.map((menuItem, i) => (
          <li
            key={i}
            className={clsx((!currentPage && !i) || hasChildActive(menuItem) && 'active')}
          >
            <a className="hover:no-underline" href={menuItem.href}>
              {menuItem.label}
            </a>{' '}
            <>
              {!!withSubmenuDropdown && menuItem.children?.length > 0 && (
                <>
                  <ChevronButton
                    className={clsx(
                      'transition',
                      openedItems[menuItem.key] ? 'rotate-90' : ''
                    )}
                    onClick={() => toggleItem(menuItem.key)}
                  />
                  <ul
                    className={clsx(
                      'transition-all overflow-y-scroll max-h-[80vh]',
                      openedItems[menuItem.key] ? 'open' : 'inactive'
                    )}
                  >
                    <button
                      className="nav-dropdown-close transition-all hover:translate-y-0.5"
                      onClick={() => toggleItem(menuItem.key)}
                    >
                      Close ×
                    </button>
                    <DesktopMenuList listMenu={menuItem.children} />
                  </ul>
                </>
              )}
            </>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DropdownMenuDesktop;
