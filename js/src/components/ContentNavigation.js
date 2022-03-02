import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Detector } from 'react-detect-offline';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LessonGrid from '@anu/components/LessonGrid';
import ButtonWrapper from '@anu/components/ButtonWrapper';

// TODO - isIntro
const ContentNavigation = ({
  isIntro,
  sections,
  currentLesson,
  nextLesson,
  prevLesson,
  currentIndex,
  isEnabled,
}) => {
  const history = useHistory();
  const completeAnswer = Drupal.t('Complete all answers to proceed', {}, { context: 'ANU LMS' });
  const nextIsQuiz = nextLesson && Boolean(nextLesson.questions);
  const nextIsLesson = nextLesson && Boolean(nextLesson.sections);
  const noNextLesson = !sections[currentIndex + 1];

  const finishButtonText = (currentLesson) =>
    !currentLesson.finishButtonText
      ? Drupal.t('Finish', {}, { context: 'ANU LMS' })
      : currentLesson.finishButtonText;

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
          size: 'large',
          endIcon: <ChevronRightIcon />,
          disabled,
        };

        return (
          <LessonGrid>
            <ButtonWrapper>
              {prevLesson && completeAnswer && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<ChevronLeftIcon />}
                  href={prevLesson.url}
                >
                  {Drupal.t('Back', {}, { context: 'ANU LMS' })}
                </Button>
              )}

              {sections[currentIndex - 1] && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<ChevronLeftIcon />}
                  onClick={() => history.push({ pathname: `/section-${currentIndex - 1}` })}
                >
                  {Drupal.t('Back', {}, { context: 'ANU LMS' })}
                </Button>
              )}

              {sections[currentIndex + 1] && (
                <Button
                  {...buttonProps}
                  onClick={() => history.push({ pathname: `/section-${currentIndex + 2}` })}
                >
                  {disabled ? completeAnswer : Drupal.t('Next', {}, { context: 'ANU LMS' })}
                </Button>
              )}

              {noNextLesson && nextIsLesson && (
                <Button {...buttonProps} href={nextLesson.url}>
                  {disabled ? completeAnswer : Drupal.t('Next', {}, { context: 'ANU LMS' })}
                </Button>
              )}

              {noNextLesson && !nextIsLesson && !nextIsQuiz && (
                <Button {...buttonProps} href={`/node/${currentLesson.id}/finish`}>
                  {disabled ? completeAnswer : finishButtonText(currentLesson)}
                </Button>
              )}

              {noNextLesson && nextIsLesson && isIntro && (
                <Button {...buttonProps} href={nextLesson.url}>
                  {Drupal.t('Start', {}, { context: 'ANU LMS' })}
                </Button>
              )}

              {noNextLesson && nextIsQuiz && (
                <Button {...buttonProps} href={nextLesson.url}>
                  {disabled ? completeAnswer : Drupal.t('Go to quiz', {}, { context: 'ANU LMS' })}
                </Button>
              )}
            </ButtonWrapper>
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
  prevLesson: PropTypes.shape(),
  currentIndex: PropTypes.number,
  isEnabled: PropTypes.bool,
};

export default ContentNavigation;
