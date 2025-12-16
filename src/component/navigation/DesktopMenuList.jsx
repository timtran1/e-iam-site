import React from 'react';
import clsx from 'clsx';
import useQueryParam from '../../common/hook/useQueryParam.js';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import {useTranslation} from 'react-i18next';

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
  const currentPage = useQueryParam('c');

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

  return (
    <>
      {listMenu.map((item, index) => (
        <li
          key={item.key || index}
          role="none"
          className={clsx('border-b !cursor-pointer', 'last:border-none')}
        >
          <div
            className={clsx(
              'transition-all border-s-4 border-transparent hover:translate-x-0.5',
              ' hover:bg-gray-black-squeeze',
              currentPage === item.key
                ? 'border-s-danger-cinnabar shadow-soft'
                : 'hover:border-danger-cinnabar hover:shadow-soft'
            )}
          >
            <div className="!ps-4 !py-2">
              <div className="flex items-center justify-between gap-2">
                <a
                  href={item.href}
                  role="menuitem"
                  className="flex-1 !p-0 !border-none !text-gray-mirage hover:no-underline"
                  aria-current={currentPage === item.key ? 'page' : undefined}
                >
                  {item.label}
                </a>

                {item.children && item.children.length > 0 && (
                  <ChevronButton
                    className={clsx(
                      'px-2 transition',
                      openedItems[item.key] ? 'rotate-0' : 'rotate-90'
                    )}
                    onClick={() => toggleItem(item.key)}
                    onKeyDown={(e) => handleChevronKeyDown(e, item.key)}
                    aria-expanded={!!openedItems[item.key]}
                    aria-controls={`submenu-${item.key}`}
                    aria-label={t(`Toggle ${item.label} submenu`)}
                  />
                )}
              </div>
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
