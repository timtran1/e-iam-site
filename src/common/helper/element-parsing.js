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

export const parseLangEle = (ele) => {
  const items = [];
  if (ele) {
    ele.querySelectorAll(':scope > a').forEach((a) => {
      const label = a?.textContent?.trim() || '';
      if (label) {
        const href = a?.getAttribute('href') || '';
        const params = new URLSearchParams(href.split('?')?.[1]);
        const l = params.get(';');
        const item = {
          label: a?.textContent?.trim() || '',
          href,
          key: l,
        };
        items.push(item);
      }
    });
  }
  return items;
};
