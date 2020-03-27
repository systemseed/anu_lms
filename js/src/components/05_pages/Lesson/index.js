import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Heading from '../../01_atoms/Heading';
import LessonGrid from '../../01_atoms/LessonGrid';
import LessonNavigationButton from '../../01_atoms/LessonNavigationButton';
import LessonSectionNavigation from '../../02_molecules/LessonSectionNavigation';
import Paragraphs from '../../03_organisms/Paragraphs';
import LessonPageTemplate from '../../04_templates/LessonPageTemplate';

class Lesson extends React.Component {
  constructor(props) {
    super(props);

    const { module, sections } = props.node;
    const lessonIndex = module.lessons.findIndex(lesson => lesson.id === props.node.id);

    this.nextLesson = null;

    this.state = {
      // TODO - use drupalSettings.anu_settings
      enableNext: sections.map(paragraphs => {
        if (paragraphs.some(paragraph => paragraph.bundle.startsWith('question_'))) {
          return false;
        }
        return true;
      }),
    };

    if (lessonIndex >= 0 && typeof module.lessons[lessonIndex + 1] !== 'undefined') {
      this.nextLesson = module.lessons[lessonIndex + 1];
    }
  }

  handleChangeValidation(result, index) {
   this.setState(prevState => ({
     ...prevState,
     enableNext: {
       ...prevState.enableNext,
       [index]: result,
     }
   }));
  }

  render() {
    const { node, settings } = this.props;
    const { enableNext } = this.state;
    const assessment = node.module && node.module.assessment && node.module.assessment.id > 0
      ? node.module.assessment
      : null;

    return (
      <LessonPageTemplate module={node.module}>
        <Heading type="h1">{node.title}</Heading>

        <HashRouter hashType="noslash">
          <Switch>
            <Redirect exact from="/" to="/section-1"/>

            {node.sections.map((paragraphs, index) =>
              <Route path={`/section-${index + 1}`} key={index} exact>
                {/* Render all page paragraphs */}
                <Paragraphs
                  items={paragraphs}
                  onChange={result => this.handleChangeValidation(result, index)}
                />

              {/* Render "Next ..." buttons at the end of the page */}
                <LessonSectionNavigation
                  lesson={node}
                  nextLesson={this.nextLesson}
                  currentIndex={index}
                  assessment={assessment}
                  isEnabled={enableNext[index]}
                />
              </Route>
            )}
          </Switch>
        </HashRouter>

        {/*
        // TODO - why?
        {node.sections.length === 1 && node.sections.map((paragraphs, index) =>
          <React.Fragment key={index} >

            {/* Render all page paragraphs }
            <Paragraphs items={paragraphs} />

            {/* Render NEXT button at the end of the page }
            {this.nextLesson &&
            <LessonGrid>
              <LessonNavigationButton href={this.nextLesson.path}>
                Next lesson: {this.nextLesson.title}
              </LessonNavigationButton>
            </LessonGrid>
            }

            {/* Button that takes to the assessment }
            {!this.nextLesson && node.module && node.module.assessment.id > 0 &&
            <LessonGrid>
              <LessonNavigationButton href={node.module.assessment.path}>
                Go to the module quiz
              </LessonNavigationButton>
            </LessonGrid>
            }
          </React.Fragment>
        )}
        */}
      </LessonPageTemplate>
    )
  }
}

export default Lesson;
