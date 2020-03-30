import React from 'react';
import { withRouter } from 'react-router';
import Grid from '@material-ui/core/Grid'
import LessonNavigationButton from '../../01_atoms/LessonNavigationButton'
import LessonGrid from '../../01_atoms/LessonGrid'

class LessonSectionNavigation extends React.Component {
  componentDidMount () {
    window.scrollTo(0, 0);
  }

  render() {
    const {
      lesson,
      assessment,
      nextLesson,
      currentIndex,
      history,
      isEnabled
    } = this.props;

    return (
      <LessonGrid>
        {typeof lesson.sections[currentIndex + 1] !== 'undefined' &&
          <LessonNavigationButton
            disabled={!isEnabled}
            onClick={
              () => history.push({pathname: `/section-${currentIndex + 2}`})
            }
          >
            {!isEnabled
            ? 'You must complete all answers to proceed'
            : 'Next'
            }
          </LessonNavigationButton>
        }

        {typeof lesson.sections[currentIndex + 1] === 'undefined'
        && nextLesson
        && (
          <LessonNavigationButton
            disabled={!isEnabled}
            href={nextLesson.path}
          >
            {!isEnabled
            ? 'You must complete all answers to proceed'
            : 'Go to next lesson'
            }
          </LessonNavigationButton>
        )}

        {typeof lesson.sections[currentIndex + 1] === 'undefined'
        && !nextLesson
        && assessment
        && (
          <LessonNavigationButton
            disabled={!isEnabled}
            href={assessment.path}
          >
            {!isEnabled
            ? 'You must complete all answers to proceed'
            : 'Go to the module quiz'
            }
          </LessonNavigationButton>
        )}
      </LessonGrid>
    )
  }
}

export default withRouter(LessonSectionNavigation);
