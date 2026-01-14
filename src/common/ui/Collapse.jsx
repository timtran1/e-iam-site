import React from 'react';
import clsx from 'clsx';

/**
 * Collapse component that provides smooth expand/collapse animation
 * Uses CSS transitions with configurable duration and timing function
 *
 * @param {Object} props - Component props
 * @param {boolean} props.animateOpacity - Whether to animate opacity during transition
 * @param {boolean} props.in - Controls the opened/closed state
 * @param {Function} props.onTransitionEnd - Callback fired when transition completes
 * @param {number} props.transitionDuration - Duration of transition in milliseconds
 * @param {string} props.transitionTimingFunction - CSS timing function for transition
 * @param {string} className
 * @param {React.ReactNode} props.children - Content to be collapsed/expanded
 */
const Collapse = ({
  animateOpacity = true,
  in: isOpen,
  onTransitionEnd,
  transitionDuration = 200,
  transitionTimingFunction = 'ease',
  className = '',
  children,
  ...props
}) => {
  const contentRef = React.useRef(null);
  const [height, setHeight] = React.useState(isOpen ? 'auto' : 0);
  const [opacity, setOpacity] = React.useState(isOpen ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  /**
   * Handle transition end event
   * Calls the onTransitionEnd callback if provided
   */
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (onTransitionEnd) {
      onTransitionEnd();
    }
  };

  /**
   * Effect to handle opening/closing animation
   * Manages height and opacity transitions based on isOpen state
   */
  React.useEffect(() => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const scrollHeight = element.scrollHeight;

    if (isOpen) {
      // Opening animation
      setIsTransitioning(true);
      setHeight(0);
      setOpacity(animateOpacity ? 0 : 1);

      // Use requestAnimationFrame to ensure the initial state is applied
      requestAnimationFrame(() => {
        setHeight(scrollHeight);
        if (animateOpacity) {
          setOpacity(1);
        }
      });
    } else {
      // Closing animation - set current height first then animate to 0
      setIsTransitioning(true);

      // Set explicit height first (get current computed height)
      setHeight(scrollHeight);
      setOpacity(animateOpacity ? 1 : 1);

      // Use double requestAnimationFrame to ensure browser has time to render the explicit height
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0);
          if (animateOpacity) {
            setOpacity(0);
          }
        });
      });
    }
  }, [isOpen, animateOpacity]);

  /**
   * Effect to set height to auto after opening transition completes
   * This allows content to resize naturally after the animation
   */
  React.useEffect(() => {
    if (isOpen && !isTransitioning && height !== 'auto') {
      const timer = setTimeout(() => {
        setHeight('auto');
      }, transitionDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isTransitioning, height, transitionDuration]);

  return (
    <div
      className={clsx('overflow-hidden', className)}
      style={{
        height: height === 'auto' ? 'auto' : `${height}px`,
        opacity: animateOpacity ? opacity : 1,
        transition: `height ${transitionDuration}ms ${transitionTimingFunction}${
          animateOpacity
            ? `, opacity ${transitionDuration}ms ${transitionTimingFunction}`
            : ''
        }`,
      }}
      onTransitionEnd={handleTransitionEnd}
      {...props}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

export default Collapse;
