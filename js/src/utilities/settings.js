const getPwaSettings = () => (drupalSettings && drupalSettings.pwa_settings) || null;

const getPathPrefix = () =>
  (drupalSettings && drupalSettings.path && drupalSettings.path.pathPrefix) || '';

const getUserId = () => (drupalSettings && drupalSettings.user && drupalSettings.user.uid) || '0';

export { getPwaSettings, getPathPrefix, getUserId };
