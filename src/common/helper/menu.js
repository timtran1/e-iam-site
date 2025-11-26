import linkIsCurrentPage from './linkIsCurrentPage.js';

/**
 * Check if a menu item or any of its children is active/current page
 * @param {AppMenu} menuItem
 * @returns {boolean}
 */
export const hasChildActive = (menuItem) => {
  // Check if the current menu item is active
  if (linkIsCurrentPage(menuItem.href)) {
    return true;
  }

  // Check if any children are active (recursive)
  if (menuItem.children && menuItem.children.length > 0) {
    return menuItem.children.some((child) => hasChildActive(child));
  }

  return false;
};
