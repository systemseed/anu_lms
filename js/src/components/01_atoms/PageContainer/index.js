import React from 'react';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';

const StyledWrapperBox = withStyles(theme => ({
  root: {
    position: 'relative',
  }
}))(Box);

const PageContainer  = ({ children }) => (
  <StyledWrapperBox>{children}</StyledWrapperBox>
);

export default PageContainer;
