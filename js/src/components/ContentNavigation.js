import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Detector } from 'react-detect-offline';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import LessonGrid from '@anu/components/LessonGrid';

// TODO - isIntro
const ContentNavigation = ({ isIntro, sections, currentLesson, nextLesson, currentIndex, isEnabled }) => {
  const history = useHistory();
  const completeAnswer = Drupal.t('Complete all answers to proceed', {}, { context: 'ANU LMS' });
  const nextIsQuiz = nextLesson && Boolean(nextLesson.questions);
  const nextIsLesson = nextLesson && Boolean(nextLesson.sections);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Detector
      render={({ online }) => {
        const disabled = !online ? false : !isEnabled;
        const buttonProps = {
          variant: 'contained',
          color: 'primary',
          endIcon: <ChevronRightIcon />,
          disabled,
        };

        return (
          <LessonGrid>
            {typeof sections[currentIndex + 1] !== 'undefined' && (
              <Button
                {...buttonProps}
                onClick={() => history.push({ pathname: `/section-${currentIndex + 2}` })}
              >
                {disabled ? completeAnswer : Drupal.t('Next', {}, { context: 'ANU LMS' })}
              </Button>
            )}

            {typeof sections[currentIndex + 1] === 'undefined' && nextIsLesson && (
              <Button {...buttonProps} href={nextLesson.url}>
                {disabled ? completeAnswer : Drupal.t('Next', {}, { context: 'ANU LMS' })}
              </Button>
            )}

            {/* No next lesson */}
            {typeof sections[currentIndex + 1] === 'undefined' && !nextIsLesson && !nextIsQuiz && (
              <Button {...buttonProps} href={`/node/${currentLesson.id}/finish`}>
                {disabled ?
                  completeAnswer :
                  (
                    currentLesson.finishButtonText === '' ?
                    Drupal.t('Finish', {}, { context: 'ANU LMS' }) :
                    currentLesson.finishButtonText
                  )
                }
              </Button>
            )}

            {typeof sections[currentIndex + 1] === 'undefined' && nextIsLesson && isIntro && (
              <Button {...buttonProps} href={nextLesson.url}>
                {Drupal.t('Start', {}, { context: 'ANU LMS' })}
              </Button>
            )}

            {typeof sections[currentIndex + 1] === 'undefined' && nextIsQuiz && (
              <Button {...buttonProps} href={nextLesson.url}>
                {disabled ? completeAnswer : Drupal.t('Go to quiz', {}, { context: 'ANU LMS' })}
              </Button>
            )}
          </LessonGrid>
        );
      }}
    />
  );
};

ContentNavigation.propTypes = {
  isIntro: PropTypes.bool,
  sections: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())),
  currentLesson: PropTypes.shape(),
  nextLesson: PropTypes.shape(),
  currentIndex: PropTypes.number,
  isEnabled: PropTypes.bool,
};

export default ContentNavigation;
