import { getImage, getTextValue } from './transforms.field';

export const getSettings = () => {
  const { anu_settings } = drupalSettings;

  if (!anu_settings) {
    return [];
  }

  return {
    courses_description: getTextValue(anu_settings, 'field_courses_description'),
    logo: getImage(anu_settings, 'field_logo', 'logo'),
    betaLogo: getImage(anu_settings, 'field_beta_label', 'anu_lms_beta_label'),
  };
};

export const getPwaSettings = () => (drupalSettings && drupalSettings.pwa_settings) || null;

export const getLanguageSettings = () => (drupalSettings && drupalSettings.language) || null;

export const getLangCode = () => {
  const settings = getLanguageSettings();
  return settings && settings.current_language ? settings.current_language : '';
};

export const getLangCodePrefix = () => {
  const settings = getLanguageSettings();
  const langcode = getLangCode();
  if (settings.links.length === 0 || !langcode) {
    return '';
  }
  return `/${langcode}`;
};
