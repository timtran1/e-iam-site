import React from 'react';
import clsx from 'clsx';
import {useTranslation} from 'react-i18next';
import {TranslationNamespace} from '../../../constants/translation.js';

/**
 * Core Functions of the eIAM System
 *
 * @type {React.NamedExoticComponent<{
 *   className: string
 * }>}
 */
const EIAMSystem = React.memo(({className}) => {
  // Translation
  const {t} = useTranslation(TranslationNamespace.HomePage);

  return (
    <>
      <section
        className={clsx(
          'text-primary-text container mx-auto px-4 max-w-7xl',
          'grid gap-6 grid-cols-10',
          className
        )}
      >
        <h1
          className="col-span-10 md:col-span-6 !my-0 !text-heading !font-semibold !text-7.5 md:!text-10 !text-center md:!text-left"
        >
          {t('EIAMSystem.title', 'Core Functions of the eIAM System')}
        </h1>

        <div className="col-span-10 md:col-span-4 font-normal text-base md:text-lg text-center md:text-left">
          {t(
            'EIAMSystem.description',
            'eIAM enables secure, scalable access to digital government services through centralised identity management. Our platform supports authentication, authorisation, and integration for a wide range of public sector applications.'
          )}
        </div>
      </section>
    </>
  );
});

EIAMSystem.displayName = 'EIAMSystem';
export default EIAMSystem;
