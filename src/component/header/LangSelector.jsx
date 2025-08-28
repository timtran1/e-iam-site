import React from 'react';
import clsx from 'clsx';
import useClickAway from '../../common/hook/useClickAway.js';
import AppContext from '../../common/context/app/app.context.js';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import useQueryParam from '../../common/hook/useQueryParam.js';
import useCookie from '../../common/hook/useCookie.js';

/**
 * Language selector
 *
 * @returns {JSX.Element}
 * @constructor
 */
const LangSelector = () => {
  // Get context data
  const {languages} = React.useContext(AppContext);

  // Language from cookie storage
  const [cookieLang, setCookieLang] = useCookie('aclan'); // This key comes from U5CMS

  // Get lang from query param
  const queryParamLang = useQueryParam('l'); // Why is it "l"? - this is the rule of U5CMS to get language

  // State for current language
  const [currentLang, setCurrentLang] = React.useState(queryParamLang);

  // Visible state
  const [opened, setOpened] = React.useState(false);

  // Wrapper ref
  const wrapperRef = React.useRef(null);

  /**
   * Handle click away
   */
  useClickAway(wrapperRef, () => {
    setOpened(false);
  });

  /**
   * Syncs the language from the URL query parameter `l` or sets a default language.
   */
  React.useEffect(() => {
    if (queryParamLang) {
      setCurrentLang(queryParamLang);
    } else {
      if (cookieLang) {
        const params = new URLSearchParams(window.location.search);
        params.set('l', cookieLang); // Why is it "l"? - this is the rule of U5CMS to get language
        setCurrentLang(cookieLang);
        window.history.replaceState(
          {},
          '',
          `${window.location.pathname}?${params.toString()}`
        );
      } else {
        const langKey =
          languages?.find((o) => o.key === 'en')?.key || languages?.[0]?.key;
        setCookieLang(langKey, {
          expires: 7,
          secure: true,
          sameSite: 'lax',
          path: '/',
        });
        const params = new URLSearchParams(window.location.search);
        params.set('l', langKey); // Why is it "l"? - this is the rule of U5CMS to get language
        setCurrentLang(langKey);
        window.location.href = `${window.location.pathname}?${params.toString()}`;
      }
    }
  }, [cookieLang, languages, queryParamLang, setCookieLang]);

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative ml-auto mr-4 cursor-pointer inline-flex"
      >
        <ChevronButton
          leftSection={
            <span className="current-lang uppercase rotate">{currentLang}</span>
          }
          rotateChevron="rotate-90"
          onClick={() => setOpened(true)}
        />
        <div
          className={clsx(
            'lang-dropdown w-[77px] border-t border-t-gray-geyser shadow-[0_3px_4px_1px_#828e9a] absolute right-0 mt-2 bg-white overflow-hidden z-50 transform origin-top',
            'transition-all duration-300 top-6',
            opened ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
          )}
          onClick={() => setOpened(false)}
        >
          {languages.map((lang, index) => (
            <a key={index} className="uppercase" href={lang.href}>
              {lang.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default LangSelector;
