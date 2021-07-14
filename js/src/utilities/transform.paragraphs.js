import {
  getObjectValue,
  getArrayValue,
  getTextValue,
  getNumberValue,
  getImage,
  getBooleanValue,
  getLinkURL,
  getFileURL,
} from '@anu/utilities/fields';

const transformParagraph = (paragraph) => {
  let question = null;
  const bundle = getTextValue(paragraph, 'entity_bundle');

  switch (bundle) {
    case 'lesson_checklist':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        items: getArrayValue(paragraph, 'field_checklist_items').map((item) => ({
          id: getNumberValue(item, 'id'),
          option: getTextValue(item, 'field_checkbox_option'),
          description: getTextValue(item, 'field_lesson_text_content'),
        })),
      };

    // TODO: Rework - numeric divider counter must consider section separation
    // per lesson.
    case 'lesson_divider':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        type: getTextValue(paragraph, 'field_lesson_divider_type'),
        counter: getTextValue(paragraph, 'field_lesson_divider_type') === 'numeric' ? 1 : 0,
      };

    case 'lesson_embedded_video':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        url: getLinkURL(paragraph, 'field_lesson_embedded_video_url'),
      };

    case 'lesson_heading':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        value: getTextValue(paragraph, 'field_lesson_heading_value'),
        type: getTextValue(paragraph, 'field_lesson_heading_size'),
      };

    case 'lesson_highlight':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        title: getTextValue(paragraph, 'field_lesson_highlight_heading'),
        text: getTextValue(paragraph, 'field_lesson_highlight_text'),
      };

    case 'lesson_image':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        image: getImage(paragraph, 'field_lesson_image_image', 'image_with_caption'),
        caption: getTextValue(paragraph, 'field_lesson_image_caption'),
      };

    // TODO: For removing, replaced by 'lesson_img_list'.
    case 'lesson_image_bullet_list':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        title: getTextValue(paragraph, 'field_content_heading'),
        isHighlight: getBooleanValue(paragraph, 'field_is_highlight'),
        items: getArrayValue(paragraph, 'field_items').map((item) => {
          let size = getTextValue(item, 'field_size');

          if (size) {
            size = size === 'small' ? 20 : 50;
          } else {
            size = 0;
          }

          return {
            id: getNumberValue(item, 'id'),
            image: getImage(
              item,
              'field_content_image',
              size === 20 ? 'image_bullet_list_small' : 'image_bullet_list_large'
            ),
            size,
            text: getTextValue(item, 'field_content_text'),
          };
        }),
      };

    case 'lesson_img_list':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        title: getTextValue(paragraph, 'field_lesson_img_list_heading'),
        isHighlight: getBooleanValue(paragraph, 'field_lesson_img_list_highlight'),
        items: getArrayValue(paragraph, 'field_lesson_img_list_items').map((item) => {
          let size = getTextValue(item, 'field_lesson_img_list_item_size');

          if (size) {
            size = size === 'small' ? 20 : 50;
          } else {
            size = 0;
          }

          return {
            id: getNumberValue(item, 'id'),
            image: getImage(
              item,
              'field_lesson_img_list_item_image',
              size === 20 ? 'image_bullet_list_small' : 'image_bullet_list_large'
            ),
            size,
            text: getTextValue(item, 'field_lesson_img_list_item_text'),
          };
        }),
      };

    case 'lesson_image_thumbnail':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        image: getImage(paragraph, 'field_lesson_image_image', 'image_thumbnail_with_caption'),
        caption: getTextValue(paragraph, 'field_lesson_image_caption_long'),
      };

    case 'lesson_image_wide':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        image: getImage(paragraph, 'field_lesson_image_image', 'image_wide_with_caption'),
        caption: getTextValue(paragraph, 'field_lesson_image_caption'),
      };

    case 'lesson_list':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        type: getTextValue(paragraph, 'field_lesson_list_type'),
        items: getArrayValue(paragraph, 'field_lesson_list_items')
          .map((item) => item && item.value)
          .filter(Boolean),
      };

    case 'lesson_resource': {
      const file = getObjectValue(paragraph, 'field_resource_file');

      // Media entity may have one of the two file field names depending
      // on the Drupal installation profile (yeah, surprise).
      let fieldName = 'field_media_document';
      if (!getObjectValue(file, fieldName)) {
        fieldName = 'field_media_file';
      }
      const media = getObjectValue(file, fieldName);
      const fileName = getTextValue(media, 'filename').split('.');

      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        file: {
          path: getFileURL(file, fieldName),
          type: getTextValue(media, 'filemime'),
          ext: fileName[fileName.length - 1],
        },
        name: getTextValue(paragraph, 'field_resource_name'),
        description: getTextValue(paragraph, 'field_resource_description'),
      };
    }

    case 'lesson_text':
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        value: getTextValue(paragraph, 'field_lesson_text_content'),
      };

    case 'question_short_answer':
      question = getObjectValue(paragraph, 'field_question');
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        aqid: getNumberValue(question, 'id'),
        question: getTextValue(question, 'name'),
        correctAnswer: getTextValue(question, 'field_correct_answer'),
      };

    case 'question_long_answer':
      question = getObjectValue(paragraph, 'field_question');
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        aqid: getNumberValue(question, 'id'),
        question: getTextValue(question, 'name'),
        correctAnswer: getTextValue(question, 'field_correct_answer_long'),
      };

    case 'question_scale':
      question = getObjectValue(paragraph, 'field_question');
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        aqid: getNumberValue(question, 'id'),
        question: getTextValue(question, 'name'),
        scale: getObjectValue(question, 'field_scale'),
        correctAnswer: getNumberValue(question, 'field_scale_correct'),
      };

    case 'question_multi_choice':
    case 'question_single_choice':
      question = getObjectValue(paragraph, 'field_question');

      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        aqid: getNumberValue(question, 'id'),
        question: getTextValue(question, 'name'),
        options: getArrayValue(question, 'field_options')
          .map((option) => ({
            id: getTextValue(option, 'id'),
            value: getTextValue(option, 'field_single_multi_choice_value'),
            isCorrect: getBooleanValue(option, 'field_single_multi_choice_right'),
          }))
          .filter(Boolean),
      };

    default:
      return {
        bundle,
        id: getNumberValue(paragraph, 'id'),
        ...paragraph,
      };
  }
};

export { transformParagraph };
