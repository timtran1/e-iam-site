import React from 'react';
import ToggleButton from '../../common/ui/ToggleButton.jsx';
import clsx from 'clsx';
import LangSelector from '../header/LangSelector.jsx';
import AppContext from '../../common/context/app/app.context.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import {MockingExternalLinks, mockMenu} from '../../common/constant/dummy.js';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import {useTranslation} from 'react-i18next';
import {useElementSize} from '@mantine/hooks';
import useHtmlZoom from '../../common/hook/useHtmlZoom.js';

const isDevMode = import.meta.env.DEV;

/**
 * Render external links
 *
 * @param {Array<{text: string, href: string}>} externalLinks
 * @returns {*}
 * @constructor
 */
const ExternalLinks = ({externalLinks = []}) => {
  return (
    <>
      <ul className="header-navigation__external-links-mobile">
        {externalLinks.map((link, index) => (
          <li key={index}>
            <a href={link.href}>{link.text}</a>
          </li>
        ))}
      </ul>
    </>
  );
};

/**
 * Recursively adds a `menuDepth` property to each item in the menu list to indicate its nesting level.
 *
 * @param {Array<AppMenu>} listMenu
 * @param {number} currentDepth
 * @returns {*}
 * @private
 */
const _markMenuDepth = (listMenu, currentDepth = 0) => {
  return listMenu.map((item) => {
    const updatedItem = {
      ...item,
      menuDepth: currentDepth,
    };
    if (item.children?.length > 0) {
      updatedItem.children = _markMenuDepth(item.children, currentDepth + 1);
    }
    return updatedItem;
  });
};

/**
 * Dropdown menu for mobile
 *
 * This is bottom-sheet modal to render all of menu
 *
 * @param {Object} props
 * @param {string} props.className
 * @param {boolean} [props.opened] - Controlled opened state (optional)
 * @param {Function} [props.setOpened] - Controlled setter for opened state (optional)
 * @returns {JSX.Element}
 * @constructor
 */
const DropdownMenuMobile = ({
  opened: openedProp,
  setOpened: setOpenedProp,
  className = '',
}) => {
  // Translation
  const {t} = useTranslation();

  // HTML zoom compensation for position: fixed elements
  const htmlZoom = useHtmlZoom();

  // External links ref
  const {ref: externalLinksRef, height: externalLinksHeight} = useElementSize();

  // Internal state for uncontrolled mode
  const [openedState, setOpenedState] = React.useState(false);

  // Use prop if provided, otherwise use internal state
  const opened = openedProp !== undefined ? openedProp : openedState;
  const setOpened =
    setOpenedProp !== undefined ? setOpenedProp : setOpenedState;

  // Get context data
  const appContext = React.useContext(AppContext);

  /**
   * @type {Array<AppMenu & {menuDepth: number}>}
   */
  const menus = isDevMode ? mockMenu : appContext.menu;

  // External links
  const externalLinks = React.useMemo(
    () => (isDevMode ? MockingExternalLinks : appContext.vlineLinks) || [],
    [appContext.vlineLinks]
  );

  // Get current page
  const [currentPage] = useQueryParam('c');

  // Menu depth
  const [currentMenuDepth, setCurrentMenuDepth] = React.useState(0);

  // Rendered list menu state
  const [renderedListMenu, setRenderedListMenu] = React.useState(
    _markMenuDepth(menus)
  );

  // Keep track of menu navigation history
  const [menuHistory, setMenuHistory] = React.useState([]);

  /**
   * Handle click expand menu
   * @type {(menu: AppMenu) => void}
   */
  const handleClickExpand = React.useCallback(
    (menu) => {
      if (menu.children?.length > 0) {
        // Save current menu to history before navigating deeper
        setMenuHistory((prev) => [...prev, renderedListMenu]);
        setRenderedListMenu(
          _markMenuDepth(menu.children, currentMenuDepth + 1)
        );
        setCurrentMenuDepth(currentMenuDepth + 1);
      }
    },
    [currentMenuDepth, renderedListMenu]
  );

  /**
   * Handle click back to prev menu
   *
   * @type {(function(): void)|*}
   */
  const handleClickBack = React.useCallback(() => {
    if (currentMenuDepth > 0 && menuHistory.length > 0) {
      // Get the previous menu from history
      const newHistory = [...menuHistory];
      const prevMenuList = newHistory.pop();

      setMenuHistory(newHistory);
      setRenderedListMenu(prevMenuList);
      setCurrentMenuDepth(currentMenuDepth - 1);
    }
  }, [currentMenuDepth, menuHistory]);

  /**
   * Set init menu to rendered menu
   */
  React.useEffect(() => {
    setRenderedListMenu(_markMenuDepth(menus));
    setMenuHistory([]);
    setCurrentMenuDepth(0);
  }, [menus]);

  return (
    <>
      {/*region target btn*/}
      <ToggleButton
        opened={opened}
        onClick={() => setOpened((prev) => !prev)}
      />
      {/*endregion target btn*/}

      {/*region content*/}
      <div
        style={{
          width: `${100 / htmlZoom}vw`,
          height: `calc((100vh - ${+appContext.headerMeta.headerHeight || 0}px) / ${htmlZoom})`,
        }}
        className={clsx('fixed z-50 left-0 overflow-y-scroll mt-6', className, {
          'pointer-events-none': !opened,
        })}
      >
        <div
          className={clsx(
            'h-full bg-white transition-transform duration-300 ease-in-out'
          )}
          style={{
            transform: `translateY(${opened ? 0 : `calc(-100vh - ${+appContext.headerMeta.headerHeight || 0}px - ${+externalLinksHeight || 0}px - ${6 * 4}px)`})`,
          }}
        >
          {/*region lang selector and back button*/}
          <div className="px-4 pt-2 pb-5 border-b border-b-[var(--Color-Divider-Main,#E5E7EB)]">
            {currentMenuDepth === 0 ? (
              <LangSelector />
            ) : (
              <button
                className="cursor-pointer flex gap-[4px] items-center"
                onClick={handleClickBack}
              >
                <ChevronButton
                  chevronType="left"
                  className="w-[24px] h-[24px]"
                />
                <div>{t('Back')}</div>
              </button>
            )}
          </div>
          {/*endregion lang selector and back button*/}

          {/*region menu*/}
          <nav className="mobile-navigation">
            {/*region system menu*/}
            <ul className="navigation">
              {renderedListMenu.map((menuItem, i) => (
                <li key={i} data-activated={currentPage === menuItem.key}>
                  <a href={menuItem.href}>{menuItem.label}</a>
                  {menuItem.children && menuItem.children.length > 0 && (
                    <ChevronButton
                      onClick={() => handleClickExpand(menuItem)}
                    />
                  )}
                </li>
              ))}

              <li
                ref={externalLinksRef}
                className="mobile-navigation__external-links"
              >
                {/*region external links*/}
                <ExternalLinks externalLinks={externalLinks} />
                {/*endregion external links*/}
              </li>
            </ul>
            {/*region system menu*/}
          </nav>
          {/*endregion menu*/}
        </div>
      </div>
      {/*endregion content*/}
    </>
  );
};

export default DropdownMenuMobile;
