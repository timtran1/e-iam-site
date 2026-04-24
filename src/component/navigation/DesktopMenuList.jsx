import React from 'react';
import clsx from 'clsx';
import useQueryParam from '../../common/hook/useQueryParam.js';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import {useTranslation} from 'react-i18next';
import fromPairs from '../../common/helper/fromPairs.js';
import {hasChildActive} from '../../common/helper/menu.js';

/**
 * @type {React.NamedExoticComponent<{
 *        readonly listMenu?: Array<AppMenu>
 *        readonly level?: number // level of menu item
 *     }>}
 */
const DesktopMenuList = React.memo(({listMenu, level = 0}) => {
  // Translation
  const {t} = useTranslation();

  // Track open state for each menu item individually
  const [openedItems, setOpenedItems] = React.useState({});

  // Get current page
  const [currentPage] = useQueryParam('c');

  /**
   * Get toggle key - format: level_index
   * @type {function(index: number): string} - index is the index of menu item
   */
  const getToggleKey = React.useCallback(
    (index) => `${level}_${index}`,
    [level]
  );

  // Toggle open state for a specific item
  const toggleItem = (index) => {
    setOpenedItems((prev) => ({
      ...prev,
      [getToggleKey(index)]: !prev[getToggleKey(index)],
    }));
  };

  /**
   * Handle keyboard events for chevron button
   * @param {KeyboardEvent} e
   * @param {number} itemIndex
   */
  const handleChevronKeyDown = (e, itemIndex) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(itemIndex);
    }
  };

  /**
   * Set default opened items
   */
  React.useEffect(() => {
    setOpenedItems(() => {
      return {
        ...fromPairs(
          listMenu.map((menuItem, index) => [
            [getToggleKey(index)],
            hasChildActive(menuItem),
          ])
        ),
      };
    });
  }, [getToggleKey, level, listMenu]);

  return (
    <>
      {listMenu.map((item, index) => (
        <li
          key={`${level}_${index}`}
          role="none"
          className={clsx('border-b !cursor-pointer last:border-none')}
        >
          <div
            className={clsx(
              'transition-all border-s-4 border-transparent hover:text-danger-cinnabar',
              currentPage === item.key
                ? 'border-s-danger-cinnabar'
                : 'hover:border-danger-cinnabar'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <a
                href={item.href}
                role="menuitem"
                className="p-4 flex-1 font-medium !border-none !text-gray-mirage transition-all hover:no-underline hover:!text-danger-cinnabar"
                aria-current={currentPage === item.key ? 'page' : undefined}
              >
                {item.label}
              </a>

              {item.children && item.children.length > 0 && (
                <ChevronButton
                  className="p-4"
                  rotateChevron={
                    openedItems[getToggleKey(index)] ? 'rotate-90' : 'rotate-0'
                  }
                  onClick={() => toggleItem(index)}
                  onKeyDown={(e) => handleChevronKeyDown(e, index)}
                  aria-expanded={!!openedItems[getToggleKey(index)]}
                  aria-controls={`submenu-${getToggleKey(index)}`}
                  aria-label={t(`Toggle ${item.label} submenu`)}
                />
              )}
            </div>
          </div>

          {item.children && item.children.length > 0 && (
            <ul
              id={`submenu-${getToggleKey(index)}`}
              role="menu"
              aria-label={`${item.label} submenu`}
              aria-hidden={!openedItems[getToggleKey(index)] ? 'true' : 'false'}
              className={clsx(
                'sub-open overflow-hidden !static !ps-3 transition',
                openedItems[getToggleKey(index)]
                  ? 'visible h-auto'
                  : 'invisible h-0'
              )}
            >
              <DesktopMenuList listMenu={item.children} level={level + 1} />
            </ul>
          )}
        </li>
      ))}
    </>
  );
});

DesktopMenuList.displayName = 'DesktopMenuList';
export default DesktopMenuList;
