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
