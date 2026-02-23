import React from 'react';
import clsx from 'clsx';
import useClickAway from '../../common/hook/useClickAway.js';
import AppContext from '../../common/context/app/app.context.js';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import useQueryParam, {toQueryString} from '../../common/hook/useQueryParam.js';
import useCookie from '../../common/hook/useCookie.js';
import {ELEMENT_ID} from '../../common/constant/element-id.js';
import {useTranslation} from 'react-i18next';

/**
 * Language selector
 *
 * @property {string} className
 * @returns {JSX.Element}
 * @constructor
 */
const LangSelector = ({className = ''}) => {
  // Translation
  const {t} = useTranslation();

  // Get context data
  const {languages, hasRemovedServerElements} = React.useContext(AppContext);

  // Language from cookie storage
  const [cookieLang, setCookieLang] = useCookie('aclan'); // This key comes from U5CMS

  // Get lang from query param
  const [currentLang, setCurrentLang] = useQueryParam('l'); // Why is it "l"? - this is the rule of U5CMS to get language

  // Visible state
  const [opened, setOpened] = React.useState(false);

  // Refs
  const wrapperRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const dropdownRef = React.useRef(null);

  // Active index for keyboard navigation
  const [activeIndex, setActiveIndex] = React.useState(-1);

  // Check for reduced motion preference
  const prefersReducedMotion = React.useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  /**
   * Handle click away
   */
  useClickAway(wrapperRef, () => {
    setOpened(false);
    setActiveIndex(-1);
  });

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = React.useCallback(
    (e) => {
      if (!opened) {
        // Open dropdown with Enter or Space or Arrow Down
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          setOpened(true);
          setActiveIndex(0);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setOpened(false);
          setActiveIndex(-1);
          buttonRef.current?.focus();
          break;

        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < languages.length - 1 ? prev + 1 : prev
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;

        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;

        case 'End':
          e.preventDefault();
          setActiveIndex(languages.length - 1);
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (activeIndex >= 0 && languages[activeIndex]) {
            window.location.href = languages[activeIndex].href;
          }
          break;

        default:
          break;
      }
    },
    [opened, activeIndex, languages]
  );

  /**
   * Handle toggle dropdown
   */
  const handleToggle = React.useCallback(() => {
    setOpened((prev) => {
      if (!prev) {
        setActiveIndex(0);
      } else {
        setActiveIndex(-1);
      }
      return !prev;
    });
  }, []);

  /**
   * Scroll active item into view
   */
  React.useEffect(() => {
    if (opened && activeIndex >= 0 && dropdownRef.current) {
      const activeElement = dropdownRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({
          block: 'nearest',
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    }
  }, [activeIndex, opened, prefersReducedMotion]);

  /**
   * Syncs the language from the URL query parameter `l` or sets a default language.
   */
  React.useEffect(() => {
    if (!currentLang) {
      if (cookieLang) {
        const params = new URLSearchParams(window.location.search);
        setCurrentLang(cookieLang);
        const queryStr = toQueryString(params);
        window.history.replaceState(
          {},
          '',
          `${window.location.pathname}${queryStr ? '?' + queryStr : ''}`
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
        setCurrentLang(langKey);
        const queryStr = toQueryString(params);
        window.location.href = `${window.location.pathname}${queryStr ? '?' + queryStr : ''}`;
      }
    }
  }, [cookieLang, currentLang, languages, setCookieLang, setCurrentLang]);

  return (
    <nav
      ref={wrapperRef}
      {...(hasRemovedServerElements ? {id: ELEMENT_ID.LANGUAGES} : {})}
      className={clsx('lang-selector', className)}
      aria-label={t('Language selector')}
    >
      <button
        ref={buttonRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={opened}
        aria-label={t(`Select language, current: ${currentLang}`)}
        className="flex items-center  gap-[4px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
      >
        <span className="current-lang uppercase">{currentLang}</span>
        <ChevronButton chevronType="down" className="w-[24px] h-[24px]" />
      </button>
      <div
        ref={dropdownRef}
        role="listbox"
        aria-label={t('Available languages')}
        className={clsx(
          'lang-dropdown w-20 border-t border-t-gray-geyser shadow-[0_3px_4px_1px_#828e9a] absolute mt-2 bg-white overflow-hidden z-50 transform origin-top',
          prefersReducedMotion ? 'top-6' : 'transition-all duration-300 top-6',
          opened
            ? 'scale-y-100 opacity-100'
            : 'scale-y-0 opacity-0 pointer-events-none'
        )}
        onKeyDown={handleKeyDown}
      >
        {languages.map((lang, index) => (
          <a
            key={index}
            href={lang.href}
            role="option"
            aria-selected={lang.key === currentLang}
            lang={lang.key}
            className={clsx(
              'lang-selector__option uppercase no-underline px-3 py-2 hover:bg-gray-100',
              'focus:outline-none focus:bg-blue-100 focus:ring-2 focus:ring-inset focus:ring-blue-500',
              activeIndex === index && 'bg-gray-100 hover:no-underline',
              lang.key === currentLang && 'font-bold'
            )}
            onClick={() => {
              setOpened(false);
              setActiveIndex(-1);
            }}
            tabIndex={opened ? 0 : -1}
          >
            {lang.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default LangSelector;
