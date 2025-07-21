import React from 'react';
import ChevronButton from '../../common/ui/ChevronButton.jsx';
import clsx from 'clsx';
// import useClickAway from '../../common/hook/useClickAway.js';
import useQueryParam from '../../common/hook/useQueryParam.js';
import AppContext from '../../common/context/app/app.context.js';
import { useClickOutside } from '@mantine/hooks';

const isDevMode = import.meta.env.DEV;
const mockMenu = [
  {
      "label": "Start page",
      "href": "index.php?c=eiam&l=en",
      "key": "eiam"
  },
  {
      "label": "List of IdPs",
      "href": "index.php?c=f!idps!pub&l=en",
      "key": "f!idps!pub"
  },
  {
      "label": "CH-LOGIN",
      "href": "index.php?c=f!chlfaq!pub&l=en",
      "key": "f!chlfaq!pub",
      "children": [
          {
              "label": "FAQ",
              "href": "index.php?c=f!chlfaq!pub&l=en",
              "key": "f!chlfaq!pub"
          },
          {
              "label": "Help",
              "href": "index.php?c=f!chhelp!pub&l=en",
              "key": "f!chhelp!pub"
          }
      ]
  },
  {
      "label": "CH-LOGIN to AGOV",
      "href": "index.php?c=agov&l=en",
      "key": "agov"
  },
  {
      "label": "FED-LOGIN",
      "href": "index.php?c=f!fedfaq!pub&l=en",
      "key": "f!fedfaq!pub",
      "children": [
          {
              "label": "FAQ",
              "href": "index.php?c=f!fedfaq!pub&l=en",
              "key": "f!fedfaq!pub"
          },
          {
              "label": "Help",
              "href": "index.php?c=f!fedhelp!pub&l=en",
              "key": "f!fedhelp!pub"
          }
      ]
  },
  {
      "label": "Availability & Security",
      "href": "index.php?c=vk3!&l=en",
      "key": "vk3!"
  },
  {
      "label": "eIAM know-how",
      "href": "index.php?c=f!eiamfunc!pub&l=en",
      "key": "f!eiamfunc!pub",
      "children": [
          {
              "label": "Description of services",
              "href": "index.php?c=f!eiamfunc!pub&l=en",
              "key": "f!eiamfunc!pub"
          },
          {
              "label": "Procurement factsheet",
              "href": "index.php?c=procurement&l=en",
              "key": "procurement"
          },
          {
              "label": "Mobile Apps & eIAM",
              "href": "index.php?c=eiammobile&l=en",
              "key": "eiammobile"
          },
          {
              "label": "Video identification",
              "href": "index.php?c=!f!vipsint!pub&l=en",
              "key": "!f!vipsint!pub"
          },
          {
              "label": "CISARDA (new assignment of rights)",
              "href": "index.php?c=cisarda&l=en",
              "key": "cisarda"
          },
          {
              "label": "INS G2G Cantons→Federation",
              "href": "index.php?c=idvg2g&l=en",
              "key": "idvg2g"
          },
          {
              "label": "Usage obligation",
              "href": "index.php?c=bezugspflicht&l=en",
              "key": "bezugspflicht"
          },
          {
              "label": "Instructional video",
              "href": "index.php?c=eiamvideo&l=en",
              "key": "eiamvideo"
          },
          {
              "label": "Glossary",
              "href": "index.php?c=f!eiamglossary!pub&l=en",
              "key": "f!eiamglossary!pub"
          },
          {
              "label": "Integration How-To",
              "href": "index.php?c=eiamintablauf&l=en",
              "key": "eiamintablauf"
          },
          {
              "label": "Visual login verification (federalproof.ch)",
              "href": "index.php?c=federalproof&l=en",
              "key": "federalproof"
          },
          {
              "label": "Decommissioning of VASCO tokens",
              "href": "index.php?c=postvasco&l=en",
              "key": "postvasco"
          },
          {
              "label": "Go Smartcardless?",
              "href": "index.php?c=gosmartcardless&l=en",
              "key": "gosmartcardless"
          },
          {
              "label": "eIAM for Clouds (AWS, Azure, ...)",
              "href": "index.php?c=eiamforcloud&l=en",
              "key": "eiamforcloud"
          },
          {
              "label": "FOITT technical infos",
              "href": "index.php?c=intdocseiamswiss&l=en",
              "key": "intdocseiamswiss"
          },
          {
              "label": "FOITT eIAM Release Plan",
              "href": "index.php?c=bitreleaseplan&l=en",
              "key": "bitreleaseplan"
          },
          {
              "label": "FOITT eIAM Release Notes",
              "href": "index.php?c=releasenotes&l=en",
              "key": "releasenotes"
          }
      ]
  },
  {
      "label": "Legal & Organization",
      "href": "index.php?c=legal&l=en",
      "key": "legal"
  },
  {
      "label": "Extranet",
      "href": "index.php?c=!bkdti!nachrichten&l=en",
      "key": "!bkdti!nachrichten",
      "children": [
          {
              "label": "FCh DTI: sounding board",
              "href": "index.php?c=!bkdti!nachrichten&l=en",
              "key": "!bkdti!nachrichten",
              "children": [
                  {
                      "label": "News",
                      "href": "index.php?c=!bkdti!nachrichten&l=en",
                      "key": "!bkdti!nachrichten"
                  },
                  {
                      "label": "monthly operational reporting",
                      "href": "index.php?c=!betriebsreporting&l=en",
                      "key": "!betriebsreporting"
                  },
                  {
                      "label": "Discussion forum",
                      "href": "index.php?c=!forumlist&l=en",
                      "key": "!forumlist"
                  },
                  {
                      "label": "Requirements management",
                      "href": "index.php?c=!bkdti!anfmgmt&l=en",
                      "key": "!bkdti!anfmgmt"
                  },
                  {
                      "label": "P035-Status",
                      "href": "index.php?c=!bkdti!f!p035!pub&l=en",
                      "key": "!bkdti!f!p035!pub"
                  },
                  {
                      "label": "Roadmap",
                      "href": "index.php?c=!bkdti!roadmap&l=en",
                      "key": "!bkdti!roadmap"
                  },
                  {
                      "label": "Usage obligation",
                      "href": "index.php?c=!bkdti!bezugspflicht&l=en",
                      "key": "!bkdti!bezugspflicht"
                  }
              ]
          },
          {
              "label": "FOITT Tariff calculator",
              "href": "index.php?c=!eiam!calc!2026&l=en",
              "key": "!eiam!calc!2026",
              "children": [
                  {
                      "label": "",
                      "href": "index.php?c=!eiam!calc!2026&l=en",
                      "key": "!eiam!calc!2026"
                  }
              ]
          },
          {
              "label": "My eIAM dossier: procurement, integration",
              "href": "index.php?c=eiam!dossier&l=en",
              "key": "eiam!dossier"
          },
          {
              "label": "Spezialthemen",
              "href": "index.php?c=!spezialthemen&l=en",
              "key": "!spezialthemen",
              "children": [
                  {
                      "label": "E-ID Infoanlass & PoC",
                      "href": "index.php?c=!eidanlass&l=en",
                      "key": "!eidanlass"
                  },
                  {
                      "label": "IdP-Konzept",
                      "href": "index.php?c=!eiamidpkonzept&l=en",
                      "key": "!eiamidpkonzept"
                  },
                  {
                      "label": "Qualität von Authentisierungen",
                      "href": "index.php?c=!qoa&l=en",
                      "key": "!qoa"
                  },
                  {
                      "label": "CH-LOGIN Mobile ID Videoidentifikation",
                      "href": "index.php?c=!chloginstrong&l=en",
                      "key": "!chloginstrong"
                  },
                  {
                      "label": "Enterprise-Kontext nHEC+",
                      "href": "index.php?c=nhecplus&l=en",
                      "key": "nhecplus"
                  },
                  {
                      "label": "Microsoft-Logins",
                      "href": "index.php?c=!microsoftlogins&l=en",
                      "key": "!microsoftlogins"
                  },
                  {
                      "label": "Migrationswizard",
                      "href": "index.php?c=migrationswizard&l=en",
                      "key": "migrationswizard"
                  },
                  {
                      "label": "Authentication Bridges",
                      "href": "index.php?c=authenticationbridge&l=en",
                      "key": "authenticationbridge"
                  },
                  {
                      "label": "Agate",
                      "href": "index.php?c=f!agate!inc&l=en",
                      "key": "f!agate!inc"
                  },
                  {
                      "label": "Datenkonsistenz",
                      "href": "index.php?c=!consistencychecker&l=en",
                      "key": "!consistencychecker"
                  },
                  {
                      "label": "IAM-Prozessmodelle",
                      "href": "index.php?c=!iamprozessmodelle&l=en",
                      "key": "!iamprozessmodelle"
                  }
              ]
          },
          {
              "label": "Contact",
              "href": "index.php?c=!kontakt&l=en",
              "key": "!kontakt"
          }
      ]
  }
]

