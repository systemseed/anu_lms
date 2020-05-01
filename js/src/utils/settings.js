import { getImage, getTextValue } from './transforms.field';

export const getSettings = () => {
  const { anu_settings } = drupalSettings;

  if (!anu_settings) {
    return [];
  }

  return {
    courses_description: getTextValue(anu_settings, 'field_courses_description'),
    logo: getImage(anu_settings, 'field_logo', 'logo'),
  };
};

export const getPwaSettings = () => (drupalSettings && drupalSettings.pwa_settings) || null;

export const getLanguageSettings = () => (drupalSettings && drupalSettings.language) || null;

export const getLangCode = () => getLanguageSettings() && getLanguageSettings().current_language;

export const getLangCodePrefix = () => (getLangCode() ? `/${getLangCode()}` : '');
