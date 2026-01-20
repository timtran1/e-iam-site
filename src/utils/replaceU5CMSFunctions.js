export default function replaceU5CMSFunctions() {
  // replace showblock2script func
  window.showblock2script = (el) => {
    console.log('showblock2script called', el);

    // Toggle self .expand class (optional styling)
    el.classList.toggle('expand');

    const content = el.nextElementSibling;
    if (!content) return;

    const isExpanded = content.classList.contains('expand');

    if (isExpanded) {
      // Collapse
      content.style.height = `${content.scrollHeight + 16}px`; // set current height plus 8px for padding
      requestAnimationFrame(() => {
        content.style.height = '0px';
      });
      content.classList.remove('expand');
    } else {
      // Expand
      content.style.height = `${content.scrollHeight + 16}px`;
      content.classList.add('expand');
      content.addEventListener(
        'transitionend',
        () => {
          content.style.height = 'auto';
        },
        {once: true}
      );
    }
  };

  window.showblockscript = (el) => {
    console.log('showblockscript called', el);
    // Toggle self .expand class (optional styling)
    el.classList.toggle('expand');

    const content = el.nextElementSibling;
    if (!content) return;

    const isExpanded = content.classList.contains('expand');

    if (isExpanded) {
      // Collapse
      content.style.height = `${content.scrollHeight + 16 + 30}px`; // set current height plus 8px for padding
      requestAnimationFrame(() => {
        content.style.height = '0px';
      });
      content.classList.remove('expand');
    } else {
      // Expand
      content.style.height = `${content.scrollHeight + 16 + 30}px`;
      content.classList.add('expand');
      content.addEventListener(
        'transitionend',
        () => {
          content.style.height = 'auto';
        },
        {once: true}
      );
    }
  };

  return true;
}
