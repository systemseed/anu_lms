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
    const { lesson, nextLesson, currentIndex, history } = this.props;
    return (
      <LessonGrid>

        {typeof lesson.sections[currentIndex + 1] !== 'undefined' &&
        <LessonNavigationButton
          onClick={() => history.push({pathname: `/section-${currentIndex + 2}`})}>
          Next
        </LessonNavigationButton>
        }

        {typeof lesson.sections[currentIndex + 1] === 'undefined' && nextLesson &&
        <LessonNavigationButton href={nextLesson.path}>
          Next lesson: {nextLesson.title}
        </LessonNavigationButton>
        }

      </LessonGrid>
    )
  }
}

export default withRouter(LessonSectionNavigation);
