import React from 'react';
import ToggleButton from '../../common/ui/ToggleButton.jsx';
import clsx from 'clsx';
import LangSelector from '../header/lang-selector/index.jsx';
import AppContext from '../../common/context/app/app.context.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import ChevronButton from '../../common/ui/ChevronButton.jsx';

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
  const appContext = React.useContext(AppContext);

  /**
   * @type {Array<AppMenu & {menuDepth: number}>}
   */
  const menu = React.useMemo(() => {
    const markMenuDepth = (listMenu, currentDepth = 0) => {
      return listMenu.map((item) => {
        const updatedItem = {
          ...item,
          menuDepth: currentDepth,
        };
        if (item.children?.length > 0) {
          updatedItem.children = markMenuDepth(item.children, currentDepth + 1);
        }
        return updatedItem;
      });
    };

    return markMenuDepth(appContext.menu);
  }, [appContext.menu]);

  // Get current page
  const currentPage = useQueryParam('c');

  // Menu depth
  const [currentMenuDepth, setCurrentMenuDepth] = React.useState(0);

  // Rendered list menu state
  const [renderedListMenu, setRenderedListMenu] = React.useState(menu);

  /**
   * Handle click expand menu
   * @type {(menu: AppMenu) => void}
   */
  const handleClickExpand = React.useCallback((menu) => {
    if (menu.children?.length > 0) {
      setRenderedListMenu(menu.children);
      setCurrentMenuDepth(menu.children[0].menuDepth);
    }
  }, []);

  /**
   * Handle click back to prev menu
   *
   * @type {(function(): void)|*}
   */
  const handleClickBack = React.useCallback(() => {
    if (currentMenuDepth > 0) {
      const expectMenuDepth = currentMenuDepth - 1;

      // Recursive function to find the menu list at expected depth
      const findPrevMenuList = (menuList) => {
        for (const item of menuList) {
          if (item.menuDepth === expectMenuDepth) {
            return menuList;
          }

          if (item.children?.length > 0) {
            const result = findPrevMenuList(item.children);
            if (result) {
              return result;
            }
          }
        }
        return [];
      };

      const prevMenuList = findPrevMenuList(menu);
      if (prevMenuList) {
        setRenderedListMenu(prevMenuList);
        setCurrentMenuDepth(expectMenuDepth);
      }
    }
  }, [currentMenuDepth, menu]);

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
                <ChevronButton
                  className={clsx(
                    'transition ',
                    opened ? 'rotate-45' : 'rotate-90'
                  )}
                />
              </div>
            </div>
          )}

          {/*endregion lang selector*/}
          {/*region menu*/}
          <nav>
            <ul>
              {renderedListMenu.map((menuItem, i) => (
                <li
                  key={i}
                  className={clsx(
                    'flex gap-6 justify-between',
                    'cursor-pointer px-4 py-2 border-b transition border-b-gray-geyser border-s-danger-cinnabar',
                    'hover:border-s-4',
                    currentPage === menuItem.key ? 'border-s-4' : ''
                  )}
                >
                  <a href={menuItem.href} className="block !no-underline">
                    {menuItem.label}
                  </a>
                  {menuItem.children && menuItem.children.length > 0 && (
                    <ChevronButton
                      className={clsx(
                        'px-2 transition',
                        opened ? '-rotate-45' : 'rotate-90'
                      )}
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
