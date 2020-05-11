import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { getLangCode } from '../utils/settings';
import { camelcase } from '../utils/helpers';

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
  enGb: {
    translation: en,
  },
  es: {
    translation: es,
  },
  tiEt: {
    translation: tiEt,
  },
};

console.log(camelcase(getLangCode()));

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: camelcase(getLangCode()),
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

export const getDirection = () => i18n.dir();
