import {useState, useRef} from 'react';
import linkIsCurrentPage from '../../common/helper/linkIsCurrentPage.js';
import clsx from 'clsx';
import Collapse from '../../common/ui/Collapse.jsx';
import {hasChildActive} from '../../common/helper/menu.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import ChevronButton from '../../common/ui/ChevronButton.jsx';

export default function LeftMenuItem({menu, index, className = '', isOpen, onToggle}) {
  const hasChildren = menu.children && menu.children.length > 0;
  const isActivated = linkIsCurrentPage(menu.href);

  // Get current page
  const [currentPage] = useQueryParam('c');

  const hasActivatedChild =
    (!currentPage && !index) ||
    (hasChildren && menu.children.some((child) => hasChildActive(child)));

  // Track which child is open for accordion behavior at this level
  const [openChildIndex, setOpenChildIndex] = useState(() => {
    if (!hasChildren) return null;
    for (let i = 0; i < menu.children.length; i++) {
      const child = menu.children[i];
      const childHasChildren = child.children && child.children.length > 0;
      if (childHasChildren && child.children.some((c) => hasChildActive(c))) return i;
    }
    return null;
  });

  // Refs for animation elements
  const caretRef = useRef(null);

  const toggleOpen = (e) => {
    e.preventDefault();
    onToggle();
  };

  const handleChildToggle = (childIndex) => {
    setOpenChildIndex((prev) => (prev === childIndex ? null : childIndex));
  };

  return (
    <>
      <div
        className={clsx('left-sidebar__item--primary', className)}
        data-activated={isActivated || hasActivatedChild}
      >
        <a href={menu.href} className='hover:translate-x-0.5 transition-transform duration-100'>{menu.label}</a>

        {hasChildren && (
          <ChevronButton
            ref={caretRef}
            onClick={toggleOpen}
            chevronType="right"
            className="w-[24px] h-full"
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
              isOpen={openChildIndex === childIndex}
              onToggle={() => handleChildToggle(childIndex)}
            />
          ))}
        </Collapse>
      )}
    </>
  );
}
