import React from 'react';
import PropTypes from 'prop-types';

import Chip from '@material-ui/core/Chip';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: ({ isSelected, noMargin }) => ({
    background: isSelected ? theme.palette.grey[400] : theme.palette.common.white,
    color: isSelected ? theme.palette.common.white : theme.palette.common.black,
    margin: noMargin ? 0 : theme.spacing(0, 1.5, 1.5, 0),
    border: '1px solid ' + theme.palette.grey[300],
    transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 300ms',
    '&:hover,&:focus': {
      background: isSelected ? theme.palette.grey[400] : theme.palette.grey[200],
    },
  }),
}));

const SelectableChip = ({ isSelected, noMargin, ...props }) => {
  const classes = useStyles({ isSelected, noMargin });
  return <Chip className={classes.root} {...props} />;
};

SelectableChip.propTypes = {
  isSelected: PropTypes.bool,
  noMargin: PropTypes.bool,
};

SelectableChip.defaultProps = {
  isSelected: false,
  noMargin: false,
};

export default SelectableChip;
