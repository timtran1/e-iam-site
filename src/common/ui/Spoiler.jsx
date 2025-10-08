import {useRef, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Hide long sections of content under a spoiler
 * @param {number} maxHeight
 * @param {string} showMoreLabel
 * @param {string} hideLabel
 * @param children
 * @constructor
 */
const Spoiler = ({maxHeight = 160, children, showMoreLabel, hideLabel}) => {
  const {t} = useTranslation();
  const contentRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure content height when mounted
  useEffect(() => {
    const checkHeight = () => {
      if (contentRef.current) {
        const fullHeight = contentRef.current.scrollHeight;
        setContentHeight(fullHeight);
        setIsOverflowing(fullHeight > maxHeight);
      }
    };

    checkHeight();

    // Recalculate on window resize
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, [maxHeight, children]);

  return (
    <div className="w-full">
      <div
        ref={contentRef}
        className={`overflow-hidden transition-all duration-500 ease-in-out`}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : `${maxHeight}px`,
        }}
      >
        {children}
      </div>

      {isOverflowing && (
        <div className="mt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-sm font-medium hover:underline focus:outline-none"
          >
            {isExpanded
              ? hideLabel || t('hide')
              : showMoreLabel || t('showMore')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Spoiler;
