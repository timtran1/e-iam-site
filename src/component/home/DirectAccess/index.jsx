import React from 'react';
// import {useTranslation} from 'react-i18next';
// import {DIRECT_ACCESS} from './constant.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
// import {TranslationNamespace} from '../../../constants/translation.js';
import AppContext from '../../../common/context/app/app.context.js';

const isDevMode = import.meta.env.DEV;

/**
 * Direct access section
 *
 * @type {React.NamedExoticComponent<object>}
 */
const DirectAccess = React.memo(() => {
  // Translation
  // const {t} = useTranslation(TranslationNamespace.HomePage);

  // Get right content from app context
  const { rightContent } = React.useContext(AppContext);
  const mockRight = `<p></p><h2>Websites</h2><script>s="https://www.bit.admin.ch"</script><script src="js/url.js"></script><a href="https://www.bit.admin.ch" title="https://www.bit.admin.ch" target="_blank">www.bit.admin.ch</a><br><script>s="https://www.bk.admin.ch"</script><script src="js/url.js"></script><a href="https://www.bk.admin.ch" title="https://www.bk.admin.ch" target="_blank">www.bk.admin.ch</a><p></p><p></p><h2>Direct access</h2><p class="clearing"></p><span class="bold">Public:</span><p></p><p></p><h3> <a href="index.php?c=start&amp;l=en">New technical documentation</a> </h3>The FOITT has published new technical documentation on eIAM.<p></p><p></p><h3> <a href="index.php?c=start&amp;l=en">eIAM-Release Plan⇨</a> </h3>The release notes describe changes to the eIAM service and new functionalities.<p></p><p><span class="bold">Internal:</span></p><h3> <a href="index.php?c=start&amp;l=en">Discussion forum⇨</a> </h3>eIAM, questions and discussions, moderated by the [$$$:tx!bkdtiname!en]<p></p><p></p><h3> <a href="index.php?c=start&amp;l=en">Sounding board⇨</a> </h3>Description of forthcoming releases, P035 status and roadmap<p></p><p></p><h3> <a href="index.php?c=start&amp;l=en">eIAM dossier⇨</a> </h3>New: Procuring an application or connecting an application to eIAM? Please open your eIAM dossier online<p></p><p></p><h3> <a href="index.php?c=start&amp;l=en">eIAM tariff⇨</a> </h3>Calculate your recurring costs<p></p><p>[eiamsquid]</p>`

  // Parse mockRight HTML content into structured data
  const parseContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const sections = [];

    // Get all h2 elements (main section headers)
    const h2Elements = doc.querySelectorAll('h2');

    h2Elements.forEach(h2 => {
      const sectionTitle = h2.textContent.trim();
      const section = {
        title: sectionTitle,
        items: [],
        subtitleGroups: []
      };

      // Find content after this h2 until the next h2 or end
      let currentElement = h2.nextSibling;
      let currentSubtitle = null;
      let currentGroup = { items: [] };

      while (currentElement && currentElement.tagName !== 'H2') {

        // Check for subtitles (span with class "bold") - both direct and nested
        if (currentElement.tagName === 'SPAN' && currentElement.classList?.contains('bold')) {
          currentSubtitle = currentElement.textContent.trim().replace(':', '');

          // If we have a previous group with items, save it
          if (currentGroup.items.length > 0) {
            section.subtitleGroups.push(currentGroup);
          }

          // Start a new group with this subtitle
          currentGroup = {
            subtitle: currentSubtitle,
            items: []
          };
        }
        // Also check for span.bold nested inside other elements (like p tags)
        else if (currentElement.querySelector && currentElement.querySelector('span.bold')) {
          const boldSpan = currentElement.querySelector('span.bold');
          currentSubtitle = boldSpan.textContent.trim().replace(':', '');

          // If we have a previous group with items, save it
          if (currentGroup.items.length > 0) {
            section.subtitleGroups.push(currentGroup);
          }

          // Start a new group with this subtitle
          currentGroup = {
            subtitle: currentSubtitle,
            items: []
          };
        }

        // Check for h3 elements (item titles with links)
        if (currentElement.tagName === 'H3') {
          const link = currentElement.querySelector('a');
          if (link) {
            const title = link.textContent.trim();
            const href = link.getAttribute('href');

            // Find the description (next text content after h3)
            let descElement = currentElement.nextSibling;
            let description = '';

            while (descElement && descElement.tagName !== 'H3' && descElement.tagName !== 'H2' && descElement.tagName !== 'SPAN') {
              if (descElement.nodeType === Node.TEXT_NODE) {
                const text = descElement.textContent.trim();
                if (text && !text.includes('[eiamsquid]')) {
                  description += text;
                }
              } else if (descElement.textContent) {
                const text = descElement.textContent.trim();
                if (text && !text.includes('[eiamsquid]') && descElement.tagName !== 'SCRIPT') {
                  description += text;
                }
              }
              descElement = descElement.nextSibling;
            }

            // Add to current group (or main section if no subtitle group)
            if (currentGroup.subtitle) {
              currentGroup.items.push({
                title,
                href,
                description: description.trim()
              });
            } else {
              section.items.push({
                title,
                href,
                description: description.trim()
              });
            }
          }
        }

        // Check for direct links (a elements not inside h3)
        if (currentElement.tagName === 'A' && !currentElement.closest('h3')) {
          const title = currentElement.textContent.trim();
          const href = currentElement.getAttribute('href');

          if (title && href) {
            // Add to current group (or main section if no subtitle group)
            if (currentGroup.subtitle) {
              currentGroup.items.push({
                title,
                href,
                description: currentElement.getAttribute('title') || ''
              });
            } else {
              section.items.push({
                title,
                href,
                description: currentElement.getAttribute('title') || ''
              });
            }
          }
        }

        currentElement = currentElement.nextSibling;
      }

      // Add the last group if it has items
      if (currentGroup.items.length > 0) {
        section.subtitleGroups.push(currentGroup);
      }

      // Add section if it has items (either in main items or subtitle groups)
      if (section.items.length > 0 || section.subtitleGroups.length > 0) {
        sections.push(section);
      }
    });

    return sections;
  };

  const contentSections = parseContent(isDevMode ? mockRight : rightContent);

  return (
    <>
      <section className="bg-gray-aqua-haze py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/*region heading*/}
          {/* <h1
            className="font-bold !text-6.5 md:!text-10 text-center text-heading"
          >
            {t('DirectAccess.title', 'Direct Access')}
          </h1> */}
          {/*endregion heading*/}

          {/*region contents*/}
          {/* <div>
            {Object.entries(DIRECT_ACCESS).map(
              ([directAccessGroup, directAccessItems]) => (
                <div
                  key={directAccessGroup}
                  className="border-b border-gray pb-5 md:pb-6 last:border-none"
                >
                  <h2
                    className="text-heading !my-5 !text-3.75 font-bold"
                  >
                    {t(directAccessGroup)}
                  </h2>
                  <div className="grid gap-x-12 md:gap-x-24 gap-y-3 grid-cols-1 md:grid-cols-2">
                    {directAccessItems.map((item, index) => (
                      <div key={`${directAccessGroup}-${index}`}>
                        <a className="cursor-pointer">
                          <h3
                            className="text-heading !text-xl font-bold !my-2.5 flex justify-between items-center gap-6 group"
                          >
                            <span>
                              {t(item.titleI18nKey, item.title)}
                            </span>
                            <span
                              className="transition -translate-x-1/3 group-hover:translate-x-0"
                            >
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="text-primary-main text-sm"
                              />
                            </span>
                          </h3>
                        </a>
                        <p
                          className="text-gray-ebony-clay font-normal"
                        >
                          {t(item.descriptionI18nKey, item.description)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div> */}
          {/*endregion contents*/}

          {/*region right content*/}
          <div className="pt-5 md:pt-6 mt-8">
            <div>
              {contentSections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="border-b border-gray pb-5 md:pb-6 last:border-none"
                >
                  <h2 className="text-heading !my-5 !text-3.75 font-bold">
                    {section.title}
                  </h2>

                  {/* Render main items (without subtitles) */}
                  {section.items.length > 0 && (
                    <div className="grid gap-x-12 md:gap-x-24 gap-y-3 grid-cols-1 md:grid-cols-2 mb-6">
                      {section.items.map((item, index) => (
                        <div key={`${section.title}-main-${index}`}>
                          <a href={item.href} className="cursor-pointer" target="_blank" rel="noopener noreferrer">
                            <h3 className="text-heading !text-xl font-bold !my-2.5 flex justify-between items-center gap-6 group">
                              <span>{item.title}</span>
                              <span className="transition -translate-x-1/3 group-hover:translate-x-0">
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="text-primary-main text-sm"
                                />
                              </span>
                            </h3>
                          </a>
                          <p className="text-gray-ebony-clay font-normal">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render subtitle groups */}
                  {section.subtitleGroups.map((group, groupIndex) => (
                    <div key={`${section.title}-group-${groupIndex}`} className="mb-6 last:mb-0">
                      {group.subtitle && (
                        <p className="text-heading font-bold mb-3">{group.subtitle}:</p>
                      )}
                      <div className="grid gap-x-12 md:gap-x-24 gap-y-3 grid-cols-1 md:grid-cols-2">
                        {group.items.map((item, index) => (
                          <div key={`${section.title}-${group.subtitle}-${index}`}>
                            <a href={item.href} className="cursor-pointer" target="_blank" rel="noopener noreferrer">
                              <h3 className="text-heading !text-xl font-bold !my-2.5 flex justify-between items-center gap-6 group">
                                <span>{item.title}</span>
                                <span className="transition -translate-x-1/3 group-hover:translate-x-0">
                                  <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className="text-primary-main text-sm"
                                  />
                                </span>
                              </h3>
                            </a>
                            <p className="text-gray-ebony-clay font-normal">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/*endregion right content*/}
        </div>
      </section>
    </>
  );
});

DirectAccess.displayName = 'DirectAccess';
export default DirectAccess;
