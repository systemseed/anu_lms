import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { getLangCode } from '../utils/settings';

import ar from './ar.json';
import en from './en.json';
import es from './es.json';
import tiEt from './ti-et.json';

const resources = {
  ar: {
    translation: ar,
  },
  en: {
    translation: en,
  },
  'en-gb': {
    translation: en,
  },
  es: {
    translation: es,
  },
  'ti-et': {
    translation: tiEt,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLangCode(),
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
