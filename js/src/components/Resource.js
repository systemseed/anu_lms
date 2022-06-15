import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';

import LessonGrid from '@anu/components/LessonGrid';

const Resource = ({ file, name, description }) => {
  const theme = useTheme();

  return (
    <LessonGrid>
      <Paper
        elevation={0}
        variant="outlined"
        style={{
          padding: theme.spacing(2),
          paddingBottom: theme.spacing(1),
        }}
      >
        <Box display="flex">
          <DescriptionOutlinedIcon style={{ color: theme.palette.primary.main, fontSize: 34 }} />

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
                  backgroundColor: theme.palette.grey[200],
                  color: theme.palette.text.primary,
                  borderRadius: 4,
                }}
              >
                <Typography variant="body2" component="span">
                  {`${file ? `.${file.ext}` : Drupal.t('ERROR', {}, { context: 'ANU LMS' })}`}
                </Typography>
              </Box>
            </Box>

            {description && (
              <Typography
                variant="body2"
                style={{
                  marginTop: theme.spacing(1),
                  color: theme.palette.grey[300],
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
                  {Drupal.t('Download', {}, { context: 'ANU LMS' })}
                </Button>
              ) : (
                Drupal.t('File cannot be downloaded.', {}, { context: 'ANU LMS' })
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </LessonGrid>
  );
};

Resource.propTypes = {
  file: PropTypes.shape({
    path: PropTypes.string,
    type: PropTypes.string,
    ext: PropTypes.string,
  }).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Resource;
