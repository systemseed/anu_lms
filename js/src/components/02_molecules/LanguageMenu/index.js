import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LanguageLink from '../../01_atoms/LanguageLink';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import { getLangCode } from '../../../utils/settings';

/* TODO: Make into menu item theme along with LessonList */
/*
const useStyles = makeStyles(theme => ({
  menuItem: {
    whiteSpace: 'normal',
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    fontSize: ({ fontSize }) => (fontSize === 'large' ? '1rem' : '.75rem'),
  },
}));
*/

const StyledMenu = withStyles({
  paper: {
    minWidth: '260px',
  },
  list: {
    paddingTop: '4px',
    paddingBottom: '4px',
  }
})((props) => (
  <Menu
    elevation={1}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(() => ({
  root: {
    padding: 0,
  },
}))(MenuItem);

const useStyles = makeStyles({
  more: {
    color: '#fff',
    lineHeight: '18px',
    padding: '9px 12px',
    borderRadius: 0,
    '&:hover': {
      backgroundColor: '#212121',
    },
  },
  listLink: {
    padding: '13px 30px',
    lineHeight: '20px',
    minWidth: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

const LanguageMenu = ({ options }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (options.length === 0) {
    return null;
  }
  return (
    <>
      <LanguageLink
        label="More"
        onClick={handleClick}
        endIcon={<ExpandMoreIcon style={{ fontSize: 18 }} />}
        className={classes.more}
      />
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map(lang => (
          <StyledMenuItem
            key={lang.code}
            onClick={() => (window.location.href = lang.url)}
          >
            <LanguageLink
              isActive={getLangCode() === lang.code}
              label={lang.title}
              className={classes.listLink}
              url="#"
            />
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </>
  );
};

LanguageMenu.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape()),
};

LanguageMenu.defaultProps = {
  options: [],
};

export default LanguageMenu;
