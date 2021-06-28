import PropTypes from 'prop-types';
import * as fields from '@anu/utilities/fields';

/**
 * Transform course category term from Drupal backend
 * into frontend-friendly object.
 */
const transformCourseCategory = (term) => {
  // Make sure the term data exists.
  if (!fields.getNumberValue(term, 'tid')) {
    return null;
  }

  const transformedData = {
    id: fields.getNumberValue(term, 'tid'),
    title: fields.getTextValue(term, 'name'),
    weight: fields.getNumberValue(term, 'weight'),
  };

  // Handle only the first parent. We don't support multiple parents.
  const parents = fields.getArrayValue(term, 'parent');
  if (parents && parents.length > 0) {
    transformedData.parent = transformCourseCategory(parents[0]);
  }

  return transformedData;
};

/**
 * Define expected prop types for course category.
 */
const courseCategoryPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
  parent: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    weight: PropTypes.number.isRequired,
  }),
});

export { transformCourseCategory, courseCategoryPropTypes };
