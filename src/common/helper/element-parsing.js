/**
 * Parse menu from sever-side data to js variable
 *
 * @param {Element} ul - ul element
 * @returns {*[]}
 */
export const parseMenu = (ul) => {
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
        item.children = submenu ? parseMenu(submenu) : [];
      }
      items.push(item);
    });
  }
  return items;
};
