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
 * @param {boolean=} sticky
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Header = ({className, sticky = false}) => {
  // Header ref
  const {ref: headerRef, height: headerHeight} = useElementSize();

  // Get app context
  const {headerMeta, setHeaderMeta} = React.useContext(AppContext);

  // Mobile navigation menu opened state
  const [isMobileMenuOpened, setIsMobileMenuOpened] = React.useState(false);

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

  /**
   * Handle scroll to top and lock body scroll when mobile menu is opened
   */
  React.useEffect(() => {
    if (isMobileMenuOpened) {
      // Scroll to top
      window.scrollTo({top: 0, behavior: 'smooth'});

      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock body scroll
      document.body.style.overflow = '';
    }

    // Cleanup function to ensure scroll is unlocked when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpened]);

  return (
    <>
      <header
        ref={headerRef}
        style={{
          ...(headerMeta?.backgroundImage && {
            backgroundImage: headerMeta.backgroundImage,
          }),
        }}
        className={clsx({'z-50 sticky top-0': sticky}, className)}
      >
        {/*region header content*/}
        <div className="top-header">
          <div className="container mx-auto flex items-center">
            <div className="flex items-center gap-2.5 lg:gap-4 padding-4 w-full h-[50px] lg:h-[85px] transition-all duration-500">
              <a
                href="/"
                className="w-[43px] h-[58px] lg:w-[250px] lg:h-[80.6px] overflow-hidden block shrink-0"
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
              <div className="text-6.5 font-bold text-gray-ebony-clay">
                eIAM
              </div>
              <div className="font-bold text-base leading-6 text-gray-ebony-clay text-ellipsis hidden lg:block">
                Federal Office of Information Technology, Systems and
                Telecommunication & Federal Chancellery FCh, Digital
                Transformation and ICT Governance DTI
              </div>
            </div>
            <div
              className={clsx(
                'ps-2 md:ps-4 py-1 flex items-center gap-3 flex-row-reverse lg:block'
              )}
            >
              {/*region lang selector*/}
              <div className="hidden lg:block text-end">
                <LangSelector />
              </div>
              {/*endregion lang selector*/}

              {/*region mobile nav*/}
              <div className="lg:hidden">
                <Navigation.Mobile
                  opened={isMobileMenuOpened}
                  setOpened={setIsMobileMenuOpened}
                />
              </div>
              {/*endregion mobile nav*/}

              {/*region search input*/}
              <div className="pt-0 lg:pt-3 min-w-36 flex justify-end">
                <SearchInput />
              </div>
              {/*endregion search input*/}
            </div>
          </div>
        </div>
        {/*endregion header content*/}

        {/*region navigation*/}
        <div className="hidden lg:block desktop-menu">
          <Navigation.Desktop />
        </div>
        {/*endregion navigation*/}
      </header>
    </>
  );
};

export default Header;
