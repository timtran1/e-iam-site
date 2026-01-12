import React from 'react';
import ToggleButton from '../../common/ui/ToggleButton.jsx';
import clsx from 'clsx';
import LangSelector from '../header/LangSelector.jsx';
import AppContext from '../../common/context/app/app.context.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import {mockMenu} from '../../common/constant/dummy.js';
import ChevronButton from '../../common/ui/ChevronButton.jsx';

const isDevMode = import.meta.env.DEV;

/**
 * Recursively adds a `menuDepth` property to each item in the menu list to indicate its nesting level.
 *
 * @param {Array<AppMenu>} listMenu
 * @param {number} currentDepth
 * @returns {*}
 * @private
 */
const _markMenuDepth = (listMenu, currentDepth = 0) => {
  return listMenu.map((item) => {
    const updatedItem = {
      ...item,
      menuDepth: currentDepth,
    };
    if (item.children?.length > 0) {
      updatedItem.children = _markMenuDepth(item.children, currentDepth + 1);
    }
    return updatedItem;
  });
};

/**
 * Dropdown menu for mobile
 *
 * This is bottom-sheet modal to render all of menu
 *
 * @param {Object} props
 * @param {boolean} [props.opened] - Controlled opened state (optional)
 * @param {Function} [props.setOpened] - Controlled setter for opened state (optional)
 * @returns {JSX.Element}
 * @constructor
 */
const DropdownMenuMobile = ({opened: openedProp, setOpened: setOpenedProp}) => {
  // Internal state for uncontrolled mode
  const [openedState, setOpenedState] = React.useState(false);

  // Use prop if provided, otherwise use internal state
  const opened = openedProp !== undefined ? openedProp : openedState;
  const setOpened =
    setOpenedProp !== undefined ? setOpenedProp : setOpenedState;

  // Get context data
  const appContext = React.useContext(AppContext);

  /**
   * @type {Array<AppMenu & {menuDepth: number}>}
   */
  const menus = isDevMode ? mockMenu : appContext.menu;

  // Get current page
  const [currentPage] = useQueryParam('c');

  // Menu depth
  const [currentMenuDepth, setCurrentMenuDepth] = React.useState(0);

  // Rendered list menu state
  const [renderedListMenu, setRenderedListMenu] = React.useState(
    _markMenuDepth(menus)
  );

  // Keep track of menu navigation history
  const [menuHistory, setMenuHistory] = React.useState([]);

  /**
   * Handle click expand menu
   * @type {(menu: AppMenu) => void}
   */
  const handleClickExpand = React.useCallback(
    (menu) => {
      if (menu.children?.length > 0) {
        // Save current menu to history before navigating deeper
        setMenuHistory((prev) => [...prev, renderedListMenu]);
        setRenderedListMenu(
          _markMenuDepth(menu.children, currentMenuDepth + 1)
        );
        setCurrentMenuDepth(currentMenuDepth + 1);
      }
    },
    [currentMenuDepth, renderedListMenu]
  );

  /**
   * Handle click back to prev menu
   *
   * @type {(function(): void)|*}
   */
  const handleClickBack = React.useCallback(() => {
    if (currentMenuDepth > 0 && menuHistory.length > 0) {
      // Get the previous menu from history
      const newHistory = [...menuHistory];
      const prevMenuList = newHistory.pop();

      setMenuHistory(newHistory);
      setRenderedListMenu(prevMenuList);
      setCurrentMenuDepth(currentMenuDepth - 1);
    }
  }, [currentMenuDepth, menuHistory]);

  /**
   * Set init menu to rendered menu
   */
  React.useEffect(() => {
    setRenderedListMenu(_markMenuDepth(menus));
    setMenuHistory([]);
    setCurrentMenuDepth(0);
  }, [menus]);

  return (
    <>
      {/*region target btn*/}
      <ToggleButton
        opened={opened}
        onClick={() => setOpened((prev) => !prev)}
      />
      {/*endregion target btn*/}

      {/*region content*/}
      <div
        className={clsx(
          'fixed z-50 left-0  h-screen w-screen overflow-hidden',
          {'pointer-events-none': !opened}
        )}
      >
        <div
          className={clsx(
            'h-full bg-white transition-transform duration-300 ease-in-out transform',
            opened ? 'translate-y-0' : '-translate-y-full'
          )}
        >
          {/*region lang selector*/}
          {currentMenuDepth === 0 ? (
            <div className="p-4 border-b border-b-gray-geyser">
              <LangSelector />
            </div>
          ) : (
            <div className="px-4 py-4">
              <div
                className="cursor-pointer p-1 rounded transition hover:bg-gray-black-squeeze"
                onClick={handleClickBack}
              >
                <ChevronButton className={clsx('transition rotate-180')} />
              </div>
            </div>
          )}
          {/*endregion lang selector*/}

          {/*region menu*/}
          <nav className="mobile-navigation">
            <ul className="navigation">
              {renderedListMenu.map((menuItem, i) => (
                <li key={i} data-activated={currentPage === menuItem.key}>
                  <a href={menuItem.href}>{menuItem.label}</a>
                  {menuItem.children && menuItem.children.length > 0 && (
                    <ChevronButton
                      className="h-6 w-6 flex items-center justify-center"
                      onClick={() => handleClickExpand(menuItem)}
                    />
                  )}
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
