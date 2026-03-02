import {useEffect, useState} from 'react';
import LeftMenuItem from './LeftMenuItem.jsx';
import clsx from 'clsx';
import {hasChildActive} from '../../common/helper/menu.js';
import useQueryParam from '../../common/hook/useQueryParam.js';

export default function LeftSidebar({menus}) {
  const [currentPage] = useQueryParam('c');
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  /**
   * Set default open index
   */
  useEffect(() => {
    if (currentPage && menus?.length) {
      setOpenIndex(() => {
        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i];

          const hasChildren = menu.children && menu.children.length > 0;
          if (
            (!currentPage && i === 0) ||
            (hasChildren &&
              menu.children.some((child) => hasChildActive(child)))
          ) {
            return i;
          }
        }
        return null;
      });
    }
  }, [currentPage, menus]);

  return (
    <nav className={clsx('left-sidebar')}>
      {menus.map((menu, index) => (
        <LeftMenuItem
          key={index}
          menu={menu}
          index={index}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </nav>
  );
}
