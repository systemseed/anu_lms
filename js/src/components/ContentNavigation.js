import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Detector } from 'react-detect-offline';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LessonGrid from '@anu/components/LessonGrid';
import ButtonWrapper from '@anu/components/ButtonWrapper';
import { Tooltip } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';

const ContentNavigation = ({
  isIntro,
  sections,
  currentLesson,
  nextLesson,
  prevLesson,
  currentIndex,
  isEnabled,
  ignorePaddings,
  hideButtonsLabelsOnMobile,
}) => {
  const history = useHistory();
  const completeAnswer = Drupal.t('Complete all answers to proceed', {}, { context: 'ANU LMS' });
  const nextIsQuiz = nextLesson && Boolean(nextLesson.questions);
  const nextIsLesson = nextLesson && Boolean(nextLesson.sections);
  const noNextLesson = !sections[currentIndex + 1];
  const noPrevLesson = !sections[currentIndex - 1];

  const updateProgressAndRedirect = async () => {
    // Marks lesson as completed if linear progress is enabled for its course.
    await currentLesson.complete();
    // Redirect to the next page.
    if (noNextLesson && !nextIsLesson && !nextIsQuiz) {
      window.location.href = currentLesson.finishButtonUrl;
      return;
    }
    window.location.href = nextLesson.url;
  };

  const isFirstSection = !currentIndex;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Detector
      polling={false}
      render={({ online }) => {
        const disabled = !online ? false : !isEnabled;
        const buttonProps = {
          variant: 'contained',
          color: 'primary',
          size: 'large',
          endIcon: <ChevronRightIcon />,
          disabled,
        };

        const renderButtonLabel = (label) => {
          if (hideButtonsLabelsOnMobile) {
            return <Hidden smDown>{Drupal.t(label, {}, { context: 'ANU LMS' })}</Hidden>;
          }

          return Drupal.t(label, {}, { context: 'ANU LMS' });
        };

        return (
          <LessonGrid ignorePaddings={ignorePaddings}>
            <ButtonWrapper>
              {prevLesson && noPrevLesson && !isFirstSection && (
                <Tooltip title={completeAnswer} arrow>
                  <span>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      startIcon={<ChevronLeftIcon />}
                      href={prevLesson.url}
                    >
                      {renderButtonLabel('Previous')}
                    </Button>
                  </span>
                </Tooltip>
              )}

              {!noPrevLesson && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<ChevronLeftIcon />}
                  onClick={() => history.push({ pathname: `/section-${currentIndex}` })}
                >
                  {renderButtonLabel('Previous')}
                </Button>
              )}

              {isFirstSection && prevLesson && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<ChevronLeftIcon />}
                  href={`${prevLesson.url}#back`}
                >
                  {renderButtonLabel('Previous')}
                </Button>
              )}

              {sections[currentIndex + 1] && (
                <Tooltip title={disabled ? completeAnswer : ''} arrow>
                  <span>
                    <Button
                      {...buttonProps}
                      onClick={() => history.push({ pathname: `/section-${currentIndex + 2}` })}
                      data-test="anu-lms-navigation-next"
                    >
                      {renderButtonLabel('Next')}
                    </Button>
                  </span>
                </Tooltip>
              )}

              {noNextLesson && nextIsLesson && (
                <Tooltip title={disabled ? completeAnswer : ''} arrow>
                  <span>
                    <Button
                      {...buttonProps}
                      onClick={updateProgressAndRedirect}
                      data-test="anu-lms-navigation-next"
                    >
                      {renderButtonLabel('Next')}
                    </Button>
                  </span>
                </Tooltip>
              )}

              {noNextLesson && !nextIsLesson && !nextIsQuiz && (
                <Tooltip title={disabled ? completeAnswer : ''} arrow>
                  <span>
                    <Button
                      {...buttonProps}
                      onClick={updateProgressAndRedirect}
                      data-test="anu-lms-navigation-finish"
                    >
                      {renderButtonLabel('Finish')}
                    </Button>
                  </span>
                </Tooltip>
              )}

              {noNextLesson && nextIsLesson && isIntro && (
                <Button
                  {...buttonProps}
                  onClick={updateProgressAndRedirect}
                  data-test="anu-lms-navigation-start"
                >
                  {renderButtonLabel('Start')}
                </Button>
              )}

              {noNextLesson && nextIsQuiz && (
                <Tooltip title={disabled ? completeAnswer : ''} arrow>
                  <span>
                    <Button {...buttonProps} onClick={updateProgressAndRedirect}>
                      {renderButtonLabel('Next')}
                    </Button>
                  </span>
                </Tooltip>
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
  ignorePaddings: PropTypes.bool,
  hideButtonsLabelsOnMobile: PropTypes.bool,
};

export default ContentNavigation;
