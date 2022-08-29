import { createTheme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';

const getDirection = () => document.dir || 'ltr';

// Create a default theme with colors defined, so that
// in the actual theme we could reference to the existing
// colors and also breakpoints.
// See https://material-ui.com/customization/default-theme
// to find out about all options.
const defaultTheme = createTheme({
  direction: getDirection(),
  typography: {
    fontFamily: '"Public Sans", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  palette: {
    common: {
      black: '#000000',
      white: '#ffffff',
      darkBlue: '#212431',
    },
    // Note that it is assumed that the only color that is planned to be
    // overwritten is the primary. All other colors used in ANU are likely
    // to stay as is regardless of the project.
    primary: {
      main: '#000000',
      contrastText: '#ffffff',
    },
    grey: {
      100: '#fafafa',
      200: '#f6f7f8',
      300: '#cfd8dc',
      400: '#445963',
    },
    accent1: {
      main: '#f5de95',
      contrastText: '#000000',
    },
    accent2: {
      main: '#00796b',
      contrastText: '#ffffff',
    },
    success: {
      main: '#00796b',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f5de95',
      contrastText: '#000000',
    },
    error: {
      main: '#9f2621',
      contrastText: '#ffffff',
    },
    paragraphHighlight: {
      blue: '#d0e3ff',
      yellow: '#faeabf',
      green: '#daf0e5',
      purple: '#f4e3ff',
    },
  },
});

const theme = createTheme({
  ...defaultTheme,
  typography: {
    h1: {
      color: defaultTheme.palette.common.black,
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightBold,
      fontSize: '3.75rem',
      lineHeight: 1.125,
      letterSpacing: 'normal',
    },
    h2: {
      color: defaultTheme.palette.common.black,
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightMedium,
      fontSize: '2.625rem',
      lineHeight: 1.25,
      letterSpacing: 'normal',
    },
    h3: {
      color: defaultTheme.palette.common.black,
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightBold,
      fontSize: '2.375rem',
      lineHeight: 1.375,
      letterSpacing: 'normal',
    },
    h4: {
      color: defaultTheme.palette.common.black,
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightRegular,
      fontSize: '1.5rem',
      lineHeight: 1.75,
      letterSpacing: 'normal',
      [defaultTheme.breakpoints.up('md')]: {
        fontSize: '2.125rem',
        lineHeight: 1.5,
      },
    },
    h5: {
      color: defaultTheme.palette.common.black,
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightBold,
      fontSize: '1.25rem',
      lineHeight: 1.25,
      letterSpacing: 'normal',
      [defaultTheme.breakpoints.up('md')]: {
        fontSize: '1.5rem',
      },
    },
    h6: {
      color: defaultTheme.palette.common.black,
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightMedium,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    subtitle1: {
      color: defaultTheme.palette.common.black,
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightBold,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    subtitle2: {
      color: defaultTheme.palette.common.black,
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightBold,
      fontSize: '1.125rem',
      lineHeight: 1.25,
      letterSpacing: 'normal',
    },
    body1: {
      color: defaultTheme.palette.common.black,
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightRegular,
      fontSize: '1.125rem',
      lineHeight: 1.75,
      letterSpacing: 'normal',
    },
    body2: {
      color: defaultTheme.palette.common.black,
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightRegular,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    overline: {
      color: defaultTheme.palette.grey[400],
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightBold,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
    },
    caption: {
      color: defaultTheme.palette.grey[400],
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightRegular,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    button: {
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightBold,
      fontSize: '1rem',
      lineHeight: 1.25,
      letterSpacing: '1px',
      textTransform: 'capitalize',
    },
    label1: {
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightMedium,
      fontSize: '1rem',
      lineHeight: 1.25,
      letterSpacing: 0,
      textTransform: 'uppercase',
    },
    label2: {
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightMedium,
      fontSize: '0.875rem',
      lineHeight: 1.25,
      letterSpacing: 0,
      textTransform: 'uppercase',
    },
    link: {
      color: defaultTheme.palette.primary.main,
      cursor: 'pointer',
      fontFamily: defaultTheme.typography.fontFamily,
      fontWeight: defaultTheme.typography.fontWeightBold,
      fontSize: '1rem',
      lineHeight: 1.25,
      letterSpacing: 0,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        fontFamily: defaultTheme.typography.fontFamily,
        fontSize: '1rem',
        paddingLeft: defaultTheme.spacing(4),
        paddingRight: defaultTheme.spacing(4),
        paddingTop: defaultTheme.spacing(1.5),
        paddingBottom: defaultTheme.spacing(1.5),
      },
      sizeLarge: {
        padding: defaultTheme.spacing(1.5),
        fontSize: '1rem',
        minWidth: defaultTheme.spacing(6),
      },
      startIcon: {
        marginRight: '0',
      },
      endIcon: {
        marginLeft: '0',
      },
      contained: {
        order: '1',
      },
    },
    MuiChip: {
      root: {
        fontFamily: defaultTheme.typography.fontFamily,
        fontSize: '1rem',
        height: '36px',
        letterSpacing: 0,
      },
    },
    MuiFormControlLabel: {
      root: {
        display: 'flex',
        alignItems: 'flex-start',
      },
      label: {
        paddingTop: defaultTheme.spacing(0.5),
        paddingBottom: defaultTheme.spacing(0.5),
        lineHeight: 1.85,
      },
    },
    MuiListItem: {
      root: {
        paddingTop: 2,
        paddingBottom: 2,
      },
    },
    MuiLinearProgress: {
      determinate: {
        backgroundColor: defaultTheme.palette.common.white,
      },
    },
  },
});

// Common styles for elements with an enabled rich text editor.
export const textStyle = (theme) => ({
  '& > p': {
    marginBottom: theme.spacing(2),
  },
  '& > p:first-child': {
    marginTop: 0,
  },
  '& > p:last-child': {
    marginBottom: 0,
  },
  '& ul': {
    paddingLeft: theme.spacing(4.5),
    margin: 0,
  },
  '& ul > li': {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1.75),
  },
  '& ul > li::marker': {
    fontSize: '1.1875rem',
    color: theme.palette.primary.main,
  },
  '& ol': {
    paddingLeft: theme.spacing(3.75),
    margin: 0,
  },
  '& ol > li': {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  '& ol > li::marker': {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
});

// Handle some global css overrides which exist
// outside of MUI components.
const GlobalCss = withStyles({
  '@global': {
    a: {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
      '&:hover': {
        textDecoration: 'none',
      },
    },
    'strong.highlight': {
      background: '#FFFF00',
    },
  },
})(() => null);

export { theme, GlobalCss };
