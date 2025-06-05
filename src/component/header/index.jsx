import clsx from 'clsx';
import LangSelector from './lang-selector/index.jsx';
import Navigation from '../navigation/index.jsx';
import NavigationBtn from '../navigation/navigation-btn.jsx';

/**
 * Header
 * @param {string} className
 * @returns {JSX.Element}
 * @constructor
 */
const Header = ({className}) => {
  return (
    <>
      <header
        className={clsx('border-b border-b-gray-geyser bg-white', className)}
      >
        {/*region header content*/}
        <div className=" flex items-center sm:border-b border-b-gray-geyser">
          <div className="flex items-center gap-2.5 sm:gap-[16px] padding-4 w-full h-[50px] sm:h-[85px] transition-all duration-500">
            <a
              href="/"
              className="w-[43px] h-[58px] sm:w-[250px] sm:h-[80.6px] overflow-hidden block shrink-0"
            >
              <div
                className="w-[250px] h-[80.6px] bg-cover bg-no-repeat transition-all duration-500    "
                role="img"
                aria-label="eIAM"
              ></div>
            </a>
            <div className="border-l-1 border-l-gray-westar h-10"></div>
            <div className="text-6.5 font-light">eIAM</div>
            <div className="font-light text-lg text-ellipsis hidden lg:block">
              Federal Office of Information Technology, Systems and
              Telecommunication & Federal Chancellery FCh, Digital
              Transformation and ICT Governance DTI
            </div>
          </div>
          <div className="px-4 py-1">
            {/*region lang selector*/}
            <LangSelector />
            {/*endregion lang selector*/}

            {/*region menu toggle*/}
            <NavigationBtn />
            {/*endregion menu toggle*/}
          </div>
        </div>
        {/*endregion header content*/}

        {/*region navigation*/}
        <Navigation />
        {/*endregion navigation*/}
      </header>
    </>
  );
};

export default Header;
