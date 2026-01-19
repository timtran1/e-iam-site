import React from 'react';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import clsx from 'clsx';
import AppContext from '../../common/context/app/app.context.js';
import {mockMenu} from '../../common/constant/dummy.js';
import DesktopMenuList from './DesktopMenuList.jsx';
import useClickAway from '../../common/hook/useClickAway.js';
import {hasChildActive} from '../../common/helper/menu.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import {ELEMENT_ID} from '../../common/constant/element-id.js';
import {getFocusableElements} from '../../common/helper/element-parsing.js';
import {useTranslation} from 'react-i18next';

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
  // Translation
  const {t} = useTranslation();

  // Get context data
  const {menu, hasRemovedServerElements} = React.useContext(AppContext);
  const menus = isDevMode ? mockMenu : menu;

  // Track open state for each menu item individually
  const [openedItems, setOpenedItems] = React.useState({});

  // Store refs for chevron buttons to return focus
  const chevronButtonRefs = React.useRef({});

  // Store refs for close buttons to autofocus when opening
  const closeButtonRefs = React.useRef({});

  // Store refs for dropdown containers
  const dropdownRefs = React.useRef({});

  // Get current page
  const [currentPage] = useQueryParam('c');

  // Toggle open state for a specific item
  const toggleItem = (key, shouldReturnFocus = false) => {
    const wasOpen = openedItems[key];
    setOpenedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    // Return focus to chevron button when closing
    if (wasOpen && shouldReturnFocus && chevronButtonRefs.current[key]) {
      setTimeout(() => {
        chevronButtonRefs.current[key]?.focus();
      }, 0);
    }
    // Autofocus to close button when opening
    else if (!wasOpen && closeButtonRefs.current[key]) {
      setTimeout(() => {
        closeButtonRefs.current[key]?.focus();
      }, 100);
    }
  };

  /**
   * Handle keyboard events for chevron button
   * @param {KeyboardEvent} e
   * @param {string} menuKey
   */
  const handleChevronKeyDown = (e, menuKey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(menuKey);
    }
  };

  /**
   * Handle keyboard events for close button and dropdown
   * @param {KeyboardEvent} e
   * @param {string} menuKey
   */
  const handleDropdownKeyDown = (e, menuKey) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      toggleItem(menuKey, true);
      return;
    }

    // Focus trap: handle Tab key
    if (e.key === 'Tab') {
      const dropdown = dropdownRefs.current[menuKey];
      const focusableElements = getFocusableElements(dropdown);

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab on first element: go to last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab on last element: go to first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
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
    <nav
      aria-label={t('Header navigation')}
      className="desktop-navigation"
      {...(hasRemovedServerElements ? {id: ELEMENT_ID.NAVIGATION} : {})}
    >
      <ul ref={wrapperRef} className="navigation w-full overflow-x-auto">
        {menus.map((menuItem, i) => (
          <li
            key={menuItem.key || i}
            className={clsx(
              (!currentPage && !i) || hasChildActive(menuItem)
                ? 'active'
                : ''
            )}
          >
            <a
              className="transition-all no-underline hover:no-underline"
              href={menuItem.href}
            >
              {menuItem.label}
            </a>{' '}
            <>
              {!!withSubmenuDropdown && menuItem.children?.length > 0 && (
                <>
                  <ChevronButton
                    ref={(el) => (chevronButtonRefs.current[menuItem.key] = el)}
                    className={clsx(
                      'transition',
                      openedItems[menuItem.key] ? 'rotate-90' : ''
                    )}
                    onClick={() => toggleItem(menuItem.key)}
                    onKeyDown={(e) => handleChevronKeyDown(e, menuItem.key)}
                    aria-expanded={!!openedItems[menuItem.key] || false}
                    aria-controls={`header-nav-dropdown-${menuItem.key}`}
                    aria-label={t(`Toggle ${menuItem.label} submenu`)}
                  />
                  <ul
                    ref={(el) => (dropdownRefs.current[menuItem.key] = el)}
                    id={`header-nav-dropdown-${menuItem.key}`}
                    role="menu"
                    aria-label={`${menuItem.label} submenu`}
                    aria-hidden={!openedItems[menuItem.key] ? 'true' : 'false'}
                    onKeyDown={(e) => handleDropdownKeyDown(e, menuItem.key)}
                    className={clsx(
                      'transition-all overflow-y-scroll max-h-[80vh]',
                      openedItems[menuItem.key] ? 'open' : 'inactive'
                    )}
                  >
                    <button
                      ref={(el) => (closeButtonRefs.current[menuItem.key] = el)}
                      type="button"
                      className="nav-dropdown-close transition-all hover:translate-y-0.5"
                      onClick={() => toggleItem(menuItem.key, true)}
                      aria-label={t('Close submenu')}
                    >
                      <span aria-hidden="true">×</span>
                      <span className="ml-1">Close</span>
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
