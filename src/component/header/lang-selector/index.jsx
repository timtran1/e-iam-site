import {LANGUAGES} from '../../../common/constant/language.js';

/**
 * Language selector
 *
 * @returns {JSX.Element}
 * @constructor
 */
const LangSelector = () => {
  return (
    <>
      <div className="relative ml-auto mr-4 cursor-pointer hidden sm:block">
        <button className="lang-switcher flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer">
          <span className="current-lang">EN</span>
          <svg
            className="lang-caret w-4 h-4 transform transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        <div className="lang-dropdown w-[77px] border-t border-t-gray-geyser shadow-[0_3px_4px_1px_#828e9a] absolute right-0 mt-2 bg-white overflow-hidden z-50 transform origin-top scale-y-0 opacity-0 transition-all duration-300">
          {Object.values(LANGUAGES).map((lang, index) => (
            <a key={index} href={lang.href}>
              {lang.sortLabel}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default LangSelector;
