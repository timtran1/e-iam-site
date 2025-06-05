import React from 'react';
import PureElementRendering from '../../common/ui/PureElementRendering.jsx';
import LangSelector from '../header/lang-selector/index.jsx';
import AppContext from '../../common/context/app/app.context.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import clsx from 'clsx';

/**
 * Navigation
 */
const Navigation = () => {
  // Get context data
  const {serverSideData, menu} = React.useContext(AppContext);

  // Get current page
  const currentPage = useQueryParam('c');

  /**
   * Nav ref
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const navRef = React.useRef(null);

  React.useEffect(() => {
    console.log('menu: ', menu);
    console.log('currentPage: ', currentPage);
  }, [currentPage, menu]);

  return (
    <>
      {/*region desktop nav*/}
      <nav className="navigation hidden sm:block">
        <ul>
          {menu.map((item, i) => (
            <li
              key={i}
              className={clsx(item.key === currentPage ? 'active' : 'inactive')}
            >
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      {/*endregion desktop nav*/}

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
