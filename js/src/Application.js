import React from 'react';
import { jssPreset, ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { theme, GlobalCss } from '@anu/theme';
import { create } from 'jss';
import rtl from 'jss-rtl';

// Setup JSS for RTL
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const Application = ({ children }) => (
  <ThemeProvider theme={theme}>
    <StylesProvider jss={jss}>
      <GlobalCss />
      <BrowserRouter>{children}</BrowserRouter>
    </StylesProvider>
  </ThemeProvider>
);

export default Application;
