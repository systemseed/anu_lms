import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme();

const customizedTheme = createMuiTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: '#4698c9',
    },
  },
  typography: {
    fontFamily: 'Lato, Roboto, Arial',
    fontWeight: 400,
    h1: {
      fontSize: '1.5em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '2.5em',
      }
    },
    h2: {
      fontSize: '1.25em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '2em',
      }
    },
    h3: {
      fontSize: '1.125em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '1.75em',
      }
    },
    h4: {
      fontSize: '1em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '1.5em',
      }
    },
    h5: {
      fontSize: '0.875em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '1.25em',
      }
    },
    h6: {
      fontSize: '0.75em',
      marginBottom: '0.75em',
      fontWeight: 700,
      [theme.breakpoints.up('sm')]: {
        marginBottom: '1em',
        fontSize: '1em',
      }
    },
    button: {
      fontWeight: 700,
    },
    body2: {
      fontSize: '1rem',
    }
  },
});

export default customizedTheme;