/**
 * @type {React.NamedExoticComponent<{
 *        readonly listMenu?: Array<AppMenu>
 *     }>}
 */
const ListMenu = React.memo(({listMenu}) => {
  // Track open state for each menu item individually
  const [openedItems, setOpenedItems] = React.useState({});

  // Get current page
  const currentPage = useQueryParam('c');
  
  // Toggle open state for a specific item
  const toggleItem = (key) => {
    setOpenedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {listMenu.map((item, index) => (
        <li
          key={index}
          className={clsx('border-b !cursor-pointer', 'last:border-none')}
        >
          <div
            className={clsx(
              'transition border-s-danger-cinnabar hover:border-s-4',
              'hover:shadow-soft hover:bg-gray-black-squeeze',
              currentPage === item.key ? 'border-s-4' : ''
            )}
          >
            <div className="!ps-4 !py-2">
              <div className="flex items-center justify-between gap-2">
                <a
                  href={item.href}
                  className="flex-1 !p-0 !border-none !text-gray-mirage"
                  onClick={()=>{
                    console.log(item.href)
                  }}
                >
                  {item.label}
                </a>

                {item.children && item.children.length > 0 && (
                  <ChevronButton
                    className={clsx(
                      'px-2 transition',
                      openedItems[item.key] ? 'rotate-0' : 'rotate-90'
                    )}
                    onClick={() => toggleItem(item.key)}
                  />
                )}
              </div>
            </div>
          </div>

          {item.children && item.children.length > 0 && (
            <ul
              className={clsx(
                'sub-open overflow-hidden !static !ps-3 transition',
                openedItems[item.key] ? 'visible h-auto' : 'invisible h-0'
              )}
            >
              <ListMenu listMenu={item.children} />
            </ul>
          )}
        </li>
      ))}
    </>
  );
});
ListMenu.displayName = 'ListMenu';

