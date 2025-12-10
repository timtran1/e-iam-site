/**
 * Parse menu from sever-side data to js variable
 *
 * @param {Element} ul - ul element
 * @returns {Array<AppMenu>}
 */
export const parseMenuEle = (ul) => {
  const items = [];
  if (ul) {
    ul.querySelectorAll(':scope > li').forEach((li) => {
      const a = li.querySelector(':scope > a');
      const submenu = li.querySelector(':scope > ul');
      const href = a?.getAttribute('href') || '';
      const params = new URLSearchParams(href.split('?')?.[1]);
      const c = params.get('c');
      const item = {
        label: a?.textContent?.trim() || '',
        href,
        key: c,
      };

      if (submenu) {
        item.children = submenu ? parseMenuEle(submenu) : [];
      }
      items.push(item);
    });
  }
  return items;
};

/**
 * Parse available languages from sever-side data to js variable
 *
 * @param {Element} ele - element
 * @returns {Array<AppMenu>}
 */
export const parseLangEle = (ele) => {
  const items = [];
  if (ele) {
    ele.querySelectorAll(':scope > a').forEach((a) => {
      const label = a?.textContent?.trim() || '';
      if (label) {
        const href = a?.getAttribute('href') || '';
        const params = new URLSearchParams(href);
        const key = params.get('l');
        const item = {
          label: a?.textContent?.trim() || '',
          href,
          key,
        };
        items.push(item);
      }
    });
  }
  return items;
};

/**
 * Parses navigation HTML content from the backend.
 *
 * - If the content contains lines starting with one or more '#' characters
 *   immediately followed by an <a> tag (e.g., "#<a href='...'>Link</a>"),
 *   those '#' characters are removed.
 * - If no such pattern is detected, the original content is returned unchanged.
 */
export const stripNavigationMarkers = (content) => {
  const lines = content
    .split('<br>')
    .map((line) => line.trim())
    .filter(Boolean);
  const hasPattern = lines.some((line) => /^#+<a\b/i.test(line));
  if (!hasPattern) {
    return content;
  }
  return lines.map((line) => line.replace(/^#+(?=<a\b)/i, '')).join('<br>');
};

/**
 * Whether Element is empty
 *
 * @param {Element} ele
 * @returns {boolean}
 */
export const isEmptyElement = (ele) => {
  return !ele || (!ele.textContent.trim() && !ele.children.length);
};

/**
 * Wraps innerHTML with a div that preserves inline styles from the original element
 *
 * @param {HTMLElement} element - The element to extract innerHTML and styles from
 * @param {Partial<import('react').CSSProperties>} cssProperties - Optional CSS properties to override/add to inline styles
 * @returns {string | null} - HTML string with wrapper div containing inline styles
 */
export const wrapWithInlineStyles = (element, cssProperties = {}) => {
  if (!element) {
    return null;
  }

  // Parse existing inline styles
  const existingStyle = element.getAttribute('style') || '';
  const styleObj = {};

  // Convert existing inline styles to object
  if (existingStyle) {
    existingStyle.split(';').forEach((rule) => {
      const [property, value] = rule.split(':').map((s) => s.trim());
      if (property && value) {
        styleObj[property] = value;
      }
    });
  }

  // Merge with override properties
  const mergedStyles = {...styleObj, ...cssProperties};

  // Convert back to inline style string
  const inlineStyle = Object.entries(mergedStyles)
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ');

  const innerHTML = element.innerHTML;

  return `<div style="${inlineStyle}">${innerHTML}</div>`;
};

/**
 * Wraps innerHTML with a div from the original element
 *
 * @param {HTMLElement} element - The element to extract innerHTML
 * @param {Partial<import('react').CSSProperties>} cssProperties - Optional CSS properties to override/add to inline styles
 * @returns {string | null} - HTML string with wrapper div containing inline styles
 */
export const wrapWithInline = (element, cssProperties = {}) => {
  if (!element) {
    return null;
  }

  // Convert back to inline style string
  const inlineStyle = Object.entries(cssProperties)
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ');

  const innerHTML = element.innerHTML;

  return `<div style="${inlineStyle}">${innerHTML}</div>`;
};

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
export const getFocusableElements = (container) => {
  if (!container) return [];
  const focusableSelectors =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll(focusableSelectors));
};
