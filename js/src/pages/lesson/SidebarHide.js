import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(1.5, 2),
    overflow: 'hidden',
    position: 'relative',
    height: '44px',
  },
  background: ({ isSidebarVisible }) => ({
    background: theme.palette.grey[200],
    position: 'absolute',
    left: isSidebarVisible ? 0 : '-300px',
    transition: '.3s left',
    top: 0,
    bottom: 0,
    width: '300px', // Sidebar width.
    zIndex: 20,
  }),
  link: {
    ...theme.typography.link,
    position: 'relative',
    zIndex: 100,
    color: theme.palette.common.black,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    '&:hover': {
      textDecoration: 'none',
      color: theme.typography.link.color,
    },
  },
  hideSectionIcon: ({ isSidebarVisible }) => ({
    transform: isSidebarVisible ? 'rotate(180deg)' : 'rotate(0)',
    transition: '.3s transform',
    fontSize: '1rem',
    marginRight: theme.spacing(1.5),
  }),
}));

const LessonSidebarHide = ({ isSidebarVisible, toggleSidebarVisibility }) => {
  const classes = useStyles({ isSidebarVisible });

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.background} />

      <Link className={classes.link} onClick={() => toggleSidebarVisibility(!isSidebarVisible)}>
        <DoubleArrowIcon className={classes.hideSectionIcon} />
        {isSidebarVisible
          ? Drupal.t('Hide modules', {}, { context: 'ANU LMS' })
          : Drupal.t('Show modules', {}, { context: 'ANU LMS' })}
      </Link>
    </Box>
  );
};

LessonSidebarHide.propTypes = {
  isSidebarVisible: PropTypes.bool,
  toggleSidebarVisibility: PropTypes.func,
};

LessonSidebarHide.defaultProps = {
  isSidebarVisible: true,
  toggleSidebarVisibility: () => {},
};

export default LessonSidebarHide;
