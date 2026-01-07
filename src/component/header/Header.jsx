import React from 'react';
import clsx from 'clsx';
import LangSelector from './LangSelector.jsx';
import Navigation from '../navigation/index.js';
import AppContext from '../../common/context/app/app.context.js';
import {useElementSize} from '@mantine/hooks';
import SearchInput from './SearchInput.jsx';
import {useTranslation} from 'react-i18next';

/**
 * Header
 * @param {string} className
 * @param {boolean=} sticky
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Header = ({className, sticky = false}) => {
  // Translation
  const {t} = useTranslation();

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
      {/*region header*/}
      <header
        ref={headerRef}
        aria-label={t('Site header')}
        style={{
          ...(headerMeta?.backgroundImage && {
            backgroundImage: headerMeta.backgroundImage,
          }),
        }}
        className={clsx({'z-50 sticky top-0': sticky}, className)}
      >
        <div className="flex items-center gap-2.75 flex-1">
          {/*region logo*/}
          <a
            href="/"
            aria-label={t('eIAM - Go to homepage')}
            className="w-8.5 h-9.5 xl:w-64 xl:h-20 overflow-hidden"
          >
            <div
              className={clsx(
                'bg-cover bg-no-repeat overflow-hidden',
                'w-62.5 h-20 -translate-y-2.5 -translate-x-2.5 xl:w-full xl:h-full xl:translate-x-0 xl:translate-y-0'
              )}
              role="img"
              aria-label={t('Swiss Confederation logo')}
              style={{
                backgroundImage:
                  "url('r/eidgenossenschaft/eidgenossenschaft_de.svg')",
              }}
            ></div>
          </a>
          {/*endregion logo*/}

          {/*region header and language actions (Figma: frame 4)*/}
          <div className="flex flex-1 justify-between items-center">
            {/*Frame 5*/}
            <div className="flex gap-6 flex-1 items-center xl:items-start">
              <div className="w-0.25 h-13.75 bg-[var(--Color-Divider-Header)]" />
              <p className="hidden xl:block my-0 font-semibold flex-1 max-w-[var(--Header-Max-Width,1000px)]">
                eIAM - Federal Office of Information Technology, Systems and
                Telecommunication & Federal Chancellery FCh, Digital
                Transformation and ICT Governance DTI
              </p>
              <p className="xl:hidden my-0 font-semibold flex-1 max-w-[var(--Header-Max-Width,1000px)]">
                eIAM
              </p>
            </div>

            {/*Frame 8*/}
            <div
              className={clsx(
                'flex justify-end items-center gap-6',
                'xl:h-18 xl:min-w-50 xl:flex-col xl:items-end'
              )}
            >
              {/*region lang selector*/}
              <div className="hidden xl:block text-end">
                <LangSelector />
              </div>
              {/*endregion lang selector*/}

              {/*region search input*/}
              <div className="pt-0">
                <SearchInput />
              </div>
              {/*endregion search input*/}

              {/*region mobile nav*/}
              <div className="xl:hidden">
                <Navigation.Mobile
                  opened={isMobileMenuOpened}
                  setOpened={setIsMobileMenuOpened}
                />
              </div>
              {/*endregion mobile nav*/}
            </div>
          </div>
          {/*endregion header and language actions*/}
        </div>
      </header>
      {/*endregion header*/}

      {/*region navigation*/}
      <div className="hidden xl:block">
        <Navigation.Desktop />
      </div>
      {/*endregion navigation*/}
    </>
  );
};

export default Header;
