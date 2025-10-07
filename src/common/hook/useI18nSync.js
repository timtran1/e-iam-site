import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import useCookie from './useCookie.js';

/**
 * Custom hook to sync i18next language with 'aclan' cookie
 * This ensures i18next language stays in sync with U5CMS language cookie
 *
 * @returns {void}
 */
const useI18nSync = () => {
  const {i18n} = useTranslation();
  const [cookieLang] = useCookie('aclan'); // This key comes from U5CMS

  /**
   * Detect language changes and sync translation
   */
  useEffect(() => {
    if (cookieLang && i18n.language !== cookieLang) {
      i18n.changeLanguage(cookieLang).then();
    }
  }, [cookieLang, i18n]);
};

export default useI18nSync;