/**
 * Dropdown menu for desktop
 *
 * @returns {JSX.Element}
 * @constructor
 */
const DropdownMenuDesktop = () => {
  // Get context data
  const {menu} = React.useContext(AppContext);
  const menus = isDevMode ? mockMenu : menu;

  // Get current page
  const currentPage = useQueryParam('c');

  // Track open state for each menu item individually
  const [openedItems, setOpenedItems] = React.useState({});
  
  // Toggle open state for a specific item
  const toggleItem = (key) => {
    setOpenedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Main dropdown ref
  const wrapperRef = React.useRef(null);

  /**
   * Handle click away
   */
  // useClickAway(wrapperRef, () => {
  //   setOpenedItems({});
  // });

  return (
    <>
      <nav className="navigation">
        <ul>
          {menus.map((menuItem, i) => (
            <li
              key={i}
              className={clsx(
                'flex gap-1',
                menuItem.key === currentPage ? 'active' : 'inactive'
              )}
            >
              <a href={menuItem.href}>{menuItem.label}</a>{' '}
              <>
                {menuItem.children?.length > 0 && (
                  <>
                    <ChevronButton
                      className={clsx(
                        'transition',
                        openedItems[menuItem.key] ? 'rotate-0' : 'rotate-90'
                      )}
                      onClick={() => toggleItem(menuItem.key)}
                    />
                    <ul
                      ref={wrapperRef}
                      className={clsx(
                        'transition',
                        openedItems[menuItem.key] ? 'open' : 'inactive'
                      )}
                    >
                      <button
                        className="nav-dropdown-close"
                        onClick={() => toggleItem(menuItem.key)}
                      >
                        Close ×
                      </button>
                      <ListMenu listMenu={menuItem.children} />
                    </ul>
                  </>
                )}
              </>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default DropdownMenuDesktop;
