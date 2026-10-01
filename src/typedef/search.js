/**
 * @typedef SearchResult
 *
 * @property {Element=} heading
 * @property {Element=} description
 * @property {string=} href
 * @property {string=} badge - Label of U5CMS for documents and protected content (e.g. 'cug docx')
 */

/**
 * @typedef CrossSiteSource
 *
 * @property {string} id - Id of the U5CMS container (e.g. 'teledocs')
 * @property {string | null} src - Url of the U5CMS iframe which fills the container
 * @property {string} html - Content of the container if U5CMS has filled it already
 */

/**
 * @typedef CrossSiteResultGroup
 *
 * @property {string} id
 * @property {string} title - Heading of U5CMS (e.g. 'Suggestions from docs.eiam.admin.ch'), empty if U5CMS prints none
 * @property {string} domain - Site the results come from (e.g. 'docs.eiam.admin.ch')
 * @property {Array<SearchResult>} results
 */
