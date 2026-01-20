import {forwardRef} from 'react';
import clsx from 'clsx';
import {useTranslation} from 'react-i18next';

function DownChevron({className, rotateChevron, ...restProps}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="5"
      viewBox="0 0 15 5"
      fill="none"
      className={clsx(
        'lang-caret transition-transform duration-300',
        className,
        rotateChevron
      )}
      {...restProps}
    >
      <path
        d="M0.375 0L7.044 3.85L13.713 0L14.088 0.648999L7.044 4.716L0 0.648999L0.375 0Z"
        fill="black"
      />
    </svg>
  );
}

function RightChevron({className, rotateChevron, ...restProps}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="15"
      viewBox="0 0 5 15"
      fill="none"
      className={clsx(
        'lang-caret transition-transform duration-300',
        className,
        rotateChevron
      )}
      {...restProps}
    >
      <path
        d="M0 13.713L3.85 7.044L0 0.375L0.649 0L4.716 7.044L0.649 14.088L0 13.713Z"
        fill="#1F2937"
      />
    </svg>
  );
}

function LeftChevron({className, rotateChevron, ...restProps}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="15"
      viewBox="0 0 5 15"
      fill="none"
      className={clsx(
        'lang-caret transition-transform duration-300',
        className,
        rotateChevron
      )}
      {...restProps}
    >
      <path
        d="M4.71606 13.713L0.866065 7.044L4.71606 0.375L4.06706 0L6.48499e-05 7.044L4.06706 14.088L4.71606 13.713Z"
        fill="black"
      />
    </svg>
  );
}

/**
 * Chevron icon button
 * @type {React.ForwardRefExoticComponent<
 * React.PropsWithoutRef<{
 * readonly className?: string,
 * readonly onClick?: function(),
 * readonly onKeyDown?: function(),
 * readonly leftSection?: *,
 * readonly rotateChevron?: string
 * }> &
 * React.RefAttributes<unknown>>}
 */
const ChevronButton = forwardRef(
  (
    {
      className = '',
      onClick = () => {},
      onKeyDown = () => {},
      leftSection = <></>,
      chevronType = 'right',
      rotateChevron = 'rotate-0',
      ...restProps
    },
    ref
  ) => {
    // Translation
    const {t} = useTranslation();

    return (
      <>
        <button
          ref={ref}
          type="button"
          className={clsx(
            'flex items-center justify-center text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer',
            className
          )}
          onClick={onClick}
          onKeyDown={onKeyDown}
          aria-label={t('Chevron button')}
          {...restProps}
        >
          {leftSection}

          {chevronType === 'right' && (
            <RightChevron rotateChevron={rotateChevron} />
          )}
          {chevronType === 'down' && (
            <DownChevron rotateChevron={rotateChevron} />
          )}
          {chevronType === 'left' && (
            <LeftChevron rotateChevron={rotateChevron} />
          )}
        </button>
      </>
    );
  }
);

ChevronButton.displayName = 'ChevronButton';
export default ChevronButton;
