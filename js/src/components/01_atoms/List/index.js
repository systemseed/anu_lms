import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Icon, withStyles } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import LessonGrid from '../../06_hocs/LessonGrid';

const StyledBox = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(4),
  },
}))(Box);

const StyledList = withStyles({
  dense: {
    paddingTop: 0,
    paddingBottom: 0,
  },
})(List);

const NumberedList = withStyles(theme => ({
  root: {
    listStyle: 'decimal',
    color: '#4698c9',
    fontWeight: 'bold',
    paddingLeft: theme.spacing(4),
  },
}))(StyledList);

const StyledListItem = withStyles({
  dense: {
    '&:first-child': {
      paddingTop: 0,
    },
    '&:last-child': {
      paddingBottom: 0,
    },
  },
})(ListItem);

const NumberedListItem = withStyles({
  root: {
    display: 'list-item',
  },
})(StyledListItem);

const NumberedListItemText = withStyles({
  root: {
    color: 'black',
  },
})(ListItemText);

const StyledIcon = withStyles({
  fontSizeSmall: {
    fontSize: '8px !important',
    color: '#4698c9',
  },
})(Icon);

const StyledListItemIcon = withStyles({
  root: {
    minWidth: 32,
  },
})(ListItemIcon);

const ListElement = ({ items, type }) => (
  <StyledBox>
    <LessonGrid>
      {type === 'ul' && (
        <StyledList dense component={type}>
          {items.map((item, index) => (
            <StyledListItem key={index} alignItems="flex-start">
              <StyledListItemIcon>
                <StyledIcon fontSize="small">brightness_1</StyledIcon>
              </StyledListItemIcon>

              <ListItemText>
                {item}
              </ListItemText>
            </StyledListItem>
          ))}
        </StyledList>
      )}

      {type === 'ol' && (
        <NumberedList dense component={type}>
          {items.map((item, index) => (
            <NumberedListItem key={index}>
              <NumberedListItemText>
                {item}
              </NumberedListItemText>
            </NumberedListItem>
          ))}
        </NumberedList>
      )}
    </LessonGrid>
  </StyledBox>
);

ListElement.propTypes = {
  type: PropTypes.oneOf(['ul', 'ol']).isRequired,
};

export default ListElement;
