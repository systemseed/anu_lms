import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';

const TableGrid = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      maxWidth: '1280px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
}))(Box);

const CaptionTypography = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
}))(Typography);

const TableTypography = withStyles((theme) => ({
  root: {
    overflowX: 'auto',
    position: 'relative',

    '& table': {
      width: '100%',
    },
    '& tr': {
      position: 'relative',
      zIndex: 3,
    },
    '& tr + tr': {
      borderTop: `1px solid ${theme.palette.grey[300]}`,
    },
    '& thead tr:last-child': {
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    '& tfoot tr:first-child': {
      borderTop: `1px solid ${theme.palette.grey[300]}`,
    },
    '& th, & td': {
      padding: theme.spacing(2, 0.75),
      backgroundClip: 'padding-box',
    },
    '& th': {
      textAlign: 'left',
      backgroundColor: theme.palette.grey[200],
    },
    '& td': {
      backgroundColor: theme.palette.common.white,
    },
    '& th:first-child, & td:first-child': {
      position: ({ issticky }) => (issticky ? 'sticky' : 'relative'),
      left: 0,
      zIndex: 2,
    },
    '& tbody th, & tfoot th, & td': {
      fontSize: '0.875rem',
    },

    [theme.breakpoints.up('sm')]: {
      '& table': {
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
      },
      '& table::after': {
        content: '""',
        display: 'block',
        borderRadius: 4,
        border: `1px solid ${theme.palette.grey[300]}`,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 4,
        pointerEvents: 'none',
      },
      '& th:first-child, & td:first-child': {
        position: 'relative',
        paddingLeft: theme.spacing(1.5),
      },
      '& th:last-child, & td:last-child': {
        paddingRight: theme.spacing(1.5),
      },
    },
  },
}))(Typography);

const Table = ({ value, caption, isSticky }) => (
  <TableGrid>
    {caption && <CaptionTypography variant="h6">{caption}</CaptionTypography>}

    <TableTypography
      component="div"
      variant="body2"
      dangerouslySetInnerHTML={{ __html: value }}
      issticky={isSticky ? 'sticky' : null}
    />
  </TableGrid>
);

Table.propTypes = {
  value: PropTypes.node.isRequired,
  caption: PropTypes.string,
  isSticky: PropTypes.bool,
};

Table.defaultProps = {
  caption: '',
  isSticky: false,
};

export default Table;
