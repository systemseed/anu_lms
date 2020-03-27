import React from 'react';
import Heading from '../../01_atoms/Heading';
import ParagraphsWithAssessments from '../../02_molecules/ParagraphsWithAssessment';
import LessonPageTemplate from '../../04_templates/LessonPageTemplate';

class Assessment extends React.Component {

  render() {
    const { node } = this.props;
    return (
      <LessonPageTemplate module={node.module}>
        <Heading type="h1">{node.title}</Heading>
        <ParagraphsWithAssessments items={node.items} node={node} />
      </LessonPageTemplate>
    );
  }
}

export default Assessment;
