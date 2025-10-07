import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import Cookies from 'js-cookie';

// Import translation files
import enTranslation from './locales/en/translation.json';
import deTranslation from './locales/de/translation.json';
import frTranslation from './locales/fr/translation.json';
import itTranslation from './locales/it/translation.json';
import rmTranslation from './locales/rm/translation.json';

/**
 * Get language from cookie 'aclan' (U5CMS standard)
 *
 * @returns {string} Language code
 */
const getLanguageFromCookie = () => {
  const cookieLang = Cookies.get('aclan'); // This key comes from U5CMS
  return cookieLang || 'en';
};

// Translation resources
const resources = {
  en: {
    translation: enTranslation,
  },
  de: {
    translation: deTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  it: {
    translation: itTranslation,
  },
  rm: {
    translation: rmTranslation,
  },
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLanguageFromCookie(),
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })
  .then();

export default i18n;
