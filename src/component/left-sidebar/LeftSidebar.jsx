import LeftMenuItem from './LeftMenuItem.jsx';
import clsx from 'clsx';

export default function LeftSidebar({menus}) {
  return (
    <nav className={clsx('left-sidebar')}>
      {menus.map((menu, index) => (
        <LeftMenuItem key={index} menu={menu} index={index} />
      ))}
    </nav>
  );
}
