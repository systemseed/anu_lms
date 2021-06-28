import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import SelectableChip from '@anu/components/SelectableChip';
import { courseCategoryPropTypes } from '@anu/utilities/transform.courseCategory';

const CoursesCategoryFilters = ({ filterValue, categories }) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <>
      <SelectableChip
        isSelected={filterValue === 'all'}
        label={Drupal.t('All categories', {}, { context: 'ANU LMS' })}
        onClick={() => history.push(`${location.pathname}?category=all`)}
      />

      {categories.map((category) => (
        <SelectableChip
          key={category.id}
          label={category.title}
          isSelected={category.id === Number.parseInt(filterValue, 10)}
          onClick={() => history.push(`${location.pathname}?category=${category.id}`)}
        />
      ))}
    </>
  );
};

CoursesCategoryFilters.propTypes = {
  filterValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  categories: PropTypes.arrayOf(courseCategoryPropTypes),
};

CoursesCategoryFilters.defaultProps = {
  categories: [],
};

export default CoursesCategoryFilters;
