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

const isDevMode = import.meta.env.DEV;
/**
 * Content
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Content = () => {
  // Get context data
  const {menu, rightContent, content} = useContext(AppContext);

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
        <div className="flex flex-col sm:flex-row gap-12 justify-between">
          {/*region navigations sidebar*/}
          <LeftSidebar menus={menus} />
          {/*endregion navigations sidebar*/}

          {/*region content*/}
          <div className="grow">
            <div
              className="mx-auto max-w-[740px]"
              dangerouslySetInnerHTML={{__html: processedContent}}
            />
          </div>
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
