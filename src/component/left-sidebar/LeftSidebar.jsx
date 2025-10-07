import React from 'react';
import LeftMenuItem from './LeftMenuItem.jsx';
import linkIsCurrentPage from '../../common/helper/linkIsCurrentPage.js';

const isDevMode = import.meta.env.DEV;

/**
 * Recursively checks if the given menu or any of its child menus is currently active.
 *
 * @param {AppMenu} menu
 * @return {boolean}
 */
const hasActivatedMenu = (menu) => {
  if (linkIsCurrentPage(menu.href)) {
    return true;
  } else {
    // Check deeper levels
    for (const menuItem of menu.children || []) {
      if (hasActivatedMenu(menuItem)) {
        return true;
      }
    }

    // If no activated menu found
    return false;
  }
};

export default function LeftSidebar({menus}) {
  /**
   * Only allow top level items to have children
   * We don't want to nest to be too deep here
   *
   * @type {Array<AppMenu>}
   */
  const processedMenus = React.useMemo(() => {
    if (isDevMode) {
      return menus;
    }

    for (const menu of menus) {
      if (hasActivatedMenu(menu)) {
        return menu.children || [];
      }
    }
    return [];
  }, [menus]);

  return (
    <>
      {!!processedMenus.length && (
        <nav className="left-sidebar w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px] hidden sm:block">
          {processedMenus.map((menu, index) => (
            <LeftMenuItem key={index} menu={menu} index={index} />
          ))}
        </nav>
      )}
    </>
  );
}
