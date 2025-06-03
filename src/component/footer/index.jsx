/**
 * Footer
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Footer = () => {
  return (
    <>
      <footer
        id="footer"
        className="bg-gray-pickled-bluewood px-6 py-2 text-white text-3.2 flex justify-start items-center gap-2"
      >
        <a name="contact"></a>Name — Adresse — Telefon —
        <a title="mailto:me@provider.ext" href="mailto:me@provider.ext">
          me@provider.ex
          <nobr>t</nobr>
        </a>{' '}
        —<a href="index.php?c=sitemap&amp;l=en">Sitemap</a> —
        <a href="index.php?c=intranet&amp;l=en">Intranet</a>
      </footer>
    </>
  );
};

export default Footer;
