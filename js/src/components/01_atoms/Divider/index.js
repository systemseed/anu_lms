import React from 'react';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography'
import LessonGrid from '../../06_hocs/LessonGrid'

const StyledWrapperBox = withStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(8),
    }
  }
}))(Box);

const StyledBox = withStyles(theme => ({
  root: {
    height: theme.spacing(4),
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      height: theme.spacing(8),
    }
  }
}))(Box);

const SimpleDivider = withStyles(theme => ({
  root: {
    height: '2px',
    background: '#4698c9',
    position: 'absolute',
    top: theme.spacing(2),
    left: 0,
    right: 0,
    [theme.breakpoints.up('sm')]: {
      top: theme.spacing(4),
    }
  }
}))(Box);

const NumberWrapper = withStyles(theme => ({
  root: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    background: '#4698c9',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    }
  }
}))(Box);

const NumberInner = withStyles(theme => ({
  root: {
    color: 'white'
  }
}))(Typography);

const Divider = ({ type, counter }) => {
  return (
    <StyledWrapperBox>
      <LessonGrid>
        <StyledBox>
          <SimpleDivider />
          {type === 'numeric' && counter > 0 &&
          <NumberWrapper>
            <NumberInner>{counter}</NumberInner>
          </NumberWrapper>
          }
        </StyledBox>
      </LessonGrid>
    </StyledWrapperBox>
  );
};

export default Divider;
