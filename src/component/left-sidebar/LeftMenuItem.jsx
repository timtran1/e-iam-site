import {useState, useRef} from 'react';
import linkIsCurrentPage from '../../common/helper/linkIsCurrentPage.js';
import clsx from 'clsx';
import Collapse from '../../common/ui/Collapse.jsx';
import {hasChildActive} from '../../common/helper/menu.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import ChevronButton from '../../common/ui/ChevronButton.jsx';

export default function LeftMenuItem({menu, index, className = ''}) {
  const hasChildren = menu.children && menu.children.length > 0;
  const isActivated = linkIsCurrentPage(menu.href);

  // Get current page
  const [currentPage] = useQueryParam('c');

  // Firstly, check if the current page is not the first page and the index is not 0
  // Secondly, check if the menu has children and if any of its children are active
  const hasActivatedChild =
    (!currentPage && !index) ||
    (hasChildren && menu.children.some((child) => hasChildActive(child)));

  // Local state for this specific menu item only - initialize to open if it has an active child
  const [isOpen, setIsOpen] = useState(hasActivatedChild);

  // Refs for animation elements
  const caretRef = useRef(null);

  // Toggle this specific menu item only
  const toggleOpen = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={clsx('left-sidebar__item--primary', className)}
        data-activated={isActivated || hasActivatedChild}
      >
        <a href={menu.href}>{menu.label}</a>

        {hasChildren && (
          <ChevronButton
            ref={caretRef}
            onClick={toggleOpen}
            chevronType="right"
            rotateChevron={isOpen ? 'rotate-90' : ''}
          />
        )}
      </div>

      {hasChildren && (
        <Collapse
          in={isOpen}
          className="min-w-full left-sidebar__item--secondary"
        >
          {menu.children.map((childMenu, childIndex) => (
            <LeftMenuItem
              key={childIndex}
              menu={childMenu}
              index={`${index}-${childIndex}`}
            />
          ))}
        </Collapse>
      )}
    </>
  );
}
