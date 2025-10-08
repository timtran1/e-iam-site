import clsx from 'clsx';

/**
 * Simple loading spinner component
 *
 * @param {Object} props
 * @param {'md' | 'sm'} [props.size='md'] - Size of the spinner: 'sm', 'md', 'lg'
 * @param {string} [props.className] - Additional CSS classes
 */
const Spinner = ({size = 'md', className}) => {
  // Define sizes
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={clsx(
        'inline-block rounded-full border-solid border-gray-300 border-t-gray-600 animate-spin',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
