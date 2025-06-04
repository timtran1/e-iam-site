import LangSelector from './lang-selector/index.jsx';
import clsx from 'clsx';

/**
 * Header
 *
 * @param {string} className
 * @returns {JSX.Element}
 * @constructor
 */
const Header = ({className}) => {
  return (
    <>
      <header
        id="header"
        className={clsx('border-b border-b-gray-geyser bg-white', className)}
      >
        <div className=" flex items-center sm:border-b border-b-gray-geyser">
          <div className="flex items-center gap-2.5 sm:gap-[16px] padding-4 w-full h-[50px] sm:h-[85px] transition-all duration-500">
            <a
              href="/"
              className="w-[43px] h-[58px] sm:w-[250px] sm:h-[80.6px] overflow-hidden block shrink-0"
            >
              <div
                className="w-[250px] h-[80.6px] bg-cover bg-no-repeat transition-all duration-500    "
                role="img"
                aria-label="eIAM"
              ></div>
            </a>
            <div className="border-l-1 border-l-gray-westar h-10"></div>
            <div className="text-6.5 font-light">eIAM</div>
            <div className="font-light text-lg text-ellipsis hidden lg:block">
              Federal Office of Information Technology, Systems and
              Telecommunication & Federal Chancellery FCh, Digital
              Transformation and ICT Governance DTI
            </div>
          </div>
          <div className="px-4 py-1">
            <LangSelector />

            <button
              id="mobileMenuToggle"
              className="sm:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none relative z-[999]"
            >
              <span className="origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 mb-0 bg-gray-800"></span>
              <span className="origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 bg-gray-800"></span>
              <span className="origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 bg-gray-800"></span>
            </button>
          </div>
        </div>

        <nav id="navLeftSubTop" className="navigation hidden sm:block">
          <ul>
            <li className="inactive">
              <a href="index.php?c=start&amp;l=en">Home</a>
            </li>
            <li className="">
              <a className="" href="index.php?c=trottinett&amp;l=en">
                Children and Scooter
              </a>
              <ul>
                <li className="active">
                  <a
                    className="activeItem"
                    href="index.php?c=formatexamples&amp;l=en"
                  >
                    Format examples
                  </a>
                </li>
                <li>
                  <a href="index.php?c=formular&amp;l=en">Form</a>
                  <ul>
                    <li>
                      <a href="index.php?c=trottinettvideo&amp;l=en">Video</a>
                      <ul>
                        <li>
                          <a href="index.php?c=onemorepage&amp;l=en">Level 4</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="inactive">
              <a href="index.php?c=gotthardtunnel&amp;l=en">Gotthard Traffic</a>
            </li>
          </ul>
        </nav>

        <div
          id="mobileMenu"
          className="navigation-mobile border-t border-t-gray-geyser fixed left-0 right-0 top-[50px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 sm:hidden"
        >
          <div className="relative p-4 border-b border-b-gray-geyser">
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
            <div className="lang-dropdown w-[77px] border-t border-t-gray-geyser shadow-[0_3px_4px_1px_#828e9a] absolute left-4 mt-2 bg-white overflow-hidden z-50 transform origin-top scale-y-0 opacity-0 transition-all duration-300">
              <a href="?l=en">EN</a>
              <a href="?l=de">DE</a>
              <a href="?l=fr">FR</a>
            </div>
          </div>
          <ul>
            <li className="inactive">
              <a href="index.php?c=start&amp;l=en">Home</a>
            </li>
            <li className="">
              <a className="" href="index.php?c=trottinett&amp;l=en">
                Children and Scooter
              </a>
              <ul>
                <li className="active">
                  <a
                    className="activeItem"
                    href="index.php?c=formatexamples&amp;l=en"
                  >
                    Format examples
                  </a>
                </li>
                <li>
                  <a href="index.php?c=formular&amp;l=en">Form</a>
                  <ul>
                    <li>
                      <a href="index.php?c=trottinettvideo&amp;l=en">Video</a>
                      <ul>
                        <li>
                          <a href="index.php?c=onemorepage&amp;l=en">Level 4</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="inactive">
              <a href="index.php?c=gotthardtunnel&amp;l=en">Gotthard Traffic</a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
