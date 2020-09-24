import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { withTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

import LessonGrid from '../../06_hocs/LessonGrid';

const Resource = ({ theme, t, file, name, description, ...props }) => (
  <LessonGrid>
    <Paper
     elevation={0}
     variant="outlined"
     style={{
       padding: theme.spacing(2),
       marginBottom: theme.spacing(3),
       width: 480,
     }}
    >
      <Box display="flex">
        <DescriptionOutlinedIcon style={{ color: '#0288d1', fontSize: 34 }} />

        <Box ml={2} mt={0.5}>
          <Box display="flex">
            <Typography variant="h4">
              {name}
            </Typography>

            <Box
              style={{
                backgroundColor: '#eceff1',
                color: theme.palette.text.primary,
                borderRadius: 4,
                padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
              }}
            >
              <Typography variant="body2">
                {`${file ? `.${file.type}` : 'ERROR'}`}
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

          <Box
            display="flex"
            mt={2}
          >
            <Button
              className="secondary"
              startIcon={<GetAppIcon />}
              href={file ? file.path : '#'}
            >
              {t('Download')}
            </Button>

            {file && file.type === 'pdf' && (
              <Button
                className="secondary"
                startIcon={<ZoomInIcon />}
                style={{ marginLeft: theme.spacing(3) }}
                onClick={() => {/* TODO */}}
              >
                {t('Preview')}
              </Button>
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
    type: PropTypes.oneOf([
      'txt',
      'pdf',
      'odt',
      'ods',
      'doc',
      'docx',
      'ppt',
      'pptx',
      'csv',
      'odp',
      'xls',
      'xlsx',
    ]),
  }).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  // Inherited from withTheme HOC
  theme: PropTypes.shape().isRequired,
  // Inherited from withTranslation HOC
  t: PropTypes.shape().isRequired,
};

export default withTranslation()(withTheme(Resource));
