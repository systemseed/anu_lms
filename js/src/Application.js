import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Header from './components/03_organisms/Header';
import Lesson from './components/05_pages/Lesson';
import Module from './components/05_pages/Module';
import { getCourseList, getCurrentNode, isCourseListPage, getSettings } from './utils/node'
import { persistor, store } from './redux/store';
import Course from './components/05_pages/Course';
import Assessment from './components/05_pages/Assessment';
import CourseList from './components/05_pages/CourseList'

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
          <Header />
          {/* TODO: Refactor */}
          {this.node &&
          <>
            {this.node.type === 'module_lesson' && <Lesson node={this.node}/>}
            {this.node.type === 'module_assessment' && <Assessment node={this.node}/>}
            {this.node.type === 'module' && <Module node={this.node}/>}
            {this.node.type === 'course' && <Course node={this.node}/>}
          </>
          }
          {isCourseListPage() && this.courses &&
            <CourseList nodes={this.courses} settings={this.settings} />
          }
        </PersistGate>
      </Provider>
    );
  }

}

export default Application;
