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
        activeItem: a.classList.contains('activeItem'), // Class from U5CMS
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
  if (!content) {
    return null;
  }
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
 * Extract all anchors within an element as {text, href} pairs.
 *
 * @param {Element} ele
 * @returns {Array<{text: string, href: string}>}
 */
export const parseAnchors = (ele) => {
  if (!ele) return [];
  return Array.from(ele.querySelectorAll('a')).map((a) => ({
    text: a.textContent?.trim() || '',
    href: a.getAttribute('href') || '',
  }));
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

/**
 * Block-level element tag names used to identify group boundaries
 * when wrapping orphan text nodes.
 */
const BLOCK_ELEMENTS = new Set([
  'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'DD', 'DETAILS', 'DIALOG',
  'DIV', 'DL', 'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'FORM',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HGROUP', 'HR', 'LI',
  'MAIN', 'NAV', 'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'UL',
]);

/**
 * Wraps orphan text nodes (and adjacent inline elements) in <p> tags.
 *
 * Orphan text is text content sitting directly between block-level elements
 * without any wrapping tag. This function groups consecutive inline nodes
 * and wraps each non-empty group in a <p> element.
 *
 * @param {string} html - The HTML string to process
 * @returns {string|null} - The processed HTML string, or null if input is falsy
 */
export const wrapOrphanTextNodes = (html) => {
  if (!html) return null;

  const container = document.createElement('div');
  container.innerHTML = html;

  const childNodes = Array.from(container.childNodes);
  let inlineGroup = [];

  const flushGroup = () => {
    if (!inlineGroup.length) return;

    // Check if the group has any non-whitespace content
    const hasContent = inlineGroup.some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      // For elements, check if it's not just a <br>
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BR') return false;
        return true;
      }
      return false;
    });

    if (hasContent) {
      const p = document.createElement('p');
      const firstNode = inlineGroup[0];
      container.insertBefore(p, firstNode);
      for (const node of inlineGroup) {
        p.appendChild(node);
      }
    }

    inlineGroup = [];
  };

  for (const node of childNodes) {
    // Treat <a> with a class as block-level to avoid breaking accordions 
    // They are <a> with classes like .showblock2inactivetab .showblock2activetab .showblockactivetab etc.
    const isBlock =
      node.nodeType === Node.ELEMENT_NODE &&
      (BLOCK_ELEMENTS.has(node.tagName) ||
        (node.tagName === 'A' && node.className));

    if (isBlock) {
      flushGroup();
      // leave block node in place
    } else {
      inlineGroup.push(node);
    }
  }

  // Flush any remaining inline group
  flushGroup();

  return container.innerHTML;
};

/**
 * Execute scripts within an element
 * @param {HTMLElement} element - The element containing scripts
 */
export const executeScriptsWithinElement = (element) => {
  if (!element) return;

  // Find all script elements in the cloned element
  const scripts = element.querySelectorAll('script');

  // Create and execute each script
  scripts.forEach((script) => {
    const newScript = document.createElement('script');

    // Copy all attributes from the original script
    Array.from(script.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value);
    });

    // If script has inline code
    if (script.textContent) {
      try {
        // Strip "trspfusp" and the truncation loop that follows it.
        // This prevents the truncation script from re-running on already-processed elements.
        // The "trspfusp" function is not idempotent and will cause issues if run multiple times.
        // Its already run once when the page loads, so we don't want to run it again.
        let code = script.textContent;
        // Remove trspfusp function
        const fnStart = code.indexOf('function trspfusp');
        if (fnStart !== -1) {
          let braceCount = 0;
          let fnEnd = code.indexOf('{', fnStart);
          for (let j = fnEnd; j < code.length; j++) {
            if (code[j] === '{') braceCount++;
            if (code[j] === '}') braceCount--;
            if (braceCount === 0) {
              fnEnd = j + 1;
              break;
            }
          }
          code = code.slice(0, fnStart) + code.slice(fnEnd);
        }
        // Remove truncation loop (numofwords ... getElementsByClassName('trnct') for-loop)
        const loopStart = code.indexOf('numofwords');
        if (loopStart !== -1) {
          const forIdx = code.indexOf('for(', loopStart);
          if (forIdx !== -1) {
            let braceCount = 0;
            let loopEnd = code.indexOf('{', forIdx);
            for (let j = loopEnd; j < code.length; j++) {
              if (code[j] === '{') braceCount++;
              if (code[j] === '}') braceCount--;
              if (braceCount === 0) {
                loopEnd = j + 1;
                break;
              }
            }
            code = code.slice(0, loopStart) + code.slice(loopEnd);
          }
        }
        newScript.textContent = code;
      } catch (error) {
        console.error('Error executing script:', error);
      }
    }

    // Replace the original script with the new one to execute it
    script.parentNode.replaceChild(newScript, script);
  });
};
