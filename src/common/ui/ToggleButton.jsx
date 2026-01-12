import React from 'react';
import clsx from 'clsx';
import {useTranslation} from 'react-i18next';

/**
 * Toggle button
 *
 * @type {React.NamedExoticComponent<{
 *     opened: boolean,
 *     className: string
 *     onClick: () => void
 * }>}
 */
const ToggleButton = React.memo(({opened, className, onClick = () => {}}) => {
  // Translation
  const {t} = useTranslation();

  return (
    <>
      <button
        className={clsx(
          'flex flex-col justify-center items-center w-6 h-6 space-y-1.5 focus:outline-none relative z-[999]',
          className
        )}
        onClick={onClick}
        aria-label={t('Toggle button')}
      >
        <span
          className={clsx(
            'origin-center transition-transform duration-300 ease-in-out h-[1px] w-4 mb-0 bg-gray-800',
            {'rotate-[45deg] translate-y-[1px] origin-center': opened}
          )}
        ></span>
        {!opened && (
          <span
            className={clsx(
              'origin-center transition-transform duration-300 ease-in-out h-[1px] w-4 bg-gray-800',
              {hidden: opened}
            )}
          ></span>
        )}
        <span
          className={clsx(
            'origin-center transition-transform duration-300 ease-in-out h-[1px] w-4 bg-gray-800',
            {'rotate-[-45deg] !m-0': opened}
          )}
        ></span>
      </button>
    </>
  );
});

ToggleButton.displayName = 'ToggleButton';
export default ToggleButton;
