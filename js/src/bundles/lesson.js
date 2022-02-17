import React from 'react';
import ReactDOM from 'react-dom';

import Application from '@anu/Application';
import LessonPage from '@anu/pages/lesson/index';
import { transformLessonPage } from '@anu/utilities/transform.lesson';

document.addEventListener('DOMContentLoaded', () => {
  // Get courses page element and its content generated by Drupal.
  const element = document.getElementById('anu-application');
  const data = JSON.parse(element.dataset.application);

  ReactDOM.render(
    <Application>
      <LessonPage {...transformLessonPage(data)} />
    </Application>,
    element
  );
});
