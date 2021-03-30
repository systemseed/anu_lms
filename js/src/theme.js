import { createMuiTheme } from '@material-ui/core/styles';
import { getDirection } from './i18n';

const theme = createMuiTheme();

/**
 * Returns the appropriate Material Icon names affected by RTL displays.
 */
export const getRTLIcon = type => {
  const lookup = {
    arrow_back: {
      rtl: 'arrow_forward',
      ltr: 'arrow_back',
    },
  };

  return lookup[type] ? lookup[type][getDirection()] : null;
};

const customizedTheme = createMuiTheme({
  direction: getDirection(),
  palette: {
    primary: {
      main: '#4698c9',
    },
    secondary: {
      light: '#546e7a',
      main: '#3E3E3E',
      dark: '#2E2E2E',
    },
    // TODO - consolidate
    accent: '#ffca28',
    warning: {
      main: '#ffca28',
      light: '#ffecb3',
    },
  },
  typography: {
    fontFamily: 'Lato, Roboto, Arial',
    fontWeight: 400,
    h1: {
      fontSize: '1.5em',
      marginBottom: '0.75em',
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '2.75em',
      },
    },
    h2: {
      fontSize: '1.25em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '2em',
      },
    },
    h3: {
      fontSize: '1.125em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '1.75em',
      },
    },
    h4: {
      fontSize: '1em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '1.5em',
      },
    },
    h5: {
      fontSize: '0.875em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '1.25em',
      },
    },
    h6: {
      fontSize: '0.75em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '1em',
      },
    },
    button: {
      fontWeight: 700,
    },
    body1: {
      fontSize: 18,
    },
    body2: {
      fontSize: '1rem',
    },
  },
  overrides: {
    MuiFormControlLabel: {
      root: {
        alignItems: 'flex-start',
        marginBottom: theme.spacing(1),
      },
      label: {
        marginTop: theme.spacing(1),
      },
    },
    MuiListItemIcon: {
      alignItemsFlexStart: {
        marginTop: theme.spacing(1.5),
      },
    },
    MuiButton: {
      root: {
        '&.secondary': {
          textTransform: 'none',
          fontWeight: 400,
        },
      },
    },
    MuiChip: {
      root: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        height: 35,
      },
      label: {
        fontSize: 16,
        paddingLeft: theme.spacing(2.5),
        paddingRight: theme.spacing(2.5),
      },
      outlined: {
        backgroundColor: 'white',
      },
    },
  },
});

export default customizedTheme;
