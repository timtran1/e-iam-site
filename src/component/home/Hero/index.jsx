import React from 'react';
import clsx from 'clsx';
// import {HERO_NAVIGATION_KEY, HERO_NAVIGATIONS} from './constant.js';
// import {useSearchParams} from 'react-router-dom';
// import {QueryParamKey} from '../../../constants/queryParams.js';
import AppContext from '../../../common/context/app/app.context.js';

/**
 * Hero section
 *
 * @type {React.NamedExoticComponent<object>}
 */
const Hero = React.memo(() => {
  const {menu} = React.useContext(AppContext);
  // Query params
  // const [searchParams] = useSearchParams();

  // /**
  //  * Selected nav
  //  * @type {string}
  //  */
  // const selectedNav = React.useMemo(
  //   () =>
  //     searchParams.get(QueryParamKey.HomePageSubTab) ||
  //     HERO_NAVIGATION_KEY.StartPage,
  //   [searchParams]
  // );
  
  const currentPath = window.location.pathname;

  return (
    <>
      <section
        className="md:container max-w-7xl mx-auto md:px-4 md:py-20"
      >
        <div className="flex gap-8">
          {/*region navigations sidebar*/}
          <nav className="min-w-52 hidden md:block">
            {menu.map((menu, index) => (
              <a
                key={index}
                href={menu.href}
                className={clsx(
                  '!border-b !border-gray-athens-gray !py-4 block !text-secondary-text hover:!no-underline !text-base',
                  currentPath === menu.href ? '!bg-gray-athens-gray' : ''
                )}
              >
                <div className="font-medium">{menu.label}</div>
                {/* {menu.description && <div className="text-sm text-gray-500">{menu.description}</div>} */}
                {/* {menu.rightSection && <div className="float-right">{menu.rightSection}</div>} */}
              </a>
            ))}
          </nav>
          {/*endregion navigations sidebar*/}

          {/*region content*/}
          <div className="flex-1">
            <iframe
              className="w-full min-h-48 sm:min-h-64 md:h-full"
              title="YouTube video player"
              src="//www.youtube-nocookie.com/embed/5qF3vccjw6s?rel=0&amp;cc_load_policy=1"
              allowFullScreen
            ></iframe>
          </div>
          {/*endregion content*/}
        </div>
      </section>
    </>
  );
});

Hero.displayName = 'Hero';
export default Hero;
