const getPwaSettings = () => (drupalSettings && drupalSettings.pwa_settings) || null;

const getPathPrefix = () =>
  (drupalSettings && drupalSettings.path && drupalSettings.path.pathPrefix) || '';

export { getPwaSettings, getPathPrefix };
