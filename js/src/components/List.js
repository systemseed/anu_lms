import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Icon, withStyles } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LessonGrid from '@anu/components/LessonGrid';
import Typography from '@material-ui/core/Typography';

console.log('hey');

const StyledList = withStyles({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
})(List);

const NumberedList = withStyles((theme) => ({
  root: {
    listStyle: 'decimal',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    paddingLeft: theme.spacing(4),
  },
}))(StyledList);

const StyledListItem = withStyles({
  root: {
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

const NumberedListItemText = withStyles((theme) => ({
  root: {
    color: theme.palette.common.black,
  },
}))(ListItemText);

const StyledIcon = withStyles((theme) => ({
  fontSizeSmall: {
    fontSize: '8px !important',
    color: theme.palette.primary.main,
  },
}))(Icon);

const ListElement = ({ items, type }) => (
  <LessonGrid>
    {type === 'ul' && (
      <StyledList component={type}>
        {items.map((item, index) => (
          <StyledListItem key={index}>
            <ListItemIcon style={{ minWidth: 32 }}>
              <StyledIcon fontSize="small">brightness_1</StyledIcon>
            </ListItemIcon>

            <ListItemText>
              <Typography component="span" dangerouslySetInnerHTML={{ __html: item }} />
            </ListItemText>
          </StyledListItem>
        ))}
      </StyledList>
    )}

    {type === 'ol' && (
      <NumberedList component={type}>
        {items.map((item, index) => (
          <NumberedListItem key={index}>
            <NumberedListItemText>
              <Typography component="span" dangerouslySetInnerHTML={{ __html: item }} />
            </NumberedListItemText>
          </NumberedListItem>
        ))}
      </NumberedList>
    )}
  </LessonGrid>
);

ListElement.propTypes = {
  type: PropTypes.oneOf(['ul', 'ol']).isRequired,
};

export default ListElement;
