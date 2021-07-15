import he from 'he';

/**
 * Returns single object item.
 */
const getObjectValue = (entity, fieldName) => {
  if (!entity || typeof entity === 'undefined') {
    return null;
  }

  if (typeof entity[fieldName] !== 'object') {
    return null;
  }

  if (Array.isArray(entity[fieldName]) && typeof entity[fieldName][0] !== 'object') {
    return null;
  }

  return entity[fieldName][0] || entity[fieldName] || null;
};

/**
 * Returns array items.
 */
const getArrayValue = (entity, fieldName) => {
  if (!entity || typeof entity === 'undefined') {
    return [];
  }

  if (typeof entity[fieldName] !== 'object') {
    return [];
  }

  return entity[fieldName];
};

/**
 * Get filtered / plain text value from the field
 */
const getTextValue = (entity, fieldName) => {
  const field = getObjectValue(entity, fieldName);

  if (!field) {
    return '';
  }

  // If the field has "processed" property it means that it is
  // filtered text and the "processed" property must be used.
  if (Object.prototype.hasOwnProperty.call(field, 'processed')) {
    return field.processed;
  }

  return Object.prototype.hasOwnProperty.call(field, 'value') ? he.decode(String(field.value)) : '';
};

/**
 * Get filtered / plain text value from the field
 */
const getTextValueOrUndefined = (entity, fieldName) => {
  const field = getTextValue(entity, fieldName);

  if (field === '') {
    return;
  }
  return field;
};

/**
 * Get text value from the field as usual and return it as number.
 */
const getNumberValue = (entity, fieldName) => {
  const field = getObjectValue(entity, fieldName);

  if (!field) {
    return 0;
  }

  return Object.prototype.hasOwnProperty.call(field, 'value')
    ? Number.parseInt(field.value, 10)
    : 0;
};

/**
 * Get a bool value from the field as usual and return it.
 */
const getBooleanValue = (entity, fieldName) => {
  const field = getObjectValue(entity, fieldName);

  if (!field) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(field, 'value') && field.value === true;
};

/**
 * Returns image field URL to the given image style origin.
 */
const getImageURL = (entity, fieldName, imageStyle = 'original') => {
  const field = getObjectValue(entity, fieldName);

  if (!field) {
    return '';
  }

  const imageStyles = getObjectValue(field, 'image_styles');

  if (!(imageStyles && imageStyle in imageStyles)) {
    return '';
  }

  return imageStyles[imageStyle];
};

/**
 * Return image field's alt.
 */
const getImageAlt = (entity, fieldName) => {
  const field = getObjectValue(entity, fieldName);

  if (!field) {
    return '';
  }

  if (!Object.prototype.hasOwnProperty.call(field, 'alt')) {
    // Sometimes media image field has multiple nesting of field data. In
    // this case we need to make th
    return Object.prototype.hasOwnProperty.call(field, fieldName)
      ? getImageAlt(field, fieldName)
      : '';
  }

  return field.alt;
};

/**
 * Returns image object with both url and alt fields in place.
 */
const getImage = (entity, fieldName, imageStyle = 'original') => ({
  url: getImageURL(entity, fieldName, imageStyle),
  alt: getImageAlt(entity, fieldName),
  type: 'image',
});

/**
 * Returns value of the URL field.
 */
const getLinkURL = (entity, fieldName) => {
  const field = getObjectValue(entity, fieldName);
  if (!field) {
    return '';
  }

  return field.uri ? field.uri : '';
};

/**
 * Return properly file URL from the file field.
 */
const getFileURL = (entity, fieldName) => {
  const file = getObjectValue(entity, fieldName);

  if (!file) {
    return '';
  }

  const uri = getObjectValue(file, 'uri');
  return uri && Object.prototype.hasOwnProperty.call(uri, 'url') ? uri.url : '';
};

/**
 * Return file mime name of the file.
 * Usually it's something like "application/pdf".
 */
const getFileMime = (entity, fieldName) => {
  const file = getObjectValue(entity, fieldName);

  if (!file) {
    return '';
  }

  return getTextValue(file, 'filemime');
};

/**
 * Return file size value.
 * The value is in bytes.
 */
const getFileSize = (entity, fieldName) => {
  const file = getObjectValue(entity, fieldName);

  if (!file) {
    return 0;
  }

  return getNumberValue(file, 'filesize');
};

/**
 * Returns url of the node.
 */
const getNodeUrl = (node) => {
  return node.path;
};

// The export is done this way so that node.js can also
// require these functions.
export {
  getObjectValue,
  getArrayValue,
  getTextValue,
  getTextValueOrUndefined,
  getNumberValue,
  getBooleanValue,
  getImageURL,
  getImageAlt,
  getImage,
  getLinkURL,
  getFileURL,
  getFileMime,
  getFileSize,
  getNodeUrl,
};
