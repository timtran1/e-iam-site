import React from 'react';
import clsx from 'clsx';
import useQueryParam from '../../common/hook/useQueryParam.js';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import {useTranslation} from 'react-i18next';
import useEffectOnce from '../../common/hook/useEffectOnce.js';
import fromPairs from '../../common/helper/fromPairs.js';
import {hasChildActive} from '../../common/helper/menu.js';

/**
 * @type {React.NamedExoticComponent<{
 *        readonly listMenu?: Array<AppMenu>
 *     }>}
 */
const DesktopMenuList = React.memo(({listMenu}) => {
  // Translation
  const {t} = useTranslation();

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

  /**
   * Handle keyboard events for chevron button
   * @param {KeyboardEvent} e
   * @param {string} itemKey
   */
  const handleChevronKeyDown = (e, itemKey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(itemKey);
    }
  };

  /**
   * Set default opened items
   */
  useEffectOnce(() => {
    setOpenedItems(() => {
      return {
        ...fromPairs(
          listMenu.map((menuItem) => [[menuItem.key], hasChildActive(menuItem)])
        ),
      };
    });
  });

  return (
    <>
      {listMenu.map((item, index) => (
        <li
          key={item.key || index}
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
                    openedItems[item.key] ? 'rotate-90' : 'rotate-0'
                  }
                  onClick={() => toggleItem(item.key)}
                  onKeyDown={(e) => handleChevronKeyDown(e, item.key)}
                  aria-expanded={!!openedItems[item.key]}
                  aria-controls={`submenu-${item.key}`}
                  aria-label={t(`Toggle ${item.label} submenu`)}
                />
              )}
            </div>
          </div>

          {item.children && item.children.length > 0 && (
            <ul
              id={`submenu-${item.key}`}
              role="menu"
              aria-label={`${item.label} submenu`}
              aria-hidden={!openedItems[item.key] ? 'true' : 'false'}
              className={clsx(
                'sub-open overflow-hidden !static !ps-3 transition',
                openedItems[item.key] ? 'visible h-auto' : 'invisible h-0'
              )}
            >
              <DesktopMenuList listMenu={item.children} />
            </ul>
          )}
        </li>
      ))}
    </>
  );
});

DesktopMenuList.displayName = 'DesktopMenuList';
export default DesktopMenuList;
