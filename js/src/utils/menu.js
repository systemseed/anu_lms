import { getLangCodePrefix } from './settings';

export const getMenu = () => {
  return (drupalSettings && drupalSettings.anu_menu) || null;
};

export const getMenuIconById = id => {
  const icons = {
    home: 'home',
    courses: 'dashboard',
    'add-module': 'post_add',
    'add-lesson': 'post_add',
    'add-quiz': 'post_add',
    'edit-course': 'edit',
    'edit-module': 'edit',
    'edit-lesson': 'edit',
    'edit-quiz': 'edit',
    results: 'assignment',
    profile: 'account_circle',
    organization: 'group',
    organizations: 'group',
    login: 'exit_to_app',
    logout: 'exit_to_app', // Can't believe MUI does not have a proper logout icon...
  };

  return id in icons ? icons[id] : '';
};

export const getMenuPathById = id => {
  const menu = getMenu();

  if (!menu) {
    return '';
  }

  const flatMenu = [...menu.primary, ...menu.secondary];
  const item = flatMenu.find(el => el.id === id);

  return item ? item.url : getLangCodePrefix();
};
