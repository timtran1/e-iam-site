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
    <>
      {/*Figma: Main Body*/}
      <article className="container body-content__container">
        {/*Figma: Frame 7 - included LeftSidebar and MainContent*/}
        <div className="body-content__container--left">
          {/*region navigations sidebar*/}
          <div className="body-content__left-content">
            <LeftSidebar menus={menus} />
          </div>
          {/*endregion navigations sidebar*/}

          {/*region main content*/}
          <main
            {...(hasRemovedServerElements ? {id: ELEMENT_ID.CONTENT} : {})}
            className="body-content__main-content"
          >
            {isSearchResultPage ? (
              <SearchResults searchResults={searchResults} />
            ) : (
              <div dangerouslySetInnerHTML={{__html: processedContent}} />
            )}
          </main>
          {/*endregion main content*/}
        </div>

        {/*region right sidebar*/}
        <div className="body-content__container--right">
          <RightSidebar content={rightSidebarContent} />
        </div>
        {/*endregion right sidebar*/}
      </article>
    </>
  );
};

export default Content;
