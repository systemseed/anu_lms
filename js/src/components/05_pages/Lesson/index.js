import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Heading from '../../01_atoms/Heading';
import LessonGrid from '../../01_atoms/LessonGrid';
import LessonNavigationButton from '../../01_atoms/LessonNavigationButton';
import Paragraphs from '../../02_moleculas/Paragraphs';
import LessonSectionNavigation from '../../02_moleculas/LessonSectionNavigation';
import LessonPageTemplate from '../../04_templates/LessonPageTemplate'

class Lesson extends React.Component {

  constructor (props) {
    super(props);

    const { module } = props.node;

    this.nextLesson = null;
    const lessonIndex = module.lessons.findIndex(lesson => lesson.id === props.node.id);
    if (lessonIndex >= 0 && typeof module.lessons[lessonIndex + 1] !== 'undefined') {
      this.nextLesson = module.lessons[lessonIndex + 1];
    }
  }

  render() {
    const { node } = this.props;

    return (
      <LessonPageTemplate module={node.module}>

          <Heading type="h1">{node.title}</Heading>

          {node.sections.length > 1 &&
          <HashRouter hashType="noslash">
            <Switch>
              <Redirect exact from="/" to="/section-1"/>
              {node.sections.map((paragraphs, index) =>
                <Route path={`/section-${index + 1}`} key={index} exact>

                  {/* Render all page paragraphs */}
                  <Paragraphs items={paragraphs} />

                  {/* Render NEXT buttons at the end of the page */}
                  <LessonSectionNavigation lesson={node} nextLesson={this.nextLesson} currentIndex={index} />

                </Route>
              )}
            </Switch>
          </HashRouter>
          }

          {node.sections.length === 1 && node.sections.map((paragraphs, index) =>
            <React.Fragment key={index} >

              {/* Render all page paragraphs */}
              <Paragraphs items={paragraphs} />

              {/* Render NEXT button at the end of the page */}
              {this.nextLesson &&
              <LessonGrid>
                <LessonNavigationButton href={this.nextLesson.path}>
                  Next lesson: {this.nextLesson.title}
                </LessonNavigationButton>
              </LessonGrid>
              }

              {/* Button that takes to the assessment */}
              {!this.nextLesson && node.module && node.module.assessment.id > 0 &&
              <LessonGrid>
                <LessonNavigationButton href={node.module.assessment.path}>
                  Go to the module assessment
                </LessonNavigationButton>
              </LessonGrid>
              }
            </React.Fragment>
          )}

      </LessonPageTemplate>
    )
  }
}

export default Lesson;
