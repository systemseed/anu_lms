import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// We need to import regeneratorRuntime, otherwise async abstraction on top of generator
// functions won't work. This is a simpler (but less elegant) solution compared to installing
// Babel core and transform-runtime plugins.
/* eslint-disable-next-line no-unused-vars */
import regeneratorRuntime from 'regenerator-runtime';

import { withStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';

import LessonGrid from '@anu/components/LessonGrid';
import { debounce, hex2rgba } from '@anu/utilities/helpers';

import { transformChecklistResults } from '@anu/utilities/transform.lesson';

const CheckList = ({ id: checkListID, items, checkListState }) => {
  const [isChecked, setChecked] = useState({});
  const [isHovering, setHovering] = useState({});
  const [firstLoad, setFirstLoad] = useState(true);
  const {
    isLoading: [isChecklistLoading, setChecklistLoading],
    label: [checklistLabel, setChecklistLabel],
  } = checkListState;
  const theme = useTheme();

  const savingText = Drupal.t('Saving ...', {}, { context: 'ANU LMS' });
  const checkListAPIURL = `${window.location.origin}/anu_lms/lesson/checklist?_format=json`;

  const CheckListBox = withStyles({
    root: {
      cursor: 'pointer',
      marginBottom: theme.spacing(1.5),
      padding: theme.spacing(1.5),
      borderStyle: 'solid',
      borderRadius: 4,
      borderWidth: 2,
      '& p': {
        margin: 0,
      },
    },
  })(Box);

  const setEnabled = () => {
    setChecklistLoading(false);
    setChecklistLabel(Drupal.t('Saved', {}, { context: 'ANU LMS' }));
  };

  const handleCheck = (id) => () => {
    setChecked({ ...isChecked, [id]: !isChecked[id] });
    setFirstLoad(false);
  };

  const handleHover = (id, type = false) => () => {
    // To avoid skipping elements and de-hovering them with fast mouse movements, makes sure to
    // only every have one active at any time.
    if (type) {
      setHovering({ [id]: type });
    } else {
      setHovering({ ...isHovering, [id]: type });
    }
  };

  const handleSave = useCallback(
    debounce(() => {
      setChecklistLoading(true);
      setChecklistLabel(savingText);
    }, 700),
    []
  );

  useEffect(() => {
    // Set up a GET for this user's relevant checklist selections.
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `${checkListAPIURL}&checklist_paragraph_id=${checkListID}`);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        // If there is no prior entry for this checklist, then instead of returning an object,
        // it returns an empty array.
        const selectedOptions = transformChecklistResults(Array.isArray(result) ? {} : result);

        setChecked(selectedOptions.reduce((acc, option) => ({ ...acc, [option.id]: true }), {}));
      } else {
        // TODO - see #178198250
        console.error(xhr);
      }

      setEnabled();
    };

    xhr.onerror = () => {
      setEnabled();

      // TODO - see #178198250
      console.error(xhr);
    };
  }, []);

  useEffect(() => {
    if (firstLoad) {
      return;
    }

    handleSave();
  }, [isChecked]);

  useEffect(async () => {
    if (firstLoad || checklistLabel !== savingText) {
      return;
    }

    setChecklistLoading(true);
    setChecklistLabel('Saving ...');

    // Prefer async Fetch API here due to easier handling of promises across inter-dependent
    // requests.
    const token = await fetch(`${window.location.origin}/session/token`);
    const response = await fetch(checkListAPIURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': await token.text(),
      },
      body: JSON.stringify({
        checklist_paragraph_id: checkListID,
        selected_option_ids: [...Object.keys(isChecked).filter((optionId) => isChecked[optionId])],
      }),
    });

    // TODO - see #178198250
    if (!response.ok) {
      console.error(response.status, await response.json());
    }

    setEnabled();
  }, [checklistLabel]);

  return (
    <LessonGrid>
      <Box position="relative">
        {isChecklistLoading && (
          <CircularProgress
            size={60}
            style={{
              position: 'absolute',
              top: 'calc(50% - 30px)',
              left: 0,
              right: 0,
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'center',
            }}
          />
        )}

        {items.map(({ id, option, description }) => (
          <CheckListBox
            key={id}
            onMouseEnter={handleHover(id, true)}
            onMouseLeave={handleHover(id)}
            onClick={handleCheck(id)}
            style={{
              borderColor: (() => {
                if (isChecked[id]) {
                  return theme.palette.primary.main;
                }

                if (isHovering[id]) {
                  return theme.palette.grey[300];
                }

                return 'transparent';
              })(),
              backgroundColor: (() => {
                if (isChecked[id]) {
                  if (isHovering[id]) {
                    return hex2rgba(theme.palette.primary.main, 0.08);
                  }

                  return hex2rgba(theme.palette.primary.main, 0.02);
                }

                return 'transparent';
              })(),
              opacity: isChecklistLoading ? 0.65 : 1,
              filter: isChecklistLoading ? 'saturate(0%)' : 'none',
              pointerEvents: isChecklistLoading ? 'none' : 'auto',
            }}
          >
            <Box display="flex" style={{ marginLeft: -theme.spacing(1.5) }}>
              <Checkbox
                checked={isChecked[id]}
                color="primary"
                style={{ marginRight: theme.spacing(1), height: 'max-content' }}
              />

              <Box style={{ marginTop: theme.spacing(0.5) }}>
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{ __html: option }}
                  style={{ marginBottom: theme.spacing(0.5) }}
                />

                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: description }} />
              </Box>

              <Box display="flex" flexGrow={1} justifyContent="flex-end" minWidth={24}>
                {isChecked[id] && <CheckIcon color="primary" />}
              </Box>
            </Box>
          </CheckListBox>
        ))}
      </Box>
    </LessonGrid>
  );
};

CheckList.propTypes = {
  id: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      option: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  checkListState: PropTypes.shape({
    isLoading: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.bool, PropTypes.func])),
    label: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
  }).isRequired,
};

export default CheckList;
