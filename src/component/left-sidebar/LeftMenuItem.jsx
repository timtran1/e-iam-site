import {useState, useRef} from 'react';
import linkIsCurrentPage from '../../common/helper/linkIsCurrentPage.js';
import clsx from 'clsx';
import Collapse from '../../common/ui/Collapse.jsx';
import {hasChildActive} from '../../common/helper/menu.js';

export default function LeftMenuItem({menu, index}) {
  const hasChildren = menu.children && menu.children.length > 0;
  const isActive = linkIsCurrentPage(menu.href);
  const hasActiveChild =
    hasChildren && menu.children.some((child) => hasChildActive(child));

  // Local state for this specific menu item only - initialize to open if it has an active child
  const [isOpen, setIsOpen] = useState(hasActiveChild);

  // Refs for animation elements
  const caretRef = useRef(null);

  // Toggle this specific menu item only
  const toggleOpen = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-aqua-haze">
      <div
        className={clsx(
          'flex items-center justify-between transition-all border-l-4',
          isActive
            ? 'bg-gray-aqua-haze text-primary-main border-primary-main'
            : hasActiveChild
              ? 'bg-gray-athens-gray text-primary-main border-primary-main'
              : 'hover:bg-gray-aqua-haze hover:text-primary-main border-white hover:border-primary-main hover:translate-x-1'
        )}
      >
        <a
          href={menu.href}
          className={clsx(
            'flex-1 px-2 !py-4 block text-secondary-text hover:!no-underline',
            isActive || hasActiveChild ? '!text-primary-main' : ''
          )}
        >
          <div className="text-[20px] font-medium">{menu.label}</div>
        </a>

        {hasChildren && (
          <button onClick={toggleOpen} className="px-3 py-4 focus:outline-none">
            <svg
              ref={caretRef}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {hasChildren && (
        <Collapse in={isOpen}>
          <div className="pl-4">
            {menu.children.map((childMenu, childIndex) => (
              <LeftMenuItem
                key={childIndex}
                menu={childMenu}
                index={`${index}-${childIndex}`}
              />
            ))}
          </div>
        </Collapse>
      )}
    </div>
  );
}
