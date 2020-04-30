import React from 'react';
import PropTypes from 'prop-types';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import { getCurrentNode } from '../../../utils/node';
import { getLangCodePrefix } from '../../../utils/settings';

const useStyles = makeStyles(theme => ({
  menuItem: {
    whiteSpace: 'normal',
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    fontSize: ({ fontSize }) => (fontSize === 'large' ? '1rem' : '.75rem'),
  },
}));

const LessonList = ({ lessons, assessment, fontSize }) => {
  const currentNode = getCurrentNode();
  const classes = useStyles({ fontSize });

  return (
    <MenuList disablePadding>
      {lessons.map(lesson => (
        <MenuItem
          key={lesson.id}
          className={classes.menuItem}
          selected={
            `${getLangCodePrefix()}${currentNode.path}` ===
            `${getLangCodePrefix()}${lesson.path}`
          }
          onClick={() => (window.location.href = `${getLangCodePrefix()}${lesson.path}`)}
        >
          {lesson.title}
        </MenuItem>
      ))}

      {assessment && (
        <MenuItem
          key={assessment.id}
          className={classes.menuItem}
          selected={
            `${getLangCodePrefix()}${currentNode.path}` ===
            `${getLangCodePrefix()}${assessment.path}`
          }
          onClick={() => (window.location.href = `${getLangCodePrefix()}${assessment.path}`)}
        >
          <strong>{assessment.title}</strong>
        </MenuItem>
      )}
    </MenuList>
  );
}

LessonList.propTypes = {
  lessons: PropTypes.arrayOf(PropTypes.shape()),
  fontSize: PropTypes.oneOf(['small', 'large']),
};

LessonList.defaultProps = {
  fontSize: 'large',
};

export default LessonList;
