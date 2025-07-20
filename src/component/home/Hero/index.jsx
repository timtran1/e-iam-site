import React from 'react';
import clsx from 'clsx';
import {HERO_NAVIGATION_KEY, HERO_NAVIGATIONS} from './constant.js';
// import {useSearchParams} from 'react-router-dom';
import {QueryParamKey} from '../../../constants/queryParams.js';

/**
 * Hero section
 *
 * @type {React.NamedExoticComponent<object>}
 */
const Hero = React.memo(() => {
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

  const selectedNav = null

  return (
    <>
      <section
        className="md:container max-w-7xl mx-auto md:px-4 md:py-20"
      >
        <div className="flex gap-8">
          {/*region navigations sidebar*/}
          <nav className="min-w-52 hidden md:block">
            {Object.entries(HERO_NAVIGATIONS).map(([navKey, item], index) => (
              <a
                key={index}
                href={`?${QueryParamKey.HomePageSubTab}=${navKey}`}
                className={clsx(
                  '!border-b !border-gray-athens-gray !py-4 block !text-secondary-text hover:!no-underline !text-base',
                  selectedNav === navKey ? '!bg-gray-athens-gray' : ''
                )}
              >
                <div className="font-medium">{item.label}</div>
                {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
                {item.rightSection && <div className="float-right">{item.rightSection}</div>}
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
