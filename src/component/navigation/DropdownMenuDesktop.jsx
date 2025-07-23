import React from 'react';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import clsx from 'clsx';
// import useClickAway from '../../common/hook/useClickAway.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import AppContext from '../../common/context/app/app.context.js';
import { mockMenu } from '../../common/constant/dummy.js';

const isDevMode = import.meta.env.DEV;

/**
 * @type {React.NamedExoticComponent<{
 *        readonly listMenu?: Array<AppMenu>
 *     }>}
 */
const ListMenu = React.memo(({ listMenu }) => {
  // Track open state for each menu item individually
  const [openedItems, setOpenedItems] = React.useState({});

  // Get current page
  const currentPage = useQueryParam('c');

  // Toggle open state for a specific item
  const toggleItem = (key) => {
    setOpenedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {listMenu.map((item, index) => (
        <li
          key={index}
          className={clsx('border-b !cursor-pointer', 'last:border-none')}
        >
          <div
            className={clsx(
              'transition border-s-danger-cinnabar hover:border-s-4',
              'hover:shadow-soft hover:bg-gray-black-squeeze',
              currentPage === item.key ? 'border-s-4' : ''
            )}
          >
            <div className="!ps-4 !py-2">
              <div className="flex items-center justify-between gap-2">
                <a
                  href={item.href}
                  className="flex-1 !p-0 !border-none !text-gray-mirage"
                  onClick={() => {
                    console.log(item.href)
                  }}
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
                  />
                )}
              </div>
            </div>
          </div>

          {item.children && item.children.length > 0 && (
            <ul
              className={clsx(
                'sub-open overflow-hidden !static !ps-3 transition',
                openedItems[item.key] ? 'visible h-auto' : 'invisible h-0'
              )}
            >
              <ListMenu listMenu={item.children} />
            </ul>
          )}
        </li>
      ))}
    </>
  );
});
ListMenu.displayName = 'ListMenu';

/**
 * Dropdown menu for desktop
 *
 * @returns {JSX.Element}
 * @constructor
 */
const DropdownMenuDesktop = () => {
  // Get context data
  const { menu } = React.useContext(AppContext);
  const menus = isDevMode ? mockMenu : menu;

  // Get current page
  const currentPage = useQueryParam('c');

  // Track open state for each menu item individually
  const [openedItems, setOpenedItems] = React.useState({});

  // Toggle open state for a specific item
  const toggleItem = (key) => {
    setOpenedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Main dropdown ref
  const wrapperRef = React.useRef(null);

  /**
   * Handle click away
   */
  // useClickAway(wrapperRef, () => {
  //   setOpenedItems({});
  // });

  return (
    <>
      <nav className="navigation">
        <ul className="flex overflow-x-scroll">
          {menus.map((menuItem, i) => (
            <li
              key={i}
              className={clsx(
                'flex gap-1 p-[16px] border-b-[3px]',
                menuItem.key === currentPage ?
                  'border-primary-main shadow-lg'
                  :
                  'border-transparent hover:border-primary-main hover:shadow-lg'
              )}
            >
              <a className="transition-all hover:translate-y-0.5 text-gray-mirage visited:text-gray-mirage hover:no-underline"
                href={menuItem.href}>{menuItem.label}</a>{' '}
              <>
                {menuItem.children?.length > 0 && (
                  <>
                    <ChevronButton
                      className={clsx(
                        'transition',
                        openedItems[menuItem.key] ? 'rotate-90' : ''
                      )}
                      onClick={() => toggleItem(menuItem.key)}
                    />
                    <ul
                      ref={wrapperRef}
                      className={clsx(
                        'transition',
                        openedItems[menuItem.key] ? 'open' : 'inactive'
                      )}
                    >
                      <button
                        className="nav-dropdown-close"
                        onClick={() => toggleItem(menuItem.key)}
                      >
                        Close ×
                      </button>
                      <ListMenu listMenu={menuItem.children} />
                    </ul>
                  </>
                )}
              </>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default DropdownMenuDesktop;
