import Checklist from '@anu/components/Checklist';
import Divider from '@anu/components/Divider';
import EmbeddedVideo from '@anu/components/EmbeddedVideo';
import Heading from '@anu/components/Heading';
import ImageBulletList from '@anu/components/ImageBulletList';
import ImageWideWithCaption from '@anu/components/ImageWideWithCaption';
import ImageWithCaption from '@anu/components/ImageWithCaption';
import ImageWithCaptionThumbnail from '@anu/components/ImageWithCaptionThumbnail';
import List from '@anu/components/List';
import QuizOptionsHandler from '@anu/components/QuizOptionsHandler';
import QuizTextAnswerHandler from '@anu/components/QuizTextAnswerHandler';
import Resource from '@anu/components/Resource';
import Text from '@anu/components/Text';
import ParagraphHighlightFullWidth from '@anu/components/ParagraphHighlightFullWidth';
import QuizScaleAdapter from '@anu/components/QuizScaleAdapter';
import ParagraphHighlightMarker from '@anu/components/ParagraphHighlightMarker';

export default {
  lesson_checklist: Checklist,
  lesson_divider: Divider,
  lesson_embedded_video: EmbeddedVideo,
  lesson_heading: Heading,
  lesson_highlight: ParagraphHighlightFullWidth,
  lesson_highlight_marker: ParagraphHighlightMarker,
  lesson_image: ImageWithCaption,
  lesson_image_bullet_list: ImageBulletList,
  lesson_image_thumbnail: ImageWithCaptionThumbnail,
  lesson_image_wide: ImageWideWithCaption,
  lesson_img_list: ImageBulletList,
  lesson_list: List,
  lesson_resource: Resource,
  lesson_text: Text,
  question_long_answer: QuizTextAnswerHandler,
  question_multi_choice: QuizOptionsHandler,
  question_scale: QuizScaleAdapter,
  question_short_answer: QuizTextAnswerHandler,
  question_single_choice: QuizOptionsHandler,
};
