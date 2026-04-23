import {forwardRef, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import {useTranslation} from 'react-i18next';
import DesktopMenuList from './DesktopMenuList.jsx';
import {hasChildActive} from '../../common/helper/menu.js';
import {getScrollbarWidth} from '../../common/helper/scrollbar.js';

const ThreeDots = () => {
  return (
    <>
      <div className="flex flex-col justify-between items-center min-h-6 min-w-6 p-1">
        {Array.from(Array(3).keys()).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="5"
            height="5"
            viewBox="0 0 5 5"
            fill="none"
          >
            <path
              d="M2.29249 4.584C1.83916 4.5841 1.39597 4.44976 1.01899 4.19797C0.642009 3.94618 0.34816 3.58825 0.174609 3.16945C0.00105807 2.75065 -0.0444003 2.28979 0.0439816 1.84515C0.132364 1.40052 0.350616 0.992076 0.671139 0.671485C0.991661 0.350895 1.40006 0.132554 1.84467 0.044077C2.28929 -0.0444001 2.75016 0.000960693 3.169 0.174422C3.58783 0.347884 3.94582 0.641655 4.19769 1.01858C4.44956 1.39551 4.584 1.83867 4.584 2.292C4.58327 2.89957 4.34163 3.48205 3.91206 3.91171C3.48249 4.34137 2.90006 4.58314 2.29249 4.584ZM2.29249 0.750001C1.98749 0.749904 1.68931 0.840259 1.43567 1.00964C1.18202 1.17902 0.984305 1.41981 0.867519 1.70156C0.750734 1.98332 0.720127 2.29338 0.77957 2.59253C0.839013 2.89168 0.985836 3.16648 1.20147 3.38219C1.4171 3.59789 1.69186 3.7448 1.99099 3.80434C2.29012 3.86387 2.60019 3.83337 2.88199 3.71667C3.16378 3.59997 3.40463 3.40233 3.57409 3.14874C3.74355 2.89515 3.834 2.597 3.834 2.292C3.83357 1.88326 3.67103 1.49137 3.38205 1.2023C3.09307 0.913227 2.70124 0.750572 2.29249 0.750011V0.750001Z"
              fill="#1F2937"
            />
          </svg>
        ))}
      </div>
    </>
  );
};

/**
 * Overflow menu selector
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<{
 * readonly className?: string,
 * readonly menus?: Array<AppMenu>}
 * > & React.RefAttributes<unknown>>}
 */
const DropdownOverflowMenu = forwardRef(({className, menus = []}, ref) => {
  const {t} = useTranslation();
  const [isExtended, setIsExtended] = useState(false);
  const activeMenu = useMemo(
    () => menus.some((menu) => hasChildActive(menu)),
    [menus]
  );

  /**
   * Toggle menu
   */
  const toggleMenu = () => {
    setIsExtended((prev) => !prev);
  };

  /**
   * Close menu
   */
  const closeMenu = () => {
    setIsExtended(false);
  };

  /**
   * Prevent scroll when menu is extended
   */
  useEffect(() => {
    if (isExtended) {
      const scrollbarWidth = getScrollbarWidth();
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    };
  }, [isExtended]);

  return (
    <>
      <li
        ref={ref}
        className={clsx(
          'overflow-menu-selector',
          isExtended && 'shadow-xl',
          className
        )}
      >
        <button
          className={clsx(
            'overflow-menu-selector__button',
            activeMenu && 'active'
          )}
          onClick={toggleMenu}
        >
          <span className="overflow-menu-selector__label">{t('more')}</span>
          <ThreeDots />
        </button>

        {isExtended && (
          <>
            <div
              className="overflow-menu-selector__backdrop"
              onClick={closeMenu}
            ></div>
            <div className="overflow-menu-selector__popover">
              <button
                className="overflow-menu-selector__popover__close-button"
                onClick={closeMenu}
              >
                <span> {t('Close')}</span>
                <span className="h-4 w-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <path
                      d="M6.73933 0L3.53933 3.20067L0.353333 0.0146666L0 0.368667L3.186 3.554L0.0146666 6.72467L0.368667 7.07867L3.53933 3.90733L6.72467 7.09333L7.07867 6.74L3.89267 3.554L7.09333 0.354L6.73933 0Z"
                      fill="#6B7280"
                    />
                  </svg>
                </span>
              </button>
              <ul>
                <DesktopMenuList listMenu={menus} />
              </ul>
            </div>
          </>
        )}
      </li>
    </>
  );
});

DropdownOverflowMenu.displayName = 'DropdownOverflowMenu';
export default DropdownOverflowMenu;
