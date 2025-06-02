import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Load translations using HTTP
  .use(initReactI18next) // Bind React-i18next
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Adjust path to match src structure
    },
    fallbackLng: 'en',
    lng: 'en', // Default language
    interpolation: {
      escapeValue: false, // React escapes by default
    },
  });

export default i18n;
