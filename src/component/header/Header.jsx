import React from 'react';
import clsx from 'clsx';
import LangSelector from './LangSelector.jsx';
import Navigation from '../navigation/index.js';
import AppContext from '../../common/context/app/app.context.js';
import {useElementSize} from '@mantine/hooks';
import SearchInput from './SearchInput.jsx';

/**
 * Header
 * @param {string} className
 * @returns {JSX.Element}
 * @constructor
 */
const Header = ({className}) => {
  // Header ref
  const {ref: headerRef, height: headerHeight} = useElementSize();

  // Get app context
  const {headerMeta, setHeaderMeta} = React.useContext(AppContext);

  /**
   * Get header height and update to data context
   */
  React.useEffect(() => {
    if (headerHeight) {
      setHeaderMeta((prev) => ({
        ...prev,
        headerHeight,
      }));
    }
  }, [headerHeight, setHeaderMeta]);

  return (
    <>
      <header
        ref={headerRef}
        style={{
          ...(headerMeta?.backgroundImage && {
            backgroundImage: headerMeta.backgroundImage,
          }),
        }}
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
                style={{
                  backgroundImage:
                    "url('r/eidgenossenschaft/eidgenossenschaft_de.svg')",
                }}
              ></div>
            </a>
            <div className="border-l border-gray-geyser h-10 w-[1px]"></div>
            <div className="text-6.5 font-light">eIAM</div>
            <div className="font-light text-lg text-ellipsis hidden lg:block">
              Federal Office of Information Technology, Systems and
              Telecommunication & Federal Chancellery FCh, Digital
              Transformation and ICT Governance DTI
            </div>
          </div>

          {/*region search input for mobile*/}
          <div className="sm:hidden">
            <SearchInput />
          </div>
          {/*endregion search input for mobile*/}

          <div className="px-2 md:px-4 py-1">
            {/*region lang selector*/}
            <div className="hidden sm:block text-end mr-1">
              <LangSelector />
            </div>
            {/*endregion lang selector*/}

            {/*region mobile nav*/}
            <div className="sm:hidden">
              <Navigation.Mobile />
            </div>
            {/*endregion mobile nav*/}

            {/*region search input for desktop*/}
            <div className="pt-5 lg:pt-3 hidden sm:block">
              <SearchInput />
            </div>
            {/*endregion search input for desktop*/}
          </div>
        </div>
        {/*endregion header content*/}

        {/*region navigation*/}
        <div className="hidden sm:block">
          <Navigation.Desktop />
        </div>
        {/*endregion navigation*/}
      </header>
    </>
  );
};

export default Header;
