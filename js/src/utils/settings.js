import { getImage, getTextValue } from './transforms.field';

export const getSettings = () => {
  const { anu_settings: settings } = drupalSettings;

  if (!settings) {
    return [];
  }

  return {
    courses_description: getTextValue(settings, 'field_courses_description'),
    logo: getImage(settings, 'field_logo', 'logo'),
    betaLogo: getImage(settings, 'field_beta_label', 'anu_lms_beta_label'),
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

export const getCoursesSettings = () => {
  if (!drupalSettings.anu_courses) {
    return [];
  }

  return {
    pageTitle: drupalSettings.anu_courses.page_title,
    filterAllCoursesLabel: drupalSettings.anu_courses.filter_all_courses_label,
  };
};
