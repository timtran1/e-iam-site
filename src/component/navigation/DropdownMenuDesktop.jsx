import React from 'react';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import clsx from 'clsx';
import useClickAway from '../../common/hook/useClickAway.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import AppContext from '../../common/context/app/app.context.js';

/**
 * @type {React.NamedExoticComponent<{
 *        readonly listMenu?: Array<AppMenu>
 *     }>}
 */
const ListMenu = React.memo(({listMenu}) => {
  // Visible state
  const [opened, setOpened] = React.useState(false);

  // Get current page
  const currentPage = useQueryParam('c');

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
                >
                  {item.label}
                </a>

                {item.children && item.children.length > 0 && (
                  <ChevronButton
                    className={clsx(
                      'px-2 transition',
                      opened ? 'rotate-0' : 'rotate-90'
                    )}
                    onClick={() => setOpened((prev) => !prev)}
                  />
                )}
              </div>
            </div>
          </div>

          {item.children && item.children.length > 0 && (
            <ul
              className={clsx(
                'sub-open overflow-hidden !static !ps-3 transition',
                opened ? 'visible h-auto' : 'invisible h-0'
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
  const {menu} = React.useContext(AppContext);

  // Get current page
  const currentPage = useQueryParam('c');

  // Visible state
  const [opened, setOpened] = React.useState(false);

  // Main dropdown ref
  const wrapperRef = React.useRef(null);

  /**
   * Handle click away
   */
  useClickAway(wrapperRef, () => {
    setOpened(false);
  });

  return (
    <>
      <nav className="navigation">
        <ul>
          {menu.map((menuItem, i) => (
            <li
              key={i}
              className={clsx(
                'flex gap-1',
                menuItem.key === currentPage ? 'active' : 'inactive'
              )}
            >
              <a href={menuItem.href}>{menuItem.label}</a>{' '}
              <>
                {menuItem.children?.length > 0 && (
                  <>
                    <ChevronButton
                      className={clsx(
                        'transition',
                        opened ? 'rotate-0' : 'rotate-90'
                      )}
                      onClick={() => setOpened((prev) => !prev)}
                    />
                    <ul
                      ref={wrapperRef}
                      className={clsx(
                        'transition',
                        opened ? 'open' : 'inactive'
                      )}
                    >
                      <button
                        className="nav-dropdown-close"
                        onClick={() => setOpened(false)}
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
