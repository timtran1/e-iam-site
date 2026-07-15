import React from 'react';
import {ELEMENT_ID} from '../../../constant/element-id.js';
import {
  executeScriptsWithinElement,
  isEmptyElement,
} from '../../../helper/element-parsing.js';
import useEffectOnce from '../../../hook/useEffectOnce.js';
import {cloneIframe} from '../../../helper/iframe.js';

// Configuration constants for server-side data fetching
const RENDER_CONFIG = {
  DEBOUNCE_DELAY: 330, // Interval between polling attempts (ms)
  POLLING_TIMEOUT: 3000, // Maximum time to poll before giving up (ms)
  // Absolute upper bound for elements in EAGER_REMOVE_ELEMENT_IDS (e.g.
  // #content), whose legacy markup can legitimately arrive after
  // POLLING_TIMEOUT on slow-loading pages. Prevents polling forever if the
  // legacy content never arrives at all (genuine server failure).
  CONTENT_CAPTURE_HARD_CAP_MS: 15000,
};

/**
 * Element ids that must be captured into state and have their raw DOM node
 * removed the instant their content becomes non-empty, instead of waiting
 * for the shared POLLING_TIMEOUT sweep in `removeElements`. Without this,
 * the shared sweep would delete a still-empty raw node (e.g. #content on a
 * slow-loading page) before its legacy content ever arrives, permanently
 * losing anchors inside it. Add more element ids here if they need the same
 * "capture as soon as ready, however long it takes" treatment.
 */
const EAGER_REMOVE_ELEMENT_IDS = new Set([ELEMENT_ID.CONTENT]);

/**
 * Handles form and iframe elements by cloning pre-fill iframes from U5CMS structure
 * and removing original "u5form" elements to prevent conflicts between React and U5CMS.
 *
 * @param {Element} ele
 * @param {Element} clonedEle
 */
const handleFormAndIframeElements = (ele, clonedEle) => {
  // Selectors for iframes, these are extracted from U5CMS structure
  const iframeSelectors = [
    '[name="ifrmonofill"]',
    'iframe[src*="formdataedit2.php"]',
    'iframe#chkv',
    'iframe#weckifr',
    '[name="fvifr"]',
  ];

  // Clone each form pre-fill iframe
  for (const iframeSelector of iframeSelectors) {
    const preFillIframe = document.querySelector(iframeSelector);
    if (preFillIframe) {
      clonedEle.querySelector(iframeSelector)?.remove();
      clonedEle.appendChild(cloneIframe(preFillIframe));
    }
  }

  // Remove 'original u5forms' to avoid conflicts between React and U5CMS
  const formSelector = '[name="u5form"]';
  const u5formState = ele.querySelectorAll(formSelector);
  u5formState.forEach((element) => element.remove());
};

/**
 * Custom hook - to get the server-side variables
 */
