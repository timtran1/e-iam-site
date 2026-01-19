import {useContext, useEffect, useMemo} from 'react';
import AppContext from '../../common/context/app/app.context.js';
import {
  mockContent,
  MockingSearchResultsContent,
  mockMenu,
  mockRightContent,
} from '../../common/constant/dummy.js';
import LeftSidebar from '../left-sidebar/LeftSidebar.jsx';
import RightSidebar from '../right-sidebar/RightSidebar.jsx';
import ArrowRightHTML from '../icons/ArrowRightHTML.js';
import {handleResponsiveWidth} from '../../common/utils/responsiveWidthHandler.js';
import {stripNavigationMarkers} from '../../common/helper/element-parsing.js';
import useHashScroll from '../../common/hook/useHashScroll.js';
import useSearchResult from './hooks/useSearchResult.js';
import SearchResults from './components/search-results/index.jsx';
import {ELEMENT_ID} from '../../common/constant/element-id.js';
import clsx from 'clsx';
import useQueryParam from '../../common/hook/useQueryParam.js';
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

/**
 * Content
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Content = () => {
  // Get current page
  const [currentPage] = useQueryParam('c'); // the 'c' letter is the page code of u5CMS

  // Get context data
  const {
    menu: originalMenu,
    right,
    news,
    content,
    headerMeta,
    hasRemovedServerElements,
  } = useContext(AppContext);

  // Search contents
  const {isSearchResultPage, searchResults} = useSearchResult(
    isDevMode ? MockingSearchResultsContent : content
  );

  // Init hash scroll
  useHashScroll({
    offset: (Number(headerMeta.headerHeight) || 10 * 16) + 5 * 16,
  });

  /**
   * Only allow top level items to have children
   * We don't want to nest to be too deep here
   *
   * @type {Array<AppMenu>}
   */
  const processedMenus = useMemo(() => {
    if (isDevMode) {
      return mockMenu;
    }
    const menus = originalMenu;

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
  }, [currentPage, originalMenu]);

  const rightSidebarContent = isDevMode
    ? mockRightContent
    : [right, news]
        .filter(Boolean)
        .join('<br>')
        ?.replace(/⇨/g, ArrowRightHTML())
        .replace(/→/g, ArrowRightHTML());

  /**
   * Show sidebar for specific pages if window.showRightSidebarPages is defined
   * @see htmltemplate.external-react.html:19
   * @type {boolean}
   */
  const showRightSidebarPages = useMemo(() => {
    if (!rightSidebarContent) {
      return false;
    }

    if (Array.isArray(window?.showRightSidebarPages)) {
      return !!window?.showRightSidebarPages.includes(currentPage || '');
    } else {
      // Show sidebar for all pages (because the showRightSidebarPages config is not defined)
      return true;
    }
  }, [currentPage, rightSidebarContent]);

  /**
   * Main content
   */
  const pageContent = isDevMode ? mockContent : content;
  const processedContent = useMemo(() => {
    if (pageContent) {
      const arrowRight = ArrowRightHTML({width: 24, height: 24});
      return stripNavigationMarkers(pageContent)
        ?.replace(/⇨/g, arrowRight)
        .replace(/→/g, arrowRight)
        .replace(/&#8594;/g, arrowRight)
        .replace(/&amp;#8594;/g, arrowRight);
    } else {
      return null;
    }
  }, [pageContent]);

  useEffect(() => {
    if (processedContent) {
      // handle responsive width for YouTube elements
      handleResponsiveWidth(true, [
        '.dlYoutubeLarge',
        '.dlYoutubeSmall',
        'dlVideoLarge',
        'iframe[src*="youtube"]',
        'iframe[title*="YouTube"]',
      ]);
    }
  }, [processedContent]);

  return (
    <>
      {/*Main Body*/}
      <article
        className={clsx(
          isSearchResultPage
            ? 'body-content__container--search-result'
            : 'body-content__container--standard',

          // Based on design, remove right padding for right sidebar with lg breakpoint
          !isSearchResultPage && showRightSidebarPages && 'lg:!pr-0'
        )}
      >
        {/*Element included LeftSidebar and MainContent*/}
        <div
          className={clsx('body-content__container__left', {
            // Based on design, if there are no left content, center the main content
            'justify-center': !processedMenus.length,
          })}
        >
          {/*region navigations sidebar*/}
          {!isSearchResultPage && !!processedMenus.length && (
            <div className="body-content__left-content">
              <LeftSidebar menus={processedMenus} />
            </div>
          )}
          {/*endregion navigations sidebar*/}

          {/*region main content*/}
          <main
            {...(hasRemovedServerElements ? {id: ELEMENT_ID.CONTENT} : {})}
            className={clsx(
              'body-content__main-content',

              // Based on design, if there are no right and left content within 'xl' breakpoint, set max width to 225px
              !showRightSidebarPages &&
                !processedMenus.length &&
                'xl:!max-w-225 2xl:!max-w-250'
            )}
          >
            {isSearchResultPage ? (
              <SearchResults className="w-full" searchResults={searchResults} />
            ) : (
              <div className='w-full' dangerouslySetInnerHTML={{__html: processedContent}} />
            )}
          </main>
          {/*endregion main content*/}
        </div>

        {/*region right sidebar*/}
        {!isSearchResultPage && showRightSidebarPages && (
          <div className="body-content__container__right">
            <RightSidebar content={rightSidebarContent} />
          </div>
        )}
        {/*endregion right sidebar*/}
      </article>
    </>
  );
};

export default Content;
