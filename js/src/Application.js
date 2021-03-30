import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import Header from './components/03_organisms/Header';
import Lesson from './components/05_pages/Lesson';
import Module from './components/05_pages/Module';
import { getCourseList, getCurrentNode, isCourseListPage } from './utils/node';
import { getSettings } from './utils/settings';
import { persistor, store } from './redux/store';
import Course from './components/05_pages/Course';
import Assessment from './components/05_pages/Assessment';
import CourseList from './components/05_pages/CourseList';

class Application extends React.Component {
  constructor(props) {
    super(props);

    this.node = getCurrentNode();
    this.courses = getCourseList();
    this.settings = getSettings();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AlertProvider
            template={AlertTemplate}
            position={positions.TOP_RIGHT}
            timeout={10000}
            offset="30px"
            transition={transitions.FADE}
          >
            <Header settings={this.settings} />

            {this.node && (
              <>
                {this.node.type === 'module_lesson' && <Lesson node={this.node} />}
                {this.node.type === 'module_assessment' && <Assessment node={this.node} />}
                {this.node.type === 'module' && <Module node={this.node} />}
                {this.node.type === 'course' && <Course node={this.node} />}
              </>
            )}

            {isCourseListPage() && this.courses && (
              <CourseList nodes={this.courses} settings={this.settings} />
            )}
          </AlertProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default Application;
