import {useContext, useEffect, useMemo} from 'react';
import AppContext from '../../common/context/app/app.context.js';
import {
  mockMenu,
  mockContent,
  mockRightContent,
} from '../../common/constant/dummy.js';
import LeftSidebar from '../left-sidebar/LeftSidebar.jsx';
import RightSidebar from '../right-sidebar/RightSidebar.jsx';
import ArrowRightHTML from '../icons/ArrowRightHTML.js';
import useIsMobile from '../../common/hook/useIsMobile.js';
import {handleResponsiveWidth} from '../../common/utils/responsiveWidthHandler.js';
import {stripNavigationMarkers} from '../../common/helper/element-parsing.js';
import useHashScroll from '../../common/hook/useHashScroll.js';
import useSearchResult from './hooks/useSearchResult.js';
import SearchResults from './components/search-results/index.jsx';

const isDevMode = import.meta.env.DEV;
/**
 * Content
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Content = () => {
  // Get context data
  const {menu, rightContent, content, headerMeta} = useContext(AppContext);

  // Search contents
  const {isSearchResultPage, searchResults, contentWithoutSearchResults} =
    useSearchResult(content);

  // Init hash scroll
  useHashScroll({
    offset: (Number(headerMeta.headerHeight) || 10 * 16) + 5 * 16,
  });

  const menus = isDevMode ? mockMenu : menu;
  const rightSidebarContent = isDevMode ? mockRightContent : rightContent;
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

  const {isMobile} = useIsMobile();

  useEffect(() => {
    if (processedContent) {
      // handle responsive width for YouTube elements
      handleResponsiveWidth(isMobile, [
        '.dlYoutubeLarge',
        '.dlYoutubeSmall',
        'dlVideoLarge',
        'iframe[src*="youtube"]',
        'iframe[title*="YouTube"]',
      ]);
    }
  }, [isMobile, processedContent]);

  return (
    <>
      <article className="px-6 py-6 md:py-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row gap-12 justify-between max-w-full">
          {/*region navigations sidebar*/}
          <LeftSidebar menus={menus} />
          {/*endregion navigations sidebar*/}

          {/*region content*/}
          {isSearchResultPage ? (
            <main className="relative grow mx-auto max-w-full lg:max-w-[740px]">
              <div
                dangerouslySetInnerHTML={{__html: contentWithoutSearchResults}}
              ></div>
              <SearchResults searchResults={searchResults} />
            </main>
          ) : (
            <main
              className="relative grow mx-auto max-w-full lg:max-w-[740px]"
              dangerouslySetInnerHTML={{__html: processedContent}}
            />
          )}
          {/*endregion content*/}

          {/*region right sidebar*/}
          {rightSidebarContent && (
            <RightSidebar content={rightSidebarContent} />
          )}
          {/*endregion right sidebar*/}
        </div>
      </article>

      {/* Show unnecessary cookie banner */}
      {/* <CookieConsentPopup />*/}
    </>
  );
};

export default Content;
