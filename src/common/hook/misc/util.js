/**
 * A no-operation function.
 */
export const noop = () => {};

/**
 * Adds an event listener to the specified object.
 *
 * @param {Window|Document|HTMLElement|EventTarget|null} obj - The object to attach the event to.
 * @param {...any} args - Arguments passed to addEventListener.
 */
export function on(obj, ...args) {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...args);
  }
}

/**
 * Removes an event listener from the specified object.
 *
 * @param {Window|Document|HTMLElement|EventTarget|null} obj - The object to remove the event from.
 * @param {...any} args - Arguments passed to removeEventListener.
 */
export function off(obj, ...args) {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...args);
  }
}

/**
 * Checks if the current environment is a browser.
 *
 * @type {boolean}
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Checks if the navigator object is available.
 *
 * @type {boolean}
 */
export const isNavigator = typeof navigator !== 'undefined';
