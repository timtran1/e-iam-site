import React from 'react';
import clsx from 'clsx';
import {useTranslation} from 'react-i18next';
import {TranslationNamespace} from '../../../constants/translation.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';

/**
 * Info for app officers and integration managers section
 *
 * @type {React.NamedExoticComponent<{
 *   className: string
 * }>}
 */
const OfficersAndManagers = React.memo(({className}) => {
  // Translation
  const {t} = useTranslation(TranslationNamespace.HomePage);

  return (
    <>
      <section
        className={clsx('container mx-auto px-4 max-w-7xl', className)}
      >
        <div className="col-span-6 bg-gray-aqua-haze p-6 md:p-10 relative min-h-[480px]">
          <a href="/pages/index.html?c=!eiam!extranet" className="block no-underline text-inherit" style={{ color: 'inherit', textDecoration: 'none' }}>
            {/*region content*/}
            <h2 className="!text-7 !font-extrabold !mt-0 !mb-2.5">
              {t(
                'OfficersAndManagers.title',
                'Info for app officers and integration managers'
              )}{' '}
              <span><FontAwesomeIcon icon={faArrowRight} /></span>
            </h2>
            <p className="text-base font-normal">
              {t(
                'OfficersAndManagers.description',
                'FCh DTI forum, requirements, P035 status, roadmap, usage obligation, FOITT tariff.'
              )}
            </p>
            {/*endregion content*/}

            {/*region image*/}
            <div className="absolute bottom-0 left-0">
              <img
                src={t(
                  'OfficersAndManagers.img',
                  '/r/officers/officers_de.svg'
                )}
                alt="officers-and-managers"
              />
            </div>
            {/*endregion image*/}
          </a>
        </div>
      </section>
    </>
  );
});

OfficersAndManagers.displayName = 'OfficersAndManagers';
export default OfficersAndManagers;
