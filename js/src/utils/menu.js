export const getMenu = () => {
  return drupalSettings && drupalSettings.anu_menu || null;
}

export const getMenuIconByTitle = menuTitle => {
  const icons = {
    'Home': 'home',
    'Courses': 'dashboard',
    'Edit page': 'edit',
    'Results': 'assignment',
    'Profile': 'account_circle',
    'Organization': 'group',
    'Organizations': 'group',
    'Login': 'exit_to_app',
    // Can't believe MUI does not have a proper logout icon...
    'Logout': 'exit_to_app',
  };

  return menuTitle in icons ? icons[menuTitle] : '';
}

export const getMenuPathByTitle = menuTitle => {
  const menu = getMenu();
  if (!menu) {
    return '';
  }

  const flatMenu = [...menu.primary, ...menu.secondary];
  const item = flatMenu.find(item => item.title === menuTitle);
  return item ? item.url : '';
}
