import React from 'react';
import {useTranslation} from 'react-i18next';
import {TranslationNamespace} from '../../../constants/translation.js';

/**
 * Federal Administration Section
 * @type {React.NamedExoticComponent<object>}
 */
const FederalAdministration = React.memo(() => {
  // Translation
  const {t} = useTranslation(TranslationNamespace.HomePage);

  return (
    <>
      <section
        className="container mx-auto px-4 py-10 md:py-20 max-w-7xl"
      >
        {/*region image - visible on small screen*/}
        <div className="md:hidden mb-10 grid gap-7 grid-cols-3">
          <div className="col-span-2">
            <img
              className="h-full"
              src={t(
                'FederalAdministration.img1',
                '/r/federal-administration.png'
              )}
              alt="federal-administration"
            />
          </div>

          <div className="col-span-1">
            <img
              className="h-full"
              src={t(
                'FederalAdministration.img2',
                '/r/federal-administration-2.png'
              )}
              alt="federal-administration"
            />
          </div>
        </div>
        {/*endregion image - visible on small screen*/}

        {/*region heading*/}
        <h1
          className="text-center !text-10 !mt-0 !mb-6 md:!mb-8 !text-heading"
        >
          {t(
            'FederalAdministration.title',
            "Federal Administration's Identity & Access Management"
          )}
        </h1>
        {/*endregion heading*/}

        {/*region content*/}
        <div className="grid gap-3 xl:gap-6 grid-cols-1 md:grid-cols-2 text-center md:text-left">
          {/*region article*/}
          <article
            className="text-primary-text !space-y-5 !text-lg !font-normal my-auto"
          >
            <p>
              {t(
                'FederalAdministration.contentLine1',
                "Put simply, eIAM is the Confederation's central login infrastructure; the aim is to avoid having to create a separate login procedure for each application."
              )}
            </p>
            <p>
              {t(
                'FederalAdministration.contentLine2',
                'This centralisation saves money and allows all applications to be used with the same login data.'
              )}
            </p>
            <p>
              {t(
                'FederalAdministration.contentLine3',
                "It doesn't matter how the target application is used, or where; eIAM can run applications all over the world."
              )}
            </p>
          </article>
          {/*endregion article*/}

          {/*region image - visible on large screen*/}
          <div className="hidden md:block">
            <img
              src={t(
                'FederalAdministration.img1',
                '/r/federal-administration.png'
              )}
              alt="federal-administration"
            />
          </div>
          {/*endregion image - visible on large screen*/}
        </div>
        {/*endregion content*/}
      </section>
    </>
  );
});

FederalAdministration.displayName = 'FederalAdministration';
export default FederalAdministration;
