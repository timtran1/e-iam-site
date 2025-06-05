import React from 'react';
import PureElementRendering from '../../common/ui/PureElementRendering.jsx';
import LangSelector from '../header/lang-selector/index.jsx';
import AppContext from '../../common/context/app/app.context.js';

/**
 * Parse menu
 * @param {Element} ul - ul element
 * @returns {*[]}
 */
const parseMenu = (ul) => {
  const items = [];
  if (ul) {
    ul.querySelectorAll(':scope > li').forEach((li) => {
      const a = li.querySelector(':scope > a');
      const submenu = li.querySelector(':scope > ul');
      const item = {
        label: a?.textContent?.trim() || '',
        href: a?.getAttribute('href') || undefined,
      };
      if (submenu) {
        item.children = submenu ? parseMenu(submenu) : [];
      }
      items.push(item);
    });
  }
  return items;
};

/**
 * Navigation
 */
const Navigation = () => {
  // Get context data
  const {serverSideData} = React.useContext(AppContext);

  const [menu, setMenu] = React.useState([]);

  /**
   * Nav ref
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const navRef = React.useRef(null);

  /**
   * Handle nav changes
   * @type {(function())|*}
   */
  const handleNavChange = React.useCallback(() => {}, []);

  React.useEffect(() => {
    if (serverSideData.navigation) {
      setMenu(parseMenu(serverSideData.navigation.querySelector('ul')));
    }
  }, [serverSideData.navigation]);

  React.useEffect(() => {
    console.log('menu: ', menu);
  }, [menu]);

  return (
    <>
      <PureElementRendering
        component="nav"
        className="navigation hidden sm:block"
        ele={serverSideData.navigation}
        onUpdated={handleNavChange}
      />

      {/*region mobile nav*/}
      <div className="navigation-mobile border-t border-t-[#dfe4e9] fixed left-0 right-0 top-[50px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 sm:hidden">
        <div className="relative p-4 border-b border-b-[#dfe4e9]">
          <button className="lang-switcher flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer">
            <span className="current-lang">EN</span>
            <svg
              className="lang-caret w-4 h-4 transform transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div className="lang-dropdown w-[77px] border-t border-t-[#dfe4e9] shadow-[0_3px_4px_1px_#828e9a] absolute left-4 mt-2 bg-white overflow-hidden z-50 transform origin-top scale-y-0 opacity-0 transition-all duration-300">
            <LangSelector serverSideData={serverSideData} />
          </div>
        </div>
        <PureElementRendering ref={navRef} ele={serverSideData.navigation} />
      </div>
      {/*endregion mobile nav*/}
    </>
  );
};

export default Navigation;
