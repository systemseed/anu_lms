import React from 'react'
import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'

const StyledButton = withStyles(theme => ({
  root: {
    fontSize: '1em',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    textTransform: 'none',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.25em',
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
    }
  }
}))(Button)

const LessonNavigationButton = ({...props}) => (
  <StyledButton
    variant="contained"
    color="primary"
    fullWidth
    size="large"
    {...props}
  />
)

export default LessonNavigationButton
