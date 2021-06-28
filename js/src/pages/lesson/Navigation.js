import React from 'react';
import LessonNavigationSection from '@anu/pages/lesson/NavigationSection';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';

const LessonNavigation = ({ course, lesson }) => {
  return course
    ? course.content.map((item) => (
        <LessonNavigationSection {...item} currentLesson={lesson} key={item.module} />
      ))
    : null;
};

LessonNavigation.propTypes = {
  course: coursePropTypes,
  lesson: lessonPropTypes.isRequired,
};

LessonNavigation.defaultProps = {
  course: null,
};

export default LessonNavigation;
