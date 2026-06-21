import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '@core/i18n/i18n';

export { SUPPORTED_LANGUAGES, type AppLanguage };

export function useLanguage() {
  const { i18n } = useTranslation();
  const language = (i18n.language?.split('-')[0] as AppLanguage) ?? 'es';

  return {
    language,
    setLanguage: (lng: AppLanguage) => i18n.changeLanguage(lng),
    toggle: () => i18n.changeLanguage(language === 'es' ? 'en' : 'es'),
  };
}
