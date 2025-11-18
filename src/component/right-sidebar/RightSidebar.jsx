import React, {useMemo} from 'react';
import ArrowRightHTML from '../icons/ArrowRightHTML.js';
import AppContext from '../../common/context/app/app.context.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import clsx from 'clsx';

export default function RightSidebar({content, sticky = false}) {
  // Get current page
  const [currentPage] = useQueryParam('c'); // the 'c' letter is the page code of u5CMS

  // Get app context
  const {headerMeta} = React.useContext(AppContext);

  // Sidebar element ref
  const asideRef = React.useRef(null);
  // Track if asideRef is rendered
  const [isAsideRendered, setIsAsideRendered] = React.useState(false);

  // Replace all ⇨ with ArrowRightHTML
  const processedContent = React.useMemo(
    () =>
      content?.replace(/⇨/g, ArrowRightHTML()).replace(/→/g, ArrowRightHTML()),
    [content]
  );

  const widthClass = React.useMemo(() => {
    if (content) {
      return 'sm:max-w-[150px] lg:max-w-[200px] xl:max-w-[220px] 2xl:max-w-[260px] shrink-[5] ';
    }
    // produce spacer to let main content be in center
    return 'invisible w-0 lg:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px]';
  }, [content]);

  /**
   * @type {Array<{
   *     index: number, href: string, text: string, name: string, className: string, parentDiv: HTMLElement
   * }>}
   */
  const sideAnchors = React.useMemo(() => {
    if (content && isAsideRendered && asideRef.current) {
      const element = asideRef.current.querySelector('#iii');

      // Check if element is a child of asideRef.current
      if (element && asideRef.current.contains(element)) {
        // Get all anchor links within the element
        const anchors = element.querySelectorAll('a[href]');
        const linkData = [];

        anchors.forEach((anchor, index) => {
          const href = anchor.getAttribute('href');
          const textContent = anchor.textContent.trim();
          const parentDiv = anchor.closest('div[name]');
          const className = parentDiv ? parentDiv.getAttribute('class') : '';

          // Clone parentDiv and remove onclick attributes from all elements
          const clonedParentDiv = parentDiv.cloneNode(true);
          const elementsWithOnclick =
            clonedParentDiv.querySelectorAll('[onclick]');
          elementsWithOnclick.forEach((el) => el.removeAttribute('onclick'));

          linkData.push({
            index: index,
            href: href,
            text: textContent,
            className: className,
            parentDiv: clonedParentDiv,
          });
        });
        return linkData;
      }

      return [];
    }
    return [];
  }, [content, isAsideRendered]);

  /**
   * Show sidebar for specific pages if window.showRightSidebarPages is defined
   * @see htmltemplate.external-react.html:19
   * @type {boolean}
   */
  const showRightSidebarPages = useMemo(() => {
    if (Array.isArray(window?.showRightSidebarPages)) {
      return !!window?.showRightSidebarPages.includes(currentPage || '');
    } else {
      // Show sidebar for all pages (because the showRightSidebarPages config is not defined)
      return true;
    }
  }, [currentPage]);

  // Check when asideRef is rendered
  React.useEffect(() => {
    if (asideRef.current) {
      setIsAsideRendered(true);
    }
  }, [processedContent]);

  return (
    <aside
      className={clsx(
        'right-sidebar h-full break-words text-wrap bg-gray-aqua-haze border border-gray-aqua-haze px-3 lg:px-6 py-3 lg:py-6 shadow',
        widthClass
      )}
    >
      {showRightSidebarPages && (
        <>
          <div
            ref={asideRef}
            dangerouslySetInnerHTML={{__html: processedContent}}
          />

          <div
            className={clsx({sticky: sticky})}
            style={{
              ...(sticky && {top: headerMeta.headerHeight + 16 || 10 * 16}),
            }}
          >
            {sideAnchors?.map((anchor, _index) => (
              <React.Fragment key={_index}>
                {anchor.parentDiv && (
                  <div
                    className="leading-5 active:text-gray-shadow hover:underline"
                    dangerouslySetInnerHTML={{
                      __html: anchor.parentDiv.outerHTML,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
