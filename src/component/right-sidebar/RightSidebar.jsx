import React from 'react';
import ArrowRightHTML from '../icons/ArrowRightHTML.js';
import AppContext from '../../common/context/app/app.context.js';

export default function RightSidebar({content}) {
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

  // Check when asideRef is rendered
  React.useEffect(() => {
    if (asideRef.current) {
      setIsAsideRendered(true);
    }
  }, [processedContent]);

  return (
    <aside className="right-sidebar w-full sm:w-[350px] bg-gray-aqua-haze px-6 py-3 space-y-6">
      <div
        className="sticky"
        style={{top: headerMeta.headerHeight + 16 || 10 * 16}}
      >
        <div
          ref={asideRef}
          dangerouslySetInnerHTML={{__html: processedContent}}
        />
        <div className="space-y-3.5">
          {sideAnchors?.map((anchor, _index) => (
            <React.Fragment key={_index}>
              {anchor.parentDiv && (
                <div
                  className="leading-5 active:text-gray-shadow hover:underline"
                  dangerouslySetInnerHTML={{__html: anchor.parentDiv.outerHTML}}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </aside>
  );
}
