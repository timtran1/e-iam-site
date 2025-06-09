import React from 'react';
import {off, on} from './misc/util';

const defaultEvents = ['mousedown', 'touchstart'];

/**
 * Hook that triggers a callback when a click is detected outside the given element.
 *
 * @template E - The event type (default is Event)
 * @param {React.RefObject<HTMLElement>} ref - Ref of the element to detect outside clicks from
 * @param {(event: E) => void} onClickAway - Callback to execute when click outside is detected
 * @param {string[]} [events=defaultEvents] - Events to listen for (e.g., 'mousedown', 'touchstart')
 */
const useClickAway = (ref, onClickAway, events = defaultEvents) => {
  // Saved callback ref
  const savedCallback = React.useRef(onClickAway);

  /**
   * Use effect - update saved callback
   */
  React.useEffect(() => {
    savedCallback.current = onClickAway;
  }, [onClickAway]);

  /**
   * User effect - handle event
   */
  React.useEffect(() => {
    /**
     * @param {Event} event
     */
    const handler = (event) => {
      const el = ref.current;
      if (el && !el.contains(event.target)) {
        savedCallback.current(event);
      }
    };

    for (const eventName of events) {
      on(document, eventName, handler);
    }

    return () => {
      for (const eventName of events) {
        off(document, eventName, handler);
      }
    };
  }, [events, ref]);
};

export default useClickAway;
