import React from 'react';
import ReactDOM from 'react-dom';
import { create } from 'jss';
import rtl from 'jss-rtl';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/core/styles';

import Application from './Application';
import theme from './theme';

import './i18n';

// Setup JSS for RTL
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <StylesProvider jss={jss}>
      <CssBaseline />

      <Application />
    </StylesProvider>
  </ThemeProvider>,
  document.querySelector('#anu-lms')
);
