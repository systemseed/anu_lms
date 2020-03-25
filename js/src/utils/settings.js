import {
  getImage,
  getTextValue
} from './transforms.field';

export const getSettings = () => {
  const { anu_settings } = drupalSettings;
  if (!anu_settings) {
    return [];
  }

  return {
    courses_description: getTextValue(anu_settings, 'field_courses_description'),
    logo: getImage(anu_settings, 'field_logo'),
  }
};
