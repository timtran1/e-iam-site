import React from 'react';
import clsx from 'clsx';
import LangSelector from './LangSelector.jsx';
import Navigation from '../navigation/index.js';
import AppContext from '../../common/context/app/app.context.js';
import {useElementSize} from '@mantine/hooks';
import SearchInput from './SearchInput.jsx';
import {useTranslation} from 'react-i18next';
import {
  MockingExternalLinks,
  MockingPageTitle,
} from '../../common/constant/dummy.js';

const isDevMode = import.meta.env.DEV;

/**
 * Render external links
 *
 * @param {Array<{text: string, href: string}>} externalLinks
 * @returns {*}
 * @constructor
 */
const ExternalLinks = ({externalLinks = []}) => {
  return (
    <>
      <ul className="header-navigation__external-links">
        {externalLinks.map((link, index) => (
          <li key={index}>
            <a href={link.href}>{link.text}</a>
          </li>
        ))}
      </ul>
    </>
  );
};

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
  const {serverSideData, headerMeta, setHeaderMeta, vlineLinks} =
    React.useContext(AppContext);

  // Mobile navigation menu opened state
  const [isMobileMenuOpened, setIsMobileMenuOpened] = React.useState(false);

  // Document title state
  const pageTitle = React.useMemo(() => {
    if (isDevMode) return MockingPageTitle;

    if (serverSideData.bit) {
      return serverSideData.bit.innerHTML;
    } else {
      return '';
    }
  }, [serverSideData.bit]);

  // External links
  const externalLinks = React.useMemo(
    () => (isDevMode ? MockingExternalLinks : vlineLinks) || [],
    [vlineLinks]
  );

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
        <div className="header__wrapper">
          <div className="flex items-center gap-4 lg:gap-2.75 flex-1">
            {/*region logo*/}
            <a
              href="/"
              aria-label={t('eIAM - Go to homepage')}
              className="lg:ml-[-12px] w-8.5 h-9.5 lg:w-64 lg:h-20 overflow-hidden"
            >
              <div
                className={clsx(
                  'bg-cover bg-no-repeat overflow-hidden',
                  'w-62.5 h-20 -translate-y-2.5 -translate-x-2.5 lg:w-full lg:h-full lg:translate-x-0 lg:translate-y-0'
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

            {/*region header and language actions*/}
            <div className="flex flex-1 justify-between items-center gap-8">
              {/*Frame 5*/}
              <div className="flex gap-4 lg:gap-6 flex-1 items-center">
                <div className="w-0.25 self-stretch bg-[var(--Color-Divider-Header)]" />
                <p
                  className="hidden lg:line-clamp-3 my-0 font-semibold max-w-[var(--Header-Max-Width,1000px)]"
                  dangerouslySetInnerHTML={{__html: pageTitle}}
                />
                <p className="lg:hidden my-0 font-semibold flex-1 max-w-[var(--Header-Max-Width,1000px)]">
                  eIAM
                </p>
              </div>

              {/*Frame 8*/}
              <div
                className={clsx(
                  'flex justify-end items-center gap-6 lg:h-18 lg:flex-col lg:items-end lg:justify-start'
                )}
              >
                {/*region lang selector*/}
                <div className="text-end hidden lg:flex lg:gap-6">
                  <ExternalLinks externalLinks={externalLinks} />
                  <LangSelector />
                </div>
                {/*endregion lang selector*/}

                {/*region search input*/}
                <div className="pt-0">
                  <SearchInput />
                </div>
                {/*endregion search input*/}

                {/*region mobile nav*/}
                <div className="lg:hidden">
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
        </div>
      </header>
      {/*endregion header*/}

      {/*region navigation*/}
      <div className="hidden lg:block">
        <Navigation.Desktop />
      </div>
      {/*endregion navigation*/}
    </>
  );
};

export default Header;
