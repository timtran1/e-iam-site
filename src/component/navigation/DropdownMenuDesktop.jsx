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
import DropdownOverflowMenu from './DropdownOverflowMenu.jsx';

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

  // Track split menus: visible menus and overflow menus
  const [visibleMenus, setVisibleMenus] = React.useState(menus);
  const [overflowMenus, setOverflowMenus] = React.useState([]);
  const [hasMenuBeenSeparated, setHasMenuBeenSeparated] = React.useState(false);

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
  const wrapperRef = React.useRef(/**@type {HTMLLIElement | null}*/ null);

  // Ref for overflow selector
  const overflowSelectorRef = React.useRef(
    /**@type {HTMLLIElement | null}*/ null
  );

  /**
   * Handle click away
   */
  useClickAway(wrapperRef, () => {
    setOpenedItems({});
  });

  /**
   * Handle resize observer to calculate menu width
   */
  React.useEffect(() => {
    // Guard: Skip calculation if the menu has been separated or the wrapper ref is not available
    if (hasMenuBeenSeparated || !wrapperRef.current) return;

    const observer = new ResizeObserver(() => {
      // Guard: Skip calculation if menus are not loaded yet
      if (!overflowSelectorRef.current || !menus?.length) {
        return;
      }

      // Get overflow selector width
      const overflowSelectorWidth = overflowSelectorRef.current.clientWidth;

      const computedStyle = window.getComputedStyle(wrapperRef.current);
      const gap = +computedStyle.gap.replace('px', '') || 0; // Exp value like 48, 56,...

      const paddingLeft = +computedStyle.paddingLeft.replace('px', '') || 0;
      const paddingRight = +computedStyle.paddingRight.replace('px', '') || 0;
      const wrapperWidth =
        wrapperRef.current.clientWidth - paddingLeft - paddingRight;

      /** @type {Array<HTMLLIElement>} */
      const liElements = wrapperRef.current.children;

      // Guard: Skip calculation if menus are not loaded yet
      // liElements should have at least 2 children: menu items + overflow selector
      if (liElements.length <= 1) {
        return;
      }

      // Exclude the last element (overflow selector) from menu items
      // Note: clientWidth already includes padding
      const menuWidths = Array.from(liElements)
        .slice(0, -1)
        .map((li) => li.clientWidth);

      // Available width for menus (wrapper width - overflow selector width - gap)
      const availableWidth = wrapperWidth - overflowSelectorWidth - gap;

      // Calculate which menus fit in available width
      let accumulatedWidth = 0;
      let splitIndex = 0;

      for (let i = 0; i < menuWidths.length; i++) {
        const totalWidth = accumulatedWidth + menuWidths[i] + (i > 0 ? gap : 0);
        if (totalWidth <= availableWidth) {
          accumulatedWidth = totalWidth;
          splitIndex = i + 1;
        } else {
          break;
        }
      }

      // Split menus into visible and overflow
      const visible = menus.slice(0, splitIndex);
      const overflow = menus.slice(splitIndex);

      setVisibleMenus(visible);
      setOverflowMenus(overflow);
      setHasMenuBeenSeparated(true);
    });

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [hasMenuBeenSeparated, menus]);

  return (
    <nav
      aria-label={t('Header navigation')}
      className="desktop-navigation"
      {...(hasRemovedServerElements ? {id: ELEMENT_ID.NAVIGATION} : {})}
    >
      <ul ref={wrapperRef} className="navigation w-full">
        {(hasMenuBeenSeparated ? visibleMenus : menus).map((menuItem, i) => (
          <li
            key={menuItem.key + i}
            className={clsx(
              (!currentPage && !i) || hasChildActive(menuItem) ? 'active' : ''
            )}
          >
            <a
              className="transition-all no-underline hover:no-underline text-nowrap"
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

        <DropdownOverflowMenu
          ref={overflowSelectorRef}
          className={clsx(overflowMenus.length > 0 ? 'visible' : 'invisible')}
          menus={overflowMenus}
        />
      </ul>
    </nav>
  );
};

export default DropdownMenuDesktop;
