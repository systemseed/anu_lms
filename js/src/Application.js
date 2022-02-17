import React from 'react';
import PropTypes from 'prop-types';
import { jssPreset, ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { theme, GlobalCss } from '@anu/theme';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { Detector } from 'react-detect-offline';
import onNetworkChange from '@anu/utilities/onNetworkChange';

// Setup JSS for RTL
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const Application = ({ children }) => (
  <ThemeProvider theme={theme}>
    <StylesProvider jss={jss}>
      <GlobalCss />
      <Detector
        polling={false}
        onChange={onNetworkChange}
        render={() => <BrowserRouter>{children}</BrowserRouter>}
      />
    </StylesProvider>
  </ThemeProvider>
);

Application.propTypes = {
  children: PropTypes.node,
};

export default Application;
