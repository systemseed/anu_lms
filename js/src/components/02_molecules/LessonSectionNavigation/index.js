import React from 'react';
import { withRouter } from 'react-router';
import { Detector } from 'react-detect-offline';
import { withTranslation } from 'react-i18next';

import LessonNavigationButton from '../../01_atoms/LessonNavigationButton';
import LessonGrid from '../../01_atoms/LessonGrid';

class LessonSectionNavigation extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {
      t,
      lesson,
      assessment,
      nextLesson,
      currentIndex,
      history,
      isEnabled,
    } = this.props;

    return (
      <Detector
        render={({ online }) => {
          const disabled = !online ? false : !isEnabled;

          return (
            <LessonGrid>
              {typeof lesson.sections[currentIndex + 1] !== 'undefined' && (
                <LessonNavigationButton
                  disabled={disabled}
                  onClick={() => history.push({ pathname: `/section-${currentIndex + 2}` })}
                >
                  {disabled
                  ? t('You must complete all answers to proceed')
                  : t('Next')
                  }
                </LessonNavigationButton>
              )}

              {typeof lesson.sections[currentIndex + 1] === 'undefined'
              && nextLesson
              && (
                <LessonNavigationButton
                  disabled={disabled}
                  href={nextLesson.path}
                >
                  {disabled
                  ? t('You must complete all answers to proceed')
                  : t('Go to next lesson')
                  }
                </LessonNavigationButton>
              )}

              {typeof lesson.sections[currentIndex + 1] === 'undefined'
                && !nextLesson
                && assessment
                && (
                  <LessonNavigationButton
                    disabled={disabled}
                    href={assessment.path}
                  >
                    {disabled
                    ? t('You must complete all answers to proceed')
                    : t('Go to the module quiz')
                    }
                  </LessonNavigationButton>
                )
              }
            </LessonGrid>
          );
        }}
      />
    );
  }
}

export default withRouter(withTranslation()(LessonSectionNavigation));
