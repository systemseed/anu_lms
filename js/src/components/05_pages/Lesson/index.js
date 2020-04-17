import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Heading from '../../01_atoms/Heading';
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
      // TODO - use drupalSettings.anu_settings once available on the BE
      enableNext: sections.map(paragraphs => {
        if (paragraphs.some(paragraph => (
          paragraph.bundle === 'question_multi_choice' ||
          paragraph.bundle === 'question_single_choice'
        ))) {
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
    const { node } = this.props;
    const { enableNext } = this.state;
    const assessment = node.module && node.module.assessment && node.module.assessment.id > 0
      ? node.module.assessment
      : null;

    return (
      <LessonPageTemplate module={node.module}>
        <Heading type="h1">{node.title}</Heading>

        <HashRouter hashType="noslash">
          <Switch>
            {/* TODO - unclean for sections.length === 1 */}
            <Redirect exact from="/" to="/section-1" />

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
      </LessonPageTemplate>
    )
  }
}

export default Lesson;
