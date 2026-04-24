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
  const menus = React.useMemo(() => (isDevMode ? [...mockMenu] : menu), [menu]);

  // Track open state for each menu item individually
  const [openedItems, setOpenedItems] = React.useState({});

  // Track split menus: visible menus and overflow menus
  const [visibleMenus, setVisibleMenus] = React.useState([]);
  const [overflowMenus, setOverflowMenus] = React.useState([]);

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
  const hiddenMenuRef = React.useRef(/**@type {HTMLLIElement | null}*/ null);
  const wrapperRef = React.useRef(/**@type {HTMLLIElement | null}*/ null);

  // Ref for overflow selector
  const overflowSelectorRef = React.useRef(
    /**@type {HTMLLIElement | null}*/ null
  );

  /**
   * Separate menus into visible and overflow
   * @type {(function(): void)|*}
   */
  const separateMenus = React.useCallback(() => {
    if (!hiddenMenuRef.current) {
      return;
    }

    const computedStyle = window.getComputedStyle(hiddenMenuRef.current);
    const paddingLeft = +computedStyle.paddingLeft.replace('px', '') || 0;
    const paddingRight = +computedStyle.paddingRight.replace('px', '') || 0;
    const wrapperWidth =
      hiddenMenuRef.current.clientWidth - paddingLeft - paddingRight;

    /** @type {Array<HTMLLIElement>} */
    const liElements = hiddenMenuRef.current.children;

    // Guard: Skip calculation if menus are not loaded yet
    if (liElements.length === 0) {
      return;
    }

    // Note: clientWidth already includes padding
    const menuWidths = Array.from(liElements).map((li) => li.clientWidth);

    // Get overflow selector width
    const overflowSelectorWidth = overflowSelectorRef.current.clientWidth;
    const gap = +computedStyle.gap.replace('px', '') || 0; // Exp value like 48, 56,...

    // Check if all menus fit without overflow selector.
    // The overflow selector is always rendered (visibility:hidden, not display:none),
    // so it still occupies space — account for its fixed width of 120px (magic number).
    const OVERFLOW_SELECTOR_WIDTH = 120;
    const totalMenusWidth = menuWidths.reduce(
      (sum, w, i) => sum + w + (i > 0 ? gap : 0),
      0
    );

    if (totalMenusWidth + OVERFLOW_SELECTOR_WIDTH + gap <= wrapperWidth) {
      setVisibleMenus(menus);
      setOverflowMenus([]);
      return;
    }

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

    // Update state
    setVisibleMenus(visible);
    setOverflowMenus(overflow);
  }, [menus]);

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
    // Guard: Skip calculation if menus are not loaded yet
    if (
      !hiddenMenuRef.current ||
      !wrapperRef.current ||
      !overflowSelectorRef.current
    )
      return;
    const observer = new ResizeObserver(() => {
      separateMenus();
    });
    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [menus, separateMenus]);

  return (
    <nav
      aria-label={t('Header navigation')}
      className="desktop-navigation"
      {...(hasRemovedServerElements ? {id: ELEMENT_ID.NAVIGATION} : {})}
    >
      <div className="navigation">
        {/*region: render hidden nav to measure menu width*/}
        <ul
          ref={hiddenMenuRef}
          className="navigation__wrapper !overflow-hidden !h-0 !opacity-0 !invisible"
        >
          {menus.map((menuItem, index) => (
            <li key={menuItem.key + index}>
              <a className="text-nowrap">{menuItem.label}</a>
              <>
                {!!withSubmenuDropdown && menuItem.children?.length > 0 && (
                  <ChevronButton />
                )}
              </>
            </li>
          ))}
        </ul>
        {/*endregion: render hidden nav to measure menu width*/}

        <ul ref={wrapperRef} className="navigation__wrapper">
          {visibleMenus.map((menuItem, i) => (
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
                      ref={(el) =>
                        (chevronButtonRefs.current[menuItem.key] = el)
                      }
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
                      aria-hidden={
                        !openedItems[menuItem.key] ? 'true' : 'false'
                      }
                      onKeyDown={(e) => handleDropdownKeyDown(e, menuItem.key)}
                      className={clsx(
                        'transition-all overflow-y-scroll max-h-[80vh]',
                        openedItems[menuItem.key] ? 'open' : 'inactive'
                      )}
                    >
                      <button
                        ref={(el) =>
                          (closeButtonRefs.current[menuItem.key] = el)
                        }
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
      </div>
    </nav>
  );
};

export default DropdownMenuDesktop;
