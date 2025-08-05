import LeftMenuItem from './LeftMenuItem.jsx';

export default function LeftSidebar({ menus }) {

    // only allow top level items to have children
    // we dont want nesting to be too deep here
    const processedMenus = menus.map(menu => ({
        ...menu,
        children: menu.children?.map(child => ({
            ...child,
            children: undefined
        }))
    }));

    return (
        <nav className="w-[250px] hidden lg:block">
            {processedMenus.map((menu, index) => (
                <LeftMenuItem key={index} menu={menu} index={index} />
            ))}
        </nav>
    );
}