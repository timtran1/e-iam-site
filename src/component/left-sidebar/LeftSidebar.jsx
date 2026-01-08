import React from 'react';
import LeftMenuItem from './LeftMenuItem.jsx';
import linkIsCurrentPage from '../../common/helper/linkIsCurrentPage.js';
import clsx from 'clsx';
import useQueryParam from '../../common/hook/useQueryParam.js';

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
  // Get current page
  const [currentPage] = useQueryParam('c'); // the 'c' letter is the page code of u5CMS
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

    /** @see htmltemplate.external-react.html:16 - to see and edit which pages should have sidebar */
    if (window?.showLeftSidebarPages?.includes(currentPage || '')) {
      const getCurrentMenu = (listMenu) => {
        for (const menu of listMenu) {
          if (menu.key === currentPage) {
            return menu;
          }
          if (menu.children?.length) {
            const found = getCurrentMenu(menu.children);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };
      const currentMenu = getCurrentMenu(menus);
      if (currentMenu?.children?.length) {
        return currentMenu.children;
      } else {
        return menus.map((menu) => ({
          ...menu,
          children: [], // remove children to prevent nested menu for this page
        }));
      }
    }

    for (const menu of menus) {
      if (hasActivatedMenu(menu)) {
        return menu.children || [];
      }
    }
    return [];
  }, [currentPage, menus]);

  const widthClass = React.useMemo(() => {
    if (processedMenus.length && processedMenus.length > 0) {
      return 'w-[150px] lg:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px]';
    }
    // produce spacer to let main content be in center
    return 'invisible w-0 lg:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px]';
  }, [processedMenus]);

  return (
    <nav className={clsx('left-sidebar', widthClass)}>
      {processedMenus.map((menu, index) => (
        <LeftMenuItem key={index} menu={menu} index={index} />
      ))}
    </nav>
  );
}
