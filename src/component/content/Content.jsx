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
// import useIsMobile from '../../common/hook/useIsMobile.js';
import {handleResponsiveWidth} from '../../common/utils/responsiveWidthHandler.js';
import {stripNavigationMarkers} from '../../common/helper/element-parsing.js';
import useHashScroll from '../../common/hook/useHashScroll.js';
import useSearchResult from './hooks/useSearchResult.js';
import SearchResults from './components/search-results/index.jsx';
import {ELEMENT_ID} from '../../common/constant/element-id.js';

const isDevMode = import.meta.env.DEV;
/**
 * Content
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Content = () => {
  // Get context data
  const {menu, right, news, content, headerMeta, hasRemovedServerElements} =
    useContext(AppContext);

  // Search contents
  const {isSearchResultPage, searchResults} = useSearchResult(content);

  // Init hash scroll
  useHashScroll({
    offset: (Number(headerMeta.headerHeight) || 10 * 16) + 5 * 16,
  });

  const menus = isDevMode ? mockMenu : menu;
  const rightSidebarContent = isDevMode
    ? mockRightContent
    : [right, news].filter(Boolean).join('<br>');
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

  // const {isMobile} = useIsMobile();

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
    <article className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-3 xl:gap-12 justify-between max-w-full py-3 lg:py-12">
        {/*region navigations sidebar*/}
        <LeftSidebar menus={menus} />
        {/*endregion navigations sidebar*/}

        {/*region content*/}
        {isSearchResultPage ? (
          <main
            {...(hasRemovedServerElements ? {id: ELEMENT_ID.CONTENT} : {})}
            className="!w-full !p-0 !m-0 !border-none !min-h-0"
          >
            <SearchResults searchResults={searchResults} />
          </main>
        ) : (
          <main
            {...(hasRemovedServerElements ? {id: ELEMENT_ID.CONTENT} : {})}
            className="relative flex-1 min-w-0 mx-auto max-w-full"
            dangerouslySetInnerHTML={{__html: processedContent}}
          />
        )}
        {/*endregion content*/}

        {/*region right sidebar*/}
        <RightSidebar content={rightSidebarContent} />
        {/*endregion right sidebar*/}
      </div>
    </article>
  );
};

export default Content;
