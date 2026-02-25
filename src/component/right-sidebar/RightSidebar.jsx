import React from 'react';
import clsx from 'clsx';

export default function RightSidebar({content}) {
  // Sidebar element ref
  const asideRef = React.useRef(null);
  // Track if asideRef is rendered
  const [isAsideRendered, setIsAsideRendered] = React.useState(false);

  /**
   * Whether the right sidebar should be sticky
   * It is extracted from the wrapper element of the right sidebar content
   *
   * @type {boolean}
   */
  const isSideAnchorsFixed = React.useMemo(() => {
    if (content && isAsideRendered && asideRef.current) {
      /**@type {HTMLElement}*/
      const wrapperElement = asideRef.current.querySelector('#sideanchors');
      if (wrapperElement) {
        const wrapperPositionStyle = wrapperElement.style.position;
        return wrapperPositionStyle === 'fixed';
      }
    }
    return false;
  }, [content, isAsideRendered]);

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

        // Sort alphabetically by text field
        linkData.sort((a, b) => a.text.localeCompare(b.text));

        return linkData;
      }

      return [];
    }
    return [];
  }, [content, isAsideRendered]);

  /**
   * Check when asideRef is rendered
   */
  React.useEffect(() => {
    if (asideRef.current) {
      setIsAsideRendered(true);
    }
  }, [content]);

  return (
    <aside
      className={clsx('w-full overflow-hidden h-full break-words text-wrap')}
    >
      <>
        <div
          className="body-content__container__right__normal-content"
          ref={asideRef}
          dangerouslySetInnerHTML={{__html: content}}
        />

        <div
          className={clsx('body-content__container__right__anchors', {
            'p-4': !!sideAnchors?.length,
            fixed: isSideAnchorsFixed,
          })}
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
    </aside>
  );
}
