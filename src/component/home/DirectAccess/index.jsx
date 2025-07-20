import React from 'react';
import {useTranslation} from 'react-i18next';
import {DIRECT_ACCESS} from './constant.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {TranslationNamespace} from '../../../constants/translation.js';

/**
 * Direct access section
 *
 * @type {React.NamedExoticComponent<object>}
 */
const DirectAccess = React.memo(() => {
  // Translation
  const {t} = useTranslation(TranslationNamespace.HomePage);

  return (
    <>
      <section className="bg-gray-aqua-haze py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/*region heading*/}
          <h1
            className="font-bold !text-6.5 md:!text-10 text-center text-heading"
          >
            {t('DirectAccess.title', 'Direct Access')}
          </h1>
          {/*endregion heading*/}

          {/*region contents*/}
          <div>
            {Object.entries(DIRECT_ACCESS).map(
              ([directAccessGroup, directAccessItems]) => (
                <div
                  key={directAccessGroup}
                  className="border-b border-gray pb-5 md:pb-6 last:border-none"
                >
                  <h2
                    className="text-heading !my-5 !text-3.75 font-bold"
                  >
                    {t(directAccessGroup)}
                  </h2>
                  <div className="grid gap-x-12 md:gap-x-24 gap-y-3 grid-cols-1 md:grid-cols-2">
                    {directAccessItems.map((item, index) => (
                      <div key={`${directAccessGroup}-${index}`}>
                        <a className="cursor-pointer">
                          <h3
                            className="text-heading !text-xl font-bold !my-2.5 flex justify-between items-center gap-6 group"
                          >
                            <span>
                              {t(item.titleI18nKey, item.title)}
                            </span>
                            <span
                              className="transition -translate-x-1/3 group-hover:translate-x-0"
                            >
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="text-primary-main text-sm"
                              />
                            </span>
                          </h3>
                        </a>
                        <p
                          className="text-gray-ebony-clay font-normal"
                        >
                          {t(item.descriptionI18nKey, item.description)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
          {/*endregion contents*/}
        </div>
      </section>
    </>
  );
});

DirectAccess.displayName = 'DirectAccess';
export default DirectAccess;
