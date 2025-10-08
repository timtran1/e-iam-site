import clsx from 'clsx';

/**
 * Arrow right button
 *
 * @returns {JSX.Element}
 * @constructor
 */

const ArrowRightButton = (props) => {
  return (
    <>
      <button
        {...props}
        className={clsx(
          'w-12 h-12 p-2 border border-primary-main flex justify-center items-center',
          props.className
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          color=""
          className="fill-primary-main"
        >
          <path d="m16.444 19.204 4.066-7.044-4.066-7.044-.65.375 3.633 6.294H4.24v.75h15.187l-3.633 6.294z"></path>
        </svg>
      </button>
    </>
  );
};

export default ArrowRightButton;