const useServerSideVariables = () => {
  // Have elements rendered state
  const [hasElementRendered, setHasElementRendered] = React.useState(
    Object.values(ELEMENT_ID).reduce((acc, id) => {
      acc[id] = false;
      return acc;
    }, {})
  );

  // Server data state
  const [serverSideData, setServerSideData] = React.useState(
    /** @type {ServerSideData} */ {
      languages: undefined,
      navigation: undefined,
      content: undefined,
      footer: undefined,
      right: undefined,
      news: undefined,
    }
  );

  // Has removed server element state
  const [hasRemovedServerElements, setHasRemovedServerElements] =
    React.useState(false);

  // Per-eager-element "raw node removed" flags, keyed by ELEMENT_ID. Content.jsx
  // (and any future eager consumer) needs a plain boolean derived from this.
  const [eagerRemovedState, setEagerRemovedState] = React.useState(() =>
    Array.from(EAGER_REMOVE_ELEMENT_IDS).reduce((acc, id) => {
      acc[id] = false;
      return acc;
    }, {})
  );

  // Ref to store interval ID for cleanup
  const intervalRef = React.useRef(null);

  // Refs to the two safety setTimeout ids so they can be cancelled on
  // unmount, preventing a stray removeElements()/console.warn call from
  // firing after the component using this hook is gone.
  const sweepTimeoutRef = React.useRef(null);
  const hardCapTimeoutRef = React.useRef(null);

  // Timestamp the shared poll started, used to know when POLLING_TIMEOUT has
  // elapsed even when the interval is kept alive past it for eager elements.
  const pollStartRef = React.useRef(null);

  // Guards each eager element's capture-then-remove transition so it fires
  // exactly once, even though the poll may keep running afterwards. Without
  // this, a later tick could re-query the id, find the React-rendered
  // replacement that reused it, and remove that instead of the raw node.
  const eagerCapturedRef = React.useRef({});

  /**
   * Stops the shared polling interval once it's no longer needed: the fixed
   * POLLING_TIMEOUT window has elapsed AND every eager element has been
   * captured. Called both when that fixed window elapses and immediately
   * after a late eager capture, so polling never continues longer than
   * necessary, but is never stopped before non-eager elements had their full
   * normal window.
   */
  const maybeStopPolling = React.useCallback(() => {
    const elapsed = Date.now() - (pollStartRef.current ?? 0);
    const allEagerCaptured = Array.from(EAGER_REMOVE_ELEMENT_IDS).every(
      (id) => eagerCapturedRef.current[id]
    );

    if (elapsed >= RENDER_CONFIG.POLLING_TIMEOUT && allEagerCaptured) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, []);

  /**
   * Captures an eagerly-handled element (see EAGER_REMOVE_ELEMENT_IDS) into
   * state and immediately removes the exact raw DOM node reference that was
   * cloned — never a re-query — so a later poll tick can never delete the
   * React-rendered replacement that later reuses the same id.
   *
   * @param {string} eleId
   * @param {Element} ele - the raw DOM node that was cloned
   * @param {Element} clonedEle - the prepared clone to store in state
   */
  const captureAndRemoveEagerly = React.useCallback(
    (eleId, ele, clonedEle) => {
      if (eagerCapturedRef.current[eleId]) return;
      eagerCapturedRef.current[eleId] = true;

      setServerSideData((prevState) => ({
        ...prevState,
        [eleId]: prevState[eleId] || clonedEle,
      }));

      ele.remove();

      setEagerRemovedState((prevState) => ({
        ...prevState,
        [eleId]: true,
      }));

      // An eager capture may complete after POLLING_TIMEOUT already elapsed
      // (slow-loading content) — stop polling right away in that case
      // instead of waiting for the next interval tick.
      maybeStopPolling();
    },
    [maybeStopPolling]
  );

  /**
   * Get server side variables for elements that are not empty
   */
  const getServerSideVariables = React.useCallback(() => {
    if (!document) return;

    Object.values(ELEMENT_ID).forEach((eleId) => {
      // Eager elements are fully owned by captureAndRemoveEagerly once
      // captured — skip re-querying so a later tick can never pick up the
      // React-rendered replacement that reuses the same id.
      if (
        EAGER_REMOVE_ELEMENT_IDS.has(eleId) &&
        eagerCapturedRef.current[eleId]
      ) {
        return;
      }

      // Get element
      const ele = document.querySelector(`#${eleId}`);

      // Only update state if element is not empty
      if (!isEmptyElement(ele)) {
        // Clone sever site element
        const clonedEle = ele.cloneNode(true);

        // Handle element before assigning to state
        switch (eleId) {
          case ELEMENT_ID.CONTENT:
            handleFormAndIframeElements(ele, clonedEle);
            break;
          default:
            break;
        }

        if (EAGER_REMOVE_ELEMENT_IDS.has(eleId)) {
          captureAndRemoveEagerly(eleId, ele, clonedEle);
          return;
        }

        // Update state
        setServerSideData((prevState) => {
          return {
            ...prevState,
            [eleId]: prevState[eleId] || clonedEle, // Only update if the ele of eleId is not existed
          };
        });
      }
    });
  }, [captureAndRemoveEagerly]);

  /**
   * Remove DOM elements immediately after data collection is complete.
   * Eager elements (EAGER_REMOVE_ELEMENT_IDS) are excluded: they are owned
   * solely by captureAndRemoveEagerly, so this sweep can never delete a
   * still-empty raw eager node prematurely, nor the React-rendered
   * replacement that later reuses the same id.
   */
  const removeElements = React.useCallback(() => {
    Object.values(ELEMENT_ID).forEach((id) => {
      if (EAGER_REMOVE_ELEMENT_IDS.has(id)) return;

      const element = document.getElementById(id);
      if (element) {
        element.remove();
      }
    });
    setHasRemovedServerElements(true);
  }, []);

  /**
   * Start polling for server side data with debounce mechanism
   */
  const startPolling = React.useCallback(() => {
    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    pollStartRef.current = Date.now();

    // Start interval to check for data with debounced delay
    intervalRef.current = setInterval(() => {
      getServerSideVariables();
    }, RENDER_CONFIG.DEBOUNCE_DELAY);

    // Fixed-window sweep — non-eager elements keep their exact original
    // timing. Eager elements are excluded from removeElements and may keep
    // polling past this point (see maybeStopPolling).
    sweepTimeoutRef.current = setTimeout(() => {
      removeElements();
      maybeStopPolling();
    }, RENDER_CONFIG.POLLING_TIMEOUT);

    // Absolute upper bound so polling can't continue forever if an eager
    // element's legacy content never arrives (genuine server failure).
    hardCapTimeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const uncapturedIds = Array.from(EAGER_REMOVE_ELEMENT_IDS).filter(
        (id) => !eagerCapturedRef.current[id]
      );
      uncapturedIds.forEach((id) => {
        console.warn(
          `[useServerSideVariables] content capture hard cap reached (${RENDER_CONFIG.CONTENT_CAPTURE_HARD_CAP_MS}ms) — #${id} never populated`
        );
      });
    }, RENDER_CONFIG.CONTENT_CAPTURE_HARD_CAP_MS);
  }, [getServerSideVariables, removeElements, maybeStopPolling]);

  /**
   * Use effect once
   * Start polling for server-side data
   */
  useEffectOnce(() => {
    startPolling();
  });

  /**
   * Cleanup effect
   */
  React.useEffect(() => {
    return () => {
      // Cleanup intervals and pending safety timeouts on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (sweepTimeoutRef.current) {
        clearTimeout(sweepTimeoutRef.current);
      }
      if (hardCapTimeoutRef.current) {
        clearTimeout(hardCapTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Handles post-render operations after the final render of cloned U5CMS content into React web.
   *
   * This effect monitors the DOM to detect when elements cloned from U5CMS have been fully
   * rendered by React. It uses MutationObserver to watch for the appearance of specific
   * element IDs in the DOM tree.
   */
  React.useEffect(() => {
    // Initialize observers
    const observers = [];

    // Handle content rendered function
    const handleContentRendered = (elementId, callback = () => {}) => {
      if (!hasElementRendered[elementId] && serverSideData[elementId]) {
        const observer = new MutationObserver(() => {
          const el = document.getElementById(elementId);
          if (el) {
            // Do something here
            setHasElementRendered((prevState) => ({
              ...prevState,
              [elementId]: true,
            }));

            // Call callback function
            callback();

            // Stop listening
            observer.disconnect();
          }
        });

        // Observe document body
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // Return cleanup function
        observers.push(observer);
      }
    };

    // Handle content rendered
    Object.values([
      ELEMENT_ID.CONTENT,
      // Add enough element IDs here to optimize performance
    ]).forEach((elementId) => {
      handleContentRendered(elementId, () => {
        switch (elementId) {
          case ELEMENT_ID.CONTENT:
            if (document.u5form) {
              // Execute scripts within u5form
              executeScriptsWithinElement(document.u5form);
            }
            break;
          default:
            break;
        }
      });
    });

    // Cleanup observers on unmount
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [hasElementRendered, serverSideData, serverSideData.content]);

  return {
    serverSideData,
    hasRemovedServerElements,
    // Plain boolean specifically for #content — flips true only once the
    // raw eager node has actually been removed (see EAGER_REMOVE_ELEMENT_IDS
    // and captureAndRemoveEagerly above).
    contentRemoved: eagerRemovedState[ELEMENT_ID.CONTENT],
  };
};

export default useServerSideVariables;
