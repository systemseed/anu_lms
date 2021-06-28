import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { theme, GlobalCss } from '@anu/theme';

const Application = ({ children }) => (
  <ThemeProvider theme={theme}>
    <GlobalCss />
    <BrowserRouter>{children}</BrowserRouter>
  </ThemeProvider>
);

export default Application;
