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

const isDevMode = import.meta.env.DEV;
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
  const {menu, right, news, content, headerMeta, hasRemovedServerElements} =
    useContext(AppContext);

  // Search contents
  const {isSearchResultPage, searchResults} = useSearchResult(
    isDevMode ? MockingSearchResultsContent : content
  );

  // Init hash scroll
  useHashScroll({
    offset: (Number(headerMeta.headerHeight) || 10 * 16) + 5 * 16,
  });

  const menus = isDevMode ? mockMenu : menu;
  const rightSidebarContent = isDevMode
    ? mockRightContent
    : [right, news]
        .filter(Boolean)
        .join('<br>')
        ?.replace(/⇨/g, ArrowRightHTML())
        .replace(/→/g, ArrowRightHTML());
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
          'container',
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
            'justify-center': !menus.length,
          })}
        >
          {/*region navigations sidebar*/}
          {!isSearchResultPage && !!menus.length && (
            <div className="body-content__left-content">
              <LeftSidebar menus={menus} />
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
                !menu.length &&
                'xl:!max-w-225 2xl:!max-w-250'
            )}
          >
            {isSearchResultPage ? (
              <SearchResults className="w-full" searchResults={searchResults} />
            ) : (
              <div dangerouslySetInnerHTML={{__html: processedContent}} />
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
