// First entry-point for IE11 compatibility.
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// Second entry-point for BrowserUpdate notification.
import browserUpdate from 'browser-update';

import React from 'react';
import ReactDOM from 'react-dom';
import { create } from 'jss';
import rtl from 'jss-rtl';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/core/styles';

import { getLangCode } from './utils/settings';

import Application from './Application';
import theme from './theme';

import './i18n';

browserUpdate({
  required: {
    e: -3, // Notify for all IEs, and any Edge 3 versions prior.
    f: -3,
    o: -3,
    s: -1,
    c: -3,
    samsung: 7.0,
    vivaldi: 1.2,
  },
  l: getLangCode(),
  insecure: true,
  unsupported: true,
});

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
