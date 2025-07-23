import LeftMenuItem from './LeftMenuItem.jsx';

export default function LeftSidebar({menus}) {    
    return (
        <nav className="w-[250px] hidden lg:block">
            {menus.map((menu, index) => (
                <LeftMenuItem key={index} menu={menu} index={index} />
            ))}
        </nav>
    );
}