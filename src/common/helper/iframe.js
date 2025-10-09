/**
 * Clone iframe with included content
 *
 * @param targetIframe
 * @returns {Node | ActiveX.IXMLDOMNode}
 */
export const cloneIframe = (targetIframe) => {
  const newIframe = targetIframe.cloneNode(false); // shallow clone, don't copy empty DOM
  try {
    // Case 1: Same-origin - copy content
    const doc =
      targetIframe.contentDocument || targetIframe.contentWindow.document;
    if (doc) {
      const html = doc.documentElement.outerHTML;
      newIframe.removeAttribute('src'); // avoid conflicts
      newIframe.srcdoc = html; // copy actual content
    }
  } catch (err) {
    // Case 2: Cross-origin or no access - fallback to src
    const src = targetIframe.getAttribute('src') || targetIframe.src;
    if (src) newIframe.src = src;
  }

  // Copy key visual/style attributes just in case
  newIframe.width = targetIframe.width;
  newIframe.height = targetIframe.height;
  newIframe.style.cssText = targetIframe.style.cssText;
  return newIframe;
};
