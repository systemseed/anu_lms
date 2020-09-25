import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { withTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';

import LessonGrid from '../../06_hocs/LessonGrid';

const Resource = ({ theme, t, file, name, description }) => (
  <LessonGrid>
    <Paper
      elevation={0}
      variant="outlined"
      style={{
        padding: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        marginBottom: theme.spacing(3),
        width: 480,
      }}
    >
      <Box display="flex">
        <DescriptionOutlinedIcon style={{ color: '#0288d1', fontSize: 34 }} />

        <Box ml={2} mt={0.5}>
          <Box display="flex">
            <Typography variant="body1" style={{ fontWeight: 700 }}>
              {name}
            </Typography>

            <Box
              ml={1}
              px={1}
              py={0.5}
              style={{
                backgroundColor: '#eceff1',
                color: theme.palette.text.primary,
                borderRadius: 4,
              }}
            >
              <Typography variant="body2" component="span">
                {`${file ? `.${file.ext}` : 'ERROR'}`}
              </Typography>
            </Box>
          </Box>

          {description && (
            <Typography
              variant="body2"
              style={{
                marginTop: theme.spacing(1),
                color: '#78909c',
              }}
            >
              {description}
            </Typography>
          )}

          <Box display="flex" mt={2}>
            {file && file.path ? (
              <Button
                className="secondary"
                startIcon={<GetAppIcon />}
                onClick={() => window.open(file.path)}
              >
                {t('Download')}
              </Button>
            ) : (
              t('File cannot be downloaded.')
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  </LessonGrid>
);

Resource.propTypes = {
  file: PropTypes.shape({
    path: PropTypes.string,
    type: PropTypes.string,
    ext: PropTypes.string,
  }).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  // Inherited from withTheme HOC
  theme: PropTypes.shape().isRequired,
  // Inherited from withTranslation HOC
  t: PropTypes.func.isRequired,
};

export default withTranslation()(withTheme(Resource));
