import React from 'react';
import clsx from 'clsx';
import {useTranslation} from 'react-i18next';
import {TranslationNamespace} from '../../../constants/translation.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';

/**
 * CH-LOGIN FAQ & Help section
 *
 * @type {React.NamedExoticComponent<{
 *   className: string
 * }>}
 */
const CHLoginAndTechInfo = React.memo(({className}) => {
  // Translation
  const {t} = useTranslation(TranslationNamespace.HomePage);

  return (
    <>
      <section
        className={clsx(
          'container mx-auto px-4 max-w-7xl',
          'grid gap-8 grid-cols-10',
          className
        )}
      >
        {/*region CH-LOGIN FAQ & Help*/}
        <div className="col-span-10 md:col-span-6 bg-gray-aqua-haze p-6 md:p-10 relative min-h-120">
          <a href="/pages/index.html?c=f!chlfaq!pub" className="block no-underline text-inherit" style={{ color: 'inherit', textDecoration: 'none' }}>
            {/*region content*/}
            <h2 className="!text-7 !font-extrabold !mt-0 !mb-2.5">
              {t('CHLoginAndTechInfo.title1', 'CH-LOGIN FAQ & Help')}{' '}
              <span><FontAwesomeIcon icon={faArrowRight} /></span>
            </h2>
            <p className="text-base font-normal">
              {t(
                'CHLoginAndTechInfo.description1',
                'CH-LOGIN is the eIAM login for citizens and business representatives.'
              )}
            </p>
            {/*endregion content*/}

            {/*region image*/}
            <div className="absolute bottom-0 right-0 overflow-hidden">
              <img
                className="scale-105 md:scale-100"
                src={t(
                  'CHLoginAndTechInfo.img1',
                  '/r/faqandhelp/faqandhelp_de.svg'
                )}
                alt="faq-and-help"
              />
            </div>
            {/*endregion image*/}
          </a>
        </div>
        {/*endregion CH-LOGIN FAQ & Help*/}

        {/*region Technical Information*/}
        <div className="col-span-10 md:col-span-4 bg-gray-aqua-haze p-6 md:p-10 relative min-h-120">
          <a href="/pages/index.html?c=f!eiamfunc!pub" className="block no-underline text-inherit" style={{ color: 'inherit', textDecoration: 'none' }}>
            {/*region content*/}
            <h2 className="!text-7 !font-extrabold !mt-0 !mb-2.5">
              {t(
                'CHLoginAndTechInfo.title2',
                'Technical Information for Internal and External IT Specialists'
              )}
            </h2>
            <p className="text-base font-normal">
              {t(
                'CHLoginAndTechInfo.description2',
                'Description of services, glossary, connecting applications to eIAM.'
              )}
            </p>
            {/*endregion content*/}

            {/*region image*/}
            <div className="absolute bottom-0 md:right-0 overflow-hidden">
              <img
                className="scale-105 md:scale-100"
                src={t(
                  'CHLoginAndTechInfo.img2',
                  '/r/techinfo/techinfo_de.svg'
                )}
                alt="tech-information"
              />
            </div>
            {/*endregion image*/}
          </a>
        </div>
        {/*endregion Technical Information*/}
      </section>
    </>
  );
});

CHLoginAndTechInfo.displayName = 'CHLoginAndTechInfo';
export default CHLoginAndTechInfo;
