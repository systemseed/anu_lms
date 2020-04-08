import {
  getArrayValue,
  getBooleanValue,
  getImage,
  getNodePath,
  getNumberValue,
  getObjectValue,
  getTextValue
} from './transforms.field';

export const getCurrentNode = () => {
  if (!(drupalSettings && drupalSettings.node)) {
    return null;
  }
  const { node } = drupalSettings;

  return getNode(node);
};

export const getNode = (node) => {
  const bundle = getTextValue(node, 'entity_bundle');
  if (bundle === 'module_lesson') {
    return getLesson(node);
  }
  else if (bundle === 'module_assessment') {
    return getAssessment(node);
  }
  else if (bundle === 'module') {
    return getModule(node);
  }
  else if (bundle === 'course') {
    return getCourse(node);
  }

  return node;
};

export const isCourseListPage = () => (
  drupalSettings && typeof drupalSettings.anu_courses !== 'undefined'
);

export const getCourseList = () => {
  const { anu_courses } = drupalSettings;
  if (!anu_courses || !Array.isArray(anu_courses)) {
    return [];
  }

  return anu_courses.map(course => getCourse(course));
};

const getGeneralNodeFields = node => {
  const isPublished = getBooleanValue(node, 'status');

  return {
    id: getNumberValue(node, 'nid'),
    type: getTextValue(node, 'entity_bundle'),
    title: getTextValue(node, 'title') + (isPublished ? '' : ' [unpublished]'),
    path: getNodePath(node),
    isPublished,
  }
}

const getLesson = node => {
  const generalNodeFields = getGeneralNodeFields(node);
  if (!generalNodeFields.id) {
    return null;
  }

  return {
    ...generalNodeFields,
    ...getLessonFields(node)
  }
}

const getAssessment = node => {
  const generalNodeFields = getGeneralNodeFields(node);
  if (!generalNodeFields.id) {
    return null;
  }

  return {
    ...generalNodeFields,
    ...getAssessmentFields(node)
  }
}

const getModule = node => {
  const generalNodeFields = getGeneralNodeFields(node);
  if (!generalNodeFields.id) {
    return null;
  }

  return {
    ...generalNodeFields,
    ...getModuleFields(node)
  }
}

const getCourse = node => {
  const generalNodeFields = getGeneralNodeFields(node);
  if (!generalNodeFields.id) {
    return null;
  }

  return {
    ...generalNodeFields,
    ...getCourseFields(node)
  }
}

const getLessonFields = node => ({
  module: getLessonModule(node, 'field_module_lesson_module'),
  sections: getArrayValue(node, 'field_module_lesson_content')
    .map(section => {
      const paragraphs = getArrayValue(section, 'field_lesson_section_content').filter(Boolean)
      return getLessonParagraphs(paragraphs)
    })
    .filter(Boolean),
});

const getAssessmentFields = node => ({
  module: getLessonModule(node, 'field_module_assessment_module'),
  items: getLessonParagraphs(getArrayValue(node, 'field_module_assessment_items')).filter(Boolean),
});

const getModuleFields = node => ({
  description: getTextValue(node, 'field_module_description'),
  image: getImage(node, 'field_module_image', 'module_preview'),
  course: getCourse(getObjectValue(node, 'field_module_course')),
  // TODO: Lessons might be loading too deeply. For performance reasons we may want to limit it.
  lessons: getArrayValue(node, 'field_module_lessons').map(lesson => getLesson(lesson)).filter(Boolean),
  assessment: getAssessment(getObjectValue(node, 'field_module_assessment')),
});

const getCourseFields = node => ({
  description: getTextValue(node, 'field_course_description'),
  image: getImage(node, 'field_course_image', 'course_preview'),
  // TODO: Modules might be loading too deeply. For performance reasons we may want to limit it.
  modules: getArrayValue(node, 'field_course_modules').map(module => getModule(module)).filter(Boolean)
});

const getLessonModule = (node, field_name) => {
  const module = getObjectValue(node, field_name);
  if (!module) {
    return null;
  }

  return getModule(module);
};

// TODO: Refactor.
const getLessonParagraphs = paragraphs => {
  let dividerCounter = 1;
  let question = null;
  return paragraphs.map(paragraph => {

    const bundle = getTextValue(paragraph, 'entity_bundle');
    switch (bundle) {

      case 'lesson_heading':
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          children: getTextValue(paragraph, 'field_lesson_heading_value'),
          type: getTextValue(paragraph, 'field_lesson_heading_size'),
        }

      case 'lesson_text':
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          value: getTextValue(paragraph, 'field_lesson_text_content'),
        }

      case 'lesson_list':
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          type: getTextValue(paragraph, 'field_lesson_list_type'),
          items: getArrayValue(paragraph, 'field_lesson_list_items').map(item => item && item.value).filter(Boolean)
        }

      case 'lesson_image':
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          image: getImage(paragraph, 'field_lesson_image_image', 'image_with_caption'),
          caption: getTextValue(paragraph, 'field_lesson_image_caption'),
        }
      case 'lesson_image_wide':
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          image: getImage(paragraph, 'field_lesson_image_image', 'image_wide_with_caption'),
          caption: getTextValue(paragraph, 'field_lesson_image_caption'),
        }

      case 'lesson_image_thumbnail':
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          image: getImage(paragraph, 'field_lesson_image_image', 'image_thumbnail_with_caption'),
          caption: getTextValue(paragraph, 'field_lesson_image_caption_long'),
        }

      case 'lesson_highlight':
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          title: getTextValue(paragraph, 'field_lesson_highlight_heading'),
          text: getTextValue(paragraph, 'field_lesson_highlight_text'),
        }

      case 'lesson_divider':
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          type: getTextValue(paragraph, 'field_lesson_divider_type'),
          counter: getTextValue(paragraph, 'field_lesson_divider_type') === 'numeric' ? dividerCounter++ : 0,
        }

      case 'question_short_answer':
        question = getObjectValue(paragraph, 'field_question');
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          aqid: getTextValue(question, 'id'),
          question: getTextValue(question, 'name'),
          correctAnswer: getTextValue(question, 'field_correct_answer'),
        }

      case 'question_long_answer':
        question = getObjectValue(paragraph, 'field_question');
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          aqid: getTextValue(question, 'id'),
          question: getTextValue(question, 'name'),
          correctAnswer: getTextValue(question, 'field_correct_answer_long'),
        }

      case 'question_scale':
        question = getObjectValue(paragraph, 'field_question');
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          aqid: getTextValue(question, 'id'),
          question: getTextValue(question, 'name'),
          scale: getObjectValue(question, 'field_scale'),
          correctAnswer: getNumberValue(question, 'field_scale_correct'),
        }

      case 'question_multi_choice':
      case 'question_single_choice':
        question = getObjectValue(paragraph, 'field_question');
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          aqid: getTextValue(question, 'id'),
          question: getTextValue(question, 'name'),
          options: getArrayValue(question, 'field_options').map(option => ({
            id: getTextValue(option, 'id'),
            value: getTextValue(option, 'field_single_multi_choice_value'),
            isCorrect: getBooleanValue(option, 'field_single_multi_choice_right'),
          })).filter(Boolean),
        }

      default:
        return {
          bundle,
          id: getNumberValue(paragraph, 'id'),
          ...paragraph
        }
    }
  });
}
